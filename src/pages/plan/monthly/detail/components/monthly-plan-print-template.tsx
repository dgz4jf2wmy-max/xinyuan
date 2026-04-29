import React from 'react';
import { MonthlyProductionPlanBase } from '../../../../../types/monthly-plan';

interface MonthlyPlanPrintTemplateProps {
  data: MonthlyProductionPlanBase;
}

export const MonthlyPlanPrintTemplate: React.FC<MonthlyPlanPrintTemplateProps> = ({ data }) => {
  const rawMaterials = data.planList?.filter(t => 
    t.productType.includes('烟叶') || t.productType.includes('梗丝') || t.productType.includes('颗粒')
  ) || [];

  const fragrances = data.planList?.filter(t => 
    t.productType.includes('料液') || t.productType.includes('表香')
  ) || [];

  const renderTable = (items: typeof rawMaterials, titleSuffix: string) => (
    <div className="mb-12 break-after-page">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">{data.planName} ({titleSuffix})</h1>
        <p className="text-sm text-gray-500">编号：{data.id}</p>
      </div>

      <div className="flex justify-end mb-4 text-sm font-medium">
        <div>编制日期：{data.createTime ? data.createTime.split(' ')[0] : ''}</div>
      </div>

      <table className="w-full border-collapse border border-black mb-8">
        <thead>
          <tr className="bg-gray-50 font-bold">
            <th className="border border-black p-2 text-[10px] w-12">序号</th>
            <th className="border border-black p-2 text-[10px] text-left">产品类别</th>
            <th className="border border-black p-2 text-[10px] text-left">牌号</th>
            <th className="border border-black p-2 text-[10px] text-right w-24">总产量/吨</th>
            <th className="border border-black p-2 text-[10px] text-left">备注</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="h-10">
              <td className="border border-black p-2 text-[10px] text-center">{index + 1}</td>
              <td className="border border-black p-2 text-[10px]">{item.productType}</td>
              <td className="border border-black p-2 text-[10px] font-bold">{item.brandGrade}</td>
              <td className="border border-black p-2 text-[10px] text-right font-medium">{(item.productionVolume || 0).toFixed(3)}</td>
              <td className="border border-black p-2 text-[10px]">{item.remarks}</td>
            </tr>
          ))}
          <tr className="font-bold h-10 bg-gray-50">
            <td colSpan={3} className="border border-black p-2 text-[10px] text-center">合计</td>
            <td className="border border-black p-2 text-[10px] text-right">
              {items.reduce((sum, item) => sum + (item.productionVolume || 0), 0).toFixed(3)}
            </td>
            <td className="border border-black p-2 text-[10px]"></td>
          </tr>
        </tbody>
      </table>

      <div className="mt-12 grid grid-cols-3 gap-4 text-[11px] px-2">
        <div className="border-b border-black pb-1">编制人：{data.creator}</div>
        <div className="border-b border-black pb-1">部门负责人：</div>
        <div className="border-b border-black pb-1">分管领导：</div>
      </div>
    </div>
  );

  return (
    <div className="p-10 bg-white text-black font-serif print:p-0">
      <style>{`
        @media print {
          .break-after-page {
            page-break-after: always;
          }
        }
      `}</style>
      
      {/* 第一部分：再造原料 */}
      {rawMaterials.length > 0 && renderTable(rawMaterials, '再造原料')}
      
      {/* 分隔线（仅预览可见） */}
      {rawMaterials.length > 0 && fragrances.length > 0 && (
        <div className="my-8 border-t-2 border-dashed border-gray-200 relative print:hidden">
        </div>
      )}

      {/* 第二部分：香精香料 */}
      {fragrances.length > 0 && renderTable(fragrances, '香精香料')}
    </div>
  );
};
