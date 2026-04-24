import { AnnualPlanDetail, ProductType, RegionType, ApprovalProcessInfo, VersionHistoryInfo } from '../../types/plan';
import { mockProductList } from './productData';

export const mockVersionHistory: VersionHistoryInfo[] = [
  {
    id: 'v1.0',
    versionNo: 'V1.0',
    createdAt: '2025-11-20 09:15',
    createdBy: '李四',
    isInitial: true,
  },
  {
    id: 'v1.1',
    versionNo: 'V1.1',
    createdAt: '2025-11-25 10:30',
    createdBy: '李四',
  },
  {
    id: 'v1.2',
    versionNo: 'V1.2',
    createdAt: '2025-11-28 15:40',
    createdBy: '李四',
  },
  {
    id: 'v2.0',
    versionNo: 'V2.0',
    createdAt: '2025-12-01 14:00',
    createdBy: '李四',
    isCurrent: true,
  },
  {
    id: 'draft',
    versionNo: 'V2.1(草稿)',
    createdAt: '2026-04-16 19:20',
    createdBy: '张三',
    isDraft: true,
  }
];

export const mockApprovalProcess: ApprovalProcessInfo[] = [
  {
    id: '1',
    nodeName: '计划管理员',
    approver: '李四',
    nodeStartTime: '2026-04-16 16:32:03',
    approvalTime: '2026-04-16 16:46:04',
    approvalResult: '提交初稿/待确认',
    comments: '草稿编制完成并下发审批',
  },
  {
    id: '2',
    nodeName: '分管领导',
    approver: '王建国',
    nodeStartTime: '2026-04-16 16:46:05',
    approvalTime: '正在审批',
    approvalResult: '待审核',
    comments: '',
  }
];

// 模拟初始版本数据
export const mockInitialVersionDetails: AnnualPlanDetail[] = [
  ...mockProductList.slice(0, 3).map((product, index) => ({
    id: `v1-${index}`,
    productId: product.id,
    product: product,
    sequenceNumber: index + 1,
    productType: product.productType,
    regionType: product.sourceRegion,
    customerName: product.customerName,
    productName: product.productName,
    productCode: product.productCode,
    brandGrade: product.brandGrade,
    initialInventory: 0,
    reserveQuantity: 0,
    estimatedSalesVolume: 10000.00 + (index * 1000),
    estimatedProductionVolume: 10000.00 + (index * 1000),
    unitPriceExclTax: 50.00,
    remarks: '初始版本数据'
  })),
  ...mockProductList.slice(8, 10).map((product, index) => ({
    id: `v1-gs-${index}`,
    productId: product.id,
    product: product,
    sequenceNumber: 4 + index,
    productType: product.productType,
    regionType: product.sourceRegion,
    customerName: product.customerName,
    productName: product.productName,
    productCode: product.productCode,
    brandGrade: product.brandGrade,
    initialInventory: 0,
    reserveQuantity: 0,
    estimatedSalesVolume: 5000.00,
    estimatedProductionVolume: 5000.00,
    unitPriceExclTax: 30.00,
    remarks: '初始版本数据'
  }))
];

// 模拟当前版本数据
export const mockCurrentVersionDetails: AnnualPlanDetail[] = [
  ...mockInitialVersionDetails.map((detail, index) => {
    if (index === 0) {
      return {
        ...detail,
        estimatedSalesVolume: 15000.00, // 调增
        estimatedProductionVolume: 15000.00,
        remarks: '当前版本数据，销量调增'
      };
    }
    return { ...detail, remarks: '当前版本数据，无变化' };
  }),
  {
    id: 'v2-new',
    productId: mockProductList[14].id, // 挑一个香精香料
    product: mockProductList[14],
    sequenceNumber: 6,
    productType: mockProductList[14].productType,
    regionType: mockProductList[14].sourceRegion,
    customerName: mockProductList[14].customerName,
    productName: mockProductList[14].productName,
    productCode: mockProductList[14].productCode,
    brandGrade: mockProductList[14].brandGrade,
    initialInventory: 0,
    reserveQuantity: 0,
    estimatedSalesVolume: 2000.00,
    estimatedProductionVolume: 2000.00,
    unitPriceExclTax: 120.00,
    remarks: '当前版本新增产品'
  }
];

// 模拟草稿版本数据 (在当前版本基础上再做些修改)
export const mockDraftVersionDetails: AnnualPlanDetail[] = mockCurrentVersionDetails.map(detail => {
  if (detail.id === 'v2-new') {
    return {
      ...detail,
      estimatedSalesVolume: detail.estimatedSalesVolume + 500,
      estimatedProductionVolume: detail.estimatedProductionVolume + 500,
      remarks: '草稿版本，调整了新产品销量'
    };
  }
  return detail;
});

// 获取对应版本信息的辅助函数
export const getVersionDetails = (versionId: string): AnnualPlanDetail[] => {
  if (versionId === 'v1.0') return mockInitialVersionDetails;
  if (versionId === 'v2.0') return mockCurrentVersionDetails;
  if (versionId === 'draft') return mockDraftVersionDetails;
  
  // 对于中间版本，可以简化为初始版本数据，或者复制其中一套
  return mockInitialVersionDetails.map(detail => ({ ...detail, remarks: '中间版本数据' }));
};
