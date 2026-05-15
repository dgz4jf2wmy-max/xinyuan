import React, { useState, useEffect, useMemo } from 'react';
import { mockAllHandoverLogListData } from '../../../../../data/production/handover/allHandoverLogListData';
import { mockForemanLogs } from '../../../../../data/production/handover/foremanLogsData';
import { mockOperatorLogs } from '../../../../../data/production/handover/operatorLogsData';
import { cn } from '../../../../../lib/utils';
import { FolderOpen, FileText, ChevronRight, ChevronDown, FileSpreadsheet } from 'lucide-react';
import ForemanLogDetailPage from '../foreman-detail';
import OperatorLogDetailPage from '../operator-detail';

const EmptyState = () => (
  <div className="flex h-full w-full items-center justify-center bg-[#f5f7fa] text-[#909399] text-[14px]">
    <div className="flex flex-col items-center">
      <FileText className="w-12 h-12 mb-4 text-[#c0c4cc]" />
      请从左侧列表展开数据，并选择对应的日志以查看详情
    </div>
  </div>
);

export default function AllLogs() {
  const [selectedNode, setSelectedNode] = useState<{ type: 'foreman' | 'operator', id: number, logNo?: string } | null>(null);
  const [expandedName, setExpandedName] = useState<string | null>(null);
  
  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Group by name
  const groupedData = useMemo(() => {
    const map = new Map<string, {name: string, foremanLogNo: string, operatorLogNos: string[]}>();
    mockAllHandoverLogListData.forEach(item => {
      if (!map.has(item.name)) {
        map.set(item.name, {
          name: item.name,
          foremanLogNo: item.foremanLogNo,
          operatorLogNos: []
        });
      }
      const group = map.get(item.name)!;
      if (item.operatorLogNo && !group.operatorLogNos.includes(item.operatorLogNo)) {
        group.operatorLogNos.push(item.operatorLogNo);
      }
    });
    return Array.from(map.values());
  }, []);

  const totalPages = Math.ceil(groupedData.length / PAGE_SIZE) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return groupedData.slice(start, start + PAGE_SIZE);
  }, [groupedData, currentPage]);

  // Automatically select the foreman log of the first row on mount if nothing is selected
  useEffect(() => {
    if (!selectedNode && groupedData.length > 0) {
      const firstGroup = groupedData[0];
      setExpandedName(firstGroup.name);
      const log = mockForemanLogs.find(l => l.logNo === firstGroup.foremanLogNo) || mockForemanLogs[0];
      if (log) {
        setSelectedNode({ type: 'foreman', id: log.id, logNo: firstGroup.foremanLogNo });
      }
    }
  }, [groupedData]);

  const handleSelectLog = (type: 'foreman' | 'operator', logNo: string) => {
    if (type === 'foreman') {
       const log = mockForemanLogs.find(l => l.logNo === logNo) || mockForemanLogs[0];
       if (log) setSelectedNode({ type: 'foreman', id: log.id, logNo });
    } else {
       const log = mockOperatorLogs.find(l => l.logNo === logNo) || mockOperatorLogs[0];
       if (log) setSelectedNode({ type: 'operator', id: log.id, logNo });
    }
  };

  return (
    <div className="flex h-full w-full bg-white border border-[#e4e7ed] rounded-sm overflow-hidden relative">
      {/* 侧边栏 */}
      <div className="w-[350px] border-r border-[#e4e7ed] bg-[#fafafa] flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-[#e4e7ed] font-medium text-[#303133] text-[14px] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#409eff]" />
            交接班-全部列表
          </div>
          <div className="text-[12px] font-normal text-[#909399]">共 {groupedData.length} 班次</div>
        </div>
        
        <div className="flex-1 overflow-auto p-3 space-y-2 custom-scrollbar">
          {paginatedData.map((group, groupIdx) => {
            const isExpanded = expandedName === group.name;
            const displayId = (currentPage - 1) * PAGE_SIZE + groupIdx + 1;
            
            return (
              <div 
                key={group.name} 
                className="bg-white border border-[#e4e7ed] rounded shadow-sm overflow-hidden transition-all duration-200 hover:border-[#c0c4cc]"
              >
                {/* 列表分组头部 */}
                <div 
                  className={cn(
                    "px-3 py-2.5 cursor-pointer flex items-center justify-between group",
                    isExpanded ? "bg-[#f5f7fa] border-b border-[#e4e7ed]" : ""
                  )}
                  onClick={() => setExpandedName(isExpanded ? null : group.name)}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className="text-[#909399] font-mono text-[12px] w-5 text-center shrink-0">{displayId}</span>
                    <span className="text-[13px] font-medium text-[#303133] truncate" title={group.name}>
                      {group.name}
                    </span>
                  </div>
                  <button className="p-0.5 rounded text-[#909399] shrink-0 ml-2">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* 展开的关联日志 */}
                {isExpanded && (
                  <div className="bg-white p-2 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar border-t border-[#e4e7ed]">
                    {/* 工段长日志 */}
                    {(() => {
                      const fLog = mockForemanLogs.find(l => l.logNo === group.foremanLogNo);
                      const fName = fLog ? fLog.logName : `工段长日志 - ${group.foremanLogNo}`;
                      return (
                        <div 
                          className={cn(
                            "px-3 py-2 rounded flex flex-col text-[12px] cursor-pointer transition-colors border",
                            selectedNode?.type === 'foreman' && selectedNode.logNo === group.foremanLogNo
                              ? "bg-[#e8f4ff] border-[#b3d8ff] text-[#409eff]" 
                              : "bg-[#fafafa] border-[#ebeef5] hover:bg-[#f0f2f5] text-[#606266]"
                          )}
                          onClick={() => handleSelectLog('foreman', group.foremanLogNo)}
                        >
                          <div className="flex items-center gap-1.5 text-[13px] font-medium truncate">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate" title={fName}>{fName}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 操作工日志 (Multiple if available) */}
                    {group.operatorLogNos.map((opNo: string, idx: number) => {
                      const opLog = mockOperatorLogs.find(l => l.logNo === opNo);
                      const opName = opLog ? opLog.logName : `操作工日志 - ${opNo}`;
                      return (
                        <div 
                          key={idx}
                          className={cn(
                            "px-3 py-2 rounded flex flex-col text-[12px] cursor-pointer transition-colors border",
                            selectedNode?.type === 'operator' && selectedNode.logNo === opNo
                              ? "bg-[#e8f4ff] border-[#b3d8ff] text-[#409eff]" 
                              : "bg-[#fafafa] border-[#ebeef5] hover:bg-[#f0f2f5] text-[#606266]"
                          )}
                          onClick={() => handleSelectLog('operator', opNo)}
                        >
                          <div className="flex items-center gap-1.5 text-[13px] font-medium truncate">
                             <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                             <span className="truncate" title={opName}>{opName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 分页控制 */}
        <div className="p-2 border-t border-[#e4e7ed] bg-white flex items-center justify-between shrink-0 text-[12px] text-[#606266]">
          <button 
            className="px-2 py-1 border border-[#e4e7ed] rounded hover:bg-[#f5f7fa] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            上一页
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button 
            className="px-2 py-1 border border-[#e4e7ed] rounded hover:bg-[#f5f7fa] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            下一页
          </button>
        </div>
      </div>
      
      {/* 详情内容区 */}
      <div className="flex-1 overflow-hidden bg-[#f5f7fa]">
        {selectedNode ? (
          selectedNode.type === 'foreman' ? (
             <ForemanLogDetailPage id={selectedNode.id} embedded={true} />
          ) : (
             <OperatorLogDetailPage id={selectedNode.id} embedded={true} />
          )
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
