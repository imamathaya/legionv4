import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Search } from "lucide-react";
import { Button } from "../src";

describe("Button states and composition", () => {
  it("blocks activation and announces a single persistent status while loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const button = screen.getByRole("button");
    const status = screen.getByRole("status");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(status).toHaveTextContent("Loading");
    expect(status).toHaveAttribute("role", "status");

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    expect(screen.getByRole("status")).toBe(status);
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("removes the status text when loading ends and keeps the button usable", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button loading>Saving</Button>);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");

    rerender(<Button onClick={onClick}>Save</Button>);
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(screen.getByRole("button")).not.toBeDisabled();
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses a custom loading label", () => {
    render(
      <Button loading loadingLabel="Memuat">
        Menyimpan
      </Button>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Memuat");
  });

  it("keeps loading and disabled inert together", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading disabled onClick={onClick}>
        Busy
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("renders an anchor with asChild and forwards link semantics", () => {
    render(
      <Button asChild>
        <a href="#docs">Read docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Read docs" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).toHaveAttribute("data-variant", "default");
    expect(link).toHaveAttribute("href", "#docs");
    expect(link.className).toContain("bg-primary");
  });

  it("disables an asChild anchor while loading and prevents navigation", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button asChild loading onClick={onClick}>
        <a href="https://example.com/blocked">Blocked</a>
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
    expect(document.location.href).not.toContain("example.com");
  });

  it("activates with Enter and Space", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Activate</Button>);
    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("forwards refs to the rendered element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Focusable</Button>);
    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it("names icon-only buttons through aria-label", () => {
    render(
      <Button size="sm" className="size-8" aria-label="Search">
        <Search aria-hidden="true" />
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("passes native attributes through unchanged", () => {
    render(
      <Button type="submit" form="settings" data-testid="submit" aria-describedby="hint">
        Save
      </Button>,
    );
    const button = screen.getByTestId("submit");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("form", "settings");
    expect(button).toHaveAttribute("aria-describedby", "hint");
  });
});
