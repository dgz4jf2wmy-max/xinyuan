import { AgingReport } from "../types/aging-task";

export const getReportsByTaskId = (taskId: string | number): AgingReport[] => {
  const id = Number(taskId);
  return [
    {
      id: 1,
      taskNo: `CHRW-202605-00${id}`,
      reportNo: `CHBG-20260510-0001`,
      reportedBoxesCount: 20.0,
      outboundOrderNo: `CK-20260510-00${id}`,
      inboundOrderNo: `RK-20260510-00${id}`,
      reporter: "张三",
      reportTime: "2026-05-10 14:30:00",
    },
    {
      id: 2,
      taskNo: `CHRW-202605-00${id}`,
      reportNo: `CHBG-20260511-0001`,
      reportedBoxesCount: 30.0,
      outboundOrderNo: `CK-20260511-00${id}`,
      inboundOrderNo: `RK-20260511-00${id}`,
      reporter: "李四",
      reportTime: "2026-05-11 09:15:00",
    },
  ];
};
