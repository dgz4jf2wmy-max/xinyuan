import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, FileText, CalendarDays, Activity, Briefcase, Calendar, CheckSquare, Play, Square, Pause } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { mockMonthlyProductionTasks } from '../../../../data/production/execution/monthlyTaskData';
import TaskDetailDrawer from './TaskDetailDrawer';

export default function MonthlyProductionDashboardPage() {
  const navigate = useNavigate();
  
  const activeMasterTask = mockMonthlyProductionTasks.find(t => t.baseInfo.executionStatus === '在执行') || mockMonthlyProductionTasks[0];
  const { baseInfo, productionArrangements, otherArrangements } = activeMasterTask;

  const initialLeaf = productionArrangements.filter(a => a.productType === '再造烟叶').map((t, i) => ({...t, status: i===0 ? '在执行' : '待执行', progress: i===0 ? 35 : 0}));
  const initialStem = productionArrangements.filter(a => a.productType === '再造梗丝').map(t => ({...t, status: '待执行', progress: 0}));
  const initialFlavor = productionArrangements.filter(a => a.productType === '香精香料').map((t, i) => ({...t, status: i===0 ? '在执行' : '待执行', progress: i===0 ? 45 : 0}));
  const initialOther = otherArrangements.map(t => ({...t, status: '待执行', progress: 0}));

  const [tasksState, setTasksState] = useState({
    leaf: initialLeaf,
    stem: initialStem,
    flavor: initialFlavor,
    other: initialOther
  });

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (laneType: string, taskId: number, action: string) => {
    setTasksState((prev: any) => {
      const laneTasks = [...prev[laneType]];
      const taskIndex = laneTasks.findIndex((t: any) => t.id === taskId);
      if (taskIndex === -1) return prev;
      
      const task = { ...laneTasks[taskIndex] };

      if (action === 'start') {
        const hasActive = laneTasks.some((t: any) => t.status === '在执行' || t.status === '已暂停');
        if (hasActive) return prev;
        task.status = '在执行';
        task.progress = 0;
      } else if (action === 'pause') {
        task.status = '已暂停';
      } else if (action === 'continue') {
        task.status = '在执行';
      } else if (action === 'stop') {
        task.status = '已执行';
        task.progress = 100;
      }

      laneTasks[taskIndex] = task;
      return { ...prev, [laneType]: laneTasks };
    });
  };

  const openTaskDetail = (task: any) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    if (status === '在执行') return <span className="bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8] px-1.5 py-0.5 rounded text-[10px]">在执行</span>;
    if (status === '已暂停') return <span className="bg-[#fdf6ec] text-[#e6a23c] border border-[#f5dab1] px-1.5 py-0.5 rounded text-[10px]">已暂停</span>;
    if (status === '已执行') return <span className="bg-[#fafafa] text-[#909399] border border-[#e4e7ed] px-1.5 py-0.5 rounded text-[10px]">已执行</span>;
    return <span className="bg-white text-[#c0c4cc] border border-[#e4e7ed] px-1.5 py-0.5 rounded text-[10px]">待执行</span>;
  };

  const renderLane = (title: string, items: any[], type: string) => {
    const activeTask = items.find(t => ['在执行', '已暂停'].includes(t.status));
    const hasActive = !!activeTask;

    return (
      <div className="flex-1 min-w-[280px] bg-white rounded-lg shadow-sm border border-[#e4e7ed] flex flex-col overflow-hidden">
        <div className="bg-[#fafafa] border-b border-[#e4e7ed] p-3 shrink-0 flex justify-between items-center">
          <h2 className="font-medium text-[#303133] text-sm">{title}</h2>
          <span className="text-xs text-[#909399] bg-white border border-[#e4e7ed] px-2 py-0.5 rounded">任务: {items.length} 项</span>
        </div>
        
        {/* 控制区 */}
        {type !== 'other' && (
          <div className="bg-[#f8f9fb] border-b border-[#e4e7ed] p-3 shrink-0 flex flex-col h-[150px]">
            {activeTask ? (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="font-bold text-[#303133] text-sm block truncate" title={activeTask.brand}>{activeTask.brand}</span>
                    <span className="text-[10px] text-[#909399] font-mono block mt-0.5">任务编号: {activeTask.taskNo}</span>
                  </div>
                  <div className="shrink-0">{renderStatusBadge(activeTask.status)}</div>
                </div>
                
                <div className="mb-3 mt-1">
                  <div className="flex justify-between text-[10px] text-[#909399] mb-1">
                    <span>生产进度</span>
                    <span className="font-mono">{activeTask.progress}%</span>
                  </div>
                  <div className="w-full bg-[#e4e7ed] h-1.5 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-300", activeTask.status === '已暂停' ? 'bg-[#e6a23c]' : 'bg-[#67c23a]')} style={{ width: `${activeTask.progress}%` }}></div>
                  </div>
                  <div className="text-[10px] text-[#606266] mt-1 text-right">产量(吨): {activeTask.productionVolume}</div>
                </div>
                
                <div className="flex items-center gap-2 mt-auto">
                  {activeTask.status === '在执行' ? (
                    <Button variant="outline" size="sm" onClick={() => handleAction(type, activeTask.id, 'pause')} className="flex-1 h-7 text-[11px]"><Pause className="w-3 h-3 mr-1"/>暂停</Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleAction(type, activeTask.id, 'continue')} className="flex-1 h-7 text-[11px]"><Play className="w-3 h-3 mr-1"/>继续</Button>
                  )}
                  <Button variant="primary" size="sm" onClick={() => handleAction(type, activeTask.id, 'stop')} className="flex-1 h-7 text-[11px] bg-[#f56c6c] hover:bg-[#f78989] text-white border-none"><Square className="w-3 h-3 mr-1"/>结束</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#c0c4cc]">
                <Activity className="w-6 h-6 mb-2 opacity-30" />
                <span className="text-[13px] text-[#909399]">当前产线空闲</span>
                <span className="text-[11px] mt-1">请从下方列表启动任务</span>
              </div>
            )}
          </div>
        )}

        {/* 任务列表（无卡片隔离） */}
        <div className="flex-1 overflow-y-auto bg-white min-h-0">
          {items.map((item, idx) => (
            <div 
              key={item.id} 
              className="border-b border-[#e4e7ed] last:border-b-0 p-3 hover:bg-[#ebf5ff] transition-colors relative flex flex-col group cursor-pointer hover:z-10"
              onClick={() => openTaskDetail(item)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center flex-wrap gap-2 pr-2 flex-1 relative">
                  {type !== 'other' && item.productionOrder && (
                    <div className="bg-[#409eff] text-white text-[12px] px-1.5 py-0.5 rounded shadow-sm shrink-0 leading-none flex items-center justify-center">
                      顺序 {item.productionOrder}
                    </div>
                  )}
                  <span className="font-bold text-[#303133] text-[13px] group-hover:text-[#409eff] leading-snug">{item.brand}</span>
                  {item.blendingQuantity > 0 && (
                    <div className="relative group/tooltip inline-flex items-center">
                      <span className="bg-[#fdf6ec] text-[#e6a23c] border border-[#faecd8] px-1.5 py-0.5 rounded text-[10px] cursor-help">回掺</span>
                      <div className="absolute top-full left-0 mt-1.5 hidden group-hover/tooltip:block z-50 w-36 bg-[#303133] text-white rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="px-2.5 py-1.5 border-b border-gray-600/50 font-medium text-[11px] text-gray-200">回掺信息</div>
                        <div className="px-2.5 py-2 space-y-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-400">回掺数量:</span>
                            <span className="font-medium text-[#e6a23c]">{Number(item.blendingQuantity).toFixed(2)} 吨</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-400">回掺比例:</span>
                            <span className="font-medium text-[#e6a23c]">{item.blendingRatio}%</span>
                          </div>
                        </div>
                        <div className="absolute bottom-full left-2 border-solid border-b-[#303133] border-b-[5px] border-x-transparent border-x-[5px] border-t-0"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="shrink-0">{type !== 'other' ? renderStatusBadge(item.status) : <span className="bg-white text-[#c0c4cc] border border-[#e4e7ed] px-1.5 py-0.5 rounded text-[10px]">排产项</span>}</div>
              </div>
              <div className="flex flex-col gap-y-1.5 text-xs text-[#606266] mb-1">
                {type !== 'other' ? (
                  <>
                    <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[85px]">生产任务编号:</span><span className="font-mono truncate" title={item.taskNo}>{item.taskNo}</span></div>
                    <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[85px]">产品编号:</span><span className="font-mono truncate text-[#409eff] cursor-pointer hover:underline" title={item.productCode}>{item.productCode}</span></div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                      <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[60px]">产线:</span><span className="truncate" title={item.productionLine}>{item.productionLine}</span></div>
                      <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[60px]">产品类型:</span><span className="truncate" title={item.productType}>{item.productType}</span></div>
                      <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[60px]">生产类型:</span><span className="truncate" title={item.productionType}>{item.productionType}</span></div>
                      <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[60px]">完成日期:</span><span>{item.completionDate}</span></div>
                    </div>
                    
                    <div className="mt-2 p-2 bg-[#fafafa] rounded border border-[#ebedf0]">
                      <div className="grid grid-cols-4 gap-1 text-[11px] mb-2 text-center divide-x divide-[#e4e7ed]">
                        <div className="flex flex-col"><span className="text-[#909399] scale-90 -origin-bottom">产量(吨)</span><span className="font-medium text-[#303133]">{item.productionVolume}</span></div>
                        <div className="flex flex-col"><span className="text-[#909399] scale-90 -origin-bottom">理论(吨)</span><span className="font-medium text-[#a0cfff]">{item.status === '待执行' ? '-' : (item.theoreticalVolume ?? '-')}</span></div>
                        <div className="flex flex-col"><span className="text-[#909399] scale-90 -origin-bottom">报工(吨)</span><span className="font-medium text-[#409eff]">{item.status === '待执行' ? '-' : (item.reportedVolume ?? '-')}</span></div>
                        <div className="flex flex-col"><span className="text-[#909399] scale-90 -origin-bottom">入库(吨/箱)</span><span className="font-medium text-[#67c23a]">{item.status === '待执行' ? '-' : (item.inboundVolume != null ? <>{item.inboundVolume}<span className="text-[#909399] font-normal mx-0.5">/</span>{item.inboundVolume * 5}</> : '-')}</span></div>
                      </div>
                      <div className="relative h-[6px] w-full bg-[#ebeef5] rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-[#a0cfff] bg-opacity-40 transition-all rounded-full" style={{ width: `${item.status === '待执行' ? 0 : Math.min(((item.theoreticalVolume ?? 0) / item.productionVolume) * 100, 100) || 0}%` }}></div>
                        <div className="absolute left-0 top-0 h-full bg-[#409eff] bg-opacity-80 transition-all rounded-full z-10" style={{ width: `${item.status === '待执行' ? 0 : Math.min(((item.reportedVolume ?? 0) / item.productionVolume) * 100, 100) || 0}%` }}></div>
                        <div className="absolute left-0 top-[1.5px] h-[3px] bg-[#67c23a] transition-all rounded-full z-20 shadow-[0_0_2px_rgba(0,0,0,0.1)]" style={{ width: `${item.status === '待执行' ? 0 : Math.min(((item.inboundVolume ?? 0) / item.productionVolume) * 100, 100) || 0}%` }}></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[85px]">生产任务编号:</span><span className="font-mono truncate" title={item.taskNo}>{item.taskNo}</span></div>
                    <div className="flex items-center"><span className="text-[#909399] shrink-0 min-w-[85px]">产品编号:</span><span className="font-mono truncate text-[#409eff] cursor-pointer hover:underline" title={item.productCode}>{item.productCode}</span></div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                      <div className="flex items-center col-span-2"><span className="text-[#909399] shrink-0 min-w-[60px]">产品类型:</span><span className="truncate" title={item.productType}>{item.productType}</span></div>
                      <div className="flex items-center col-span-2"><span className="text-[#909399] shrink-0 min-w-[60px]">生产类型:</span><span className="truncate" title={item.productionType}>{item.productionType}</span></div>
                      <div className="flex items-center col-span-2"><span className="text-[#909399] shrink-0 min-w-[60px]">完成日期:</span><span>{item.completionDate}</span></div>
                    </div>
                    
                    <div className="mt-2 p-2 bg-[#fafafa] rounded border border-[#ebedf0]">
                      <div className="grid grid-cols-2 gap-1 text-[11px] mb-2 text-center divide-x divide-[#e4e7ed]">
                        <div className="flex flex-col"><span className="text-[#909399] scale-90 -origin-bottom">产量/投料量({(item as any).productionType?.includes('醇化') ? '箱' : '吨'})</span><span className="font-medium text-[#303133]">{item.productionVolume}</span></div>
                        <div className="flex flex-col"><span className="text-[#909399] scale-90 -origin-bottom">报工产量</span><span className="font-medium text-[#409eff]">{item.status === '待执行' ? '-' : (item.reportedVolume ?? '-')}</span></div>
                      </div>
                      <div className="relative h-[6px] w-full bg-[#ebeef5] rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-[#409eff] transition-all rounded-full z-10" style={{ width: `${item.status === '待执行' ? 0 : Math.min(((item.reportedVolume ?? 0) / item.productionVolume) * 100, 100) || 0}%` }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {type !== 'other' && item.status === '待执行' && !hasActive && (
                 <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     onClick={(e) => { e.stopPropagation(); handleAction(type, item.id, 'start'); }} 
                     className="h-6 text-[11px] px-3 text-[#409eff] border-[#409eff] hover:bg-[#ecf5ff]"
                   >
                     启动任务
                   </Button>
                 </div>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="flex items-center justify-center h-20 text-xs text-[#c0c4cc]">当前无分配任务</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* 1. 页面标题与操作区 */}
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2 text-[#303133]">
              <h2 className="text-xl font-bold text-gray-800">月度生产看板</h2>
              
              <div className="flex items-center ml-4 space-x-3 text-xs bg-[#fafafa] px-3 py-1.5 rounded border border-[#e4e7ed]">
                <span className="flex items-center text-[#606266]"><Hash className="w-3.5 h-3.5 mr-1"/> {baseInfo.taskNo}</span>
                <span className="flex items-center text-[#606266]"><FileText className="w-3.5 h-3.5 mr-1"/> {baseInfo.taskName}</span>
                <span className="mx-1 text-[#dcdfe6]">|</span>
                <span className="text-[#909399]">编报状态: <strong className="text-[#303133]">{baseInfo.approvalStatus}</strong></span>
                <span className="text-[#909399]">执行状态: <strong className={cn(baseInfo.executionStatus === '在执行' ? 'text-[#67c23a]' : 'text-[#e6a23c]')}>{baseInfo.executionStatus}</strong></span>
                <span className="text-[#909399]">版本号: <strong className="font-mono text-[#303133]">{baseInfo.currentVersion}</strong></span>
              </div>
            </div>
          </div>

          {/* 2. 页面主内容区 */}
          <div className="flex-1 overflow-auto flex flex-col gap-4">
            
            {/* 各泳道看板 */}
            <div className="flex gap-4 min-h-[500px] flex-1">
              {renderLane('再造烟叶生产安排', tasksState.leaf, 'leaf')}
              {renderLane('再造梗丝生产安排', tasksState.stem, 'stem')}
              {renderLane('香精香料生产安排', tasksState.flavor, 'flavor')}
              {renderLane('其他生产安排', tasksState.other, 'other')}
            </div>
          </div>

        </div>
      </div>
      <TaskDetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} task={selectedTask} />
    </div>
  );
}
