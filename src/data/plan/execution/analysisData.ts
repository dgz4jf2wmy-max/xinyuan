export const mockKPIs = {
  fulfillmentRate: 92.4,
  otdRate: 88.5,
  materialShortageCount: 3,
  overloadLineCount: 1,
};

export const mockDeviationData = [
  { category: '再造烟叶', planned: 1200, actual: 1150, unit: '吨', deviation: -4.1 },
  { category: '再造梗丝', planned: 850, actual: 720, unit: '吨', deviation: -15.2 },
  { category: '香精香料', planned: 45, actual: 48, unit: '吨', deviation: 6.6 },
];

export const mockMaterialConstraints = [
  { id: 1, material: '2024;烤烟;云南;碎片', shortage: -50, unit: 'kg', affectedPlan: '鑫源公司2026年4月产销计划', affectedProduct: '再造烟叶 (HBZY-10)', impactLevel: 'high' },
  { id: 2, material: '吉林延边卷包回收烟末', shortage: -400, unit: 'kg', affectedPlan: '鑫源公司2026年4月产销计划', affectedProduct: '再造梗丝 (GS30)', impactLevel: 'high' },
  { id: 3, material: '2024;烤烟;江苏淮安;残烟烟末', shortage: -110, unit: 'kg', affectedPlan: '2026年4月配方中试', affectedProduct: '试验品 (EX-01)', impactLevel: 'medium' },
];

export const mockDeliveryAlerts = [
  { id: 1, customer: '江苏中烟', product: 'GS22', delayDays: 3, expected: '2026-04-15', reason: '主原料(江苏烟末)短缺未齐套' },
  { id: 2, customer: '广东中烟', product: 'NC0120L10', delayDays: 1, expected: '2026-04-18', reason: '香料调配车间排队中' },
];

export const mockCapacityLoad = [
  { line: '制丝一干线 (再造烟叶)', load: 85, status: 'normal' },
  { line: '制丝二干线 (再造梗丝)', load: 115, status: 'overload' },
  { line: '香精调配中心', load: 60, status: 'idle' },
  { line: '醇化周转库区', load: 92, status: 'warning' },
];

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

export const cumulativeProgress = [
  { 
    id: 'yy', category: '再造烟叶', demand: 14800, scheduled: 14500, actual: 13200, unit: '吨',
    details: [
      { brand: 'HBZY-10', demand: 8000, scheduled: 8000, actual: 7500 },
      { brand: 'JSN08', demand: 6800, scheduled: 6500, actual: 5700 }
    ]
  },
  { 
    id: 'gs', category: '再造梗丝', demand: 660, scheduled: 678, actual: 650, unit: '吨',
    details: [
      { brand: 'GS22', demand: 80, scheduled: 160, actual: 162 },
      { brand: 'GS30', demand: 100, scheduled: 140, actual: 142 },
      { brand: 'GS60', demand: 100, scheduled: 120, actual: 124 },
      { brand: 'GS01', demand: 100, scheduled: 140, actual: 146 },
      { brand: '4#', demand: 60, scheduled: 100, actual: 104 },
      { brand: 'SXSZ801', demand: 15, scheduled: 15, actual: 15 }
    ]
  }, 
  { 
    id: 'xj', category: '香精香料', demand: 600, scheduled: 600, actual: 580, unit: '吨',
    details: [
      { brand: 'NX0160L20', demand: 450, scheduled: 450, actual: 440 },
      { brand: 'NX0160X20', demand: 150, scheduled: 150, actual: 140 }
    ]
  },
];

