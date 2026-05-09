import { 
  ProductionPlanPool,
  PoolApplicationStatus
} from '../../types/production-pool';
import { ProductionTypeEnum } from '../../types/base-data';

const createPoolRecord = (
  id: number,
  productType: string,
  productionType: string,
  productName: string,
  brandGrade: string,
  specification: string,
  amount: number,
  customerName: string,
  deliveryLocation: string,
  status: PoolApplicationStatus = PoolApplicationStatus.PendingPlan,
  applicationType: string = '普通'
): ProductionPlanPool => ({
  id: `pool-${id}`,
  sequenceNumber: id,
  documentNo: `DD20260501${id.toString().padStart(3, '0')}`,
  isChanged: false,
  status,
  applicationType,
  productType,
  productionType,
  productName,
  productCode: `010210${id.toString().padStart(3, '0')}`,
  customerName,
  brandGrade,
  specification,
  unit: '吨',
  requirements: [{ id: `req-${id}`, sequenceNumber: 1, versionNo: 'V1.0', requirementAmount: amount, unit: '吨' }],
  totalRequirementAmount: amount,
  initialRequirementAmount: amount,



  deliveryDate: '2026-06-01',
  deliveryLocation,
  purchaseOrder: `PO-2026-${id.toString().padStart(3, '0')}`,


});

const createExperimentalPoolRecord = (
  id: number,
  productType: string,
  productionType: string,
  productName: string,
  brandGrade: string,
  specification: string,
  baseAmount: number,
  customerName: string,
  deliveryLocation: string,
  status: PoolApplicationStatus = PoolApplicationStatus.PendingPlan,
  applicationType: string = '紧急'
): ProductionPlanPool => ({
  id: `pool-${id}`,
  sequenceNumber: id,
  documentNo: `SY20260501${id.toString().padStart(3, '0')}`,
  isChanged: false,
  status,
  applicationType,
  productType,
  productionType,
  productName,
  productCode: `010210${id.toString().padStart(3, '0')}`,
  customerName,
  brandGrade,
  specification,
  unit: '吨',
  requirements: [
    { id: `req-${id}-1`, sequenceNumber: 1, versionNo: 'V1.0', requirementAmount: baseAmount * 0.8, unit: '吨' },
    { id: `req-${id}-2`, sequenceNumber: 2, versionNo: 'V1.1', requirementAmount: baseAmount * 1.0, unit: '吨' },
    { id: `req-${id}-3`, sequenceNumber: 3, versionNo: 'V2.0', requirementAmount: baseAmount * 1.5, unit: '吨' }
  ],
  totalRequirementAmount: (baseAmount * 0.8) + (baseAmount * 1.0) + (baseAmount * 1.5),
  initialRequirementAmount: baseAmount * 0.8,



  deliveryDate: '2026-06-01',
  deliveryLocation,
  purchaseOrder: `PO-2026-${id.toString().padStart(3, '0')}`,


});

/**
 * 根据需求杜撰的生产计划池静态数据
 */
