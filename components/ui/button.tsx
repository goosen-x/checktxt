import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-base text-sm font-bold transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground",
        destructive: "bg-destructive text-white",
        outline: "bg-background text-foreground",
        secondary: "bg-secondary-background text-foreground",
        ghost: "border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-accent/20",
        link: "text-foreground underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-base gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-base px-8 has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
