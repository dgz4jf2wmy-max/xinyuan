export interface AgingTask {
  id: number;
  taskNo: string; // 醇化任务编号
  brandCode: string; // 牌号
  yearMonth: string; // 年月份
  subBrandAndGrade: string; // 分牌号和等级
  currentProgress?: number; // 当前进度
  boxesCount: number; // 箱数
  date: string; // 日期
  codeSegmentPlanNo: string; // 码段计划号
  remark: string; // 备注
}

export interface AgingReport {
  id: number;
  taskNo: string; // 醇化任务编号
  reportNo: string; // 醇化报功编号
  reportedBoxesCount: number; // 报工数（箱）
  outboundOrderNo: string; // 出库申请单号
  inboundOrderNo: string; // 入库申请单号
  reporter: string; // 报工人
  reportTime: string; // 报工时间
}
