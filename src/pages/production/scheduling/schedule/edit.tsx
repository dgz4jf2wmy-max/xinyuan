import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { CalendarDays, List, ArrowLeft, Save } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { getMockInstanceData, ScheduleDetailExtra } from '../../../../data/production/scheduling/schedulePlanInstanceData';
import { Select } from '../../../../components/ui/select';

export default function SchedulePlanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState<'calendar'|'list'>('calendar');
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [details, setDetails] = useState<ScheduleDetailExtra[]>([]);

  const currentDate = new Date('2026-05-06'); // System current date

  useEffect(() => {
    if (id) {
      const data = getMockInstanceData(id);
      setBasicInfo(data.basicInfo);
      setDetails(data.details);
    }
  }, [id]);

  if (!basicInfo) return <div className="p-4">Loading...</div>;

  const teamsArray = ['甲', '乙', '丙', '丁'];

  const recalculateDetails = (draft: ScheduleDetailExtra[]) => {
    let teamSequenceIndex = 0;
    return draft.map(d => {
      const isPast = new Date(d.date) < currentDate;
      
      if (isPast) {
        if (d.status !== '顺延') {
           teamSequenceIndex++;
        }
        return d;
      }
      
      if (d.status === '人工调班') {
        teamSequenceIndex++;
        return d;
      }
      if (d.status === '顺延') {
        return { ...d, team: '休' as any };
      }
      
      const teamName = teamsArray[teamSequenceIndex % teamsArray.length];
      teamSequenceIndex++;
      return { ...d, team: teamName };
    });
  };

  const handleUpdateTeam = (detailId: string, newTeam: string) => {
    setDetails(prev => {
      const draft = prev.map(d => {
        if (d.id === detailId) {
          return { ...d, team: newTeam, status: '人工调班' as any };
        }
        return d;
      });
      return recalculateDetails(draft);
    });
  };

  const handleStatusChange = (detailId: string, newStatus: string) => {
    setDetails(prev => {
      const draft = prev.map(d => {
        if (d.id === detailId) {
          return { ...d, status: newStatus as any };
        }
        return d;
      });
      return recalculateDetails(draft);
    });
  };

  const handleDayStatusChange = (day: number, newStatus: string) => {
    setDetails(prev => {
      const draft = prev.map(d => {
        if (d.day === day) {
          const isPast = new Date(d.date) < currentDate;
          if (isPast) return d; // Cannot adjust past days
          return { ...d, status: newStatus as any };
        }
        return d;
      });
      return recalculateDetails(draft);
    });
  };

  const startDateStr = basicInfo.scheduleDateRange.split('~')[0];
  const firstDay = new Date(startDateStr);
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 0 for Mon
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => `pad-${i}`);

  const allTeamNamesForDropdown = ['甲', '乙', '丙', '丁'];

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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/production/scheduling/schedule')}>返回</Button>
              <Button variant="primary" size="sm" onClick={() => {
                alert('调整保存成功');
                navigate('/production/scheduling/schedule');
              }}>
                <Save className="w-4 h-4 mr-1" /> 保存调整
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col bg-white">
            <div className="mb-3 flex justify-between items-center text-[#303133]">
              <h2 className="text-sm font-medium flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-[#909399]" /> 
                排班计划表
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
                    const isDayPast = dayDetails.length > 0 && new Date(dayDetails[0].date) < currentDate;

                    return (
                      <div key={dayNum} className={`bg-white p-1.5 min-h-[90px] border-b border-r border-[#f4f4f5] flex flex-col gap-1 overflow-visible relative group/day ${isDayPast ? 'opacity-60 bg-gray-50' : ''}`}>
                        <div className="flex justify-between items-center h-5">
                          <span className="text-xs text-[#909399] ml-1">{dayNum}</span>
                          {!isDayPast && dayDetails.length > 0 && (
                            <div className="opacity-0 group-hover/day:opacity-100 flex items-center gap-0.5 transition-opacity px-1">
                              <button onClick={() => handleDayStatusChange(dayNum, '正常')} className="text-[10px] text-[#909399] hover:text-[#409eff] hover:bg-[#ecf5ff] px-1 py-0.5 rounded transition-colors">正常</button>
                              <button onClick={() => handleDayStatusChange(dayNum, '跳过')} className="text-[10px] text-[#909399] hover:text-[#f56c6c] hover:bg-[#fef0f0] px-1 py-0.5 rounded transition-colors">跳过</button>
                              <button onClick={() => handleDayStatusChange(dayNum, '顺延')} className="text-[10px] text-[#909399] hover:text-[#e6a23c] hover:bg-[#fdf6ec] px-1 py-0.5 rounded transition-colors">顺延</button>
                            </div>
                          )}
                        </div>
                        {dayDetails.map(d => {
                          const isPast = new Date(d.date) < currentDate;

                          return (
                          <div 
                            key={d.id} 
                            className={`group relative text-[11px] p-1.5 h-[28px] rounded flex flex-col justify-center transition-colors border overflow-hidden
                                  ${d.status === '正常' ? 'bg-[#ecf5ff] border-[#d9ecff] text-[#409eff]' : 
                                    d.status === '人工调班' ? 'bg-[#f4f4f5] border-[#e9e9eb] text-[#909399]' :
                                    'bg-[#fafafa] border-[#e4e7ed] text-[#a8abb2]'}`}
                          >
                            <div className="flex justify-between items-center w-full relative z-0">
                                  <span>{d.shift}</span>
                                  <div className="flex items-center gap-1">
                                    {d.status === '顺延' ? (
                                      <span className="font-bold text-[#c0c4cc]">停工</span>
                                    ) : d.status === '跳过' ? (
                                      <span className="font-bold line-through text-[#c0c4cc]">{d.team}</span>
                                    ) : isPast ? (
                                      <span className="font-bold">{d.team}</span>
                                    ) : (
                                      <select 
                                        value={d.team}
                                        onChange={(e) => handleUpdateTeam(d.id, e.target.value)}
                                        className="font-bold bg-transparent border-none outline-none cursor-pointer text-right appearance-none hover:opacity-80"
                                      >
                                        <option value="休">休</option>
                                        {allTeamNamesForDropdown.map(t => <option key={t} value={t}>{t}</option>)}
                                      </select>
                                    )}
                                  </div>
                            </div>

                            {!isPast && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-gradient-to-l from-white via-white to-transparent pl-4">
                                  <div className="flex bg-white shadow flex-shrink-0 border border-[#e4e7ed] rounded overflow-hidden whitespace-nowrap">
                                    <button onClick={() => handleStatusChange(d.id, '正常')} className={`px-1.5 py-1 text-[9px] hover:bg-[#ecf5ff] hover:text-[#409eff] ${d.status==='正常'?'text-[#409eff] bg-[#ecf5ff]':'text-[#909399]'}`}>正常</button>
                                    <button onClick={() => handleStatusChange(d.id, '跳过')} className={`px-1.5 py-1 text-[9px] hover:bg-[#fef0f0] hover:text-[#f56c6c] border-l border-[#f4f4f5] ${d.status==='跳过'?'text-[#f56c6c] bg-[#fef0f0]':'text-[#909399]'}`}>跳过</button>
                                    <button onClick={() => handleStatusChange(d.id, '顺延')} className={`px-1.5 py-1 text-[9px] hover:bg-[#fdf6ec] hover:text-[#e6a23c] border-l border-[#f4f4f5] ${d.status==='顺延'?'text-[#e6a23c] bg-[#fdf6ec]':'text-[#909399]'}`}>顺延</button>
                                  </div>
                                </div>
                            )}
                          </div>
                        )})}
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
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.map((row) => {
                      const isPast = new Date(row.date) < currentDate;

                      return (
                      <TableRow key={row.id}>
                        <TableCell className="text-[#606266]">{row.date}</TableCell>
                        <TableCell>{row.shift}</TableCell>
                        <TableCell className="text-[#909399] font-mono text-xs">{row.timeRange}</TableCell>
                        <TableCell>
                              {row.status === '顺延' ? (
                                <span className="text-[#c0c4cc] font-bold text-xs bg-[#f4f4f5] px-2 py-0.5 rounded">停工</span>
                              ) : row.status === '跳过' ? (
                                <span className="text-[#c0c4cc] font-bold text-xs line-through bg-[#f4f4f5] px-2 py-0.5 rounded">{row.team}</span>
                              ) : isPast ? (
                                <span>{row.team}</span>
                              ) : (
                                <Select 
                                  value={row.team}
                                  onChange={(e) => handleUpdateTeam(row.id, e.target.value)}
                                  options={[
                                    { label: '休', value: '休' },
                                    ...allTeamNamesForDropdown.map(t => ({ label: t, value: t }))
                                  ]}
                                  className="h-7 text-xs w-24"
                                />
                              )}
                        </TableCell>
                        <TableCell>
                          {row.status === '正常' && <span className="text-[#909399] text-xs">自动推演</span>}
                          {row.status === '人工调班' && <span className="text-[#409eff] text-xs">手工指定</span>}
                          {row.status === '跳过' && <span className="text-[#909399] text-xs">手工跳过</span>}
                          {row.status === '顺延' && <span className="text-[#909399] text-xs">手工顺延</span>}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {!isPast ? (
                            <>
                              <button onClick={() => handleStatusChange(row.id, '跳过')} disabled={row.status === '跳过'} className="text-xs text-[#909399] hover:text-[#f56c6c] disabled:opacity-30 transition-colors">跳过</button>
                              <button onClick={() => handleStatusChange(row.id, '顺延')} disabled={row.status === '顺延' || row.status === '跳过'} className="text-xs text-[#909399] hover:text-[#e6a23c] disabled:opacity-30 transition-colors">顺延</button>
                              {row.status !== '正常' && (
                                <button onClick={() => handleStatusChange(row.id, '正常')} className="text-xs text-[#409eff] hover:text-[#66b1ff] transition-colors">还原</button>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-[#c0c4cc]">不可调</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )})}
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
