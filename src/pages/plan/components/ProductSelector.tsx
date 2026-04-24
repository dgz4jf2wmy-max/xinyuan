import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { ProductInfo, ProductType } from '../../../types/plan';
import { mockProductList } from '../../../data/plan/productData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Input } from '../../../components/ui/input';

import { Button } from '../../../components/ui/button';

interface ProductSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  multiple?: boolean;
  onConfirm: (products: ProductInfo[]) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ isOpen, onClose, multiple = false, onConfirm }) => {
  const [selectedType, setSelectedType] = useState<ProductType | '全部'>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<ProductInfo[]>([]);

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedType('全部');
      setSearchQuery('');
      setSelectedProducts([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const productTypes = ['全部', ProductType.ReconstitutedTobacco, ProductType.ReconstitutedStem, ProductType.FlavorAndFragrance];

  const filteredProducts = mockProductList.filter(p => {
    const matchType = selectedType === '全部' || p.productType === selectedType;
    const matchSearch = p.productName.includes(searchQuery) || 
                        p.productCode.includes(searchQuery) || 
                        p.brandGrade.includes(searchQuery) ||
                        p.customerName.includes(searchQuery);
    return matchType && matchSearch;
  });

  const handleToggleSelect = (product: ProductInfo) => {
    if (!multiple) {
      onConfirm([product]);
      onClose();
      return;
    }

    const isSelected = selectedProducts.some(p => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedProducts);
    onClose();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = [...selectedProducts];
      filteredProducts.forEach(p => {
        if (!newSelected.some(sp => sp.id === p.id)) {
          newSelected.push(p);
        }
      });
      setSelectedProducts(newSelected);
    } else {
      const filteredIds = new Set(filteredProducts.map(p => p.id));
      setSelectedProducts(selectedProducts.filter(p => !filteredIds.has(p.id)));
    }
  };

  const isAllFilteredSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts.some(sp => sp.id === p.id));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[1000px] h-[70vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#ebeef5]">
          <h3 className="text-lg font-bold text-[#303133]">选择产品</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Tree */}
          <div className="w-56 border-r border-[#ebeef5] bg-[#fafafa] flex flex-col">
            <div className="p-3 border-b border-[#ebeef5] font-bold text-[#303133] text-sm">
              产品类型
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {productTypes.map(type => (
                <div 
                  key={type}
                  className={`px-3 py-2 text-sm cursor-pointer rounded mb-1 transition-colors ${
                    selectedType === type 
                      ? 'bg-[#e6f1fc] text-[#409eff] font-medium' 
                      : 'text-[#606266] hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedType(type as ProductType | '全部')}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Right Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="p-3 border-b border-[#ebeef5] flex items-center">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="搜索产品名称/编号/牌号/客户" 
                  className="pl-9 h-8 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-3">
              <Table className="border-collapse w-full">
                <TableHeader>
                  <TableRow className="bg-[#f5f7fa]">
                    {multiple && (
                      <TableHead className="w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={isAllFilteredSelected} 
                          onChange={handleSelectAll} 
                          className="cursor-pointer w-4 h-4 rounded border-gray-300 text-[#409eff] focus:ring-[#409eff]" 
                        />
                      </TableHead>
                    )}
                    <TableHead className="text-center">产品类型</TableHead>
                    <TableHead className="text-center">客户名称</TableHead>
                    <TableHead className="text-center">产品名称</TableHead>
                    <TableHead className="text-center">产品编号</TableHead>
                    <TableHead className="text-center">牌号</TableHead>
                    {!multiple && <TableHead className="text-center w-24">操作</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <TableRow 
                        key={p.id} 
                        className={`hover:bg-blue-50/50 ${multiple ? 'cursor-pointer' : ''}`}
                        onClick={() => multiple && handleToggleSelect(p)}
                      >
                        {multiple && (
                          <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedProducts.some(sp => sp.id === p.id)} 
                              onChange={() => handleToggleSelect(p)} 
                              className="cursor-pointer w-4 h-4 rounded border-gray-300 text-[#409eff] focus:ring-[#409eff]" 
                            />
                          </TableCell>
                        )}
                        <TableCell className="text-center">{p.productType}</TableCell>
                        <TableCell className="text-center">{p.customerName}</TableCell>
                        <TableCell className="text-center">{p.productName}</TableCell>
                        <TableCell className="text-center">{p.productCode}</TableCell>
                        <TableCell className="text-center">{p.brandGrade}</TableCell>
                        {!multiple && (
                          <TableCell className="text-center">
                            <button 
                              className="text-[#409eff] hover:text-blue-600 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                              onClick={() => handleToggleSelect(p)}
                            >
                              选择
                            </button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={multiple ? 6 : 6} className="text-center py-8 text-gray-400">
                        没有找到匹配的产品
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Footer for multiple selection */}
        {multiple && (
          <div className="p-4 border-t border-[#ebeef5] flex justify-between items-center bg-gray-50">
            <div className="text-sm text-gray-500">
              已选择 <span className="text-[#409eff] font-bold mx-1">{selectedProducts.length}</span> 项
            </div>
            <div className="space-x-3">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button 
                variant="primary" 
                onClick={handleConfirm} 
                disabled={selectedProducts.length === 0}
              >
                确定
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
