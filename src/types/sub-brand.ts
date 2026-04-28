export interface SubBrandEntry {
  id: string;
  /**
   * 分牌号
   * 类型：字符(50)
   * 属性：必填
   * 规则：由牌号+客户组合成，牌号下第一个客户是01，第二个是02，以此类推。复购时沿用。
   */
  subBrandCode: string;
  
  /**
   * 产品名称
   * 类型：字符(50)
   * 属性：只读
   * 关联：产品信息库
   */
  productName: string;
  
  /**
   * 产品编号
   * 类型：字符(50)
   * 属性：只读
   * 关联：产品信息库
   */
  productCode: string;
  
  /**
   * 客户名称
   * 类型：字符(50)
   * 属性：只读
   * 关联：客户台账
   */
  customerName: string;
  
  /**
   * 牌号
   * 类型：字符(50)
   * 属性：只读
   * 关联：产品信息库
   */
  brand: string;
}

