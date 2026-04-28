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
 * 2. 计划池入池申请-详细信息（采购订单-详细信息）
 */
export interface PlanPoolPurchaseOrderDetail {
  id: string; // 唯一标识
  
  /** 产品类型: 字符(50), 只读, 规则：选择产品后自动带出 */
  productType: string;
  
  /** 采购订单: 字符(50), 只读, 关联：ncc销售订单号 */
  purchaseOrder: string;
  
  /** 
   * 生产类型: 字符(20), 必填 
   * 关联：《生产类型》
   * 有效值：香精香料受托加工｜香精香料集中调配｜再造烟叶配方生产（成品）｜再造烟叶醇化｜再造梗丝配方生产（成品）
   */
  productionType: RestrictedProductionType | string;
  
  /** 产品名称: 字符(50), 只读，规则：选择产品后自动带出 */
  productName: string;
  
  /** 产品编号: 字符(50), 只读，规则：选择产品后自动带出 */
  productCode: string;
  
  /** 客户名称: 字符(50), 必填，关联：财务客户信息 */
  customerName: string;
  
  /** 牌号: 字符(50), 只读，规则：选择产品后自动带出 */
  brandGrade: string;
  
  /** 规格: 字符(20), 只读，规则：选择产品后自动带出 */
  specification: string;
  
  /** 
   * 需求量: 数字(.00), 必填
   * 规则：需要对【入池申请需求量】各个版本的需求量转换单位为吨后进行求和，并显示
   */
  totalRequirementAmount: number;

  /** 单位: 字符(10), 只读, 吨 */
  unit: string;
  
  /** 
   * 关联的入池申请需求量明细
   */
  requirements: PoolApplicationRequirement[];
  
  /** 无税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceExclTax: number;
  
  /** 含税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceInclTax: number;
  
  /** 无税金额: 数字(.00), 只读，规则：无税单价*需求量 */
  amountExclTax: number;

  /** 税率: 数字(.00), 只读，关联：拉取财税系统内的税率 */
  taxRate: number;
  
  /** 税额: 数字(.00), 只读，规则：自动计划税额 */
  taxAmount: number;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;

  /** 计划发货日期: 时间(yyyy-mm-dd), 必填 */
  plannedShippingDate: string;
  
  /** 到货时间: 时间(yyyy-mm-dd), 必填, 关联：对接财税系统要求收货时间 */
  deliveryDate: string;
  
  /** 到货地点: 字符(100), 选填 */
  deliveryLocation?: string;
  
  /** 
   * 申请人: 数字(.00), 只读 
   * (注：指令给的类型为"数字(.00)"，正常应为字符串，此处兼容命名)
   */
  applicantName: string | number;
  
  /** 
   * 申请人部门: 数字(.00), 只读 
   * (注：指令给的类型为"数字(.00)"，正常应为字符串，此处兼容命名)
   */
  applicantDepartment: string | number;
}

// 兼容旧版本使用
export type ProductionPlanPoolApplication = PlanPoolPurchaseOrderDetail;

/**
 * 2.1 计划池入池申请-基础信息（采购订单-基础信息）
 */
export interface PlanPoolPurchaseOrderBase {
  id: string; // 唯一标识
  
  /** 订单类型: 字符(50), 必填, 普通｜紧急 */
  orderType: string;
  
  /** 订单日期: 时间(yyyy-mm-dd), 必填 */
  orderDate: string;
  
  /** 客户: 字符(50), 必填, 关联客户台账 */
  customer: string;
  
  /** 业务员: 字符(20), 只读, 当前用户 */
  salesperson: string;
  
  /** 部门: 字符(50), 只读, 当前用户所属部门 */
  department: string;
  
  /** 币种: 字符(20), 只读, 关联财税系统币种 */
  currency: string;
  
  /** 总数量: 数字(.00), 只读, 计划池入池申请-需求量总和 */
  totalQuantity: number;
  
  /** 总结税合计: 数字(.00), 只读, 计划池入池申请-含税单价总和 */
  totalAmountInclTax: number;
  
  /** 备注: 字符(500), 选填 */
  remarks?: string;
  
  /** 关联的详细信息列表 */
  details?: PlanPoolPurchaseOrderDetail[];
}

/**
 * 2.2 计划池入池申请-非采购订单需求
 */
export interface PlanPoolNonPurchaseOrder {
  id: string; // 唯一标识
  
  /** 产品类型: 字符(50), 只读, 规则：选择产品后自动带出 */
  productType: string;
  
  /** 申请类型: 字符(20), 必填, 普通｜紧急 */
  applicationType: string;
  
  /** 
   * 生产类型: 字符(20), 必填 
   * 关联：《生产类型》
   * 有效值：香精香料受托加工｜香精香料集中调配｜再造烟叶配方生产（成品）｜再造烟叶配方生产（自制半成品）｜再造烟叶醇化｜再造梗丝配方生产（成品）｜再造梗丝配方生产（自制半成品）｜再造梗丝醇化
   */
  productionType: string;
  