export const monthlyProgress = {
  inProvince: [
    { productCode: '010210001', productName: '再造梗丝（省内）', category: '再造梗丝', brandGrade: 'GS22', specification: '15kg/箱', initialStock: 30, m1Demand: 40, m1Scheduled: 80, m1Actual: 81, m2Demand: 40, m2Scheduled: 80, m2Actual: 81, m3Demand: 45, m3Scheduled: 85, m3Actual: 86, m4Demand: 50, m4Scheduled: 80, m4Actual: 78, m5Demand: 50, m5Scheduled: 70, m5Actual: 72, m6Demand: 45, m6Scheduled: 65, m6Actual: 60, m7Demand: 50, m7Scheduled: 80, m7Actual: 84, m8Demand: 55, m8Scheduled: 85, m8Actual: 88, m9Demand: 40, m9Scheduled: 60, m9Actual: 58, m10Demand: 45, m10Scheduled: 70, m10Actual: 70, m11Demand: 50, m11Scheduled: 80, m11Actual: 82, m12Demand: 60, m12Scheduled: 90, m12Actual: 95, accDemand: 570, accScheduled: 925, accActual: 935 },
    { productCode: '010210002', productName: '再造梗丝（省内）', category: '再造梗丝', brandGrade: 'GS30', specification: '15kg/箱', initialStock: 20, m1Demand: 50, m1Scheduled: 70, m1Actual: 71, m2Demand: 50, m2Scheduled: 70, m2Actual: 71, m3Demand: 55, m3Scheduled: 75, m3Actual: 74, m4Demand: 45, m4Scheduled: 85, m4Actual: 86, m5Demand: 50, m5Scheduled: 60, m5Actual: 62, m6Demand: 40, m6Scheduled: 50, m6Actual: 48, m7Demand: 60, m7Scheduled: 80, m7Actual: 82, m8Demand: 65, m8Scheduled: 90, m8Actual: 90, m9Demand: 45, m9Scheduled: 65, m9Actual: 63, m10Demand: 50, m10Scheduled: 75, m10Actual: 76, m11Demand: 55, m11Scheduled: 80, m11Actual: 85, m12Demand: 60, m12Scheduled: 85, m12Actual: 89, accDemand: 625, accScheduled: 885, accActual: 897 },
    { productCode: '010210003', productName: '再造梗丝（省内）', category: '再造梗丝', brandGrade: 'GS60', specification: '15kg/箱', initialStock: 10, m1Demand: 50, m1Scheduled: 60, m1Actual: 62, m2Demand: 50, m2Scheduled: 60, m2Actual: 62, m3Demand: 40, m3Scheduled: 65, m3Actual: 64, m4Demand: 40, m4Scheduled: 60, m4Actual: 62, m5Demand: 45, m5Scheduled: 55, m5Actual: 56, m6Demand: 50, m6Scheduled: 65, m6Actual: 63, m7Demand: 55, m7Scheduled: 70, m7Actual: 71, m8Demand: 40, m8Scheduled: 50, m8Actual: 52, m9Demand: 45, m9Scheduled: 55, m9Actual: 55, m10Demand: 50, m10Scheduled: 60, m10Actual: 61, m11Demand: 45, m11Scheduled: 55, m11Actual: 58, m12Demand: 50, m12Scheduled: 65, m12Actual: 68, accDemand: 560, accScheduled: 720, accActual: 734 },
    { productCode: '010210004', productName: '再造梗丝（省内）', category: '再造梗丝', brandGrade: 'GS01', specification: '15kg/箱', initialStock: 40, m1Demand: 50, m1Scheduled: 70, m1Actual: 73, m2Demand: 50, m2Scheduled: 70, m2Actual: 73, m3Demand: 60, m3Scheduled: 80, m3Actual: 78, m4Demand: 60, m4Scheduled: 80, m4Actual: 80, m5Demand: 55, m5Scheduled: 75, m5Actual: 78, m6Demand: 45, m6Scheduled: 60, m6Actual: 62, m7Demand: 65, m7Scheduled: 90, m7Actual: 95, m8Demand: 70, m8Scheduled: 100, m8Actual: 105, m9Demand: 50, m9Scheduled: 65, m9Actual: 66, m10Demand: 60, m10Scheduled: 80, m10Actual: 84, m11Demand: 65, m11Scheduled: 85, m11Actual: 88, m12Demand: 70, m12Scheduled: 95, m12Actual: 98, accDemand: 700, accScheduled: 950, accActual: 980 },
    { productCode: '010110001', productName: '再造烟叶（省内）', category: '再造烟叶', brandGrade: 'HBZY-10', specification: '20kg/箱', initialStock: 100, m1Demand: 200, m1Scheduled: 200, m1Actual: 195, m2Demand: 200, m2Scheduled: 200, m2Actual: 195, m3Demand: 180, m3Scheduled: 210, m3Actual: 205, m4Demand: 190, m4Scheduled: 200, m4Actual: 200, m5Demand: 210, m5Scheduled: 220, m5Actual: 215, m6Demand: 190, m6Scheduled: 180, m6Actual: 175, m7Demand: 220, m7Scheduled: 240, m7Actual: 245, m8Demand: 230, m8Scheduled: 250, m8Actual: 255, m9Demand: 180, m9Scheduled: 190, m9Actual: 188, m10Demand: 200, m10Scheduled: 210, m10Actual: 212, m11Demand: 210, m11Scheduled: 220, m11Actual: 225, m12Demand: 240, m12Scheduled: 260, m12Actual: 265, accDemand: 2450, accScheduled: 2580, accActual: 2575 },
    { productCode: '010310001', productName: '香精香料（省内）', category: '香精香料', brandGrade: 'NX01', specification: '5kg/箱', initialStock: 5, m1Demand: 10, m1Scheduled: 10, m1Actual: 10, m2Demand: 10, m2Scheduled: 10, m2Actual: 10, m3Demand: 15, m3Scheduled: 18, m3Actual: 16, m4Demand: 12, m4Scheduled: 15, m4Actual: 15, m5Demand: 14, m5Scheduled: 16, m5Actual: 16, m6Demand: 10, m6Scheduled: 12, m6Actual: 12, m7Demand: 16, m7Scheduled: 20, m7Actual: 20, m8Demand: 18, m8Scheduled: 22, m8Actual: 23, m9Demand: 12, m9Scheduled: 15, m9Actual: 14, m10Demand: 15, m10Scheduled: 18, m10Actual: 18, m11Demand: 16, m11Scheduled: 20, m11Actual: 21, m12Demand: 20, m12Scheduled: 25, m12Actual: 26, accDemand: 168, accScheduled: 201, accActual: 201 },
  ],
  outProvince: [
    { productCode: '010210005', productName: '再造梗丝（省外）', category: '再造梗丝', brandGrade: '4#', specification: '15kg/箱', initialStock: 10, m1Demand: 30, m1Scheduled: 50, m1Actual: 52, m2Demand: 30, m2Scheduled: 50, m2Actual: 52, m3Demand: 40, m3Scheduled: 45, m3Actual: 46, m4Demand: 45, m4Scheduled: 50, m4Actual: 50, m5Demand: 35, m5Scheduled: 40, m5Actual: 40, m6Demand: 30, m6Scheduled: 35, m6Actual: 36, m7Demand: 50, m7Scheduled: 60, m7Actual: 62, m8Demand: 55, m8Scheduled: 65, m8Actual: 66, m9Demand: 40, m9Scheduled: 45, m9Actual: 44, m10Demand: 45, m10Scheduled: 55, m10Actual: 56, m11Demand: 50, m11Scheduled: 60, m11Actual: 63, m12Demand: 60, m12Scheduled: 75, m12Actual: 78, accDemand: 510, accScheduled: 630, accActual: 645 },
    { productCode: '010210006', productName: '再造梗丝（省外）', category: '再造梗丝', brandGrade: '2#', specification: '15kg/箱', initialStock: 0, m1Demand: 0, m1Scheduled: 0, m1Actual: 0, m2Demand: 0, m2Scheduled: 0, m2Actual: 0, m3Demand: 0, m3Scheduled: 0, m3Actual: 0, m4Demand: 0, m4Scheduled: 0, m4Actual: 0, m5Demand: 0, m5Scheduled: 0, m5Actual: 0, m6Demand: 0, m6Scheduled: 0, m6Actual: 0, m7Demand: 10, m7Scheduled: 15, m7Actual: 15, m8Demand: 15, m8Scheduled: 20, m8Actual: 21, m9Demand: 5, m9Scheduled: 10, m9Actual: 10, m10Demand: 10, m10Scheduled: 15, m10Actual: 15, m11Demand: 15, m11Scheduled: 20, m11Actual: 22, m12Demand: 20, m12Scheduled: 30, m12Actual: 32, accDemand: 75, accScheduled: 110, accActual: 115 },
    { productCode: '010110002', productName: '再造烟叶（省外）', category: '再造烟叶', brandGrade: 'JSN08', specification: '20kg/箱', initialStock: 50, m1Demand: 100, m1Scheduled: 100, m1Actual: 90, m2Demand: 100, m2Scheduled: 100, m2Actual: 90, m3Demand: 110, m3Scheduled: 120, m3Actual: 115, m4Demand: 100, m4Scheduled: 110, m4Actual: 112, m5Demand: 120, m5Scheduled: 130, m5Actual: 125, m6Demand: 90, m6Scheduled: 100, m6Actual: 95, m7Demand: 130, m7Scheduled: 150, m7Actual: 148, m8Demand: 140, m8Scheduled: 160, m8Actual: 165, m9Demand: 110, m9Scheduled: 120, m9Actual: 118, m10Demand: 120, m10Scheduled: 135, m10Actual: 136, m11Demand: 130, m11Scheduled: 145, m11Actual: 150, m12Demand: 150, m12Scheduled: 170, m12Actual: 175, accDemand: 1400, accScheduled: 1540, accActual: 1519 },
  ]
};

