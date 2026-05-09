import React, { useState } from 'react';
import { Search, RotateCcw, Plus, Download, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table';
import { Pagination } from '../../../components/ui/pagination';
import { Modal } from '../../../components/ui/modal';
import { mockSubBrandData } from '../../../data/base/subBrandData';
import { SubBrandEntry } from '../../../types/sub-brand';
import { AddSubBrandModal } from './components/AddSubBrandModal';

export default function SubBrandLedger() {
  const [data, setData] = useState<SubBrandEntry[]>(mockSubBrandData);
  const [queryParams, setQueryParams] = useState({
    keyword: '',
    pageNum: 1,
    pageSize: 10,
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubBrandEntry | null>(null);
  const [editCode, setEditCode] = useState('');
  
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filteredData = data.filter(item => 
    item.subBrandCode.toLowerCase().includes(queryParams.keyword.toLowerCase()) ||
    item.customerName.toLowerCase().includes(queryParams.keyword.toLowerCase()) ||
    item.brand.toLowerCase().includes(queryParams.keyword.toLowerCase())
  );

  const total = filteredData.length;
  const currentData = filteredData.slice((queryParams.pageNum - 1) * queryParams.pageSize, queryParams.pageNum * queryParams.pageSize);

  const handleSearch = () => {
    setQueryParams(prev => ({ ...prev, pageNum: 1 }));
  };

  const handleReset = () => {
    setQueryParams({
      keyword: '',
      pageNum: 1,
      pageSize: 10,
    });
  };

  const handleExport = () => {
    // Basic CSV Export implementation
    const headers = ['分牌号', '产品名称', '产品编号', '客户名称', '牌号'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        [
          row.subBrandCode,
          row.productName,
          row.productCode,
          row.customerName,
          row.brand
        ].map(value => `"${value}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `分牌号台账_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditModal = (item: SubBrandEntry) => {
    setEditingItem(item);
    setEditCode(item.subBrandCode);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingItem(null);
    setEditCode('');
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? { ...item, subBrandCode: editCode } : item));
      closeEditModal();
    }
  };

  const handleAddSave = (newItem: SubBrandEntry) => {
    setData(prev => [newItem, ...prev]);
    setAddModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white p-4 lg:p-6">
      {/* 搜索与筛选区 */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="w-64">
          <Input 
            placeholder="搜索分牌号 / 客户名称 / 牌号" 
            value={queryParams.keyword}
            onChange={e => setQueryParams({...queryParams, keyword: e.target.value})}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="primary" onClick={handleSearch}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      {/* 操作按钮区 */}
      <div className="flex justify-end gap-2 mb-4 shrink-0">
        <Button variant="primary" onClick={handleExport}>
          <Download className="w-3.5 h-3.5 mr-1" /> 导出查询结果
        </Button>
        <Button variant="primary" onClick={() => setAddModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> 手动新增
        </Button>
      </div>

      {/* 表格区 */}
      <div className="flex-1 overflow-auto flex flex-col">
        <Table className="relative w-full">
          <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
            <TableRow>
              <TableHead className="w-[80px] text-center">序号</TableHead>
              <TableHead>分牌号</TableHead>
              <TableHead>产品名称</TableHead>
              <TableHead>产品编号</TableHead>
              <TableHead>客户名称</TableHead>
              <TableHead>牌号</TableHead>
              <TableHead className="w-[100px] text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">
                    {(queryParams.pageNum - 1) * queryParams.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{item.subBrandCode}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.productCode}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#409eff] h-6 px-2"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" /> 编辑
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  暂无符合条件的流水记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 pt-2 mb-4 pr-4">
          <Pagination
            total={total}
            pageSize={queryParams.pageSize}
            current={queryParams.pageNum}
            onChange={(page) => setQueryParams({...queryParams, pageNum: page})}
          />
        </div>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        title="编辑分牌号"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分牌号</label>
            <Input 
              value={editCode}
              onChange={e => setEditCode(e.target.value)}
              placeholder="请输入新的分牌号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">关联牌号</label>
            <Input 
              value={editingItem?.brand ?? ''}
              disabled
              className="bg-gray-50"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">关联客户</label>
            <Input 
              value={editingItem?.customerName ?? ''}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={closeEditModal}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            确认保存
          </Button>
        </div>
      </Modal>

      <AddSubBrandModal 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSave={handleAddSave}
        existingData={data}
      />
    </div>
  );
}
