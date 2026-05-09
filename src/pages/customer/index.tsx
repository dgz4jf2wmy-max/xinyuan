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
    <div className="flex flex-col h-full space-y-4">
      {/* 搜索区域 */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4">
        <div className="w-64">
          <Input 
            placeholder="搜索客户名称或编码" 
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="primary" onClick={() => {}}>
            <Search className="w-3.5 h-3.5 mr-1" />
            查询
          </Button>
          <Button variant="primary" onClick={() => setSearchKey('')}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            重置
          </Button>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 bg-white p-4 flex flex-col overflow-hidden">
        <div className="overflow-auto flex-1">
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
