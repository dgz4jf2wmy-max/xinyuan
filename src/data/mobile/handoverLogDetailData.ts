import { ShiftHandoverLog } from "../../types/production/execution/shiftHandoverLog";
import { mockShiftHandoverLogs } from "./shiftHandoverLogData";

export interface LogDetailFeedRecord {
  id: string;
  feedTime: string;
  status: {
    stem: 'normal' | 'abnormal';
    dust: 'normal' | 'abnormal';
    rod: 'normal' | 'abnormal';
  };
  desc: {
    stem: string;
    dust: string;
    rod: string;
  };
}

export const mockFeedRecords: LogDetailFeedRecord[] = [
  { id: 'REC-001', feedTime: '08:15:00', status: { stem: 'normal', dust: 'normal', rod: 'normal' }, desc: { stem: '', dust: '', rod: '' } },
  { id: 'REC-002', feedTime: '09:30:00', status: { stem: 'normal', dust: 'abnormal', rod: 'normal' }, desc: { stem: '', dust: '烟末含水率偏高', rod: '' } },
  { id: 'REC-003', feedTime: '10:45:00', status: { stem: 'normal', dust: 'normal', rod: 'normal' }, desc: { stem: '', dust: '', rod: '' } }
];

export const getHandoverLogById = (id: number): ShiftHandoverLog | undefined => {
  return mockShiftHandoverLogs.find(l => l.id === id);
};
