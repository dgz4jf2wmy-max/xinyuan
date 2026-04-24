import { AnnualPlan, AnnualPlanLedger, AnnualPlanDetail, PlanStatus, ProductType, RegionType, RawMaterialInventoryComparison } from '../../types/plan';
import { mockProductList } from './productData';

// 模拟初始化的计划详情数据（通常由后端根据基础数据生成模板带出）
export const mockInitialDetails: AnnualPlanDetail[] = [
  {
    id: '1',
    productId: mockProductList[0].id,
    product: mockProductList[0],
    sequenceNumber: 1,
    productType: mockProductList[0].productType,
    regionType: mockProductList[0].sourceRegion,
    customerName: mockProductList[0].customerName,
    productName: mockProductList[0].productName,
    productCode: mockProductList[0].productCode,
    brandGrade: mockProductList[0].brandGrade,
    estimatedSalesVolume: 0,
    unitPriceExclTax: 85.59,
    initialInventory: 0, // 初次编制为0
    reserveQuantity: 0,
    estimatedProductionVolume: 0,
  },
  {
    id: '2',
    productId: mockProductList[1].id,
    product: mockProductList[1],
    sequenceNumber: 1,
    productType: mockProductList[1].productType,
    regionType: mockProductList[1].sourceRegion,
    customerName: mockProductList[1].customerName,
    productName: mockProductList[1].productName,
    productCode: mockProductList[1].productCode,
    brandGrade: mockProductList[1].brandGrade,
    estimatedSalesVolume: 0,
    unitPriceExclTax: 64.09,
    initialInventory: 0,
    reserveQuantity: 0,
    estimatedProductionVolume: 0,
  },
  {
    id: '3',
    productId: mockProductList[2].id,
    product: mockProductList[2],
    sequenceNumber: 2,
    productType: mockProductList[2].productType,
    regionType: mockProductList[2].sourceRegion,
    customerName: mockProductList[2].customerName,
    productName: mockProductList[2].productName,
    productCode: mockProductList[2].productCode,
    brandGrade: mockProductList[2].brandGrade,
    estimatedSalesVolume: 0,
    unitPriceExclTax: 33.00,
    initialInventory: 0,
    reserveQuantity: 0,
    estimatedProductionVolume: 0,
  },
  {
    id: '4',
    productId: mockProductList[3].id,
    product: mockProductList[3],
    sequenceNumber: 3,
    productType: mockProductList[3].productType,
    regionType: mockProductList[3].sourceRegion,
    customerName: mockProductList[3].customerName,
    productName: mockProductList[3].productName,
    productCode: mockProductList[3].productCode,
    brandGrade: mockProductList[3].brandGrade,
    estimatedSalesVolume: 0,
    unitPriceExclTax: 175.41,
    initialInventory: 0,
    reserveQuantity: 0,
    estimatedProductionVolume: 0,
  },
  {
    id: '5',
    productId: mockProductList[4].id,
    product: mockProductList[4],
    sequenceNumber: 5,
    productType: mockProductList[4].productType,
    regionType: mockProductList[4].sourceRegion,
    customerName: mockProductList[4].customerName,
    productName: mockProductList[4].productName,
    productCode: mockProductList[4].productCode,
    brandGrade: mockProductList[4].brandGrade,
    estimatedSalesVolume: 0,
    unitPriceExclTax: 100.00,
    initialInventory: 0,
    reserveQuantity: 0,
    estimatedProductionVolume: 0,
  }
];

