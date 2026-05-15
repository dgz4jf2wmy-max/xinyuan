import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { ProductionMonthlyReportReportInfo } from '../../../../types/production/statistics/report';

interface MonthlyExportPreviewProps {
  items: ProductionMonthlyReportReportInfo[];
  reportName?: string;
  reportNo?: string;
  submitTime?: string;
  submitter?: string;
}

export function MonthlyExportPreview({
  items,
  reportName,
  reportNo,
  submitTime,
  submitter,
}: MonthlyExportPreviewProps) {
  const tobaccoItems = items.filter(i => i.productType === '再造烟叶');
  const stemItems = items.filter(i => i.productType === '再造梗丝');

  const sumField = (arr: ProductionMonthlyReportReportInfo[], field: keyof ProductionMonthlyReportReportInfo) => {
    return arr.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  };

  const globalFlavorVol = items[0]?.flavorProductionLineMonthlyActualDeploymentWarehousingVolume || 0;

  return (
    <div className="bg-white p-12 text-[#303133]">
      {/* Title */}
      <h1 className="text-center text-3xl font-bold font-serif mb-4 tracking-wider">
        {reportName || "生产月报"}
      </h1>
      
      {/* Meta Info */}
      <div className="flex justify-between items-end mb-6 text-sm text-[#303133]">
        <div className="font-serif">
          &nbsp;
        </div>
        <div>
          编制日期: {submitTime?.split(' ')[0] || new Date().toISOString().split('T')[0]}
        </div>
      </div>

      {/* Main Table */}
      <div className="mb-8">
        <Table className="border-collapse w-full border-black border-2 text-base">
          <TableBody>
            {/* Row 1: 产品种类 */}
            <TableRow className="hover:bg-transparent text-center font-bold">
              <TableCell className="w-32 border border-black p-2 align-middle font-bold text-center">产品种类</TableCell>
              <TableCell className="border border-black p-2 text-center" colSpan={tobaccoItems.length + 1}>再造烟叶线</TableCell>
              <TableCell className="border border-black p-2 text-center" colSpan={stemItems.length + 1}>再造梗丝线</TableCell>
              <TableCell className="w-48 border border-black p-2 align-middle text-center break-words" rowSpan={2}>
                香精香料生产线当月实际调配入库量（吨）
              </TableCell>
            </TableRow>

            {/* Row 2: 牌号 */}
            <TableRow className="hover:bg-transparent text-center font-bold">
              <TableCell className="border border-black p-2 text-center">规格牌号</TableCell>
              {tobaccoItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 w-24 text-center">
                  {item.brandCode}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 w-24 text-center">合计</TableCell>
              {stemItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 w-24 text-center">
                  {item.brandCode}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 w-24 text-center">合计</TableCell>
            </TableRow>

            {/* Row 3: 原料消耗 (吨) */}
            <TableRow className="hover:bg-transparent text-center">
              <TableCell className="border border-black p-2 font-bold text-center">原料消耗（吨）</TableCell>
              {tobaccoItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                  {item.materialConsumption}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 text-center">{sumField(tobaccoItems, 'materialConsumption')}</TableCell>
              {stemItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                  {item.materialConsumption}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 text-center">{sumField(stemItems, 'materialConsumption')}</TableCell>
              <TableCell className="border border-black p-2 font-bold text-center text-[#303133] align-middle" rowSpan={6}>
                {globalFlavorVol}
              </TableCell>
            </TableRow>

            {/* Row 4: 实际产量 (吨) */}
            <TableRow className="hover:bg-transparent text-center">
              <TableCell className="border border-black p-2 font-bold text-center">实际产量（吨）</TableCell>
              {tobaccoItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                  {item.actualProduction}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 text-center">{sumField(tobaccoItems, 'actualProduction')}</TableCell>
              {stemItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                  {item.actualProduction}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 text-center">{sumField(stemItems, 'actualProduction')}</TableCell>
            </TableRow>

            {/* Row 5: 入库产量 (吨) */}
            <TableRow className="hover:bg-transparent text-center">
              <TableCell className="border border-black p-2 font-bold text-center">入库产量（吨）</TableCell>
              {tobaccoItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                  {item.warehousingProduction}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 text-center">{sumField(tobaccoItems, 'warehousingProduction')}</TableCell>
              {stemItems.map((item) => (
                <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                  {item.warehousingProduction}
                </TableCell>
              ))}
              <TableCell className="border border-black p-2 text-center">{sumField(stemItems, 'warehousingProduction')}</TableCell>
            </TableRow>

            {/* Row 6: 得率 (%) */}
            <TableRow className="hover:bg-transparent text-center">
              <TableCell className="border border-black p-2 font-bold text-center">得率（%）</TableCell>
              {tobaccoItems.map((item) => {
                 const yieldVal = item.materialConsumption > 0 ? (item.actualProduction / item.materialConsumption) * 100 : 0;
                 return (
                   <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                      {Number.isInteger(yieldVal) ? yieldVal : yieldVal.toFixed(1)}
                   </TableCell>
                 );
              })}
              <TableCell className="border border-black p-2 text-center">
                {(() => {
                    const consumption = sumField(tobaccoItems, 'materialConsumption');
                    const prod = sumField(tobaccoItems, 'actualProduction');
                    const val = consumption > 0 ? (prod / consumption) * 100 : 0;
                    return Number.isInteger(val) ? val : val.toFixed(1);
                 })()}
              </TableCell>
              {stemItems.map((item) => {
                 const yieldVal = item.materialConsumption > 0 ? (item.actualProduction / item.materialConsumption) * 100 : 0;
                 return (
                   <TableCell key={item.brandCode} className="border border-black p-2 text-center">
                      {Number.isInteger(yieldVal) ? yieldVal : yieldVal.toFixed(1)}
                   </TableCell>
                 );
              })}
              <TableCell className="border border-black p-2 text-center">
                {(() => {
                    const consumption = sumField(stemItems, 'materialConsumption');
                    const prod = sumField(stemItems, 'actualProduction');
                    const val = consumption > 0 ? (prod / consumption) * 100 : 0;
                    return Number.isInteger(val) ? val : val.toFixed(1);
                 })()}
              </TableCell>
            </TableRow>

            {/* Row 7: 月度生产时间 (h) */}
            <TableRow className="hover:bg-transparent text-center">
              <TableCell className="border border-black p-2 font-bold text-center">月度生产时间（h）</TableCell>
              <TableCell className="border border-black p-2 text-center" colSpan={tobaccoItems.length + 1}>
                {tobaccoItems[0]?.monthlyProductionTime || 0}
              </TableCell>
              <TableCell className="border border-black p-2 text-center" colSpan={stemItems.length + 1}>
                {stemItems[0]?.monthlyProductionTime || 0}
              </TableCell>
            </TableRow>

            {/* Row 8: 月度平均日产量 (吨) */}
            <TableRow className="hover:bg-transparent text-center">
              <TableCell className="border border-black p-2 font-bold text-center break-words max-w-[120px]">月度平均日产量（吨）</TableCell>
              <TableCell className="border border-black p-2 text-center" colSpan={tobaccoItems.length + 1}>
                {tobaccoItems[0]?.monthlyAverageDailyProduction || 0}
              </TableCell>
              <TableCell className="border border-black p-2 text-center" colSpan={stemItems.length + 1}>
                {stemItems[0]?.monthlyAverageDailyProduction || 0}
              </TableCell>
            </TableRow>
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
