import { ProductionTypeEnum, RestrictedProductionType } from './base-data';

export enum MonthlyPlanStatus {
  Draft = '草稿中',
  PendingConfirmation = '待确认',
  PendingImprovement = '待试验信息完善',
  PendingPublish = '待发布',
  Published = '已发布'
}

/**
 * 1. 月度产销计划基础信息
 */
export interface MonthlyProductionPlanBase {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 计划名称: 字符(100), 必填 */
  planName: string;
  
  /** 状态: 字符(20), 只读, 草稿中｜已发布 */
  status: MonthlyPlanStatus | string;
  
  /** 创建人: 字符(50), 只读 */
  creator: string;
  
  /** 创建时间: 时间（yyyy-mm-dd hh:mm:ss）, 只读 */
  createTime: string;
  
  /** 关联的计划表 */
  planList?: MonthlyProductionPlanTable[];
  
  /** 关联的编制明细数据 */
  details?: MonthlyProductionPlanDetail[];
}

/**
 * 2. 月度产销计划表
 */
export interface MonthlyProductionPlanTable {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 产品类型: 字符(50), 只读 */
  productType: string;
  
  /** 生产类型: 字符(20), 只读 关联：《生产类型》中的所有生产类型 约束：导出字段时不可见 */
  productionType?: string;
  
  /** 牌号: 字符(50), 只读 */
  brandGrade: string;
  
  /** 产量/吨: 数字(.00), 只读 */
  productionVolume: number;
  
  /** 报工产量/吨: 数字(.00), 只读 约束：查看、编制与导出时不可见，仅调整时可见 */
  reportedProductionVolume?: number;

  /** 备注: 字符(250), 选填 */
  remarks?: string;
}

/**
 * 3. 月度产销计划编制明细
 */
export interface MonthlyProductionPlanDetail {
  id: string; // 唯一标识
  
  /** 产品类型: 字符(50), 只读 (关联：计划池入池申请台账) */
  productType: string;
  
  /** 生产类型: 字符(20), 只读 (关联：计划池入池申请台账) */
  productionType: RestrictedProductionType | string;
  
  /** 产品名称: 字符(50), 只读 (关联：计划池入池申请台账) */
  productName: string;
  
  /** 产品编号: 字符(50), 只读 (关联：计划池入池申请台账) */
  productCode: string;
  
  /** 客户名称: 字符(50), 只读 (关联：计划池入池申请台账) */
  customerName: string;
  
  /** 牌号: 字符(50), 只读 (关联：计划池入池申请台账) */
  brandGrade: string;
  
  /** 规格: 字符(20), 只读 (关联：计划池入池申请台账) */
  specification: string;
  
  /** 需求量: 数字(.00), 只读 (关联：计划池入池申请台账) */
  requirementAmount: number;
  
  /** 初始需求量: 数字(.00), 只读 (关联：计划池入池申请台账) 约束：查看、编制与导出时不可见，仅调整时可见 */
  initialRequirementAmount?: number;
  
  /** 申请完工量: 数字(.00), 只读 (关联：计划池入池申请台账) 约束：查看、编制与导出时不可见，仅调整时可见 */
  appliedCompletionAmount?: number;
  
  /** 单位: 字符(10), 只读 (关联：计划池入池申请台账) */
  unit: string;
  
  /** 无税单价: 数字(.00), 只读 (关联：计划池入池申请台账) */
  unitPriceExclTax?: number;
  
  /** 含税单价: 数字(.00), 只读 (关联：计划池入池申请台账) */
  unitPriceInclTax?: number;
  
  /** 无税金额: 数字(.00), 只读 (关联：计划池入池申请台账) */
  amountExclTax?: number;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 (关联：计划池入池申请台账) */
  expectedCompletionDate?: string;
  
  /** 到货时间: 时间(yyyy-mm-dd), 选填 (关联：计划池入池申请台账) */
  deliveryDate?: string;
  
  /** 到货地点: 字符(100), 选填 (关联：计划池入池申请台账) */
  deliveryLocation?: string;
  
  /** 申请人: 只读 (关联：计划池入池申请台账) */
  applicantName?: string;
  
  /** 申请人部门: 只读 (关联：计划池入池申请台账) */
  applicantDepartment?: string;
  
  /** 
   * 分牌号: 字符(50), 只读 
   * 规则：自动生成，由牌号+客户组合成，非客户编号，需要另生成编号，
   * 牌号下第一个客户是01，第二个是02，以此类推递增生成编号并记录，
   * 后续客户复购时则沿用之前生成的编号。
   */
  subBrandGrade: string;
  
  /** 
   * 底层关联的入池申请台账 ID
   * 用于溯源获取台账的具体要求或动态同步状态
   */
  applicationLedgerId?: string;
}

/**
 * 4. 月度醇化计划
 */
export interface MonthlyAgeingPlan {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 计划名称: 字符(100), 必填 */
  planName: string;
  
  /** 状态: 字符(20), 只读, 草稿中｜已发布 */
  status: MonthlyPlanStatus | string;
  
