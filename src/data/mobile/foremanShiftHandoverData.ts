import { ForemanShiftHandoverLog } from "../../types/production/execution/foremanShiftHandoverLog";

export const mockForemanShiftHandoverData: ForemanShiftHandoverLog[] = [
  {
    id: 1,
    logNo: "GDJJB-ZY-202605111-01",
    logName: "20260511_早班_甲班_再造烟叶线工段长交接班日志_HBZY-10",
    productionTaskNo: "RW-20260511-001",
    teamName: "甲班",
    shiftName: "早班",
    submitter: "张三",
    submitTime: "2026-05-11 08:30:00"
  },
  {
    id: 2,
    logNo: "GDJJB-ZY-202605112-02",
    logName: "20260511_中班_乙班_再造烟叶线工段长交接班日志_HBZY-10",
    productionTaskNo: "RW-20260511-001",
    teamName: "乙班",
    shiftName: "中班",
    submitter: "李四",
    submitTime: "2026-05-11 16:30:00"
  },
  {
    id: 3,
    logNo: "GDJJB-GS-202605121-01",
    logName: "20260512_早班_丙班_再造梗丝线工段长交接班日志_HBGS-20",
    productionTaskNo: "RW-20260512-002",
    teamName: "丙班",
    shiftName: "早班",
    submitter: "王五",
    submitTime: "2026-05-12 08:30:00"
  }
];
