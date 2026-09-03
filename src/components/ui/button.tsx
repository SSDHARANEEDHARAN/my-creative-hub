import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1",
        destructive: "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 hover:-translate-y-1",
        outline: "border-border bg-transparent hover:bg-muted hover:border-primary hover:-translate-y-1",
        secondary: "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80 hover:-translate-y-1",
        ghost: "hover:bg-muted hover:text-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
        hero: "bg-gradient-to-r from-primary to-accent text-primary-foreground border-primary font-bold hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-2 button-glow",
        heroOutline: "border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-2",
        accent: "bg-gradient-to-r from-accent to-primary text-accent-foreground border-accent font-bold hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-2",
        glass: "bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card hover:border-primary",
        neon: "bg-transparent border-primary text-primary relative overflow-hidden hover:text-primary-foreground before:absolute before:inset-0 before:bg-primary before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100 [&>*]:relative [&>*]:z-10 hover:-translate-y-1",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };