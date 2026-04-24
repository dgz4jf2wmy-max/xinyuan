import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { mockApplicationProducts, ProductConfig } from '../../../../data/plan/poolApplicationFormData';
import { mockCustomerData } from '../../../../data/customerData';
import { ProductSelector } from '../../../plan/components/ProductSelector';
import { ProductInfo } from '../../../../types/plan';

import { RestrictedProductionTypeByProductCategory } from '../../../../types/base-data';

// ... (other imports)
import { Modal } from '../../../../components/ui/modal';

interface RequirementVersion {
  id: string;
  sequenceNumber: number;
  versionNo: string;
  requirementAmount: number;
  unit: string;
}

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ApplicationFormModal({ isOpen, onClose, onSubmit }: ApplicationFormModalProps) {
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  
  const [customerName, setCustomerName] = useState<string>('');
  const [productionType, setProductionType] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState<string>('');
  
  const [requirements, setRequirements] = useState<RequirementVersion[]>([
    { id: '1', sequenceNumber: 1, versionNo: '当前版本', requirementAmount: 0, unit: '吨' }
  ]);

  // Derive total amount in Tons
  const totalRequirementAmount = requirements.reduce((sum, req) => {
    let amount = req.requirementAmount || 0;
    if (req.unit === '公斤') {
      amount = amount / 1000;
    }
    return sum + amount;
  }, 0);

  const amountExclTax = selectedProduct?.unitPriceExclTax ? totalRequirementAmount * selectedProduct.unitPriceExclTax : 0;

  const handleProductSelect = (products: ProductInfo[]) => {
    if (products.length > 0) {
      setSelectedProduct(products[0]);
      setProductionType(''); // cascade reset
    }
    setIsProductSelectorOpen(false);
  };

  const getProductionTypes = (productType: string) => {
    return RestrictedProductionTypeByProductCategory[productType] || [];
  };

  const handleUpdateRequirement = (id: string, field: 'requirementAmount' | 'unit', value: any) => {
    setRequirements(requirements.map(req => req.id === id ? { ...req, [field]: value } : req));
  };

  const handleSubmit = () => {
    if (!selectedProduct || !productionType || !customerName || totalRequirementAmount <= 0) {
      alert("请填写完整的必填项信息");
      return;
    }
    
    // Simulate submission
    const formData = {
      productType: selectedProduct.productType,
      productionType,
      productName: selectedProduct.productName,
      productCode: selectedProduct.productCode,
      brandGrade: selectedProduct.brandGrade,
      specification: selectedProduct.specification,
      unit: selectedProduct.unit,
      unitPriceExclTax: selectedProduct.unitPriceExclTax,
      unitPriceInclTax: selectedProduct.unitPriceInclTax,
      amountExclTax,
      customerName,
      totalRequirementAmount,
      requirements,
      deliveryDate,
      deliveryLocation,
      applicantName: '当前用户',
      applicantDepartment: '计划部',
    };
    
    onSubmit(formData);
    onClose();
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>取消</Button>
      <Button className="bg-[#1890ff] hover:bg-[#40a9ff] text-white" onClick={handleSubmit}>确认发起</Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="生产计划池入池申请"
      maxWidth="4xl"
      footer={footer}
    >
      <>
        <div className="flex flex-col px-4 py-4 gap-0">
          {/* Section 1: Product Selection */}
          <div className="w-full border-b border-gray-100 pb-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-base relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-blue-500 before:rounded-full">产品信息</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">
                    <span className="text-red-500 mr-1">*</span>产品名称
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedProduct?.productName || ''} 
                      placeholder="请选择产品"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700" 
                    />
                    <Button variant="outline" onClick={() => setIsProductSelectorOpen(true)}>选择产品</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">产品编号</label>
                  <input type="text" readOnly value={selectedProduct?.productCode || ''} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">产品类型</label>
                  <input type="text" readOnly value={selectedProduct?.productType || ''} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">牌号</label>
                  <input type="text" readOnly value={selectedProduct?.brandGrade || ''} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">规格</label>
                  <input type="text" readOnly value={selectedProduct?.specification || ''} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-500" />
                </div>
              </div>
            </div>

            {/* Section 2: Application Details */}
            <div className="w-full border-b border-gray-100 pb-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-base relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-blue-500 before:rounded-full">需求信息</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">
                    <span className="text-red-500 mr-1">*</span>客户名称
                  </label>
                  <select 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">请选择财务客户信息</option>
                    {mockCustomerData.map(c => (
                      <option key={c.id} value={c.customerName}>{c.customerName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">
                    <span className="text-red-500 mr-1">*</span>生产类型
                  </label>
                  <select 
                    value={productionType}
                    onChange={(e) => setProductionType(e.target.value)}
                    disabled={!selectedProduct}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">请选择</option>
                    {selectedProduct && getProductionTypes(selectedProduct.productType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">
                    <span className="text-red-500 mr-1">*</span>需求量
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      min="0"
                      step="0.01"
                      value={requirements[0].requirementAmount || ''}
                      onChange={(e) => handleUpdateRequirement(requirements[0].id, 'requirementAmount', parseFloat(e.target.value) || 0)}
                      className="flex-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                      placeholder="当前配方版本产品的需求量"
                    />
                    <select
                      value={requirements[0].unit}
                      onChange={(e) => handleUpdateRequirement(requirements[0].id, 'unit', e.target.value)}
                      className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                    >
                      <option value="吨">吨</option>
                      <option value="公斤">公斤</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">期望完成时间</label>
                  <input 
                    type="date"
                    value={expectedCompletionDate}
                    onChange={(e) => setExpectedCompletionDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">到货时间</label>
                  <input 
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">到货地点</label>
                  <input 
                    type="text" 
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    placeholder="请输入"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Financials */}
            <div className="w-full">
              <h3 className="font-semibold text-gray-800 mb-4 text-base relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-blue-500 before:rounded-full">财务测算</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">无税单价</label>
                  <input type="text" readOnly value={selectedProduct?.unitPriceExclTax?.toFixed(2) || '0.00'} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">含税单价</label>
                  <input type="text" readOnly value={selectedProduct?.unitPriceInclTax?.toFixed(2) || '0.00'} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium tracking-wide text-gray-600 mb-1">无税金额</label>
                  <input type="text" readOnly value={amountExclTax.toFixed(2)} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-semibold text-gray-800" />
                </div>
              </div>
            </div>
          </div>
        
        <ProductSelector 
          isOpen={isProductSelectorOpen} 
          onClose={() => setIsProductSelectorOpen(false)} 
          onConfirm={handleProductSelect} 
          multiple={false}
        />
      </>
    </Modal>
  );
}
