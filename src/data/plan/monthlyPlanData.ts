import { 
  MonthlyProductionPlanBase, 
  MonthlyPlanStatus,
} from '../../types/monthly-plan';
import { ProductionTypeEnum } from '../../types/base-data';

export const mockMonthlyProductionPlans: MonthlyProductionPlanBase[] = [
  {
    id: 'monthly-2026-04',
    sequenceNumber: 1,
    planName: '鑫源公司2026年4月份产销计划',
    status: MonthlyPlanStatus.Draft,
    creator: '张建国',
    createTime: '2026-03-20 10:20:00',
    planList: [
      {
        id: 'tb-2026-04-1',
        sequenceNumber: 1,
        productType: '再造梗丝',
        brandGrade: 'GS22',
        productionVolume: 35,
        remarks: '四月份省内梗丝主推型号'
      },
      {
        id: 'tb-2026-04-2',
        sequenceNumber: 2,
        productType: '再造烟叶',
        brandGrade: 'HBZY-10',
        productionVolume: 120,
        remarks: '需协调外部原料'
      }
    ],
    details: [
      {
         id: 'dt-2026-04-1',
         productType: '再造梗丝',
         productionType: ProductionTypeEnum.StemRecipeFinished,
         productName: '再造梗丝（省内）',
         productCode: '010210001',
         customerName: '江苏中烟工业有限责任公司',
         brandGrade: 'GS22',
         specification: '15',
         requirementAmount: 35,
         unit: '吨',
         unitPriceExclTax: 12000,
         unitPriceInclTax: 13560,
         amountExclTax: 420000,
         expectedCompletionDate: '2026-04-15',
         deliveryDate: '2026-04-20',
         deliveryLocation: '江苏省南京市',
         applicantName: '李建国',
         applicantDepartment: '计划部',
         subBrandGrade: 'GS2201',
         applicationLedgerId: 'pool-1'
      }
    ]
  },
  {
    id: 'monthly-2026-03',
    sequenceNumber: 2,
    planName: '鑫源公司2026年3月份产销计划',
    status: MonthlyPlanStatus.PendingImprovement,
    creator: '张建国',
    createTime: '2026-02-21 09:15:22',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2026-02',
    sequenceNumber: 3,
    planName: '鑫源公司2026年2月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '张建国',
    createTime: '2026-01-22 14:05:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2026-01',
    sequenceNumber: 4,
    planName: '鑫源公司2026年1月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-12-20 16:30:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-12',
    sequenceNumber: 5,
    planName: '鑫源公司2025年12月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-11-21 11:20:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-11',
    sequenceNumber: 6,
    planName: '鑫源公司2025年11月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-10-22 09:00:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-10',
    sequenceNumber: 7,
    planName: '鑫源公司2025年10月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-09-20 10:45:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-09',
    sequenceNumber: 8,
    planName: '鑫源公司2025年9月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '张建国',
    createTime: '2025-08-21 15:30:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-08',
    sequenceNumber: 9,
    planName: '鑫源公司2025年8月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '张建国',
    createTime: '2025-07-20 08:30:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-07',
    sequenceNumber: 10,
    planName: '鑫源公司2025年7月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '张建国',
    createTime: '2025-06-22 17:15:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-06',
    sequenceNumber: 11,
    planName: '鑫源公司2025年6月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '张建国',
    createTime: '2025-05-20 10:20:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-05',
    sequenceNumber: 12,
    planName: '鑫源公司2025年5月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-04-23 09:20:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-04',
    sequenceNumber: 13,
    planName: '鑫源公司2025年4月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-03-21 10:50:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-03',
    sequenceNumber: 14,
    planName: '鑫源公司2025年3月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-02-21 13:20:00',
    planList: [],
    details: []
  },
  {
    id: 'monthly-2025-02',
    sequenceNumber: 15,
    planName: '鑫源公司2025年2月份产销计划',
    status: MonthlyPlanStatus.Published,
    creator: '刘伟',
    createTime: '2025-01-20 14:10:00',
    planList: [],
    details: []
  }
];

export const getMonthlyPlanPage = async (params: any) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let list = [...mockMonthlyProductionPlans];
  
  if (params.status) {
    list = list.filter(item => item.status === params.status);
  }
  if (params.planName) {
    list = list.filter(item => item.planName.includes(params.planName));
  }
  
  const total = list.length;
  // pagination
  const { pageNum = 1, pageSize = 10 } = params;
  list = list.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  
  return {
    list,
    total
  };
};
