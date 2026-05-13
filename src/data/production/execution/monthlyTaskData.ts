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
        productName: 'SZ0260L29',
        productCode: 'XJ-SZ-01',
        brand: 'SZ0260L29',
        productionType: '受托加工',
        productionVolume: 1200.00,
        reportedVolume: 1000.00,
        theoreticalVolume: 1100.00,
        inboundVolume: 950.00,
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
        productName: 'GS01梗丝',
        productCode: 'P-GS-001',
        brand: 'GS01',
        productionType: '配方生产（成品）',
        productionVolume: 3000.00,
        reportedVolume: 0,
        theoreticalVolume: 0,
        inboundVolume: 0,
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
        productName: 'GS30薄片',
        productCode: 'P-GS-030',
        brand: 'GS30',
        productionType: '配方生产（成品）',
        productionVolume: 5000.00,
        reportedVolume: 1750.00,
        theoreticalVolume: 5000.00,
        inboundVolume: 1600.00,
        completionDate: '2026-05-31',
        blendingQuantity: 50.00,
        blendingRatio: 1.00
      },
      {
        id: 102,
        productionLine: '再造原料',
        productType: '再造烟叶',
        productionOrder: 2,
        taskNo: 'SCRW-ZY-05-002',
        productName: 'JSN08',
        productCode: 'P-JSN-08',
        brand: 'JSN08',
        productionType: '配方生产（自制半成品）',
        productionVolume: 200.00,
        reportedVolume: 0,
        theoreticalVolume: 0,
        inboundVolume: 0,
        completionDate: '2026-05-20',
        blendingQuantity: 0.00,
        blendingRatio: 0.00
      },
      {
        id: 103,
        productionLine: '再造原料',
        productType: '再造梗丝',
        productionOrder: 1,
        taskNo: 'SCRW-GS-05-001',
        productName: 'GS22',
        productCode: 'P-GS-22',
        brand: 'GS22',
        productionType: '配方生产（自制半成品）',
        productionVolume: 35.00,
        reportedVolume: 0,
        theoreticalVolume: 0,
        inboundVolume: 0,
        completionDate: '2026-05-15',
        blendingQuantity: 0.00,
        blendingRatio: 0.00
      },
      {
        id: 104,
        productionLine: '再造原料',
        productType: '再造梗丝',
        productionOrder: 2,
        taskNo: 'SCRW-GS-05-002',
        productName: 'GS60',
        productCode: 'P-GS-60',
        brand: 'GS60',
        productionType: '配方生产（成品）',
        productionVolume: 90.00,
        reportedVolume: 0,
        theoreticalVolume: 0,
        inboundVolume: 0,
        completionDate: '2026-05-25',
        blendingQuantity: 0.00,
        blendingRatio: 0.00
      },
      {
        id: 105,
        productionLine: '香精香料',
        productType: '香精香料',
        productionOrder: 1,
        taskNo: 'SCRW-XJ-05-001',
        productName: 'SC0280L24',
        productCode: 'XJ-SC-01',
        brand: 'SC0280L24',
        productionType: '集中调配',
        productionVolume: 0.30,
        reportedVolume: 0,
        theoreticalVolume: 0,
        inboundVolume: 0,
        completionDate: '2026-05-10',
        blendingQuantity: 0.00,
        blendingRatio: 0.00
      },
      {
        id: 106,
        productionLine: '香精香料',
        productType: '香精香料',
        productionOrder: 2,
        taskNo: 'SCRW-XJ-05-002',
        productName: 'NC0220L05',
        productCode: 'XJ-NC-02',
        brand: 'NC0220L05',
        productionType: '受托加工',
        productionVolume: 1.80,
        reportedVolume: 0,
        theoreticalVolume: 0,
        inboundVolume: 0,
        completionDate: '2026-05-12',
        blendingQuantity: 0.00,
        blendingRatio: 0.00
      }
    ],
    otherArrangements: [
      {
        id: 1,
        taskNo: 'SCRW-ZY-05-T01',
        productType: '再造烟叶',
        productName: 'GS30薄片',
        productCode: 'P-GS-030',
        brand: 'GS30',
        type: '翻箱',
        productionType: '翻箱',
        productionVolume: 100.00,
        reportedVolume: 35.00,
        completionDate: '2026-05-15'
      },
      {
        id: 107,
        taskNo: 'SCRW-GS-05-T02',
        productType: '再造梗丝',
        productName: 'GS22',
        productCode: 'P-GS-22',
        brand: 'GS22',
        type: '预混',
        productionType: '预混',
        productionVolume: 2.00,
        reportedVolume: 0,
        completionDate: '2026-05-28'
      },
      {
        id: 108,
        taskNo: 'SCRW-ZY-05-T03',
        productType: '再造烟叶',
        productName: 'JSN08',
        productCode: 'P-JSN-08',
        brand: 'JSN08',
        type: '省内梗丝回填液',
        productionType: '省内梗丝回填液',
        productionVolume: 25.00,
        reportedVolume: 0,
        completionDate: '2026-05-20'
      },
      {
        id: 109,
        taskNo: 'SCRW-ZY-05-T04',
        productType: '再造烟叶',
        productName: 'GS30薄片',
        productCode: 'P-GS-030',
        brand: 'GS30',
        type: '醇化',
        productionType: '醇化',
        productionVolume: 1000.00,
        reportedVolume: 0,
        completionDate: '2026-05-25'
      },
      {
        id: 110,
        taskNo: 'SCRW-GS-05-T05',
        productType: '再造梗丝',
        productName: 'GS60',
        productCode: 'P-GS-60',
        brand: 'GS60',
        type: '醇化',
        productionType: '醇化',
        productionVolume: 500.00,
        reportedVolume: 0,
        completionDate: '2026-05-28'
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
        productName: 'HBZY-10薄片',
        productCode: 'P-HBZY-10',
        brand: 'HBZY-10',
        productionType: '配方生产（成品）',
        productionVolume: 8000.00,
        reportedVolume: 8000.00,
        theoreticalVolume: 8000.00,
        inboundVolume: 8000.00,
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
