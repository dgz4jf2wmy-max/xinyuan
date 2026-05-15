export interface LabelingWarehousingRecord {
  /**
   * 序号
   * 类型: 数字(0.)
   * 属性: 只读
   */
  id: number;

  /**
   * 贴标任务编号
   * 类型: 字符(50)
   * 属性: 只读
   * 详细规则与说明: 关联：贴标任务-贴标任务编号
   */
  taskNo: string;

  /**
   * 入库单号
   * 类型: 字符(50)
   * 属性: 只读
   * 详细规则与说明: 关联：仓储管理-成品入库-入库单号
   */
  warehousingNo: string;

  /**
   * 申请人
   * 类型: 字符(20)
   * 属性: 只读
   * 详细规则与说明: 仓储管理-成品入库-申请人
   */
  applicant: string;

  /**
   * 申请时间
   * 类型: 时间(yyyy-mm-dd hh:mm:ss)
   * 属性: 只读
   * 详细规则与说明: 仓储管理-成品入库-申请时间
   */
  applyTime: string;
}