export const mockProductionPoolData: ProductionPlanPool[] = [
  // ----------- 第一张表 -----------
  createPoolRecord(1, '再造梗丝', ProductionTypeEnum.StemRecipeFinished, '再造梗丝（省内）', 'GS22', '15', 35, '江苏中烟工业有限责任公司', '南京', PoolApplicationStatus.Cancelled),
  createPoolRecord(2, '再造梗丝', ProductionTypeEnum.StemRecipeFinished, '再造梗丝（省内）', 'GS30', '15', 45, '江苏中烟工业有限责任公司', '淮安', PoolApplicationStatus.PendingPlan),
  createPoolRecord(3, '再造梗丝', ProductionTypeEnum.StemRecipeFinished, '再造梗丝（省内）', 'GS01', '15', 30, '江苏中烟工业有限责任公司', '徐州', PoolApplicationStatus.PendingPlan),
  createPoolRecord(4, '再造梗丝', ProductionTypeEnum.StemRecipeFinished, '再造梗丝（省内）', 'GS60', '15', 90, '江苏中烟工业有限责任公司', '苏州', PoolApplicationStatus.PendingPlan),
  createPoolRecord(5, '再造烟叶', ProductionTypeEnum.TobaccoRecipeFinished, '再造烟叶（省外）', 'HBZY-10', '15', 200, '河北中烟工业有限责任公司', '石家庄', PoolApplicationStatus.PendingPlan),
  createPoolRecord(6, '再造烟叶', ProductionTypeEnum.TobaccoRecipeFinished, '再造烟叶（省外）', 'JSN08', '15', 200, '山东中烟工业有限责任公司', '济南', PoolApplicationStatus.PendingPlan),
  
  // ---> NEW DATA FOR MERGE TESTING <---
  createPoolRecord(1001, '再造烟叶', ProductionTypeEnum.TobaccoRecipeFinished, '再造烟叶（省外）测试合并', 'HBZY-10', '15', 50, '河北中烟工业有限责任公司', '石家庄', PoolApplicationStatus.PendingPlan),
  createPoolRecord(1002, '再造烟叶', ProductionTypeEnum.TobaccoRecipeSemi, '再造烟叶（省外）测试合并', 'HBZY-10', '15', 80, '河北中烟工业有限责任公司', '石家庄', PoolApplicationStatus.PendingPlan),
  createPoolRecord(1003, '再造烟叶', ProductionTypeEnum.TobaccoIndependentTrial, '再造烟叶（省外）不应合并', 'HBZY-10', '15', 20, '河北中烟工业有限责任公司', '石家庄', PoolApplicationStatus.PendingPlan),
  
  createPoolRecord(1004, '再造梗丝', ProductionTypeEnum.StemRecipeFinished, '再造梗丝合并1', 'GS30', '15', 15, '江苏中烟工业有限责任公司', '淮安', PoolApplicationStatus.PendingPlan),
  createPoolRecord(1005, '再造梗丝', ProductionTypeEnum.StemRecipeSemi, '再造梗丝合并2', 'GS30', '15', 25, '江苏中烟工业有限责任公司', '淮安', PoolApplicationStatus.PendingPlan),
  
  createPoolRecord(1006, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液相同牌号', 'SC0280L24', '20L/桶', 0.5, '江苏中烟工业有限责任公司', '徐州', PoolApplicationStatus.PendingPlan),
  createPoolRecord(1007, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液相同牌号', 'SC0280L24', '20L/桶', 0.2, '江苏中烟工业有限责任公司', '南京', PoolApplicationStatus.PendingPlan),
  createPoolRecord(1008, '香精香料', ProductionTypeEnum.FlavorEntrusted, '料液相同牌号不同类型', 'SC0280L24', '20L/桶', 0.1, '江苏中烟工业有限责任公司', '无锡', PoolApplicationStatus.PendingPlan),
  // ---> END NEW DATA <---

  createPoolRecord(7, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '多孔颗粒', '-', '25kg/箱', 25, '国家烟草专卖局职工培训中心', '北京'),
  createExperimentalPoolRecord(8, '再造梗丝', ProductionTypeEnum.StemIndependentTrial, '再造梗丝（省外）配方中试', 'SXSZ801', '15', 10, '深圳烟草工业有限责任公司', '-'),
  createExperimentalPoolRecord(9, '再造烟叶', ProductionTypeEnum.TobaccoIndependentTrial, '再造烟叶（省外）广西配方中试', 'JSN08', '15', 20, '广西中烟工业有限责任公司', '-'),
  createExperimentalPoolRecord(10, '再造烟叶', ProductionTypeEnum.TobaccoIndependentTrial, '再造烟叶（省外）外加纤添加试验', '-', '-', 15, '江苏中烟工业有限责任公司（本部）', '-'),
  createExperimentalPoolRecord(11, '再造烟叶', ProductionTypeEnum.TobaccoIndependentTrial, '再造烟叶（省外）配方中试', 'XYJX-02', '15', 12, '江苏鑫源烟草薄片有限公司', '-'),
  createExperimentalPoolRecord(12, '再造烟叶', ProductionTypeEnum.TobaccoIndependentTrial, '再造烟叶（省外）江西新产品中试', 'SXSX618', '15', 18, '江西中烟工业有限责任公司', '-'),

  // ----------- 第二张表 (香精料液) -----------
  createPoolRecord(13, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液', 'SC0280L24', '20L/桶', 0.3, '江苏中烟工业有限责任公司', '徐州'),
  createPoolRecord(14, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液', 'NC0320L04', '20L/桶', 0.3, '南通烟滤嘴有限责任公司', '南通'),
  createPoolRecord(15, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液', 'NC0220L05', '20L/桶', 1.8, '广东中烟工业有限责任公司', '广州'),
  createPoolRecord(16, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液', 'SZ0260L29', '20L/桶', 0.5, '深圳烟草工业有限责任公司', '深圳'),
  createPoolRecord(17, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '表香', 'SZ0260X29', '20L/桶', 0.1, '浙江中烟工业有限责任公司', '杭州'),
  createPoolRecord(18, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液', 'NX0400L34R', '20L/桶', 0.07, '吉林烟草工业有限责任公司', '长春'),
  createPoolRecord(19, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '表香', 'NX0400X34', '20L/桶', 0.05, '黑龙江烟草工业有限责任公司', '哈尔滨'),
  createPoolRecord(20, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液', 'BA71504', '20L/桶', 0.2, '云南中烟工业有限责任公司', '昆明'),

  // ----------- 第三部分: 醇化相关 (演示用) -----------
  createPoolRecord(21, '再造烟叶', ProductionTypeEnum.TobaccoAgeing, 'ZY01A01', 'ZY01A', '15', 120, '江苏中烟工业有限责任公司', '南京', PoolApplicationStatus.PendingPlan),
  createPoolRecord(22, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS08B01', 'GS08B', '15', 85, '安徽中烟工业有限责任公司', '芜湖', PoolApplicationStatus.PendingPlan),
  createPoolRecord(23, '再造烟叶', ProductionTypeEnum.TobaccoAgeing, 'ZYEXP0201', 'ZYEXP02', '15', 200, '中烟国际', '上海港', PoolApplicationStatus.PendingPlan),
  createPoolRecord(24, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS12A01', 'GS12A', '15', 60, '江苏中烟工业有限责任公司', '淮海', PoolApplicationStatus.PendingPlan),

  // ----------- 匹配用户需求图示的数据 (GS60, GS01, GS30, GS22, JSZ11) -----------
  // 箱数 = requirementAmount / 0.05. 所以 requirementAmount = 箱数 * 0.05.
  createPoolRecord(25, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS6001', 'GS60', '15', 200, '徐州卷烟厂', '徐州'), // 箱数 4000
  createPoolRecord(26, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS6002', 'GS60', '15', 51.85, '徐州卷烟厂', '徐州'), // 箱数 1037
  createPoolRecord(28, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS0101', 'GS01', '15', 130, '南京卷烟厂', '南京'), // 箱数 2600
  createPoolRecord(29, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS0102', 'GS01', '15', 51.5, '南京卷烟厂', '南京'), // 箱数 1030
  createPoolRecord(31, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS3001', 'GS30', '15', 7, '淮阴卷烟厂', '淮安'), // 箱数 140
  createPoolRecord(32, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS3003', 'GS30', '15', 100, '淮阴卷烟厂', '淮安'), // 箱数 2000
  createPoolRecord(33, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS2201', 'GS22', '15', 31.15, '徐州卷烟厂', '徐州'), // 箱数 623
  createPoolRecord(34, '再造梗丝', ProductionTypeEnum.StemAgeing, 'GS2202', 'GS22', '15', 33.9, '徐州卷烟厂', '徐州'), // 箱数 678
  createPoolRecord(36, '再造烟叶', ProductionTypeEnum.TobaccoAgeing, 'JSZ1101', 'JSZ11', '15', 1.1, '淮阴卷烟厂', '淮安'), // 箱数 22

  // ----------- 额外的数据杜撰补充 (非醇化) -----------
  // 再造烟叶补充
  createPoolRecord(37, '再造烟叶', ProductionTypeEnum.TobaccoTurnBox, '再造烟叶（省内）翻箱', 'JSZ03', '15', 150, '江苏中烟工业有限责任公司', '南京', PoolApplicationStatus.PendingPlan),
  createPoolRecord(38, '再造烟叶', ProductionTypeEnum.TobaccoAshSieving, '再造烟叶（省外）筛分', 'JSN08', '15', 80, '南通烟滤嘴有限责任公司', '南通', PoolApplicationStatus.PendingPlan),
  createPoolRecord(39, '再造烟叶', ProductionTypeEnum.TobaccoStemExtract, '再造烟叶提取液', '-', '-', 30, '江苏中烟工业有限责任公司', '徐州', PoolApplicationStatus.PendingPlan),
  createPoolRecord(40, '再造烟叶', ProductionTypeEnum.TobaccoRecipeSemi, '再造烟叶（省内）片基', 'JSY11', '15', 250, '淮阴卷烟厂', '淮安', PoolApplicationStatus.PendingPlan),

  // 再造梗丝补充
  createPoolRecord(41, '再造梗丝', ProductionTypeEnum.StemRecipeSemi, '再造梗丝（省外）片基', 'GS50', '15', 120, '安徽中烟工业有限责任公司', '蚌埠', PoolApplicationStatus.PendingPlan),
  createPoolRecord(42, '再造梗丝', ProductionTypeEnum.StemPreMix, '再造梗丝预混物', 'GS30', '15', 65, '江苏中烟工业有限责任公司', '南京', PoolApplicationStatus.PendingPlan),
  createPoolRecord(43, '再造梗丝', ProductionTypeEnum.StemPreMix, '再造梗丝预混物', 'GS01', '15', 40, '徐州卷烟厂', '徐州', PoolApplicationStatus.PendingPlan),
  createPoolRecord(44, '再造梗丝', ProductionTypeEnum.StemRecipeFinished, '再造梗丝（省内）', 'GS80', '15', 110, '江苏中烟工业有限责任公司', '苏州', PoolApplicationStatus.PendingPlan),

  // 香精香料补充
  createPoolRecord(45, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '料液', 'SZ0260L33', '20L/桶', 2.5, '深圳烟草工业有限责任公司', '深圳', PoolApplicationStatus.PendingPlan),
  createPoolRecord(46, '香精香料', ProductionTypeEnum.FlavorEntrusted, '表香', 'BA71505X', '20L/桶', 1.2, '云南中烟工业有限责任公司', '昆明', PoolApplicationStatus.PendingPlan),
  createExperimentalPoolRecord(47, '香精香料', ProductionTypeEnum.FlavorProvincialTrial, '香精香料（试验）料液', 'TEST-L01', '20L/桶', 0.5, '江苏中烟工业有限责任公司', '南京', PoolApplicationStatus.PendingPlan),
  createExperimentalPoolRecord(48, '香精香料', ProductionTypeEnum.FlavorIndependentTrial, '自有香料测试配方', 'SELF-X09', '20L/桶', 0.8, '江苏鑫源烟草薄片有限公司', '-', PoolApplicationStatus.PendingPlan),
  createPoolRecord(49, '香精香料', ProductionTypeEnum.FlavorEntrusted, '料液（受托）', 'NX0160L20', '20L/桶', 2.0, '南通烟滤嘴有限责任公司', '南通', PoolApplicationStatus.PendingPlan),
  createPoolRecord(50, '香精香料', ProductionTypeEnum.FlavorCentralizedMixing, '表香', 'NC0220X05', '20L/桶', 1.5, '广东中烟工业有限责任公司', '广州', PoolApplicationStatus.PendingPlan),
];

export const getPoolPage = async (params: any) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let list = [...mockProductionPoolData];
  
  if (params.status) {
    list = list.filter(item => item.status === params.status);
  }
  if (params.productType) {
    list = list.filter(item => item.productType === params.productType);
  }
  
  const total = list.length;
  const { pageNum = 1, pageSize = 10 } = params;
  list = list.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  
  return {
    list,
    total
  };
};
