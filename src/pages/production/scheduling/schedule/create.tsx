import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Search, Plus, Calendar as CalendarIcon, Settings, ArrowRight, Play, Clock, AlertTriangle, List, CalendarDays, Database, CheckCircle2, GripVertical, RotateCcw, X, ArrowLeft } from 'lucide-react';
import { mockScheduleRuleConfigs, getMasterShifts, getMasterTeams } from '../../../../data/production/scheduling/schedulePlanCreateData';
import { mockShiftGroups, mockTeamGroups } from '../../../../data/production/scheduling/shiftsData';
import { ScheduleRuleConfig, ShiftItemData, TeamItemData } from '../../../../types/production-scheduling';

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export default function SchedulePlanCreate() {
  const navigate = useNavigate();
  
  // Base config
  const [productionLine, setProductionLine] = useState('');
  const [selectedShiftGroupId, setSelectedShiftGroupId] = useState<string>('');
  const [selectedTeamGroupId, setSelectedTeamGroupId] = useState<string>('');
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-05-31');

  // Derived shifts & teams
  const activeShifts = useMemo(() => {
    return getMasterShifts(selectedShiftGroupId);
  }, [selectedShiftGroupId]);

  const activeTeams = useMemo(() => {
    return getMasterTeams(selectedTeamGroupId);
  }, [selectedTeamGroupId]);

  // Ordered teams for drag and drop
  const [orderedTeams, setOrderedTeams] = useState<TeamItemData[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Results
  const [details, setDetails] = useState<any[]>([]);
  const [displayMode, setDisplayMode] = useState<'calendar'|'list'>('calendar'); 
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleDocumentClick = () => setActiveMenuId(null);
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleResetConfig = () => {
    setProductionLine('');
    setSelectedShiftGroupId('');
    setSelectedTeamGroupId('');
    setStartDate('2026-05-01');
    setEndDate('2026-05-31');
    setDetails([]);
    setIsGenerated(false);
    setOrderedTeams([]);
  };

  const handleResetResults = () => {
    setDetails([]);
    setIsGenerated(false);
  };

  useEffect(() => {
    if (activeTeams.length > 0) {
      setOrderedTeams([...activeTeams]);
    } else {
      setOrderedTeams([]);
    }
    setIsGenerated(false);
    setDetails([]);
  }, [activeTeams]);

  const handleResetTeams = () => {
    setOrderedTeams([...activeTeams]);
    setIsGenerated(false);
  };

  const handleRemoveTeam = (id: number) => {
    setOrderedTeams(orderedTeams.filter(t => t.serialNumber !== id));
    setIsGenerated(false);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Needed for Firefox drag support
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    const sourceIndex = draggedIndex;

    if (sourceIndex === null || sourceIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newOrdered = [...orderedTeams];
    const draggedItem = newOrdered[sourceIndex];
    newOrdered.splice(sourceIndex, 1);
    newOrdered.splice(dropIndex, 0, draggedItem);
    
    setOrderedTeams(newOrdered);
    setDraggedIndex(null);
    setDragOverIndex(null);
    if (isGenerated) {
      setDetails(prev => recalculateDetails(prev, newOrdered));
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const recalculateDetails = (baseDetails: any[], currentOrderedTeams = orderedTeams) => {
    if (currentOrderedTeams.length === 0) return baseDetails;
    let teamSequenceIndex = 0;
    return baseDetails.map(d => {
      if (d.status === '人工调班') {
        teamSequenceIndex++;
        return d;
      }
      if (d.status === '顺延') {
        return { ...d, team: '休' };
      }
      if (d.status === '跳过') {
        const teamName = currentOrderedTeams[teamSequenceIndex % currentOrderedTeams.length]?.teamName || '';
        teamSequenceIndex++;
        return { ...d, team: teamName };
      }
      // '正常'
      const teamName = currentOrderedTeams[teamSequenceIndex % currentOrderedTeams.length]?.teamName || '';
      teamSequenceIndex++;
      return { ...d, team: teamName };
    });
  };

  const handleGenerate = () => {
    if (!selectedShiftGroupId) {
      alert("请先选取班次分组配置");
      return;
    }
    if (orderedTeams.length === 0) {
      alert("参排班组列表不能为空");
      return;
    }
    if (!startDate || !endDate) {
      alert("请选择排班覆盖区间");
      return;
    }
    if (!productionLine) {
      alert("请选择所属产线");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if(start > end) {
      alert("开始日期不能晚于结束日期");
      return;
    }

    const generatedData = [];
    let idCounter = 1;
    let current = new Date(start);

    while (current <= end) {
      const dateStr = formatDate(current);
      const dayNum = current.getDate();
      
      activeShifts.forEach(shiftObj => {
        generatedData.push({
          id: idCounter++,
          date: dateStr,
          day: dayNum,
          shift: shiftObj.shiftName,
          team: '', // will be calculated below
          timeRange: `${shiftObj.startTime}~${shiftObj.endTime}`,
          status: '正常'
        });
      });
      current.setDate(current.getDate() + 1);
    }

    setDetails(recalculateDetails(generatedData));
    setIsGenerated(true);
  };

  const handleUpdateTeam = (id: number, newTeam: string) => {
    setDetails(prev => {
      const next = prev.map(d => d.id === id ? { ...d, team: newTeam, status: '人工调班' } : d);
      return recalculateDetails(next);
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setDetails(prev => {
      const next = prev.map(d => d.id === id ? { ...d, status: newStatus } : d);
      return recalculateDetails(next);
    });
    setActiveMenuId(null);
  };

  const handleDayStatusChange = (dayNum: number, newStatus: string) => {
    setDetails(prev => {
      const next = prev.map(d => d.day === dayNum ? { ...d, status: newStatus } : d);
      return recalculateDetails(next);
    });
  };

  const allTeamNamesForDropdown = activeTeams.map(t => t.teamName);

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xl font-bold text-gray-800">新建排班计划</h2>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/production/scheduling/schedule')}>取消</Button>
              <Button variant="outline" size="sm" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff]">保存草稿</Button>
              <Button variant="primary" size="sm" className="bg-[#67c23a] text-white hover:bg-[#85ce61] font-medium border-0">提交审核</Button>
            </div>
          </div>

          <div className="flex gap-4 min-h-0 flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[360px] flex flex-col shrink-0 h-full">
          <div className="bg-white rounded-lg shadow-sm border border-[#e4e7ed] flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-[#e4e7ed] shrink-0 bg-[#fafafa] flex justify-between items-center">
              <h2 className="text-sm font-medium text-[#303133] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#909399]" /> 排班参数与序列规则
              </h2>
              <button 
                onClick={handleResetConfig}
                className="text-[11px] flex items-center gap-1 text-[#909399] hover:text-[#409eff] transition-colors"
                title="重置配置"
              >
                <RotateCcw className="w-3 h-3" /> 重置配置
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4 min-h-0">
              <div>
                <label className="block text-[#606266] text-xs mb-1.5">所属产线 <span className="text-[#f56c6c]">*</span></label>
                <Select 
                  className="w-full"
                  value={productionLine}
                  onChange={(e) => setProductionLine(e.target.value)}
                  options={[
                    { label: '请选择所属产线', value: '' },
                    { label: '再造原料', value: '再造原料' },
                    { label: '香精香料', value: '香精香料' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-[#606266] text-xs mb-1.5">班次分组配置 <span className="text-[#f56c6c]">*</span></label>
                <Select 
                  className="w-full"
                  value={selectedShiftGroupId}
                  onChange={(e) => setSelectedShiftGroupId(e.target.value)}
                  options={[
                    { label: '请选择班次分组', value: '' },
                    ...mockShiftGroups.map(c => ({ label: c.groupName, value: c.groupName }))
                  ]}
                />
                {selectedShiftGroupId && activeShifts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 p-2 bg-[#f4f4f5] border border-[#e4e7ed] rounded">
                    {activeShifts.map(s => (
                      <span key={s.serialNumber} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-[#dcdfe6] rounded text-[10px] text-[#606266]">
                        <CheckCircle2 className="w-3 h-3 text-[#67c23a]" />
                        {s.shiftName} <span className="text-[#909399]">({s.startTime}~{s.endTime})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#606266] text-xs mb-1.5">班组分组配置 <span className="text-[#f56c6c]">*</span></label>
                <Select 
                  className="w-full"
                  value={selectedTeamGroupId}
                  onChange={(e) => setSelectedTeamGroupId(e.target.value)}
                  options={[
                    { label: '请选择班组分组', value: '' },
                    ...mockTeamGroups.map(c => ({ label: c.groupName, value: c.groupName }))
                  ]}
                />
              </div>

              <div>
                <label className="block text-[#606266] text-xs mb-1.5">排班表日期 <span className="text-[#f56c6c]">*</span></label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-[#c0c4cc] text-xs">至</span>
                  <Input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Sequence config */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#303133] font-medium text-xs">倒班序列微调</label>
                  <button 
                    onClick={handleResetTeams}
                    disabled={!selectedTeamGroupId}
                    className="text-xs flex items-center gap-1 text-[#409eff] hover:text-[#66b1ff] disabled:text-[#c0c4cc] disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> 复原默认顺序
                  </button>
                </div>
                
                {!selectedTeamGroupId ? (
                  <div className="text-xs text-[#e6a23c] bg-[#fdf6ec] p-3 rounded border border-[#faecd8] flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> 请先选择班组分组配置，以装载默认班组序列。
                  </div>
                ) : (
                  <div className="border border-[#e4e7ed] rounded bg-[#fafafa] p-2">
                    <p className="text-[11px] text-[#909399] mb-3 px-1 leading-relaxed">
                      提示：系统将按照自上而下的顺序轮转。支持拖拽排序或移除不需要参排的班组。
                    </p>
                    <div className="space-y-2">
                      {orderedTeams.map((team, index) => {
                        const isDragging = draggedIndex === index;
                        const isDragOverTop = dragOverIndex === index && draggedIndex! > index;
                        const isDragOverBottom = dragOverIndex === index && draggedIndex! < index;

                        return (
                          <div 
                            key={team.serialNumber}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between bg-white border rounded px-3 py-2 transition-colors shadow-sm
                              ${isDragging ? 'opacity-30 border-dashed border-[#c0c4cc]' : 'border-[#e4e7ed] hover:border-[#dcdfe6]'}
                              ${isDragOverTop ? 'border-t-2 border-t-[#409eff] shadow-md' : ''}
                              ${isDragOverBottom ? 'border-b-2 border-b-[#409eff] shadow-md' : ''}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className="cursor-grab hover:text-[#409eff] text-[#c0c4cc] active:cursor-grabbing">
                                <GripVertical className="w-4 h-4 pointer-events-none" />
                              </div>
                              <span className="text-xs font-bold text-[#909399] w-4">{index + 1}.</span>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-[#303133]">{team.teamName} 班</span>
                                <span className="text-[10px] text-[#909399]">定员: {team.standardHeadcount}人</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveTeam(team.serialNumber)}
                              className="p-1.5 text-[#c0c4cc] hover:text-[#f56c6c] rounded transition-colors"
                              title="移除此班组"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                      {orderedTeams.length === 0 && (
                        <div className="py-4 text-center text-xs text-[#f56c6c] border border-[#fde2e2] border-dashed rounded bg-[#fef0f0]">
                          序列为空，无法排班
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#e4e7ed] shrink-0 bg-white">
              <Button 
                variant="primary"
                className="w-full flex items-center justify-center gap-1"
                onClick={handleGenerate}
              >
                <Play className="w-4 h-4" /> 应用序列生成日历
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#e4e7ed] flex flex-col overflow-hidden min-h-[600px]">
          <div className="p-3 border-b border-[#e4e7ed] flex justify-between items-center bg-[#fafafa]">
            <h2 className="text-sm font-medium text-[#303133] flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-[#909399]" /> 
              {isGenerated ? "排班计划表" : "排班计划表"}
            </h2>
            
            {isGenerated && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetResults}
                  className="h-7 text-[11px] px-2 flex items-center gap-1 text-[#909399] hover:text-[#f56c6c] hover:bg-[#fef0f0] rounded transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> 撤销排班
                </button>
                <div className="h-4 w-px bg-[#dcdfe6]"></div>
                <div className="flex bg-[#f4f4f5] border border-[#e4e7ed] rounded p-0.5">
                  <button 
                    onClick={() => setDisplayMode('calendar')}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${displayMode === 'calendar' ? 'bg-white text-[#303133] shadow-sm' : 'text-[#606266] hover:text-[#303133]'}`}
                  >
                    日历视图
                  </button>
                  <button 
                    onClick={() => setDisplayMode('list')}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${displayMode === 'list' ? 'bg-white text-[#303133] shadow-sm' : 'text-[#606266] hover:text-[#303133]'}`}
                  >
                    列表视图
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto bg-[#fafafa] relative">
            {!isGenerated ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#c0c4cc]">
                <Database className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">请在左侧设定规则并应用生成</p>
              </div>
            ) : (
              <>
                {displayMode === 'calendar' ? (
                  <div className="p-3 h-full">
                    <div className="grid grid-cols-7 gap-px bg-[#e4e7ed] border border-[#e4e7ed] rounded overflow-hidden">
                      {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                        <div key={day} className="bg-white py-1.5 text-center text-xs font-medium text-[#606266]">{day}</div>
                      ))}
                      {/* Blank days based on month start; simplified here without accurate day offsets */}
                      <div className="bg-white p-2"></div>
                      <div className="bg-white p-2"></div>
                      
                      {Array.from({length: 30}).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dayDetails = details.filter(d => d.day === dayNum);
                        return (
                          <div key={dayNum} className="bg-white p-1.5 min-h-[90px] border-t border-[#f4f4f5] flex flex-col gap-1 overflow-visible relative group/day">
                            <div className="flex justify-between items-center h-5">
                              <span className="text-xs text-[#909399] ml-1">{dayNum}</span>
                              {dayDetails.length > 0 && (
                                <div className="opacity-0 group-hover/day:opacity-100 flex items-center gap-0.5 transition-opacity px-1">
                                  <button onClick={() => handleDayStatusChange(dayNum, '正常')} className="text-[10px] text-[#909399] hover:text-[#409eff] hover:bg-[#ecf5ff] px-1 py-0.5 rounded transition-colors">正常</button>
                                  <button onClick={() => handleDayStatusChange(dayNum, '跳过')} className="text-[10px] text-[#909399] hover:text-[#f56c6c] hover:bg-[#fef0f0] px-1 py-0.5 rounded transition-colors">跳过</button>
                                  <button onClick={() => handleDayStatusChange(dayNum, '顺延')} className="text-[10px] text-[#909399] hover:text-[#e6a23c] hover:bg-[#fdf6ec] px-1 py-0.5 rounded transition-colors">顺延</button>
                                </div>
                              )}
                            </div>
                            {dayDetails.map(d => (
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
                                
                                <div className="absolute inset-y-0 right-0 flex items-center pr-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-gradient-to-l from-white via-white to-transparent pl-4">
                                  <div className="flex bg-white shadow flex-shrink-0 border border-[#e4e7ed] rounded overflow-hidden whitespace-nowrap">
                                    <button onClick={() => handleStatusChange(d.id, '正常')} className={`px-1.5 py-1 text-[9px] hover:bg-[#ecf5ff] hover:text-[#409eff] ${d.status==='正常'?'text-[#409eff] bg-[#ecf5ff]':'text-[#909399]'}`}>正常</button>
                                    <button onClick={() => handleStatusChange(d.id, '跳过')} className={`px-1.5 py-1 text-[9px] hover:bg-[#fef0f0] hover:text-[#f56c6c] border-l border-[#f4f4f5] ${d.status==='跳过'?'text-[#f56c6c] bg-[#fef0f0]':'text-[#909399]'}`}>跳过</button>
                                    <button onClick={() => handleStatusChange(d.id, '顺延')} className={`px-1.5 py-1 text-[9px] hover:bg-[#fdf6ec] hover:text-[#e6a23c] border-l border-[#f4f4f5] ${d.status==='顺延'?'text-[#e6a23c] bg-[#fdf6ec]':'text-[#909399]'}`}>顺延</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white m-3 rounded overflow-hidden">
                    <Table>
                      <TableHeader className="bg-[#f5f7fa]">
                        <TableRow>
                          <TableHead className="w-[120px]">执行日期</TableHead>
                          <TableHead>班次名称</TableHead>
                          <TableHead>工时区间</TableHead>
                          <TableHead>值班班组</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[160px] text-right">人工动作</TableHead>
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
                              <button onClick={() => handleStatusChange(row.id, '跳过')} disabled={row.status === '跳过'} className="text-xs text-[#909399] hover:text-[#f56c6c] disabled:opacity-30 transition-colors">跳过</button>
                              <button onClick={() => handleStatusChange(row.id, '顺延')} disabled={row.status === '顺延' || row.status === '跳过'} className="text-xs text-[#909399] hover:text-[#e6a23c] disabled:opacity-30 transition-colors">顺延</button>
                              {row.status !== '正常' && (
                                <button onClick={() => handleStatusChange(row.id, '正常')} className="text-xs text-[#409eff] hover:text-[#66b1ff] transition-colors">还原</button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
