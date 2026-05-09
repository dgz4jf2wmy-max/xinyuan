export interface ShiftGroupData {
  groupName: string;
  groupType: string;
  isActive: boolean;
  shifts: ShiftItemData[];
}

export interface ShiftItemData {
  serialNumber: number;
  shiftName: string;
  startTime: string;
  endTime: string;
}

export interface TeamGroupData {
  groupName: string;
  groupType: string;
  isActive: boolean;
  teams: TeamItemData[];
}

export interface TeamItemData {
  serialNumber: number;
  teamName: string;
  standardHeadcount: number;
}

/**
 * 排班规则配置
 */
export interface ScheduleRuleConfig {
  /** 序号 数字(0.) 只读 */
  serialNumber: number;
  /** 模板名称 字符(50) 必填 */
  templateName: string;
  /** 所属产线 字符(50) 必填 有效值：再造原料｜香精香料 */
  productionLine: string;
  /** 班次分组名称 字符(20) 必填 关联：班次主数据定义-班次分组名称 */
  shiftGroupName: string;
  /** 班组分组名称 字符(20) 必填 关联：班组主数据-班组分组名称 */
  teamGroupName: string;
  /** 倒班顺序 字符(50) 必填 班组的排班顺序 */
  rotationOrder: string;
}

/**
 * 排班表-基础信息
 */
export interface ScheduleBasicInfo {
  /** 序号 数字(0.) 只读 */
  serialNumber: number;
  /** 状态 字符(20) 只读 草稿中｜生效中｜已完成 */
  status: '草稿中' | '生效中' | '已完成';
  /** 排班表编号 字符(50) 只读 格式：[产线标识]-[排班周期]-[版本标识] */
  scheduleCode: string;
  /** 排班表日期范围 时间范围（yyyy-mm-dd~yyyy-mm-dd） 必填 */
  scheduleDateRange: string;
  /** 所属产线 字符(50) 必填 依据排班规则配置-所属产线生成 */
  productionLine: string;
}

/**
 * 排班表-排班详情
 */
export interface ScheduleDetail {
  /** 日期 时间(yyyy-mm-dd) 只读 */
  date: string;
  /** 值班班次 字符(20) 只读 关联：班次主数据定义-班次名称 */
  shiftName: string;
  /** 值班班组 字符(20) 只读 关联：班组主数据-班组分组 */
  teamName: string;
  /** 工时时长 时间范围（hh:mm~hh:mm） 只读 */
  workingHours: string;
}
