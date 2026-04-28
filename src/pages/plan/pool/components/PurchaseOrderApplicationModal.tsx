import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Modal } from '../../../../components/ui/modal';
import { mockCustomerData } from '../../../../data/customerData';
import { ProductInfo } from '../../../../types/plan';
import { RestrictedProductionTypeByProductCategory } from '../../../../types/base-data';
import { ProductSelector } from '../../../plan/components/ProductSelector';
import { Trash2, Plus } from 'lucide-react';

interface PurchaseOrderApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function PurchaseOrderApplicationModal({ isOpen, onClose, onSubmit }: PurchaseOrderApplicationModalProps) {
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  
  // Base Info State
  const [orderType, setOrderType] = useState('普通');
  const [customer, setCustomer] = useState(mockCustomerData[0]?.customerName || '');
  const [remarks, setRemarks] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const salesperson = '当前用户';
  const department = '营销部';
  const currency = '人民币';

  // Details State
  const [details, setDetails] = useState<any[]>([]);

  const handleProductSelect = (selectedProducts: ProductInfo[]) => {
    const newDetails = selectedProducts.map(p => ({
      id: Math.random().toString(36).substr(2, 9),
      productInfo: p,
      productionType: '',
      requirements: [{ id: Math.random().toString(36).substr(2, 9), sequenceNumber: 1, versionNo: 'V1.0', requirementAmount: 0, unit: '吨' }],
      expectedCompletionDate: '',
      plannedShippingDate: '',
      deliveryDate: '',
      deliveryLocation: '',
      taxRate: 0.13,
    }));
    setDetails(prev => [...prev, ...newDetails]);
    setIsProductSelectorOpen(false);
  };

