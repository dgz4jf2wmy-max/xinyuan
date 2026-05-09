import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Pagination } from '../../../../components/ui/pagination';
import { Search, RotateCcw, Plus, Eye, Edit2 } from 'lucide-react';
import { mockScheduleBasicInfo } from '../../../../data/production/scheduling/scheduleData';

export default function TeamSchedulePage() {
  const navigate = useNavigate();
  const [scheduleCode, setScheduleCode] = useState('');
  const [productionLine, setProductionLine] = useState('');
  
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 10;

  const filteredData = mockScheduleBasicInfo.filter(item => 
    (scheduleCode ? item.scheduleCode.includes(scheduleCode) : true) &&
    (productionLine ? item.productionLine === productionLine : true)
  );
  const currentData = filteredData.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  const handleReset = () => {
    setScheduleCode('');
    setProductionLine('');
    setPageNum(1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* Search Area */}
          <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
            <div className="w-48">
              <Input 
                placeholder="排班表编号"
                value={scheduleCode}
                onChange={e => setScheduleCode(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select 
                options={[
                  { label: '所属产线: 全部', value: '' },
                  { label: '再造原料', value: '再造原料' },
                  { label: '香精香料', value: '香精香料' },
                ]}
                value={productionLine}
                onChange={e => setProductionLine(e.target.value)}
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mb-4 shrink-0">
            <Button variant="primary" onClick={() => navigate('/production/scheduling/schedule/create')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> 新增
            </Button>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto flex flex-col">
            <Table className="relative w-full">
              <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
                <TableRow>
                  <TableHead className="w-[80px] text-center">序号</TableHead>
                  <TableHead className="text-center">状态</TableHead>
                  <TableHead className="text-center">排班表编号</TableHead>
                  <TableHead className="text-center">排班表日期</TableHead>
                  <TableHead className="text-center">所属产线</TableHead>
                  <TableHead className="w-[180px] text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  currentData.map((row, i) => (
                    <TableRow key={row.serialNumber}>
                      <TableCell className="text-center">{(pageNum - 1) * pageSize + i + 1}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          row.status === '生效中' ? 'bg-[#f0f9eb] text-[#67c23a]' :
                          row.status === '草稿中' ? 'bg-[#f4f4f5] text-[#909399]' :
                          row.status === '已完成' ? 'bg-[#fafafa] text-[#c0c4cc] border border-[#e4e7ed]' : ''
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{row.scheduleCode}</TableCell>
                      <TableCell className="text-center">{row.scheduleDateRange}</TableCell>
                      <TableCell className="text-center">{row.productionLine}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => navigate(`/production/scheduling/schedule/detail/${row.serialNumber}`)} className="text-[#409eff] hover:text-[#66b1ff] text-sm">
                            查看
                          </button>
                          {row.status === '生效中' || row.status === '草稿中' ? (
                            <button onClick={() => navigate(`/production/scheduling/schedule/edit/${row.serialNumber}`)} className="text-[#409eff] hover:text-[#66b1ff] text-sm">
                              调整
                            </button>
                          ) : (
                            <button disabled className="text-[#c0c4cc] text-sm cursor-not-allowed">
                              调整
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 pt-2 mb-4 pr-4">
              <Pagination
                total={filteredData.length}
                pageSize={pageSize}
                current={pageNum}
                onChange={setPageNum}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
