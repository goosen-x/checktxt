"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group peer relative inline-flex h-[1.1em] w-[2.2em] shrink-0 items-center rounded-full border-2 border-border bg-[#e8e8e8] text-[17px] transition-all duration-150 outline-none cursor-pointer data-[state=checked]:bg-[#888] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none absolute block size-[1.1em] rounded-full border-2 border-border bg-[#e8e8e8] transition-all duration-150",
          "left-[-2px] shadow-[0_0.2em_0_var(--border)] -translate-y-[0.2em]",
          "group-hover:-translate-y-[0.3em] group-hover:shadow-[0_0.3em_0_var(--border)]",
          "data-[state=checked]:translate-x-[calc(2.2em-1.1em)] data-[state=checked]:-translate-y-[0.2em]",
          "group-hover:data-[state=checked]:-translate-y-[0.3em]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
