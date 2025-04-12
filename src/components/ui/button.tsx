
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:shadow-md active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        salon: "bg-salon-500 text-white hover:bg-salon-600 shadow-sm",
        "salon-outline": "border border-salon-500 text-salon-500 hover:bg-salon-50 dark:hover:bg-salon-950/20",
        "salon-ghost": "text-salon-500 hover:bg-salon-50 dark:hover:bg-salon-950/20",
        professional: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm",
        "professional-outline": "border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
        "professional-ghost": "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
        service: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
        "service-outline": "border border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
        "service-ghost": "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
        success: "bg-green-500 text-white hover:bg-green-600 shadow-sm",
        "success-outline": "border border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20",
        warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
        "warning-outline": "border border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20",
        info: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm",
        "info-outline": "border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        shine: "animate-shine overflow-hidden relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shine_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
