/**
 * 计划管理模块实体类定义
 * 预留前端接口对接结构，方便后续 Vue 迁移与后端 API 对接
 */

/**
 * 产品基础信息实体
 */
export interface ProductInfo {
  /** 唯一标识 ID */
  id: string;
  /** 
   * 产品类型 
   * 属性: 只读
   * 有效值: 再造烟叶、再造梗丝、香精香料
   */
  productType: ProductType | string;
  /**
   * 来源
   * 属性: 只读
   * 有效值: 省内、省外
   */
  sourceRegion: RegionType | string;
  /** 
   * 客户名称 
   * 属性: 只读
   */
  customerName: string;
  /** 
   * 产品名称 
   * 属性: 只读
   */
  productName: string;
  /** 
   * 产品编号 
   * 属性: 只读
   */
  productCode: string;
  /** 
   * 牌号 
   * 属性: 只读
   */
  brandGrade: string;
  /** 
   * 产品规格 
   */
  specification?: string;
  /**
   * 计量单位
   */
  unit?: string;
  /**
   * 无税单价
   */
  unitPriceExclTax?: number;
  /**
   * 含税单价
   */
  unitPriceInclTax?: number;
}

/**
 * 产品类型枚举
 */
export enum ProductType {
  ReconstitutedTobacco = '再造烟叶',
  ReconstitutedStem = '再造梗丝',
  FlavorAndFragrance = '香精香料'
}

/**
 * 区域类型枚举 (用于区分省内、省外，支撑统计逻辑)
 */
export enum RegionType {
  InProvince = '省内',
  OutProvince = '省外',
  None = '不区分' // 例如香精香料可能不区分省内外
}

/**
 * 计划状态枚举
 */
export enum PlanStatus {
  Draft = '草稿中',
  Updating = '更新中',
  PendingReview = '待审核',
  PendingConfirm = '待确认',
  Published = '已发布'
}

/**
 * 年度产销计划 - 详情数据字段表实体
 */
export interface AnnualPlanDetail {
  /** 唯一标识 ID */
  id?: string;
  
  /** 关联的产品ID */
  productId?: string;
  
  /** 关联的产品实体 */
  product?: ProductInfo;
  
  /** 
   * 序号 
   * 属性: 只读
   * 规则: 共用序号，再造烟叶与再造梗丝，按产品类型以及省内外区分进行序号的递增，香精香料则只按产品类型进行序号的递增
   */
  sequenceNumber: number;
  
  /** 
   * 产品类型 
   * 属性: 只读
   * 规则: 选择产品后自动带出
   */
  productType: ProductType | string;
  
  /** 
   * 客户名称 
   * 属性: 只读
   * 规则: 选择产品后自动带出
   */
  customerName: string;
  
  /** 
   * 产品名称 
   * 属性: 只读
   * 规则: 选择产品后自动带出
   */
  productName: string;
  
  /** 
   * 产品编号 
   * 属性: 只读
   * 规则: 选择产品后自动带出
   */
  productCode: string;
  
  /** 
   * 牌号 
   * 属性: 只读
   * 规则: 选择产品后自动带出
   */
  brandGrade: string;
  
  /** 
   * 预计销售量 
   * 属性: 必填
   * 类型: 数字（.00）
   */
  estimatedSalesVolume: number;
  
  /** 
   * 销售单价元/公斤(不含税） 
   * 属性: 必填
   * 规则: 默认值：通过财务系统获取物料单价
   */
  unitPriceExclTax: number;
  
  /** 
   * 期初库存 
   * 属性: 只读
   * 规则: 同步去年年度库存总数获取；初次编制时，不需要此字段，值为0
   * 类型: 数字（.00）
   */
  initialInventory: number;
  
  /** 
   * 预计生产量 
   * 属性: 必填
   * 规则: 默认值：预计销售量-期初库存 + 备产数量
   * 类型: 数字（.00）
   */
  estimatedProductionVolume: number;
  
  /** 
   * 备产数量 
   * 属性: 必填
   * 规则: 初次编制时，不需要此字段，值为0
   * 类型: 数字（.00）
   */
  reserveQuantity: number;

  /** 
   * 辅助字段：区域类型 (省内/省外)
   * 用于支撑前端或后端的分类统计逻辑
   */
  regionType?: RegionType | string;
}

/**
 * 年度产销计划 - 统计数据字段表实体
 */
export interface AnnualPlanStatistics {
  /** 
   * 省内统计-预计销售量 
   * 属性: 只读
   * 规则: 关联产品类型（再造烟叶、再造梗丝），自动对对应类型省内预计销售量求和
   */
  inProvinceEstimatedSales: number;
  
