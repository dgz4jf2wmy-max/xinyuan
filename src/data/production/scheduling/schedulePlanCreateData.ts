import { ScheduleRuleConfig } from '../../../types/production-scheduling';
import { mockTeamGroups, mockShiftGroups } from './shiftsData';

export const mockScheduleRuleConfigs: ScheduleRuleConfig[] = [
  {
    serialNumber: 1,
    templateName: '再造原料常规排班规则',
    productionLine: '再造原料',
    shiftGroupName: '默认分组1',
    teamGroupName: '默认分组1',
    rotationOrder: '甲-乙-丙-丁'
  },
  {
    serialNumber: 2,
    templateName: '香精香料定制排班规则',
    productionLine: '香精香料',
    shiftGroupName: '默认分组2',
    teamGroupName: '默认分组2',
    rotationOrder: 'A-B'
  }
];

export const getMasterShifts = (groupName: string) => {
  const group = mockShiftGroups.find(g => g.groupName === groupName);
  return group ? group.shifts : [];
};

export const getMasterTeams = (groupName: string) => {
  const group = mockTeamGroups.find(g => g.groupName === groupName);
  return group ? group.teams : [];
};
