import React, { useState, useMemo } from 'react';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { mockRawMaterialInventoryData } from '../../../../data/plan/rawMaterialInventoryData';
import { cn } from '../../../../lib/utils';

interface RawMaterialInventoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RawMaterialInventoryDialog: React.FC<RawMaterialInventoryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const filteredData = useMemo(() => {
    if (showLowStockOnly) {
      // 差值 < 50 的数据 (注意负数也算小于50)
      return mockRawMaterialInventoryData.filter(item => item.difference < 50);
    }
    return mockRawMaterialInventoryData;
  }, [showLowStockOnly]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="原料库存对比"
      maxWidth="4xl"
      className="p-0"
    >
      <div className="flex flex-col h-full max-h-[80vh]">
        <div className="px-6 py-3 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="text-sm font-bold text-gray-700">库存差异概览</div>
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm transition-all hover:border-blue-300">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
              />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#409eff]"></div>
              <span className="ms-2 text-xs font-medium text-gray-600 select-none">显示低库存 (差值 &lt; 50)</span>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="border border-gray-100 rounded-md overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fcfcfc] hover:bg-[#fcfcfc]">
                  <TableHead className="w-16 text-center font-bold text-gray-600 h-10 py-0">序号</TableHead>
                  <TableHead className="font-bold text-gray-600 h-10 py-0">物料名称</TableHead>
                  <TableHead className="w-40 text-right font-bold text-gray-600 h-10 py-0">总计投料量 (kg)</TableHead>
                  <TableHead className="w-40 text-right font-bold text-gray-600 h-10 py-0">当前库存量 (kg)</TableHead>
                  <TableHead className="w-32 text-right font-bold text-gray-600 h-10 py-0">差值</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className={cn(
                        "hover:bg-blue-50/20 group",
                        item.difference < 0 ? "bg-red-50/5" : ""
                      )}
                    >
                      <TableCell className="text-center text-gray-400 py-2.5 text-[12px]">{index + 1}</TableCell>
                      <TableCell className="font-medium text-gray-700 py-2.5 text-[12px] leading-relaxed">
                        {item.materialName}
                      </TableCell>
                      <TableCell className="text-right tabular-nums py-2.5 text-[12px] font-medium text-gray-600">
                        {item.totalInputQuantity.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right tabular-nums py-2.5 text-[12px] font-medium text-gray-500">
                        {item.currentInventory.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell 
                        className={cn(
                          "text-right tabular-nums py-2.5 text-[13px] font-bold",
                          item.difference < 0 ? "text-[#f56c6c]" : "text-[#67c23a]"
                        )}
                      >
                        {item.difference > 0 ? '+' : ''}{item.difference.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-gray-400 text-sm">
                      筛选后暂无匹配项
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
