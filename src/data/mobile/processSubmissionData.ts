import { ProcessSubmissionList } from '../../types/production/execution/processSubmissionList';

export const mockProcessSubmissionData: ProcessSubmissionList[] = [
  { id: 1, logNo: "再造烟叶前处理工序", isSubmitted: true, submitter: "张三", submitTime: "2026-05-11 08:30:00", taskId: 1 },
  { id: 2, logNo: "再造烟叶原料投用", isSubmitted: true, submitter: "李四", submitTime: "2026-05-11 08:35:00", taskId: 1 },
  { id: 3, logNo: "再造烟叶提取工序", isSubmitted: true, submitter: "王五", submitTime: "2026-05-11 08:40:00", taskId: 1 },
  { id: 4, logNo: "再造烟叶浓缩段CIP站", isSubmitted: true, submitter: "赵六", submitTime: "2026-05-11 08:45:00", taskId: 1 },
  { id: 5, logNo: "再造烟叶浓缩工序", isSubmitted: false, taskId: 1 },
  { id: 6, logNo: "再造烟叶配料工序", isSubmitted: false, taskId: 1 },
  { id: 7, logNo: "再造烟叶配料间香料", isSubmitted: false, taskId: 1 },
  { id: 8, logNo: "再造烟叶制浆一楼", isSubmitted: false, taskId: 1 },
  { id: 9, logNo: "再造烟叶制浆二楼", isSubmitted: false, taskId: 1 },
  { id: 10, logNo: "再造烟叶制浆DCS", isSubmitted: false, taskId: 1 },
  { id: 11, logNo: "再造烟叶抄造湿部现场", isSubmitted: false, taskId: 1 },
  { id: 12, logNo: "再造烟叶抄造湿部DCS", isSubmitted: false, taskId: 1 },
  { id: 13, logNo: "再造烟叶抄造干部", isSubmitted: false, taskId: 1 },
  { id: 14, logNo: "再造烟叶成品打包", isSubmitted: false, taskId: 1 },
  { id: 15, logNo: "再造烟叶成品烘干", isSubmitted: false, taskId: 1 },
  { id: 16, logNo: "再造烟叶浆液平衡", isSubmitted: false, taskId: 1 },
  { id: 17, logNo: "再造梗丝切丝段", isSubmitted: true, submitter: "王五", submitTime: "2026-05-12 08:45:00", taskId: 2 },
  { id: 18, logNo: "再造梗丝浸泡提取段", isSubmitted: false, taskId: 2 }
];
