import { ProductionDailyReportDetail, ProductionDailyReport } from '../../../types/production/statistics/report';

export const mockDailyReportBaseInfo: ProductionDailyReport = {
  id: 1,
  status: '待提交',
  reportNo: 'SCRB-20260514',
  reportName: '2026年05月14日_生产日报',
  submitter: '张三',
  submitTime: '2026-05-14 18:00:00'
};

export const mockMaterialDetails: ProductionDailyReportDetail[] = [
  { productType: '再造原料', teamName: '甲', brandCode: 'JSS06', dailyPackagedBoxes: 120, dailyPackagedAmount: 21.6, dailyCumulativeFlow: 22.5, remark: '' },
  { productType: '再造原料', teamName: '乙', brandCode: 'JSS06', dailyPackagedBoxes: 118, dailyPackagedAmount: 21.24, dailyCumulativeFlow: 21.9, remark: '' },
  { productType: '再造原料', teamName: '丙', brandCode: 'JSS06', dailyPackagedBoxes: 122, dailyPackagedAmount: 21.96, dailyCumulativeFlow: 22.8, remark: '' },
  { productType: '再造原料', teamName: '丁', brandCode: '-', dailyPackagedBoxes: 0, dailyPackagedAmount: 0, dailyCumulativeFlow: 0, remark: '' },
];

export const mockFlavorDetails: ProductionDailyReportDetail[] = [
  // 料液
  { productType: '香精香料', category: '料液', brandCode: 'NX0160L20', dailyPreparationAmount: 5, remark: '' },
  { productType: '香精香料', category: '料液', brandCode: 'NC0120L10', dailyPreparationAmount: 6, remark: '' },
  // 表香
  { productType: '香精香料', category: '表香', brandCode: 'NX0160X20', dailyPreparationAmount: 2, remark: '' },
  { productType: '香精香料', category: '表香', brandCode: 'NC0120X10', dailyPreparationAmount: 1, remark: '' },
  // 新桥
  { productType: '香精香料', category: '新桥', brandCode: 'C08026', dailyPreparationAmount: 5, remark: '' },
  // 试验
  { productType: '香精香料', category: '试验', brandCode: 'NX0160L20 (产品试验)', dailyPreparationAmount: 0.5, remark: '' },
];

export const mockDailyReportRemark = `1.当月生产计划完成情况：本月计划生产再造烟叶[统计当月再造烟叶产量总和]吨，目前已完成[统计当月再造烟叶申请完工量总和]吨；再造梗丝[统计当月再造梗丝产量总和]吨，目前已完成[统计当月再造梗丝申请完工量总和]吨。
2.各工段生产运行情况：生产运行正常，未出现2小时以上设备故障。`;
