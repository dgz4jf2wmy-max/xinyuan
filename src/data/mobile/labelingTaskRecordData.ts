import { LabelingWarehousingRecord } from "../../types/production/execution/labelingWarehousingRecord";

export const mockLabelingRecords: LabelingWarehousingRecord[] = [
  {
    id: 1,
    taskNo: "TBRW-GS60-20260515-001",
    warehousingNo: "RK-20260515-001",
    applicant: "管理员",
    applyTime: "2026-05-15 08:30:00",
  },
  {
    id: 2,
    taskNo: "TBRW-GS60-20260515-001",
    warehousingNo: "RK-20260515-002",
    applicant: "管理员",
    applyTime: "2026-05-15 10:15:00",
  },
];

export const getRecordsByTaskNo = (taskNo: string): LabelingWarehousingRecord[] => {
  return mockLabelingRecords.filter((record) => record.taskNo === taskNo);
};
