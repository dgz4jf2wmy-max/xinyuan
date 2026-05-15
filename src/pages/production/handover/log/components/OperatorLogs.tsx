import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { mockOperatorLogs } from '../../../../../data/production/handover/operatorLogsData';
import { cn } from '../../../../../lib/utils';
import { ClipboardList, Search, RotateCcw, Plus } from 'lucide-react';

export default function OperatorLogs() {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState({
    startDate: '',
    endDate: '',
    keyword: ''
  });

  return (
    <div className="flex flex-col h-full relative">
      {/* 搜索区域 */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex items-center gap-2 w-[320px]">
          <Input 
            type="date"
            value={queryParams.startDate}
            onChange={e => setQueryParams({...queryParams, startDate: e.target.value})}
            className="w-full"
            placeholder="开始日期"
          />
          <span className="text-[#909399] text-sm">至</span>
          <Input 
            type="date"
            value={queryParams.endDate}
            onChange={e => setQueryParams({...queryParams, endDate: e.target.value})}
            className="w-full"
            placeholder="结束日期"
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="关键字 (编号/名称)" 
            value={queryParams.keyword}
            onChange={e => setQueryParams({...queryParams, keyword: e.target.value})}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="primary" onClick={() => {}}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={() => setQueryParams({ startDate: '', endDate: '', keyword: '' })}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      {/* 操作按钮区 (已移除) */}

      <div className="bg-white border text-[13px] text-[#606266] border-[#ebeef5] rounded-sm flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f5f7fa] hover:bg-[#f5f7fa]">
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 whitespace-nowrap">日志编号</TableHead>
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 whitespace-nowrap">日志名称</TableHead>
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 whitespace-nowrap">工序</TableHead>
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 whitespace-nowrap">班组</TableHead>
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 whitespace-nowrap">班次</TableHead>
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 whitespace-nowrap">提交人</TableHead>
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 whitespace-nowrap">提交时间</TableHead>
              <TableHead className="h-11 font-medium text-[#909399] text-center border-r border-[#ebeef5] last:border-r-0 w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOperatorLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-[#f5f7fa] transition-colors">
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0 font-mono">{log.logNo}</TableCell>
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0 max-w-[240px] truncate" title={log.logName}>{log.logName}</TableCell>
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0">{log.process}</TableCell>
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0">{log.teamName}</TableCell>
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs border",
                    log.shiftName?.includes('早') && "bg-[#f0f9eb] text-[#67c23a] border-[#e1f3d8]",
                    log.shiftName?.includes('中') && "bg-[#fdf6ec] text-[#e6a23c] border-[#faecd8]",
                    log.shiftName?.includes('夜') && "bg-[#ebf5ff] text-[#409eff] border-[#c6e2ff]"
                  )}>{log.shiftName}</span>
                </TableCell>
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0">{log.submitter}</TableCell>
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0">{log.submitTime}</TableCell>
                <TableCell className="text-center border-r border-[#ebeef5] last:border-r-0">
                  <Button variant="link" size="sm" className="h-auto p-0 text-[#409eff] font-normal hover:text-[#66b1ff]" onClick={() => navigate(`/production/handover/log/operator-detail/${log.id}`)}>查看</Button>
                </TableCell>
              </TableRow>
            ))}
            {mockOperatorLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-[#c0c4cc]">
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardList className="w-8 h-8 mb-2 opacity-50" />
                    <span>暂无数据</span>
                  </div>
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
