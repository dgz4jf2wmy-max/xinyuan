import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import TaskReportView from './components/TaskReportView';
import ReportListView from './components/ReportListView';

export default function AgingReportPage() {
  const [viewMode, setViewMode] = useState('task');

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          {/* 1. 操作区 */}
          <div className="flex justify-between items-center mb-4 shrink-0 border-b border-[#e4e7ed] pb-2">
            <div className="flex items-center gap-2 text-[#303133]">
              <Tabs variant="line" value={viewMode} onValueChange={setViewMode} className="w-auto">
                <TabsList className="bg-transparent h-auto p-0 border-b-0 space-x-2 w-full justify-start">
                  <TabsTrigger value="task">按任务展开</TabsTrigger>
                  <TabsTrigger value="report">报工明细列表</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              {/* Optional buttons */}
            </div>
          </div>

          {/* 2. 页面主内容区 */}
          <div className="flex-1 min-h-0">
             {viewMode === 'task' ? <TaskReportView /> : <ReportListView />}
          </div>
        </div>
      </div>
    </div>
  );
}
