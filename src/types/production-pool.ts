/**
 * 生产计划池与入池申请相关实体类
 */

// --- Enums & Value Types ---

export enum PoolApplicationStatus {
  PendingPlan = '待计划',
  Cancelled = '已取消',
  Planned = '已计划',
  Scheduled = '已排产',
  Completed = '已完成'
}

import { ProductionTypeEnum, RestrictedProductionType } from './base-data';

// 兼容旧名字别名，但底层全替换为基础大宽表枚举
export type ProductionType = ProductionTypeEnum | string;


// --- Entity Classes / Interfaces ---

/**
 * 1. 入池申请需求量
 * 用于记录生产计划池入池申请及试验通知单下，各个版本的需求量
 */
export interface PoolApplicationRequirement {
  id: string; // 唯一标识
  
  /** 
   * 序号: 数字(0.), 只读 
   */
  sequenceNumber: number;

  /** 
   * 版本号 
   * 类型: 字符(20), 属性: 只读
   * 规则：只显示≧当前版本的版本 
   */
  versionNo: string;
  
  /** 
   * 需求量 
   * 类型: 数字(.00), 属性: 必填 
   */
  requirementAmount: number;
  
  /** 
   * 单位
   * 类型: 字符(20), 属性: 只读
   * 吨｜公斤
   */
  unit: '吨' | '公斤' | string;
}


/**
 * 2. 生产计划池入池申请
 */
export interface ProductionPlanPoolApplication {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 
   * 产品类型: 字符(50), 只读 
   * 有效值：再造烟叶、再造梗丝、香精香料
   */
  productType: string;
  
  /** 
   * 生产类型: 字符(20), 必填 
   * 关联：《生产类型》
   * 有效值：香精香料受托加工｜香精香料集中调配｜再造烟叶配方生产（成品）｜再造烟叶配方生产（自制半成品）｜再造烟叶醇化｜再造梗丝配方生产（成品）｜再造梗丝配方生产（自制半成品）｜再造梗丝醇化
   */
  productionType: RestrictedProductionType | string;
  
  /** 产品名称: 字符(50), 只读，规则：选择产品后自动带出 */
  productName: string;
  
  /** 产品编号: 字符(50), 只读，规则：选择产品后自动带出 */
  productCode: string;
  
  /** 客户名称: 字符(50), 必填，关联：客户信息 */
  customerName: string;
  
  /** 牌号: 字符(50), 只读，规则：选择产品后自动带出 */
  brandGrade: string;
  
  /** 规格: 字符(20), 只读，规则：选择产品后自动带出 */
  specification: string;
  
  /** 单位: 字符(10), 只读, 吨 */
  unit: string;
  
  /** 
   * 关联的入池申请需求量明细
   */
  requirements: PoolApplicationRequirement[];
  
  /** 
   * 需求量: 数字(.00), 必填
   * 规则：需要对【入池申请需求量】各个版本的需求量转换单位为吨后进行求和，并显示
   */
  totalRequirementAmount: number;
  
  /** 无税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceExclTax: number;
  
  /** 含税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceInclTax: number;
  
  /** 无税金额: 数字(.00), 只读，关联：拉取财税系统内的金额 */
  amountExclTax: number;
  
  /** 到货时间: 时间(yyyy-mm-dd), 选填 */
  deliveryDate?: string;
  
  /** 到货地点: 字符(100), 选填 */
  deliveryLocation?: string;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;

  /** 
   * 申请人: 只读 
   * (注：指令给的类型为"数字(.00)"，正常应为字符串，此处兼容命名)
   */
  applicantName: string;
  
  /** 
   * 申请人部门: 只读 
   * (注：指令给的类型为"数字(.00)"，正常应为字符串，此处兼容命名)
   */
  applicantDepartment: string;
}


/**
 * 3. 试验通知单
 */
export interface TrialNotice {
  id: string; // 唯一标识
  
  /** 试验目的: 字符(500), 只读 */
  trialPurpose: string;
  
  /** 试验时间: 字符(500), 只读 */
  trialTime: string;
  
  /** 试验内容: 字符(500), 只读 */
  trialContent: string;
  
  /** 技术要求: 字符(500), 只读 */
  technicalRequirements: string;
  
