import React from 'react';
import { X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { RawMaterialInventoryComparison } from '../../../types/plan';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: RawMaterialInventoryComparison[];
}

export function RawMaterialComparisonModal({ isOpen, onClose, data }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[900px] h-[70vh] flex flex-col shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#ebeef5]">
          <h3 className="text-lg font-bold text-[#303133]">原料需求与库存对比</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-auto bg-white">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-16 text-center font-bold text-[#303133]">序号</TableHead>
                <TableHead className="text-left font-bold text-[#303133]">物料名称</TableHead>
                <TableHead className="w-32 text-right font-bold text-[#303133]">总计投料量(kg)</TableHead>
                <TableHead className="w-32 text-right font-bold text-[#303133]">当前库存量(kg)</TableHead>
                <TableHead className="w-32 text-right font-bold text-[#303133]">差值(kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  <TableCell className="text-center">{row.sequenceNumber}</TableCell>
                  <TableCell className="text-left">{row.materialName}</TableCell>
                  <TableCell className="text-right">{row.totalInputQuantity.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{row.currentInventory.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={row.difference < 0 ? 'text-[#f56c6c] font-bold' : 'text-[#67c23a] font-bold'}>
                      {row.difference > 0 ? '+' : ''}{row.difference.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-[#ebeef5] flex justify-end bg-white">
          <Button variant="outline" onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
}
