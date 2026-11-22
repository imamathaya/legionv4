import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/components/ui/button";

describe("Button states", () => {
  it("is keyboard activatable with Enter and Space", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Action</Button>);
    const button = screen.getByRole("button", { name: "Action" });

    button.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not activate when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Action
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Action" })).toBeDisabled();
  });

  it("announces loading once and blocks activation", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <Button loading loadingLabel="Saving" onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: /Save/ });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("Saving");

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();

    rerender(<Button onClick={onClick}>Save</Button>);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("renders a child element with asChild and keeps link semantics", () => {
    render(
      <Button asChild>
        <a href="/docs">Read docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Read docs" });
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link.className).toContain("bg-primary");
  });

  it("blocks and disables an asChild link while loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button asChild loading loadingLabel="Opening" onClick={onClick}>
        <a href="/docs">Read docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /Read docs/ });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
