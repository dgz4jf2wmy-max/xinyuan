import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { CalendarDays, List, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { getMockInstanceData, ScheduleDetailExtra } from '../../../../data/production/scheduling/schedulePlanInstanceData';

export default function SchedulePlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState<'calendar'|'list'>('calendar');
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [details, setDetails] = useState<ScheduleDetailExtra[]>([]);

  useEffect(() => {
    if (id) {
      const data = getMockInstanceData(id);
      setBasicInfo(data.basicInfo);
      setDetails(data.details);
    }
  }, [id]);

  if (!basicInfo) return <div className="p-4">Loading...</div>;

  const startDateStr = basicInfo.scheduleDateRange.split('~')[0];
  const firstDay = new Date(startDateStr);
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 0 for Mon
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => `pad-${i}`);

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2 text-[#303133]">
              <h2 className="text-xl font-bold text-gray-800">{basicInfo.scheduleCode}</h2>
              <span className="text-[#909399] text-sm ml-2">({basicInfo.productionLine})</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                basicInfo.status === '生效中' ? 'bg-[#f0f9eb] text-[#67c23a]' :
                basicInfo.status === '草稿中' ? 'bg-[#f4f4f5] text-[#909399]' :
                'bg-[#fafafa] text-[#c0c4cc] border border-[#e4e7ed]'
              }`}>
                {basicInfo.status}
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col bg-white">
            <div className="mb-3 flex justify-between items-center text-[#303133]">
              <h2 className="text-sm font-medium flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-[#909399]" /> 
                排班计划表详情
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="bg-[#f0f2f5] p-1 rounded-md flex">
                  <button 
                    onClick={() => setDisplayMode('calendar')}
                    className={`px-3 py-1 flex items-center gap-1 text-xs rounded transition-colors ${displayMode === 'calendar' ? 'bg-white shadow-sm text-[#409eff] font-medium' : 'text-[#909399] hover:text-[#606266]'}`}
                  >
                    <CalendarDays className="w-3.5 h-3.5" /> 日历
                  </button>
                  <button 
                    onClick={() => setDisplayMode('list')}
                    className={`px-3 py-1 flex items-center gap-1 text-xs rounded transition-colors ${displayMode === 'list' ? 'bg-white shadow-sm text-[#409eff] font-medium' : 'text-[#909399] hover:text-[#606266]'}`}
                  >
                    <List className="w-3.5 h-3.5" /> 列表
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto relative">
              {displayMode === 'calendar' ? (
                <div className="border border-[#e4e7ed] rounded shadow-sm overflow-hidden min-h-[600px] mb-6">
                <div className="grid grid-cols-7 bg-[#fafafa] border-b border-[#e4e7ed]">
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-[#606266] border-r last:border-r-0 border-[#e4e7ed]">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 border-l border-[#f4f4f5] bg-white">
                  {paddingDays.map(pad => (
                    <div key={pad} className="bg-[#fafafa]/50 min-h-[90px] border-b border-r border-[#f4f4f5]"></div>
                  ))}
                  
                  {daysInMonth.map(dayNum => {
                    const dayDetails = details.filter(d => d.day === dayNum);
                    return (
                      <div key={dayNum} className="bg-white p-1.5 min-h-[90px] border-b border-r border-[#f4f4f5] flex flex-col gap-1 overflow-visible relative">
                        <div className="flex justify-between items-center h-5">
                          <span className="text-xs text-[#909399] ml-1">{dayNum}</span>
                        </div>
                        {dayDetails.map(d => (
                          <div 
                            key={d.id} 
                            className={`relative text-[11px] p-1.5 h-[28px] rounded flex flex-col justify-center border overflow-hidden
                              ${d.status === '正常' ? 'bg-[#ecf5ff] border-[#d9ecff] text-[#409eff]' : 
                                d.status === '人工调班' ? 'bg-[#f4f4f5] border-[#e9e9eb] text-[#909399]' :
                                'bg-[#fafafa] border-[#e4e7ed] text-[#a8abb2]'}`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span>{d.shift}</span>
                              <div className="flex items-center gap-1">
                                {d.status === '顺延' ? (
                                  <span className="font-bold text-[#c0c4cc]">停工</span>
                                ) : d.status === '跳过' ? (
                                  <span className="font-bold line-through text-[#c0c4cc]">{d.team}</span>
                                ) : (
                                  <span className="font-bold">{d.team}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                  
                  {Array.from({ length: (7 - ((startDayOfWeek + 31) % 7)) % 7 }).map((_, i) => (
                    <div key={`end-pad-${i}`} className="bg-[#fafafa]/50 min-h-[90px] border-b border-r border-[#f4f4f5]"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded relative">
                <Table>
                  <TableHeader className="bg-[#fafafa] sticky top-0 z-10 shadow-sm">
                    <TableRow className="hover:bg-[#fafafa]">
                      <TableHead className="w-[120px]">日期</TableHead>
                      <TableHead className="w-[100px]">班次</TableHead>
                      <TableHead className="w-[140px]">工时</TableHead>
                      <TableHead className="w-[120px]">值班班组</TableHead>
                      <TableHead className="w-[120px]">排班状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-[#606266]">{row.date}</TableCell>
                        <TableCell>{row.shift}</TableCell>
                        <TableCell className="text-[#909399] font-mono text-xs">{row.timeRange}</TableCell>
                        <TableCell>
                          {row.status === '顺延' ? (
                            <span className="text-[#c0c4cc] font-bold text-xs bg-[#f4f4f5] px-2 py-0.5 rounded">停工</span>
                          ) : row.status === '跳过' ? (
                            <span className="text-[#c0c4cc] font-bold text-xs line-through bg-[#f4f4f5] px-2 py-0.5 rounded">{row.team}</span>
                          ) : (
                            <span>{row.team}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {row.status === '正常' && <span className="text-[#909399] text-xs">自动推演</span>}
                          {row.status === '人工调班' && <span className="text-[#409eff] text-xs">手工指定</span>}
                          {row.status === '跳过' && <span className="text-[#909399] text-xs">手工跳过</span>}
                          {row.status === '顺延' && <span className="text-[#909399] text-xs">手工顺延</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
