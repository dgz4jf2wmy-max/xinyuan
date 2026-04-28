import { MonthlyProductionPlanBase, MonthlyPlanStatus } from '../../types/monthly-plan';

export const mockMonthlyProductionPlanDetail: MonthlyProductionPlanBase = {
  id: 'plan-2026-001',
  sequenceNumber: 1,
  planName: '鑫源公司2026年4月份产销计划',
  status: MonthlyPlanStatus.PendingImprovement,
  creator: '张建国',
  createTime: '2026-01-02 09:30:00',
  planList: [
    // --- 1月 度再造烟叶（梗丝）产销计划 (特别为再造原料设计合并演示) ---
    { id: 'r1', sequenceNumber: 1, productType: '再造梗丝（省内）', brandGrade: 'GS22', productionVolume: 35.0, remarks: '具体按配方单执行' },
    { id: 'r2', sequenceNumber: 2, productType: '再造梗丝（省内）', brandGrade: 'GS30', productionVolume: 45.0, remarks: '具体按配方单执行' },
    { id: 'r5', sequenceNumber: 5, productType: '再造烟叶（省外）', brandGrade: 'HBZY-10', productionVolume: 200.0, remarks: '包含湖北、河南多地合并需求' },
    { id: 'r6', sequenceNumber: 6, productType: '再造烟叶（省外）', brandGrade: 'JSN08', productionVolume: 200.0, remarks: '包含广西、黑龙江多地合并需求' },
    { id: 'r7', sequenceNumber: 7, productType: '多孔颗粒', brandGrade: '/', productionVolume: 25.0, remarks: '具体按配方单执行' },
    { id: 'r8', sequenceNumber: 8, productType: '再造梗丝（省外）配方中试', brandGrade: 'SXSZ801', productionVolume: 0, remarks: '具体按试验通知单执行' },
    
    // --- 2月 香精香料成品生产计划 ---
    { id: 'f27', sequenceNumber: 27, productType: '料液 NX0160L20（合作加工）', brandGrade: 'NX0160L20', productionVolume: 12.112, remarks: '包含赣州、哈尔滨、柳州、延安四地需求' },
    { id: 'f28', sequenceNumber: 28, productType: '表香 NX0160X20（合作加工）', brandGrade: 'NX0160X20', productionVolume: 4.702, remarks: '包含赣州、哈尔滨、柳州、延安四地需求' },
  ],
  details: [
    // --- 再造原料明细 (合并演示项) ---
    // HBZY-10 合并项 (合计 200)
    { id: 'dr5-1', productType: '再造烟叶（省外）', brandGrade: 'HBZY-10', subBrandGrade: 'HBZY1001', productName: '再造烟叶', productCode: 'ZY-HB-10', customerName: '湖北中烟(武汉)', specification: '标准', requirementAmount: 120.0, unit: '吨', unitPriceExclTax: 13000, unitPriceInclTax: 14690, amountExclTax: 1560000, applicantName: '章经理', applicantDepartment: '市场部', productionType: '自产', expectedCompletionDate: '2026-01-15' },
    { id: 'dr5-2', productType: '再造烟叶（省外）', brandGrade: 'HBZY-10', subBrandGrade: 'HBZY1002', productName: '再造烟叶', productCode: 'ZY-HB-10', customerName: '河南中烟(许昌)', specification: '标准', requirementAmount: 80.0, unit: '吨', unitPriceExclTax: 13000, unitPriceInclTax: 14690, amountExclTax: 1040000, applicantName: '章经理', applicantDepartment: '市场部', productionType: '自产', expectedCompletionDate: '2026-01-20' },

    // JSN08 合并项 (合计 200)
    { id: 'dr6-1', productType: '再造烟叶（省外）', brandGrade: 'JSN08', subBrandGrade: 'JSN0801', productName: '再造烟叶', productCode: 'ZY-JS-08', customerName: '广西中烟', specification: '标准', requirementAmount: 150.0, unit: '吨', unitPriceExclTax: 13500, unitPriceInclTax: 15255, amountExclTax: 2025000, applicantName: '孙八', applicantDepartment: '市场部', productionType: '自产', expectedCompletionDate: '2026-01-18' },
    { id: 'dr6-2', productType: '再造烟叶（省外）', brandGrade: 'JSN08', subBrandGrade: 'JSN0802', productName: '再造烟叶', productCode: 'ZY-JS-08', customerName: '黑龙江烟草', specification: '标准', requirementAmount: 50.0, unit: '吨', unitPriceExclTax: 13500, unitPriceInclTax: 15255, amountExclTax: 675000, applicantName: '孙八', applicantDepartment: '市场部', productionType: '自产', expectedCompletionDate: '2026-01-22' },

    // 其他单项
    { id: 'dr1', productType: '再造梗丝（省内）', brandGrade: 'GS22', subBrandGrade: 'GS2201', productName: '再造梗丝', productCode: 'GS-SN-22', customerName: '江苏中烟徐州卷烟厂', specification: 'GS22', requirementAmount: 35.0, unit: '吨', unitPriceExclTax: 12000, unitPriceInclTax: 13560, amountExclTax: 420000, applicantName: '张管理员', applicantDepartment: '计划部', productionType: '自产', expectedCompletionDate: '2026-01-20' },
    
    // --- 香精香料明细 (保持合并演示) ---
    { id: 'df27-1', productType: '料液 NX0160L20（合作加工）', brandGrade: 'NX0160L20', subBrandGrade: 'NX0160L2001', productName: '料液', productCode: 'LY-NX-160-20', customerName: '赣州卷烟厂', specification: '标准', requirementAmount: 3.760, unit: '吨', unitPriceExclTax: 5000, unitPriceInclTax: 5650, amountExclTax: 18800, applicantName: '李经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-07' },
    { id: 'df27-2', productType: '料液 NX0160L20（合作加工）', brandGrade: 'NX0160L20', subBrandGrade: 'NX0160L2002', productName: '料液', productCode: 'LY-NX-160-20', customerName: '哈尔滨卷烟厂', specification: '标准', requirementAmount: 5.352, unit: '吨', unitPriceExclTax: 5000, unitPriceInclTax: 5650, amountExclTax: 26760, applicantName: '李经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-02' },
    { id: 'df27-3', productType: '料液 NX0160L20（合作加工）', brandGrade: 'NX0160L20', subBrandGrade: 'NX0160L2003', productName: '料液', productCode: 'LY-NX-160-20', customerName: '柳州卷烟厂', specification: '标准', requirementAmount: 1.050, unit: '吨', unitPriceExclTax: 5000, unitPriceInclTax: 5650, amountExclTax: 5250, applicantName: '李经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-07' },
    { id: 'df27-4', productType: '料液 NX0160L20（合作加工）', brandGrade: 'NX0160L20', subBrandGrade: 'NX0160L2004', productName: '料液', productCode: 'LY-NX-160-20', customerName: '延安卷烟厂', specification: '标准', requirementAmount: 1.950, unit: '吨', unitPriceExclTax: 5000, unitPriceInclTax: 5650, amountExclTax: 9750, applicantName: '李经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-07' },

    // 重点演示：表香 NX0160X20（合作加工）的分拆需求 (合计 4.702)
    { id: 'df28-1', productType: '表香 NX0160X20（合作加工）', brandGrade: 'NX0160X20', subBrandGrade: 'NX0160X2001', productName: '表香', productCode: 'BX-NX-160-20', customerName: '赣州卷烟厂', specification: '标准', requirementAmount: 1.430, unit: '吨', unitPriceExclTax: 8000, unitPriceInclTax: 9040, amountExclTax: 11440, applicantName: '王经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-07' },
    { id: 'df28-2', productType: '表香 NX0160X20（合作加工）', brandGrade: 'NX0160X20', subBrandGrade: 'NX0160X2002', productName: '表香', productCode: 'BX-NX-160-20', customerName: '哈尔滨卷烟厂', specification: '标准', requirementAmount: 2.082, unit: '吨', unitPriceExclTax: 8000, unitPriceInclTax: 9040, amountExclTax: 16656, applicantName: '王经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-02' },
    { id: 'df28-3', productType: '表香 NX0160X20（合作加工）', brandGrade: 'NX0160X20', subBrandGrade: 'NX0160X2003', productName: '表香', productCode: 'BX-NX-160-20', customerName: '柳州卷烟厂', specification: '标准', requirementAmount: 0.440, unit: '吨', unitPriceExclTax: 8000, unitPriceInclTax: 9040, amountExclTax: 3520, applicantName: '王经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-07' },
    { id: 'df28-4', productType: '表香 NX0160X20（合作加工）', brandGrade: 'NX0160X20', subBrandGrade: 'NX0160X2004', productName: '表香', productCode: 'BX-NX-160-20', customerName: '延安卷烟厂', specification: '标准', requirementAmount: 0.750, unit: '吨', unitPriceExclTax: 8000, unitPriceInclTax: 9040, amountExclTax: 6000, applicantName: '王经理', applicantDepartment: '营销中心', productionType: '委托加工', expectedCompletionDate: '2026-02-07' },

    // 其他散项明细
    { id: 'df29-1', productType: '料液', brandGrade: 'NX0200L19', subBrandGrade: 'NX0200L1901', productName: '料液', productCode: 'LY-NX-200-19', customerName: '南京卷烟厂', specification: '标准', requirementAmount: 5.400, unit: '吨', unitPriceExclTax: 5200, unitPriceInclTax: 5876, amountExclTax: 28080, applicantName: '赵经理', applicantDepartment: '营销中心', productionType: '自产', expectedCompletionDate: '2026-02-02' },
    { id: 'df29-2', productType: '料液', brandGrade: 'NX0200L19', subBrandGrade: 'NX0200L1902', productName: '料液', productCode: 'LY-NX-200-19', customerName: '南京卷烟厂', specification: '标准', requirementAmount: 2.700, unit: '吨', unitPriceExclTax: 5200, unitPriceInclTax: 5876, amountExclTax: 14040, applicantName: '赵经理', applicantDepartment: '营销中心', productionType: '自产', expectedCompletionDate: '2026-02-28' },
  ]
};

export const mockInitialMonthlyPlanDetail: MonthlyProductionPlanBase = {
  ...mockMonthlyProductionPlanDetail,
  planName: '鑫源公司2026年4月份产销计划 (初始版)',
  createTime: '2026-01-01 08:00:00',
  planList: mockMonthlyProductionPlanDetail.planList.map(item => ({
    ...item,
    productionVolume: item.productionVolume * 0.9 // 初始值设为当前值的90%用于对比
  }))
};

export const versions = [
  'V2.0 (当前有效)',
  'V1.3 (历史版本)',
  'V1.2 (历史版本)',
  'V1.1 (历史版本)',
  'V1.0 (初始版本)'
];
