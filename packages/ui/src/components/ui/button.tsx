"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-2 rounded-md text-center font-medium break-words whitespace-normal transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        destructive: "bg-destructive text-destructive-foreground hover:shadow-sm active:shadow-none",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
      },
      size: {
        sm: "min-h-8 gap-1.5 px-3 py-1.5 text-sm",
        default: "min-h-9 px-4 py-2 text-sm",
        lg: "min-h-10 px-6 py-2.5 text-base",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Control size. */
  size?: ButtonSize;
  /** Extra classes merged after the variant classes. */
  className?: string;
  /** Renders the child element instead of a button while keeping button styles and accessibility attributes. */
  asChild?: boolean;
  /** Disables activation and announces a busy state to assistive technology. */
  loading?: boolean;
  /** Screen-reader status text used while loading is true. */
  loadingLabel?: string;
}

function containsReadableText(node: React.ReactNode): boolean {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim().length > 0;
  }
  if (Array.isArray(node)) {
    return node.some(containsReadableText);
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return containsReadableText(node.props.children);
  }
  return false;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    asChild = false,
    loading = false,
    loadingLabel = "Loading",
    className,
    children,
    onClick,
    disabled,
    tabIndex,
    ...props
  },
  ref,
) {
  const isDisabled = Boolean(disabled || loading);
  const Component = asChild ? Slot : "button";

  if (
    process.env.NODE_ENV !== "production" &&
    !containsReadableText(children) &&
    !props["aria-label"] &&
    !props["aria-labelledby"]
  ) {
    console.warn("Legion Button: provide aria-label or aria-labelledby for icon-only buttons.");
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <Component
      ref={ref}
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      aria-busy={loading ? true : undefined}
      aria-disabled={asChild && isDisabled ? true : undefined}
      disabled={asChild ? undefined : isDisabled}
      tabIndex={asChild && isDisabled ? -1 : tabIndex}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    >
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : null}
      {loading ? (
        <span role="status" className="sr-only">
          {loadingLabel}
        </span>
      ) : null}
      {asChild ? <Slottable>{children}</Slottable> : children}
    </Component>
  );
});

Button.displayName = "Button";
