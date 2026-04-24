import * as React from "react"
import { cn } from "../../lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string | number }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-8 w-full rounded-[3px] border border-[#dcdfe6] bg-white px-3 py-1 text-[13px] text-[#606266] transition-colors focus-visible:outline-none focus-visible:border-[#409eff] disabled:cursor-not-allowed disabled:bg-[#f5f7fa] disabled:text-[#c0c4cc]",
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="" disabled>请选择</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
