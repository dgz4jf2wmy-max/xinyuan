import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'danger' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[3px] text-[13px] transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-[#409eff] text-white hover:bg-[#66b1ff] border-none': variant === 'primary',
            'bg-white text-[#606266] border border-[#dcdfe6] hover:text-[#409eff] hover:border-[#c6e2ff] hover:bg-[#ecf5ff]': variant === 'default',
            'bg-[#fef0f0] text-[#f56c6c] border border-[#fbc4c4] hover:bg-[#f56c6c] hover:text-white': variant === 'danger',
            'border border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff]': variant === 'outline',
            'hover:bg-gray-100 text-[#606266]': variant === 'ghost',
            'h-8 px-4': size === 'default',
            'h-7 px-3 text-xs': size === 'sm',
            'h-9 px-6 text-[14px]': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
