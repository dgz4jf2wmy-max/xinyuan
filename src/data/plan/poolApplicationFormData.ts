export interface ProductConfig {
  id: string;
  productType: string;
  productName: string;
  productCode: string;
  brandGrade: string;
  specification: string;
  unit: string;
  unitPriceExclTax: number;
  unitPriceInclTax: number;
}

export const mockApplicationProducts: ProductConfig[] = [
  {
    id: 'p1',
    productType: '再造梗丝',
    productName: '再造梗丝(省内)',
    productCode: '010210001',
    brandGrade: 'GS22',
    specification: '15',
    unit: '吨',
    unitPriceExclTax: 12000,
    unitPriceInclTax: 13560,
  },
  {
    id: 'p2',
    productType: '再造烟叶',
    productName: '再造烟叶(省外)',
    productCode: '010210005',
    brandGrade: 'HBZY-10',
    specification: '15',
    unit: '吨',
    unitPriceExclTax: 15000,
    unitPriceInclTax: 16950,
  },
  {
    id: 'p3',
    productType: '香精香料',
    productName: '多孔颗粒',
    productCode: '010210007',
    brandGrade: '无',
    specification: '20L/桶',
    unit: '吨',
    unitPriceExclTax: 50000,
    unitPriceInclTax: 56500,
  }
];
