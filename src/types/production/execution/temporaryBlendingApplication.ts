export interface TemporaryBlendingApplication {
  /**
   * 申请编号
   * 长度: 50
   * 属性: 只读
   * 规则: LSHC-[发起日期]-[流水号]
   */
  applicationNo: string;

  /**
   * 状态
   * 长度: 20
   * 属性: 只读
   * 规则: 草稿中｜待审核｜待确认｜已同意｜已拒绝
   */
  status: '草稿中' | '待审核' | '待确认' | '已同意' | '已拒绝';

  /**
   * 月度生产任务编号
   * 长度: 20
   * 属性: 必填
   * 规则: 关联月度生产任务-基础信息-月度生产任务编号
   */
  monthlyTaskNo: string;

  /**
   * 产品名称
   * 长度: 50
   * 属性: 只读
   * 规则: 依据月度生产任务编号自动查询
   */
  productName: string;

  /**
   * 产品编号
   * 长度: 50
   * 属性: 只读
   * 规则: 依据月度生产任务编号自动查询
   */
  productCode: string;

  /**
   * 牌号
   * 长度: 50
   * 属性: 只读
   * 规则: 依据月度生产任务编号自动查询
   */
  brand: string;

  /**
   * 生产类型
   * 长度: 50
   * 属性: 只读
   * 规则: 依据月度生产任务编号自动查询
   */
  productionType: string;

  /**
   * 回掺数量
   * 属性: 必填
   * 规则: （.00）
   */
  blendingQuantity: number;

  /**
   * 回掺比例
   * 属性: 必填
   * 规则: （.00）
   */
  blendingRatio: number;

  /**
   * 申请人
   * 长度: 10
   * 属性: 只读
   */
  applicant: string;

  /**
   * 创建时间
   * 属性: 只读
   * 规则: 时间（yyyy-mm-dd hh:mm）
   */
  createdAt: string;
}
