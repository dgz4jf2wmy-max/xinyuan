import { ProductionDailyReport, ProductionWeeklyReport, ProductionMonthlyReport } from '../../../types/production/statistics/report';

export const mockProductionDailyReports: ProductionDailyReport[] = [
  {
    id: 1,
    status: '待提交',
    reportNo: 'SCRB-20260514',
    reportName: '2026年05月14日_生产日报',
    submitter: '张三',
    submitTime: '2026-05-14 18:00:00'
  },
  {
    id: 2,
    status: '待审核',
    reportNo: 'SCRB-20260513',
    reportName: '2026年05月13日_生产日报',
    submitter: '李四',
    submitTime: '2026-05-13 18:05:00'
  },
  {
    id: 3,
    status: '已发布',
    reportNo: 'SCRB-20260512',
    reportName: '2026年05月12日_生产日报',
    submitter: '王二',
    submitTime: '2026-05-12 18:10:00'
  },
  {
    id: 4,
    status: '已发布',
    reportNo: 'SCRB-20260511',
    reportName: '2026年05月11日_生产日报',
    submitter: '马五',
    submitTime: '2026-05-11 18:01:00'
  }
];

export const mockProductionWeeklyReports: ProductionWeeklyReport[] = [
  {
    id: 1,
    status: '待提交',
    reportNo: 'SCZB-202605W02',
    reportName: '2026年05月第02周_生产周报',
    submitter: '王五',
    submitTime: '2026-05-10 18:00:00'
  },
  {
    id: 2,
    status: '待审核',
    reportNo: 'SCZB-202605W01',
    reportName: '2026年05月第01周_生产周报',
    submitter: '赵六',
    submitTime: '2026-05-03 17:50:00'
  },
  {
    id: 3,
    status: '已发布',
    reportNo: 'SCZB-202604W04',
    reportName: '2026年04月第04周_生产周报',
    submitter: '王二',
    submitTime: '2026-04-26 18:10:00'
  }
];

export const mockProductionMonthlyReports: ProductionMonthlyReport[] = [
  {
    id: 1,
    status: '待提交',
    reportNo: 'SCYB-202605',
    reportName: '2026年05月_生产月报',
    submitter: '钱七',
    submitTime: '2026-05-31 18:00:00'
  },
  {
    id: 2,
    status: '待审核',
    reportNo: 'SCYB-202604',
    reportName: '2026年04月_生产月报',
    submitter: '孙八',
    submitTime: '2026-04-30 18:00:00'
  },
  {
    id: 3,
    status: '已发布',
    reportNo: 'SCYB-202603',
    reportName: '2026年03月_生产月报',
    submitter: '王二',
    submitTime: '2026-03-31 18:15:00'
  }
];
