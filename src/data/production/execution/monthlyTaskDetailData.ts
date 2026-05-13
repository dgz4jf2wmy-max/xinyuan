import { MonthlyTaskDetailModel } from '../../../types/production/execution/monthlyTaskDetail';

export const mockVersions = ['V4.0 当前生效', 'V3.0', 'V2.0', 'V1.0 初始版本'];

export const mockMonthlyTaskDetail: MonthlyTaskDetailModel = {
  baseInfo: {
    id: 1,
    taskNo: 'SCAP-04-001',
    taskName: '04月生产任务',
    approvalStatus: '已发布',
    executionStatus: '在执行',
    month: 4,
    currentVersion: 'V2.0',
    creator: '张建国',
    createTime: '2026-01-02 09:30:00',
    lastUpdateTime: '2026-01-02 09:30:00'
  },
  productionArrangements: [
    {
      id: 1,
      productionLine: '再造原料',
      productType: '再造梗丝',
      productionOrder: 1,
      taskNo: 'SCRW-GS-04-001',
      productName: 'GS22',
      productCode: 'P-GS-001',
      brand: 'GS22',
      productionVolume: 35.00,
      completionDate: '2026-04-10',
      blendingQuantity: 0.00,
      blendingRatio: 0.00,
      duration: 6
    },
    {
      id: 2,
      productionLine: '再造原料',
      productType: '再造梗丝',
      productionOrder: 2,
      taskNo: 'SCRW-GS-04-002',
      productName: 'GS30',
      productCode: 'P-GS-002',
      brand: 'GS30',
      productionVolume: 45.00,
      completionDate: '2026-04-15',
      blendingQuantity: 0.00,
      blendingRatio: 0.00,
      duration: 5
    },
    {
      id: 3,
      productionLine: '再造原料',
      productType: '再造烟叶',
      productionOrder: 3,
      taskNo: 'SCRW-ZY-04-001',
      productName: 'HBZY-10',
      productCode: 'P-ZY-001',
      brand: 'HBZY-10',
      productionVolume: 200.00,
      completionDate: '2026-04-20',
      blendingQuantity: 10.00,
      blendingRatio: 1.00,
      duration: 6
    },
    {
      id: 4,
      productionLine: '再造原料',
      productType: '再造烟叶',
      productionOrder: 4,
      taskNo: 'SCRW-ZY-04-002',
      productName: 'JSN08',
      productCode: 'P-ZY-002',
      brand: 'JSN08',
      productionVolume: 200.00,
      completionDate: '2026-04-25',
      blendingQuantity: 15.00,
      blendingRatio: 1.50,
      duration: 6
    },
    {
      id: 5,
      productionLine: '再造原料',
      productType: '再造烟叶',
      productionOrder: 5,
      taskNo: 'SCRW-ZY-04-003',
      productName: '/',
      productCode: 'P-ZY-003',
      brand: '/',
      productionVolume: 25.00,
      completionDate: '2026-04-28',
      blendingQuantity: 5.00,
      blendingRatio: 0.50,
      duration: 3
    },
    {
      id: 6,
      productionLine: '香精香料',
      productType: '香精香料',
      productionOrder: 1,
      taskNo: 'SCRW-XJ-04-001',
      productName: 'A香精',
      productCode: 'XJ-A-01',
      brand: 'A',
      productionVolume: 120.00,
      completionDate: '2026-04-15',
      blendingQuantity: 0.00,
      blendingRatio: 0.00,
      duration: 4
    }
  ],
  otherArrangements: [
    {
      id: 10,
      taskNo: 'SCRW-ZY-04-010',
      productType: '再造烟叶',
      productName: 'SX801试验',
      productCode: 'P-ZY-010',
      brand: 'SX801',
      type: '自主试验',
      productionVolume: 10.00,
      completionDate: '2026-04-12',
      duration: 2
    }
  ],
  demandDetails: [
    {
      id: 101,
      arrangementId: 1,
      productType: '再造梗丝',
      productionType: '配方生产（成品）',
      productName: 'GS22',
      productCode: 'P-GS-001',
      customerName: '公司A',
      brandGrade: 'GS22',
      specification: '常规',
      requirementAmount: 35.00,
      unit: '吨',
      expectedCompletionDate: '2026-04-10',
      deliveryDate: '2026-04-12',
      deliveryLocation: '一号库',
      applicantName: '李经理',
      applicantDepartment: '销售部',
      subBrandGrade: '-'
    },
    {
      id: 102,
      arrangementId: 3,
      productType: '再造烟叶',
      productionType: '配方生产（成品）',
      productName: 'HBZY-10',
      productCode: 'P-ZY-001',
      customerName: '公司B',
      brandGrade: 'HBZY-10',
      specification: '常规',
      requirementAmount: 100.00,
      unit: '吨',
      expectedCompletionDate: '2026-04-15',
      deliveryDate: '2026-04-18',
      deliveryLocation: '二号库',
      applicantName: '王经理',
      applicantDepartment: '销售部',
      subBrandGrade: 'X'
    },
    {
      id: 103,
      arrangementId: 3,
      productType: '再造烟叶',
      productionType: '配方生产（成品）',
      productName: 'HBZY-10',
      productCode: 'P-ZY-001',
      customerName: '公司C',
      brandGrade: 'HBZY-10',
      specification: '常规',
      requirementAmount: 100.00,
      unit: '吨',
      expectedCompletionDate: '2026-04-20',
      deliveryDate: '2026-04-22',
      deliveryLocation: '二号库',
      applicantName: '王经理',
      applicantDepartment: '销售部',
      subBrandGrade: 'Y'
    }
  ]
};

export const mockInitialMonthlyTaskDetail: MonthlyTaskDetailModel = JSON.parse(JSON.stringify(mockMonthlyTaskDetail));
// Modify some basic values to act as initial version
mockInitialMonthlyTaskDetail.productionArrangements[0].productionVolume = 50.00;
if (mockInitialMonthlyTaskDetail.otherArrangements[0]) {
  mockInitialMonthlyTaskDetail.otherArrangements[0].productionVolume = 100.00;
}

