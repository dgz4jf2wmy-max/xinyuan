export interface ForemanHandoverSubmit {
  currentShiftType: string;
  currentWorkShop: string; 
  currentShiftName: string; 
  nextShiftType: string; 
  nextWorkShop: string; 
  nextShiftName: string; 
  expectedAttendance: string;
  actualAttendance: string;
  remark: string;

  brand: string;
  packVolume: string;
  planVolume: string;
  accVolume: string;
  remainingVolume: string;

  internalImpactHours: string;
  externalImpactHours: string;

  packBoxCount: string;
  packBoxWeight: string;
  waterUsage: string;

  stemBatchCount: string;
  stemPerBatch: string;
  stemTotal: string;

  dustBatchCount: string;
  dustPerBatch: string;
  dustTotal: string;

  softwoodPulp: string;
  hardwoodPulp: string;
  calciumCarbonate: string;
  guarGum: string;
  flavor: string;
  propyleneGlycol: string;
  honey: string;
  citricAcid: string;
  sugars: string;

  reblendVolume: string;
  packFraction: string;
  beltScaleFlow: string;

  cartonReceived: string;
  cartonConsumed: string;
  cartonWasted: string;

  innerBagReceived: string;
  innerBagConsumed: string;
  innerBagWasted: string;

  centrifugeResidue: string;
  ashRod: string;
  blackLiquorCount: string;

  startWaterMeter: string;
  endWaterMeter: string;

  equipmentStatus: string;
  qualityStatus: string;
  onsiteStatus: string;
  otherStatus: string;
}
