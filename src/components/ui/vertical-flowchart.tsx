import React from 'react';
import clsx from 'clsx';

export interface FlowStep {
  id: string | number;
  title: string;
  isActive?: boolean;
}

const FlowNode = ({ title, isActive }: { title: string, isActive?: boolean }) => (
  <div className={clsx(
    "w-[160px] h-[72px] bg-white rounded border flex items-center justify-center relative shadow-sm box-border",
    isActive ? "border-[2px] border-[#f56c6c]" : "border-[#dcdfe6]"
  )}>
    <div className="absolute top-1.5 left-1.5 text-[#d4b172]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
    <span className="text-[14px] font-bold text-[#303133] mt-[8px] text-center px-4 leading-tight">{title}</span>
  </div>
);

const FlowArrow = () => (
  <div className="flex flex-col items-center">
    <svg width="12" height="40" viewBox="0 0 12 40" fill="none">
      <path d="M6 0L6 34" stroke="#a8abb2" strokeWidth="1.5" />
      <polygon points="6,40 2,32 10,32" fill="#a8abb2" />
    </svg>
  </div>
);

export function VerticalFlowchart({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="w-full min-h-full flex justify-center bg-white py-12">
      <div className="flex flex-col items-center">
        {/* 起始圆点 */}
        <div className="w-9 h-9 rounded-full border border-[#909399] bg-white z-10 shrink-0"></div>
        
        {steps.map((step) => (
          <React.Fragment key={step.id}>
            <FlowArrow />
            <FlowNode title={step.title} isActive={step.isActive} />
          </React.Fragment>
        ))}
        
        {/* 结束圆点 */}
        <FlowArrow />
        <div className="w-9 h-9 rounded-full border-[3px] border-[#606266] bg-white z-10 shrink-0"></div>
      </div>
    </div>
  );
}
