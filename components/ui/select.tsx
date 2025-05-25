import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-xl border border-input px-3 py-2 text-sm appearance-none",
        "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "glass-input backdrop-blur-md border-gray-200/30 dark:border-gray-700/30",
        "bg-white/20 dark:bg-gray-800/20",
        "transition-all duration-200 pr-10",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = "Select"

const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("p-1.5 font-medium [&[aria-disabled=true]]:opacity-50 [&:not(:first-child)]:mt-1", className)}
      ref={ref}
      {...props}
    />
  ),
)
SelectGroup.displayName = "SelectGroup"

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-input px-3 py-2 text-sm",
        "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "glass-input backdrop-blur-md border-gray-200/30 dark:border-gray-700/30",
        "bg-white/20 dark:bg-gray-800/20",
        "transition-all duration-200",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  ),
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => <span className={cn("line-clamp-1 text-left", className)} ref={ref} {...props} />,
)
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:translate-x-1 data-[side=right]:-translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
)
SelectContent.displayName = "SelectContent"

const SelectLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label className={cn("px-2 py-1.5 text-sm font-semibold", className)} ref={ref} {...props} />
  ),
)
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
)
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn("-mx-1 my-1 h-px bg-muted", className)} ref={ref} {...props} />,
)
SelectSeparator.displayName = "SelectSeparator"

const SelectScrollUpButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex items-center justify-center h-6 cursor-default", className)} ref={ref} {...props} />
  ),
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex items-center justify-center h-6 cursor-default", className)} ref={ref} {...props} />
  ),
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"

export {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
