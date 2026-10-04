import { describe, it, expect, vi } from "vitest";
import { validateInquiry, prepareInquiry } from "../services/contact.service";
import { emptyInquiry } from "../constants/inquiry";
import { contactRepository } from "../repositories/contact.repository";
import type { Inquiry } from "../types/content";
const valid: Inquiry = {
  name: "Alex Santos",
  email: "alex@example.com",
  type: "Residential",
  location: "Cebu",
  size: "320",
  message: "A quiet home with a courtyard.",
};
describe("inquiry validation and preparation", () => {
  it("requires meaningful contact and project information", () => {
    expect(Object.keys(validateInquiry(emptyInquiry))).toEqual([
      "name",
      "email",
      "type",
      "location",
      "message",
    ]);
  });
  it("accepts valid information and optional size", () => {
    expect(validateInquiry(valid)).toEqual({});
    expect(validateInquiry({ ...valid, size: "" })).toEqual({});
    expect(validateInquiry({ ...valid, size: "32.5" })).toEqual({});
  });
  it.each(["zero", "0", "-2", "1000001", "Infinity"])(
    "rejects invalid area %s",
    (size) => {
      expect(validateInquiry({ ...valid, size }).size).toBeDefined();
    },
  );
  it.each(["a", "a".repeat(101)])("rejects invalid names", (name) => {
    expect(validateInquiry({ ...valid, name }).name).toBeDefined();
  });
  it.each(["invalid", "a".repeat(250) + "@x.com"])(
    "rejects invalid emails",
    (email) => {
      expect(validateInquiry({ ...valid, email }).email).toBeDefined();
    },
  );
  it.each(["a", "a".repeat(151)])("rejects invalid locations", (location) => {
    expect(validateInquiry({ ...valid, location }).location).toBeDefined();
  });
  it.each(["short", "a".repeat(3001)])(
    "rejects invalid messages",
    (message) => {
      expect(validateInquiry({ ...valid, message }).message).toBeDefined();
    },
  );
  it("rejects unknown project types", () => {
    expect(validateInquiry({ ...valid, type: "Hidden" }).type).toBeDefined();
  });
  it("does not call the adapter for invalid input", async () => {
    const prepare = vi.fn();
    expect((await prepareInquiry(emptyInquiry, { prepare })).ok).toBe(false);
    expect(prepare).not.toHaveBeenCalled();
  });
  it("normalizes values before handing off to an injected provider", async () => {
    const prepare = vi
      .fn()
      .mockResolvedValue({ filename: "brief.txt", content: "brief" });
    const result = await prepareInquiry(
      { ...valid, name: " Alex Santos ", email: " alex@example.com " },
      { prepare },
    );
    expect(result.ok).toBe(true);
    expect(prepare).toHaveBeenCalledWith(valid);
  });
  it("returns a readable local brief without claiming delivery", async () => {
    const result = await prepareInquiry(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.brief.content).toContain("320");
      expect(result.brief.content).toContain("has not been sent");
    }
    expect(
      (await contactRepository.prepare({ ...valid, size: "" })).content,
    ).toContain("To be discussed");
  });
  it("propagates provider errors for the hook to handle", async () => {
    await expect(
      prepareInquiry(valid, {
        prepare: async () => {
          throw new Error("offline");
        },
      }),
    ).rejects.toThrow("offline");
  });
});
