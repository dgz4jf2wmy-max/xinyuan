import { MonthlyAgingPlan, MonthlyAgingPlanItem } from '../../types/monthly-plan';

/**
 * 模拟月度醇化计划基础信息数据（调整专用）
 */
export const mockMonthlyAgingAdjustPlans: MonthlyAgingPlan[] = [
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
  }
];

/**
 * 模拟月度醇化计划表明细数据（调整专用）
 */
export const mockMonthlyAgingAdjustPlanItems: MonthlyAgingPlanItem[] = [
  {
    sequenceNumber: 1,
    brandName: 'GS01',
    month: '6月',
    subBrandGrade: 'GS0101',
    boxCount: 8000,
    date: '实时生产日期',
    processPlanNumber: '',
    remarks: '需本月生产 (调整)'
  },
  {
    sequenceNumber: 2,
    brandName: 'GS60',
    month: '6月',
    subBrandGrade: 'GS6001',
    boxCount: 9580,
    date: '实时生产日期',
    processPlanNumber: '',
    remarks: '库存补贴标 (调整)'
  },
  {
    sequenceNumber: 3,
    brandName: 'GS60',
    month: '6月',
    subBrandGrade: 'GS6001',
    boxCount: 63740,
    date: '实时生产日期',
    processPlanNumber: '',
    remarks: '需本月生产 (调整)'
  }
];
