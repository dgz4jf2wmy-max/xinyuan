import React from 'react';
import { AnnualPlanDetail, ApprovalProcessInfo } from '../../../../types/plan';

export interface AnnualPlanPrintTemplateProps {
  renderRows: any[];
  versionNo: string;
  year: number | string;
  createdAt: string;
  createdBy: string;
  isInitialVersion: boolean;
  approvalProcess: ApprovalProcessInfo[];
}

/**
 * 针对年度产销计划专门设计的独立打印模板组件
 * 此组件是一个纯呈现视图，使用传统的 HTML table 标签和极简的 css border 构建
 * 实现了完全贴合线下物理表格报表的要求
 */
export function AnnualPlanPrintTemplate({ 
  renderRows, 
  versionNo, 
  year, 
  createdAt, 
  createdBy, 
  isInitialVersion,
  approvalProcess
}: AnnualPlanPrintTemplateProps) {
  
  return (
    <div className="w-[210mm] min-h-[297mm] mx-auto p-12 bg-white text-black print:w-full print:min-h-auto print:p-4 print:mx-0 box-border text-[12px] font-sans">
      {/* 报表标题 / Header */}
      <h1 className="text-2xl tracking-[0.2em] font-black text-center mb-8 border-b-2 border-black pb-4">
        {year}年度产销计划表
      </h1>
      
      {/* 报表基础信息列 */}
      <div className="flex justify-between items-end mb-3 text-[13px] font-medium">
         <div><span className="text-gray-700">业务编号流水：</span>{versionNo}</div>
         <div><span className="text-gray-700">制单人员：</span>{createdBy}</div>
         <div><span className="text-gray-700">印发时间：</span>{createdAt}</div>
      </div>

      {/* 核心高度结构化物理表格 */}
      <table className="w-full border-collapse border border-black mb-8 text-center">
         <thead>
           <tr className="bg-gray-100/50 grayscale print:bg-transparent">
             <th className="border border-black p-2 w-[40px] font-bold">序号</th>
             <th className="border border-black p-2 w-[80px] font-bold">产品类型</th>
             <th className="border border-black p-2 font-bold">客户名称</th>
             <th className="border border-black p-2 font-bold">牌号</th>
             <th className="border border-black p-2 w-[70px] font-bold leading-tight">预计销售量<br/>(箱)</th>
             {!isInitialVersion && <th className="border border-black p-2 w-[70px] font-bold leading-tight">期初库存<br/>(箱)</th>}
             {!isInitialVersion && <th className="border border-black p-2 w-[70px] font-bold leading-tight">备产数量<br/>(箱)</th>}
             <th className="border border-black p-2 w-[70px] font-bold leading-tight">预计生产量<br/>(箱)</th>
             <th className="border border-black p-2 w-[80px] font-bold leading-tight">单价<br/>(元/公斤)</th>
           </tr>
         </thead>
         <tbody>
           {renderRows.map((row, idx) => {
             if (row.type === 'data' && row.data) {
               return (
                 <tr key={`print-data-${row.originalIndex}`}>
                   {row.rowSpanGroup !== undefined && row.rowSpanGroup > 0 && (
                     <>
                       <td rowSpan={row.rowSpanGroup} className="border border-black p-2">{row.seq}</td>
                       <td rowSpan={row.rowSpanGroup} className="border border-black p-2">{row.groupLabel}</td>
                     </>
                   )}
                   {row.rowSpanCustomer !== undefined && row.rowSpanCustomer > 0 && (
                     <td rowSpan={row.rowSpanCustomer} className="border border-black p-2">{row.data.customerName}</td>
                   )}
                   <td className="border border-black p-2">{row.data.brandGrade || '-'}</td>
                   <td className="border border-black p-2 font-medium">{row.data.estimatedSalesVolume?.toFixed(2)}</td>
                   
                   {!isInitialVersion && (
                     <>
                       <td className="border border-black p-2">{row.data.initialInventory?.toFixed(2) || '0.00'}</td>
                       <td className="border border-black p-2">{row.data.reserveQuantity?.toFixed(2) || '0.00'}</td>
                     </>
                   )}

                   <td className="border border-black p-2 font-medium">{row.data.estimatedProductionVolume?.toFixed(2)}</td>
                   <td className="border border-black p-2">{row.data.unitPriceExclTax?.toFixed(2) || row.data.unitPrice?.toFixed(2) || '0.00'}</td>
                 </tr>
               );
             } else if (row.type === 'subtotal') {
               return (
                 <tr key={`print-subtotal-${idx}`} className="font-bold print:font-bold bg-gray-50/50 print:bg-transparent">
                   <td colSpan={4} className="border border-black p-2 text-center text-gray-800">{row.label}</td>
                   <td className="border border-black p-2 text-center">{row.sales?.toFixed(2)}</td>
                   {!isInitialVersion && (
                     <>
                       <td className="border border-black p-2 text-center bg-gray-100/30 print:bg-transparent">/</td>
                       <td className="border border-black p-2 text-center bg-gray-100/30 print:bg-transparent">/</td>
                     </>
                   )}
                   <td className="border border-black p-2 text-center">{row.production?.toFixed(2)}</td>
                   <td className="border border-black p-2 text-center bg-gray-100/30 print:bg-transparent">/</td>
                 </tr>
               );
             } else if (row.type === 'total' || row.type === 'grand_total') {
               return (
                 <tr key={`print-total-${idx}`} className="font-black bg-gray-100/50 print:bg-transparent border-t-2 border-b-2 border-black">
                   <td colSpan={4} className="border border-black p-2 text-center text-gray-900 tracking-wider">
                     {row.label}
                   </td>
                   <td className="border border-black p-2 text-center">{row.sales?.toFixed(2)}</td>
                   {!isInitialVersion && (
                     <>
                       <td className="border border-black p-2 text-center">/</td>
                       <td className="border border-black p-2 text-center">/</td>
                     </>
                   )}
                   <td className="border border-black p-2 text-center">{row.production?.toFixed(2)}</td>
                   <td className="border border-black p-2 text-center">/</td>
                 </tr>
               );
             }
             return null;
           })}
         </tbody>
      </table>

      {/* 报表签字区块(流程审批) */}
      <table className="w-full border-collapse border border-black mt-8 text-center">
        <thead>
          <tr className="bg-gray-100/50 grayscale print:bg-transparent">
            {approvalProcess.map((step, idx) => (
              <th key={`head-${idx}`} className="border border-black p-2 font-bold" style={{ width: `${100 / Math.max(approvalProcess.length, 1)}%` }}>
                {step.nodeName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {approvalProcess.map((step, idx) => (
              <td key={`body-${idx}`} className="border border-black p-4 font-bold text-gray-800 h-16 align-middle text-[14px]">
                {step.approver || '-'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
