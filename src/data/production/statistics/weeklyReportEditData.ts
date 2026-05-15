import {
  ProductionWeeklyReportMaterialDetail,
  ProductionWeeklyReportFlavorDetail,
  ProductionWeeklyReportTestDetail,
  ProductionWeeklyReportOtherInfo,
  ProductionWeeklyReportWorkSummary
} from '../../../types/production/statistics/report';

export const mockWeeklyReportEditBaseInfo = {
  id: 1,
  createdAt: '2023-11-20 10:00:00',
  createdBy: 'admin',
  updatedAt: '2023-11-20 10:00:00',
  updatedBy: 'admin',
  reportNo: 'ZB-20231120-001',
  reportName: '2023年11月第三周生产周报',
  submitter: '张建国',
  submitTime: '2023-11-20 10:00:00',
  status: '待提交',
};

// 再造原料生产情况
export const mockWeeklyEditMaterialDetails: ProductionWeeklyReportMaterialDetail[] = [
  {
    id: 1,
    productType: '再造梗丝',
    brandCode: 'GS60',
    actualProduction: 61.4,
    remark: '',
    subtotalActualProduction: 116.83,
    reconstitutedTobaccoYearlyPlan: 3285,
    reconstitutedTobaccoCumulative: 400.65,
    reconstitutedTobaccoProgress: 0.122,
    reconstitutedStemYearlyPlan: 1756,
    reconstitutedStemCumulative: 314.88,
    reconstitutedStemProgress: 0.1793,
    porousGranuleYearlyPlan: 90,
    porousGranuleCumulative: 25.28,
    porousGranuleProgress: 0.2809,
  },
  {
    id: 2,
    productType: '再造梗丝',
    brandCode: 'GS01',
    actualProduction: 45.62,
    remark: '',
    subtotalActualProduction: 116.83,
    reconstitutedTobaccoYearlyPlan: 3285,
    reconstitutedTobaccoCumulative: 400.65,
    reconstitutedTobaccoProgress: 0.122,
    reconstitutedStemYearlyPlan: 1756,
    reconstitutedStemCumulative: 314.88,
    reconstitutedStemProgress: 0.1793,
    porousGranuleYearlyPlan: 90,
    porousGranuleCumulative: 25.28,
    porousGranuleProgress: 0.2809,
  },
  {
    id: 3,
    productType: '再造梗丝',
    brandCode: 'GS30',
    actualProduction: 47.27,
    remark: '',
    subtotalActualProduction: 116.83,
    reconstitutedTobaccoYearlyPlan: 3285,
    reconstitutedTobaccoCumulative: 400.65,
    reconstitutedTobaccoProgress: 0.122,
    reconstitutedStemYearlyPlan: 1756,
    reconstitutedStemCumulative: 314.88,
    reconstitutedStemProgress: 0.1793,
    porousGranuleYearlyPlan: 90,
    porousGranuleCumulative: 25.28,
    porousGranuleProgress: 0.2809,
  },
  {
    id: 4,
    productType: '再造梗丝',
    brandCode: 'GS22',
    actualProduction: 9.81,
    remark: '',
    subtotalActualProduction: 116.83,
    reconstitutedTobaccoYearlyPlan: 3285,
    reconstitutedTobaccoCumulative: 400.65,
    reconstitutedTobaccoProgress: 0.122,
    reconstitutedStemYearlyPlan: 1756,
    reconstitutedStemCumulative: 314.88,
    reconstitutedStemProgress: 0.1793,
    porousGranuleYearlyPlan: 90,
    porousGranuleCumulative: 25.28,
    porousGranuleProgress: 0.2809,
  },
];

// 香精香料生产情况
export const mockWeeklyEditFlavorDetails: ProductionWeeklyReportFlavorDetail[] = [
  // 料液
  { id: 1, productType: '香精香料', productionType: '料液', brandCode: 'BA71504', actualProduction: 0.7, remark: '', subtotalActualProduction: 75.087, yearlyPlanCustomerName: '江苏中烟', yearlyPlanProduction: 1850, yearlyPlanCumulative: 296.63, yearlyPlanProgress: 0.1603 },
  { id: 2, productType: '香精香料', productionType: '料液', brandCode: 'BA71504 (合作加工)', actualProduction: 0.21, remark: '', subtotalActualProduction: 75.087, yearlyPlanCustomerName: '江苏中烟', yearlyPlanProduction: 1850, yearlyPlanCumulative: 296.63, yearlyPlanProgress: 0.1603 },
  { id: 3, productType: '香精香料', productionType: '料液', brandCode: 'GL2', actualProduction: 0.51, remark: '', subtotalActualProduction: 75.087, yearlyPlanCustomerName: '江苏中烟', yearlyPlanProduction: 1850, yearlyPlanCumulative: 296.63, yearlyPlanProgress: 0.1603 },
  // 表香
  { id: 4, productType: '香精香料', productionType: '表香', brandCode: 'NX0200L19', actualProduction: 3.9, remark: '', subtotalActualProduction: 27.298, yearlyPlanCustomerName: '江苏中烟', yearlyPlanProduction: 1850, yearlyPlanCumulative: 296.63, yearlyPlanProgress: 0.1603 },
  { id: 5, productType: '香精香料', productionType: '表香', brandCode: 'SC0220X25 (合作加工)', actualProduction: 1.28, remark: '', subtotalActualProduction: 27.298, yearlyPlanCustomerName: '江苏中烟', yearlyPlanProduction: 1850, yearlyPlanCumulative: 296.63, yearlyPlanProgress: 0.1603 },
  // 新桥
  { id: 6, productType: '香精香料', productionType: '新桥', brandCode: 'C08026', actualProduction: 2, remark: '', subtotalActualProduction: 15.15, yearlyPlanCustomerName: '新桥', yearlyPlanProduction: 220, yearlyPlanCumulative: 39.31, yearlyPlanProgress: 0.1787 },
  { id: 7, productType: '香精香料', productionType: '新桥', brandCode: 'C66110', actualProduction: 10, remark: '', subtotalActualProduction: 15.15, yearlyPlanCustomerName: '新桥', yearlyPlanProduction: 220, yearlyPlanCumulative: 39.31, yearlyPlanProgress: 0.1787 },
];

export const mockWeeklyEditTestDetails: ProductionWeeklyReportTestDetail[] = [
  { id: 1, recipeName: '-', actualProduction: 0, remark: '' },
];

export const mockWeeklyEditOtherInfo: ProductionWeeklyReportOtherInfo = {
  reconstitutedTobaccoLabelingAmount: 200,
  reconstitutedStemLabelingAmount: 5192,
  rawMaterialPremixingAmount: 5.4,
  tobaccoDustScreeningAmount: 12,
  boxFlippingAmount: 55,
  otherActivitiesSummary: '再造烟叶补贴标[再造烟叶补贴标数量（箱）]箱，再造梗丝补贴标[再造梗丝补贴标数量（箱）]箱，原料预混打包[原料预混打包数量（吨）]吨，烟末筛分[烟末筛分数量（吨）]吨，翻箱[翻箱数量（吨）]吨。'
};

export const mockWeeklyEditWorkSummary: ProductionWeeklyReportWorkSummary = {
  workSummary: `1、安全环保职业健康：本周再造原料线、香精香料线安全、环保、职业健康等方面正常。
2、生产运行情况简述：再造烟叶线停产，再造梗丝线、香精香料线运行稳定，未发生因设备损坏导致生产中断超2小时的情况。
3、其他情况：无。`
};
