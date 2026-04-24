import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { ApprovalProcessTimeline } from '../../../../components/ui/approval-process';
import { VerticalFlowchart } from '../../../../components/ui/vertical-flowchart';
import { mockMonthlyProductionPlanDetail, versions, mockInitialMonthlyPlanDetail } from '../../../../data/plan/monthlyPlanDetailData';
import { mockApprovalProcess } from '../../../../data/plan/annualPlanDetailData';
import { ChevronDown, ChevronRight, GitCommit, ArrowLeft, GitFork } from 'lucide-react';
import { MonthlyProductionPlanTable, MonthlyPlanStatus } from '../../../../types/monthly-plan';
import { PrintPreviewDialog } from '../../../../components/ui/print-preview-dialog';
import { MonthlyPlanPrintTemplate } from './components/monthly-plan-print-template';
import { RawMaterialInventoryDialog } from '../components/raw-material-inventory-dialog';
import { ProjectProgressConfirmDialog } from '../components/project-progress-confirm-dialog';
import clsx from 'clsx';
import { cn } from '../../../../lib/utils';

export default function MonthlyProductionPlanDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Outer tabs
  const [activeTab, setActiveTab] = useState<'form' | 'flow'>('form');
  // Inner tabs
  const [activeCategory, setActiveCategory] = useState<'raw_material' | 'fragrance'>('raw_material');
  // Versions
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  const [isComparing, setIsComparing] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  
  const [expandedTableIds, setExpandedTableIds] = useState<Set<string>>(new Set());
  const [showAllVersions, setShowAllVersions] = useState(false);

  const isInitialVersion = selectedVersion.includes('初始版本');

  // Render Version History Left Pane
  const renderVersionHistory = () => {
    const coreVersions = [versions[0], versions[versions.length - 1], selectedVersion];
    const visibleVersions = showAllVersions ? versions : versions.filter(v => coreVersions.includes(v));

    return (
      <div className="w-[200px] border border-[#ebeef5] rounded-sm flex flex-col h-full shrink-0 bg-white">
        <div className="p-4 border-b border-[#ebeef5] text-sm text-[#303133] font-medium bg-[#f5f7fa]">版本历史</div>
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="relative border-l-2 border-[#ebeef5] ml-3 space-y-6">
            {versions.map((ver, index) => {
              const isVisible = visibleVersions.includes(ver);
              const isCore = coreVersions.includes(ver);
              const prevWasNotCore = index > 0 && !coreVersions.includes(versions[index - 1]);
              
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
                      <span className="text-xs text-[#909399] mt-1">{mockMonthlyProductionPlanDetail.createTime}</span>
                      <span className="text-xs text-[#909399]">{mockMonthlyProductionPlanDetail.creator}</span>
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

  const currentData = isInitialVersion ? mockInitialMonthlyPlanDetail : mockMonthlyProductionPlanDetail;
  const initialData = mockInitialMonthlyPlanDetail;

  const flowchartSteps = [
    { id: 1, title: '草稿中(计划管理员)' },
    { id: 2, title: '待试验信息完善(项目负责人/技术中心)' },
    { id: 3, title: '待审核(分管领导)' },
    { id: 4, title: '已发布(计划管理员)', isActive: true },
    { id: 5, title: '结束' },
  ];

  const currentTables = useMemo(() => {
    return currentData.planList.filter(t => {
      if (activeCategory === 'raw_material') {
        return t.productType.includes('烟叶') || t.productType.includes('梗丝') || t.productType.includes('颗粒');
      } else {
        return t.productType.includes('料液') || t.productType.includes('表香');
      }
    });
  }, [activeCategory, currentData]);

  const totalProductionVolume = useMemo(() => {
    return currentTables.reduce((sum, row) => sum + (row.productionVolume || 0), 0);
  }, [currentTables]);

  const getInitialValueForTable = (brandGrade: string, productType: string) => {
    return initialData.planList.find(t => t.brandGrade === brandGrade && t.productType === productType)?.productionVolume || 0;
  };

  const getDetailsForTable = (table: MonthlyProductionPlanTable) => {
    return currentData.details?.filter(d => d.brandGrade === table.brandGrade && d.productType === table.productType) || [];
  };

  const toggleTableExpand = (rowId: string) => {
    const newExpanded = new Set(expandedTableIds);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedTableIds(newExpanded);
  };

  const renderFormData = () => {
    return (
      <div className="flex flex-col h-full bg-white border border-[#ebeef5] rounded-sm">
        {/* Comparison Toggle and Breadcrumb Info */}
        <div className="px-6 py-4 border-b border-[#ebeef5] flex justify-between items-center bg-[#fcfdfe]">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg font-bold text-[#303133]">{currentData.planName}</div>
              <div className="text-xs text-gray-500 mt-1 flex gap-4">
                <span>创建人：{currentData.creator}</span>
                <span>创建时间：{currentData.createTime}</span>
              </div>
            </div>
          </div>
          {!isInitialVersion && (
            <div className="flex gap-3">
              {currentData.status === MonthlyPlanStatus.PendingImprovement && (
                <Button 
                  variant="outline"
                  className="border-[#67c23a] text-[#67c23a] hover:bg-[#f0f9eb] transition-all"
                  onClick={() => setIsProgressDialogOpen(true)}
                >
                  试验信息完善进度
                </Button>
              )}
              <Button 
                variant="outline"
                className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] transition-all"
                onClick={() => setIsInventoryDialogOpen(true)}
              >
                原料库存对比
              </Button>
              <Button 
                variant={isComparing ? "default" : "outline"}
                className={cn(
                  "flex items-center gap-2 h-9 px-4 transition-all",
                  isComparing 
                    ? "bg-[#409eff] hover:bg-[#66b1ff] text-white border-transparent" 
                    : "border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff]"
                )}
                onClick={() => setIsComparing(!isComparing)}
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
              activeCategory === 'raw_material' ? "text-[#409eff]" : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveCategory('raw_material')}
          >
            再造原料
            {activeCategory === 'raw_material' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#409eff]"></div>
            )}
          </div>
          <div 
            className={cn(
              "pb-3 text-[14px] font-medium cursor-pointer transition-colors relative", 
              activeCategory === 'fragrance' ? "text-[#409eff]" : "text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveCategory('fragrance')}
          >
            香精香料
            {activeCategory === 'fragrance' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#409eff]"></div>
            )}
          </div>
        </div>

        {/* Master-Detail Table */}
        <div className="p-4 space-y-3">
          {isComparing && (
            <div className="bg-white border border-orange-100 rounded-sm px-4 py-2 flex items-center gap-2">
              <span className="text-sm text-orange-800">
                当前正在进行 <span className="font-bold text-black font-sans">与初始版本 (V1.0)</span> 的数据对比。
                <span className="ml-2 text-orange-700/70 text-xs">黄色标签为初始版本的数据。</span>
              </span>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center">
              <span className="font-bold text-[13px] text-gray-700">月度产销计划表 ({activeCategory === 'raw_material' ? '再造原料' : '香精香料'})</span>
            </div>
            
            <div className="overflow-auto bg-white">
              <Table>
                <TableHeader className="bg-[#f5f7fa] sticky top-0 z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-10 p-0 text-center"></TableHead>
                    <TableHead className="w-16 text-center text-[12px] font-bold text-gray-600">序号</TableHead>
                    <TableHead className="text-[12px] w-32 font-bold text-gray-600">产品类别</TableHead>
                    <TableHead className="text-[12px] min-w-[200px] font-bold text-gray-600">牌号</TableHead>
                    <TableHead className="text-right text-[12px] w-32 font-bold text-gray-600">总产量/吨</TableHead>
                    <TableHead className="text-[12px] font-bold text-gray-600">备注</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {currentTables.length > 0 ? (
                     <>
                       {currentTables.map((row, idx) => {
                         const isExpanded = expandedTableIds.has(row.id);
                         const details = getDetailsForTable(row);
                         const initialValue = getInitialValueForTable(row.brandGrade, row.productType);
                         const hasChanged = isComparing && initialValue !== row.productionVolume;
                         
                         return (
                           <React.Fragment key={row.id}>
                            <TableRow 
                              className={cn(
                                "hover:bg-gray-50 border-b-gray-50 group cursor-pointer",
                                isComparing && "bg-white"
                              )} 
                              onClick={() => toggleTableExpand(row.id)}
                            >
                              <TableCell className="w-8 p-0 text-center">
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-500 m-auto" /> : <ChevronRight className="w-4 h-4 text-gray-400 m-auto" />}
                              </TableCell>
                              <TableCell className="text-center font-medium text-gray-500 text-[12px]">{idx + 1}</TableCell>
                              <TableCell className="text-gray-700 text-[12px]">{row.productType}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[12px] text-gray-800">{row.brandGrade}</span>
                                  {details.length > 1 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap bg-orange-50 text-orange-600 border-orange-200 font-medium">
                                      合并 {details.length} 项需求
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right text-[12px] py-3">
                                <div className="flex flex-col items-end">
                                  <span className={cn("font-bold text-[13px]", hasChanged ? "text-[#409eff]" : "text-gray-900")}>
                                    {row.productionVolume.toFixed(2)}
                                  </span>
                                  {isComparing && (
                                    <div className="mt-1 bg-[#fffbe6] border border-[#ffe58f] rounded-[2px] px-2 py-0.5 min-w-[70px] text-center">
                                      <div className="text-[10px] text-[#e6a23c] font-medium tabular-nums">
                                        <span className="scale-90 inline-block mr-0.5">初始:</span>{initialValue.toFixed(2)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-[12px] text-gray-500">
                                {row.remarks || '--'}
                              </TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow className="bg-[#fcfdfe] hover:bg-[#fcfdfe] border-b-0 shadow-inner">
                                <TableCell colSpan={6} className="p-0">
                                  <div className="px-10 py-3 border-l-2 border-blue-400 ml-4 mb-2">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-[12px] font-bold text-gray-600">编排明细溯源 (共 {details.length} 条需求来源)</span>
                                    </div>
                                    <div className="border border-gray-200 rounded-sm overflow-hidden bg-white">
                                      <Table>
                                        <TableHeader className="bg-[#f5f7fa]">
                                          <TableRow>
                                            <TableHead className="w-12 text-center text-[10px] text-gray-500 py-1.5 h-auto">排号</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto">牌号</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto">产品名称</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto">客户</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto">规格</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto text-right">需求量</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto text-right">无税单价</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto text-right">无税金额</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto">期望到货</TableHead>
                                            <TableHead className="text-[10px] text-gray-500 py-1.5 h-auto">申请人</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {details.map((d, dIdx) => (
                                            <TableRow key={d.id} className="hover:bg-blue-50/50">
                                              <TableCell className="text-center font-medium text-gray-400 text-[10px] py-1">{dIdx + 1}</TableCell>
                                              <TableCell className="font-medium text-gray-700 text-[10px] py-1">{d.brandGrade}</TableCell>
                                              <TableCell className="text-gray-500 text-[10px] py-1">{d.productName}</TableCell>
                                              <TableCell className="text-gray-500 text-[10px] py-1">{d.customerName}</TableCell>
                                              <TableCell className="text-gray-500 text-[10px] py-1">{d.specification}</TableCell>
                                              <TableCell className="font-bold text-gray-600 text-right text-[10px] py-1">
                                                {d.requirementAmount} {d.unit}
                                              </TableCell>
                                              <TableCell className="text-gray-500 text-right text-[10px] py-1">{d.unitPriceExclTax}</TableCell>
                                              <TableCell className="text-gray-500 text-right text-[10px] py-1">{d.amountExclTax}</TableCell>
                                              <TableCell className="text-gray-500 text-[10px] py-1">{d.expectedCompletionDate}</TableCell>
                                              <TableCell className="text-gray-500 text-[10px] py-1">{d.applicantName}</TableCell>
                                            </TableRow>
                                          ))}
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
                       {/* 合计行 */}
                       <TableRow className="bg-[#f8f9fb] font-bold border-t-2 border-gray-200">
                         <TableCell colSpan={4} className="text-center text-[12px] text-gray-700 py-3">合计</TableCell>
                         <TableCell className="text-right text-[13px] text-blue-700 py-3">
                           {totalProductionVolume.toFixed(3).replace(/\.?0+$/, '')}
                         </TableCell>
                         <TableCell className="py-3"></TableCell>
                       </TableRow>
                     </>
                   ) : (
                     <TableRow>
                       <TableCell colSpan={6} className="text-center py-10 text-gray-400 text-[13px]">
                         暂无{activeCategory === 'raw_material' ? '再造原料' : '香精香料'}计划表数据
                       </TableCell>
                     </TableRow>
                   )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full gap-4 items-stretch">
      {renderVersionHistory()}

      <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm">
        <div className="flex-shrink-0">
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} variant="card">
            <TabsList>
              <TabsTrigger value="form" className="flex items-center gap-2">
                <GitCommit className="w-4 h-4" />
                月度产销计划
              </TabsTrigger>
              <TabsTrigger value="flow">流程图</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className={clsx("flex-1 overflow-y-auto relative", activeTab === 'flow' ? 'bg-white' : 'bg-white')}>
          {activeTab === 'form' && (
            <div className="space-y-10 p-6">
              {renderFormData()}
              
              <div className="border-t border-[#ebeef5] pt-8 mt-8">
                <div className="text-base font-bold text-[#303133] mb-6 pl-2 border-l-4 border-[#409eff]">过程审批信息</div>
                <ApprovalProcessTimeline data={mockApprovalProcess} />
              </div>
            </div>
          )}

          {activeTab === 'flow' && <VerticalFlowchart steps={flowchartSteps} />}
        </div>

        <div className="p-4 border-t border-[#ebeef5] bg-white flex items-center justify-end gap-4 shrink-0 relative z-10">
          <Button 
            variant="outline" 
            className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6"
            onClick={() => navigate('/plan/monthly')}
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
        title="月度产销计划导出预览"
      >
        <MonthlyPlanPrintTemplate data={currentData} />
      </PrintPreviewDialog>

      <RawMaterialInventoryDialog 
        isOpen={isInventoryDialogOpen}
        onClose={() => setIsInventoryDialogOpen(false)}
      />

      <ProjectProgressConfirmDialog 
        isOpen={isProgressDialogOpen}
        onClose={() => setIsProgressDialogOpen(false)}
      />
    </div>
  );
}
