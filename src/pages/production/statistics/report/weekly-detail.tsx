import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { VerticalFlowchart } from '../../../../components/ui/vertical-flowchart';
import { ApprovalProcessTimeline } from '../../../../components/ui/approval-process';
import { mockWeeklyMaterialDetails, mockWeeklyFlavorDetails, mockWeeklyTestDetails, mockWeeklyOtherInfo, mockWeeklyWorkSummary, mockWeeklyReportBaseInfo } from '../../../../data/production/statistics/weeklyReportDetailData';
import { mockApprovalProcess } from '../../../../data/plan/annualPlanDetailData'; // Using this for mock data
import { PrintPreviewDialog } from '../../../../components/ui/print-preview-dialog';
import { WeeklyExportPreview } from './weekly-export-preview';
import clsx from 'clsx';

export default function WeeklyReportDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'flow'>('form');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Hardcode data
  const baseInfo = mockWeeklyReportBaseInfo;
  const materials = mockWeeklyMaterialDetails;
  const flavors = mockWeeklyFlavorDetails;
  const tests = mockWeeklyTestDetails;
  const otherInfo = mockWeeklyOtherInfo;
  const workSummary = mockWeeklyWorkSummary;

  const categories = Array.from(new Set(flavors.map(f => f.productionType)));
  const flavorsByCategory = categories.map(cat => ({
    category: cat,
    items: flavors.filter(f => f.productionType === cat)
  }));

  const flavorPlans = [
    { customerName: '江苏中烟', production: 1850, cumulative: 296.63, progress: 0.1603 },
    { customerName: '新桥', production: 220, cumulative: 39.31, progress: 0.1787 },
    { customerName: '合计', production: 2070, cumulative: 335.94, progress: 0.1623 },
  ];

  const flowchartSteps = [
    { id: 1, title: '待提交' },
    { id: 2, title: '待审核(分管领导)' },
    { id: 3, title: '已发布', isActive: true },
    { id: 4, title: '结束' },
  ];

  const formatPercent = (val: number) => {
    return (val * 100).toFixed(2) + '%';
  };

  const renderFormData = () => (
    <div className="flex flex-col space-y-4">
      {/* 顶部信息 */}
      <div className="flex justify-end items-center text-sm text-[#606266] mb-2 space-x-6">
        <span>凭证编号: {baseInfo?.reportNo || '系统自动生成'}</span>
      </div>

      <div className="flex flex-col relative space-y-8">
        
        {/* 基础信息 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-[#303133]">基础信息</h3>
          </div>
          <div className="border border-[#ebeef5] rounded">
            <Table className="border-collapse w-full">
              <TableBody>
                <TableRow className="border-b border-[#ebeef5]">
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">生产周报编号</TableCell>
                  <TableCell className="border-r border-[#ebeef5] text-[#303133]">{baseInfo?.reportNo || '-'}</TableCell>
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">生产周报名称</TableCell>
                  <TableCell className="text-[#303133]">{baseInfo?.reportName || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">状态</TableCell>
                  <TableCell className="border-r border-[#ebeef5] text-[#303133]">{baseInfo?.status || '-'}</TableCell>
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">提交人</TableCell>
                  <TableCell className="text-[#303133]">{baseInfo?.submitter || '-'}</TableCell>
                </TableRow>
                <TableRow className="border-t border-[#ebeef5]">
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">提交时间</TableCell>
                  <TableCell className="border-r border-[#ebeef5] text-[#303133]" colSpan={3}>{baseInfo?.submitTime || '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 报表信息 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-[#303133]">报表信息</h3>
          </div>
          
          <div className="flex flex-col space-y-8">
            
            {/* 再造原料生产情况 */}
            <div>
              <h4 className="font-medium text-sm text-[#303133] mb-3">一、再造原料生产情况（单位：吨）</h4>
              <div className="border border-[#ebeef5] rounded">
                <Table className="border-collapse w-full">
                  <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
                    <TableRow className="bg-[#f5f7fa]">
                      <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">序号</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">产品类型</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">牌号</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">实际产量</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold">备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((m, i) => (
                      <TableRow key={`mat-${i}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                        <TableCell className="text-center border-r border-[#ebeef5]">{i + 1}</TableCell>
                        <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{m.productType}</TableCell>
                        <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{m.brandCode}</TableCell>
                        <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{m.actualProduction}</TableCell>
                        <TableCell className="text-center text-[#303133]">{m.remark || '-'}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                      <TableCell colSpan={3} className="text-center border-r border-[#ebeef5]">小计</TableCell>
                      <TableCell colSpan={2} className="text-center text-[#303133]">{materials[0]?.subtotalActualProduction}</TableCell>
                    </TableRow>
                    {/* 年度计划 */}
                    <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                      <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">再造烟叶年度计划产量</TableCell>
                      <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedTobaccoYearlyPlan}</TableCell>
                      <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">累计完成产量</TableCell>
                      <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedTobaccoCumulative}</TableCell>
                      <TableCell className="text-center bg-[#f5f7fa]">产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(materials[0]?.reconstitutedTobaccoProgress || 0)}</span></TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                      <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">再造梗丝年度计划产量</TableCell>
                      <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedStemYearlyPlan}</TableCell>
                      <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">累计完成产量</TableCell>
                      <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedStemCumulative}</TableCell>
                      <TableCell className="text-center bg-[#f5f7fa]">产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(materials[0]?.reconstitutedStemProgress || 0)}</span></TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                      <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">多孔颗粒年度计划产量</TableCell>
                      <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.porousGranuleYearlyPlan}</TableCell>
                      <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">累计完成产量</TableCell>
                      <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.porousGranuleCumulative}</TableCell>
                      <TableCell className="text-center bg-[#f5f7fa]">产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(materials[0]?.porousGranuleProgress || 0)}</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 香精香料 */}
            <div>
              <h4 className="font-medium text-sm text-[#303133] mb-3">二、香精香料生产情况（单位：吨）</h4>
              <div className="border border-[#ebeef5] rounded">
                <Table className="border-collapse w-full">
                  <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
                    <TableRow className="bg-[#f5f7fa]">
                      <TableHead className="w-20 text-center text-[#303133] font-bold border-r border-[#ebeef5]">序号</TableHead>
                      <TableHead className="w-32 text-center text-[#303133] font-bold border-r border-[#ebeef5]">生产类型</TableHead>
                      <TableHead className="w-64 text-center text-[#303133] font-bold border-r border-[#ebeef5]">牌号</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">实际产量</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold">备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flavorsByCategory.map((catGroup, catIdx) => {
                      const startIndex = flavorsByCategory.slice(0, catIdx).reduce((acc, curr) => acc + curr.items.length, 0);
                      return (
                        <React.Fragment key={`cat-${catIdx}`}>
                          {catGroup.items.map((item, itemIdx) => (
                            <TableRow key={`flavor-${catIdx}-${itemIdx}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                              <TableCell className="text-center border-r border-[#ebeef5]">{startIndex + itemIdx + 1}</TableCell>
                              {itemIdx === 0 && (
                                 <TableCell rowSpan={catGroup.items.length} className="text-center bg-white border-r border-[#ebeef5]">{catGroup.category}</TableCell>
                              )}
                              <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{item.brandCode}</TableCell>
                              <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">
                                {item.actualProduction}
                              </TableCell>
                              <TableCell className="text-center">{item.remark || '-'}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5] bg-[#fafafa]">
                            <TableCell colSpan={3} className="text-center font-medium border-r border-[#ebeef5]">小计</TableCell>
                            <TableCell colSpan={2} className="text-center text-[#303133]">
                              {catGroup.items[0]?.subtotalActualProduction}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                    <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5] hover:bg-[#fafafa]">
                      <TableCell colSpan={3} className="text-center font-medium border-r border-[#ebeef5]">合计</TableCell>
                      <TableCell colSpan={2} className="text-center text-[#303133]">
                        117.535
                      </TableCell>
                    </TableRow>

                    {flavorPlans.map((plan, i) => (
                      <TableRow key={`plan-${i}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                        {i === 0 && (
                          <TableCell rowSpan={flavorPlans.length} className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">香精香料<br/>年度计划<br/>产量</TableCell>
                        )}
                        <TableCell colSpan={2} className="text-center border-r border-[#ebeef5] bg-white">
                          <div className="flex justify-between px-6">
                            <span>{plan.customerName}</span>
                            <span className="text-[#303133]">{plan.production}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">
                          累计完成产量<span className="text-[#303133] font-normal ml-4">{plan.cumulative}</span>
                        </TableCell>
                        <TableCell className="text-center bg-[#f5f7fa]">
                          产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(plan.progress)}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 工艺配方试验情况 */}
            <div>
              <h4 className="font-medium text-sm text-[#303133] mb-3">三、工艺配方试验情况（kg）</h4>
              <div className="border border-[#ebeef5] rounded">
                <Table className="border-collapse w-full">
                  <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
                    <TableRow className="bg-[#f5f7fa]">
                      <TableHead className="w-24 text-center text-[#303133] font-bold border-r border-[#ebeef5]">序号</TableHead>
                      <TableHead className="w-64 text-center text-[#303133] font-bold border-r border-[#ebeef5]">配方名称</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">实际产量</TableHead>
                      <TableHead className="text-center text-[#303133] font-bold">备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((t, i) => (
                      <TableRow key={`test-${i}`} className="hover:bg-gray-50 border-b border-[#ebeef5] min-h-[40px]">
                        <TableCell className="text-center border-r border-[#ebeef5]">{i + 1}</TableCell>
                        <TableCell className="text-center border-r border-[#ebeef5]">{t.recipeName}</TableCell>
                        <TableCell className="text-center border-r border-[#ebeef5]">{t.actualProduction === 0 ? '' : t.actualProduction}</TableCell>
                        <TableCell className="text-center">{t.remark}</TableCell>
                      </TableRow>
                    ))}
                    {tests.length < 2 && (
                       <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5] min-h-[40px]">
                        <TableCell className="text-center border-r border-[#ebeef5]">2</TableCell>
                        <TableCell className="text-center border-r border-[#ebeef5]"></TableCell>
                        <TableCell className="text-center border-r border-[#ebeef5]"></TableCell>
                        <TableCell className="text-center"></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 其他情况 */}
            <div>
              <h4 className="font-medium text-sm text-[#303133] mb-3">四、其他情况</h4>
              <div className="w-full border border-[#ebeef5] rounded min-h-[60px] p-3 text-sm text-[#606266] bg-white whitespace-pre-wrap">
                <div className="flex">
                  <span className="font-medium w-48 shrink-0">翻箱、预混、贴标、筛分等（规格、数量等信息）</span>
                  <span>{otherInfo.otherActivitiesSummary}</span>
                </div>
              </div>
            </div>

            {/* 各条线工作简述 */}
            <div>
              <h4 className="font-medium text-sm text-[#303133] mb-3">五、各条线工作简述</h4>
              <div className="w-full border border-[#ebeef5] rounded min-h-[80px] p-3 text-sm text-[#606266] bg-white whitespace-pre-wrap">
                {workSummary.workSummary}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm">
            
            {/* 顶部标签页 */}
            <div className="flex-shrink-0">
              <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} variant="card">
                <TabsList>
                  <TabsTrigger value="form">生产周报</TabsTrigger>
                  <TabsTrigger value="flow">流程图</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 内容区 */}
            <div className={clsx("flex-1 overflow-y-auto relative bg-white")}>
              {activeTab === 'form' && (
                <div className="space-y-10 p-6">
                  <div className="bg-white">
                    {renderFormData()}
                  </div>

                  {/* 过程审批信息 */}
                  <div className="border-t border-[#ebeef5] pt-8 mt-8">
                    <div className="text-base font-bold text-[#303133] mb-6 pl-2 border-l-4 border-[#409eff]">过程审批信息</div>
                    <ApprovalProcessTimeline data={mockApprovalProcess} />
                  </div>
                </div>
              )}
              {activeTab === 'flow' && (
                <div className="p-6">
                  <VerticalFlowchart steps={flowchartSteps} />
                </div>
              )}
            </div>

            {/* 底部按钮区 (固定在容器底部) */}
            <div className="p-4 border-t border-[#ebeef5] bg-white flex items-center justify-end gap-4 shrink-0 relative z-10">
              <Button onClick={() => setIsPreviewOpen(true)} variant="outline" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6">
                导出预览
              </Button>
              <Button type="button" className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 min-w-[80px]" onClick={() => navigate(-1)}>
                返 回
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PrintPreviewDialog 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="生产周报导出预览"
      >
        <WeeklyExportPreview 
          materials={materials} 
          flavorsByCategory={flavorsByCategory} 
          tests={tests}
          otherInfo={otherInfo}
          workSummary={workSummary}
          flavorPlans={flavorPlans}
          reportName={baseInfo?.reportName}
          reportNo={baseInfo?.reportNo}
          submitTime={baseInfo?.submitTime}
          submitter={baseInfo?.submitter}
        />
      </PrintPreviewDialog>
    </div>
  );
}
