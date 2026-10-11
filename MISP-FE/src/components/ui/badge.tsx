import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-card text-primaryText hover:bg-card/80 hover:opacity-90",
        secondary:
          "border-transparent bg-card text-primaryText hover:bg-card/80 hover:opacity-90",
        destructive:
          "border-transparent bg-destructive text-primaryText hover:bg-destructive/80",
        outline: "text-primaryText border-primaryBorder",
        card: "bg-card text-primaryText border-border hover:bg-card/80 hover:opacity-90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
