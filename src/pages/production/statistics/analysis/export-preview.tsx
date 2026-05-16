import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { ProductionStatisticsReportItem } from '../../../../data/production/statistics/analysisReportEditData';

interface StatisticsReportExportPreviewProps {
  data: ProductionStatisticsReportItem[];
  reportName?: string;
  reportNo?: string;
  submitTime?: string;
  submitter?: string;
}

export function StatisticsReportExportPreview({
  data,
  reportName,
  reportNo,
  submitTime,
  submitter,
}: StatisticsReportExportPreviewProps) {
  const calculateRowSpan = (list: ProductionStatisticsReportItem[] = [], key: keyof ProductionStatisticsReportItem) => {
    const spanMap: Record<number, number> = {};
    if (!list) return spanMap;
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

  return (
    <div className="bg-white p-12 text-[#303133]">
      {/* Title */}
      <h1 className="text-center text-3xl font-bold font-serif mb-4 tracking-wider">
        {reportName || '生产统计分析报表'}
      </h1>
      
      {/* Meta Info */}
      <div className="flex justify-between items-end mb-6 text-sm text-[#303133]">
        <div className="font-serif">
          报表编号: {reportNo}
        </div>
        <div>
          编制日期: {submitTime?.split(' ')[0] || new Date().toISOString().split('T')[0]}
        </div>
      </div>

      <div className="text-sm mb-2 text-[#303133] flex items-center">
        部门：生产管理处（在制品：计入实际产量，未计入入库产量；回掺品：计入入库产量。实际产量需扣除该部分。计划量底色 <span className="inline-block w-3 h-3 bg-[#409eff] bg-opacity-20 ml-1 mr-1"></span> 为增补，<span className="inline-block w-3 h-3 bg-[#e6a23c] bg-opacity-20 ml-1 mr-1"></span> 为调整）
      </div>

      {/* Main Table */}
      <div className="mb-8">
        <Table className="border-collapse w-full border-black border-2 text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">月份</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">生产<br/>顺序</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">类别</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">牌号</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">计划产量<br/>(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">实际产量<br/>(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">入库产量<br/>(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">长梗原料量<br/>(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">自产回填液<br/>烟末量<br/>(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">原料量<br/>(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">得率(%)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">木浆板*</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">碳酸钙*</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">瓜尔胶*</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">香精香料*</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">全口径得率*</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">生产过程自制<br/>半成品量<br/>(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">自制半成品<br/>产生原因</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">处理方式</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">已处理量</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">回掺品总<br/>量(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">贴标成品<br/>量(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">未贴标成<br/>品量(吨)</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">补贴标量</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 align-middle">备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data || []).map((item, index) => (
              <TableRow key={item.id} className="hover:bg-transparent">
                {monthSpans[index] > 0 && (
                  <TableCell rowSpan={monthSpans[index]} className="text-center border border-black align-middle">
                    {item.month}
                  </TableCell>
                )}
                <TableCell className="text-center border border-black align-middle">{item.productionOrder}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.category}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.formulaName}</TableCell>
                
                <TableCell className={`text-center border border-black align-middle ${
                  item.plannedYieldStatus === 'addition' ? 'bg-[#409eff] bg-opacity-20' : 
                  item.plannedYieldStatus === 'adjustment' ? 'bg-[#e6a23c] bg-opacity-20' : ''
                }`}>
                  {item.plannedYield || '-'}
                </TableCell>
                <TableCell className="text-center border border-black align-middle">{item.actualYield || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.warehousedYield || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.longStemRawVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.selfProducedBackfillVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.rawMaterialVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.yieldRate || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.woodPulpBoard || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.calciumCarbonate || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.guarGum || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.flavorFragrance || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.fullCaliberYield || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.inProcessSemiFinishedVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle max-w-[120px] truncate" title={item.semiFinishedReason}>{item.semiFinishedReason || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.treatmentMethod || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.processedVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.totalBlendedVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.labeledFinishedVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.unlabeledFinishedVolume || '-'}</TableCell>
                <TableCell className="text-center border border-black align-middle">{item.supplementaryLabeledVolume || '-'}</TableCell>
                <TableCell className="text-left border border-black p-2 align-top max-w-[200px]">
                  <div className="whitespace-pre-wrap">
                    {item.remark || '-'}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer Signatures */}
      <div className="flex justify-between items-center text-sm font-medium mt-16 px-4">
        <div className="flex items-center gap-2 pb-1">
          <span className="shrink-0 text-base">编制人:</span>
          <span className="border-b border-[#303133] text-base w-32 inline-block text-center pb-1">{submitter || '张建国'}</span>
        </div>
        <div className="flex items-center gap-2 pb-1 relative left-[-20px]">
          <span className="shrink-0 text-base">部门负责人:</span>
          <span className="border-b border-[#303133] text-base w-32 inline-block text-center pb-1"></span>
        </div>
        <div className="flex items-center gap-2 pb-1 relative right-[20px]">
          <span className="shrink-0 text-base">分管领导:</span>
          <span className="border-b border-[#303133] text-base w-32 inline-block text-center pb-1"></span>
        </div>
      </div>
    </div>
  );
}
