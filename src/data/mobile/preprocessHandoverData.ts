import { FeedRecord } from "../../types/production/execution/preprocessHandover";

export const initialFeedRecords: FeedRecord[] = [
  { 
    id: 'REC-001', 
    batch: '11', 
    feedTime: '11:15:00', 
    inTime: '',           
    status: { stem: 'normal', dust: 'normal', rod: 'normal' },
    desc: { stem: '', dust: '', rod: '' }
  },
  { 
    id: 'REC-002', 
    batch: '12', 
    feedTime: '14:30:00', 
    inTime: '', 
    status: { stem: 'normal', dust: 'normal', rod: 'normal' },
    desc: { stem: '', dust: '', rod: '' }
  }
];