  /** 
   * 关联的入池申请需求量明细
   */
  requirements: PoolApplicationRequirement[];

  /** 
   * 需求量: 数字(.00), 只读
   * 规则：需要对【入池申请需求量】各个版本的需求量求和，并显示
   */
  totalRequirementAmount: number;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;
}


/**
 * 4. 生产计划池
 */
export interface ProductionPlanPool {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 状态: 字符(10), 只读，待计划｜已取消｜已计划｜已排产｜已完成 */
  status: PoolApplicationStatus | string;
  
  /** 
   * 产品类型: 字符(50), 只读 
   * 再造烟叶、再造梗丝、香精香料
   */
  productType: string;
  
  /** 
   * 生产类型: 字符(20), 只读 
   * 关联：《生产类型》中的所有生产类型
   */
  productionType: ProductionType;
  
  /** 产品名称: 字符(50), 只读，规则：通过牌号关联显示 */
  productName: string;
  
  /** 产品编号: 字符(50), 只读，规则：通过牌号关联显示 */
  productCode: string;
  
  /** 客户名称: 字符(50), 只读 */
  customerName: string;
  
  /** 牌号: 字符(50), 只读 */
  brandGrade: string;
  
  /** 规格: 字符(20), 只读 */
  specification: string;
  
  /** 单位: 字符(10), 只读 */
  unit: string;
  
  /** 
   * 关联的入池申请需求量明细
   */
  requirements: PoolApplicationRequirement[];
  
  /** 
   * 需求量: 数字(.00), 只读
   * 规则：需要对【入池申请需求量】各个版本的需求量求和，并显示
   */
  totalRequirementAmount: number;
  
  /** 无税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceExclTax: number;
  
  /** 含税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceInclTax: number;
  
  /** 无税金额: 数字(.00), 只读，关联：拉取财税系统内的金额 */
  amountExclTax: number;
  
  /** 到货时间: 时间(yyyy-mm-dd), 选填 */
  deliveryDate?: string;
  
  /** 到货地点: 字符(100), 选填 */
  deliveryLocation?: string;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;

  /** 申请人: 字符(50), 选填 */
  applicantName?: string;
  
  /** 申请人部门: 字符(50), 选填 */
  applicantDepartment?: string;
}

/**
 * 5. 计划池入池申请台账
 * 该实体类专门用于【计划池入池申请】页面
 */
export interface PlanPoolApplicationLedger {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 状态: 字符(10), 只读，待计划｜已取消 */
  status: PoolApplicationStatus | string;
  
  /** 
   * 产品类型: 字符(50), 只读 
   * 再造烟叶、再造梗丝、香精香料
   */
  productType: string;
  
  /** 
   * 生产类型: 字符(20), 只读
   * 关联：《生产类型》中的所有生产类型
   */
  productionType: ProductionType | string;
  
  /** 产品名称: 字符(50), 只读，规则：通过牌号关联显示 */
  productName: string;
  
  /** 产品编号: 字符(50), 只读，规则：通过牌号关联显示 */
  productCode: string;
  
  /** 客户名称: 字符(50), 只读 */
  customerName: string;
  
  /** 牌号: 字符(50), 只读 */
  brandGrade: string;
  
  /** 规格: 字符(20), 只读 */
  specification: string;
  
  /** 单位: 字符(10), 只读 */
  unit: string;
  
  /** 
   * 关联：需要关联【入池申请需求量】
   */
  requirements: PoolApplicationRequirement[];
  
  /** 
   * 需求量: 数字(.00), 只读
   * 规则：需要对【入池申请需求量】各个版本的需求量求和，并显示
   */
  totalRequirementAmount: number;
  
  /** 无税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceExclTax: number;
  
  /** 含税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceInclTax: number;
  
  /** 无税金额: 数字(.00), 只读，关联：拉取财税系统内的金额 */
  amountExclTax: number;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;
  
  /** 到货时间: 时间(yyyy-mm-dd), 选填 */
  deliveryDate?: string;
  
  /** 到货地点: 字符(100), 选填 */
  deliveryLocation?: string;

  /** 申请人: 字符(50), 选填 (由于月度产销明细要求关联此类，此处恢复该字段定义) */
  applicantName?: string;
  
  /** 申请人部门: 字符(50), 选填 */
  applicantDepartment?: string;
}