export const annualFulfillment = [
  { category: '再造烟叶', prodPlan: 15000, prodActual: 13200, salesPlan: 14800, salesActual: 13500, unit: '吨' },
  { category: '再造梗丝', prodPlan: 8500, prodActual: 6100, salesPlan: 8500, salesActual: 6200, unit: '吨' },
  { category: '香精香料', prodPlan: 600, prodActual: 580, salesPlan: 600, salesActual: 590, unit: '吨' },
];

export const historicalTrends = [
  { year: '2024年', category: '再造烟叶', prod: 13500, sales: 12200 },
  { year: '2025年', category: '再造烟叶', prod: 14200, sales: 14500 },
  { year: '2026年', category: '再造烟叶', prod: 13200, sales: 13500 },
  { year: '2024年', category: '再造梗丝', prod: 7200, sales: 7100 },
  { year: '2025年', category: '再造梗丝', prod: 7800, sales: 7500 },
  { year: '2026年', category: '再造梗丝', prod: 6100, sales: 6200 },
  { year: '2024年', category: '香精香料', prod: 450, sales: 440 },
  { year: '2025年', category: '香精香料', prod: 520, sales: 530 },
  { year: '2026年', category: '香精香料', prod: 580, sales: 590 },
];

export const marketInventory = [
  { id: 'i1', seq: 1, category: '再造烟叶', market: '江苏中烟', product: 'JSN18', annualTarget: 1110, lastYearStock: 179, prodUpToLastMonth: 0, shippedUpToLastMonth: 0, companyStock: 179, targetMarketStock: 809 },
  { id: 'i2', seq: 2, category: '再造烟叶', market: '江苏中烟', product: 'JSS06', annualTarget: 700, lastYearStock: 264, prodUpToLastMonth: 0, shippedUpToLastMonth: 0, companyStock: 264, targetMarketStock: 524 },
  { id: 'i3', seq: 3, category: '再造烟叶', market: '广西市场', product: 'SXGX699', annualTarget: 600, lastYearStock: 163, prodUpToLastMonth: 210, shippedUpToLastMonth: 163, companyStock: 210, targetMarketStock: 153 },
  { id: 'i4', seq: 4, category: '再造烟叶', market: '山东市场', product: 'JSN03', annualTarget: 60, lastYearStock: 27, prodUpToLastMonth: 0, shippedUpToLastMonth: 10, companyStock: 17, targetMarketStock: 50 },
  { id: 'i5', seq: 5, category: '再造烟叶', market: '河北市场', product: 'HBZY-10', annualTarget: 600, lastYearStock: 0, prodUpToLastMonth: 194, shippedUpToLastMonth: 54, companyStock: 140, targetMarketStock: 288 },
  { id: 'i6', seq: 6, category: '再造梗丝', market: '吉林市场', product: '4#', annualTarget: 200, lastYearStock: 0, prodUpToLastMonth: 0, shippedUpToLastMonth: 0, companyStock: 0, targetMarketStock: 40 },
  { id: 'i7', seq: 7, category: '再造梗丝', market: '深圳市场', product: 'SXSZ801', annualTarget: 15, lastYearStock: 2.4, prodUpToLastMonth: 0, shippedUpToLastMonth: 0, companyStock: 2.4, targetMarketStock: 4 },
];
