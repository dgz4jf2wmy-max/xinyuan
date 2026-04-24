import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-[3px] border border-[#dcdfe6] bg-white px-3 py-1 text-[13px] text-[#606266] transition-colors file:border-0 file:bg-transparent file:text-[13px] file:font-medium placeholder:text-[#c0c4cc] focus-visible:outline-none focus-visible:border-[#409eff] disabled:cursor-not-allowed disabled:bg-[#f5f7fa] disabled:text-[#c0c4cc]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
