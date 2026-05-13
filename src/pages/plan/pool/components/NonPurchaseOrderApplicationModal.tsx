import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Modal } from '../../../../components/ui/modal';
import { mockCustomerData } from '../../../../data/customerData';
import { ProductInfo } from '../../../../types/plan';
import { RestrictedProductionTypeByProductCategory } from '../../../../types/base-data';
import { ProductSelector } from '../../../plan/components/ProductSelector';
import { Trash2, Plus } from 'lucide-react';

interface NonPurchaseOrderApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  allowedProductionTypes?: string[];
}

export function NonPurchaseOrderApplicationModal({ isOpen, onClose, onSubmit, allowedProductionTypes }: NonPurchaseOrderApplicationModalProps) {
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  
  // Details State
  const [details, setDetails] = useState<any[]>([]);

  const salesperson = '当前用户';
  const department = '计划部';

  const handleProductSelect = (selectedProducts: ProductInfo[]) => {
    const newDetails = selectedProducts.map(p => ({
      id: Math.random().toString(36).substr(2, 9),
      productInfo: p,
      applicationType: '普通',
      productionType: '',
      customerName: '',
      requirements: [{ id: Math.random().toString(36).substr(2, 9), sequenceNumber: 1, versionNo: 'V1.0', requirementAmount: 0, unit: '吨' }],
      expectedCompletionDate: '',
      deliveryDate: '',
      deliveryLocation: '',
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
    let types = RestrictedProductionTypeByProductCategory[productType] || [];
    if (allowedProductionTypes && allowedProductionTypes.length > 0) {
      types = types.filter(t => allowedProductionTypes.some(allowed => t.includes(allowed))) as any;
    }
    return types;
  };

  const isCustomerDisabled = (productionType: string) => {
    return productionType === '再造烟叶配方生产（自制半成品）' || productionType === '再造梗丝配方生产（自制半成品）';
  }

  const handleSubmit = () => {
    if (details.length === 0) {
      alert("请至少添加一条产品明细");
      return;
    }
    for (const d of details) {
      if (!d.applicationType || !d.productionType || (!isCustomerDisabled(d.productionType) && !d.customerName) || !d.requirements[0].requirementAmount) {
         alert(`请将明细（${d.productInfo.productName}）的必填信息填写完整`);
         return;
      }
    }

    const formDatas = details.map(d => {
      const amtExcl = (d.requirements[0].requirementAmount || 0) * (d.productInfo.unitPriceExclTax || 0);
      return {
        productType: d.productInfo.productType,
        productionType: d.productionType,
        productName: d.productInfo.productName,
        productCode: d.productInfo.productCode,
        brandGrade: d.productInfo.brandGrade,
        specification: d.productInfo.specification,
        customerName: isCustomerDisabled(d.productionType) ? '' : d.customerName,
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
        applicationType: d.applicationType,
        isPO: false
      };
    });
    
    // Fire all submits sequentially or handle array based on parent
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
      title="计划池入池申请 - 非销售订单需求"
      maxWidth="full"
      className="md:max-w-[95vw]"
      footer={footer}
    >
      <div className="flex flex-col px-4 py-4 bg-[#f8f9fc] min-h-[500px]">
        {/* 详细信息 */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col flex-1">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-[15px] relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-blue-500 before:rounded-full">需求明细信息</h3>
              <Button variant="primary" size="sm" onClick={() => setIsProductSelectorOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> 添加需求
              </Button>
           </div>
           
           <div className="overflow-x-auto border border-gray-200 rounded pb-32">
             <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                <thead className="bg-[#f5f7fa]">
                  <tr>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r w-12 text-center sticky left-0 bg-[#f5f7fa] z-10">操作</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>申请类型</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">产品类型</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>生产类型</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">产品名称</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">产品编号</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">牌号</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">规格</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>客户名称</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r"><span className="text-red-500 mr-1">*</span>需求量(吨)</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">期望完成时间</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">到货时间</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">到货地点</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">无税单价</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200 border-r">含税单价</th>
                    <th className="py-2.5 px-3 text-[12px] font-medium text-gray-600 border-b border-gray-200">无税金额</th>
                  </tr>
                </thead>
                <tbody>
                  {details.length === 0 ? (
                    <tr><td colSpan={16} className="py-8 text-center text-gray-400 text-sm">点击右上角添加需求明细</td></tr>
                  ) : details.map((d) => {
                     const amtExcl = (d.requirements[0].requirementAmount || 0) * (d.productInfo.unitPriceExclTax || 0);
                     const disabledCustomer = isCustomerDisabled(d.productionType);
                     
                     return (
                        <tr key={d.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                          <td className="py-2 px-3 border-r border-gray-200 text-center sticky left-0 bg-white z-10 group-hover:bg-blue-50/30">
                            <button 
                              onClick={() => removeDetail(d.id)}
                              className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              title="删除此行"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <select 
                                value={d.applicationType}
                                onChange={(e) => handleDetailChange(d.id, 'applicationType', e.target.value)}
                                className="w-[80px] border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500 bg-white"
                             >
                               <option value="普通">普通</option>
                               <option value="紧急">紧急</option>
                             </select>
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.productType}</td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <select 
                                value={d.productionType}
                                onChange={(e) => handleDetailChange(d.id, 'productionType', e.target.value)}
                                className="w-[140px] border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500 bg-white"
                             >
                                <option value="">请选择</option>
                                {getProductionTypes(d.productInfo.productType).map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                             </select>
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.productName}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.productCode}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.brandGrade || '-'}</td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-600 bg-gray-50">{d.productInfo.specification || '-'}</td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <select 
                                value={disabledCustomer ? '' : d.customerName}
                                onChange={(e) => handleDetailChange(d.id, 'customerName', e.target.value)}
                                disabled={disabledCustomer}
                                className="w-[140px] border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                             >
                                <option value="">{disabledCustomer ? '-' : '请选择客户'}</option>
                                {mockCustomerData.map(c => (
                                  <option key={c.id} value={c.customerName}>{c.customerName}</option>
                                ))}
                             </select>
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                               type="number"
                               min="0"
                               step="0.01"
                               value={d.requirements[0].requirementAmount || ''}
                               onChange={(e) => handleRequirementChange(d.id, parseFloat(e.target.value) || 0)}
                               className="w-[90px] border border-gray-300 rounded px-2 py-1 text-[13px] font-mono outline-none focus:border-blue-500 text-right bg-white"
                               placeholder="数值"
                             />
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                               type="date"
                               value={d.expectedCompletionDate ?? ''}
                               onChange={(e) => handleDetailChange(d.id, 'expectedCompletionDate', e.target.value)}
                               className="w-[120px] border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500 bg-white"
                             />
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                               type="date"
                               value={d.deliveryDate ?? ''}
                               onChange={(e) => handleDetailChange(d.id, 'deliveryDate', e.target.value)}
                               className="w-[120px] border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500 bg-white"
                             />
                          </td>
                          <td className="py-2 px-2 border-r border-gray-200">
                             <input 
                               type="text"
                               value={d.deliveryLocation ?? ''}
                               onChange={(e) => handleDetailChange(d.id, 'deliveryLocation', e.target.value)}
                               className="w-[160px] border border-gray-300 rounded px-2 py-1 text-[13px] outline-none focus:border-blue-500 bg-white"
                               placeholder="到货地点(选填)"
                             />
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-500 text-right bg-gray-50">
                            {d.productInfo.unitPriceExclTax?.toFixed(2) || '0.00'}
                          </td>
                          <td className="py-2 px-3 border-r border-gray-200 text-[13px] text-gray-500 text-right bg-gray-50">
                            {d.productInfo.unitPriceInclTax?.toFixed(2) || '0.00'}
                          </td>
                          <td className="py-2 px-3 text-[13px] font-medium text-gray-800 text-right bg-gray-50">
                            {amtExcl.toFixed(2)}
                          </td>
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
