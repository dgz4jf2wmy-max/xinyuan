import { MonthlyDashboardStat, DailyProductionStat } from '../../../types/production/execution/dashboard';

export const mockMonthlyDashboardStat: MonthlyDashboardStat = {
  id: 'STAT001',
  yearMonth: '2026-05',
  totalPlannedQuantity: 15000,
  totalCompletedQuantity: 8500,
  completionRate: 56.7,
  activeTasks: 12,
  delayedTasks: 1
};

export const mockDailyProductionStats: DailyProductionStat[] = [
  { date: '05-01', planned: 500, completed: 520 },
  { date: '05-02', planned: 500, completed: 480 },
  { date: '05-03', planned: 500, completed: 510 },
  { date: '05-04', planned: 500, completed: 490 },
  { date: '05-05', planned: 500, completed: 550 },
  { date: '05-06', planned: 500, completed: 0 },
  { date: '05-07', planned: 500, completed: 0 },
];
