import { ForemanHandoverSubmit } from '../../types/production/execution/foremanHandoverSubmit';

export const initialForemanHandoverSubmitData: ForemanHandoverSubmit = {
  currentShiftType: "丙",
  currentWorkShop: "2",
  currentShiftName: "夜班",
  nextShiftType: "乙",
  nextWorkShop: "1",
  nextShiftName: "早班",
  expectedAttendance: "20",
  actualAttendance: "19",
  remark: "彭春芹常白班",

  brand: "HBZY-10 (河北)",
  packVolume: "0",
  planVolume: "0",
  accVolume: "0",
  remainingVolume: "0",

  internalImpactHours: "8",
  externalImpactHours: "0",

  packBoxCount: "0",
  packBoxWeight: "150",
  waterUsage: "322",

  stemBatchCount: "2",
  stemPerBatch: "2065",
  stemTotal: "4130",

  dustBatchCount: "2",
  dustPerBatch: "1640",
  dustTotal: "3280",

  softwoodPulp: "0",
  hardwoodPulp: "0",
  calciumCarbonate: "0",
  guarGum: "0",
  flavor: "396.8",
  propyleneGlycol: "64",
  honey: "77",
  citricAcid: "0",
  sugars: "0",

  reblendVolume: "0",
  packFraction: "0",
  beltScaleFlow: "0",

  cartonReceived: "0",
  cartonConsumed: "0",
  cartonWasted: "0",

  innerBagReceived: "0",
  innerBagConsumed: "0",
  innerBagWasted: "0",

  centrifugeResidue: "0",
  ashRod: "350",
  blackLiquorCount: "0",

  startWaterMeter: "1765779",
  endWaterMeter: "1766101",

  equipmentStatus: "",
  qualityStatus: "",
  onsiteStatus: "",
  otherStatus: ""
};
