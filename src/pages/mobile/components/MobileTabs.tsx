import React from "react";

export interface MobileTabItem {
  key: string;
  label: string;
}

export interface MobileTabsProps {
  tabs: MobileTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function MobileTabs({ tabs, activeKey, onChange }: MobileTabsProps) {
  return (
    <div className="flex w-full bg-white border-b border-slate-100">
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            className={`flex-1 py-3 text-[14px] font-medium text-center relative transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500'
            }`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
            {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-t-full"></div>}
          </button>
        );
      })}
    </div>
  );
}
