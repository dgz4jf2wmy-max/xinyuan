import { Leaf, Factory, Beaker, Box, LucideIcon } from 'lucide-react';
import { MonthlyPlanStatus } from '../../../types/monthly-plan';
import { MonthlyProductionSalesDashboard } from '../../../types/monthly-production-sales-dashboard';

export const mockDashboardEntities: MonthlyProductionSalesDashboard[] = [
  // 再造烟叶
  { serialNumber: 1, status: '在执行', productType: '再造烟叶', brand: 'HBZY-10', brandRequirement: 200.0, brandTheoreticalProgress: 140.0, brandActualProgress: 130.0, subBrand: 'HBZY1001 (湖北中烟)', subBrandRequirement: 120.0, subBrandActualProgress: 80.0 },
  { serialNumber: 2, status: '在执行', productType: '再造烟叶', brand: 'HBZY-10', brandRequirement: 200.0, brandTheoreticalProgress: 140.0, brandActualProgress: 130.0, subBrand: 'HBZY1002 (河南中烟)', subBrandRequirement: 80.0, subBrandActualProgress: 50.0 },
  { serialNumber: 3, status: '待执行', productType: '再造烟叶', brand: 'JSN08', brandRequirement: 200.0, brandTheoreticalProgress: 0.0, brandActualProgress: 0.0, subBrand: 'JSN0801 (广西中烟)', subBrandRequirement: 150.0, subBrandActualProgress: 0.0 },
  { serialNumber: 4, status: '待执行', productType: '再造烟叶', brand: 'JSN08', brandRequirement: 200.0, brandTheoreticalProgress: 0.0, brandActualProgress: 0.0, subBrand: 'JSN0802 (黑龙江烟草)', subBrandRequirement: 50.0, subBrandActualProgress: 0.0 },

  // 再造梗丝
  { serialNumber: 5, status: '在执行', productType: '再造梗丝', brand: 'GS22', brandRequirement: 35.0, brandTheoreticalProgress: 25.0, brandActualProgress: 15.0,  subBrand: 'GS2201 (徐州卷烟厂)', subBrandRequirement: 35.0, subBrandActualProgress: 15.0 },
  { serialNumber: 6, status: '待执行', productType: '再造梗丝', brand: 'GS30', brandRequirement: 45.0, brandTheoreticalProgress: 0.0, brandActualProgress: 0.0,  subBrand: 'GS3001 (淮阴卷烟厂)', subBrandRequirement: 45.0, subBrandActualProgress: 0.0 },

  // 香精香料
  { serialNumber: 7, status: '在执行', productType: '香精香料', brand: 'NX0160L20', brandRequirement: 12.112, brandTheoreticalProgress: 10.0, brandActualProgress: 8.5, subBrand: 'NX0160L2001 (赣州卷烟厂)', subBrandRequirement: 3.760, subBrandActualProgress: 3.760 },
  { serialNumber: 8, status: '在执行', productType: '香精香料', brand: 'NX0160L20', brandRequirement: 12.112, brandTheoreticalProgress: 10.0, brandActualProgress: 8.5, subBrand: 'NX0160L2002 (哈尔滨厂)', subBrandRequirement: 5.352, subBrandActualProgress: 4.0 },
  { serialNumber: 9, status: '在执行', productType: '香精香料', brand: 'NX0160L20', brandRequirement: 12.112, brandTheoreticalProgress: 10.0, brandActualProgress: 8.5, subBrand: 'NX0160L2003 (柳州卷烟厂)', subBrandRequirement: 1.050, subBrandActualProgress: 0.740 },
  { serialNumber: 10, status: '在执行', productType: '香精香料', brand: 'NX0160L20', brandRequirement: 12.112, brandTheoreticalProgress: 10.0, brandActualProgress: 8.5, subBrand: 'NX0160L2004 (延安卷烟厂)', subBrandRequirement: 1.950, subBrandActualProgress: 0.0 },

  { serialNumber: 11, status: '已执行', productType: '香精香料', brand: 'NX0160X20', brandRequirement: 4.702, brandTheoreticalProgress: 4.702, brandActualProgress: 4.702, subBrand: 'NX0160X2001 (赣州卷烟厂)', subBrandRequirement: 1.430, subBrandActualProgress: 1.430 },
  { serialNumber: 12, status: '已执行', productType: '香精香料', brand: 'NX0160X20', brandRequirement: 4.702, brandTheoreticalProgress: 4.702, brandActualProgress: 4.702, subBrand: 'NX0160X2002 (哈尔滨厂)', subBrandRequirement: 2.082, subBrandActualProgress: 2.082 },
  { serialNumber: 13, status: '已执行', productType: '香精香料', brand: 'NX0160X20', brandRequirement: 4.702, brandTheoreticalProgress: 4.702, brandActualProgress: 4.702, subBrand: 'NX0160X2003 (柳州卷烟厂)', subBrandRequirement: 0.440, subBrandActualProgress: 0.440 },
  { serialNumber: 14, status: '已执行', productType: '香精香料', brand: 'NX0160X20', brandRequirement: 4.702, brandTheoreticalProgress: 4.702, brandActualProgress: 4.702, subBrand: 'NX0160X2004 (延安卷烟厂)', subBrandRequirement: 0.750, subBrandActualProgress: 0.750 },

  // 月度醇化
  { serialNumber: 15, status: '在执行', productType: '月度醇化', brand: 'GS60', brandRequirement: 4037, brandTheoreticalProgress: 2500, brandActualProgress: 2100, subBrand: 'GS6001 (徐州卷烟厂)', subBrandRequirement: 3000, subBrandActualProgress: 1500 },
  { serialNumber: 16, status: '在执行', productType: '月度醇化', brand: 'GS60', brandRequirement: 4037, brandTheoreticalProgress: 2500, brandActualProgress: 2100, subBrand: 'GS6002 (徐州卷烟厂)', subBrandRequirement: 1037, subBrandActualProgress: 600 },
  { serialNumber: 17, status: '待执行', productType: '月度醇化', brand: 'GS01', brandRequirement: 2600, brandTheoreticalProgress: 0.0, brandActualProgress: 0.0, subBrand: 'GS0101 (南京卷烟厂)', subBrandRequirement: 2000, subBrandActualProgress: 0.0 },
  { serialNumber: 18, status: '待执行', productType: '月度醇化', brand: 'GS01', brandRequirement: 2600, brandTheoreticalProgress: 0.0, brandActualProgress: 0.0, subBrand: 'GS0102 (南京卷烟厂)', subBrandRequirement: 600, subBrandActualProgress: 0.0 },
];

