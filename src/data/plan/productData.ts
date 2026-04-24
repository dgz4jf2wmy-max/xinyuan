import { ProductInfo, ProductType, RegionType } from '../../types/plan';

// 模拟产品基础信息数据
export const mockProductList: ProductInfo[] = [
  // 再造烟叶 (YY)
  { id: 'P_YY_1', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.InProvince, customerName: '江苏中烟', productName: '再造烟叶A', productCode: 'YY202601001', brandGrade: 'HBZY-10', specification: '标准箱', unit: '吨', unitPriceExclTax: 12500, unitPriceInclTax: 14125 },
  { id: 'P_YY_2', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.InProvince, customerName: '江苏中烟', productName: '再造烟叶B', productCode: 'YY202601002', brandGrade: 'JSN08', specification: '标准箱', unit: '吨', unitPriceExclTax: 13000, unitPriceInclTax: 14690 },
  { id: 'P_YY_3', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.InProvince, customerName: '江苏中烟', productName: '再造烟叶C', productCode: 'YY202601003', brandGrade: 'SXSX618', specification: '定制箱', unit: '吨', unitPriceExclTax: 14200, unitPriceInclTax: 16046 },
  { id: 'P_YY_4', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.OutProvince, customerName: '广西中烟', productName: '再造烟叶D', productCode: 'YY202601018', brandGrade: 'JSN08 (广西)', specification: '标准箱', unit: '吨', unitPriceExclTax: 12800, unitPriceInclTax: 14464 },
  { id: 'P_YY_5', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.OutProvince, customerName: '广西中烟', productName: '再造烟叶E', productCode: 'YY202601030', brandGrade: '外加纤维', specification: '定制箱', unit: '吨', unitPriceExclTax: 15500, unitPriceInclTax: 17515 },
  { id: 'P_YY_6', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.OutProvince, customerName: '广西中烟', productName: '再造烟叶F', productCode: 'YY202601031', brandGrade: 'SXGX699', specification: '标准箱', unit: '吨', unitPriceExclTax: 13600, unitPriceInclTax: 15368 },
  { id: 'P_YY_7', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.OutProvince, customerName: '山东中烟', productName: '再造烟叶G', productCode: 'YY202601032', brandGrade: 'JSN18', specification: '标准箱', unit: '吨', unitPriceExclTax: 12900, unitPriceInclTax: 14577 },
  { id: 'P_YY_8', productType: ProductType.ReconstitutedTobacco, sourceRegion: RegionType.OutProvince, customerName: '山东中烟', productName: '再造烟叶H', productCode: 'YY20260033', brandGrade: 'JSS06', specification: '定制箱', unit: '吨', unitPriceExclTax: 14800, unitPriceInclTax: 16724 },

  // 再造梗丝 (GS)
  { id: 'P_GS_1', productType: ProductType.ReconstitutedStem, sourceRegion: RegionType.InProvince, customerName: '江苏中烟', productName: '再造梗丝A', productCode: 'GS20260001', brandGrade: 'GS22', specification: '20kg/包', unit: '吨', unitPriceExclTax: 8500, unitPriceInclTax: 9605 },
  { id: 'P_GS_2', productType: ProductType.ReconstitutedStem, sourceRegion: RegionType.InProvince, customerName: '江苏中烟', productName: '再造梗丝B', productCode: 'GS20260007', brandGrade: 'GS60', specification: '25kg/包', unit: '吨', unitPriceExclTax: 9200, unitPriceInclTax: 10396 },
  { id: 'P_GS_3', productType: ProductType.ReconstitutedStem, sourceRegion: RegionType.OutProvince, customerName: '吉林烟草', productName: '再造梗丝C', productCode: 'GS20260021', brandGrade: 'GS30', specification: '20kg/包', unit: '吨', unitPriceExclTax: 8800, unitPriceInclTax: 9944 },
  { id: 'P_GS_4', productType: ProductType.ReconstitutedStem, sourceRegion: RegionType.OutProvince, customerName: '吉林烟草', productName: '再造梗丝D', productCode: 'GS20260028', brandGrade: 'GS01', specification: '25kg/包', unit: '吨', unitPriceExclTax: 9500, unitPriceInclTax: 10735 },
  { id: 'P_GS_5', productType: ProductType.ReconstitutedStem, sourceRegion: RegionType.OutProvince, customerName: '深圳烟草', productName: '再造梗丝E', productCode: 'GS20260032', brandGrade: 'SXSZ801', specification: '20kg/包', unit: '吨', unitPriceExclTax: 8600, unitPriceInclTax: 9718 },
  { id: 'P_GS_6', productType: ProductType.ReconstitutedStem, sourceRegion: RegionType.OutProvince, customerName: '深圳烟草', productName: '再造梗丝F', productCode: 'GS20260037', brandGrade: 'SXGX808', specification: '25kg/包', unit: '吨', unitPriceExclTax: 9100, unitPriceInclTax: 10283 },

  // 香精香料 (X)
  { id: 'P_X_1', productType: ProductType.FlavorAndFragrance, sourceRegion: RegionType.InProvince, customerName: '江苏中烟', productName: '香精香料A', productCode: 'X20260001', brandGrade: 'NX0220X18', specification: '20L/桶', unit: '吨', unitPriceExclTax: 52000, unitPriceInclTax: 58760 },
  { id: 'P_X_2', productType: ProductType.FlavorAndFragrance, sourceRegion: RegionType.OutProvince, customerName: '河南新桥', productName: '香精香料B', productCode: 'X20260002', brandGrade: 'GL2 (合作加工)', specification: '25L/桶', unit: '吨', unitPriceExclTax: 58000, unitPriceInclTax: 65540 },
  { id: 'P_X_3', productType: ProductType.FlavorAndFragrance, sourceRegion: RegionType.OutProvince, customerName: '广东中烟', productName: '香精香料C', productCode: 'X20260003', brandGrade: 'NX0160L20', specification: '20L/桶', unit: '吨', unitPriceExclTax: 54500, unitPriceInclTax: 61585 },
  { id: 'P_X_4', productType: ProductType.FlavorAndFragrance, sourceRegion: RegionType.OutProvince, customerName: '广东中烟', productName: '香精香料D', productCode: 'X20260005', brandGrade: 'NC0120L10', specification: '10L/桶', unit: '吨', unitPriceExclTax: 62000, unitPriceInclTax: 70060 },
  { id: 'P_X_5', productType: ProductType.FlavorAndFragrance, sourceRegion: RegionType.OutProvince, customerName: '浙江中烟', productName: '香精香料E', productCode: 'X20260008', brandGrade: 'SC0220X25', specification: '25L/桶', unit: '吨', unitPriceExclTax: 51000, unitPriceInclTax: 57630 },
  { id: 'P_X_6', productType: ProductType.FlavorAndFragrance, sourceRegion: RegionType.OutProvince, customerName: '浙江中烟', productName: '香精香料F', productCode: 'X20260012', brandGrade: 'NC0075L11', specification: '10L/桶', unit: '吨', unitPriceExclTax: 63500, unitPriceInclTax: 71755 },
];
