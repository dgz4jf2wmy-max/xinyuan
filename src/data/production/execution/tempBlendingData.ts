import { TempBlendingRecord } from '../../../types/production/execution/tempBlending';

export const mockTempBlendingRecords: TempBlendingRecord[] = [
  {
    id: 'TB2026-05-001',
    recordNo: 'HC2605001',
    applyDate: '2026-05-02',
    applicant: '张三',
    department: '生产一车间',
    materialType: '烟粉',
    blendingQuantity: 50,
    reason: '工艺要求需要临时调整配比',
    status: 'APPROVED',
  },
  {
    id: 'TB2026-05-002',
    recordNo: 'HC2605002',
    applyDate: '2026-05-05',
    applicant: '李四',
    department: '生产二车间',
    materialType: '烟梗',
    blendingQuantity: 100,
    reason: '库存盘点后临时补充',
    status: 'APPROVING',
  },
  {
    id: 'TB2026-05-003',
    recordNo: 'HC2605003',
    applyDate: '2026-05-06',
    applicant: '王五',
    department: '质检部',
    materialType: '碎烟片',
    blendingQuantity: 30,
    reason: '产品异常退回测试',
    status: 'DRAFT',
  }
];
