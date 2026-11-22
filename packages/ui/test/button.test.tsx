import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "../src/components/ui/button";

const variants = ["default", "secondary", "destructive", "outline", "ghost"] as const;
const sizes = ["sm", "default", "lg"] as const;

describe("Button matrix", () => {
  it.each(variants)("renders the %s variant with its token classes", (variant) => {
    render(<Button variant={variant}>Action</Button>);
    const button = screen.getByRole("button", { name: "Action" });
    expect(button).toHaveAttribute("data-variant", variant);
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button.className).toContain("rounded-md");
    expect(button.className).not.toMatch(/#[0-9a-f]{3,8}|rgb\(|hsl\(|oklch\(/i);
  });

  it.each(sizes)("renders the %s size with a target of at least 24px", (size) => {
    render(<Button size={size}>Action</Button>);
    const button = screen.getByRole("button", { name: "Action" });
    expect(button).toHaveAttribute("data-size", size);
    expect(button.className).toMatch(/min-h-(8|9|10)/);
  });

  it("exposes the same variants through buttonVariants", () => {
    expect(buttonVariants({ variant: "outline", size: "lg" })).toContain("border-input");
    expect(buttonVariants()).toContain("bg-primary");
  });

  it("forwards a ref to the native button", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Action</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
