import { ProductionStatisticsReport } from '../../../types/production/statistics/report';

export const mockProductionStatisticsReports: ProductionStatisticsReport[] = [
  {
    id: 1,
    status: '已发布',
    reportNo: 'SCTJ-20260514',
    reportName: '2026年05月14日_生产统计报表',
    submitter: '张三',
    submitTime: '2026-05-15 08:30:00'
  },
  {
    id: 2,
    status: '待审核',
    reportNo: 'SCTJ-20260515',
    reportName: '2026年05月15日_生产统计报表',
    submitter: '李四',
    submitTime: '2026-05-15 17:30:00'
  },
  {
    id: 3,
    status: '待提交',
    reportNo: 'SCTJ-20260516',
    reportName: '2026年05月16日_生产统计报表',
    submitter: '王五',
    submitTime: '2026-05-16 17:30:00'
  },
  {
    id: 4,
    status: '已发布',
    reportNo: 'SCTJ-20260513',
    reportName: '2026年05月13日_生产统计报表',
    submitter: '张三',
    submitTime: '2026-05-14 08:30:00'
  },
  {
    id: 5,
    status: '已发布',
    reportNo: 'SCTJ-20260512',
    reportName: '2026年05月12日_生产统计报表',
    submitter: '张三',
    submitTime: '2026-05-13 08:30:00'
  },
  {
    id: 6,
    status: '待审核',
    reportNo: 'SCTJ-20260511',
    reportName: '2026年05月11日_生产统计报表',
    submitter: '李四',
    submitTime: '2026-05-12 08:30:00'
  },
  {
    id: 7,
    status: '已发布',
    reportNo: 'SCTJ-20260510',
    reportName: '2026年05月10日_生产统计报表',
    submitter: '张三',
    submitTime: '2026-05-11 08:30:00'
  },
  {
    id: 8,
    status: '已发布',
    reportNo: 'SCTJ-20260509',
    reportName: '2026年05月09日_生产统计报表',
    submitter: '王五',
    submitTime: '2026-05-10 08:30:00'
  },
  {
    id: 9,
    status: '已发布',
    reportNo: 'SCTJ-20260508',
    reportName: '2026年05月08日_生产统计报表',
    submitter: '张三',
    submitTime: '2026-05-09 08:30:00'
  },
  {
    id: 10,
    status: '待提交',
    reportNo: 'SCTJ-20260507',
    reportName: '2026年05月07日_生产统计报表',
    submitter: '李四',
    submitTime: '2026-05-08 08:30:00'
  },
  {
    id: 11,
    status: '已发布',
    reportNo: 'SCTJ-20260506',
    reportName: '2026年05月06日_生产统计报表',
    submitter: '张三',
    submitTime: '2026-05-07 08:30:00'
  },
  {
    id: 12,
    status: '已发布',
    reportNo: 'SCTJ-20260505',
    reportName: '2026年05月05日_生产统计报表',
    submitter: '王五',
    submitTime: '2026-05-06 08:30:00'
  }
];

export const getProductionStatisticsReports = async (params: any) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  let result = [...mockProductionStatisticsReports];
  
  if (params.reportNo) {
    result = result.filter(item => item.reportNo.includes(params.reportNo));
  }
  if (params.status) {
    result = result.filter(item => item.status === params.status);
  }

  // Sort such that '待提交' appears first, then sort by submitTime descendingly.
  result.sort((a, b) => {
    if (a.status === '待提交' && b.status !== '待提交') return -1;
    if (a.status !== '待提交' && b.status === '待提交') return 1;
    return b.submitTime.localeCompare(a.submitTime);
  });

  const total = result.length;
  const start = (params.pageNum - 1) * params.pageSize;
  const end = start + params.pageSize;
  
  return {
    list: result.slice(start, end),
    total
  };
};