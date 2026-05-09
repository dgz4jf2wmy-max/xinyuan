import { useState } from 'react';
import { Search, Plus, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { mockTempBlendingRecords } from '../../../../data/production/execution/tempBlendingData';
import { TempBlendingRecord } from '../../../../types/production/execution/tempBlending';

export default function TempBlendingProcessPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<TempBlendingRecord[]>(mockTempBlendingRecords);

  const getStatusBadge = (status: TempBlendingRecord['status']) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 border border-gray-200">草稿</span>;
      case 'APPROVING':
        return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 border border-blue-200">审批中</span>;
      case 'APPROVED':
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 border border-green-200">已批准</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 border border-red-200">已拒绝</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* Search Area */}
          <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
            <div className="w-48">
              <Input 
                placeholder="回掺单号 / 申请人 / 车间..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 ml-auto">
              <Button variant="primary" size="sm">
                <Search className="w-3.5 h-3.5 mr-1" /> 查询
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSearchTerm('')}>
                <Filter className="w-3.5 h-3.5 mr-1" /> 重置
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4 shrink-0">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> 发起回掺申请
            </Button>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto flex flex-col">
            <Table className="relative w-full">
              <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
                <TableRow>
                  <TableHead className="w-[80px] text-center">序号</TableHead>
                  <TableHead className="text-center">回掺单号</TableHead>
                  <TableHead className="text-center">申请日期</TableHead>
                  <TableHead className="text-center">申请人</TableHead>
                  <TableHead className="text-center">所在车间/部门</TableHead>
                  <TableHead className="text-center">物料类型</TableHead>
                  <TableHead className="text-center">回掺数量 (公斤)</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead className="text-center w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.filter(r => r.recordNo.includes(searchTerm) || r.applicant.includes(searchTerm) || r.department.includes(searchTerm)).map((record, index) => (
                  <TableRow key={record.id} className="hover:bg-[#f5f7fa]">
                    <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                    <TableCell className="text-center font-medium text-[#1890ff] cursor-pointer">
                      {record.recordNo}
                    </TableCell>
                    <TableCell className="text-center">{record.applyDate}</TableCell>
                    <TableCell className="text-center">{record.applicant}</TableCell>
                    <TableCell className="text-center">{record.department}</TableCell>
                    <TableCell className="text-center">{record.materialType}</TableCell>
                    <TableCell className="text-center font-medium">{record.blendingQuantity.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {record.status === 'DRAFT' && (
                          <Button variant="ghost" size="sm" className="text-[#1890ff] h-8 px-2 hover:bg-blue-50 relative after:content-[''] after:absolute after:right-[-4px] after:top-[8px] after:h-[12px] after:w-[1px] after:bg-[#e4e7ed]">编辑</Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-[#1890ff] h-8 px-2 hover:bg-blue-50">查看</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
