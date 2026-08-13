import { describe, it, expect } from "vitest";
import { stripMarkdown } from "./text";

describe("stripMarkdown", () => {
  it("removes bold syntax", () => {
    expect(
      stripMarkdown("__Frontend & Content.__ Frustrationsfrei by Design."),
    ).toBe("Frontend & Content. Frustrationsfrei by Design.");
    expect(stripMarkdown("**Bold** text")).toBe("Bold text");
  });

  it("removes italic syntax", () => {
    expect(stripMarkdown("*italic* and _also italic_")).toBe(
      "italic and also italic",
    );
  });

  it("removes links but keeps the label", () => {
    expect(stripMarkdown("See the [contact form](/#contact) here")).toBe(
      "See the contact form here",
    );
  });

  it("removes inline code and strikethrough", () => {
    expect(stripMarkdown("Use `code` or ~~old~~ text")).toBe(
      "Use code or old text",
    );
  });

  it("leaves plain text untouched", () => {
    expect(stripMarkdown("Impressum | David Eiken")).toBe(
      "Impressum | David Eiken",
    );
  });
});
