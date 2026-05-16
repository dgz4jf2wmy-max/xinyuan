import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { VerticalFlowchart } from '../../../../components/ui/vertical-flowchart';
import { ApprovalProcessTimeline } from '../../../../components/ui/approval-process';
import { mockProductionStatisticsReportData, mockBaseInfo, ProductionStatisticsReportItem } from '../../../../data/production/statistics/analysisReportEditData';
import { mockApprovalProcess } from '../../../../data/plan/annualPlanDetailData'; 
import { PrintPreviewDialog } from '../../../../components/ui/print-preview-dialog';
import { StatisticsReportExportPreview } from './export-preview';
import clsx from 'clsx';

export default function StatisticsReportDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'flow'>('form');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const data = mockProductionStatisticsReportData;
  const baseInfo = mockBaseInfo;

  const calculateRowSpan = (list: ProductionStatisticsReportItem[], key: keyof ProductionStatisticsReportItem) => {
    const spanMap: Record<number, number> = {};
    let currentVal: any = null;
    let startIdx = 0;
    
    list.forEach((item, index) => {
      if (item[key] !== currentVal) {
        currentVal = item[key];
        spanMap[index] = 1;
        startIdx = index;
      } else {
        spanMap[startIdx] += 1;
        spanMap[index] = 0;
      }
    });
    return spanMap;
  };

  const monthSpans = calculateRowSpan(data, 'month');

  const flowchartSteps = [
    { id: 1, title: '待提交' },
    { id: 2, title: '待审核(分管领导)' },
    { id: 3, title: '已发布', isActive: true },
    { id: 4, title: '结束' },
  ];

  const renderFormData = () => (
    <div className="flex flex-col space-y-4">
      {/* 顶部信息 */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm text-[#303133]">基础信息</h3>
        <span className="text-sm text-[#606266]">报表编号: {baseInfo?.reportNo || '系统自动生成'}</span>
      </div>

      <div className="flex flex-col relative space-y-8">
        
        {/* 基础信息表格 */}
        <div className="border border-[#ebeef5] rounded">
          <Table className="border-collapse w-full">
            <TableBody>
              <TableRow className="border-b border-[#ebeef5]">
                <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">报表编号</TableCell>
                <TableCell className="border-r border-[#ebeef5] text-[#303133]">{baseInfo?.reportNo || '-'}</TableCell>
                <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">状态</TableCell>
                <TableCell className="text-[#303133]">{baseInfo?.status || '-'}</TableCell>
              </TableRow>
              <TableRow className="border-t border-[#ebeef5]">
                <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">提交人</TableCell>
                <TableCell className="border-r border-[#ebeef5] text-[#303133]">{baseInfo?.submitter || '-'}</TableCell>
                <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">提交时间</TableCell>
                <TableCell className="text-[#303133]">{baseInfo?.submitTime || '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 数据明细 */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-sm text-[#303133]">数据明细</h3>
            <div className="text-xs text-[#606266] flex items-center">
              部门：生产管理处（在制品：计入实际产量，未计入入库产量；回掺品：计入入库产量。实际产量需扣除该部分。计划量底色 <span className="inline-block w-3 h-3 bg-[#409eff] ml-1 mr-1"></span> 为增补，<span className="inline-block w-3 h-3 bg-[#e6a23c] ml-1 mr-1"></span> 为调整）
            </div>
          </div>
          
          <div className="overflow-x-auto rounded border border-[#ebeef5]">
            <Table className="border-collapse w-max min-w-full">
              <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa] shadow-[0_1px_0_#ebeef5]">
                <TableRow>
                  <TableHead className="sticky left-0 z-30 bg-[#f5f7fa] min-w-[60px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">月份</TableHead>
                  <TableHead className="sticky left-[60px] z-30 bg-[#f5f7fa] min-w-[60px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">生产<br/>顺序</TableHead>
                  <TableHead className="sticky left-[120px] z-30 bg-[#f5f7fa] min-w-[60px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">类别</TableHead>
                  <TableHead className="sticky left-[180px] z-30 bg-[#f5f7fa] min-w-[120px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">牌号</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">计划产量<br/>(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">实际产量<br/>(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">入库产量<br/>(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">长梗原料量<br/>(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">自产回填液<br/>烟末量<br/>(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">原料量<br/>(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">得率(%)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">木浆板*</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">碳酸钙*</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">瓜尔胶*</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">香精香料*</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">全口径得率*</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">生产过程自制<br/>半成品量<br/>(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">自制半成品<br/>产生原因</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">处理方式</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">已处理量</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">回掺品总<br/>量(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">贴标成品<br/>量(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">未贴标成<br/>品量(吨)</TableHead>
                  <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">补贴标量</TableHead>
                  <TableHead className="whitespace-nowrap px-8 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    {monthSpans[index] > 0 && (
                      <TableCell style={{ position: 'sticky', left: 0 }} rowSpan={monthSpans[index]} className="z-20 text-center font-medium border-r border-[#ebeef5] bg-[#fafafa]">
                        {item.month}
                      </TableCell>
                    )}
                    <TableCell style={{ position: 'sticky', left: '60px' }} className="z-20 bg-white text-center border-r border-[#ebeef5]">{item.productionOrder}</TableCell>
                    <TableCell style={{ position: 'sticky', left: '120px' }} className="z-20 bg-white text-center border-r border-[#ebeef5] text-[#303133]">{item.category}</TableCell>
                    <TableCell style={{ position: 'sticky', left: '180px' }} className="z-20 bg-white text-center border-r border-[#ebeef5] text-[#303133]">{item.formulaName}</TableCell>
                    
                    {/* 显示部分 */}
                    <TableCell className={`p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24 ${
                      item.plannedYieldStatus === 'addition' ? 'bg-[#409eff] bg-opacity-20' : 
                      item.plannedYieldStatus === 'adjustment' ? 'bg-[#e6a23c] bg-opacity-20' : ''
                    }`}>
                      {item.plannedYield || '-'}
                    </TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.actualYield || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.warehousedYield || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.longStemRawVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.selfProducedBackfillVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.rawMaterialVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.yieldRate || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.woodPulpBoard || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.calciumCarbonate || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.guarGum || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.flavorFragrance || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.fullCaliberYield || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24 text-[#303133]">{item.inProcessSemiFinishedVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[120px] w-32 text-[#303133]">{item.semiFinishedReason || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24 text-[#303133]">{item.treatmentMethod || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24 text-[#303133]">{item.processedVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.totalBlendedVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.labeledFinishedVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.unlabeledFinishedVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-center min-w-[80px] w-24">{item.supplementaryLabeledVolume || '-'}</TableCell>
                    <TableCell className="p-2 border-r border-[#ebeef5] text-left min-w-[200px] w-48 text-[#303133]">{item.remark || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full gap-4 items-stretch p-4 lg:p-6 bg-transparent">
      <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm shadow-sm relative">
        
        {/* 顶部标签页 */}
        <div className="flex-shrink-0 pt-2 px-2 border-b border-[#ebeef5]">
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} variant="card">
            <TabsList>
              <TabsTrigger value="form">生产统计明细</TabsTrigger>
              <TabsTrigger value="flow">流程图</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto relative bg-white pb-16">
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

        {/* 底部按钮区 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#ebeef5] bg-white flex items-center justify-end gap-4 z-20">
          <Button variant="outline" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6" onClick={() => setIsPreviewOpen(true)}>
            导出预览
          </Button>
          <Button type="button" className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 min-w-[80px]" onClick={() => navigate(-1)}>
            返 回
          </Button>
        </div>
      </div>

      <PrintPreviewDialog 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="生产统计分析报表导出预览"
      >
        <StatisticsReportExportPreview 
          data={data}
          reportName={(baseInfo as any)?.reportName || '2026年5月份生产统计报表'}
          reportNo={baseInfo?.reportNo}
          submitTime={baseInfo?.submitTime}
          submitter={baseInfo?.submitter}
        />
      </PrintPreviewDialog>
    </div>
  );
}