export const mockDashboardInfo = {
  planId: "monthly-2026-04",
  planName: "鑫源公司2026年4月份产销与醇化计划",
  status: '在执行',
  updateTime: "2026-04-25 14:32:05",
};

export interface DashboardSubBrand {
  id: string;
  subBrand: string;
  customer: string;
  requirement?: number;
  planned?: number;
  actual: number;
}

export interface DashboardBrand {
  id: string;
  brand: string;
  status: string;
  requirement: number;
  planned: number;
  actual: number;
  subs: DashboardSubBrand[];
}

export interface DashboardColumn {
  id: string;
  title: string;
  requirement: number;
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

// Convert entity list back to grouped mockDashboardData to avoid rewriting the whole dashboard UI from scratch
export function getDerivedDashboardData(): DashboardData {
  const columnsMap: Record<string, DashboardColumn> = {
    '再造烟叶': { id: 'yy', title: '再造烟叶', requirement: 0, planned: 0, actual: 0, unit: '吨', icon: Leaf, color: 'bg-[#67c23a]', textColor: 'text-[#67c23a]', brands: [] },
    '再造梗丝': { id: 'gs', title: '再造梗丝', requirement: 0, planned: 0, actual: 0, unit: '吨', icon: Factory, color: 'bg-[#e6a23c]', textColor: 'text-[#e6a23c]', brands: [] },
    '香精香料': { id: 'xj', title: '香精香料', requirement: 0, planned: 0, actual: 0, unit: '吨', icon: Beaker, color: 'bg-[#409eff]', textColor: 'text-[#409eff]', brands: [] },
    '月度醇化': { id: 'ch', title: '月度醇化', requirement: 0, planned: 0, actual: 0, unit: '箱', icon: Box, color: 'bg-[#909399]', textColor: 'text-[#909399]', brands: [] },
  };

  mockDashboardEntities.forEach((entity) => {
    let col = columnsMap[entity.productType];
    if (!col) return;

    let brand = col.brands.find(b => b.brand === entity.brand);
    if (!brand) {
      brand = {
        id: entity.brand,
        brand: entity.brand,
        status: entity.status,
        requirement: entity.brandRequirement,
        planned: entity.brandTheoreticalProgress,
        actual: entity.brandActualProgress,
        subs: []
      };
      col.brands.push(brand);
      col.requirement += brand.requirement;
      col.planned += brand.planned;
      col.actual += brand.actual;
    }

    // Extract customer from subBrand text if possible, e.g. "XX (YY)"
    let subBrandName = entity.subBrand;
    let customerName = '';
    const match = entity.subBrand.match(/^(.*)\s*\((.*)\)$/);
    if (match) {
      subBrandName = match[1].trim();
      customerName = match[2].trim();
    }

    brand.subs.push({
      id: entity.serialNumber.toString(),
      subBrand: subBrandName,
      customer: customerName,
      requirement: entity.subBrandRequirement,
      actual: entity.subBrandActualProgress
    });
  });

  return {
    ...mockDashboardInfo,
    columns: Object.values(columnsMap)
  };
}