  const handleDetailChange = (id: string, field: string, value: any) => {
    setDetails(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleRequirementChange = (detailId: string, amount: number) => {
    setDetails(prev => prev.map(d => {
      if (d.id === detailId) {
        return {
          ...d,
          requirements: [{ ...d.requirements[0], requirementAmount: amount }]
        };
      }
      return d;
    }));
  };

  const removeDetail = (id: string) => {
    setDetails(prev => prev.filter(d => d.id !== id));
  };

  const getProductionTypes = (productType: string) => {
    const allowedForPO = [
      '香精香料受托加工',
      '香精香料集中调配',
      '再造烟叶配方生产（成品）',
      '再造梗丝配方生产（成品）'
    ];
    return (RestrictedProductionTypeByProductCategory[productType] || []).filter(t => allowedForPO.includes(t as string));
  };

  const totalQuantitySum = details.reduce((sum, d) => sum + (d.requirements[0].requirementAmount || 0), 0);
  const totalTaxAmountSum = details.reduce((sum, d) => {
    const qty = d.requirements[0].requirementAmount || 0;
    return sum + (qty * (d.productInfo.unitPriceInclTax || 0));
  }, 0);

  const handleSubmit = () => {
    if (details.length === 0) {
      alert("请至少添加一条产品明细");
      return;
    }
    for (const d of details) {
      if (!d.productionType || !d.requirements[0].requirementAmount || !d.plannedShippingDate || !d.deliveryDate) {
         alert(`请将订单明细（${d.productInfo.productName}）的必填信息填写完整`);
         return;
      }
    }

    // Usually we submit multiple, but since system expects 1 entry per output for now,
    // we fire multiple onSubmits or one array. Assume the parent wants an array or single.
    // Wait, onSubmit in Pool page just prepends. 
    // We can map all details to individual rows because plan pool shows them line by line.
    const formDatas = details.map(d => {
      const amtExcl = (d.requirements[0].requirementAmount || 0) * (d.productInfo.unitPriceExclTax || 0);
      return {
        productType: d.productInfo.productType,
        productionType: d.productionType,
        productName: d.productInfo.productName,
        productCode: d.productInfo.productCode,
        brandGrade: d.productInfo.brandGrade,
        specification: d.productInfo.specification,
        customerName: customer,
        totalRequirementAmount: d.requirements[0].requirementAmount,
        requirements: d.requirements,
        unit: '吨',
        unitPriceExclTax: d.productInfo.unitPriceExclTax,
        unitPriceInclTax: d.productInfo.unitPriceInclTax,
        amountExclTax: amtExcl,
        expectedCompletionDate: d.expectedCompletionDate,
        deliveryDate: d.deliveryDate,
        deliveryLocation: d.deliveryLocation,
        applicantName: salesperson,
        applicantDepartment: department,
        applicationType: orderType,
        remarks: remarks,
        orderDate: orderDate,
        isPO: true
      };
    });
    
    // In pool index, onSubmit just takes `data` and prepends it: `setPendingPool([data, ...pendingPool])`
    // So we should iterate and onSubmit each, or change the parent to accept array.
    // Let's call onSubmit for each to match parent's current expectation:
    formDatas.forEach(data => onSubmit(data));
    onClose();
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>取消</Button>
      <Button className="bg-[#1890ff] hover:bg-[#40a9ff] text-white" onClick={handleSubmit}>生成并发起申请</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="计划池入池申请 - 采购订单类"
      maxWidth="full"
      className="md:max-w-[95vw]"
      footer={footer}
    >
      <div className="flex flex-col px-4 py-4 gap-4 bg-[#f8f9fc] min-h-[500px]">
        {/* 基础信息 */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
           <h3 className="font-semibold text-gray-800 mb-4 text-[15px] relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-blue-500 before:rounded-full">订单基础信息</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1"><span className="text-red-500 mr-1">*</span>订单类型</label>
                <select 
                  value={orderType} 
                  onChange={(e) => setOrderType(e.target.value)} 
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                >
                  <option value="普通">普通</option>
                  <option value="紧急">紧急</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1"><span className="text-red-500 mr-1">*</span>订单日期</label>
                <input 
                  type="date" 
                  value={orderDate} 
                  onChange={(e) => setOrderDate(e.target.value)} 
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1"><span className="text-red-500 mr-1">*</span>客户</label>
                <select 
                  value={customer} 
                  onChange={(e) => setCustomer(e.target.value)} 
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500"
                >
                  {mockCustomerData.map(c => (
                    <option key={c.id} value={c.customerName}>{c.customerName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">业务员</label>
                <input type="text" readOnly value={salesperson} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">部门</label>
                <input type="text" readOnly value={department} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">币种</label>
                <input type="text" readOnly value={currency} className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">总数量(吨)</label>
                <div className="text-sm font-bold text-blue-600 pt-1.5">{totalQuantitySum.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">总结税合计</label>
                <div className="text-sm font-bold text-green-600 pt-1.5">{totalTaxAmountSum.toFixed(2)}</div>
              </div>
              <div className="col-span-2 lg:col-span-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">备注</label>
                <input 
                  type="text" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="请输入备注说明（选填）"
                  maxLength={500}
                  className="w-full border border-gray-300 bg-white text-gray-700 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500" 
                />
              </div>
           </div>
        </div>

        {/* 详细信息 */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col min-h-[300px]">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-[15px] relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-blue-500 before:rounded-full">明细信息</h3>
              <Button variant="primary" size="sm" onClick={() => setIsProductSelectorOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> 添加明细
              </Button>
           </div>
           
           <div className="overflow-x-auto border border-gray-200 rounded pb-32">
             <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                <thead className="bg-[#f5f7fa]">
                  <tr>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r w-12 text-center sticky left-0 bg-[#f5f7fa] z-10">操作</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">产品类型</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>生产类型</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">产品名称</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">产品编号</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">牌号</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">规格</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>需求量(吨)</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">单位</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>计划发货日期</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>到货时间</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">期望完成时间</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">到货地点</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">无税单价</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">含税单价</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">无税金额</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">税率</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200">税额</th>
                  </tr>
                </thead>
                <tbody>
                  {details.length === 0 ? (
                    <tr><td colSpan={18} className="py-8 text-center text-gray-400 text-sm">点击右上角添加明细</td></tr>
                  ) : details.map((d) => {
                     const amtExcl = (d.requirements[0].requirementAmount || 0) * (d.productInfo.unitPriceExclTax || 0);
                     const taxAmt = (d.requirements[0].requirementAmount || 0) * (d.productInfo.unitPriceInclTax || 0) - amtExcl;
                     return (
                       <tr key={d.id} className="hover:bg-gray-50 border-b border-gray-200 group">
                          <td className="py-2 px-2 border-r border-gray-200 text-center sticky left-0 bg-white group-hover:bg-gray-50 z-10 shadow-[1px_0_0_#e5e7eb]">
                            <button className="text-red-500 hover:text-red-700 p-1" onClick={() => removeDetail(d.id)}>
                              <Trash2 className="w-4 h-4 cursor-pointer" />
                            </button>
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.productType}</td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <select 
                                value={d.productionType}
                                onChange={(e) => handleDetailChange(d.id, 'productionType', e.target.value)}
                                className="w-full min-w-[140px] border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:border-blue-500 outline-none"
                             >
                                <option value="">请选择</option>
                                {getProductionTypes(d.productInfo.productType).map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] font-medium text-gray-800 bg-gray-50">{d.productInfo.productName}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50 font-mono">{d.productInfo.productCode}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.brandGrade}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.specification}</td>
                          <td className="py-2 px-2 border-r border-gray-200 relative">
                             <input 
                                type="number" 
                                min="0" step="0.01"
                                value={d.requirements[0].requirementAmount || ''} 
                                onChange={(e) => handleRequirementChange(d.id, parseFloat(e.target.value) || 0)}
                                className="w-[100px] border border-gray-300 rounded px-2 py-1 text-sm font-mono focus:border-blue-500 outline-none" 
                                placeholder="输入数字"
                             />
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50 text-center">吨</td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                                type="date" 
                                value={d.plannedShippingDate} 
                                onChange={(e) => handleDetailChange(d.id, 'plannedShippingDate', e.target.value)}
                                className="w-[120px] border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none" 
                             />
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                                type="date" 
                                value={d.deliveryDate} 
                                onChange={(e) => handleDetailChange(d.id, 'deliveryDate', e.target.value)}
                                className="w-[120px] border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none" 
                             />
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                                type="date" 
                                value={d.expectedCompletionDate} 
                                onChange={(e) => handleDetailChange(d.id, 'expectedCompletionDate', e.target.value)}
                                className="w-[120px] border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none" 
                             />
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                                type="text" 
                                value={d.deliveryLocation} 
                                onChange={(e) => handleDetailChange(d.id, 'deliveryLocation', e.target.value)}
                                className="w-[140px] border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none" 
                             />
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right text-[13px] text-gray-600 bg-gray-50 font-mono">{d.productInfo.unitPriceExclTax?.toFixed(2)}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right text-[13px] text-gray-600 bg-gray-50 font-mono">{d.productInfo.unitPriceInclTax?.toFixed(2)}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right text-[13px] text-gray-800 font-bold bg-gray-50 font-mono">{amtExcl.toFixed(2)}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-right text-[13px] text-gray-600 bg-gray-50 font-mono">{(d.taxRate * 100).toFixed(0)}%</td>
                          <td className="py-2 px-3 text-right text-[13px] text-gray-800 font-bold bg-gray-50 font-mono">{taxAmt.toFixed(2)}</td>
                       </tr>
                     );
                  })}
                </tbody>
             </table>
           </div>
        </div>
      </div>

      <ProductSelector 
        isOpen={isProductSelectorOpen} 
        onClose={() => setIsProductSelectorOpen(false)} 
        onConfirm={handleProductSelect} 
        multiple={true}
      />
    </Modal>
  );
}