  /** 
   * 省内统计-预计生产量 
   * 属性: 只读
   * 规则: 关联产品类型（再造烟叶、再造梗丝），自动对对应类型省内预计生产量求和
   */
  inProvinceEstimatedProduction: number;
  
  /** 
   * 省外统计-预计销售量 
   * 属性: 只读
   * 规则: 关联产品类型（再造烟叶、再造梗丝），自动对对应类型省外预计销售量求和
   */
  outProvinceEstimatedSales: number;
  
  /** 
   * 省外统计-预计生产量 
   * 属性: 只读
   * 规则: 关联产品类型（再造烟叶、再造梗丝），自动对对应类型省外预计生产量求和
   */
  outProvinceEstimatedProduction: number;
  
  /** 
   * 合计-预计销售量 
   * 属性: 只读
   * 规则: 关联产品类型（再造烟叶、再造梗丝、再造原料（再造烟叶+再造梗丝）、香精香料），自动对对应类型预计销售量求和
   */
  totalEstimatedSales: number;
  
  /** 
   * 合计-预计生产量 
   * 属性: 只读
   * 规则: 关联产品类型（再造烟叶、再造梗丝、再造原料（再造烟叶+再造梗丝）、香精香料），自动对对应类型预计生产量求和
   */
  totalEstimatedProduction: number;
}

/**
 * 年度产销计划 - 主聚合实体 (用于列表展示与详情包裹)
 */
export interface AnnualPlan {
  /** 计划主键 ID */
  id: string;
  /** 计划年份 (例如: '2026') */
  year: string;
  /** 计划版本号 (例如: 'V1.0') */
  version: string;
  /** 计划状态 */
  status: PlanStatus;
  
  /** 统计数据 */
  statistics: AnnualPlanStatistics;
  
  /** 详情数据列表 */
  details: AnnualPlanDetail[];
  
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 创建人 */
  createdBy?: string;
}

/**
 * 年度产销计划台账实体
 */
export interface AnnualPlanLedger {
  /** 唯一标识 ID */
  id: string;
  /** 
   * 计划名称 
   * 属性: 只读
   * 规则: 自动命名：鑫源公司+所属年份+年度产销计划
   */
  planName: string;
  /** 
   * 状态 
   * 属性: 只读
   * 规则: 草稿中｜更新中｜待审核｜待确认｜已发布
   */
  status: PlanStatus | string;
  /** 
   * 所属年份 
   * 属性: 只读
   * 格式: yyyy年
   */
  year: string;
  /** 
   * 当前版本号 
   * 属性: 只读
   */
  currentVersion: string;
  /** 
   * 创建人 
   * 属性: 只读
   */
  createdBy: string;
  /** 
   * 创建时间 
   * 属性: 只读
   * 格式: yyyy-mm-dd hh:mm
   */
  createdAt: string;
  /** 
   * 最后更新时间 
   * 属性: 只读
   * 规则: 当前版本号流程完成时间
   * 格式: yyyy-mm-dd hh:mm
   */
  lastUpdatedAt: string;
}

/**
 * 原料库存对比实体
 */
export interface RawMaterialInventoryComparison {
  /** 唯一标识 ID */
  id: string;
  /** 
   * 序号 
   * 属性: 只读
   */
  sequenceNumber: number;
  /** 
   * 物料名称 
   * 属性: 只读
   * 长度: 50
   */
  materialName: string;
  /** 
   * 总计投料量（kg） 
   * 属性: 只读
   */
  totalInputQuantity: number;
  /** 
   * 当前库存量（kg） 
   * 属性: 只读
   */
  currentInventory: number;
  /** 
   * 差值 
   * 属性: 只读
   */
  difference: number;
}

/**
 * 审批过程信息实体
 */
export interface ApprovalProcessInfo {
  id: string;
  nodeName: string;
  approver: string;
  nodeStartTime?: string; // 节点到达/创建时间 (对应截图顶部的时间)
  approvalTime: string; // 实际审批时间 (对应截图中盒子内的时间)
  approvalResult: '同意' | '驳回' | '正在审批' | '发起申请' | string;
  comments?: string;
}

/**
 * 版本历史信息实体
 */
export interface VersionHistoryInfo {
  id: string;
  versionNo: string;
  createdAt: string;
  createdBy: string;
  isInitial?: boolean;
  isCurrent?: boolean;
  isDraft?: boolean;
}
