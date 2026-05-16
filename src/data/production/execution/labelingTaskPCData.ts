export const mockPCLabelingTasks = [
  {
    id: 1,
    taskNo: 'TBRW-GS60-20260515-001',
    productionTaskNo: 'SCRW-GS60-05-001',
    productType: '再造烟叶',
    brandCode: 'GS60',
    productCode: 'P-GS6001',
    subBrandCode: 'GS6001',
    specification: '单组分',
    requiredVolume: 120.00,
    initialRequiredVolume: 120.00,
    appliedCompletionVolume: 0.00,
    unit: '吨',
    expectedCompletionTime: '2026-05-15',
    arrivalTime: '2026-05-14',
    arrivalLocation: '一号发货点',
  },
  {
    id: 2,
    taskNo: 'TBRW-GS60-20260515-002',
    productionTaskNo: 'SCRW-GS60-05-002',
    productType: '再造梗丝',
    brandCode: 'GS60',
    productCode: 'P-GS6002',
    subBrandCode: 'GS6002',
    specification: '多组分',
    requiredVolume: 80.00,
    initialRequiredVolume: 80.00,
    appliedCompletionVolume: 10.00,
    unit: '吨',
    expectedCompletionTime: '2026-05-15',
    arrivalTime: '2026-05-14',
    arrivalLocation: '二号发货点',
  },
  {
    id: 3,
    taskNo: 'TBRW-GS01-20260515-003',
    productionTaskNo: 'SCRW-GS01-05-003',
    productType: '再造烟叶',
    brandCode: 'GS01',
    productCode: 'P-GS0101',
    subBrandCode: 'GS0101',
    specification: '单组分',
    requiredVolume: 50.00,
    initialRequiredVolume: 50.00,
    appliedCompletionVolume: 15.00,
    unit: '吨',
    expectedCompletionTime: '2026-05-15',
    arrivalTime: '2026-05-14',
    arrivalLocation: '一号发货点',
  },
  {
    id: 4,
    taskNo: 'TBRW-GS30-20260515-004',
    productionTaskNo: 'SCRW-GS30-05-004',
    productType: '再造梗丝',
    brandCode: 'GS30',
    productCode: 'P-GS3001',
    subBrandCode: 'GS3001',
    specification: '多组分',
    requiredVolume: 200.00,
    initialRequiredVolume: 200.00,
    appliedCompletionVolume: 200.00,
    unit: '吨',
    expectedCompletionTime: '2026-05-15',
    arrivalTime: '2026-05-14',
    arrivalLocation: '二号发货点',
  },
  {
    id: 5,
    taskNo: 'TBRW-JSZ11-20260515-005',
    productionTaskNo: 'SCRW-JSZ11-05-005',
    productType: '再造烟叶',
    brandCode: 'JSZ11',
    productCode: 'P-JSZ1101',
    subBrandCode: 'JSZ1101',
    specification: '单组分',
    requiredVolume: 100.00,
    initialRequiredVolume: 100.00,
    appliedCompletionVolume: 45.00,
    unit: '吨',
    expectedCompletionTime: '2026-05-15',
    arrivalTime: '2026-05-14',
    arrivalLocation: '一号发货点',
  }
];

export const mockPCLabelingTaskRecords = [
  {
    id: 1,
    taskNo: 'TBRW-GS01-20260515-003',
    warehousingNo: 'RK-20260515-0001',
    applicant: '张三',
    applyTime: '2026-05-15 09:30:00'
  },
  {
    id: 2,
    taskNo: 'TBRW-GS30-20260515-004',
    warehousingNo: 'RK-20260515-0002',
    applicant: '李四',
    applyTime: '2026-05-15 10:15:00'
  },
  {
    id: 3,
    taskNo: 'TBRW-GS30-20260515-004',
    warehousingNo: 'RK-20260515-0003',
    applicant: '李四',
    applyTime: '2026-05-15 14:20:00'
  },
  {
    id: 4,
    taskNo: 'TBRW-JSZ11-20260515-005',
    warehousingNo: 'RK-20260515-0004',
    applicant: '王五',
    applyTime: '2026-05-15 11:00:00'
  },
  {
    id: 5,
    taskNo: 'TBRW-GS60-20260515-002',
    warehousingNo: 'RK-20260515-0005',
    applicant: '赵六',
    applyTime: '2026-05-16 09:00:00'
  }
];

export const getPCLabelingTasksByBrand = (brandCode: string) => {
  return mockPCLabelingTasks.filter(item => item.brandCode === brandCode);
};

export const getPCRecordsByTaskNo = (taskNo: string) => {
  return mockPCLabelingTaskRecords.filter(item => item.taskNo === taskNo).sort((a, b) => new Date(b.applyTime).getTime() - new Date(a.applyTime).getTime());
};
