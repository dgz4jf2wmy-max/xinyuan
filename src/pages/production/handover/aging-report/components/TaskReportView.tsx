import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, RotateCcw } from 'lucide-react';
import { mockAgingTasks, mockAgingReports } from '../../../../../data/aging-task';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { Input } from '../../../../../components/ui/input';
import { Button } from '../../../../../components/ui/button';

export default function TaskReportView() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [queryParams, setQueryParams] = useState({
    taskNo: '',
    brandCode: '',
    planNo: ''
  });

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const filteredTasks = mockAgingTasks.filter(task => {
    let match = true;
    if (queryParams.taskNo && !task.taskNo.includes(queryParams.taskNo)) match = false;
    if (queryParams.brandCode && !task.brandCode.includes(queryParams.brandCode)) match = false;
    if (queryParams.planNo && !task.codeSegmentPlanNo.includes(queryParams.planNo)) match = false;
    return match;
  });

  return (
    <div className="h-full flex flex-col">
      {/* 搜索区域 */}
      <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
        <div className="w-48">
          <Input 
            placeholder="任务编号" 
            value={queryParams.taskNo}
            onChange={e => setQueryParams({...queryParams, taskNo: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="牌号" 
            value={queryParams.brandCode}
            onChange={e => setQueryParams({...queryParams, brandCode: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="计划号" 
            value={queryParams.planNo}
            onChange={e => setQueryParams({...queryParams, planNo: e.target.value})}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => {}}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={() => setQueryParams({ taskNo: '', brandCode: '', planNo: '' })}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>任务编号</TableHead>
              <TableHead>牌号</TableHead>
              <TableHead>年月份</TableHead>
              <TableHead>分牌号和等级</TableHead>
              <TableHead>总箱数</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>计划号</TableHead>
              <TableHead>当前报工(次)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map(task => {
              const isExpanded = expandedRows.includes(task.id);
              const relatedReports = mockAgingReports.filter(r => r.taskNo === task.taskNo);
              
              return (
                <React.Fragment key={task.id}>
                  <TableRow className="cursor-pointer" onClick={() => toggleRow(task.id)}>
                    <TableCell>
                      {isExpanded ? <ChevronDown className="w-4 h-4 mx-auto text-[#909399]" /> : <ChevronRight className="w-4 h-4 mx-auto text-[#909399]" />}
                    </TableCell>
                    <TableCell className="font-medium text-[#409eff]">{task.taskNo}</TableCell>
                    <TableCell>{task.brandCode}</TableCell>
                    <TableCell>{task.yearMonth}</TableCell>
                    <TableCell>{task.subBrandAndGrade}</TableCell>
                    <TableCell>{task.boxesCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5 relative">
                          <div 
                            className="bg-[#67c23a] h-1.5 rounded-full" 
                            style={{ width: `${task.currentProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{task.currentProgress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.codeSegmentPlanNo}</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded text-xs bg-[#f4f4f5] text-[#909399] border border-[#e4e7ed]">
                        {relatedReports.length} 次
                      </span>
                    </TableCell>
                  </TableRow>
                  
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={9} className="p-0 border-r-0">
                        <div className="bg-[#f5f7fa] p-4 pl-16 max-h-[300px] overflow-auto">
                          {relatedReports.length > 0 ? (
                            <Table className="bg-white text-xs">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>序号</TableHead>
                                  <TableHead>报工编号</TableHead>
                                  <TableHead>报工箱数</TableHead>
                                  <TableHead>报工人</TableHead>
                                  <TableHead>报工时间</TableHead>
                                  <TableHead>出库申请单号</TableHead>
                                  <TableHead>入库申请单号</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {relatedReports.map((report, idx) => (
                                  <TableRow key={report.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell className="font-medium">{report.reportNo}</TableCell>
                                    <TableCell className="text-[#67c23a] font-bold">{report.reportedBoxesCount}</TableCell>
                                    <TableCell>{report.reporter}</TableCell>
                                    <TableCell>{report.reportTime}</TableCell>
                                    <TableCell>{report.outboundOrderNo || '-'}</TableCell>
                                    <TableCell>{report.inboundOrderNo || '-'}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              该任务暂无报工记录
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            
            {filteredTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-[#909399]">
                  暂无相关的任务记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
