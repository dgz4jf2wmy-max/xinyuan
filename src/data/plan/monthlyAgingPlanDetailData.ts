import { MonthlyAgingPlanItem } from '../../types/monthly-plan';
import { VersionHistoryInfo, ApprovalProcessInfo } from '../../types/plan';

export const mockMonthlyAgingVersionHistory: VersionHistoryInfo[] = [
  {
    id: 'v2.1',
    versionNo: 'V2.1(草稿)',
    createdAt: '2026-04-22 19:20:00',
    createdBy: '张三 (计划管理员)',
    isCurrent: false,
    isInitial: false,
    isDraft: true
  },
  {
    id: 'v2.0',
    versionNo: 'V2.0',
    createdAt: '2026-04-20 14:15:20',
    createdBy: '张建国 (计划管理员)',
    isCurrent: true,
    isInitial: false,
    isDraft: false
  },
  {
    id: 'v1.1',
    versionNo: 'V1.1',
    createdAt: '2026-04-19 10:15:00',
    createdBy: '李四 (计划审核员)',
    isCurrent: false,
    isInitial: false,
    isDraft: false
  },
  {
    id: 'v1.0',
    versionNo: 'V1.0',
    createdAt: '2026-04-18 09:30:00',
    createdBy: '张建国 (计划管理员)',
    isCurrent: false,
    isInitial: true,
    isDraft: false
  }
];

export const mockMonthlyAgingApprovalProcess: ApprovalProcessInfo[] = [
  {
    id: '1',
    nodeName: '计划管理员',
    approver: '张建国',
    nodeStartTime: '2026-04-18 09:30:00',
    approvalTime: '2026-04-18 09:30:00',
    approvalResult: '发起申请',
    comments: '发起月度醇化计划审批流程'
  },
  {
    id: '2',
    nodeName: '生产计划部审核',
    approver: '李建华',
    nodeStartTime: '2026-04-18 10:00:00',
    approvalTime: '2026-04-19 10:20:00',
    approvalResult: '同意',
    comments: '数据准确，同意提交'
  },
  {
    id: '3',
    nodeName: '分管领导审批',
    approver: '王大勇',
    nodeStartTime: '2026-04-19 10:20:00',
    approvalTime: '2026-04-20 14:15:20',
    approvalResult: '同意',
    comments: '同意发布'
  }
];

// Mock Data for Initial Version (V1.0)
export const mockMonthlyAgingInitialVersion: MonthlyAgingPlanItem[] = [
  { sequenceNumber: 1, brandName: 'GS60', month: '2月', subBrandGrade: 'GS6001', boxCount: 479, date: '2月18日', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 2, brandName: 'GS60', month: '/', subBrandGrade: 'GS6001', boxCount: 3187, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 3, brandName: 'GS01', month: '/', subBrandGrade: 'GS0101', boxCount: 400, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 4, brandName: 'GS01', month: '/', subBrandGrade: 'GS0102', boxCount: 21, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 5, brandName: 'GS01', month: '2月', subBrandGrade: 'GS0102', boxCount: 979, date: '2月19日', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 6, brandName: 'GS30', month: '1月', subBrandGrade: 'GS3001', boxCount: 134, date: '2月20日', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 7, brandName: 'GS30', month: '1月', subBrandGrade: 'GS3003', boxCount: 84, date: '2月20日', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 8, brandName: 'GS30', month: '/', subBrandGrade: 'GS3003', boxCount: 1817, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 9, brandName: 'GS22', month: '/', subBrandGrade: 'GS2201', boxCount: 62, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 10, brandName: 'GS22', month: '/', subBrandGrade: 'GS2202', boxCount: 400, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
];

// Mock Data for Current Version (V2.0)
export const mockMonthlyAgingCurrentVersion: MonthlyAgingPlanItem[] = [
  { sequenceNumber: 1, brandName: 'GS60', month: '12月', subBrandGrade: 'GS6001', boxCount: 1000, date: '1月实时生产日期', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 2, brandName: 'GS60', month: '12月', subBrandGrade: 'GS6002', boxCount: 1037, date: '1月实时生产日期', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 3, brandName: 'GS60', month: '/', subBrandGrade: 'GS6001', boxCount: 3000, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 4, brandName: 'GS01', month: '12月', subBrandGrade: 'GS0101', boxCount: 600, date: '1月实时生产日期', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 5, brandName: 'GS01', month: '12月', subBrandGrade: 'GS0102', boxCount: 1030, date: '1月实时生产日期', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 6, brandName: 'GS01', month: '/', subBrandGrade: 'GS0101', boxCount: 2000, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 7, brandName: 'GS30', month: '/', subBrandGrade: 'GS3001', boxCount: 140, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 8, brandName: 'GS30', month: '/', subBrandGrade: 'GS3003', boxCount: 2000, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 9, brandName: 'GS22', month: '/', subBrandGrade: 'GS2201', boxCount: 623, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 10, brandName: 'GS22', month: '/', subBrandGrade: 'GS2202', boxCount: 536, date: '实时生产日期', processPlanNumber: '', remarks: '需本月生产' },
  { sequenceNumber: 11, brandName: 'GS22', month: '12月', subBrandGrade: 'GS2202', boxCount: 142, date: '1月实时生产日期', processPlanNumber: '', remarks: '库存补贴标' },
  { sequenceNumber: 12, brandName: 'JSZ11', month: '12月', subBrandGrade: 'JSZ1101', boxCount: 22, date: '1月实时生产日期', processPlanNumber: '', remarks: '库存补贴标' },
];

export const getMonthlyAgingVersionDetails = (versionId: string): MonthlyAgingPlanItem[] => {
  switch (versionId) {
    case 'v1.0':
      return mockMonthlyAgingInitialVersion;
    case 'v2.0':
    default:
      return mockMonthlyAgingCurrentVersion;
  }
};
