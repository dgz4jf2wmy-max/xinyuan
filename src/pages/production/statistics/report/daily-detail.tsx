import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { VerticalFlowchart } from '../../../../components/ui/vertical-flowchart';
import { ApprovalProcessTimeline } from '../../../../components/ui/approval-process';
import { PrintPreviewDialog } from '../../../../components/ui/print-preview-dialog';
import { DailyExportPreview } from './daily-export-preview';
import { mockMaterialDetails, mockFlavorDetails, mockDailyReportRemark, mockDailyReportBaseInfo } from '../../../../data/production/statistics/dailyReportDetailData';
import { mockApprovalProcess } from '../../../../data/plan/annualPlanDetailData'; // We can borrow this for mock data
import clsx from 'clsx';

export default function DailyReportDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'flow'>('form');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Hardcode data as requested
  const materials = mockMaterialDetails;
  const flavors = mockFlavorDetails;
  const remark = mockDailyReportRemark;
  const baseInfo = mockDailyReportBaseInfo;

  const totalPackagedBoxes = materials.reduce((sum, item) => sum + (Number(item.dailyPackagedBoxes) || 0), 0);
  const totalPackagedAmount = materials.reduce((sum, item) => sum + (Number(item.dailyPackagedAmount) || 0), 0);
  const totalCumulativeFlow = materials.reduce((sum, item) => sum + (Number(item.dailyCumulativeFlow) || 0), 0);

  const categories = Array.from(new Set(flavors.map(f => f.category)));
  const flavorsByCategory = categories.map(cat => ({
    category: cat,
    items: flavors.filter(f => f.category === cat)
  }));

  const flowchartSteps = [
    { id: 1, title: '待提交' },
    { id: 2, title: '待审核(分管领导)' },
    { id: 3, title: '已发布', isActive: true },
    { id: 4, title: '结束' },
  ];

  const renderFormData = () => (
    <div className="flex flex-col space-y-4">
      {/* 顶部信息 */}
      <div className="flex justify-end items-center text-sm text-[#606266] mb-2 space-x-6">
        <span>凭证编号: {baseInfo?.reportNo || '系统自动生成'}</span>
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
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">生产日报编号</TableCell>
                  <TableCell className="border-r border-[#ebeef5] text-[#303133]">{baseInfo?.reportNo || '-'}</TableCell>
                  <TableCell className="w-32 bg-[#f5f7fa] border-r border-[#ebeef5] text-[#606266] font-medium text-center">生产日报名称</TableCell>
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
            {/* 再造原料 */}
            <div className="border border-[#ebeef5] rounded">
              <Table className="border-collapse w-full">
            <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-24 text-center text-[#303133] font-bold bg-[#f5f7fa] border-r border-[#ebeef5]">班组名称</TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold bg-[#f5f7fa] border-r border-[#ebeef5]">牌号</TableHead>
                <TableHead className="w-40 text-center text-[#409eff] font-bold bg-[#f5f7fa] border-r border-[#ebeef5]">当日打包数（箱）</TableHead>
                <TableHead className="w-40 text-center text-[#409eff] font-bold bg-[#f5f7fa] border-r border-[#ebeef5]">当日打包量（t）</TableHead>
                <TableHead className="w-40 text-center text-[#409eff] font-bold bg-[#f5f7fa]">当日累计流量（t）</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((m, i) => (
                <TableRow key={`mat-${i}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                  <TableCell className="text-center border-r border-[#ebeef5]">{m.teamName}</TableCell>
                  <TableCell className="text-center border-r border-[#ebeef5]">{m.brandCode}</TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">
                    {m.brandCode === '-' ? '-' : m.dailyPackagedBoxes}
                  </TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">
                    {m.brandCode === '-' ? '-' : m.dailyPackagedAmount}
                  </TableCell>
                  <TableCell className="text-center text-[#303133]">
                    {m.brandCode === '-' ? '-' : m.dailyCumulativeFlow}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-[#fafafa] font-medium border-t border-[#ebeef5]">
                <TableCell colSpan={2} className="text-center border-r border-[#ebeef5]">再造原料合计</TableCell>
                <TableCell className="text-center text-[#409eff] border-r border-[#ebeef5]">{Number.isInteger(totalPackagedBoxes) ? totalPackagedBoxes : totalPackagedBoxes.toFixed(2)}</TableCell>
                <TableCell className="text-center text-[#409eff] border-r border-[#ebeef5]">{Number.isInteger(totalPackagedAmount) ? totalPackagedAmount : totalPackagedAmount.toFixed(2)}</TableCell>
                <TableCell className="text-center text-[#409eff]">{Number.isInteger(totalCumulativeFlow) ? totalCumulativeFlow : totalCumulativeFlow.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 香精香料 */}
        <div className="border border-[#ebeef5] rounded">
          <Table className="border-collapse w-full">
            <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-40 text-center text-[#303133] font-bold bg-[#f5f7fa] border-r border-[#ebeef5]">类别</TableHead>
                <TableHead className="w-64 text-center text-[#303133] font-bold bg-[#f5f7fa] border-r border-[#ebeef5]">牌号</TableHead>
                <TableHead className="text-center text-[#409eff] font-bold bg-[#f5f7fa]">当日调配量（t）</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flavorsByCategory.map((catGroup, catIdx) => {
                const catSubtotal = catGroup.items.reduce((sum, item) => sum + (Number(item.dailyPreparationAmount) || 0), 0);
                return (
                  <React.Fragment key={`cat-${catIdx}`}>
                    {catGroup.items.map((item, itemIdx) => (
                      <TableRow key={`flavor-${catIdx}-${itemIdx}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                        {itemIdx === 0 && (
                           <TableCell rowSpan={catGroup.items.length} className="text-center bg-white border-r border-[#ebeef5]">{catGroup.category}</TableCell>
                        )}
                        <TableCell className="text-center border-r border-[#ebeef5]">{item.brandCode}</TableCell>
                        <TableCell className="text-center text-[#303133]">
                          {item.dailyPreparationAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-[#fafafa] font-medium border-t border-[#ebeef5]">
                      <TableCell colSpan={2} className="text-center border-r border-[#ebeef5]">当日小计 ({catGroup.category})</TableCell>
                      <TableCell className="text-center text-[#409eff]">
                        {Number.isInteger(catSubtotal) ? catSubtotal : catSubtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* 备注说明 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-[#303133]">备注</h3>
          </div>
          <div className="w-full border border-[#dcdfe6] rounded min-h-[100px] p-3 text-sm text-[#606266] bg-[#f5f7fa] whitespace-pre-wrap">
            {remark}
          </div>
        </div>
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
              <TabsTrigger value="form">生产日报</TabsTrigger>
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
          <Button type="button" className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 min-w-[80px]" onClick={() => navigate(-1)}>
            返 回
          </Button>
        </div>
      </div>

      <PrintPreviewDialog 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title="生产日报导出预览"
      >
        <DailyExportPreview 
          materials={materials} 
          flavorsByCategory={flavorsByCategory} 
          remark={remark}
          reportName={baseInfo?.reportName}
          reportNo={baseInfo?.reportNo}
          submitTime={baseInfo?.submitTime}
          submitter={baseInfo?.submitter}
        />
      </PrintPreviewDialog>
    </div>
  );
}
