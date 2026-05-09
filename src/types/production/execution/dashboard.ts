export interface MonthlyDashboardStat {
  id: string;
  yearMonth: string;
  totalPlannedQuantity: number;
  totalCompletedQuantity: number;
  completionRate: number;
  activeTasks: number;
  delayedTasks: number;
}

export interface DailyProductionStat {
  date: string;
  planned: number;
  completed: number;
}
