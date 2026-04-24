import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ApprovalProcessInfo } from '../../types/plan';
import { cn } from '../../lib/utils';

interface ApprovalProcessTimelineProps {
  data: ApprovalProcessInfo[];
}

export function ApprovalProcessTimeline({ data }: ApprovalProcessTimelineProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-8">
      <div 
        className="text-[13px] text-[#303133] mb-4 flex items-center justify-between cursor-pointer group"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span>过程审批信息(点击可以查看明细)</span>
        <ChevronDown className={cn("w-4 h-4 text-[#c0c4cc] transition-transform", collapsed && "rotate-180")} />
      </div>
      
      {!collapsed && (
        <div className="ml-1 py-2">
          {data.map((process, index) => {
            const isLast = index === data.length - 1;
            return (
              <div key={process.id} className="relative flex">
                {/* 垂直连线 */}
                {!isLast && (
                  <div className="absolute left-[5.5px] top-4 bottom-[-16px] w-[2px] bg-[#e4e7ed] opacity-60"></div>
                )}
                
                {/* 节点圆点 */}
                <div className="flex-shrink-0 mr-4 relative z-10 mt-[2px]">
                  <div className="w-[13px] h-[13px] rounded-full bg-[#e4e7ed]"></div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 pb-6 -mt-[2px]">
                  {/* 时间节点 */}
                  <div className="text-[13px] text-[#909399] mb-2 leading-none mt-[1px]">
                    {process.nodeStartTime || process.approvalTime}
                  </div>
                  
                  {/* 卡片区块 */}
                  <div className="bg-white p-4 rounded border border-[#ebeef5] shadow-sm">
                    <div className="font-bold text-[#303133] mb-4 text-[14px] leading-none">{process.nodeName}</div>
                    <div className="text-[13px] text-[#606266] flex flex-wrap items-center leading-none">
                      <span>审批人：</span>
                      <span className="text-[#409eff]">{process.approver}</span>
                      <span className="mx-1">，</span>
                      
                      <span>审批时间：</span>
                      <span className={process.approvalResult === '正在审批' ? 'text-[#e6a23c]' : 'text-[#409eff]'}>
                        {process.approvalTime}
                      </span>
                      <span className="mx-1">，</span>
                      
                      <span>审批意见：</span>
                      <span className="text-[#409eff]">{process.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
