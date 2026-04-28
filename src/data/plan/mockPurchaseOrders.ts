import { ProductInfo } from '../../types/plan';
import { mockProductList } from './productData';

export interface MockPurchaseOrderDetail {
  id: string; // 唯一标识
  productId: string; // 关联 mockProductList
  productType: string;
  productName: string;
  productCode: string;
  brandGrade: string;
  specification: string;
  unit: string;
  unitPriceExclTax: number;
  unitPriceInclTax: number;
  taxRate: number;
  taxAmount: number;
  amountExclTax: number;
  // 以下是申请时需要填写的字段，初始可以为空或默认带出
  productionType?: string;
  customerName?: string;
  expectedCompletionDate?: string;
  plannedShippingDate?: string;
  deliveryDate?: string;
  deliveryLocation?: string;
}

export interface MockPurchaseOrderBase {
  id: string;
  orderNo: string; // ncc销售订单号
  orderType: string; // 普通｜紧急
  orderDate: string;
  customer: string;
  salesperson: string;
  department: string;
  currency: string;
  remarks: string;
  details: MockPurchaseOrderDetail[];
}

export const mockPurchaseOrders: MockPurchaseOrderBase[] = [
  {
    id: 'po-001',
    orderNo: 'NCC-PO-20260401001',
    orderType: '普通',
    orderDate: '2026-04-01',
    customer: '云南中烟有限责任公司',
    salesperson: '张三',
    department: '营销部',
    currency: '人民币',
    remarks: '这是一个Mock采购订单',
    details: [
      {
        id: 'pod-001',
        productId: mockProductList[0].id,
        productType: mockProductList[0].productType,
        productName: mockProductList[0].productName,
        productCode: mockProductList[0].productCode,
        brandGrade: mockProductList[0].brandGrade,
        specification: mockProductList[0].specification,
        unit: mockProductList[0].unit,
        unitPriceExclTax: mockProductList[0].unitPriceExclTax,
        unitPriceInclTax: mockProductList[0].unitPriceInclTax,
        taxRate: 0.13,
        taxAmount: 0, // calculate later
        amountExclTax: 0, // calculate later
        customerName: '云南中烟有限责任公司',
        deliveryDate: '2026-05-01',
        plannedShippingDate: '2026-04-20',
      }
    ]
  },
  {
    id: 'po-002',
    orderNo: 'NCC-PO-20260402002',
    orderType: '紧急',
    orderDate: '2026-04-02',
    customer: '贵州中烟工业有限责任公司',
    salesperson: '李四',
    department: '营销部',
    currency: '人民币',
    remarks: '加急订单请尽快处理',
    details: [
      {
        id: 'pod-002',
        productId: mockProductList[2].id, // 比如香精香料
        productType: mockProductList[2].productType,
        productName: mockProductList[2].productName,
        productCode: mockProductList[2].productCode,
        brandGrade: mockProductList[2].brandGrade,
        specification: mockProductList[2].specification,
        unit: mockProductList[2].unit,
        unitPriceExclTax: mockProductList[2].unitPriceExclTax || 50000,
        unitPriceInclTax: mockProductList[2].unitPriceInclTax || 56500,
        taxRate: 0.13,
        taxAmount: 0, 
        amountExclTax: 0, 
        customerName: '贵州中烟工业有限责任公司',
      }
    ]
  }
];
