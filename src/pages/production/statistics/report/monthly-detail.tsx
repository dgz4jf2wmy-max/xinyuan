import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '../../../../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { VerticalFlowchart } from '../../../../components/ui/vertical-flowchart';
import { ApprovalProcessTimeline } from '../../../../components/ui/approval-process';
import { mockMonthlyReportDetailBaseInfo, mockMonthlyReportDetailItems } from '../../../../data/production/statistics/monthlyReportDetailData';
import { ProductionMonthlyReportReportInfo } from '../../../../types/production/statistics/report';
import { mockApprovalProcess } from '../../../../data/plan/annualPlanDetailData';
import { PrintPreviewDialog } from '../../../../components/ui/print-preview-dialog';
import { MonthlyExportPreview } from './monthly-export-preview';
import clsx from 'clsx';

export default function MonthlyReportDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'flow'>('form');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Hardcode data
  const items = mockMonthlyReportDetailItems;
  const baseInfo = mockMonthlyReportDetailBaseInfo;

  const flowchartSteps = [
    { id: 1, title: '待提交' },
    { id: 2, title: '待审核(分管领导)' },
    { id: 3, title: '已发布', isActive: true },
    { id: 4, title: '结束' },
  ];

  const tobaccoItems = items.filter(i => i.productType === '再造烟叶');
  const stemItems = items.filter(i => i.productType === '再造梗丝');

  const sumField = (arr: ProductionMonthlyReportReportInfo[], field: keyof ProductionMonthlyReportReportInfo) => {
    return arr.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  };

  const globalFlavorVol = items[0]?.flavorProductionLineMonthlyActualDeploymentWarehousingVolume || 0;

  const renderFormData = () => (
    <div className="flex flex-col space-y-4">
      {/* 顶部信息 */}
      <div className="flex justify-end items-center text-sm text-[#606266] mb-2 space-x-6">
        <span>月报编号: {baseInfo?.reportNo || '系统自动生成'}</span>
      </div>

      {/* 详情数据录入表格 (只读) */}
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
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">生产月报编号</TableCell>
                  <TableCell className="border-r border-[#ebeef5] text-[#303133]">{baseInfo?.reportNo || '-'}</TableCell>
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">生产月报名称</TableCell>
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
          
          <div className="border border-[#ebeef5] rounded overflow-hidden">
            <Table className="border-collapse w-full border-hidden">
              <TableBody>
                {/* Row 1: 产品种类 */}
                <TableRow className="bg-[#f5f7fa] hover:bg-transparent">
                  <TableCell className="w-32 text-center text-[#303133] font-bold border-r border-b border-[#ebeef5]">产品种类</TableCell>
                  <TableCell className="text-center text-[#303133] font-bold border-r border-b border-[#ebeef5]" colSpan={tobaccoItems.length + 1}>再造烟叶线</TableCell>
                  <TableCell className="text-center text-[#303133] font-bold border-r border-b border-[#ebeef5]" colSpan={stemItems.length + 1}>再造梗丝线</TableCell>
                  <TableCell className="w-40 text-center text-[#303133] font-bold border-b border-[#ebeef5]" rowSpan={2}>香精香料生产线当月实际调配入库量（吨）</TableCell>
                </TableRow>

                {/* Row 2: 牌号 */}
                <TableRow className="bg-[#f5f7fa] hover:bg-transparent">
                  <TableCell className="text-center text-[#303133] font-bold border-r border-b border-[#ebeef5]">牌号</TableCell>
                  {tobaccoItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] font-medium border-r border-b border-[#ebeef5] w-24">
                      {item.brandCode}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#303133] font-bold border-r border-b border-[#ebeef5] w-24">合计</TableCell>
                  {stemItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] font-medium border-r border-b border-[#ebeef5] w-24">
                      {item.brandCode}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#303133] font-bold border-r border-b border-[#ebeef5] w-24">合计</TableCell>
                </TableRow>

                {/* Row 3: 原料消耗 (吨) */}
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center bg-[#f5f7fa] text-[#303133] font-bold border-r border-b border-[#ebeef5]">原料消耗（吨）</TableCell>
                  {tobaccoItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                      {item.materialConsumption}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">{sumField(tobaccoItems, 'materialConsumption')}</TableCell>
                  {stemItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                      {item.materialConsumption}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">{sumField(stemItems, 'materialConsumption')}</TableCell>
                  <TableCell className="text-center text-[#409eff] font-bold border-b border-[#ebeef5] align-middle" rowSpan={6}>
                    {globalFlavorVol}
                  </TableCell>
                </TableRow>

                {/* Row 4: 实际产量 (吨) */}
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center bg-[#f5f7fa] text-[#303133] font-bold border-r border-b border-[#ebeef5]">实际产量（吨）</TableCell>
                  {tobaccoItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                      {item.actualProduction}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">{sumField(tobaccoItems, 'actualProduction')}</TableCell>
                  {stemItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                      {item.actualProduction}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">{sumField(stemItems, 'actualProduction')}</TableCell>
                </TableRow>

                {/* Row 5: 入库产量 (吨) */}
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center bg-[#f5f7fa] text-[#303133] font-bold border-r border-b border-[#ebeef5]">入库产量（吨）</TableCell>
                  {tobaccoItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                      {item.warehousingProduction}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">{sumField(tobaccoItems, 'warehousingProduction')}</TableCell>
                  {stemItems.map((item) => (
                    <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                      {item.warehousingProduction}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">{sumField(stemItems, 'warehousingProduction')}</TableCell>
                </TableRow>

                {/* Row 6: 得率 (%) */}
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center bg-[#f5f7fa] text-[#303133] font-bold border-r border-b border-[#ebeef5]">得率（%）</TableCell>
                  {tobaccoItems.map((item) => {
                     const yieldVal = item.materialConsumption > 0 ? (item.actualProduction / item.materialConsumption) * 100 : 0;
                     return (
                       <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                          {yieldVal.toFixed(2)}
                       </TableCell>
                     );
                  })}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">
                    {(sumField(tobaccoItems, 'materialConsumption') > 0 ? (sumField(tobaccoItems, 'actualProduction') / sumField(tobaccoItems, 'materialConsumption')) * 100 : 0).toFixed(2)}
                  </TableCell>
                  {stemItems.map((item) => {
                     const yieldVal = item.materialConsumption > 0 ? (item.actualProduction / item.materialConsumption) * 100 : 0;
                     return (
                       <TableCell key={item.brandCode} className="text-center text-[#303133] border-r border-b border-[#ebeef5]">
                          {yieldVal.toFixed(2)}
                       </TableCell>
                     );
                  })}
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]">
                    {(sumField(stemItems, 'materialConsumption') > 0 ? (sumField(stemItems, 'actualProduction') / sumField(stemItems, 'materialConsumption')) * 100 : 0).toFixed(2)}
                  </TableCell>
                </TableRow>

                {/* Row 7: 月度生产时间 (h) */}
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center bg-[#f5f7fa] text-[#303133] font-bold border-r border-b border-[#ebeef5]">月度生产时间（h）</TableCell>
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]" colSpan={tobaccoItems.length + 1}>
                    {tobaccoItems[0]?.monthlyProductionTime || 0}
                  </TableCell>
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-b border-[#ebeef5]" colSpan={stemItems.length + 1}>
                    {stemItems[0]?.monthlyProductionTime || 0}
                  </TableCell>
                </TableRow>

                {/* Row 8: 月度平均日产量 (吨) */}
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center bg-[#f5f7fa] text-[#303133] font-bold border-r border-[#ebeef5]">月度平均日产量(吨)</TableCell>
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-[#ebeef5]" colSpan={tobaccoItems.length + 1}>
                    {tobaccoItems[0]?.monthlyAverageDailyProduction || 0}
                  </TableCell>
                  <TableCell className="text-center text-[#409eff] font-medium border-r border-[#ebeef5]" colSpan={stemItems.length + 1}>
                    {stemItems[0]?.monthlyAverageDailyProduction || 0}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full gap-4 items-stretch">
      <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm">
        
        {/* 顶部标签页 */}
        <div className="flex-shrink-0">
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} variant="card">
            <TabsList>
              <TabsTrigger value="form">生产月报</TabsTrigger>
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
          <Button variant="outline" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6" onClick={() => setIsPreviewOpen(true)}>
            导出预览
          </Button>
          <Button type="button" className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 min-w-[80px]" onClick={() => navigate('/production/statistics/report?tab=monthly')}>
            返 回
          </Button>
        </div>
      </div>

      <PrintPreviewDialog 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="生产月报导出预览"
      >
        <MonthlyExportPreview 
          items={items}
          reportName={baseInfo?.reportName}
          reportNo={baseInfo?.reportNo}
          submitTime={baseInfo?.submitTime}
          submitter={baseInfo?.submitter}
        />
      </PrintPreviewDialog>
    </div>
  );
}
