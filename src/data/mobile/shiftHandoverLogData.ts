import { ShiftHandoverLog } from "../../types/production/execution/shiftHandoverLog";

export const mockShiftHandoverLogs: ShiftHandoverLog[] = [
  {
    id: 1,
    logNo: 'JJB-ZYQCL-202605101-01',
    logName: '再造烟叶前处理工序_早班_202605101_HBZY-10',
    taskNo: 'SCRW-ZY-05-001',
    process: '再造烟叶前处理工序',
    teamName: '甲班',
    shiftName: '早班',
    submitter: '张三',
    submitTime: '2026-05-10 08:30:00',
    isManualFill: false
  },
  {
    id: 2,
    logNo: 'JJB-ZYQCL-202605102-01',
    logName: '再造烟叶前处理工序_中班_202605102_HBZY-10',
    taskNo: 'SCRW-ZY-05-001',
    process: '再造烟叶前处理工序',
    teamName: '乙班',
    shiftName: '中班',
    submitter: '李四',
    submitTime: '2026-05-10 16:30:00',
    isManualFill: true
  },
  {
    id: 3,
    logNo: 'JJB-GSYCL-202605111-01',
    logName: '再造梗丝原料预处理段_早班_202605111_GS22',
    taskNo: 'SCRW-GS-05-001',
    process: '再造梗丝原料预处理段',
    teamName: '甲班',
    shiftName: '早班',
    submitter: '王五',
    submitTime: '2026-05-11 08:30:00',
    isManualFill: false
  },
  {
    id: 4,
    logNo: 'JJB-XJ-202605121-01',
    logName: '香精香料线_早班_202605121_NX0160L20',
    taskNo: 'SCRW-XJ-05-001',
    process: '香精香料线',
    teamName: '丙班',
    shiftName: '早班',
    submitter: '赵六',
    submitTime: '2026-05-12 08:30:00',
    isManualFill: false
  }
];
