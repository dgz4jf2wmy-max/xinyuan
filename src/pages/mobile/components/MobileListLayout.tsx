import React from "react";

interface MobileListLayoutProps {
  title?: string;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export function MobileListLayout({ headerContent, children }: MobileListLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-white relative z-20">
      {/* Optional Top Content (Tabs, Search) */}
      {headerContent && (
        <div className="shrink-0 z-10 sticky top-0 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          {headerContent}
        </div>
      )}

      {/* List Container */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-col pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export function MobileListItem({ onClick, children }: { onClick?: () => void, children: React.ReactNode }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 border-b border-[#ebeef5] flex flex-col bg-white active:bg-slate-50 transition-colors cursor-pointer"
    >
      {children}
    </div>
  );
}
