import * as React from "react";
import { cn } from "../../lib/utils";
import { Input, InputProps } from "./input";

export interface AutoCompleteProps extends Omit<InputProps, 'options'> {
  options: { label: string; value: string }[];
  onSelect?: (value: string) => void;
}

export const AutoComplete = React.forwardRef<HTMLInputElement, AutoCompleteProps>(
  ({ className, options, value, onChange, onSelect, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
      if (onSelect) onSelect(val);
      setIsOpen(false);
    };

    return (
      <div className={cn("relative w-full", className)} ref={containerRef}>
        <Input
          ref={ref}
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          {...props}
        />
        {isOpen && options.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#e4e7ed] rounded-[2px] shadow-md max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <div
                key={opt.value}
                className="px-3 py-2 text-[13px] text-[#606266] cursor-pointer hover:bg-[#f5f7fa] transition-colors"
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
AutoComplete.displayName = "AutoComplete";
