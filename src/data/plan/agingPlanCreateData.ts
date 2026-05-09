import { MonthlyAgingPlanItem } from '../../types/monthly-plan';

/**
 * 新增醇化计划页面 - 表单行默认初始数据
 * 使用 MonthlyAgingPlanItem 实体类结构
 */
export const initialAgingPlanItem = (seq: number): MonthlyAgingPlanItem => ({ id: 'item-1', sequenceNumber: seq,
  brandName: '',
  month: '',
  subBrandGrade: '',
  boxCount: 0,
  date: '',
  sectionPlanNumber: '',
  remarks: ''
});

/**
 * 新增醇化计划页面 - 页面初始数据初始化加载
 */
export const getInitialAgingPlanCreateData = async () => {
  return new Promise<{ defaultItems: MonthlyAgingPlanItem[] }>((resolve) => {
    // 模拟从接口获取页面初始配置
    setTimeout(() => {
      resolve({
        defaultItems: [initialAgingPlanItem(1)]
      });
    }, 100);
  });
};
