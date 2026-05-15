import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';

interface WeeklyExportPreviewProps {
  materials: any[];
  flavorsByCategory: any[];
  tests: any[];
  otherInfo: any;
  workSummary: any;
  flavorPlans: any[];
  reportName?: string;
  reportNo?: string;
  submitTime?: string;
  submitter?: string;
}

export function WeeklyExportPreview({
  materials,
  flavorsByCategory,
  tests,
  otherInfo,
  workSummary,
  flavorPlans,
  reportName,
  submitTime,
  submitter,
}: WeeklyExportPreviewProps) {
  const formatPercent = (val: number) => {
    return (val * 100).toFixed(2) + '%';
  };

  return (
    <div className="bg-white p-12 text-[#303133]">
      {/* Title */}
      <h1 className="text-center text-3xl font-bold font-serif mb-4 tracking-wider">
        {reportName || "生产周报"}
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

      <div className="mb-8 border-2 border-black">
        {/* We use a strict 7-column layout implicitly via colSpans to match the form exactly */}
        <Table className="border-collapse w-full">
          <TableBody>
            {/* 一、再造原料生产情况 */}
            <TableRow>
              <TableCell colSpan={7} className="font-bold border border-black p-2 text-base">一、再造原料生产情况（单位：吨）</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10 w-20" colSpan={1}>序号</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10 w-32" colSpan={1}>产品类型</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10 w-64" colSpan={1}>牌号</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10" colSpan={2}>实际产量</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10" colSpan={2}>备注</TableHead>
            </TableRow>
            {materials.map((m, i) => (
              <TableRow key={`mat-${i}`} className="hover:bg-transparent">
                <TableCell className="text-center border border-black" colSpan={1}>{i + 1}</TableCell>
                <TableCell className="text-center text-[#303133] border border-black" colSpan={1}>{m.productType}</TableCell>
                <TableCell className="text-center text-[#303133] border border-black" colSpan={1}>{m.brandCode}</TableCell>
                <TableCell className="text-center text-[#303133] border border-black" colSpan={2}>{m.actualProduction}</TableCell>
                <TableCell className="text-center border border-black" colSpan={2}>{m.remark || ''}</TableCell>
              </TableRow>
            ))}
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="text-center border border-black">小计</TableCell>
              <TableCell colSpan={4} className="text-center text-[#303133] border border-black p-2">{materials[0]?.subtotalActualProduction}</TableCell>
            </TableRow>
            
            {/* 年度计划产量部分 */}
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-center border border-black p-2" colSpan={2}>再造烟叶年度计划产量</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{materials[0]?.reconstitutedTobaccoYearlyPlan}</TableCell>
              <TableCell className="text-center border border-black p-2" colSpan={1}>累计完成产量</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{materials[0]?.reconstitutedTobaccoCumulative}</TableCell>
              <TableCell className="text-center border border-black p-2" colSpan={1}>产量执行进度</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{formatPercent(materials[0]?.reconstitutedTobaccoProgress || 0)}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-center border border-black p-2" colSpan={2}>再造梗丝年度计划产量</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{materials[0]?.reconstitutedStemYearlyPlan}</TableCell>
              <TableCell className="text-center border border-black p-2" colSpan={1}>累计完成产量</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{materials[0]?.reconstitutedStemCumulative}</TableCell>
              <TableCell className="text-center border border-black p-2" colSpan={1}>产量执行进度</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{formatPercent(materials[0]?.reconstitutedStemProgress || 0)}</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-center border border-black p-2" colSpan={2}>多孔颗粒年度计划产量</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{materials[0]?.porousGranuleYearlyPlan}</TableCell>
              <TableCell className="text-center border border-black p-2" colSpan={1}>累计完成产量</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{materials[0]?.porousGranuleCumulative}</TableCell>
              <TableCell className="text-center border border-black p-2" colSpan={1}>产量执行进度</TableCell>
              <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>{formatPercent(materials[0]?.porousGranuleProgress || 0)}</TableCell>
            </TableRow>

            {/* 二、香精香料生产情况 */}
            <TableRow>
              <TableCell colSpan={7} className="font-bold border border-black p-2 text-base">二、香精香料生产情况（单位：吨）</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10 w-20" colSpan={1}>序号</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10 w-32" colSpan={1}>生产类型</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10 w-64" colSpan={1}>牌号</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10" colSpan={2}>实际产量</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10" colSpan={2}>备注</TableHead>
            </TableRow>

            {flavorsByCategory.map((catGroup, catIdx) => {
              const startIndex = flavorsByCategory.slice(0, catIdx).reduce((acc, curr) => acc + curr.items.length, 0);
              return (
                <React.Fragment key={`cat-${catIdx}`}>
                  {catGroup.items.map((item: any, itemIdx: number) => (
                    <TableRow key={`flavor-${catIdx}-${itemIdx}`} className="hover:bg-transparent">
                      <TableCell className="text-center border border-black" colSpan={1}>{startIndex + itemIdx + 1}</TableCell>
                      {itemIdx === 0 && (
                         <TableCell rowSpan={catGroup.items.length} className="text-center border border-black align-middle" colSpan={1}>{catGroup.category}</TableCell>
                      )}
                      <TableCell className="text-center text-[#303133] border border-black" colSpan={1}>{item.brandCode}</TableCell>
                      <TableCell className="text-center text-[#303133] border border-black" colSpan={2}>{item.actualProduction}</TableCell>
                      <TableCell className="text-center border border-black" colSpan={2}>{item.remark || ''}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className="text-center border border-black">小计</TableCell>
                    <TableCell colSpan={4} className="text-center text-[#303133] border border-black p-2">
                       {catGroup.items[0]?.subtotalActualProduction}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="text-center border border-black">合计</TableCell>
              <TableCell colSpan={4} className="text-center text-[#303133] border border-black p-2">
                117.535
              </TableCell>
            </TableRow>

            {/* 香精香料年度计划 */}
            {flavorPlans.map((plan, i) => (
              <TableRow key={`plan-${i}`} className="hover:bg-transparent">
                {i === 0 && (
                  <TableCell rowSpan={flavorPlans.length} className="text-center border border-black align-middle" colSpan={1}>
                    香精香料<br/>年度计划<br/>产量
                  </TableCell>
                )}
                <TableCell className="text-center border border-black p-2" colSpan={1}>
                  {plan.customerName}
                </TableCell>
                <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>
                  {plan.production}
                </TableCell>
                <TableCell className="text-center border border-black p-2" colSpan={1}>
                  累计完成产量
                </TableCell>
                <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>
                  {plan.cumulative}
                </TableCell>
                <TableCell className="text-center border border-black p-2" colSpan={1}>
                  产量执行进度 
                </TableCell>
                <TableCell className="text-center text-[#303133] border border-black p-2" colSpan={1}>
                  {formatPercent(plan.progress)}
                </TableCell>
              </TableRow>
            ))}

            {/* 三、工艺配方试验情况 */}
            <TableRow>
              <TableCell colSpan={7} className="font-bold border border-black p-2 text-base">三、工艺配方试验情况（kg）</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10" colSpan={1}>序号</TableHead>
              <TableHead colSpan={2} className="text-center text-[#303133] font-bold border border-black h-10">配方名称</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10" colSpan={2}>实际产量</TableHead>
              <TableHead className="text-center text-[#303133] font-bold border border-black h-10" colSpan={2}>备注</TableHead>
            </TableRow>
            {tests && tests.length > 0 ? tests.map((t: any, i: number) => (
              <TableRow key={`test-${i}`} className="hover:bg-transparent h-10">
                <TableCell className="text-center border border-black" colSpan={1}>{i + 1}</TableCell>
                <TableCell colSpan={2} className="text-center border border-black">{t.recipeName}</TableCell>
                <TableCell className="text-center border border-black" colSpan={2}>{t.actualProduction === 0 ? '' : t.actualProduction}</TableCell>
                <TableCell className="text-center border border-black" colSpan={2}>{t.remark}</TableCell>
              </TableRow>
            )) : (
               <>
                  <TableRow className="hover:bg-transparent h-10">
                    <TableCell className="text-center border border-black" colSpan={1}>1</TableCell>
                    <TableCell colSpan={2} className="text-center border border-black"></TableCell>
                    <TableCell className="text-center border border-black" colSpan={2}></TableCell>
                    <TableCell className="text-center border border-black" colSpan={2}></TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent h-10">
                    <TableCell className="text-center border border-black" colSpan={1}>2</TableCell>
                    <TableCell colSpan={2} className="text-center border border-black"></TableCell>
                    <TableCell className="text-center border border-black" colSpan={2}></TableCell>
                    <TableCell className="text-center border border-black" colSpan={2}></TableCell>
                  </TableRow>
               </>
            )}

            {/* 四、其他情况 */}
            <TableRow>
              <TableCell colSpan={7} className="font-bold border border-black p-2 text-base">四、其他情况</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-center border border-black p-2 align-middle font-medium whitespace-nowrap" colSpan={2}>
                翻箱、预混、贴标、筛分<br/>等（规格、数量等信息）
              </TableCell>
              <TableCell colSpan={5} className="text-left border border-black p-3 align-middle text-sm whitespace-pre-wrap">
                 {otherInfo?.otherActivitiesSummary}
              </TableCell>
            </TableRow>

            {/* 五、各条线工作简述 */}
            <TableRow>
              <TableCell colSpan={7} className="font-bold border border-black p-2 text-base">五、各条线工作简述</TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={7} className="text-left border border-black p-3 align-top min-h-[100px] text-sm whitespace-pre-wrap">
                 {workSummary?.workSummary}
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </div>

      {/* Footer Signatures */}
      <div className="flex justify-between items-center text-sm font-medium mt-12 px-4">
        <div className="flex items-center gap-2 pb-1">
          <span className="shrink-0 text-base">编制人:</span>
          <span className="border-b border-[#303133] text-base w-32 inline-block text-center pb-1">{submitter || ''}</span>
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

