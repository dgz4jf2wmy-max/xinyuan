import { ScheduleRuleConfig, ScheduleBasicInfo, ScheduleDetail } from '../../../types/production-scheduling';

export const mockScheduleRuleConfig: ScheduleRuleConfig[] = [
  {
    serialNumber: 1,
    templateName: '再造原料常规排班规则',
    productionLine: '再造原料',
    shiftGroupName: '默认分组1',
    teamGroupName: '默认分组1',
    rotationOrder: '甲-乙-丙-丁'
  }
];

export const mockScheduleBasicInfo: ScheduleBasicInfo[] = [
  {
    serialNumber: 1,
    scheduleCode: 'YL-202605-1',
    scheduleDateRange: '2026-05-01~2026-05-31',
    productionLine: '再造原料',
    status: '生效中'
  },
  {
    serialNumber: 2,
    scheduleCode: 'YL-202606-1',
    scheduleDateRange: '2026-06-01~2026-06-30',
    productionLine: '再造原料',
    status: '草稿中'
  },
  {
    serialNumber: 3,
    scheduleCode: 'XJ-202605-1',
    scheduleDateRange: '2026-05-01~2026-05-31',
    productionLine: '香精香料',
    status: '生效中'
  },
  {
    serialNumber: 4,
    scheduleCode: 'XJ-202604-1',
    scheduleDateRange: '2026-04-01~2026-04-30',
    productionLine: '香精香料',
    status: '已完成'
  }
];

export const mockScheduleDetails: ScheduleDetail[] = [
  {
    date: '2026-05-01',
    shiftName: '早班',
    teamName: '甲',
    workingHours: '08:00~16:00'
  },
  {
    date: '2026-05-01',
    shiftName: '中班',
    teamName: '乙',
    workingHours: '16:00~00:00'
  }
];
