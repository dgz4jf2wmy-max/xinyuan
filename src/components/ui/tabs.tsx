import * as React from "react"
import { cn } from "../../lib/utils"

type TabsVariant = 'line' | 'card'

const TabsContext = React.createContext<{
  activeTab?: string;
  onTabChange?: (val: string) => void;
  variant: TabsVariant;
}>({ variant: 'line' });

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    variant?: TabsVariant;
  }
>(({ className, value, onValueChange, defaultValue, variant = 'line', children, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange, variant }}>
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TabsContext);
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex w-full items-center justify-start border-b border-[#ebeef5] bg-transparent p-0 text-gray-500",
        variant === 'card' && "h-12 bg-[#f5f7fa] bg-opacity-70 rounded-t-sm",
        variant === 'line' && "h-10",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; }
>(({ className, value, ...props }, ref) => {
  const { activeTab, onTabChange, variant } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onTabChange && onTabChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm flex-shrink-0 transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
        // Card Variant (Image 1 style)
        variant === 'card' && [
          "px-6 h-12 border-r border-[#ebeef5] translate-y-[1px]",
          isActive 
            ? "bg-white text-[#409eff] border-t-2 border-t-[#409eff] border-b-white z-10 font-semibold shadow-[0_-2px_0_0_#409eff]" 
            : "text-[#909399] hover:text-[#409eff] border-t-2 border-t-transparent border-b-transparent"
        ],
        // Line Variant (Optimized for Lists)
        variant === 'line' && [
          "px-8 h-10 font-medium",
          isActive
            ? "text-[#409eff] font-bold after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[3px] after:bg-[#409eff] after:content-['']"
            : "text-[#606266] hover:text-[#409eff]"
        ],
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; }
>(({ className, value, ...props }, ref) => {
  const { activeTab } = React.useContext(TabsContext);
  if (value !== activeTab) return null;
  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-0 ring-offset-white focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
