import React, { useState, useEffect } from 'react';
import { Button } from '../../../../../../components/ui/button';
import { Modal } from '../../../../../../components/ui/modal';
import { ProductionPlanPool } from '../../../../../../types/production-pool';
import { mockProductionPoolData } from '../../../../../../data/plan/productionPoolData';

interface ProductionPoolSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedItems: ProductionPlanPool[]) => void;
}

export function ProductionPoolSelectionModal({ isOpen, onClose, onSubmit }: ProductionPoolSelectionModalProps) {
  const [data, setData] = useState<ProductionPlanPool[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      // 模拟加载生产计划池数据，并过滤出生产类型包含“醇化”的记录
      const filtered = mockProductionPoolData.filter(item => 
        item.productionType.includes('醇化')
      );
      setData(filtered);
      setSelectedIds(new Set());
    }
  }, [isOpen]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(data.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSubmit = () => {
    const selectedItems = data.filter(item => selectedIds.has(item.id));
    if (selectedItems.length === 0) {
      alert('请至少选择一条记录');
      return;
    }
    onSubmit(selectedItems);
    onClose();
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={onClose}>取消</Button>
      <Button variant="primary" size="sm" onClick={handleSubmit}>确认选择</Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="从生产计划池选择"
      maxWidth="5xl"
      footer={footer}
    >
      <div className="flex flex-col p-4 max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
          <thead className="bg-[#f5f7fa] sticky top-0 z-10">
            <tr>
              <th className="py-2.5 px-3 border-b border-gray-200">
                <input 
                  type="checkbox" 
                  checked={data.length > 0 && selectedIds.size === data.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-2.5 px-3 font-medium text-gray-600 border-b border-gray-200">单据编号</th>
              <th className="py-2.5 px-3 font-medium text-gray-600 border-b border-gray-200">牌号</th>
              <th className="py-2.5 px-3 font-medium text-gray-600 border-b border-gray-200">产品类型</th>
              <th className="py-2.5 px-3 font-medium text-gray-600 border-b border-gray-200">生产类型</th>
              <th className="py-2.5 px-3 font-medium text-gray-600 border-b border-gray-200">产品名称</th>
              <th className="py-2.5 px-3 font-medium text-gray-600 border-b border-gray-200 text-right">需求量</th>
              <th className="py-2.5 px-3 font-medium text-gray-600 border-b border-gray-200">单位</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">暂无醇化生产类型的计划记录</td>
              </tr>
            ) : data.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer"
                onClick={() => handleToggleSelect(item.id)}
              >
                <td className="py-2 px-3">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(item.id)}
                    readOnly
                  />
                </td>
                <td className="py-2 px-3 text-gray-600 font-mono">{item.documentNo}</td>
                <td className="py-2 px-3 font-bold text-gray-700">{item.brandGrade}</td>
                <td className="py-2 px-3 text-gray-600">{item.productType}</td>
                <td className="py-2 px-3 text-gray-600">{item.productionType}</td>
                <td className="py-2 px-3 text-gray-600">{item.productName}</td>
                <td className="py-2 px-3 font-bold text-gray-700 text-right">{item.totalRequirementAmount}</td>
                <td className="py-2 px-3 text-gray-500">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
