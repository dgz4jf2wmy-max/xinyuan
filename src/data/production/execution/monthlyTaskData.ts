import { MonthlyProductionTask } from '../../../types/production/execution/monthlyTask';

export const mockMonthlyProductionTasks: MonthlyProductionTask[] = [
  {
    baseInfo: {
      id: 1,
      taskNo: 'SCAP-08-001',
      taskName: '08月生产任务',
      approvalStatus: '待编制',
      executionStatus: '-',
      month: 8,
      currentVersion: 'V1.0',
      creator: '王五',
      createTime: '2026-07-20 09:10',
      lastUpdateTime: '2026-07-20 09:10'
    },
    productionArrangements: [],
    otherArrangements: []
  },
  {
    baseInfo: {
      id: 2,
      taskNo: 'SCAP-07-001',
      taskName: '07月生产任务',
      approvalStatus: '待审批',
      executionStatus: '-',
      month: 7,
      currentVersion: 'V1.1',
      creator: '林芳',
      createTime: '2026-06-18 14:20',
      lastUpdateTime: '2026-06-25 10:30'
    },
    productionArrangements: [
      {
        id: 3,
        productionLine: '香精香料',
        productType: '香精香料',
        productionOrder: 1,
        taskNo: 'SCRW-XJ-07-001',
        productName: 'A香精',
        productCode: 'XJ-A-01',
        brand: '综合',
        productionVolume: 1200.00,
        completionDate: '2026-07-15',
        blendingQuantity: 10.00,
        blendingRatio: 0.50
      }
    ],
    otherArrangements: []
  },
  {
    baseInfo: {
      id: 3,
      taskNo: 'SCAP-06-001',
      taskName: '06月生产任务',
      approvalStatus: '已发布',
      executionStatus: '待执行',
      month: 6,
      currentVersion: 'V1.0',
      creator: '李四',
      createTime: '2026-05-02 10:00',
      lastUpdateTime: '2026-05-15 16:00'
    },
    productionArrangements: [
      {
        id: 2,
        productionLine: '再造原料',
        productType: '再造梗丝',
        productionOrder: 1,
        taskNo: 'SCRW-GS-06-001',
        productName: 'B牌号梗丝',
        productCode: 'P-B-001',
        brand: 'B牌号',
        productionVolume: 3000.00,
        completionDate: '2026-06-30',
        blendingQuantity: 0.00,
        blendingRatio: 0.00
      }
    ],
    otherArrangements: []
  },
  {
    baseInfo: {
      id: 4,
      taskNo: 'SCAP-05-001',
      taskName: '05月生产任务',
      approvalStatus: '已发布',
      executionStatus: '在执行',
      month: 5,
      currentVersion: 'V2.1',
      creator: '张三',
      createTime: '2026-04-25 09:00',
      lastUpdateTime: '2026-05-01 09:00'
    },
    productionArrangements: [
      {
        id: 1,
        productionLine: '再造原料',
        productType: '再造烟叶',
        productionOrder: 1,
        taskNo: 'SCRW-ZY-05-001',
        productName: 'A牌号烟草薄片',
        productCode: 'P-A-001',
        brand: 'A牌号',
        productionVolume: 5000.00,
        completionDate: '2026-05-31',
        blendingQuantity: 50.00,
        blendingRatio: 1.00
      }
    ],
    otherArrangements: [
      {
        id: 1,
        taskNo: 'SCRW-ZY-05-002',
        productType: '再造烟叶',
        productName: 'A牌号烟草薄片',
        productCode: 'P-A-001',
        brand: 'A牌号',
        type: '自主试验',
        productionVolume: 100.00,
        completionDate: '2026-05-15'
      }
    ]
  },
  {
    baseInfo: {
      id: 5,
      taskNo: 'SCAP-04-001',
      taskName: '04月生产任务',
      approvalStatus: '已发布',
      executionStatus: '已执行',
      month: 4,
      currentVersion: 'V1.0',
      creator: '张三',
      createTime: '2026-03-20 11:30',
      lastUpdateTime: '2026-03-28 17:45'
    },
    productionArrangements: [
      {
        id: 4,
        productionLine: '再造原料',
        productType: '再造烟叶',
        productionOrder: 1,
        taskNo: 'SCRW-ZY-04-001',
        productName: 'C牌号烟草薄片',
        productCode: 'P-C-02',
        brand: 'C牌号',
        productionVolume: 8000.00,
        completionDate: '2026-04-28',
        blendingQuantity: 120.00,
        blendingRatio: 1.50
      }
    ],
    otherArrangements: []
  },
  {
    baseInfo: {
      id: 6,
      taskNo: 'SCAP-03-001',
      taskName: '03月生产任务',
      approvalStatus: '已发布',
      executionStatus: '已执行',
      month: 3,
      currentVersion: 'V1.2',
      creator: '赵六',
      createTime: '2026-02-18 09:20',
      lastUpdateTime: '2026-02-27 15:10'
    },
    productionArrangements: [],
    otherArrangements: []
  }
];
