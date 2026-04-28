import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/modal';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { mockCustomers, mockProducts } from '../../../../data/base/addSubBrandData';
import { SubBrandEntry } from '../../../../types/sub-brand';

interface AddSubBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SubBrandEntry) => void;
  existingData: SubBrandEntry[];
}

export const AddSubBrandModal: React.FC<AddSubBrandModalProps> = ({ isOpen, onClose, onSave, existingData }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [subBrandCode, setSubBrandCode] = useState('');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedProductId('');
      setSelectedCustomerId('');
      setSubBrandCode('');
    }
  }, [isOpen]);

  // Handle generation of subBrandCode
  useEffect(() => {
    if (selectedProductId && selectedCustomerId) {
      const product = mockProducts.find(p => p.id === selectedProductId);
      const customer = mockCustomers.find(c => c.id === selectedCustomerId);
      if (product && customer) {
        // 计算序号：查找该牌号下已有的客户数量
        const existingCount = existingData.filter(item => item.brand === product.brand).length;
        const nextIndex = existingCount + 1;
        const paddedIndex = nextIndex.toString().padStart(2, '0');
        const generatedCode = `${product.brand}${paddedIndex}`;
        setSubBrandCode(generatedCode);
      }
    } else {
      setSubBrandCode('');
    }
  }, [selectedProductId, selectedCustomerId, existingData]);

  const handleSave = () => {
    if (!selectedProductId || !selectedCustomerId || !subBrandCode) {
      alert('请选择产品和客户');
      return;
    }

    const product = mockProducts.find(p => p.id === selectedProductId);
    const customer = mockCustomers.find(c => c.id === selectedCustomerId);

    if (product && customer) {
      const newEntry: SubBrandEntry = {
        id: `generate-${Date.now()}`,
        subBrandCode: subBrandCode,
        productName: product.productName,
        productCode: product.productCode,
        customerName: customer.name,
        brand: product.brand
      };
      onSave(newEntry);
    }
  };

  const selectedProduct = mockProducts.find(p => p.id === selectedProductId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="手动新增分牌号">
      <div className="space-y-4">
        {/* 产品选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500 mr-1">*</span>关联产品
          </label>
          <select 
            className="w-full h-9 rounded-md border border-[#dcdfe6] bg-white px-3 py-1 text-sm text-[#606266] transition-colors hover:border-[#c0c4cc] focus:border-[#409eff] focus:outline-none"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">请选择产品...</option>
            {mockProducts.map(p => (
              <option key={p.id} value={p.id}>{p.productName} ({p.productCode})</option>
            ))}
          </select>
        </div>

        {/* 带入的产品信息 (只读) */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">产品编号</label>
            <Input disabled className="bg-gray-50" value={selectedProduct?.productCode || ''} placeholder="自动带入" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">牌号</label>
            <Input disabled className="bg-gray-50" value={selectedProduct?.brand || ''} placeholder="自动带入" />
          </div>
        </div>

        {/* 客户选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500 mr-1">*</span>关联客户
          </label>
          <select 
            className="w-full h-9 rounded-md border border-[#dcdfe6] bg-white px-3 py-1 text-sm text-[#606266] transition-colors hover:border-[#c0c4cc] focus:border-[#409eff] focus:outline-none"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">请选择客户...</option>
            {mockCustomers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* 自动生成的分牌号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500 mr-1">*</span>分牌号
          </label>
          <Input 
            className="font-mono text-[#409eff]" 
            value={subBrandCode} 
            onChange={(e) => setSubBrandCode(e.target.value)}
            placeholder="选择产品和客户后自动生成，可手动修改" 
          />
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#ebeef5]">
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button variant="primary" onClick={handleSave}>确认新增</Button>
      </div>
    </Modal>
  );
};
