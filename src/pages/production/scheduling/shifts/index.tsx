import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Modal } from '../../../../components/ui/modal';
import { Pagination } from '../../../../components/ui/pagination';
import { Search, RotateCcw, Plus, Edit2, Trash2 } from 'lucide-react';
import { mockShiftGroups, mockTeamGroups } from '../../../../data/production/scheduling/shiftsData';
import { ShiftGroupData, ShiftItemData, TeamGroupData, TeamItemData } from '../../../../types/production-scheduling';

export default function TeamShiftsPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'shift'>('team');

  // data states
  const [teamGroups, setTeamGroups] = useState<TeamGroupData[]>(mockTeamGroups);
  const [shiftGroups, setShiftGroups] = useState<ShiftGroupData[]>(mockShiftGroups);

  const allTeams = useMemo(() => {
    return teamGroups.flatMap(g => g.teams.map(t => ({...t, groupName: g.groupName, groupType: g.groupType, isActive: g.isActive})));
  }, [teamGroups]);

  const allShifts = useMemo(() => {
    return shiftGroups.flatMap(g => g.shifts.map(s => ({...s, groupName: g.groupName, groupType: g.groupType, isActive: g.isActive})));
  }, [shiftGroups]);


  // Left tree state
  const [selectedTeamGroupName, setSelectedTeamGroupName] = useState<string>(mockTeamGroups[0]?.groupName || '');
  const [selectedShiftGroupName, setSelectedShiftGroupName] = useState<string>(mockShiftGroups[0]?.groupName || '');

  const selectedGroupName = activeTab === 'team' ? selectedTeamGroupName : selectedShiftGroupName;

  useEffect(() => {
    if (!teamGroups.find(g => g.groupName === selectedTeamGroupName) && teamGroups.length > 0) {
      setSelectedTeamGroupName(teamGroups[0].groupName);
    }
  }, [teamGroups, selectedTeamGroupName]);

  useEffect(() => {
    if (!shiftGroups.find(g => g.groupName === selectedShiftGroupName) && shiftGroups.length > 0) {
      setSelectedShiftGroupName(shiftGroups[0].groupName);
    }
  }, [shiftGroups, selectedShiftGroupName]);
  const currentGroupList = activeTab === 'team' ? teamGroups : shiftGroups;

  // Group modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupModalType, setGroupModalType] = useState<'add' | 'edit'>('add');
  const [currentGroupEdit, setCurrentGroupEdit] = useState<{ oldName: string, newName: string, type: string, isActive: boolean }>({ oldName: '', newName: '', type: '再造原料', isActive: true });

  const handleGroupSave = () => {
    const trimmedNewName = currentGroupEdit.newName.trim();
    if (!trimmedNewName || !currentGroupEdit.type) {
      alert('请填写必填项');
      return;
    }
    
    const isTeam = activeTab === 'team';
    const groups = isTeam ? teamGroups : shiftGroups;

    if (groupModalType === 'add') {
      if (groups.some(g => g.groupName === trimmedNewName)) {
        alert('分组名称已存在');
        return;
      }
      if (isTeam) {
        setTeamGroups([...teamGroups, { groupName: trimmedNewName, groupType: currentGroupEdit.type, isActive: currentGroupEdit.isActive, teams: [] }]);
      } else {
        setShiftGroups([...shiftGroups, { groupName: trimmedNewName, groupType: currentGroupEdit.type, isActive: currentGroupEdit.isActive, shifts: [] }]);
      }
    } else {
      if (trimmedNewName !== currentGroupEdit.oldName && groups.some(g => g.groupName === trimmedNewName)) {
        alert('分组名称已存在');
        return;
      }
      if (isTeam) {
        setTeamGroups(teamGroups.map(g => g.groupName === currentGroupEdit.oldName ? { ...g, groupName: trimmedNewName, groupType: currentGroupEdit.type, isActive: currentGroupEdit.isActive } : g));
        if (selectedTeamGroupName === currentGroupEdit.oldName) setSelectedTeamGroupName(trimmedNewName);
      } else {
        setShiftGroups(shiftGroups.map(g => g.groupName === currentGroupEdit.oldName ? { ...g, groupName: trimmedNewName, groupType: currentGroupEdit.type, isActive: currentGroupEdit.isActive } : g));
        if (selectedShiftGroupName === currentGroupEdit.oldName) setSelectedShiftGroupName(trimmedNewName);
      }
    }
    setIsGroupModalOpen(false);
  };

  const handleGroupDelete = (name: string) => {
    if (confirm('删除分组将同时删除其下的所有数据，确认删除吗？')) {
      if (activeTab === 'team') {
        setTeamGroups(teamGroups.filter(g => g.groupName !== name));
        if (selectedTeamGroupName === name) setSelectedTeamGroupName('');
      } else {
        setShiftGroups(shiftGroups.filter(g => g.groupName !== name));
        if (selectedShiftGroupName === name) setSelectedShiftGroupName('');
      }
    }
  };

  // Search parameters for teams
  const [teamQueryParams, setTeamQueryParams] = useState({ teamGroup: '', teamName: '', pageNum: 1, pageSize: 10 });
  // Search parameters for shifts
  const [shiftQueryParams, setShiftQueryParams] = useState({ shiftGroup: '', shiftName: '', pageNum: 1, pageSize: 10 });

  // modals
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamModalType, setTeamModalType] = useState<'add' | 'edit'>('add');
  const [currentTeam, setCurrentTeam] = useState<Partial<TeamItemData> & { groupName?: string }>({});

  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shiftModalType, setShiftModalType] = useState<'add' | 'edit'>('add');
  const [currentShift, setCurrentShift] = useState<Partial<ShiftItemData> & { groupName?: string }>({});

  const filteredTeams = allTeams.filter(t => 
    (selectedGroupName ? t.groupName === selectedGroupName : true) &&
    (teamQueryParams.teamGroup ? t.groupType === teamQueryParams.teamGroup : true) &&
    (teamQueryParams.teamName ? t.teamName.includes(teamQueryParams.teamName) : true)
  );
  const currentTeams = filteredTeams.slice((teamQueryParams.pageNum - 1) * teamQueryParams.pageSize, teamQueryParams.pageNum * teamQueryParams.pageSize);

  const filteredShifts = allShifts.filter(s =>
    (selectedGroupName ? s.groupName === selectedGroupName : true) &&
    (shiftQueryParams.shiftGroup ? s.groupType === shiftQueryParams.shiftGroup : true) &&
    (shiftQueryParams.shiftName ? s.shiftName.includes(shiftQueryParams.shiftName) : true)
  );
  const currentShifts = filteredShifts.slice((shiftQueryParams.pageNum - 1) * shiftQueryParams.pageSize, shiftQueryParams.pageNum * shiftQueryParams.pageSize);

  // Team Actions
  const handleTeamSave = () => {
    if (!currentTeam.groupName || !currentTeam.teamName || currentTeam.standardHeadcount === undefined) {
      alert('请填写必填项');
      return;
    }
    
    if (teamModalType === 'add') {
      const serialNumber = allTeams.length > 0 ? Math.max(...allTeams.map(t => t.serialNumber)) + 1 : 1;
      const newTeam: TeamItemData = {
        serialNumber,
        teamName: currentTeam.teamName,
        standardHeadcount: Number(currentTeam.standardHeadcount)
      };
      setTeamGroups(teamGroups.map(g => g.groupName === currentTeam.groupName ? { ...g, teams: [...g.teams, newTeam] } : g));
    } else {
      // Find the old group for this team
      const oldGroup = allTeams.find(t => t.serialNumber === currentTeam.serialNumber)?.groupName;
      if (oldGroup === currentTeam.groupName) {
        setTeamGroups(teamGroups.map(g => g.groupName === oldGroup ? {
          ...g,
          teams: g.teams.map(t => t.serialNumber === currentTeam.serialNumber ? { ...t, teamName: currentTeam.teamName!, standardHeadcount: Number(currentTeam.standardHeadcount) } : t)
        } : g));
      } else {
        // Move from old group to new group
        setTeamGroups(teamGroups.map(g => {
          if (g.groupName === oldGroup) {
            return { ...g, teams: g.teams.filter(t => t.serialNumber !== currentTeam.serialNumber) };
          }
          if (g.groupName === currentTeam.groupName) {
            return { ...g, teams: [...g.teams, { serialNumber: currentTeam.serialNumber!, teamName: currentTeam.teamName!, standardHeadcount: Number(currentTeam.standardHeadcount) }] };
          }
          return g;
        }));
      }
    }
    setIsTeamModalOpen(false);
  };

  const handleTeamDelete = (serialNumber: number, groupName: string) => {
    if (confirm('确认删除吗？')) {
      setTeamGroups(teamGroups.map(g => g.groupName === groupName ? { ...g, teams: g.teams.filter(t => t.serialNumber !== serialNumber) } : g));
    }
  };

  // Shift Actions
  const handleShiftSave = () => {
    if (!currentShift.groupName || !currentShift.shiftName || !currentShift.startTime || !currentShift.endTime) {
      alert('请填写必填项');
      return;
    }
    if (shiftModalType === 'add') {
      const serialNumber = allShifts.length > 0 ? Math.max(...allShifts.map(s => s.serialNumber)) + 1 : 1;
      const newShift: ShiftItemData = {
        serialNumber,
        shiftName: currentShift.shiftName,
        startTime: currentShift.startTime,
        endTime: currentShift.endTime
      };
      setShiftGroups(shiftGroups.map(g => g.groupName === currentShift.groupName ? { ...g, shifts: [...g.shifts, newShift] } : g));
    } else {
      const oldGroup = allShifts.find(s => s.serialNumber === currentShift.serialNumber)?.groupName;
      if (oldGroup === currentShift.groupName) {
        setShiftGroups(shiftGroups.map(g => g.groupName === oldGroup ? {
          ...g,
          shifts: g.shifts.map(s => s.serialNumber === currentShift.serialNumber ? { ...s, shiftName: currentShift.shiftName!, startTime: currentShift.startTime!, endTime: currentShift.endTime! } : s)
        } : g));
      } else {
        setShiftGroups(shiftGroups.map(g => {
          if (g.groupName === oldGroup) {
            return { ...g, shifts: g.shifts.filter(s => s.serialNumber !== currentShift.serialNumber) };
          }
          if (g.groupName === currentShift.groupName) {
            return { ...g, shifts: [...g.shifts, { serialNumber: currentShift.serialNumber!, shiftName: currentShift.shiftName!, startTime: currentShift.startTime!, endTime: currentShift.endTime! }] };
          }
          return g;
        }));
      }
    }
    setIsShiftModalOpen(false);
  };

  const handleShiftDelete = (serialNumber: number, groupName: string) => {
    if (confirm('确认删除吗？')) {
      setShiftGroups(shiftGroups.map(g => g.groupName === groupName ? { ...g, shifts: g.shifts.filter(s => s.serialNumber !== serialNumber) } : g));
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Tabs */}
      <div className="flex px-4 border-b border-[#e4e7ed] shrink-0 pt-2 bg-white">
        <div 
          className={`px-6 py-3 cursor-pointer text-sm transition-colors relative ${activeTab === 'team' ? 'text-[#409eff] font-medium' : 'text-[#909399] hover:text-[#409eff]'}`}
          onClick={() => setActiveTab('team')}
        >
          班组设置
          {activeTab === 'team' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#409eff]" />}
        </div>
        <div 
          className={`px-6 py-3 cursor-pointer text-sm transition-colors relative ${activeTab === 'shift' ? 'text-[#409eff] font-medium' : 'text-[#909399] hover:text-[#409eff]'}`}
          onClick={() => setActiveTab('shift')}
        >
          班次设置
          {activeTab === 'shift' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#409eff]" />}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-56 border-r border-[#e4e7ed] bg-[#fcfcfc] flex flex-col shrink-0">
          <div className="h-[49px] flex items-center justify-between px-4 border-b border-[#e4e7ed]">
            <span className="font-medium text-sm text-[#303133]">分组名称列表</span>
            <button 
              onClick={() => { setGroupModalType('add'); setCurrentGroupEdit({ oldName: '', newName: '', type: '再造原料', isActive: true }); setIsGroupModalOpen(true); }}
              className="text-[#409eff] hover:text-[#66b1ff] text-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {currentGroupList.map(group => (
              <div 
                key={group.groupName}
                className={`group flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer transition-colors ${selectedGroupName === group.groupName ? 'bg-[#e6f1fc] text-[#409eff]' : 'text-[#606266] hover:bg-[#f5f7fa]'}`}
                onClick={() => { 
                  if (activeTab === 'team') { setSelectedTeamGroupName(group.groupName); setTeamQueryParams(p => ({...p, pageNum: 1})); }
                  else { setSelectedShiftGroupName(group.groupName); setShiftQueryParams(p => ({...p, pageNum: 1})); }
                }}
              >
                <div className="flex flex-col overflow-hidden pr-2">
                  <span className="truncate flex items-center gap-2">
                    {group.groupName}
                    {!group.isActive && <span className="px-1 py-0.5 rounded text-[10px] bg-[#fef0f0] text-[#f56c6c]">禁用</span>}
                  </span>
                  <span className="text-[11px] text-[#909399] leading-tight mt-0.5">{group.groupType}</span>
                </div>
                <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setGroupModalType('edit'); setCurrentGroupEdit({ oldName: group.groupName, newName: group.groupName, type: group.groupType, isActive: group.isActive }); setIsGroupModalOpen(true); }}
                    className="text-[#409eff] hover:text-[#66b1ff]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleGroupDelete(group.groupName); }}
                    className="text-[#f56c6c] hover:text-[#f78989]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          {activeTab === 'team' ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Team Search Area */}
              <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
                <div className="w-48">
                  <Input 
                    placeholder="班组名称"
                    value={teamQueryParams.teamName}
                    onChange={e => setTeamQueryParams({...teamQueryParams, teamName: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="primary" onClick={() => setTeamQueryParams({...teamQueryParams, pageNum: 1})}>
                    <Search className="w-3.5 h-3.5 mr-1" /> 查询
                  </Button>
                  <Button variant="primary" onClick={() => setTeamQueryParams({ teamGroup: '', teamName: '', pageNum: 1, pageSize: 10 })}>
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
                  </Button>
                </div>
              </div>

              {/* Team Actions */}
              <div className="flex justify-end gap-2 mb-4 shrink-0">
                <Button variant="primary" onClick={() => { 
                  const grp = teamGroups.find(g => g.groupName === selectedTeamGroupName);
                  setTeamModalType('add'); 
                  setCurrentTeam({ groupName: selectedTeamGroupName }); 
                  setIsTeamModalOpen(true); 
                }}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> 新增班组
                </Button>
              </div>

              {/* Team Table Area */}
              <div className="flex-1 overflow-auto flex flex-col">
                <Table className="relative w-full">
                  <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
                    <TableRow>
                      <TableHead className="w-[80px] text-center">序号</TableHead>
                      <TableHead className="text-center">班组名称</TableHead>
                      <TableHead className="text-center">标准定员人数</TableHead>
                      <TableHead className="w-[120px] text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTeams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-gray-500">暂无数据</TableCell>
                      </TableRow>
                    ) : (
                      currentTeams.map((row, i) => (
                        <TableRow key={row.serialNumber}>
                          <TableCell className="text-center">{(teamQueryParams.pageNum - 1) * teamQueryParams.pageSize + i + 1}</TableCell>
                          <TableCell className="text-center">{row.teamName}</TableCell>
                          <TableCell className="text-center">{row.standardHeadcount}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => { setTeamModalType('edit'); setCurrentTeam(row); setIsTeamModalOpen(true); }} className="text-[#409eff] hover:text-[#66b1ff] text-sm">
                                编辑
                              </button>
                              <button onClick={() => handleTeamDelete(row.serialNumber, row.groupName!)} className="text-[#f56c6c] hover:text-[#f78989] text-sm">
                                删除
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                <div className="mt-4 pt-2 mb-4 pr-4">
                  <Pagination
                    total={filteredTeams.length}
                    pageSize={teamQueryParams.pageSize}
                    current={teamQueryParams.pageNum}
                    onChange={(page) => setTeamQueryParams({...teamQueryParams, pageNum: page})}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Shift Search Area */}
              <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
                <div className="w-48">
                  <Input 
                    placeholder="班次名称"
                    value={shiftQueryParams.shiftName}
                    onChange={e => setShiftQueryParams({...shiftQueryParams, shiftName: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="primary" onClick={() => setShiftQueryParams({...shiftQueryParams, pageNum: 1})}>
                    <Search className="w-3.5 h-3.5 mr-1" /> 查询
                  </Button>
                  <Button variant="primary" onClick={() => setShiftQueryParams({ shiftGroup: '', shiftName: '', pageNum: 1, pageSize: 10 })}>
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
                  </Button>
                </div>
              </div>

              {/* Shift Actions Area */}
              <div className="flex justify-end gap-2 mb-4 shrink-0">
                <Button variant="primary" onClick={() => { 
                  setShiftModalType('add'); 
                  setCurrentShift({ groupName: selectedShiftGroupName }); 
                  setIsShiftModalOpen(true); 
                }}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> 新增班次
                </Button>
              </div>

              {/* Shift Table Area */}
              <div className="flex-1 overflow-auto flex flex-col">
                <Table className="relative w-full">
                  <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
                    <TableRow>
                      <TableHead className="w-[80px] text-center">序号</TableHead>
                      <TableHead className="text-center">班次名称</TableHead>
                      <TableHead className="text-center">工时时长</TableHead>
                      <TableHead className="w-[120px] text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentShifts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-gray-500">暂无数据</TableCell>
                      </TableRow>
                    ) : (
                      currentShifts.map((row, i) => (
                        <TableRow key={row.serialNumber}>
                          <TableCell className="text-center">{(shiftQueryParams.pageNum - 1) * shiftQueryParams.pageSize + i + 1}</TableCell>
                          <TableCell className="text-center">{row.shiftName}</TableCell>
                          <TableCell className="text-center">{row.startTime} ~ {row.endTime}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => { setShiftModalType('edit'); setCurrentShift(row); setIsShiftModalOpen(true); }} className="text-[#409eff] hover:text-[#66b1ff] text-sm">
                                编辑
                              </button>
                              <button onClick={() => handleShiftDelete(row.serialNumber, row.groupName!)} className="text-[#f56c6c] hover:text-[#f78989] text-sm">
                                删除
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                <div className="mt-4 pt-2 mb-4 pr-4">
                  <Pagination
                    total={filteredShifts.length}
                    pageSize={shiftQueryParams.pageSize}
                    current={shiftQueryParams.pageNum}
                    onChange={(page) => setShiftQueryParams({...shiftQueryParams, pageNum: page})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Team Modal */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title={teamModalType === 'add' ? '新增班组' : '编辑班组'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setIsTeamModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleTeamSave}>确定</Button>
          </div>
        }
      >
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>班组名称</label>
            <Input 
              className="flex-1" 
              placeholder="请输入班组名称"
              value={currentTeam.teamName || ''} 
              onChange={e => setCurrentTeam({...currentTeam, teamName: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>标准定员</label>
            <Input 
              className="flex-1" 
              type="number"
              value={currentTeam.standardHeadcount || ''} 
              onChange={e => setCurrentTeam({...currentTeam, standardHeadcount: Number(e.target.value)})}
              placeholder="请输入人数" 
            />
          </div>
        </div>
      </Modal>

      {/* Shift Modal */}
      <Modal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        title={shiftModalType === 'add' ? '新增班次' : '编辑班次'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setIsShiftModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleShiftSave}>确定</Button>
          </div>
        }
      >
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>班次名称</label>
            <Input 
              className="flex-1"
              placeholder="请输入班次名称"
              value={currentShift.shiftName || ''} 
              onChange={e => setCurrentShift({...currentShift, shiftName: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>开始时间</label>
            <Input 
              type="time"
              className="flex-1" 
              value={currentShift.startTime || ''} 
              onChange={e => setCurrentShift({...currentShift, startTime: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>结束时间</label>
            <Input 
              type="time"
              className="flex-1" 
              value={currentShift.endTime || ''} 
              onChange={e => setCurrentShift({...currentShift, endTime: e.target.value})}
            />
          </div>
        </div>
      </Modal>

      {/* Group Modal */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title={groupModalType === 'add' ? '新增分组' : '编辑分组'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={() => setIsGroupModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleGroupSave}>确定</Button>
          </div>
        }
      >
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>分组名称</label>
            <Input 
              className="flex-1" 
              placeholder="请输入分组名称"
              maxLength={50}
              value={currentGroupEdit.newName} 
              onChange={e => setCurrentGroupEdit({...currentGroupEdit, newName: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>分组类型</label>
            <Select 
              className="flex-1"
              options={[
                { label: '再造原料', value: '再造原料' },
                { label: '香精香料', value: '香精香料' },
              ]}
              value={currentGroupEdit.type} 
              onChange={e => setCurrentGroupEdit({...currentGroupEdit, type: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-24 text-right text-sm text-[#606266]"><span className="text-[#f56c6c] mr-1">*</span>启用状态</label>
            <Select 
              className="flex-1"
              options={[
                { label: '是', value: 'true' },
                { label: '否', value: 'false' },
              ]}
              value={currentGroupEdit.isActive ? 'true' : 'false'}
              onChange={e => setCurrentGroupEdit({...currentGroupEdit, isActive: e.target.value === 'true'})}
            />
          </div>
        </div>
      </Modal>
      </div>

    </div>
  );
}
