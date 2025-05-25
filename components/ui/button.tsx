import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm": variant === "primary",
            "bg-white/20 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 text-gray-800 dark:text-white hover:bg-white/30 dark:hover:bg-gray-800/30":
              variant === "secondary",
            "border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200":
              variant === "outline",
            "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200":
              variant === "ghost",
            "bg-transparent underline-offset-4 hover:underline text-blue-500 hover:text-blue-600": variant === "link",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3 text-xs": size === "sm",
            "h-11 px-8": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className,
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button }
