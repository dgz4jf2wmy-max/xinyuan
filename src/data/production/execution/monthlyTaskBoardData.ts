// 1. 月度生产任务-基础信息 (主表 SCAP)
export const masterTaskInfo = {
  taskNo: 'SCAP-202603-001',
  taskName: '3月月度生产任务',
  approvalStatus: '已发布',
  executionStatus: '在执行',
  month: 3,
  version: 'V1.0',
  creator: '生产管理员',
  createTime: '2026-02-28 09:00',
  updateTime: '2026-02-28 14:30'
};

// 2. 子表数据：再造烟叶生产序列 (SCRW-ZY)
export const mockLeafTasks = [
  { 
    taskCode: 'SCRW-ZY-03-001', line: '再造原料', productType: '再造烟叶',
    productName: 'JSN18再造烟叶', productCode: 'P-JSN18-001', brand: 'JSN18',
    amount: 300, unit: '吨', deadline: '2026-03-05', status: '已执行', actualAmount: 300,
    formulaVersion: 'V2.1.0', blendAmount: 5, blendRatio: '1.6%',
    signals: { preProcess: false, finishing: false }, startTime: '03-01 08:30', endTime: '03-04 15:00' 
  },
  { 
    taskCode: 'SCRW-ZY-03-002', line: '再造原料', productType: '再造烟叶',
    productName: 'JSS06再造烟叶', productCode: 'P-JSS06-002', brand: 'JSS06',
    amount: 300, unit: '吨', deadline: '2026-03-10', status: '待执行', actualAmount: 0,
    formulaVersion: 'V3.0.1', blendAmount: 0, blendRatio: '0%',
    signals: { preProcess: false, finishing: false }, startTime: '-', endTime: '-' 
  },
  { 
    taskCode: 'SCRW-ZY-03-003', line: '再造原料', productType: '再造烟叶',
    productName: 'JSN08 (广西) 试验', productCode: 'P-TEST-001', brand: 'JSN08', arrangeType: '自主试验',
    amount: 1, unit: '批次', deadline: '2026-03-12', status: '待执行', actualAmount: 0,
    formulaVersion: 'V-Test-01', blendAmount: 0, blendRatio: '0%',
    signals: { preProcess: false, finishing: false }, startTime: '-', endTime: '-' 
  }
];

// 3. 子表数据：再造梗丝生产序列 (SCRW-GS)
export const mockStemTasks = [
  { 
    taskCode: 'SCRW-GS-03-001', line: '再造原料', productType: '再造梗丝',
    productName: 'GS01再造梗丝', productCode: 'P-GS01-001', brand: 'GS01',
    amount: 30, unit: '吨', deadline: '2026-03-06', status: '在执行', actualAmount: 18.5,
    formulaVersion: 'V1.5.2', blendAmount: 0, blendRatio: '0%',
    signals: { preProcess: true, finishing: true }, startTime: '03-04 16:30', endTime: '-' 
  },
  { 
    taskCode: 'SCRW-GS-03-002', line: '再造原料', productType: '再造梗丝',
    productName: 'GS22再造梗丝', productCode: 'P-GS22-001', brand: 'GS22',
    amount: 20, unit: '吨', deadline: '2026-03-08', status: '待执行', actualAmount: 0,
    formulaVersion: 'V1.2.0', blendAmount: 0, blendRatio: '0%',
    signals: { preProcess: false, finishing: false }, startTime: '-', endTime: '-' 
  },
  { 
    taskCode: 'SCRW-GS-03-003', line: '再造原料', productType: '再造梗丝',
    productName: 'GS60再造梗丝', productCode: 'P-GS60-001', brand: 'GS60',
    amount: 100, unit: '吨', deadline: '2026-03-15', status: '待执行', actualAmount: 0,
    formulaVersion: 'V2.0.0', blendAmount: 0, blendRatio: '0%',
    signals: { preProcess: false, finishing: false }, startTime: '-', endTime: '-' 
  }
];

// 4. 子表数据：香精香料生产序列 (SCRW-XJ)
export const mockFlavorTasks = [
  { 
    taskCode: 'SCRW-XJ-03-001', line: '香精香料', productType: '香精香料',
    productName: 'NX0160组合', productCode: 'P-NX0160-00', brand: 'NX0160L20',
    amount: 12, unit: '吨', deadline: '2026-03-05', status: '已执行', actualAmount: 12,
    startTime: '03-01 09:00', endTime: '03-02 14:00', 
    components: [{ code: 'L-NX0160L20', name: '料液', amount: 10, unit: '吨' }, { code: 'X-NX0160X20', name: '表香', amount: 2, unit: '吨' }] 
  },
  { 
    taskCode: 'SCRW-XJ-03-002', line: '香精香料', productType: '香精香料',
    productName: 'NC0120组合', productCode: 'P-NC0120-00', brand: 'NC0120L10',
    amount: 19, unit: '吨', deadline: '2026-03-08', status: '在执行', actualAmount: 5.2,
    startTime: '03-03 10:00', endTime: '-', 
    components: [{ code: 'L-NC0120L10', name: '料液', amount: 15, unit: '吨' }, { code: 'X-NC0120X10', name: '表香', amount: 4, unit: '吨' }] 
  },
  { 
    taskCode: 'SCRW-XJ-03-003', line: '香精香料', productType: '香精香料',
    productName: 'SC0280组合', productCode: 'P-SC0280-00', brand: 'SC0280L24',
    amount: 0.35, unit: '吨', deadline: '2026-03-10', status: '待执行', actualAmount: 0,
    startTime: '-', endTime: '-', 
    components: [{ code: 'L-SC0280L24', name: '料液', amount: 0.3, unit: '吨' }, { code: 'X-SC0280X24', name: '表香', amount: 0.05, unit: '吨' }] 
  }
];

// 5. 试验归档待办
export const mockTestTasks = [
  { id: 'T-OT-001', taskCode: 'SCRW-GS-03-004', productName: 'SXSZ801 梗丝配方中试', status: '待归档', testDate: '2026-02-28', autoCaptured: { materialConsumed: '2.15 吨', energyConsumed: '450 kWh', waterConsumed: '12 吨' } }
];
