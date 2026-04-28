import { Leaf, Factory, Beaker, Box, LucideIcon } from 'lucide-react';
import { MonthlyPlanStatus } from '../../../types/monthly-plan';

export interface DashboardSubBrand {
  id: string;
  subBrand: string;
  customer: string;
  planned: number;
  actual: number;
}

export interface DashboardBrand {
  id: string;
  brand: string;
  planned: number;
  actual: number;
  subs: DashboardSubBrand[];
}

export interface DashboardColumn {
  id: string;
  title: string;
  planned: number;
  actual: number;
  unit: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  brands: DashboardBrand[];
}

export interface DashboardData {
  planId: string;
  planName: string;
  status: string;
  updateTime: string;
  columns: DashboardColumn[];
}

export const mockDashboardData: DashboardData = {
  planId: "monthly-2026-04",
  planName: "鑫源公司2026年4月份产销与醇化计划",
  status: MonthlyPlanStatus.Published,
  updateTime: "2026-04-25 14:32:05",
  columns: [
    {
      id: 'yy', title: '再造烟叶', planned: 400.0, actual: 355.0, unit: '吨', icon: Leaf, color: 'bg-[#67c23a]', textColor: 'text-[#67c23a]',
      brands: [
        {
          id: 'yy1', brand: 'HBZY-10', planned: 200.0, actual: 160.0,
          subs: [
            { id: 'yy1-1', subBrand: 'HBZY1001', customer: '湖北中烟', planned: 120.0, actual: 100.0 },
            { id: 'yy1-2', subBrand: 'HBZY1002', customer: '河南中烟', planned: 80.0, actual: 60.0 },
          ]
        },
        {
          id: 'yy2', brand: 'JSN08', planned: 200.0, actual: 195.0,
          subs: [
            { id: 'yy2-1', subBrand: 'JSN0801', customer: '广西中烟', planned: 150.0, actual: 150.0 },
            { id: 'yy2-2', subBrand: 'JSN0802', customer: '黑龙江烟草', planned: 50.0, actual: 45.0 },
          ]
        }
      ]
    },
    {
      id: 'gs', title: '再造梗丝', planned: 80.0, actual: 19.7, unit: '吨', icon: Factory, color: 'bg-[#e6a23c]', textColor: 'text-[#e6a23c]',
      brands: [
        {
          id: 'gs1', brand: 'GS22', planned: 35.0, actual: 15.0,
          subs: [
            { id: 'gs1-1', subBrand: 'GS2201', customer: '徐州卷烟厂', planned: 35.0, actual: 15.0 },
          ]
        },
        {
          id: 'gs2', brand: 'GS30', planned: 45.0, actual: 4.7,
          subs: [
            { id: 'gs2-1', subBrand: 'GS3001', customer: '淮阴卷烟厂', planned: 45.0, actual: 4.7 },
          ]
        }
      ]
    },
    {
      id: 'xj', title: '香精香料', planned: 16.814, actual: 8.5, unit: '吨', icon: Beaker, color: 'bg-[#409eff]', textColor: 'text-[#409eff]',
      brands: [
        {
          id: 'xj1', brand: 'NX0160L20', planned: 12.112, actual: 8.5,
          subs: [
            { id: 'xj1-1', subBrand: 'NX0160L2001', customer: '赣州卷烟厂', planned: 3.760, actual: 3.760 },
            { id: 'xj1-2', subBrand: 'NX0160L2002', customer: '哈尔滨厂', planned: 5.352, actual: 4.000 },
            { id: 'xj1-3', subBrand: 'NX0160L2003', customer: '柳州卷烟厂', planned: 1.050, actual: 0.740 },
            { id: 'xj1-4', subBrand: 'NX0160L2004', customer: '延安卷烟厂', planned: 1.950, actual: 0.000 },
          ]
        },
        {
          id: 'xj2', brand: 'NX0160X20', planned: 4.702, actual: 0.0,
          subs: [
            { id: 'xj2-1', subBrand: 'NX0160X2001', customer: '赣州卷烟厂', planned: 1.430, actual: 0.0 },
            { id: 'xj2-2', subBrand: 'NX0160X2002', customer: '哈尔滨厂', planned: 2.082, actual: 0.0 },
            { id: 'xj2-3', subBrand: 'NX0160X2003', customer: '柳州卷烟厂', planned: 0.440, actual: 0.0 },
            { id: 'xj2-4', subBrand: 'NX0160X2004', customer: '延安卷烟厂', planned: 0.750, actual: 0.0 },
          ]
        }
      ]
    },
    {
      id: 'ch', title: '月度醇化', planned: 6637, actual: 4700, unit: '箱', icon: Box, color: 'bg-[#909399]', textColor: 'text-[#909399]',
      brands: [
        {
          id: 'ch1', brand: 'GS60', planned: 4037, actual: 2100,
          subs: [
            { id: 'ch1-1', subBrand: 'GS6001', customer: '徐州卷烟厂', planned: 3000, actual: 1500 },
            { id: 'ch1-2', subBrand: 'GS6002', customer: '徐州卷烟厂', planned: 1037, actual: 600 },
          ]
        },
        {
          id: 'ch2', brand: 'GS01', planned: 2600, actual: 2600,
          subs: [
            { id: 'ch2-1', subBrand: 'GS0101', customer: '南京卷烟厂', planned: 2000, actual: 2000 },
            { id: 'ch2-2', subBrand: 'GS0102', customer: '南京卷烟厂', planned: 600, actual: 600 },
          ]
        }
      ]
    }
  ]
};

