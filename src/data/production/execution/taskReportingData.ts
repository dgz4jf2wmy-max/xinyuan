export interface ShiftLog {
  id: string;
  shift: string;
  shiftManager: string;
  reporter: string;
  reportTime: string;
  productionQuantity: number;
  unit: string;
  equipmentStatus: string;
  remarks: string;
}

export interface TaskReportingData {
  taskId: string | number;
  taskNo: string;
  shiftLogs: ShiftLog[];
}

export const mockTaskReportingData: Record<string, TaskReportingData> = {
  "SCRW-ZY-05-001": {
    taskId: 101,
    taskNo: "SCRW-ZY-05-001",
    shiftLogs: [
      {
        id: "L1",
        shift: "早班 (08:00 - 16:00)",
        shiftManager: "刘建",
        reporter: "操作工A",
        reportTime: "2026-05-09 16:15",
        productionQuantity: 25.5,
        unit: "吨",
        equipmentStatus: "正常运行",
        remarks: "生产平稳，各项指标达标"
      },
      {
        id: "L2",
        shift: "中班 (16:00 - 00:00)",
        shiftManager: "王强",
        reporter: "操作工B",
        reportTime: "2026-05-08 00:10",
        productionQuantity: 24.0,
        unit: "吨",
        equipmentStatus: "轻微波动",
        remarks: "21:00干燥段温度稍有波动，已修复"
      }
    ]
  },
  "SCRW-GS-05-001": {
    taskId: 103,
    taskNo: "SCRW-GS-05-001",
    shiftLogs: [
      {
        id: "L3",
        shift: "夜班 (00:00 - 08:00)",
        shiftManager: "张伟",
        reporter: "操作工C",
        reportTime: "2026-05-08 08:05",
        productionQuantity: 12.0,
        unit: "吨",
        equipmentStatus: "正常",
        remarks: "按计划推进中"
      }
    ]
  }
};
