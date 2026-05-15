import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';

interface DailyExportPreviewProps {
  materials: any[];
  flavorsByCategory: any[];
  remark: string;
  reportName?: string;
  reportNo?: string;
  submitTime?: string;
  submitter?: string;
}

export function DailyExportPreview({
  materials,
  flavorsByCategory,
  remark,
  reportName,
  reportNo,
  submitTime,
  submitter,
}: DailyExportPreviewProps) {
  const totalPackagedBoxes = materials.reduce((sum, item) => sum + (Number(item.dailyPackagedBoxes) || 0), 0);
  const totalPackagedAmount = materials.reduce((sum, item) => sum + (Number(item.dailyPackagedAmount) || 0), 0);
  const totalCumulativeFlow = materials.reduce((sum, item) => sum + (Number(item.dailyCumulativeFlow) || 0), 0);

  const totalFlavorRows = flavorsByCategory.reduce((sum, cat) => sum + cat.items.length + 1, 0);

  return (
    <div className="bg-white p-12 text-[#303133]">
      {/* Title */}
      <h1 className="text-center text-3xl font-bold font-serif mb-4 tracking-wider">
        {reportName || "鑫源公司生产日报"}
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
        <Table className="border-collapse w-full border-black border-2">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-[#303133] font-bold border border-black w-[15%] h-12 text-base">产品类型</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black w-[15%] h-12 text-base">班组名称</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black w-[20%] h-12 text-base">牌号</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black w-[16%] h-12 text-base">当日打包数（箱）</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black w-[16%] h-12 text-base">当日打包量（t）</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black w-[18%] h-12 text-base">当日累计流量（t）</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 再造原料部分 */}
            {materials.map((m, i) => (
              <TableRow key={`mat-${i}`} className="hover:bg-transparent">
                {i === 0 && (
                  <TableCell rowSpan={materials.length} className="text-center border border-black text-base">再造原料</TableCell>
                )}
                <TableCell className="text-center border border-black text-base">{m.teamName}</TableCell>
                <TableCell className="text-center border border-black text-base">
                  {m.brandCode}
                </TableCell>
                <TableCell className="text-center border border-black text-base">
                  {m.brandCode === '-' ? '-' : m.dailyPackagedBoxes}
                </TableCell>
                <TableCell className="text-center border border-black text-base">
                  {m.brandCode === '-' ? '-' : m.dailyPackagedAmount}
                </TableCell>
                <TableCell className="text-center border border-black text-base">
                  {m.brandCode === '-' ? '-' : m.dailyCumulativeFlow}
                </TableCell>
              </TableRow>
            ))}
            
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="text-center border border-black text-base">当日合计</TableCell>
              <TableCell className="text-center border border-black text-base">{Number.isInteger(totalPackagedBoxes) ? totalPackagedBoxes : totalPackagedBoxes.toFixed(2)}</TableCell>
              <TableCell className="text-center border border-black text-base">{Number.isInteger(totalPackagedAmount) ? totalPackagedAmount : totalPackagedAmount.toFixed(2)}</TableCell>
              <TableCell className="text-center border border-black text-base">{Number.isInteger(totalCumulativeFlow) ? totalCumulativeFlow : totalCumulativeFlow.toFixed(2)}</TableCell>
            </TableRow>

            {/* 香精香料部分 Headers */}
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 text-base align-middle">产品类型</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 text-base align-middle">类别</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-12 text-base align-middle">牌号</TableHead>
              <TableHead colSpan={3} className="text-center text-[#303133] font-bold border border-black h-12 text-base align-middle">当日调配量（t）</TableHead>
            </TableRow>

            {/* 香精香料数据 */}
            {flavorsByCategory.map((catGroup, catIdx) => {
              const catSubtotal = catGroup.items.reduce((sum, item) => sum + (Number(item.dailyPreparationAmount) || 0), 0);
              const isFirstCat = catIdx === 0;

              return (
                <React.Fragment key={`cat-${catIdx}`}>
                  {catGroup.items.map((item, itemIdx) => (
                    <TableRow key={`flavor-${catIdx}-${itemIdx}`} className="hover:bg-transparent">
                      {isFirstCat && itemIdx === 0 && (
                        <TableCell rowSpan={totalFlavorRows} className="text-center border border-black text-base">香精香料</TableCell>
                      )}
                      {itemIdx === 0 && (
                         <TableCell rowSpan={catGroup.items.length + 1} className="text-center border border-black text-base">{catGroup.category}</TableCell>
                      )}
                      <TableCell className="text-center border border-black text-base">{item.brandCode}</TableCell>
                      <TableCell colSpan={3} className="text-center border border-black text-base">
                        {item.dailyPreparationAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="text-center border border-black text-base">当日小计</TableCell>
                    <TableCell colSpan={3} className="text-center border border-black text-base">
                      {Number.isInteger(catSubtotal) ? catSubtotal : catSubtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}

            {/* Remark */}
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-center border border-black font-bold text-base h-24 align-middle">备注</TableCell>
              <TableCell colSpan={5} className="text-left border border-black p-4 text-base align-top">
                <div className="whitespace-pre-wrap min-h-[60px]">
                  {remark || '-'}
                </div>
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
