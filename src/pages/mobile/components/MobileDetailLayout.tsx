import React from "react";
import { X } from "lucide-react";

export function MobileDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-slate-50 font-sans text-slate-800 flex flex-col w-full max-w-md mx-auto relative z-20">
      <div className="flex-1 overflow-y-auto pb-8">
        {children}
      </div>
    </div>
  );
}

export function MobileDetailInfoCard({
  icon,
  title,
  subtitle,
  rightContent,
  children,
  footerContent,
  isCollapsible = false,
  defaultCollapsed = false
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <div className="bg-white m-3 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
      <div 
        className={`px-4 py-3.5 border-b border-slate-50 flex items-center justify-between ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center">
          {icon && <div className="mr-2 text-blue-600 flex items-center">{icon}</div>}
          <div className="flex items-baseline gap-2">
            <span className="text-[16px] font-black text-slate-900 tracking-tight">
              {title}
            </span>
            {subtitle && (
              <span className="text-[12px] text-[#909399] font-normal">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rightContent && <div>{rightContent}</div>}
          {isCollapsible && (
            <div className="text-slate-400">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
              >
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      {!isCollapsed && (
        <>
          <div className="px-4 py-4 grid grid-cols-2 gap-y-3 gap-x-4">
            {children}
          </div>
          {footerContent && (
            <div className="px-4 py-4 bg-slate-50/50 border-t border-slate-50">
              {footerContent}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function MobileDetailInfoField({
  label,
  value,
  isFullWidth,
  isTextArea,
  valueClass = ""
}: {
  label: string;
  value: React.ReactNode;
  isFullWidth?: boolean;
  isTextArea?: boolean;
  valueClass?: string;
}) {
  return (
    <div className={`flex flex-col ${isFullWidth ? 'col-span-2' : ''} ${isTextArea ? 'pt-2 mt-1 border-t border-dashed border-slate-100' : ''}`}>
      <span className="text-[10px] text-slate-400 mb-0.5">{label}</span>
      <span className={`text-[13px] ${isTextArea ? 'font-medium leading-relaxed whitespace-pre-wrap' : 'font-medium font-mono'} text-slate-700 ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

export function MobileDetailSection({
  title,
  count,
  children
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-3 mt-5">
      <div className="flex items-center mb-3 px-1">
        <div className="w-1 h-3.5 bg-blue-600 rounded-sm mr-2"></div>
        <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>
        {count !== undefined && (
          <span className="ml-2 text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
            {count}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

export function MobileDetailLogItem({
  title,
  titleIcon,
  rightTitle,
  children,
  footerLeft,
  footerLeftIcon,
  footerRight,
  footerRightIcon,
}: {
  title: React.ReactNode;
  titleIcon?: React.ReactNode;
  rightTitle?: React.ReactNode;
  children?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerLeftIcon?: React.ReactNode;
  footerRight?: React.ReactNode;
  footerRightIcon?: React.ReactNode;
}) {
  return (
    <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 flex flex-col active:bg-slate-50 transition-colors">
      <div className="flex justify-between items-start mb-2.5">
        <div className="flex items-center">
          {titleIcon && <div className="text-slate-400 mr-1.5 flex items-center">{titleIcon}</div>}
          <div className="text-[13px] font-bold font-mono text-slate-800">{title}</div>
        </div>
        <div>
          {rightTitle}
        </div>
      </div>
      {children && (
        <div className="bg-slate-50 rounded-lg p-2 mb-3 border border-slate-100 w-full text-[12px] text-slate-600">
          {children}
        </div>
      )}
      {(footerLeft || footerRight) && (
        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          {footerLeft && (
            <div className="flex items-center text-[11px] text-slate-500">
              {footerLeftIcon && <div className="mr-1 text-slate-400 flex items-center">{footerLeftIcon}</div>}
              {footerLeft}
            </div>
          )}
          {footerRight && (
            <div className="flex items-center text-[11px] text-slate-400 font-mono">
              {footerRightIcon && <div className="mr-1 text-slate-300 flex items-center">{footerRightIcon}</div>}
              {footerRight}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  titleIcon,
  children,
  className = "p-5"
}: {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl w-full flex flex-col safe-area-pb"
        style={{ maxHeight: "85vh", animation: "slideUp 0.3s ease-out" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
            {titleIcon && <div className="text-blue-500 flex items-center">{titleIcon}</div>}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`overflow-y-auto flex-1 flex flex-col gap-4 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
