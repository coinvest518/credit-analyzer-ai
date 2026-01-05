import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-white shadow hover:opacity-90",
        destructive: "text-white shadow-sm hover:opacity-90",
        outline: "border shadow-sm hover:opacity-90",
        secondary: "shadow-sm hover:opacity-80",
        ghost: "hover:opacity-80",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const variantStyles = {
      default: { backgroundColor: "hsl(84, 81%, 44%)", color: "white" },
      destructive: { backgroundColor: "hsl(0, 84%, 60%)", color: "white" },
      outline: { border: "1px solid hsl(120, 10%, 90%)", backgroundColor: "white", color: "hsl(160, 30%, 10%)" },
      secondary: { backgroundColor: "hsl(120, 10%, 95%)", color: "hsl(160, 30%, 20%)" },
      ghost: { backgroundColor: "transparent", color: "hsl(160, 30%, 10%)" },
      link: { backgroundColor: "transparent", color: "hsl(84, 81%, 44%)" },
    };
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...variantStyles[variant as keyof typeof variantStyles], ...style }}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
