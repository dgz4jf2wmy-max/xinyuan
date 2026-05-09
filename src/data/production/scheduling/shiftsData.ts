import { ShiftGroupData, TeamGroupData } from '../../../types/production-scheduling';

export const mockShiftGroups: ShiftGroupData[] = [
  {
    groupName: '默认分组1',
    groupType: '再造原料',
    isActive: true,
    shifts: [
      { serialNumber: 1, shiftName: '早班', startTime: '08:00', endTime: '16:00' },
      { serialNumber: 2, shiftName: '中班', startTime: '16:00', endTime: '00:00' },
      { serialNumber: 3, shiftName: '晚班', startTime: '00:00', endTime: '08:00' }
    ]
  },
  {
    groupName: '默认分组2',
    groupType: '香精香料',
    isActive: true,
    shifts: [
      { serialNumber: 4, shiftName: '早班', startTime: '08:00', endTime: '16:00' },
      { serialNumber: 5, shiftName: '中班', startTime: '16:00', endTime: '00:00' },
      { serialNumber: 6, shiftName: '晚班', startTime: '00:00', endTime: '08:00' }
    ]
  }
];

export const mockTeamGroups: TeamGroupData[] = [
  {
    groupName: '默认分组1',
    groupType: '再造原料',
    isActive: true,
    teams: [
      { serialNumber: 1, teamName: '甲', standardHeadcount: 10 },
      { serialNumber: 2, teamName: '乙', standardHeadcount: 10 },
      { serialNumber: 3, teamName: '丙', standardHeadcount: 10 },
      { serialNumber: 4, teamName: '丁', standardHeadcount: 10 }
    ]
  },
  {
    groupName: '默认分组2',
    groupType: '香精香料',
    isActive: true,
    teams: [
      { serialNumber: 5, teamName: 'A', standardHeadcount: 12 },
      { serialNumber: 6, teamName: 'B', standardHeadcount: 12 }
    ]
  }
];
