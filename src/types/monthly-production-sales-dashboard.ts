export interface MonthlyProductionSalesDashboard {
  /**
   * 序号
   * 数字(0.) 只读
   */
  serialNumber: number;

  /**
   * 状态
   * 字符(20) 只读
   * 规则：在执行｜待执行｜已执行
   */
  status: '在执行' | '待执行' | '已执行' | string;

  /**
   * 产品类型
   * 字符(50) 只读
   */
  productType: string;

  /**
   * 牌号
   * 字符(50) 只读
   */
  brand: string;

  /**
   * 需求量/吨 (牌号)
   * 数字（.00） 只读
   */
  brandRequirement: number;

  /**
   * 实际进度/吨 (牌号)
   * 数字（.00） 只读
   */
  brandActualProgress: number;

  /**
   * 理论进度/吨 (牌号)
   * 数字（.00） 只读
   */
  brandTheoreticalProgress: number;

  /**
   * 分牌号
   * 字符(50) 只读
   */
  subBrand: string;

  /**
   * 需求量/吨 (分牌号)
   * 数字（.00） 只读
   */
  subBrandRequirement: number;

  /**
   * 实际进度/吨 (分牌号)
   * 数字（.00） 只读
   */
  subBrandActualProgress: number;
}
