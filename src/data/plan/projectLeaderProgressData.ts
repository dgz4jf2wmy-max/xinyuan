/**
 * 项目负责人进度确认实体数据
 */
export interface ProjectProgressItem {
  id: string;
  taskName: string;      // 任务项
  targetValue: string;   // 目标/指标
  currentStatus: string; // 当前状态
  completionRate: number; // 完成率
  responsiblePerson: string; // 负责人
  lastUpdateTime: string; // 最后更新时间
}

export const mockProjectProgressData: ProjectProgressItem[] = [
  {
    id: 'prog-001',
    taskName: '《试验通知单》编制与审签',
    targetValue: '完成技术中心内部流程',
    currentStatus: '流程进行中',
    completionRate: 85,
    responsiblePerson: '李晓明',
    lastUpdateTime: '2026-03-24 14:20'
  },
  {
    id: 'prog-002',
    taskName: '配方原料有效性验证',
    targetValue: '全项指标合格',
    currentStatus: '已完成',
    completionRate: 100,
    responsiblePerson: '陈技术',
    lastUpdateTime: '2026-03-22 09:30'
  },
  {
    id: 'prog-003',
    taskName: '香精香料配伍性测试',
    targetValue: '提交测试报告',
    currentStatus: '测试中',
    completionRate: 60,
    responsiblePerson: '王实验',
    lastUpdateTime: '2026-03-23 16:45'
  }
];