// 模拟台账列表数据
export const mockPlanList: AnnualPlanLedger[] = [
  {
    id: 'PLAN-2027-001',
    planName: '鑫源公司2027年年度产销计划',
    status: PlanStatus.Draft,
    year: '2027年',
    currentVersion: 'V1.0',
    createdBy: '李四',
    createdAt: '2026-10-01 09:00',
    lastUpdatedAt: '2026-10-01 09:00'
  },
  {
    id: 'PLAN-2026-001',
    planName: '鑫源公司2026年年度产销计划',
    status: PlanStatus.Draft,
    year: '2026年',
    currentVersion: 'V1.0',
    createdBy: '李四',
    createdAt: '2025-11-20 09:15',
    lastUpdatedAt: '2025-11-20 09:15'
  },
  {
    id: 'PLAN-2025-001',
    planName: '鑫源公司2025年年度产销计划',
    status: PlanStatus.Published,
    year: '2025年',
    currentVersion: 'V2.1',
    createdBy: '张三',
    createdAt: '2024-12-01 10:00',
    lastUpdatedAt: '2024-12-15 14:30'
  },
  {
    id: 'PLAN-2024-001',
    planName: '鑫源公司2024年年度产销计划',
    status: PlanStatus.Published,
    year: '2024年',
    currentVersion: 'V3.0',
    createdBy: '王五',
    createdAt: '2023-11-15 09:30',
    lastUpdatedAt: '2024-01-10 16:45'
  },
  {
    id: 'PLAN-2023-001',
    planName: '鑫源公司2023年年度产销计划',
    status: PlanStatus.Published,
    year: '2023年',
    currentVersion: 'V1.2',
    createdBy: '赵六',
    createdAt: '2022-12-05 14:20',
    lastUpdatedAt: '2023-02-20 11:10'
  },
  {
    id: 'PLAN-2022-001',
    planName: '鑫源公司2022年年度产销计划',
    status: PlanStatus.Published,
    year: '2022年',
    currentVersion: 'V2.0',
    createdBy: '孙七',
    createdAt: '2021-11-28 10:00',
    lastUpdatedAt: '2022-01-05 09:30'
  }
];

// 模拟获取台账分页数据接口
export const getAnnualPlanPage = (params: any) => {
  return new Promise<{ total: number; list: AnnualPlanLedger[] }>((resolve) => {
    setTimeout(() => {
      let filtered = [...mockPlanList];
      if (params.year) {
        filtered = filtered.filter(item => item.year === params.year);
      }
      if (params.status) {
        filtered = filtered.filter(item => item.status === params.status);
      }
      resolve({
        total: filtered.length,
        list: filtered
      });
    }, 300);
  });
};

// 模拟原料库存对比数据
export const mockRawMaterialInventory: RawMaterialInventoryComparison[] = [
  {
    id: '1',
    sequenceNumber: 1,
    materialName: '2024;烤烟;云南;烟梗;短梗-35',
    totalInputQuantity: 150000.00,
    currentInventory: 120000.00,
    difference: -30000.00,
  },
  {
    id: '2',
    sequenceNumber: 2,
    materialName: '2023;烤烟;云南;碎片;DCAKAHK(大碎片)-130',
    totalInputQuantity: 85000.00,
    currentInventory: 100000.00,
    difference: 15000.00,
  },
  {
    id: '3',
    sequenceNumber: 3,
    materialName: '2024 年贵州遵义烤烟碎末-150',
    totalInputQuantity: 200000.00,
    currentInventory: 50000.00,
    difference: -150000.00,
  },
  {
    id: '4',
    sequenceNumber: 4,
    materialName: '2024 年 NZH6 河南采购预混烟末',
    totalInputQuantity: 140000.00,
    currentInventory: 145000.00,
    difference: 5000.00,
  },
  {
    id: '5',
    sequenceNumber: 5,
    materialName: '吉林延边卷包回收烟末 YJ-02 无 25kg/件 2024 年',
    totalInputQuantity: 600000.00,
    currentInventory: 200000.00,
    difference: -400000.00,
  },
  {
    id: '6',
    sequenceNumber: 6,
    materialName: '2024;烤烟;江苏南京;制丝烟末;南京-130',
    totalInputQuantity: 200000.00,
    currentInventory: 250000.00,
    difference: 50000.00,
  }
];
