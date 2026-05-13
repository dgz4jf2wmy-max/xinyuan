import { MonthlyProductionArrangement, OtherProductionArrangement } from '../../../types/production/execution/monthlyTask';

export const mockBlendLibrary = ['JSN08', 'JSN18'];

export interface PlanItem {
  id: string;
  source: string;
  type: string;
  subType: string;
  productName: string;
  amount: number;
  unit: string;
  deadline: string;
  note?: string;
  target?: string;
  flavorDetails?: any[];
}

export const initialReconPlans: PlanItem[] = [
  { id: 'P-ZZ-001', source: '再造单', type: '再造梗丝', subType: '省内', productName: 'GS22', amount: 35, unit: '吨', deadline: '-', note: '具体按配方单执行' },
  { id: 'P-ZZ-002', source: '再造单', type: '再造梗丝', subType: '省内', productName: 'GS60', amount: 90, unit: '吨', deadline: '-', note: '具体按配方单执行' },
  { id: 'P-ZZ-003', source: '再造单', type: '再造烟叶', subType: '省外', productName: 'JSN08', amount: 200, unit: '吨', deadline: '-', note: '需在HBZY-10前生产' },
  { id: 'P-ZZ-004', source: '再造单', type: '多孔颗粒', subType: '省外', productName: '多孔颗粒', amount: 25, unit: '吨', deadline: '-', note: '具体按配方单执行' },
  { id: 'P-OT-001', source: '再造单', type: '再造梗丝', subType: '省外', productName: 'SXSZ801', amount: 2, unit: '批次', deadline: '-', note: '梗丝结束前开展' },
  { id: 'P-OT-002', source: '再造单', type: '再造烟叶', subType: '省外', productName: 'JSN08', amount: 1, unit: '批次', deadline: '-', note: '需在HBZY-10前开展' },
  { id: 'P-OT-003', source: '再造单', type: '再造原料', subType: '-', productName: '烟末筛分', amount: 100, unit: '吨', deadline: '-', note: '以实际备料执行' },
];

export const initialFlavorPlans: PlanItem[] = [
  { id: 'P-XJ-001', source: '香精单', type: '料液', subType: '省内', productName: 'SC0280L24', amount: 0.3, unit: '吨', deadline: '2026-02-26', target: '徐州' },
  { id: 'P-XJ-002', source: '香精单', type: '料液', subType: '省内', productName: 'NC0220L05', amount: 1.8, unit: '吨', deadline: '2026-02-26', target: '徐州' },
  { id: 'P-XJ-003', source: '香精单', type: '料液', subType: '合作加工', productName: 'NX0160L20', amount: 12.112, unit: '吨', deadline: '2026-02-07', target: '多地发货' },
  { id: 'P-XJ-004', source: '香精单', type: '料液', subType: '省内', productName: 'C66110', amount: 10, unit: '吨', deadline: '2026-02-07', target: '新桥' },
  { id: 'P-XJ-005', source: '香精单', type: '料液', subType: '省内', productName: 'C08026', amount: 2, unit: '吨', deadline: '2026-02-07', target: '新桥' },
];
