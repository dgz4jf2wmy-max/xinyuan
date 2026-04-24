export const mockAchievementData = [
  { id: 1, title: '再造烟叶', prodRate: 78, salesRate: 75 },
  { id: 2, title: '再造梗丝', prodRate: 62, salesRate: 65 },
  { id: 3, title: '香精香料 (集中调配)', prodRate: 85, salesRate: 88 }
];

export const mockTrendData = [
  { year: '2021', prod: 45, sales: 42 },
  { year: '2022', prod: 55, sales: 50 },
  { year: '2023', prod: 65, sales: 68 },
  { year: '2024', prod: 80, sales: 75 },
  { year: '2025', prod: 90, sales: 85 }
];

export const mockInventoryData = [
  { id: 'JSN0801', product: 'JSN0801', type: '再造烟叶', autoStock: 12500, initialManual: 4500 },
  { id: 'GS0101', product: 'GS0101', type: '再造梗丝', autoStock: 8200, initialManual: 3000 },
  { id: '混合料A', product: '混合料A', type: '香精香料', autoStock: 1500, initialManual: 0 }
];

export const mockHistoryData = [
  {
    id: 1,
    date: '2025-10-12 14:30',
    title: '异常插单调整',
    user: '计划管理员',
    type: '中期调整',
    changes: [
      { field: 'JSN0801 计划量', old: '10,000 kg', new: '12,000 kg' },
      { field: '委托单体B 状态', old: '未列入', new: '新增排产 3,500 kg' }
    ]
  },
  {
    id: 2,
    date: '2025-09-28 09:15',
    title: '月度产销计划下发',
    user: '营销分管领导',
    type: '初始版本',
    desc: '基于生产计划池需求，完成10月份全量产销计划审批并正式下发工控执行层。'
  }
];
