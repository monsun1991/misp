import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          `
          flex h-10 w-full rounded-md 
          border border-[var(--input-border,rgba(0,0,0,0.1))] 
          bg-[var(--background)] 
          text-[var(--foreground)] 
          placeholder:text-[var(--muted-foreground)] 
          ring-offset-[var(--background)] 
          px-3 py-2 text-base 
          transition-all duration-200 
          focus-visible:outline-none 
          focus-visible:ring-2 
          focus-visible:ring-[var(--ring,#3b82f6)] 
          focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50 
          file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--foreground)]
          md:text-sm

          dark:border-[var(--primaryBorder)]
          dark:bg-[var(--primaryCardLight)]
          dark:text-[var(--foreground)]
          dark:placeholder:text-[var(--muted-foreground)]
          dark:ring-offset-[var(--background)]
          `,
          type === "number" && "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
