import { TemporaryBlendingApplication } from '../../../types/production/execution/temporaryBlendingApplication';

export const mockTempBlendingRecords: TemporaryBlendingApplication[] = [
  {
    applicationNo: 'LSHC-20260502-001',
    status: '已同意',
    monthlyTaskNo: 'RW-202605-001',
    productName: '再造烟叶（省外）JSN08',
    productCode: 'JSN08',
    brand: 'JSN08',
    productionType: '配方生产',
    blendingQuantity: 50.00,
    blendingRatio: 2.50,
    applicant: '张三',
    createdAt: '2026-05-02 08:30',
  },
  {
    applicationNo: 'LSHC-20260505-001',
    status: '待审核',
    monthlyTaskNo: 'RW-202605-002',
    productName: '再造梗丝（省外）GS22',
    productCode: 'GS22',
    brand: 'GS22',
    productionType: '省内计划',
    blendingQuantity: 100.00,
    blendingRatio: 5.00,
    applicant: '李四',
    createdAt: '2026-05-05 09:15',
  },
  {
    applicationNo: 'LSHC-20260506-001',
    status: '草稿中',
    monthlyTaskNo: 'RW-202605-003',
    productName: '再造烟叶（省外）HBZY-10',
    productCode: 'HBZY-10',
    brand: 'HBZY-10 常规',
    productionType: '配方生产',
    blendingQuantity: 30.00,
    blendingRatio: 1.50,
    applicant: '王五',
    createdAt: '2026-05-06 14:20',
  }
];
