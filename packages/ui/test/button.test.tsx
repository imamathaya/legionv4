import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "../src";

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost"] as const;
const SIZES = ["sm", "default", "lg"] as const;

describe("Button variant and size matrix", () => {
  for (const variant of VARIANTS) {
    for (const size of SIZES) {
      it(`renders ${variant}/${size} with token classes and data attributes`, () => {
        render(
          <Button variant={variant} size={size}>
            Label {variant} {size}
          </Button>,
        );
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-slot", "button");
        expect(button).toHaveAttribute("data-variant", variant);
        expect(button).toHaveAttribute("data-size", size);
        expect(button.className).toContain("rounded-md");
        expect(button.className).not.toMatch(/\[[^\]]+\]/);
        expect(button.className).not.toMatch(/#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(/i);

        const surface =
          variant === "default"
            ? "bg-primary"
            : variant === "secondary"
              ? "bg-secondary"
              : variant === "destructive"
                ? "bg-destructive"
                : null;
        if (surface) expect(button.className).toContain(surface);
        if (variant === "outline") expect(button.className).toContain("border-input");
        if (variant === "ghost") expect(button.className).toContain("bg-transparent");

        const spacing = size === "sm" ? "min-h-8" : size === "lg" ? "min-h-10" : "min-h-9";
        expect(button.className).toContain(spacing);
      });
    }
  }

  it("uses default variant and size when omitted", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("min-h-9");
  });

  it("lets className win over variant utilities", () => {
    render(<Button className="bg-accent">Custom</Button>);
    const button = screen.getByRole("button");
    const classes = button.className.split(/\s+/);
    expect(classes).toContain("bg-accent");
    expect(classes).not.toContain("bg-primary");
  });

  it("exposes buttonVariants for non-button elements", () => {
    const classes = buttonVariants({ variant: "outline", size: "lg" });
    expect(classes).toContain("border-input");
    expect(classes).toContain("min-h-10");
    expect(classes).not.toContain("undefined");
  });

  it("keeps long labels wrappable instead of clipping them", () => {
    render(<Button>A very long label that must wrap on narrow viewports</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("whitespace-normal");
    expect(button.className).not.toContain("overflow-hidden");
    expect(button.className).not.toContain("text-ellipsis");
  });
});
