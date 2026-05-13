import { ApprovalProcessInfo } from '../../../types/plan';
import { mockTempBlendingRecords } from './tempBlendingData';

export const mockTempBlendingApprovalProcess: ApprovalProcessInfo[] = [
  {
    id: '1',
    nodeName: '发起申请',
    approver: '张三',
    nodeStartTime: '2026-05-10 10:00:00',
    approvalTime: '2026-05-10 10:05:00',
    approvalResult: '发起',
    comments: '',
  },
  {
    id: '2',
    nodeName: '部门审核',
    approver: '李四',
    nodeStartTime: '2026-05-10 10:05:00',
    approvalTime: '2026-05-10 11:30:00',
    approvalResult: '已通过',
    comments: '同意回掺，数量合理',
  },
  {
    id: '3',
    nodeName: '生产确认',
    approver: '王五',
    nodeStartTime: '2026-05-10 11:30:00',
    approvalTime: '待处理',
    approvalResult: '待确认',
    comments: '',
  }
];

export const getTempBlendingDetail = (applicationNo: string) => {
  return mockTempBlendingRecords.find(record => record.applicationNo === applicationNo) || mockTempBlendingRecords[0];
};
