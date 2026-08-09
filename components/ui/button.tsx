import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/useTheme"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm  font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border",
  {
    variants: {
      variant: {
        default: "bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:brightness-95 hover:shadow-sm active:scale-98",
        primary: "bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:brightness-95 hover:shadow-sm active:scale-98",
        secondary: "bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:brightness-95 hover:shadow-sm active:scale-98",
        outline: "bg-transparent text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-text)]/5 active:scale-98",
        ghost: "bg-transparent text-[var(--btn-text)] border-transparent hover:bg-[var(--btn-text)]/5 active:scale-98",
        link: "bg-transparent text-[var(--btn-text)] border-transparent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "h-9 px-4 py-2 has-[>svg]:px-3",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        small: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        medium: "h-9 px-4 py-2 has-[>svg]:px-3",
        large: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, isLoading = false, disabled, style, children, ...props }, ref) => {
    const theme = useTheme()
    const Comp = asChild ? Slot : "button"

    // Dynamically calculate colors from useTheme() to avoid hardcoding
    let btnBg = "transparent"
    let btnText = theme.textColor
    let btnBorder = "transparent"

    const actualVariant = variant || "default"

    if (actualVariant === "default" || actualVariant === "primary") {
      btnBg = theme.buttonColor || theme.primaryColor
      btnText = "#ffffff" // white for high contrast on primary
      btnBorder = theme.buttonColor || theme.primaryColor
    } else if (actualVariant === "secondary") {
      btnBg = theme.secondaryColor
      btnText = "#ffffff" // white for secondary
      btnBorder = theme.secondaryColor
    } else if (actualVariant === "outline") {
      btnBg = "transparent"
      btnText = theme.primaryColor
      btnBorder = theme.primaryColor
    } else if (actualVariant === "ghost" || actualVariant === "link") {
      btnBg = "transparent"
      btnText = theme.primaryColor
      btnBorder = "transparent"
    }

    const dynamicStyles = {
      "--btn-bg": btnBg,
      "--btn-text": btnText,
      "--btn-border": btnBorder,
      ...style,
    } as React.CSSProperties

    return (
      <Comp
        className={cn(buttonVariants({ variant: actualVariant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        style={dynamicStyles}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

