import { ScheduleBasicInfo, ScheduleDetail } from '../../../types/production-scheduling';

export interface ScheduleDetailExtra extends ScheduleDetail {
  id: string;
  day: number;
  shift: string;
  timeRange: string;
  team: string;
  status: '正常' | '人工调班' | '跳过' | '顺延';
}

export const getMockInstanceData = (id: string): { basicInfo: any, details: ScheduleDetailExtra[] } => {
  const basicInfo = {
    serialNumber: Number(id),
    scheduleCode: id === '3' ? 'XJ-202605-1' : 'YL-202605-1',
    scheduleDateRange: '2026-05-01~2026-05-31',
    productionLine: id === '3' ? '香精香料' : '再造原料',
    status: id === '3' ? '生效中' : '生效中'
  };

  const details: ScheduleDetailExtra[] = [];
  const teams = ['甲', '乙', '丙', '丁'];
  let teamIdx = 0;
  for (let i = 1; i <= 31; i++) {
    const dateStr = `2026-05-${i.toString().padStart(2, '0')}`;
    
    details.push({
      id: `${dateStr}-早班`,
      date: dateStr,
      day: i,
      shiftName: '早班',
      timeRange: '00:00~08:00',
      workingHours: '00:00~08:00',
      shift: '早班',
      teamName: teams[teamIdx % 4],
      team: teams[teamIdx % 4],
      status: '正常'
    } as any);
    teamIdx++;

    details.push({
      id: `${dateStr}-中班`,
      date: dateStr,
      day: i,
      shiftName: '中班',
      timeRange: '08:00~16:00',
      workingHours: '08:00~16:00',
      shift: '中班',
      teamName: teams[teamIdx % 4],
      team: teams[teamIdx % 4],
      status: '正常'
    } as any);
    teamIdx++;

    details.push({
      id: `${dateStr}-晚班`,
      date: dateStr,
      day: i,
      shiftName: '晚班',
      timeRange: '16:00~00:00',
      workingHours: '16:00~00:00',
      shift: '晚班',
      teamName: teams[teamIdx % 4],
      team: teams[teamIdx % 4],
      status: '正常'
    } as any);
    teamIdx++;
  }

  // Make some past days "人工调班"/etc.
  details[5].status = '人工调班';
  details[5].team = '休';

  return { basicInfo, details };
};
