import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../../../../components/ui/tabs';
import { ApprovalProcessTimeline } from '../../../../../components/ui/approval-process';
import { VerticalFlowchart } from '../../../../../components/ui/vertical-flowchart';
import { mockMonthlyTaskDetail, mockVersions, mockInitialMonthlyTaskDetail } from '../../../../../data/production/execution/monthlyTaskDetailData';
import { mockApprovalProcess } from '../../../../../data/plan/annualPlanDetailData';
import { GitCommit, ArrowLeft, ChevronDown, ChevronRight, GitFork } from 'lucide-react';
import clsx from 'clsx';
import { cn } from '../../../../../lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { PrintPreviewDialog } from '../../../../../components/ui/print-preview-dialog';
import { MonthlyTaskPrintTemplate } from './components/monthly-task-print-template';

export default function MonthlyTaskDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Outer tabs
  const [activeTab, setActiveTab] = useState<'form' | 'flow'>('form');
  // Inner tabs
  const [activeCategory, setActiveCategory] = useState<'table' | 'gantt'>('table');
  // Versions
  const [selectedVersion, setSelectedVersion] = useState(mockVersions[0]);
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const currentData = selectedVersion.includes('初始版本') && !isComparing ? mockInitialMonthlyTaskDetail : mockMonthlyTaskDetail;
  const compareData = isComparing ? mockInitialMonthlyTaskDetail : undefined;
  const isInitialVersion = selectedVersion.includes('初始版本');

  const flowchartSteps = [
    { id: 1, title: '待编制(生产管理员)' },
    { id: 2, title: '待审核(生产部门分管领导)', isActive: true },
    { id: 3, title: '待发布(生产管理员)' },
    { id: 4, title: '已发布(生产管理员)' },
    { id: 5, title: '结束' },
  ];

  // Map to the shape expected by preview
  const baseInfo = currentData.baseInfo;
  
  const reconTasks = currentData.productionArrangements.filter(t => t.productionLine === '再造原料').map(t => ({
    ...t, amount: t.productionVolume, deadline: t.completionDate
  }));
  const flavorTasks = currentData.productionArrangements.filter(t => t.productionLine === '香精香料').map(t => ({
    ...t, amount: t.productionVolume, deadline: t.completionDate
  }));
  const otherTasks = currentData.otherArrangements.map(t => ({
    ...t, amount: t.productionVolume, deadline: t.completionDate
  }));

  // Render Version History Left Pane
  const renderVersionHistory = () => {
    const coreVersions = [mockVersions[0], mockVersions[mockVersions.length - 1], selectedVersion];
    const visibleVersions = showAllVersions ? mockVersions : mockVersions.filter(v => coreVersions.includes(v));

    return (
      <div className="w-[200px] border border-[#ebeef5] rounded-sm flex flex-col h-full shrink-0 bg-white">
        <div className="p-4 border-b border-[#ebeef5] text-sm text-[#303133] font-medium bg-[#f5f7fa]">版本历史</div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="relative border-l-2 border-[#ebeef5] ml-3 space-y-6">
            {mockVersions.map((ver, index) => {
              const isVisible = visibleVersions.includes(ver);
              const isCore = coreVersions.includes(ver);
              const prevWasNotCore = index > 0 && !coreVersions.includes(mockVersions[index - 1]);
              
              if (!isVisible) return null;

              return (
                <React.Fragment key={ver}>
                  {/*折叠按钮 */}
                  {isCore && prevWasNotCore && (
                    <div className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-[#ebeef5] bg-[#ebeef5]"></div>
                      <button 
                        className="text-xs text-[#909399] hover:text-[#409eff] underline transition-colors"
                        onClick={() => setShowAllVersions(!showAllVersions)}
                      >
                        {showAllVersions ? '收起中间版本' : '展开所有版本'}
                      </button>
                    </div>
                  )}

                  <div 
                    className="relative pl-6 cursor-pointer group"
                    onClick={() => {
                      setSelectedVersion(ver);
                      if (ver.includes('初始版本')) setIsComparing(false);
                    }}
                  >
                    <div className={clsx(
                      "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-colors",
                      selectedVersion === ver ? "border-[#409eff]" : "border-[#c0c4cc] group-hover:border-[#409eff]"
                    )}>
                      {selectedVersion === ver && <div className="absolute inset-[2px] rounded-full bg-[#409eff]" />}
                    </div>
                    
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-1.5">
                        <span className={clsx("font-medium text-[13px]", selectedVersion === ver ? "text-[#409eff]" : "text-[#303133]")}>
                          {ver.split(' ')[0]}
                        </span>
                        {index === 0 && <span className="text-[10px] bg-[#ecf5ff] text-[#409eff] px-1 py-0.5 rounded leading-none border border-[#b3d8ff]">当前生效</span>}
                      </div>
                      <span className="text-xs text-[#909399] mt-1">{currentData.baseInfo.createTime}</span>
                      <span className="text-xs text-[#909399]">{currentData.baseInfo.creator}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  const renderArrangementTable = (title: string, data: any[], compareListData?: any[], isOther = false) => {
    return (
      <div className="mb-6 bg-white border border-[#ebeef5] rounded-sm overflow-hidden">
        <div className="bg-[#f5f7fa] px-4 py-3 font-semibold text-[#303133] border-b border-[#ebeef5]">
          {title}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#fafafa]">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>生产顺序</TableHead>
                {isOther ? <TableHead>类型</TableHead> : <TableHead>生产线</TableHead>}
                <TableHead>{isOther ? '产品类型' : '产品种类'}</TableHead>
                <TableHead>产品名称 / 牌号</TableHead>
                <TableHead>产品编码</TableHead>
                <TableHead className="text-right">{isOther ? '数量/投料量(吨)' : '计划产量(吨)'}</TableHead>
                <TableHead>预计完成日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const originalItem = compareListData?.find((c: any) => c.id === item.id);
                const volumeChanged = originalItem && originalItem.productionVolume !== item.productionVolume;

                const isExpanded = expandedIds.has(item.id);
                const relatedDemands = currentData.demandDetails.filter(d => d.arrangementId === item.id);
                const hasDemands = relatedDemands.length > 0;
                
                const demandsChanged = relatedDemands.some(demand => {
                  const originalDemand = compareData?.demandDetails.find(d => d.id === demand.id);
                  return originalDemand && originalDemand.requirementAmount !== demand.requirementAmount;
                });

                if (isComparing && showOnlyChanges && !volumeChanged && !demandsChanged) return null;

                return (
                  <React.Fragment key={item.id}>
                    <TableRow className={cn("hover:bg-[#f5f7fa] transition-colors", isExpanded && "bg-[#ecf5ff]")}>
                      <TableCell>
                        {hasDemands && (
                           <button 
                             onClick={() => toggleExpand(item.id)}
                             className="text-gray-500 hover:text-[#409eff] p-1 rounded-sm flex items-center justify-center transition-colors"
                           >
                             {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                           </button>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.productionOrder || (index + 1)}</TableCell>
                      <TableCell>{isOther ? item.type : item.productionLine}</TableCell>
                      <TableCell>{item.productType}</TableCell>
                      <TableCell className="font-medium text-[#409eff]">{item.productName}</TableCell>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell className="text-right flex flex-col items-end">
                        <span className={cn(volumeChanged && "text-[#409eff] font-bold")}>
                           {item.productionVolume}
                        </span>
                        {volumeChanged && (
                          <div className="mt-1 bg-[#fffbe6] border border-[#ffe58f] rounded px-1.5 py-px text-center">
                            <div className="text-[11px] text-[#e6a23c] tabular-nums">
                              <span className="opacity-80 inline-block mr-1">初始:</span>{originalItem.productionVolume}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{item.completionDate}</TableCell>
                    </TableRow>
                    
                    {isExpanded && hasDemands && (
                      <TableRow className="bg-[#fafbfc]">
                         <TableCell colSpan={8} className="p-0 border-b border-[#ebeef5]">
                           <div className="p-4 pl-12">
                             <div className="mb-2 text-sm font-semibold text-[#606266] flex items-center gap-2">
                               <div className="w-1 h-3 bg-[#409eff] rounded-sm"></div>
                               需求明细
                             </div>
                             <div className="border border-[#ebeef5] rounded-sm overflow-hidden text-sm">
                               <Table>
                                  <TableHeader className="bg-[#f5f7fa]">
                                    <TableRow>
                                      <TableHead className="py-2 text-xs">生产类型</TableHead>
                                      <TableHead className="py-2 text-xs">客户名称</TableHead>
                                      <TableHead className="py-2 text-xs">厂内牌号规格</TableHead>
                                      <TableHead className="py-2 text-xs text-right">需求量(吨)</TableHead>
                                      <TableHead className="py-2 text-xs">交货地点</TableHead>
                                      <TableHead className="py-2 text-xs">需求申请人</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {relatedDemands.map(demand => {
                                      const originalDemand = compareData?.demandDetails.find(d => d.id === demand.id);
                                      const reqChanged = originalDemand && originalDemand.requirementAmount !== demand.requirementAmount;

                                      return (
                                        <TableRow key={demand.id}>
                                          <TableCell className="py-2">{demand.productionType}</TableCell>
                                          <TableCell className="py-2">{demand.customerName}</TableCell>
                                          <TableCell className="py-2">{demand.brandGrade} {demand.specification}</TableCell>
                                          <TableCell className="py-2 text-right flex flex-col items-end">
                                            <span className={cn(reqChanged && "text-[#409eff] font-bold")}>
                                              {demand.requirementAmount}
                                            </span>
                                            {reqChanged && (
                                              <div className="mt-1 bg-[#fffbe6] border border-[#ffe58f] rounded px-1.5 py-px text-center">
                                                <div className="text-[11px] text-[#e6a23c] tabular-nums">
                                                  <span className="opacity-80 inline-block mr-1">初始:</span>{originalDemand.requirementAmount}
                                                </div>
                                              </div>
                                            )}
                                          </TableCell>
                                          <TableCell className="py-2">{demand.deliveryLocation}</TableCell>
                                          <TableCell className="py-2">{demand.applicantDepartment} - {demand.applicantName}</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                               </Table>
                             </div>
                           </div>
                         </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    暂无安排数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderTaskTable = () => {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col pt-2">
          {renderArrangementTable('再造原料生产安排', currentData.productionArrangements.filter(t => t.productionLine === '再造原料'), compareData?.productionArrangements.filter(t => t.productionLine === '再造原料'))}
          {renderArrangementTable('香精香料生产安排', currentData.productionArrangements.filter(t => t.productionLine === '香精香料'), compareData?.productionArrangements.filter(t => t.productionLine === '香精香料'))}
          {renderArrangementTable('其他生产安排', currentData.otherArrangements, compareData?.otherArrangements, true)}

          <div className="mb-6 bg-white border border-[#ebeef5] rounded-sm overflow-hidden">
            <div className="bg-[#f5f7fa] px-4 py-3 font-semibold text-[#303133] border-b border-[#ebeef5]">
              其他部门配合事项
            </div>
            <div className="p-4 space-y-4 text-sm text-[#303133]">
              <div className="flex">
                <div className="w-32 font-bold text-[#606266] shrink-0">技改装备处：</div>
                <div>请根据本生产安排做好动力能源供应等工作。</div>
              </div>
              <div className="flex">
                <div className="w-32 font-bold text-[#606266] shrink-0">办公室：</div>
                <div>请根据本生产安排做好班车、食堂保障等工作。</div>
              </div>
              <div className="flex">
                <div className="w-32 font-bold text-[#606266] shrink-0">技术中心：</div>
                <div>请根据本生产安排做好工艺配方下发等工作。</div>
              </div>
              <div className="flex">
                <div className="w-32 font-bold text-[#606266] shrink-0">营销物资处：</div>
                <div>请根据本生产安排做好原辅料保障等工作。</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6 bg-white border border-[#ebeef5] rounded-sm overflow-hidden">
             <div className="bg-[#f5f7fa] px-4 py-3 font-semibold text-[#303133] border-b border-[#ebeef5]">
               备注
             </div>
             <div className="p-4 text-sm text-[#303133]">
               无
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFormData = () => {
    return (
      <div className="flex flex-col h-full bg-white border border-[#ebeef5] rounded-sm">
        {/* Header Info */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#ebeef5] shrink-0 bg-[#fcfdfe]">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg font-bold text-[#303133]">{currentData.baseInfo.taskName}</div>
              <div className="text-xs text-gray-500 mt-1 flex gap-4">
                <span>创建人：{currentData.baseInfo.creator}</span>
                <span>创建时间：{currentData.baseInfo.createTime}</span>
              </div>
            </div>
          </div>
          {!isInitialVersion && (
            <div className="flex items-center gap-3">
              {isComparing && (
                <label className="flex items-center gap-1.5 cursor-pointer ml-1">
                  <input 
                    type="checkbox" 
                    checked={showOnlyChanges} 
                    onChange={(e) => setShowOnlyChanges(e.target.checked)} 
                    className="w-3.5 h-3.5 text-[#409eff] border-[#dcdfe6] rounded focus:ring-0 cursor-pointer" 
                  />
                  <span className="text-[13px] text-[#606266]">只看变动项</span>
                </label>
              )}
              <Button 
                variant={isComparing ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-2 h-9 px-4 transition-all",
                  isComparing 
                    ? "bg-[#409eff] hover:bg-[#66b1ff] text-white border-transparent" 
                    : "border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff]"
                )}
                onClick={() => {
                  setIsComparing(!isComparing);
                  if (isComparing) setShowOnlyChanges(false);
                }}
              >
                <GitFork className="w-4 h-4" />
                <span>{isComparing ? '退出对比' : '版本对比'}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Inner Category Tabs */}
        <div className="flex items-center gap-6 px-6 pt-4 border-b border-[#ebeef5]">
          <div 
            className={cn(
              "pb-3 text-[14px] font-medium cursor-pointer transition-colors relative", 
              activeCategory === 'table' ? "text-[#409eff]" : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveCategory('table')}
          >
            任务表
            {activeCategory === 'table' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#409eff]"></div>
            )}
          </div>
          <div 
            className={cn(
              "pb-3 text-[14px] font-medium cursor-pointer transition-colors relative", 
              activeCategory === 'gantt' ? "text-[#409eff]" : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveCategory('gantt')}
          >
            甘特图
            {activeCategory === 'gantt' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#409eff]"></div>
            )}
          </div>
        </div>

        {isComparing && (
          <div className="mx-6 mt-6 bg-[#fdf6ec] border border-[#f5dab1] px-4 py-3 rounded-sm flex items-center shrink-0">
            <span className="text-[13px] font-medium text-[#e6a23c]">当前正在进行 与初始版本 (V1.0) 的数据对比。 黄色标签为初始版本的数据。</span>
          </div>
        )}

        {/* Master-Detail Content */}
        <div className="p-6 space-y-3 flex-1 overflow-y-auto">
          {activeCategory === 'table' ? renderTaskTable() : (
            <div className="bg-white rounded-lg border border-[#e4e7ed] shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-4 py-3 border-b border-[#e4e7ed] bg-[#fafafa]">
                <h3 className="font-bold text-[#303133]">甘特图排程预览</h3>
              </div>
              <div className="flex-1 overflow-x-auto p-4">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="flex border-b border-gray-300">
                     <div className="w-48 shrink-0 font-bold p-2 border-r border-gray-300">生产任务名称</div>
                     <div className="flex-1 flex">
                       {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <div key={d} className="flex-1 text-xs text-center border-r border-gray-100 p-1 bg-[#f5f7fa]">{d}</div>
                       ))}
                     </div>
                  </div>
                  
                  {/* Rows */}
                  {[...reconTasks, ...flavorTasks].filter(t => t).map((t, idx) => {
                     let dayStart = (idx * 2) % 20 + 1;
                     let duration = Math.round(Math.max(3, (Number(t.amount) || 10) % 7 + 2));
                     if (t.deadline) {
                        const d = new Date(t.deadline.replace(/\//g, '-'));
                        if (!isNaN(d.getDate())) {
                          const end = d.getDate();
                          if (end > 2) {
                            dayStart = Math.max(1, end - duration);
                          } else {
                            dayStart = 1;
                          }
                        }
                     }
                     if (dayStart + duration > 31) duration = 31 - dayStart + 1;
                     return (
                       <div key={idx} className="flex border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                         <div className="w-48 shrink-0 text-xs p-2 border-r border-gray-300 font-medium truncate flex items-center h-10" title={t.productName}>
                           <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shrink-0"></span>
                           {t.productName}
                         </div>
                         <div className="flex-1 flex relative h-10 items-center border-r border-gray-100">
                           {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                              <div key={d} className="flex-1 border-r border-gray-50 h-full"></div>
                           ))}
                           <div 
                             className="absolute h-6 bg-blue-500 rounded shadow-sm text-[10px] text-white flex items-center px-2 overflow-hidden cursor-pointer hover:bg-blue-600 transition-colors z-10"
                             style={{
                                left: `calc(${((dayStart - 1) / 31) * 100}% + 2px)`,
                                width: `calc(${(duration / 31) * 100}% - 4px)`
                             }}
                             title={`${t.productName} 产量: ${t.amount || '-'}`}
                           >
                             <span className="truncate">任务排期 ({duration}天)</span>
                           </div>
                         </div>
                       </div>
                     );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full gap-4 items-stretch p-4">
      {renderVersionHistory()}

      <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm">
        <div className="flex-shrink-0">
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} variant="card">
            <TabsList>
              <TabsTrigger value="form" className="flex items-center gap-2">
                <GitCommit className="w-4 h-4" />
                月度生产任务
              </TabsTrigger>
              <TabsTrigger value="flow">流程图</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className={clsx("flex-1 overflow-y-auto relative", activeTab === 'flow' ? 'bg-white' : 'bg-white')}>
          {activeTab === 'form' && (
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="p-6">
                  {renderFormData()}
                </div>
                
                <div className="border-t border-[#ebeef5] pt-8 mt-8 px-6 pb-6">
                  <div className="text-base font-bold text-[#303133] mb-6 pl-2 border-l-4 border-[#409eff]">过程审批信息</div>
                  <ApprovalProcessTimeline data={mockApprovalProcess} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && <VerticalFlowchart steps={flowchartSteps} />}
        </div>

        <div className="p-4 border-t border-[#ebeef5] bg-white flex items-center justify-end gap-4 shrink-0 relative z-10">
          <Button 
            variant="outline" 
            className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6"
            onClick={() => navigate('/production/execution/monthly-task')}
          >
            返 回
          </Button>
          <Button 
            className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6"
            onClick={() => setIsPrintPreviewOpen(true)}
          >
            导出预览
          </Button>
        </div>
      </div>

      <PrintPreviewDialog 
        isOpen={isPrintPreviewOpen} 
        onClose={() => setIsPrintPreviewOpen(false)}
        title="月度生产任务安排表"
      >
        <MonthlyTaskPrintTemplate data={currentData} />
      </PrintPreviewDialog>
    </div>
  );
}
