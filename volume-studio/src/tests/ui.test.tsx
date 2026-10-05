import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ResponsiveImage } from "../ui/components/ResponsiveImage";
import { ProjectCard } from "../ui/components/ProjectCard";
import { TextLink } from "../ui/components/TextLink";
import { SectionLabel } from "../ui/components/SectionLabel";
import { ServicesList } from "../ui/sections/ServicesList";
import { Process } from "../ui/sections/Process";
import { Hero } from "../ui/sections/Hero";
import { Header } from "../ui/layouts/Header";
import {
  useProjects,
  useProject,
  useArticle,
  useJournal,
  useServices,
  useMedia,
} from "../hooks/useContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSound } from "../hooks/useSound";
import { useContact } from "../hooks/useContact";
import { getProjects, getMedia } from "../services/content.service";
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);
describe("images and navigation primitives", () => {
  it("serves local responsive images with useful alternatives and priority only when requested", () => {
    const { container, rerender } = render(
      <ResponsiveImage media={getMedia("casa")} />,
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("width", "1920");
    expect(container.querySelector("source")).toHaveAttribute(
      "type",
      "image/avif",
    );
    expect(container.querySelector("source")?.getAttribute("srcset")).toContain(
      "casa-480.avif",
    );
    rerender(<ResponsiveImage media={getMedia("casa")} priority decorative />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(container.querySelector("img")).toHaveAttribute(
      "fetchpriority",
      "high",
    );
  });
  it("makes the complete project composition one descriptive link", () => {
    render(<ProjectCard project={getProjects()[0]} />, { wrapper });
    expect(screen.getByRole("link", { name: /CASA V01/ })).toHaveAttribute(
      "href",
      "/work/casa-v01",
    );
    expect(screen.getByRole("heading", { name: "CASA V01" })).toBeVisible();
    expect(screen.getByRole("img")).toHaveAccessibleName();
  });
  it("keeps link and section text readable without exposing decorative arrows", () => {
    render(
      <>
        <TextLink to="/work">All projects</TextLink>
        <SectionLabel number="03">Selected work</SectionLabel>
      </>,
      { wrapper },
    );
    expect(screen.getByRole("link", { name: "All projects" })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.getByText("Selected work")).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("opens and closes the mobile dialog", async () => {
    const user = userEvent.setup();
    render(<Header />, { wrapper });
    await user.click(screen.getByRole("button", { name: "MENU" }));
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByRole("button", { name: "MENU" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "CLOSE" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
describe("interactive compositions", () => {
  it("allows services to be expanded with a click and closed again", async () => {
    const user = userEvent.setup();
    render(<ServicesList />);
    const button = screen.getByRole("button", {
      name: /RESIDENTIAL INTERIORS/,
    });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Private residences")).toBeVisible();
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
  it("supports keyboard selection of process steps", () => {
    render(<Process />);
    const first = screen.getByRole("tab", { name: /OBSERVE/ });
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /DEFINE/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Find the essential idea",
    );
    fireEvent.keyDown(screen.getByRole("tab", { name: /DEFINE/ }), {
      key: "End",
    });
    expect(screen.getByRole("tab", { name: /REALIZE/ })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("tab", { name: /REALIZE/ }), {
      key: "Home",
    });
    expect(first).toHaveFocus();
  });
  it("allows manual project selection and pauses automatic rotation", async () => {
    const user = userEvent.setup();
    render(<Hero />, { wrapper });
    expect(
      screen.getByRole("button", { name: "Show CASA V01" }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.click(
      screen.getByRole("button", { name: "Show AXIS WORKSPACE" }),
    );
    expect(
      screen.getByRole("button", { name: "Show AXIS WORKSPACE" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("link", { name: /AXIS WORKSPACE/ }),
    ).toHaveAttribute("href", "/work/axis-workspace");
  });
});
describe("React-facing domain hooks", () => {
  it("updates filtered content and resolves related records", () => {
    const { result, rerender } = renderHook(
      ({ filter }: { filter: "All" | "Commercial" }) => useProjects(filter),
      { initialProps: { filter: "All" } },
    );
    expect(result.current).toHaveLength(4);
    rerender({ filter: "Commercial" });
    expect(result.current).toHaveLength(1);
    const detail = renderHook(() => ({
      project: useProject("north-house"),
      media: useMedia("axis"),
      journal: useJournal(),
      article: useArticle("objects-in-space"),
      services: useServices(),
    }));
    expect(detail.result.current.project.next.slug).toBe("casa-v01");
    expect(detail.result.current.article?.number).toBe("03");
  });
  it("reacts to a changed reduced-motion preference", () => {
    let matches = false;
    let listener = () => {};
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      media: query,
      get matches() {
        return matches;
      },
      onchange: null,
      addEventListener: (
        _type: string,
        fn: EventListenerOrEventListenerObject,
      ) => {
        listener = fn as () => void;
      },
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { result } = renderHook(useReducedMotion);
    expect(result.current).toBe(false);
    act(() => {
      matches = true;
      listener();
    });
    expect(result.current).toBe(true);
  });
  it("never starts sound until explicitly enabled, and can mute it", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const pause = vi.fn();
    const audio = vi.fn(function () {
      return { play, pause, currentTime: 0, volume: 0 };
    });
    vi.stubGlobal("Audio", audio);
    const { result, unmount } = renderHook(useSound);
    expect(result.current.enabled).toBe(false);
    expect(audio).not.toHaveBeenCalled();
    act(() => result.current.toggle());
    expect(play).toHaveBeenCalled();
    expect(result.current.enabled).toBe(true);
    act(() => result.current.toggle());
    expect(pause).toHaveBeenCalled();
    expect(result.current.enabled).toBe(false);
    unmount();
    vi.unstubAllGlobals();
  });
  it("exposes validation errors, clears edited fields and prepares a local brief", async () => {
    const { result } = renderHook(useContact);
    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.errors.name).toBeTruthy();
    act(() => result.current.change("name", "Alex Santos"));
    expect(result.current.errors.name).toBeUndefined();
    act(() => {
      result.current.change("email", "alex@example.com");
      result.current.change("type", "Residential");
      result.current.change("location", "Cebu");
      result.current.change("message", "A quiet home near the sea.");
    });
    await act(async () => {
      await result.current.submit();
    });
    await waitFor(() =>
      expect(result.current.brief?.filename).toBe("volume-project-brief.txt"),
    );
    expect(result.current.busy).toBe(false);
  });
});
