import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { mockAgingReports, mockAgingTasks } from '../../../../../data/aging-task';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';

export default function ReportListView() {
  const [queryParams, setQueryParams] = useState({
    reportNo: '',
    taskNo: '',
    orderNo: ''
  });

  const filteredReports = mockAgingReports.filter(report => {
    let match = true;
    if (queryParams.reportNo && !report.reportNo.includes(queryParams.reportNo)) match = false;
    if (queryParams.taskNo && !report.taskNo.includes(queryParams.taskNo)) match = false;
    if (queryParams.orderNo && !(report.outboundOrderNo?.includes(queryParams.orderNo) || report.inboundOrderNo?.includes(queryParams.orderNo))) match = false;
    return match;
  });

  return (
    <div className="h-full flex flex-col">
      {/* 搜索区域 */}
      <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
        <div className="w-48">
          <Input 
            placeholder="报工编号" 
            value={queryParams.reportNo}
            onChange={e => setQueryParams({...queryParams, reportNo: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="关联任务" 
            value={queryParams.taskNo}
            onChange={e => setQueryParams({...queryParams, taskNo: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="出/入库单号" 
            value={queryParams.orderNo}
            onChange={e => setQueryParams({...queryParams, orderNo: e.target.value})}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => {}}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={() => setQueryParams({ reportNo: '', taskNo: '', orderNo: '' })}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">序号</TableHead>
              <TableHead>报工编号</TableHead>
              <TableHead>关联任务</TableHead>
              <TableHead>牌号</TableHead>
              <TableHead>报工数量(箱)</TableHead>
              <TableHead>报工人</TableHead>
              <TableHead>报工时间</TableHead>
              <TableHead>出库申请单</TableHead>
              <TableHead>入库申请单</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report, idx) => {
              const task = mockAgingTasks.find(t => t.taskNo === report.taskNo);
              
              return (
                <TableRow key={report.id}>
                  <TableCell className="text-[#909399]">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{report.reportNo}</TableCell>
                  <TableCell className="text-[#409eff] cursor-pointer hover:underline">
                    {report.taskNo}
                  </TableCell>
                  <TableCell>{task?.brandCode || '-'}</TableCell>
                  <TableCell className="text-[#67c23a] font-bold">{report.reportedBoxesCount}</TableCell>
                  <TableCell>{report.reporter}</TableCell>
                  <TableCell>{report.reportTime}</TableCell>
                  <TableCell>{report.outboundOrderNo || '-'}</TableCell>
                  <TableCell>{report.inboundOrderNo || '-'}</TableCell>
                </TableRow>
              );
            })}
            
            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-[#909399]">
                  暂无报工明细记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
