export interface MonthlyTaskDetailBaseInfo {
  id: number;
  taskNo: string;
  taskName: string;
  approvalStatus: string;
  executionStatus: string;
  month: number;
  currentVersion: string;
  creator: string;
  createTime: string;
  lastUpdateTime: string;
}

export interface MonthlyTaskDetailProductionArrangement {
  id: number;
  productionLine: string; // 再造原料, 香精香料
  productType: string;
  productionOrder: number;
  taskNo: string;
  productName: string;
  productCode: string;
  brand: string;
  productionVolume: number;
  completionDate: string;
  blendingQuantity: number;
  blendingRatio: number;
  duration?: number;
}

export interface MonthlyTaskDetailOtherArrangement {
  id: number;
  taskNo: string;
  productType: string;
  productName: string;
  productCode: string;
  brand: string;
  type: string;
  productionVolume: number;
  completionDate: string;
  duration?: number;
}

export interface MonthlyTaskDetailDemand {
  id: number;
  arrangementId: number; // 关联的 monthly/other arrangement 的 ID
  productType: string;
  productionType: string;
  productName: string;
  productCode: string;
  customerName: string;
  brandGrade: string;
  specification: string;
  requirementAmount: number;
  unit: string;
  expectedCompletionDate: string;
  deliveryDate: string;
  deliveryLocation: string;
  applicantName: string;
  applicantDepartment: string;
  subBrandGrade: string;
}

export interface MonthlyTaskDetailModel {
  baseInfo: MonthlyTaskDetailBaseInfo;
  productionArrangements: MonthlyTaskDetailProductionArrangement[];
  otherArrangements: MonthlyTaskDetailOtherArrangement[];
  demandDetails: MonthlyTaskDetailDemand[];
}
