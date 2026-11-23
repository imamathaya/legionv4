"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "../../lib/utils";

/** Visual styles available for Button. */
export const buttonVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 whitespace-normal rounded-md text-center text-sm font-medium transition outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:animate-none forced-colors:outline",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        destructive:
          "bg-destructive text-destructive-foreground hover:shadow-sm active:shadow-none",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
      },
      size: {
        sm: "min-h-8 gap-1.5 px-3 text-sm",
        default: "min-h-9 px-4 text-sm",
        lg: "min-h-10 gap-2 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Control size. */
  size?: ButtonSize;
  /** Renders the single child element instead of a native button. */
  asChild?: boolean;
  /** Blocks activation and exposes a busy state while true. */
  loading?: boolean;
  /** Screen-reader text announced once while loading is true. */
  loadingLabel?: string;
  /** Extra classes merged after variant classes. */
  className?: string;
};

function assignRef<T>(target: React.ForwardedRef<T>, value: T | null): void {
  if (typeof target === "function") {
    target(value);
  } else if (target) {
    target.current = value;
  }
}

/** A token-driven action control with five variants, three sizes, and six states. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "default",
    size = "default",
    asChild = false,
    loading = false,
    loadingLabel = "Loading",
    disabled = false,
    onClick,
    children,
    tabIndex,
    "aria-busy": ariaBusy,
    "aria-disabled": ariaDisabled,
    ...props
  },
  forwardedRef,
) {
  const Root = asChild ? Slot : "button";
  const inert = disabled || loading;
  const localRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const element = localRef.current;
    if (!element) return;
    const labelled =
      element.getAttribute("aria-label") || element.getAttribute("aria-labelledby");
    const visibleText = (element.textContent ?? "").trim();
    if (!labelled && visibleText.length === 0) {
      console.warn(
        "Button: icon-only buttons need an accessible name (aria-label or aria-labelledby).",
      );
    }
  }, [children, props["aria-label"], props["aria-labelledby"]]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (inert) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <>
      <Root
        {...props}
        ref={(node: HTMLButtonElement | null) => {
          localRef.current = node;
          assignRef(forwardedRef, node);
        }}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading ? true : ariaBusy}
        aria-disabled={asChild && inert ? true : ariaDisabled}
        disabled={asChild ? undefined : inert}
        tabIndex={asChild && inert ? -1 : tabIndex}
        onClick={handleClick}
      >
        {loading ? (
          <LoaderCircle
            aria-hidden="true"
            data-slot="button-spinner"
            className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
          />
        ) : null}
        <Slottable>{children}</Slottable>
      </Root>
      <span role="status" className="sr-only">
        {loading ? loadingLabel : null}
      </span>
    </>
  );
});

Button.displayName = "Button";
