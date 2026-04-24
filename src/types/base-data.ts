/**
 * 基础数据维护
 */

/**
 * 生产类型枚举（全量 16 种）
 */
export enum ProductionTypeEnum {
  // 香精香料 (4)
  FlavorEntrusted = '香精香料受托加工',
  FlavorProvincialTrial = '香精香料省公司试验',
  FlavorIndependentTrial = '香精香料自主试验',
  FlavorCentralizedMixing = '香精香料集中调配',

  // 再造烟叶 (7)
  TobaccoRecipeFinished = '再造烟叶配方生产（成品）',
  TobaccoRecipeSemi = '再造烟叶配方生产（自制半成品）',
  TobaccoIndependentTrial = '再造烟叶自主试验',
  TobaccoTurnBox = '再造烟叶翻箱',
  TobaccoAgeing = '再造烟叶醇化',
  TobaccoStemExtract = '再造烟叶省内梗丝回填液',
  TobaccoAshSieving = '再造烟叶烟灰原料筛分',

  // 再造梗丝 (5)
  StemRecipeFinished = '再造梗丝配方生产（成品）',
  StemRecipeSemi = '再造梗丝配方生产（自制半成品）',
  StemIndependentTrial = '再造梗丝自主试验',
  StemAgeing = '再造梗丝醇化',
  StemPreMix = '再造梗丝预混',
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
