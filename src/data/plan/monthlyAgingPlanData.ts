import { MonthlyAgingPlan, MonthlyAgingPlanItem } from '../../types/monthly-plan';

/**
 * 模拟月度醇化计划基础信息数据
 */
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
  }
];

/**
 * 模拟月度醇化计划表明细数据 (以2026年6月计划为例)
 */
export const mockMonthlyAgingPlanItems: MonthlyAgingPlanItem[] = [
  {
    id: 'item-1',
    sequenceNumber: 1,
    brandName: 'GS01',
    month: '6月',
    subBrandGrade: 'GS0101',
    boxCount: 8000,
    availableInventory: 15000,
    appliedCompletionAmount: 8000,
    date: '实时生产日期',
    sectionPlanNumber: '',
    remarks: '需本月生产'
  },
  {
    id: 'item-2',
    sequenceNumber: 2,
    brandName: 'GS60',
    month: '6月',
    subBrandGrade: 'GS6001',
    boxCount: 9580,
    availableInventory: 20000,
    appliedCompletionAmount: 9580,
    date: '实时生产日期',
    sectionPlanNumber: '',
    remarks: '库存补贴标'
  },
  {
    id: 'item-3',
    sequenceNumber: 3,
    brandName: 'GS60',
    month: '6月',
    subBrandGrade: 'GS6001',
    boxCount: 63740,
    availableInventory: 20000,
    appliedCompletionAmount: 63740,
    date: '实时生产日期',
    sectionPlanNumber: '',
    remarks: '需本月生产'
  }
];
