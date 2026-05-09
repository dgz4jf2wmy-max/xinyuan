export interface TempBlendingRecord {
  id: string;
  recordNo: string;
  applyDate: string;
  applicant: string;
  department: string;
  materialType: string;
  blendingQuantity: number;
  reason: string;
  status: 'DRAFT' | 'APPROVING' | 'APPROVED' | 'REJECTED';
}
