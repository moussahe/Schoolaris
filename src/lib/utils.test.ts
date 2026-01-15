import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("Utils Library", () => {
  describe("cn (className merger)", () => {
    it("merges multiple class names", () => {
      const result = cn("px-4", "py-2", "bg-blue-500");

      expect(result).toBe("px-4 py-2 bg-blue-500");
    });

    it("handles conditional classes", () => {
      const isActive = true;
      const result = cn("btn", isActive && "btn-active");

      expect(result).toBe("btn btn-active");
    });

    it("removes falsy values", () => {
      const result = cn("btn", false, null, undefined, "btn-primary");

      expect(result).toBe("btn btn-primary");
    });

    it("merges conflicting tailwind classes (last wins)", () => {
      const result = cn("px-2", "px-4");

      expect(result).toBe("px-4");
    });

    it("handles array of classes", () => {
      const result = cn(["flex", "items-center"]);

      expect(result).toBe("flex items-center");
    });

    it("handles object notation", () => {
      const result = cn({
        "bg-red-500": true,
        "bg-blue-500": false,
        "text-white": true,
      });

      expect(result).toBe("bg-red-500 text-white");
    });

    it("handles empty inputs", () => {
      expect(cn()).toBe("");
      expect(cn("")).toBe("");
    });

    it("handles complex responsive classes", () => {
      const result = cn("p-2 md:p-4 lg:p-6", "p-8");

      // tw-merge should replace p-2 with p-8 but keep responsive variants
      expect(result).toContain("md:p-4");
      expect(result).toContain("lg:p-6");
    });
  });

  // Note: sanitizeHtml tests moved to client-side testing only
  // as it requires browser DOM (DOMPurify)
});