  /** 产品名称: 字符(50), 只读，规则：选择产品后自动带出 */
  productName: string;
  
  /** 产品编号: 字符(50), 只读，规则：选择产品后自动带出 */
  productCode: string;
  
  /** 客户名称: 字符(50), 必填，关联：财务客户信息 */
  customerName: string;
  
  /** 牌号: 字符(50), 只读，规则：选择产品后自动带出 */
  brandGrade: string;
  
  /** 规格: 字符(20), 只读，规则：选择产品后自动带出 */
  specification: string;
  
  /** 
   * 需求量: 数字(.00), 必填
   * 规则：需要对【入池申请需求量】各个版本的需求量转换单位为吨后进行求和，并显示
   */
  totalRequirementAmount: number;

  /** 单位: 字符(10), 只读, 吨 */
  unit: string;
  
  /** 
   * 关联的入池申请需求量明细
   */
  requirements: PoolApplicationRequirement[];
  
  /** 无税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceExclTax: number;
  
  /** 含税单价: 数字(.00), 只读，关联：拉取财税系统内的单价 */
  unitPriceInclTax: number;
  
  /** 无税金额: 数字(.00), 只读，规则：无税单价*需求量 */
  amountExclTax: number;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;
  
  /** 到货时间: 时间(yyyy-mm-dd), 选填 */
  deliveryDate?: string;
  
  /** 到货地点: 字符(100), 选填 */
  deliveryLocation?: string;
  
  /** 申请人: 数字(.00), 只读 */
  applicantName: string | number;
  
  /** 申请人部门: 数字(.00), 只读 */
  applicantDepartment: string | number;
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
  
  /** 
   * 单据编号: 字符(50), 只读
   * 规则：“分类前缀+生成日期+流水号”的结构。
   * 分类前缀：采购订单类：DD 研发试验类：SY 常规调度类：CG
   * 生成日期：YYYY-MM-DD
   * 流水号：3位（例如001）
   */
  documentNo: string;
  
  /** 状态: 字符(10), 只读，待计划｜已取消 */
  status: PoolApplicationStatus | string;
  
  /** 申请类型: 字符(20), 必填, 普通｜紧急 */
  applicationType: string;
  
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
   * 关联的入池申请需求量明细
   */
  requirements: PoolApplicationRequirement[];
  
  /** 
   * 需求量: 数字(.00), 只读
   * 规则：需要对【入池申请需求量】各个版本的需求量求和，并显示
   */
  totalRequirementAmount: number;
  
  /** 初始需求量: 数字(.00), 只读, 需要记录初次申请时的需求量 */
  initialRequirementAmount: number;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;
  
  /** 到货时间: 时间(yyyy-mm-dd), 选填 */
  deliveryDate?: string;
  
  /** 到货地点: 字符(100), 选填 */
  deliveryLocation?: string;

  /** 采购订单: 字符(50), 只读, 关联：ncc销售订单号 */
  purchaseOrder?: string;

  /** 申请人: 字符(50), 只读 */
  applicantName?: string;
  
  /** 申请人部门: 字符(50), 只读 */
  applicantDepartment?: string;
  
  // Note: Optional transient UI fields removed
  isChanged?: boolean;
}

/**
 * 5. 计划池入池申请台账
 * 该实体类专门用于【计划池入池申请】页面
 */
export interface PlanPoolApplicationLedger {
  id: string; // 唯一标识
  
  /** 序号: 数字(0.), 只读 */
  sequenceNumber: number;
  
  /** 
   * 单据编号: 字符(50), 只读
   * 规则：“分类前缀+生成日期+流水号”的结构。
   * 分类前缀：采购订单类：DD 研发试验类：SY 常规调度类：CG
   * 生成日期：YYYY-MM-DD
   * 流水号：3位（例如001）
   */
  documentNo: string;
  
  /** 状态: 字符(10), 只读，待计划｜已取消｜已计划｜已排产｜已完成 */
  status: PoolApplicationStatus | string;
  
  /** 申请类型: 字符(20), 必填, 普通｜紧急 */
  applicationType: string;
  
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
  
  /** 初始需求量: 数字(.00), 只读, 需要记录初次申请时的需求量 */
  initialRequirementAmount: number;
  
  /** 申请完工量: 数字(.00), 只读, 规则：需要基于包装规格进行转化，还原产量 */
  applyCompletionAmount?: number;
  
  /** 期望完成时间: 时间(yyyy-mm-dd), 选填 */
  expectedCompletionDate?: string;
  
  /** 到货时间: 时间(yyyy-mm-dd), 选填 */
  deliveryDate?: string;
  
  /** 到货地点: 字符(100), 选填 */
  deliveryLocation?: string;

  /** 采购订单: 字符(50), 只读, 关联：ncc销售订单号 */
  purchaseOrder?: string;
  
  // Note: Optional transient UI fields removed
  isChanged?: boolean;
}
