import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100": variant === "default",
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400": variant === "success",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400": variant === "warning",
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400": variant === "error",
          "border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200": variant === "outline",
        },
        className,
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
