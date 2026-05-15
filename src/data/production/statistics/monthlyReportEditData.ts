import { ProductionMonthlyReportReportInfo } from '../../../types/production/statistics/report';

export const mockMonthlyReportItems: ProductionMonthlyReportReportInfo[] = [
  {
    id: 1,
    productType: '再造烟叶',
    brandCode: 'JSS06',
    materialConsumption: 200,
    actualProduction: 150,
    warehousingProduction: 155,
    yieldRate: 75,
    monthlyProductionTime: 230,
    monthlyAverageDailyProduction: 40.7,
    flavorProductionLineMonthlyActualDeploymentWarehousingVolume: 233
  },
  {
    id: 2,
    productType: '再造烟叶',
    brandCode: 'JSN18',
    materialConsumption: 300,
    actualProduction: 240,
    warehousingProduction: 242,
    yieldRate: 80,
    monthlyProductionTime: 230,
    monthlyAverageDailyProduction: 40.7,
    flavorProductionLineMonthlyActualDeploymentWarehousingVolume: 233
  },
  {
    id: 3,
    productType: '再造梗丝',
    brandCode: 'GS01',
    materialConsumption: 120,
    actualProduction: 51,
    warehousingProduction: 51,
    yieldRate: 42.5,
    monthlyProductionTime: 160,
    monthlyAverageDailyProduction: 16.2,
    flavorProductionLineMonthlyActualDeploymentWarehousingVolume: 233
  },
  {
    id: 4,
    productType: '再造梗丝',
    brandCode: 'GS60',
    materialConsumption: 150,
    actualProduction: 57,
    warehousingProduction: 55,
    yieldRate: 38,
    monthlyProductionTime: 160,
    monthlyAverageDailyProduction: 16.2,
    flavorProductionLineMonthlyActualDeploymentWarehousingVolume: 233
  }
];

export const mockMonthlyReportBaseInfo = {
  id: 1,
  createdAt: '2023-10-01 10:00:00',
  createdBy: 'admin',
  updatedAt: '2023-10-01 10:00:00',
  updatedBy: 'admin',
  reportNo: 'YB-202310-001',
  reportName: '2023年10月生产月报',
  submitter: '李明',
  submitTime: '2023-10-31 18:00:00',
  status: '草稿中',
  remark: ''
};
