import { useRef } from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHeroCarousel } from "../hooks/useHeroCarousel";
import { useHeroIntro } from "../hooks/useHeroIntro";
import {
  HERO_HOLD_MS,
  HERO_INTRO_MS,
  HERO_TRANSITION_MS,
} from "../constants/motion";
import { ProcessDiagram } from "../ui/components/ProcessDiagram";

let intersection: IntersectionObserverCallback;
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersection = callback;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const tick = (milliseconds: number) =>
  act(() => vi.advanceTimersByTime(milliseconds));
const reference = () => ({ current: document.createElement("section") });
const intersect = (visible: boolean) =>
  act(() =>
    intersection(
      [{ isIntersecting: visible } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );

describe("hero automatic sequence", () => {
  it("waits for the entrance, cycles slides and retains the previous media through the transition", () => {
    const ref = reference();
    const { result, rerender } = renderHook(
      ({ ready }) => useHeroCarousel(4, ref, ready),
      { initialProps: { ready: false } },
    );
    tick(HERO_HOLD_MS * 2);
    expect(result.current.index).toBe(0);
    rerender({ ready: true });
    tick(HERO_HOLD_MS);
    expect(result.current.index).toBe(1);
    expect(result.current.previous).toBe(0);
    tick(HERO_TRANSITION_MS);
    expect(result.current.previous).toBeNull();
  });
  it("pauses for manual selection, supports explicit resume, and wraps to the first project", () => {
    const { result } = renderHook(() => useHeroCarousel(4, reference(), true));
    act(() => result.current.select(3));
    expect(result.current.paused).toBe(true);
    tick(HERO_HOLD_MS * 2);
    expect(result.current.index).toBe(3);
    act(() => result.current.toggle());
    tick(HERO_HOLD_MS);
    expect(result.current.index).toBe(0);
  });
  it("suspends offscreen and hidden-tab timers and cleans up on unmount", () => {
    const ref = reference();
    const { result, unmount } = renderHook(() => useHeroCarousel(4, ref, true));
    intersect(false);
    tick(HERO_HOLD_MS * 2);
    expect(result.current.index).toBe(0);
    intersect(true);
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    tick(HERO_HOLD_MS * 2);
    expect(result.current.index).toBe(0);
    hidden.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    tick(HERO_HOLD_MS);
    expect(result.current.index).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("pauses while the user is hovering over the slideshow controls", () => {
    const { result } = renderHook(() => useHeroCarousel(4, reference(), true));
    act(() => result.current.setHoveringControls(true));
    tick(HERO_HOLD_MS);
    expect(result.current.index).toBe(0);
    act(() => result.current.setHoveringControls(false));
    tick(HERO_HOLD_MS);
    expect(result.current.index).toBe(1);
  });
  it("does not auto-advance with reduced motion, while manual controls still work", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { result } = renderHook(() => useHeroCarousel(4, reference(), true));
    tick(HERO_HOLD_MS * 2);
    expect(result.current.index).toBe(0);
    act(() => result.current.select(2));
    expect(result.current.index).toBe(2);
    expect(result.current.playing).toBe(false);
  });
});

describe("hero image-first entrance", () => {
  function Entrance() {
    const ref = useRef<HTMLElement>(null);
    const { phase } = useHeroIntro(ref);
    return (
      <section ref={ref} data-testid="intro" data-phase={phase}>
        <div data-hero-initial>
          <img src="/first.webp" alt="First" />
          <img src="/second.webp" alt="Second" />
        </div>
      </section>
    );
  }
  it("waits for both initial media, then completes the sequenced entrance", async () => {
    render(<Entrance />);
    fireEvent.load(screen.getByAltText("First"));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByTestId("intro")).toHaveAttribute(
      "data-phase",
      "waiting",
    );
    fireEvent.load(screen.getByAltText("Second"));
    await act(async () => {
      await Promise.resolve();
    });
    tick(20);
    expect(screen.getByTestId("intro")).toHaveAttribute(
      "data-phase",
      "entering",
    );
    tick(HERO_INTRO_MS);
    expect(screen.getByTestId("intro")).toHaveAttribute("data-phase", "ready");
  });
  it("does not leave content hidden when an image request stalls", () => {
    render(<Entrance />);
    tick(1520);
    expect(screen.getByTestId("intro")).toHaveAttribute(
      "data-phase",
      "entering",
    );
    tick(HERO_INTRO_MS);
    expect(screen.getByTestId("intro")).toHaveAttribute("data-phase", "ready");
  });
});

it("gives Shape and Realize distinct, meaningful drawings", () => {
  const { container, rerender } = render(<ProcessDiagram stage={2} />);
  expect(
    screen.getByRole("img", { name: /Shape: floor, wall and roof/ }),
  ).toBeInTheDocument();
  const shape = container.innerHTML;
  rerender(<ProcessDiagram stage={3} />);
  expect(
    screen.getByRole("img", { name: /Realize: a completed interior/ }),
  ).toBeInTheDocument();
  expect(container.innerHTML).not.toBe(shape);
  expect(container.querySelector(".realize-furniture")).toBeInTheDocument();
});
