import React, { useState } from 'react';
import { Layers, ArrowLeft, ArrowUp, ArrowDown, SplitSquareHorizontal, Info, AlertCircle, Check, RefreshCw, GripVertical, FileSpreadsheet, PlayCircle, ArrowRight, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { initialReconPlans, initialFlavorPlans, mockBlendLibrary, PlanItem } from '../../../../data/production/execution/monthlyTaskPlanData';
import { mockMonthlyAgingPlanItems } from '../../../../data/plan/monthlyAgingPlanData';
import { mockMonthlyProductionPlanDetail } from '../../../../data/plan/monthlyPlanDetailData';
import { mockScheduleBasicInfo } from '../../../../data/production/scheduling/scheduleData';
import { MonthlyProductionArrangement, OtherProductionArrangement } from '../../../../types/production/execution/monthlyTask';
import { MonthlyAgingPlanItem } from '../../../../types/monthly-plan';
import { cn } from '../../../../lib/utils';

const getTaskCategory = (type: string, subType: string, productName: string): 'recon' | 'flavor' | 'other' => {
  if (type === '香精香料') {
    if (['受托加工', '集中调配', '省公司试验', '自主试验'].includes(subType)) {
      return 'flavor';
    }
  } else if (type === '再造烟叶' || type === '再造梗丝') {
    if (['配方生产（成品）', '配方生产（自制半成品）', '自主试验', '醇化', '翻箱', '烟灰原料筛分', '省内梗丝回填液'].includes(subType)) {
      return 'recon';
    }
  }
  return 'other';
};

const isValidDrop = (plan: LocalPlanItem | null, zoneType: string) => {
  if (!plan) return false;
  return getTaskCategory(plan.type, plan.subType, plan.productName) === zoneType;
};

const categoryStyles: Record<string, { border: string; badge: string; icon: string; hover: string }> = {
  recon: { 
    border: 'border-l-emerald-500', 
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    icon: 'text-emerald-500', 
    hover: 'hover:border-y-emerald-300 hover:border-r-emerald-300 shadow-emerald-100/50' 
  },
  flavor: { 
    border: 'border-l-indigo-500', 
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', 
    icon: 'text-indigo-500', 
    hover: 'hover:border-y-indigo-300 hover:border-r-indigo-300 shadow-indigo-100/50' 
  },
  other: { 
    border: 'border-l-amber-500', 
    badge: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: 'text-amber-500', 
    hover: 'hover:border-y-amber-300 hover:border-r-amber-300 shadow-amber-100/50' 
  }
};

type LocalPlanItem = PlanItem & { flavorDetails?: any[] };

type DraftTask = LocalPlanItem & {
  taskId: string;
  splitIndex: number;
  hasBlend: boolean;
  blendRatio: string | null;
  deduct?: boolean;
};

// 将产销计划明细转换为计划池项（参照月度产销计划表实体及其详情页展示方式）
const mappedProductionPlans: LocalPlanItem[] = (mockMonthlyProductionPlanDetail.planList || []).map(plan => {
  // 查找匹配的明细以获取单位、交期等扩展信息（用于后续排产逻辑）
  const matchedDetails = mockMonthlyProductionPlanDetail.details.filter(
    d => d.brandGrade === plan.brandGrade && d.productType === plan.productType
  );
  
  const firstDetail = matchedDetails[0] || {};
  
  let subType = plan.productionType || firstDetail.productionType || '';
  if (!subType) {
    if (plan.remarks?.includes('配方单')) {
      subType = plan.productType === '再造梗丝' ? '预混' : '配方生产（成品）';
    } else if (plan.remarks?.includes('试验通知单')) {
      subType = '自主试验';
    }
  }
  
  return {
    id: plan.id,
    source: '产销计划',
    type: plan.productType,
    subType,
    productName: plan.brandGrade,
    amount: plan.productionVolume,
    unit: firstDetail.unit || '吨',
    deadline: firstDetail.expectedCompletionDate || '-',
    target: firstDetail.customerName || '-',
    note: plan.remarks || '',
    flavorDetails: matchedDetails
  };
});

export default function MonthlyTaskBuilder() {
  const navigate = useNavigate();
  const [plansPool, setPlansPool] = useState<LocalPlanItem[]>(mappedProductionPlans);
  const [agingPlansPool, setAgingPlansPool] = useState<MonthlyAgingPlanItem[]>(mockMonthlyAgingPlanItems);
  const [activeTab, setActiveTab] = useState('production-sales');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [taskDrafts, setTaskDrafts] = useState<DraftTask[]>([]);
  
  const [baseInfo, setBaseInfo] = useState({
    taskNo: `SCAP-2026${String(new Date().getMonth() + 1).padStart(2, '0')}-001`,
    taskName: `${new Date().getMonth() + 1}月生产任务`,
    month: new Date().getMonth() + 1,
    approvalStatus: '待编制',
    executionStatus: '待执行',
    currentVersion: 'V1.0',
    creator: '张建国',
    createTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    lastUpdateTime: '-'
  });

  const handleMonthChange = (newMonth: number) => {
    setBaseInfo(prev => ({
      ...prev,
      month: newMonth,
      taskName: `${newMonth}月生产任务`,
      taskNo: `SCAP-2026${String(newMonth).padStart(2, '0')}-001`
    }));
  };
  
  const [draggedPlan, setDraggedPlan] = useState<LocalPlanItem | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [activeRightTab, setActiveRightTab] = useState('recon');

  const [blendModal, setBlendModal] = useState<{ isOpen: boolean; pendingPlan: LocalPlanItem | null; ratio: string; deduct: boolean }>({ isOpen: false, pendingPlan: null, ratio: '5%', deduct: true });
  const [splitModal, setSplitModal] = useState<{ isOpen: boolean; targetTask: DraftTask | null; splits: {amount: number|string, date: string, target: string}[] }>({ isOpen: false, targetTask: null, splits: [{amount: 0, date: '', target: ''}, {amount: 0, date: '', target: ''}] });

  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());

  const toggleTaskExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTaskIds);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTaskIds(newExpanded);
  };

  const [formConfig, setFormConfig] = useState({
    reconSchedulePlan: '',
    flavorSchedulePlan: ''
  });

  const handleAutoConvertAll = () => {
    const newTasks = plansPool.map(plan => ({
      ...plan,
      taskId: `T-${plan.id}-${Date.now().toString().slice(-4)}`,
      splitIndex: 0, 
      hasBlend: mockBlendLibrary.some(b => plan.productName.includes(b)), 
      blendRatio: mockBlendLibrary.some(b => plan.productName.includes(b)) ? '5%' : null
    }));
    
    setTaskDrafts([...taskDrafts, ...newTasks]);
    setPlansPool([]);
  };

  const handleAgingDragStart = (e: React.DragEvent, item: MonthlyAgingPlanItem) => {
    const pseudoPlan: PlanItem = {
      id: item.id || `aged-${Math.random()}`,
      source: '月度醇化计划',
      type: '月度醇化',
      subType: item.subBrandGrade || '醇化',
      productName: item.brandName,
      amount: item.boxCount || 0,
      unit: '箱',
      deadline: item.date || '-',
      note: item.remarks
    };
    setDraggedPlan(pseudoPlan);
    setActiveRightTab('other');
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragStart = (e: React.DragEvent, plan: PlanItem) => {
    setDraggedPlan(plan);
    const cat = getTaskCategory(plan.type, plan.subType, plan.productName);
    setActiveRightTab(cat);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedPlan(null);
    setHoveredZone(null);
  };

  const handleDragOverZone = (e: React.DragEvent, zoneType: string) => {
    if (isValidDrop(draggedPlan, zoneType)) {
      e.preventDefault(); 
      e.dataTransfer.dropEffect = 'move';
      if (hoveredZone !== zoneType) setHoveredZone(zoneType);
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeaveZone = (e: React.DragEvent, zoneType: string) => {
    e.preventDefault();
    if (hoveredZone === zoneType) setHoveredZone(null);
  };

  const handleDropZone = (e: React.DragEvent, zoneType: string) => {
    e.preventDefault();
    setHoveredZone(null);
    if (draggedPlan && isValidDrop(draggedPlan, zoneType)) {
      handleMoveToTask(draggedPlan);
    }
    setDraggedPlan(null);
  };

  const getZoneStyle = (zoneType: string) => {
    if (!draggedPlan) return 'border-[#e4e7ed] bg-white'; 
    
    const isValid = isValidDrop(draggedPlan, zoneType);
    if (!isValid) return 'border-[#e4e7ed] opacity-30 grayscale-[50%] pointer-events-none transition-all'; 
    
    if (hoveredZone === zoneType) {
      if(zoneType === 'recon') return 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-100 scale-[1.01] transition-all shadow-md';
      if(zoneType === 'flavor') return 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-100 scale-[1.01] transition-all shadow-md';
      if(zoneType === 'other') return 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-100 scale-[1.01] transition-all shadow-md';
    }
    
    if(zoneType === 'recon') return 'border-emerald-300 border-dashed bg-slate-50 transition-colors';
    if(zoneType === 'flavor') return 'border-indigo-300 border-dashed bg-slate-50 transition-colors';
    if(zoneType === 'other') return 'border-amber-300 border-dashed bg-slate-50 transition-colors';
    return 'border-slate-200';
  };

  const handleMoveToTask = (plan: PlanItem) => {
    if (mockBlendLibrary.some(b => plan.productName.includes(b))) {
      setBlendModal({ isOpen: true, pendingPlan: plan, ratio: '5%', deduct: true });
    } else {
      executeMoveToTask(plan, null);
    }
  };

  const executeMoveToTask = (plan: PlanItem | null, blendParams: { ratio: string, deduct: boolean } | null) => {
    if (!plan) return;
    const newTask: DraftTask = {
      ...plan,
      taskId: `T-${plan.id}-${Math.floor(Math.random()*10000)}`,
      splitIndex: 0,
      hasBlend: !!blendParams,
      blendRatio: blendParams ? blendParams.ratio : null
    };
    
    setTaskDrafts([...taskDrafts, newTask]);
    setPlansPool(plansPool.filter(p => p.id !== plan.id));
    setAgingPlansPool(agingPlansPool.filter(p => p.id !== plan.id));
    setBlendModal({ isOpen: false, pendingPlan: null, ratio: '5%', deduct: true });
  };

  const handleDeleteFlavorDetail = (task: DraftTask, detailId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const detailToRemove = task.flavorDetails?.find(d => d.id === detailId);
    if (!detailToRemove) return;
    
    const remainingDetails = task.flavorDetails?.filter(d => d.id !== detailId) || [];
    
    const existingIndex = plansPool.findIndex(p => p.id === task.id);
    
    if (existingIndex > -1) {
      const newPool = [...plansPool];
      newPool[existingIndex].amount += (detailToRemove.requirementAmount || 0);
      newPool[existingIndex].flavorDetails = [...(newPool[existingIndex].flavorDetails || []), detailToRemove];
      setPlansPool(newPool);
    } else {
      const returnToPoolPlan: LocalPlanItem = {
        id: task.id,
        source: task.source,
        type: task.type,
        subType: task.subType,
        productName: task.productName,
        amount: detailToRemove.requirementAmount || 0,
        unit: task.unit,
        deadline: task.deadline,
        target: task.target,
        note: task.note,
        flavorDetails: [detailToRemove]
      };
      setPlansPool([...plansPool, returnToPoolPlan]);
    }
    
    if (remainingDetails.length === 0) {
      setTaskDrafts(taskDrafts.filter(t => t.taskId !== task.taskId));
    } else {
      const newAmount = remainingDetails.reduce((sum, d) => sum + (d.requirementAmount || 0), 0);
      const newDrafts = taskDrafts.map(t => {
        if (t.taskId === task.taskId) {
          return {
            ...t,
            amount: newAmount,
            flavorDetails: remainingDetails
          };
        }
        return t;
      });
      setTaskDrafts(newDrafts);
    }
  };

  const handleReturnToPlan = (task: DraftTask) => {
    if (task.source === '月度醇化计划') {
      const recoveredAging: MonthlyAgingPlanItem = {
        id: task.id,
        sequenceNumber: agingPlansPool.length + 1,
        brandName: task.productName,
        month: baseInfo.month + '月',
        subBrandGrade: task.subType,
        boxCount: task.amount,
        availableInventory: 0,
        appliedCompletionAmount: task.amount,
        date: task.deadline,
        sectionPlanNumber: '',
        remarks: task.note || ''
      };
      setAgingPlansPool([...agingPlansPool, recoveredAging]);
    } else {
      const recoveredPlan: LocalPlanItem = { 
        id: task.id, source: task.source, type: task.type, subType: task.subType, 
        productName: task.productName, amount: task.amount, unit: task.unit, 
        deadline: task.deadline, target: task.target, note: task.note,
        flavorDetails: task.flavorDetails
      };
      
      const existingIndex = plansPool.findIndex(p => p.id === recoveredPlan.id);
      if (existingIndex > -1) {
        const newPool = [...plansPool];
        newPool[existingIndex].amount += recoveredPlan.amount;
        if (recoveredPlan.flavorDetails) {
            newPool[existingIndex].flavorDetails = [...(newPool[existingIndex].flavorDetails || []), ...recoveredPlan.flavorDetails];
        }
        setPlansPool(newPool);
      } else {
        setPlansPool([...plansPool, recoveredPlan]);
      }
    }
    
    setTaskDrafts(taskDrafts.filter(t => t.taskId !== task.taskId));
  };

  const handleSortInGroup = (taskId: string, direction: 'up' | 'down', filterFn: (t: DraftTask) => boolean) => {
    const groupTasks = taskDrafts.filter(filterFn);
    const groupIndex = groupTasks.findIndex(t => t.taskId === taskId);
    
    if ((direction === 'up' && groupIndex === 0) || 
        (direction === 'down' && groupIndex === groupTasks.length - 1)) return;

    const swapTask = groupTasks[direction === 'up' ? groupIndex - 1 : groupIndex + 1];
    const globalIndex1 = taskDrafts.findIndex(t => t.taskId === taskId);
    const globalIndex2 = taskDrafts.findIndex(t => t.taskId === swapTask.taskId);

    const newDrafts = [...taskDrafts];
    [newDrafts[globalIndex1], newDrafts[globalIndex2]] = [newDrafts[globalIndex2], newDrafts[globalIndex1]];
    setTaskDrafts(newDrafts);
  };

  const executeSplit = () => {
    const { targetTask, splits } = splitModal;
    if (!targetTask) return;
    const amount1 = Number(splits[0].amount);
    const amount2 = Number(splits[1].amount);

    if (amount1 + amount2 !== targetTask.amount) {
      alert("拆分后的数量总和必须等于原计划总量");
      return;
    }

    const task1 = { ...targetTask, taskId: `${targetTask.taskId}-1`, amount: amount1, deadline: splits[0].date, target: splits[0].target, splitIndex: 1 };
    const task2 = { ...targetTask, taskId: `${targetTask.taskId}-2`, amount: amount2, deadline: splits[1].date, target: splits[1].target, splitIndex: 2 };

    const taskIndex = taskDrafts.findIndex(t => t.taskId === targetTask.taskId);
    const newDrafts = [...taskDrafts];
    newDrafts.splice(taskIndex, 1, task1, task2); 
    
    setTaskDrafts(newDrafts);
    setSplitModal({ isOpen: false, targetTask: null, splits: [{amount: 0, date: '', target: ''}, {amount: 0, date: '', target: ''}] });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === plansPool.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(plansPool.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const reconTasks = taskDrafts.filter(t => getTaskCategory(t.type, t.subType, t.productName) === 'recon');
  const flavorTasks = taskDrafts.filter(t => getTaskCategory(t.type, t.subType, t.productName) === 'flavor');
  const otherTasks = taskDrafts.filter(t => getTaskCategory(t.type, t.subType, t.productName) === 'other');

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div className="flex items-center gap-2 text-[#303133]">
              <h2 className="text-xl font-bold text-gray-800">月度生产任务编制</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                if (taskDrafts.length > 0) {
                  if (window.confirm('有未保存的任务，确定要退出吗？')) {
                    navigate('/production/execution/monthly-task');
                  }
                } else {
                  navigate('/production/execution/monthly-task');
                }
              }}>取消</Button>
              <Button variant="outline" size="sm" className="text-[#409eff] border-[#409eff] hover:bg-blue-50" onClick={() => alert('保存成功')}>保存</Button>
              <Button variant="primary" size="sm" disabled={taskDrafts.length === 0} onClick={() => alert('提交成功')}>提交</Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 基础信息区域 - 移至顶部 */}
            <div className="mb-4 shrink-0 px-1">
              <div className="border border-[#e4e7ed] rounded-lg overflow-hidden bg-white">
                <div className="bg-[#fafafa] border-b border-[#e4e7ed] px-4 py-2.5 flex items-center shrink-0">
                  <div className="w-1 h-4 bg-[#409eff] rounded-sm mr-2"></div>
                  <span className="text-sm font-bold text-[#303133]">基础信息</span>
                </div>
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-gray-500 ml-1 flex items-center">
                        所属月份 <span className="text-red-500 ml-1 font-bold">*</span>
                      </label>
                      <select 
                        value={baseInfo.month} 
                        onChange={(e) => handleMonthChange(Number(e.target.value))}
                        className="flex h-9 w-full rounded-md border border-[#e4e7ed] bg-white px-3 py-1 text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#409eff]"
                      >
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}月</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-gray-500 ml-1">月度生产任务名称</label>
                      <Input 
                        value={baseInfo.taskName ?? ''} 
                        readOnly
                        className="h-9 bg-[#f5f7fa] border-[#e4e7ed] text-gray-500 text-[13px] font-medium" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium text-gray-500 ml-1">创建人</label>
                      <div className="flex h-9 items-center px-3 border border-[#e4e7ed] rounded-md bg-[#f5f7fa] text-[#606266] text-[13px]">
                        {baseInfo.creator}
                      </div>
                    </div>
                    <div className="space-y-1.5 text-nowrap">
                      <label className="text-[12px] font-medium text-gray-500 ml-1">创建时间</label>
                      <div className="flex h-9 items-center px-3 border border-[#e4e7ed] rounded-md bg-[#f5f7fa] text-[#606266] text-[12px]">
                        {baseInfo.createTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-0">
              {/* 左侧栏：计划池 */}
              <div className="w-full lg:w-[38%] flex flex-col border border-[#e4e7ed] rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="px-4 py-3 flex justify-between items-center shrink-0 border-b border-[#f0f0f0] bg-[#fafafa]">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[15px] text-[#303133] flex items-center">
                      月度产销计划
                      <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded-full border border-blue-100 font-normal">
                        待编: {plansPool.length}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={handleAutoConvertAll} disabled={plansPool.length === 0} className="text-[12px] flex items-center text-[#409eff] hover:text-blue-600 disabled:text-gray-400 font-medium">
                      <RefreshCw className="w-3 h-3 mr-1" /> 全部排产
                    </button>
                  </div>
                </div>

                <div className="px-5 py-0 border-b border-[#f0f2f5] bg-white mt-1">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex items-center gap-8 h-11 p-0 bg-transparent border-none">
                      <TabsTrigger 
                        value="production-sales" 
                        className={cn(
                          "relative h-11 px-1 rounded-none border-b-2 border-transparent bg-transparent text-[13px] text-gray-500 font-medium transition-all shadow-none",
                          "data-[state=active]:border-[#409eff] data-[state=active]:text-[#409eff] data-[state=active]:shadow-none hover:text-[#409eff] !p-0"
                        )}
                      >
                        <div className="flex items-center gap-1.5 px-1">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>月度产销计划</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="aging" 
                        className={cn(
                          "relative h-11 px-1 rounded-none border-b-2 border-transparent bg-transparent text-[13px] text-gray-500 font-medium transition-all shadow-none",
                          "data-[state=active]:border-[#409eff] data-[state=active]:text-[#409eff] data-[state=active]:shadow-none hover:text-[#409eff] !p-0"
                        )}
                      >
                        <div className="flex items-center gap-1.5 px-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>月度醇化计划</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <Table className="border-collapse">
                    <TableHeader className="sticky top-0 bg-[#fafafa] z-10 isolate">
                      {activeTab === 'production-sales' ? (
                        <TableRow className="border-b border-[#e4e7ed] hover:bg-transparent h-11">
                          <TableHead className="w-10 text-center px-0">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-[#409eff] focus:ring-[#409eff]"
                              checked={selectedIds.length === plansPool.length && plansPool.length > 0}
                              onChange={toggleSelectAll}
                            />
                          </TableHead>
                          <TableHead className="w-8 px-0"></TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">序号</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">产品类别</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">生产类型</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">牌号</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">产量/吨</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2">备注</TableHead>
                        </TableRow>
                      ) : (
                        <TableRow className="border-b border-[#e4e7ed] hover:bg-transparent h-11">
                          <TableHead className="w-10 text-center px-0">
                            <input type="checkbox" className="rounded border-gray-300 text-[#409eff] focus:ring-[#409eff]" />
                          </TableHead>
                          <TableHead className="w-8 px-0"></TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">序号</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">总牌号和等级</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">年月份</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">分牌号和等级</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">箱数</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">日期</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2 border-r border-[#ebeef5]">码段计划号</TableHead>
                          <TableHead className="text-[12px] text-center whitespace-nowrap text-[#606266] font-bold px-2">备注</TableHead>
                        </TableRow>
                      )}
                    </TableHeader>
                    <TableBody>
                      {activeTab === 'production-sales' ? (
                        plansPool.map((plan, index) => (
                          <TableRow 
                            key={plan.id}
                            className={cn(
                              "cursor-grab active:cursor-grabbing hover:bg-[#f5f7fa] transition-colors border-b border-[#ebeef5] h-12",
                              selectedIds.includes(plan.id) && "bg-[#f0f7ff]"
                            )}
                            draggable
                            onDragStart={(e) => handleDragStart(e, plan)}
                            onDragEnd={handleDragEnd}
                          >
                            <TableCell className="w-10 text-center px-1 border-r border-[#ebeef5]">
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-[#409eff] focus:ring-[#409eff]"
                                checked={selectedIds.includes(plan.id)}
                                onChange={() => toggleSelect(plan.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell className="w-8 px-0 !py-2 text-center border-r border-[#ebeef5]">
                              <GripVertical className="w-3.5 h-3.5 text-[#dcdfe6] mx-auto" />
                            </TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center border-r border-[#ebeef5]">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center border-r border-[#ebeef5]">
                              {plan.type}
                            </TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center border-r border-[#ebeef5]">
                              {plan.subType || '-'}
                            </TableCell>
                            <TableCell className="px-2 !py-2 text-center border-r border-[#ebeef5]">
                               <div className="font-bold text-[#303133] text-[13px] whitespace-nowrap">
                                 {plan.productName}
                               </div>
                            </TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 font-bold text-[#409eff] text-center border-r border-[#ebeef5]">
                              {plan.amount}
                            </TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center">
                              {plan.note || '-'}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                        agingPlansPool.map((item, index) => (
                          <TableRow 
                            key={item.id} 
                            className="cursor-grab active:cursor-grabbing hover:bg-[#f5f7fa] border-b border-[#ebeef5] h-12"
                            draggable
                            onDragStart={(e) => handleAgingDragStart(e, item)}
                            onDragEnd={handleDragEnd}
                          >
                            <TableCell className="w-10 text-center px-1 border-r border-[#ebeef5]">
                              <input type="checkbox" className="rounded border-gray-300 text-[#409eff] focus:ring-[#409eff]" />
                            </TableCell>
                            <TableCell className="w-8 px-0 !py-2 text-center border-r border-[#ebeef5]">
                              <GripVertical className="w-3.5 h-3.5 text-[#dcdfe6] mx-auto" />
                            </TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center border-r border-[#ebeef5]">{index + 1}</TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 font-bold text-[#303133] text-center border-r border-[#ebeef5]">{item.brandName}</TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center border-r border-[#ebeef5]">{item.month}</TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#303133] text-center border-r border-[#ebeef5]">{item.subBrandGrade}</TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 font-bold text-[#409eff] text-center border-r border-[#ebeef5]">{item.boxCount}</TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center border-r border-[#ebeef5]">{item.date}</TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center border-r border-[#ebeef5]">{item.sectionPlanNumber || "/"}</TableCell>
                            <TableCell className="text-[13px] px-2 !py-2 text-[#606266] text-center">{item.remarks}</TableCell>
                          </TableRow>
                        ))
                      )}
                      {plansPool.length === 0 && activeTab === 'production-sales' && (
                        <TableRow>
                           <TableCell colSpan={10} className="text-center py-16 text-gray-400 border-none text-[12px]">计划已全部排入</TableCell>
                        </TableRow>
                      )}
                      {agingPlansPool.length === 0 && activeTab === 'aging' && (
                        <TableRow>
                           <TableCell colSpan={10} className="text-center py-16 text-gray-400 border-none text-[12px]">计划已全部排入</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

            {/* 右侧栏：月度生产安排 - 移除卡片边框和阴影 */}
            <div 
              className="w-full lg:w-[62%] flex flex-col pl-6 pr-0 overflow-hidden"
              onDragOver={(e) => handleDragOverZone(e, activeRightTab)}
              onDragLeave={(e) => handleDragLeaveZone(e, activeRightTab)}
              onDrop={(e) => handleDropZone(e, activeRightTab)}
            >
              <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="flex-1 flex flex-col bg-white border border-[#e4e7ed] rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 border-b border-[#e4e7ed] bg-[#fafafa] shrink-0">
                  <TabsList className="bg-transparent p-0 h-11 flex gap-8 border-none justify-start">
                    <TabsTrigger value="recon" className="relative h-11 px-1 rounded-none border-b-2 border-transparent bg-transparent text-[13px] text-gray-500 font-medium transition-all shadow-none data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none hover:text-emerald-600 !p-0">
                      再造原料 {reconTasks.length > 0 && <span className="ml-1 text-[11px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full">{reconTasks.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="flavor" className="relative h-11 px-1 rounded-none border-b-2 border-transparent bg-transparent text-[13px] text-gray-500 font-medium transition-all shadow-none data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none hover:text-indigo-600 !p-0">
                      香精香料 {flavorTasks.length > 0 && <span className="ml-1 text-[11px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">{flavorTasks.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="other" className="relative h-11 px-1 rounded-none border-b-2 border-transparent bg-transparent text-[13px] text-gray-500 font-medium transition-all shadow-none data-[state=active]:border-amber-500 data-[state=active]:text-amber-700 data-[state=active]:shadow-none hover:text-amber-600 !p-0">
                      其他生产安排 {otherTasks.length > 0 && <span className="ml-1 text-[11px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">{otherTasks.length}</span>}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <TabsContent value="recon" className="h-full m-0 data-[state=active]:flex flex-col">
                    <div className={`flex-1 overflow-y-auto w-full ${getZoneStyle('recon')} border-none rounded-none`}>
                      <div className="bg-emerald-50/40 border-b border-emerald-100 px-4 py-2 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-sm mr-2"></div>
                    <h3 className="font-bold text-emerald-900 text-sm">再造原料</h3>
                  </div>
                  <div className="flex items-center text-xs text-slate-600 space-x-2">
                    <span>关联排班表:</span>
                    <select 
                      value={formConfig.reconSchedulePlan} 
                      onChange={(e) => setFormConfig({...formConfig, reconSchedulePlan: e.target.value})} 
                      className="border border-slate-300 rounded px-2 py-1 w-56 focus:border-emerald-500 outline-none bg-white transition-colors text-xs"
                    >
                      <option value="">暂不关联</option>
                      {mockScheduleBasicInfo
                        .filter(s => s.productionLine === '再造原料' && s.status === '生效中')
                        .map(s => <option key={s.scheduleCode} value={s.scheduleCode}>{s.scheduleCode} ({s.scheduleDateRange})</option>)
                      }
                    </select>
                  </div>
                </div>
                
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-[#f5f7fa] border-b border-slate-200 text-slate-500 text-xs">
                    <tr>
                      <th className="py-2.5 px-3 font-medium w-12 text-center">生产顺序</th>
                      <th className="py-2.5 px-3 font-medium">产品类型</th>
                      <th className="py-2.5 px-3 font-medium">产品名称</th>
                      <th className="py-2.5 px-3 font-medium">产品编号</th>
                      <th className="py-2.5 px-3 font-medium">牌号</th>
                      <th className="py-2.5 px-3 font-medium">生产类型</th>
                      <th className="py-2.5 px-3 font-medium w-24">产量（吨）</th>
                      <th className="py-2.5 px-3 font-medium w-32">完成日期</th>
                      <th className="py-2.5 px-3 font-medium w-32">完成日期</th>
                      <th className="py-2.5 px-3 font-medium w-12 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reconTasks.map((task, idx) => {
                      const isExpanded = expandedTaskIds.has(task.taskId);
                      return (
                      <React.Fragment key={task.taskId}>
                        <tr className="bg-white hover:bg-emerald-50/30 group">
                          <td className="py-3 px-3 text-center border-r border-slate-50">
                            <div className="flex flex-col items-center justify-center space-y-0.5">
                              <button onClick={(e) => { e.stopPropagation(); handleSortInGroup(task.taskId, 'up', t => getTaskCategory(t.type, t.subType, t.productName)==='recon'); }} className="text-slate-300 hover:text-emerald-600 disabled:opacity-0"><ArrowUp className="w-3 h-3"/></button>
                              <span className="font-mono font-medium text-slate-700 text-xs">{idx + 1}</span>
                              <button onClick={(e) => { e.stopPropagation(); handleSortInGroup(task.taskId, 'down', t => getTaskCategory(t.type, t.subType, t.productName)==='recon'); }} className="text-slate-300 hover:text-emerald-600 disabled:opacity-0"><ArrowDown className="w-3 h-3"/></button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.type}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.productName}
                              {task.hasBlend && (
                                <div className="relative group/tooltip ml-2 inline-flex">
                                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded border border-amber-200 cursor-help font-bold">
                                    回掺
                                  </span>
                                  <div className="invisible group-hover/tooltip:visible absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900/95 text-white text-[11px] rounded shadow-xl min-w-[140px] whitespace-normal pointer-events-none transition-all opacity-0 group-hover/tooltip:opacity-100">
                                    <div className="font-bold border-b border-white/10 pb-1 mb-1">回掺信息</div>
                                    <div className="flex justify-between gap-4 mb-0.5">
                                      <span className="text-white/60">回掺数量:</span>
                                      <span>{(Number(task.amount || 0) * (parseFloat(task.blendRatio?.replace('%','')||'0')/100)).toFixed(2)} 吨</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-white/60">回掺比例:</span>
                                      <span>{task.blendRatio || '0%'}</span>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">{(task.productName || '').startsWith('GS') ? 'LY-GS-' + task.productName.substring(2) : 'LY-' + task.productName}</td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">{task.productName}</td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">{task.subType}</td>
                          <td className="py-3 px-3">
                            <span className="text-sm font-medium text-slate-800">{task.amount}</span>
                          </td>
                          <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                            <input type="date" value={task.deadline || ''} onChange={(e) => { const nt = [...taskDrafts]; const t = nt.find(t=>t.taskId===task.taskId); if(t) t.deadline = e.target.value; setTaskDrafts(nt); }} className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors" />
                          </td>
                          <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                             <button onClick={() => handleReturnToPlan(task)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><ArrowLeft className="w-4 h-4 mx-auto"/></button>
                          </td>
                        </tr>
                      </React.Fragment>
                      );
                    })}
                    {reconTasks.length === 0 && (<tr><td colSpan={10} className="py-6 text-center text-emerald-600/50 text-xs">暂无再造烟叶生产任务</td></tr>)}
                  </tbody>
                </table>
              </div>
            </TabsContent>

                  <TabsContent value="flavor" className="h-full m-0 data-[state=active]:flex flex-col">
                    <div className={`flex-1 overflow-y-auto w-full ${getZoneStyle('flavor')} border-none rounded-none`}>
                      <div className="bg-indigo-50/40 border-b border-indigo-100 px-4 py-2 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="w-1.5 h-4 bg-indigo-500 rounded-sm mr-2"></div>
                    <h3 className="font-bold text-indigo-900 text-sm">香精香料</h3>
                  </div>
                  <div className="flex items-center text-xs text-slate-600 space-x-2">
                    <span>关联排班表:</span>
                    <select 
                      value={formConfig.flavorSchedulePlan} 
                      onChange={(e) => setFormConfig({...formConfig, flavorSchedulePlan: e.target.value})} 
                      className="border border-slate-300 rounded px-2 py-1 w-56 focus:border-indigo-500 outline-none bg-white transition-colors text-xs"
                    >
                      <option value="">暂不关联</option>
                      {mockScheduleBasicInfo
                        .filter(s => s.productionLine === '香精香料' && s.status === '生效中')
                        .map(s => <option key={s.scheduleCode} value={s.scheduleCode}>{s.scheduleCode} ({s.scheduleDateRange})</option>)
                      }
                    </select>
                  </div>
                </div>
                
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-[#f5f7fa] border-b border-slate-200 text-slate-500 text-xs">
                    <tr>
                      <th className="py-2.5 px-3 font-medium w-12 text-center">生产顺序</th>
                      <th className="py-2.5 px-3 font-medium">产品类型</th>
                      <th className="py-2.5 px-3 font-medium">产品名称</th>
                      <th className="py-2.5 px-3 font-medium">产品编号</th>
                      <th className="py-2.5 px-3 font-medium">牌号</th>
                      <th className="py-2.5 px-3 font-medium">生产类型</th>
                      <th className="py-2.5 px-3 font-medium w-24">产量（吨）</th>
                      <th className="py-2.5 px-3 font-medium w-32">完成日期</th>
                      <th className="py-2.5 px-3 font-medium w-32">完成日期</th>
                      <th className="py-2.5 px-3 font-medium w-12 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {flavorTasks.map((task, idx) => {
                      const isExpanded = expandedTaskIds.has(task.taskId);
                      return (
                      <React.Fragment key={task.taskId}>
                        <tr className="bg-white hover:bg-indigo-50/30 group cursor-pointer" onClick={() => toggleTaskExpand(task.taskId)}>
                          <td className="py-3 px-3 text-center border-r border-slate-50" onClick={e => e.stopPropagation()}>
                            <div className="flex flex-col items-center justify-center space-y-0.5">
                              <button onClick={() => handleSortInGroup(task.taskId, 'up', t => getTaskCategory(t.type, t.subType, t.productName)==='flavor')} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowUp className="w-3 h-3"/></button>
                              <span className="font-mono font-medium text-slate-700 text-xs">{idx + 1}</span>
                              <button onClick={() => handleSortInGroup(task.taskId, 'down', t => getTaskCategory(t.type, t.subType, t.productName)==='flavor')} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowDown className="w-3 h-3"/></button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.flavorDetails && task.flavorDetails.length > 0 && (
                                isExpanded ? <ChevronDown className="w-4 h-4 mr-1 text-slate-400" /> : <ChevronRight className="w-4 h-4 mr-1 text-slate-400" />
                              )}
                              {task.type}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.productName}
                              {task.flavorDetails && task.flavorDetails.length > 1 ? (
                                <span className="ml-2 px-1.5 py-0.5 bg-orange-50 text-orange-500 text-[10px] rounded border border-orange-100 font-medium whitespace-nowrap">
                                  合并 {task.flavorDetails.length} 项需求
                                </span>
                              ) : (
                                <span className="ml-2 px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] rounded border border-gray-100 font-medium whitespace-nowrap">
                                  单项需求
                                </span>
                              )}
                              {task.hasBlend && (
                                <div className="relative group/tooltip ml-2 inline-flex">
                                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded border border-amber-200 cursor-help font-bold">
                                    回掺
                                  </span>
                                  <div className="invisible group-hover/tooltip:visible absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900/95 text-white text-[11px] rounded shadow-xl min-w-[140px] whitespace-normal pointer-events-none transition-all opacity-0 group-hover/tooltip:opacity-100">
                                    <div className="font-bold border-b border-white/10 pb-1 mb-1">回掺信息</div>
                                    <div className="flex justify-between gap-4 mb-0.5">
                                      <span className="text-white/60">回掺数量:</span>
                                      <span>{(Number(task.amount || 0) * (parseFloat(task.blendRatio?.replace('%','')||'0')/100)).toFixed(2)} 吨</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-white/60">回掺比例:</span>
                                      <span>{task.blendRatio || '0%'}</span>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">LY-XJ-{task.productName}</td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">{task.productName}</td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">{task.subType || '自主试验'}</td>
                          <td className="py-3 px-3">
                            <span className="text-sm font-medium text-slate-800">{task.amount}</span>
                          </td>
                          <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                            <input type="date" defaultValue={task.deadline !== '-' ? task.deadline.replace(/\//g, '-') : ''} className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 focus:bg-white focus:border-indigo-500 outline-none transition-colors" />
                          </td>
                          <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-center items-center space-x-1">
                               <button onClick={() => handleReturnToPlan(task)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="退回计划池"><ArrowLeft className="w-4 h-4"/></button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && task.flavorDetails && task.flavorDetails.length > 0 && (
                          <tr>
                            <td colSpan={11} className="p-0 border-b border-slate-100 bg-slate-50/50">
                              <div className="py-3 pr-4 pl-12 bg-indigo-50/20 border-l-[3px] border-l-indigo-400">
                                <table className="w-full text-xs text-left">
                                  <thead className="text-slate-500">
                                    <tr>
                                      <th className="py-2 px-2 font-medium">需求编号</th>
                                      <th className="py-2 px-2 font-medium">客户名称</th>
                                      <th className="py-2 px-2 font-medium">产品明细型号</th>
                                      <th className="py-2 px-2 font-medium text-right">需求量(吨)</th>
                                      <th className="py-2 px-2 font-medium">期望完成日期</th>
                                      <th className="py-2 px-2 font-medium text-center w-16">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100/50">
                                    {task.flavorDetails.map(detail => (
                                      <tr key={detail.id} className="hover:bg-white/60 transition-colors">
                                        <td className="py-2 px-2 font-mono text-slate-500">{detail.id}</td>
                                        <td className="py-2 px-2 text-slate-700">{detail.customerName}</td>
                                        <td className="py-2 px-2 text-slate-700">{detail.subBrandGrade}</td>
                                        <td className="py-2 px-2 text-right font-medium text-slate-700">{detail.requirementAmount}</td>
                                        <td className="py-2 px-2 text-slate-600">{detail.expectedCompletionDate}</td>
                                        <td className="py-2 px-2 text-center">
                                          <button onClick={(e) => handleDeleteFlavorDetail(task, detail.id, e)} className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-neutral-100 transition-colors">
                                            <ArrowLeft className="w-3.5 h-3.5" title="退回计划池"/>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                      );
                    })}
                    {flavorTasks.length === 0 && (<tr><td colSpan={10} className="py-6 text-center text-indigo-600/50 text-xs">暂无香精香料生产任务</td></tr>)}
                  </tbody>
                </table>
              </div>
            </TabsContent>

                  <TabsContent value="other" className="h-full m-0 data-[state=active]:flex flex-col">
                    <div className={`flex-1 overflow-y-auto w-full ${getZoneStyle('other')} border-none rounded-none`}>
                      <div className="bg-amber-50/40 border-b border-amber-100 px-4 py-2 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="w-1.5 h-4 bg-amber-500 rounded-sm mr-2"></div>
                    <h3 className="font-bold text-amber-900 text-sm">其他生产安排</h3>
                  </div>
                </div>
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-[#f5f7fa] border-b border-slate-200 text-slate-500 text-xs">
                    <tr>
                      <th className="py-2.5 px-3 font-medium w-12 text-center">序号</th>
                      <th className="py-2.5 px-3 font-medium">生产任务编号</th>
                      <th className="py-2.5 px-3 font-medium">产品类型</th>
                      <th className="py-2.5 px-3 font-medium">产品名称</th>
                      <th className="py-2.5 px-3 font-medium">产品编号</th>
                      <th className="py-2.5 px-3 font-medium">牌号</th>
                      <th className="py-2.5 px-3 font-medium">生产类型</th>
                      <th className="py-2.5 px-3 font-medium w-32">产量/投料量</th>
                      <th className="py-2.5 px-3 font-medium w-32">完成日期</th>
                      <th className="py-2.5 px-3 font-medium w-12 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {otherTasks.map((task, idx) => {
                      const isExpanded = expandedTaskIds.has(task.taskId);
                      return (
                      <React.Fragment key={task.taskId}>
                        <tr className="bg-white hover:bg-amber-50/30 group">
                          <td className="py-3 px-3 text-center border-r border-slate-50">
                            <span className="font-mono font-medium text-slate-700 text-xs">{idx + 1}</span>
                          </td>
                          <td className="py-3 px-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                            SCRW-{task.type === '再造梗丝' ? 'GS' : task.type === '香精香料' ? 'XJ' : 'ZY'}-202405-{String(idx + 1).padStart(3, '0')}
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.type}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                            <div className="flex items-center">
                              {task.productName}
                              {task.hasBlend && (
                                <div className="relative group/tooltip ml-2 inline-flex">
                                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded border border-amber-200 cursor-help font-bold">
                                    回掺
                                  </span>
                                  <div className="invisible group-hover/tooltip:visible absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900/95 text-white text-[11px] rounded shadow-xl min-w-[140px] whitespace-normal pointer-events-none transition-all opacity-0 group-hover/tooltip:opacity-100">
                                    <div className="font-bold border-b border-white/10 pb-1 mb-1">回掺信息</div>
                                    <div className="flex justify-between gap-4 mb-0.5">
                                      <span className="text-white/60">回掺数量:</span>
                                      <span>{(Number(task.amount || 0) * (parseFloat(task.blendRatio?.replace('%','')||'0')/100)).toFixed(2)} 吨</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-white/60">回掺比例:</span>
                                      <span>{task.blendRatio || '0%'}</span>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">{(task.productName || '').startsWith('GS') ? 'LY-GS-' + task.productName.substring(2) : (task.productName || '').startsWith('NX') ? 'LY-NX-' + task.productName.substring(2) : 'LY-' + task.productName}</td>
                          <td className="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">{task.productName}</td>
                          <td className="py-3 px-3 font-medium text-slate-700 text-xs whitespace-nowrap">{task.subType}</td>
                          <td className="py-3 px-3">
                            <span className="text-sm font-medium text-slate-800">{task.amount}</span>
                            <span className="text-xs text-slate-500 ml-1">{task.subType?.includes('醇化') ? '箱' : '吨'}</span>
                          </td>
                          <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                            <input type="date" value={task.deadline || ''} onChange={(e) => { const nt = [...taskDrafts]; const t = nt.find(t=>t.taskId===task.taskId); if(t) t.deadline = e.target.value; setTaskDrafts(nt); }} className="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 focus:bg-white focus:border-amber-500 outline-none transition-colors" />
                          </td>
                          <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                             <button onClick={() => handleReturnToPlan(task)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><ArrowLeft className="w-4 h-4 mx-auto"/></button>
                          </td>
                        </tr>
                      </React.Fragment>
                      );
                    })}
                    {otherTasks.length === 0 && (<tr><td colSpan={9} className="py-6 text-center text-amber-600/50 text-xs">暂无其他生产任务</td></tr>)}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
          </div>
        </div>
      </div>

      {/* 弹窗组件：回掺确认 */}
      {blendModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[400px] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#e4e7ed] bg-[#fafafa] flex items-center text-gray-800">
              <h3 className="font-semibold text-sm">工艺参数前置确认：触发回掺</h3>
            </div>
            <div className="p-5 text-sm space-y-4">
              <p className="text-gray-600 leading-relaxed">
                牌号 <strong>{blendModal.pendingPlan?.productName}</strong> 存在回掺记录。请确认回掺参数：
              </p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">回掺比例</label>
                <input type="text" value={blendModal.ratio ?? ''} onChange={(e)=>setBlendModal({...blendModal, ratio: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-1.5 focus:border-[#1890ff] outline-none" />
              </div>
              <label className="flex items-center mt-2 cursor-pointer bg-slate-50 p-2 rounded border border-[#e4e7ed]">
                <input type="checkbox" checked={blendModal.deduct} onChange={(e)=>setBlendModal({...blendModal, deduct: e.target.checked})} className="w-4 h-4 text-[#1890ff] rounded border-slate-300 focus:ring-[#1890ff]" />
                <span className="ml-2 text-gray-700 text-xs font-medium">扣除回掺量 (核减原料请领单据)</span>
              </label>
            </div>
            <div className="px-5 py-3 border-t border-[#e4e7ed] bg-[#fafafa] flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setBlendModal({ isOpen: false, pendingPlan: null, ratio: '5%', deduct: true })}>取消</Button>
              <Button variant="primary" size="sm" onClick={() => executeMoveToTask(blendModal.pendingPlan, { ratio: blendModal.ratio, deduct: blendModal.deduct })}>确认参数</Button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗组件：拆分 */}
      {splitModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[460px] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#e4e7ed] bg-[#fafafa] flex items-center text-gray-800">
              <SplitSquareHorizontal className="w-4 h-4 mr-2 text-[#1890ff]" />
              <h3 className="font-semibold text-sm">单据拆分</h3>
            </div>
            <div className="p-5 text-sm space-y-4">
              <p className="text-gray-600">
                将产量 <strong>{splitModal.targetTask?.amount} {splitModal.targetTask?.unit}</strong> 按要求拆分：
              </p>
              
              <div className="bg-slate-50 p-3 rounded border border-[#e4e7ed] space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 w-12">批次 1</span>
                  <input type="number" value={splitModal.splits[0].amount ?? ''} onChange={(e)=> { const newSplits = [...splitModal.splits]; newSplits[0].amount = e.target.value; setSplitModal({...splitModal, splits: newSplits}); }} className="w-20 border border-slate-300 rounded px-2 py-1 outline-none text-xs" placeholder="数量" />
                  <input type="date" value={splitModal.splits[0].date ?? ''} onChange={(e)=> { const newSplits = [...splitModal.splits]; newSplits[0].date = e.target.value; setSplitModal({...splitModal, splits: newSplits}); }} className="flex-1 border border-slate-300 rounded px-2 py-1 outline-none text-xs" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 w-12">批次 2</span>
                  <input type="number" value={splitModal.splits[1].amount ?? ''} onChange={(e)=> { const newSplits = [...splitModal.splits]; newSplits[1].amount = e.target.value; setSplitModal({...splitModal, splits: newSplits}); }} className="w-20 border border-slate-300 rounded px-2 py-1 outline-none text-xs" placeholder="数量" />
                  <input type="date" value={splitModal.splits[1].date ?? ''} onChange={(e)=> { const newSplits = [...splitModal.splits]; newSplits[1].date = e.target.value; setSplitModal({...splitModal, splits: newSplits}); }} className="flex-1 border border-slate-300 rounded px-2 py-1 outline-none text-xs" />
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-[#e4e7ed] bg-[#fafafa] flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSplitModal({ isOpen: false, targetTask: null, splits: [{amount: 0, date: '', target: ''}, {amount: 0, date: '', target: ''}] })}>取消</Button>
              <Button variant="primary" size="sm" onClick={executeSplit}>确认拆分</Button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
