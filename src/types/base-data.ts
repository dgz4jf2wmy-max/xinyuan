/**
 * 基础数据维护
 */

/**
 * 生产类型条目接口
 */
export interface ProductionType {
  id: string;
  order: number;
  productType: string;
  productionType: string;
}

/**
 * 生产类型枚举（全量 16 种）
 */
export enum ProductionTypeEnum {
  // 香精香料 (4)
  FlavorEntrusted = '受托加工',
  FlavorProvincialTrial = '省公司试验',
  FlavorIndependentTrial = '自主试验',
  FlavorCentralizedMixing = '集中调配',

  // 再造烟叶 (7)
  TobaccoRecipeFinished = '配方生产（成品）',
  TobaccoRecipeSemi = '配方生产（自制半成品）',
  TobaccoIndependentTrial = '自主试验',
  TobaccoTurnBox = '翻箱',
  TobaccoAgeing = '醇化',
  TobaccoStemExtract = '省内梗丝回填液',
  TobaccoAshSieving = '烟灰原料筛分',

  // 再造梗丝 (5)
  StemRecipeFinished = '配方生产（成品）',
  StemRecipeSemi = '配方生产（自制半成品）',
  StemIndependentTrial = '自主试验',
  StemAgeing = '醇化',
  StemPreMix = '预混',
}

/**
 * 按照产品类型（ProductType）划分的生产类型映射
 */
export const ProductionTypeByProductCategory: Record<string, ProductionTypeEnum[]> = {
  '香精香料': [
    ProductionTypeEnum.FlavorEntrusted,
    ProductionTypeEnum.FlavorProvincialTrial,
    ProductionTypeEnum.FlavorIndependentTrial,
    ProductionTypeEnum.FlavorCentralizedMixing,
  ],
  '再造烟叶': [
    ProductionTypeEnum.TobaccoRecipeFinished,
    ProductionTypeEnum.TobaccoRecipeSemi,
    ProductionTypeEnum.TobaccoIndependentTrial,
    ProductionTypeEnum.TobaccoTurnBox,
    ProductionTypeEnum.TobaccoAgeing,
    ProductionTypeEnum.TobaccoStemExtract,
    ProductionTypeEnum.TobaccoAshSieving,
  ],
  '再造梗丝': [
    ProductionTypeEnum.StemRecipeFinished,
    ProductionTypeEnum.StemRecipeSemi,
    ProductionTypeEnum.StemIndependentTrial,
    ProductionTypeEnum.StemAgeing,
    ProductionTypeEnum.StemPreMix,
  ]
};

/**
 * 入池申请表单及月度产销明细限制的 8 种有效生产类型
 */
export type RestrictedProductionType = 
  | ProductionTypeEnum.FlavorEntrusted
  | ProductionTypeEnum.FlavorCentralizedMixing
  | ProductionTypeEnum.TobaccoRecipeFinished
  | ProductionTypeEnum.TobaccoRecipeSemi
  | ProductionTypeEnum.TobaccoAgeing
  | ProductionTypeEnum.StemRecipeFinished
  | ProductionTypeEnum.StemRecipeSemi
  | ProductionTypeEnum.StemAgeing;

/**
 * 前端使用的下拉框常量（区分产品类型，同时只保留受限的8种）
 */
export const RestrictedProductionTypeByProductCategory: Record<string, RestrictedProductionType[]> = {
  '香精香料': [
    ProductionTypeEnum.FlavorEntrusted,
    ProductionTypeEnum.FlavorCentralizedMixing,
  ],
  '再造烟叶': [
    ProductionTypeEnum.TobaccoRecipeFinished,
    ProductionTypeEnum.TobaccoRecipeSemi,
    ProductionTypeEnum.TobaccoAgeing,
  ],
  '再造梗丝': [
    ProductionTypeEnum.StemRecipeFinished,
    ProductionTypeEnum.StemRecipeSemi,
    ProductionTypeEnum.StemAgeing,
  ]
};
