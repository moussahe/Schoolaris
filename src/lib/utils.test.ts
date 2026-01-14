import { describe, it, expect } from "vitest";
import { cn, sanitizeHtml } from "./utils";

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

  describe("sanitizeHtml (XSS prevention)", () => {
    it("allows safe HTML tags", () => {
      const html = "<p>Hello <strong>World</strong></p>";
      const result = sanitizeHtml(html);

      expect(result).toBe("<p>Hello <strong>World</strong></p>");
    });

    it("strips script tags", () => {
      const html = '<p>Safe</p><script>alert("XSS")</script>';
      const result = sanitizeHtml(html);

      expect(result).not.toContain("<script>");
      expect(result).not.toContain("alert");
      expect(result).toContain("<p>Safe</p>");
    });

    it("strips style tags", () => {
      const html = "<style>body{display:none}</style><p>Content</p>";
      const result = sanitizeHtml(html);

      expect(result).not.toContain("<style>");
      expect(result).toContain("<p>Content</p>");
    });

    it("strips iframe tags", () => {
      const html = '<iframe src="https://evil.com"></iframe><p>Safe</p>';
      const result = sanitizeHtml(html);

      expect(result).not.toContain("<iframe>");
      expect(result).toContain("<p>Safe</p>");
    });

    it("strips form and input elements", () => {
      const html =
        '<form action="/steal"><input type="text"><button>Submit</button></form>';
      const result = sanitizeHtml(html);

      expect(result).not.toContain("<form>");
      expect(result).not.toContain("<input");
      expect(result).not.toContain("<button>");
    });

    it("strips dangerous event handlers", () => {
      const html = '<img src="x" onerror="alert(1)">';
      const result = sanitizeHtml(html);

      expect(result).not.toContain("onerror");
      expect(result).not.toContain("alert");
    });

    it("strips onclick handlers", () => {
      const html = '<div onclick="stealData()">Click me</div>';
      const result = sanitizeHtml(html);

      expect(result).not.toContain("onclick");
      expect(result).not.toContain("stealData");
    });

    it("strips onmouseover handlers", () => {
      const html = '<a onmouseover="hack()">Link</a>';
      const result = sanitizeHtml(html);

      expect(result).not.toContain("onmouseover");
    });

    it("allows safe image tags with src and alt", () => {
      const html = '<img src="https://example.com/img.jpg" alt="Test image">';
      const result = sanitizeHtml(html);

      expect(result).toContain('<img src="https://example.com/img.jpg"');
      expect(result).toContain('alt="Test image"');
    });

    it("allows anchor tags with safe attributes", () => {
      const html = '<a href="https://schoolaris.fr" title="Home">Link</a>';
      const result = sanitizeHtml(html);

      expect(result).toContain('href="https://schoolaris.fr"');
      expect(result).toContain('title="Home"');
    });

    it("allows code and pre tags for programming content", () => {
      const html = "<pre><code>function test() { return true; }</code></pre>";
      const result = sanitizeHtml(html);

      expect(result).toContain("<pre>");
      expect(result).toContain("<code>");
      expect(result).toContain("function test()");
    });

    it("allows table structure for data display", () => {
      const html =
        "<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>";
      const result = sanitizeHtml(html);

      expect(result).toContain("<table>");
      expect(result).toContain("<thead>");
      expect(result).toContain("<th>Header</th>");
      expect(result).toContain("<td>Data</td>");
    });

    it("prevents data attribute injection", () => {
      const html = '<div data-user-id="123" data-payload="evil">Content</div>';
      const result = sanitizeHtml(html);

      expect(result).not.toContain("data-user-id");
      expect(result).not.toContain("data-payload");
    });

    it("handles empty string", () => {
      expect(sanitizeHtml("")).toBe("");
    });

    it("handles plain text without tags", () => {
      const text = "Just plain text with no HTML";
      expect(sanitizeHtml(text)).toBe(text);
    });

    it("handles nested malicious content", () => {
      const html = "<div><p><script>evil()</script>Safe text</p></div>";
      const result = sanitizeHtml(html);

      expect(result).not.toContain("<script>");
      expect(result).toContain("Safe text");
    });

    it("handles unicode and special characters", () => {
      const html = "<p>Texte francais avec accents: cafe, ecole, lecon</p>";
      const result = sanitizeHtml(html);

      expect(result).toContain("cafe");
      expect(result).toContain("ecole");
      expect(result).toContain("lecon");
    });
  });
});
