export interface MonthlyTaskBaseInfo {
  id: number;
  taskNo: string;
  taskName: string;
  approvalStatus: string;
  executionStatus: string;
  month: number;
  currentVersion: string;
  creator: string;
  createTime: string;
  lastUpdateTime: string;
}

export interface MonthlyProductionArrangement {
  id: number;
  productionLine: string;
  productType: string;
  productionOrder: number;
  taskNo: string;
  productName: string;
  productCode: string;
  brand: string;
  productionVolume: number;
  completionDate: string;
  blendingQuantity: number;
  blendingRatio: number;
}

export interface OtherProductionArrangement {
  /**
   * 序号
   * 类型: 数字(0.)
   * 属性: 只读
   */
  id: number;
  
  /**
   * 生产任务编号
   * 类型: 字符(50)
   * 属性: 只读
   * 详细规则与说明: 导出报表时不可见。
   * [业务标识]-[产线标识]-所属月份（基础信息）-自增
   * 业务标识：SCRW（生产任务）作为固定前缀。
   * 产线标识：采用 ZY（再造烟叶）、GS（再造梗丝）、XJ（香精香料）进行标识。
   */
  taskNo: string;
  
  /**
   * 产品类型
   * 类型: 字符(20)
   * 属性: 只读
   * 详细规则与说明: 有效值：
   * 再造原料：再造烟叶｜再造梗丝
   * 香精香料：香精香料
   * 关联：月度产销计划产品类型
   */
  productType: string;
  
  /**
   * 产品名称
   * 类型: 字符(50)
   * 属性: 只读
   * 详细规则与说明: 关联：月度产销计划产品名称。导出报表时不可见。
   */
  productName: string;
  
  /**
   * 产品编号
   * 类型: 字符(50)
   * 属性: 只读
   * 详细规则与说明: 关联：月度产销计划产品编号。导出报表时不可见。
   */
  productCode: string;
  
  /**
   * 牌号
   * 类型: 字符(20)
   * 属性: 只读
   * 详细规则与说明: 关联：月度醇化计划牌号，月度产销计划牌号。
   */
  brand: string;
  
  /**
   * 生产类型
   * 类型: 字符(50)
   * 属性: 只读
   * 详细规则与说明: 
   * 再造烟叶：翻箱｜醇化｜省内梗丝回填液｜烟灰原料筛分
   * 再造梗丝：醇化｜预混
   */
  productionType: string;
  
  /**
   * 产量/投料量
   * 类型: 数字（.00）
   * 属性: 只读
   * 详细规则与说明: 默认值：月度产销计划内需求量。
   * 单位：需注明单位为吨
   * 省内梗丝回填液：月度生产安排中，配方生产（成品）与配方生产（自制半成品）的产量求和后除经验系数（人工维护）。
   * 醇化：根据分牌号的需求量自动生成醇化任务，醇化需注明单位为箱。
   */
  productionVolume: number;
  
  /**
   * 完成日期
   * 类型: 时间（yyyy-mm-dd）
   * 属性: 必填
   * 详细规则与说明: 导出报表时不可见。
   */
  completionDate: string;
}

export interface MonthlyProductionTask {
  baseInfo: MonthlyTaskBaseInfo;
  productionArrangements: MonthlyProductionArrangement[];
  otherArrangements: OtherProductionArrangement[];
}

export interface MonthlyFlavorProductionDetail {
  id?: number;
  productType: string;
  productionType: string;
  productName: string;
  productCode: string;
  customerName: string;
  brand: string;
  specification: string;
  requirementAmount: number;
  initialRequirement: number;
  appliedCompletionAmount: number;
  unit: string;
  expectedCompletionDate?: string;
  arrivalTime?: string;
  arrivalLocation?: string;
  applicantId: number;
  applicantDepartmentId: number;
  subBrand: string;
}
