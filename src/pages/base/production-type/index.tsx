import React, { useState } from 'react';
import { LayoutGrid, Plus, Search, RotateCcw, MoreHorizontal, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Pagination } from '../../../components/ui/pagination';
import { mockProductionTypeData } from '../../../data/base/productionTypeData';
import { ProductionType } from '../../../types/base-data';

export default function ProductionTypeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data] = useState<ProductionType[]>(mockProductionTypeData);
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(item => 
    item.productType.includes(searchTerm) || 
    item.productionType.includes(searchTerm)
  );

  const total = filteredData.length;
  const currentData = filteredData.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  const handleReset = () => {
    setSearchTerm('');
    setPageNum(1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white p-4 lg:p-6">
      {/* 搜索与筛选区 */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="w-64">
          <Input 
            placeholder="搜索产品类型 / 生产类型" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="primary" onClick={() => setPageNum(1)}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      {/* 操作按钮区 */}
      <div className="flex justify-end gap-2 mb-4 shrink-0">
        <Button variant="primary">
          <Download className="w-3.5 h-3.5 mr-1" /> 导出查询结果
        </Button>
        <Button variant="primary">
          <Plus className="w-3.5 h-3.5 mr-1" /> 手动新增
        </Button>
      </div>

      {/* 表格区 */}
      <div className="flex-1 overflow-auto flex flex-col">
        <Table className="relative w-full">
          <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
            <TableRow>
              <TableHead className="w-[80px] text-center">序号</TableHead>
              <TableHead className="text-center">产品类型</TableHead>
              <TableHead className="text-center">生产类型</TableHead>
              <TableHead className="w-[100px] text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    {(pageNum - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="text-center">{item.productType}</TableCell>
                  <TableCell className="text-center">{item.productionType}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#409eff] h-6 px-2"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" /> 编辑
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                  暂无符合条件的流水记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 pt-2 mb-4 pr-4">
          <Pagination
            total={total}
            pageSize={pageSize}
            current={pageNum}
            onChange={(page) => setPageNum(page)}
          />
        </div>
      </div>
    </div>
  );
}
