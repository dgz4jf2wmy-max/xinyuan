import { useState } from 'react';
import { Customer } from '../../types/customer';
import { mockCustomerData } from '../../data/customerData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Search, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

export default function CustomerLedger() {
  const [data, setData] = useState<Customer[]>(mockCustomerData);
  const [searchKey, setSearchKey] = useState('');

  const filteredData = data.filter(item => 
    item.customerName.includes(searchKey) || 
    item.customerCode.includes(searchKey)
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-md shadow-sm border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-medium text-gray-800">客户台账</h2>
          <p className="text-sm text-gray-500 mt-1">管理维护系统中的客户基本信息</p>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-end">
        <div className="w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">关键字</label>
          <Input 
            placeholder="请输入客户名称或编码..." 
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="bg-white"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-[#1890ff] text-white hover:bg-[#40a9ff] hover:text-white border-0" onClick={() => {}}>
            <Search className="w-4 h-4 mr-2" />
            查询
          </Button>
          <Button variant="outline" onClick={() => setSearchKey('')}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col">
        <div className="border border-[#ebeef5] rounded-sm overflow-hidden flex-1">
          <Table className="relative w-full">
            <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa] whitespace-nowrap">
              <TableRow>
                <TableHead className="w-[60px] text-center">序号</TableHead>
                <TableHead>所属组织</TableHead>
                <TableHead>客户编码</TableHead>
                <TableHead>客户名称</TableHead>
                <TableHead>客户分类</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{row.organization}</TableCell>
                  <TableCell>{row.customerCode}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>
                    <span className={clsx(
                      "px-2 py-1 text-xs rounded-sm",
                      row.customerCategory === '烟草系统' ? "bg-green-50 text-green-600 border border-green-200" : "bg-orange-50 text-orange-500 border border-orange-200"
                    )}>
                      {row.customerCategory}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