  /** 创建人: 字符(50), 只读 */
  creator: string;
  
  /** 创建时间: 时间（yyyy-mm-dd hh:mm:ss）, 只读 */
  createTime: string;
  
  /** 关联的醇化计划表 */
  details?: MonthlyAgeingPlanTable[];
}

/**
 * 5. 月度醇化计划表
 */
export interface MonthlyAgeingPlanTable {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 牌号: 字符(20), 必填 */
  brandGrade: string;
  
  /** 年月份: 时间(mm), 必填 */
  yearMonth: string;
  
  /** 分牌号和等级: 字符(50), 必填 */
  subBrandAndGrade: string;
  
  /** 箱数: 数字(0.), 必填 */
  boxCount: number;
  
  /** 日期: 字符(50), 必填 */
  date: string;
  
  /** 码段计划号: 字符(50), 选填 */
  codeSegmentPlanNo?: string;
  
  /** 备注: 字符(100), 选填 */
  remarks?: string;
}

/**
 * 6. 试验信息完善进度
 */
export interface ExperimentalInformationImprovementProgress {
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;

  /** 产品类型: 字符(50), 只读 (关联：计划池入池申请台账) */
  productType: string;

  /** 
   * 生产类型: 字符(20), 只读 (有关联：计划池入池申请台账)
   * 有效值：香精香料省公司试验｜香精香料自主试验｜再造烟叶自主试验｜再造烟叶翻箱｜再造烟叶醇化｜再造烟叶烟灰原料筛分｜再造梗丝自主试验｜再造梗丝预混 
   */
  productionType: string;

  /** 产品名称: 字符(50), 只读 (关联：计划池入池申请台账) */
  productName: string;

  /** 产品编号: 字符(50), 只读 (关联：计划池入池申请台账) */
  productCode: string;

  /** 客户名称: 字符(50), 只读 (关联：计划池入池申请台账) */
  customerName: string;

  /** 牌号: 字符(50), 只读 (关联：计划池入池申请台账) */
  brandGrade: string;

  /** 完善需填报表单: 字符(50), 只读 (有效值：试验通知单｜工艺通知单) */
  formToFill: '试验通知单' | '工艺通知单' | string;

  /** 是否已填报: 布尔, 只读 (有效值：是｜否) */
  isFilled: boolean;

  /** 试验信息填报人: 字符(20), 只读 */
  reporter: string;

  /** 填报人所属部门: 字符(50), 只读 */
  reporterDepartment: string;

  /** 规格: 字符(20), 只读 (关联：计划池入池申请台账) */
  specification: string;

  /** 单位: 字符(10), 只读 (关联：计划池入池申请台账) */
  unit: string;

  /** 需求量: 数字（.00）, 只读 (关联：计划池入池申请台账) */
  requirementAmount: number;

  /** 期望完成时间: 时间（yyyy-mm-dd）, 选填 (关联：计划池入池申请台账) */
  expectedCompletionDate?: string;

  /** 到货时间: 时间（yyyy-mm-dd）, 选填 (关联：计划池入池申请台账) */
  deliveryDate?: string;

  /** 到货地点: 字符(100), 选填 (关联：计划池入池申请台账) */
  deliveryLocation?: string;

  /** 申请人: 字符(20), 只读 (关联：计划池入池申请台账) */
  applicantName: string;

  /** 申请人部门: 字符(50), 只读 (关联：计划池入池申请台账) */
  applicantDepartment: string;
}

/**
 * 7. 月度醇化计划 (基础信息)
 */
export interface MonthlyAgingPlan {
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  /** 计划名称: 字符(100), 必填 */
  planName: string;
  /** 状态: 字符(20), 只读 (草稿中｜已发布) */
  status: '草稿中' | '已发布';
  /** 创建人: 字符(50), 只读 */
  creator: string;
  /** 创建时间: 时间（yyyy-mm-dd hh:mm:ss）, 只读 */
  createTime: string;
}

/**
 * 8. 月度醇化计划表 (明细项)
 */
export interface MonthlyAgingPlanItem {
  id: string; // 唯一标识
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  /** 牌号: 字符(20), 只读 */
  brandName: string;
  /** 
   * 目前可用库存量: 数字(0.), 只读 
   * 约束：查看详情时不可见 
   * 规则：对应牌号在自制半成品库内非冻结状态的库存总数
   */
  availableInventory?: number;
  /** 年月份: 时间（mm）, 只读 规则：自动获取当前月份 */
  month: string;
  /** 分牌号和等级: 字符(50), 只读 */
  subBrandGrade: string;
  /** 箱数: 数字(.00), 只读 约束：需要对相同牌号的箱数求和，总和不得超过目前可用库存量 */
  boxCount: number;
  /** 申请完工量: 数字(0.), 只读 约束：详情查看与编制时不可见 规则：需要转换单位为箱 */
  appliedCompletionAmount?: number;
  /** 日期: 字符(50), 必填 */
  date: string;
  /** 码段计划号: 字符(50), 选填 */
  sectionPlanNumber?: string;
  /** 备注: 字符(100), 选填 */
  remarks?: string;
}
