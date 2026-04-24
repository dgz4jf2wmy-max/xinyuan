import { MonthlyAgingPlan } from '../../types/monthly-plan';

export const mockMonthlyAgingPlans: MonthlyAgingPlan[] = [
  {
    sequenceNumber: 1,
    planName: '2026年4月月度醇化计划',
    status: '已发布',
    creator: '张建国',
    createTime: '2026-03-25 10:30:00'
  },
  {
    sequenceNumber: 2,
    planName: '2026年5月月度醇化计划',
    status: '草稿中',
    creator: '王爱民',
    createTime: '2026-04-20 14:15:20'
  },
  {
    sequenceNumber: 3,
    planName: '2026年3月月度醇化计划',
    status: '已发布',
    creator: '李思源',
    createTime: '2026-02-24 09:20:15'
  },
  {
    sequenceNumber: 4,
    planName: '2026年2月月度醇化计划',
    status: '已发布',
    creator: '张建国',
    createTime: '2026-01-20 16:45:00'
  },
  {
    sequenceNumber: 5,
    planName: '2026年1月月度醇化计划',
    status: '已发布',
    creator: '周卫东',
    createTime: '2025-12-28 11:30:00'
  },
  {
    sequenceNumber: 6,
    planName: '2025年12月月度醇化计划',
    status: '已发布',
    creator: '王爱民',
    createTime: '2025-11-25 14:00:00'
  },
  {
    sequenceNumber: 7,
    planName: '2025年11月月度醇化计划',
    status: '已发布',
    creator: '张建国',
    createTime: '2025-10-22 08:50:40'
  },
  {
    sequenceNumber: 8,
    planName: '2025年10月月度醇化计划',
    status: '已发布',
    creator: '周卫东',
    createTime: '2025-09-15 15:10:00'
  }
];

export const getAgeingPlanPage = async (params: { planName?: string, status?: string, pageNum: number, pageSize: number }) => {
  return new Promise<{ list: MonthlyAgingPlan[], total: number }>((resolve) => {
    setTimeout(() => {
      let filtered = [...mockMonthlyAgingPlans];
      
      if (params.planName) {
        filtered = filtered.filter(p => p.planName.includes(params.planName!));
      }
      if (params.status) {
        filtered = filtered.filter(p => p.status === params.status);
      }
      
      const start = (params.pageNum - 1) * params.pageSize;
      const end = start + params.pageSize;
      
      resolve({
        list: filtered.slice(start, end),
        total: filtered.length
      });
    }, 400);
  });
};
