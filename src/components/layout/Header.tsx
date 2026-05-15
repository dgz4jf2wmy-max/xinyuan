import { Bell, Search, Maximize, Settings, UserCircle, Smartphone } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { menuItems } from './Sidebar';
import { mockMonthlyAgingPlans } from '../../data/plan/agingPlanData';
import { mockMonthlyProductionTasks } from '../../data/production/execution/monthlyTaskData';

const getRouteInfo = (pathname: string) => {
  if (pathname === '/') return { label: '首页' };
  
  // Search in menuItems first
  for (const group of menuItems) {
    if (group.children) {
      for (const child of group.children) {
        if (child.path === pathname) {
          return { parent: group.label, label: child.label };
        }
        // @ts-ignore
        if (child.children) {
          // @ts-ignore
          for (const sub of child.children) {
            if (sub.path === pathname) {
              return { parent: child.label, label: sub.label };
            }
          }
        }
      }
    } else if (group.path === pathname) {
      return { label: group.label };
    }
  }

  // Handle explicit non-menu known routes
  const extraRouteMap: Record<string, { parent?: string, label: string }> = {
    '/plan/annual/create': { parent: '计划管理', label: '年度产销计划编制' },
    '/plan/monthly/create': { parent: '计划管理', label: '新增月度产销计划' },
    '/plan/monthly/aging/create': { parent: '计划管理', label: '新增月度醇化计划' },
    '/production/scheduling/schedule/create': { parent: '班组排班表', label: '新建排班计划' },
    '/production/statistics/report/daily-edit': { parent: '生产汇报', label: '生产日报编辑' },
    '/production/statistics/report/daily-detail': { parent: '生产汇报', label: '生产日报详情' },
    '/production/statistics/report/weekly-edit': { parent: '生产汇报', label: '生产周报编辑' },
    '/production/statistics/report/weekly-detail': { parent: '生产汇报', label: '生产周报详情' },
    '/production/statistics/report/monthly-edit': { parent: '生产汇报', label: '生产月报编辑' },
    '/production/statistics/report/monthly-detail': { parent: '生产汇报', label: '生产月报详情' },
  };
  
  if (extraRouteMap[pathname]) return extraRouteMap[pathname];

  // Handle dynamic routes
  if (pathname.startsWith('/plan/monthly/aging/detail/')) {
    const id = pathname.split('/').pop();
    const plan = mockMonthlyAgingPlans.find(p => p.sequenceNumber === Number(id));
    return { parent: '计划管理', label: plan ? plan.planName : '2026年6月月度醇化计划' };
  }
  
  if (pathname.startsWith('/plan/monthly/aging/adjust/')) {
    const id = pathname.split('/').pop();
    const plan = mockMonthlyAgingPlans.find(p => p.sequenceNumber === Number(id));
    return { parent: '计划管理', label: plan ? plan.planName : '月度醇化计划调整' };
  }
  
  if (pathname.startsWith('/plan/monthly/detail/')) {
    return { parent: '月度产销计划', label: '鑫源公司2026年4月份产销计划' };
  }
  
  if (pathname.startsWith('/plan/monthly/adjust/')) {
    return { parent: '月度产销计划', label: '鑫源公司2026年4月份产销计划' };
  }
  
  if (pathname.startsWith('/plan/annual/detail/')) {
    const id = pathname.split('/').pop();
    let planName = '年度产销计划详情';
    if (id?.includes('2026')) planName = '鑫源公司2026年年度产销计划';
    else if (id?.includes('2025')) planName = '鑫源公司2025年年度产销计划';
    else if (id?.includes('2024')) planName = '鑫源公司2024年年度产销计划';
    else if (id?.includes('2023')) planName = '鑫源公司2023年年度产销计划';
    else if (id?.includes('2022')) planName = '鑫源公司2022年年度产销计划';
    return { parent: '计划管理', label: planName };
  }
  
  if (pathname.startsWith('/plan/annual/adjust/')) {
    return { parent: '计划管理', label: '年度产销计划调整' };
  }

  if (pathname.startsWith('/production/scheduling/schedule/detail/')) {
    return { parent: '班组排班表', label: '班组排班详情' };
  }
  
  if (pathname.startsWith('/production/scheduling/schedule/edit/')) {
    return { parent: '班组排班表', label: '班组排班调整' };
  }

  if (pathname.startsWith('/production/execution/temp-blending/detail/')) {
    return { parent: '生产执行', label: '临时回掺申请详情' };
  }

  if (pathname.startsWith('/production/handover/log/foreman-detail/')) {
    return { parent: '交接班日志', label: '工段长交接班报工详情' };
  }

  if (pathname.startsWith('/production/handover/log/operator-detail/')) {
    return { parent: '交接班日志', label: '操作工交接班报工详情' };
  }

  if (pathname.startsWith('/production/execution/monthly-task/builder')) {
    return { parent: '月度生产任务', label: '月度生产任务编制' };
  }

  if (pathname.startsWith('/production/execution/monthly-task/detail/')) {
    const id = pathname.split('/').pop();
    const taskData = mockMonthlyProductionTasks.find(t => t.baseInfo.id === Number(id));
    return { parent: '月度生产任务', label: taskData ? taskData.baseInfo.taskName : '月度生产任务详情' };
  }

  return { label: '未知页面' };
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = getRouteInfo(location.pathname);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center">
        <div className="text-sm text-gray-500 flex items-center">
          <Link to="/" className="hover:text-gray-900 transition-colors">首页</Link>
          {currentRoute.parent && (
            <>
              <span className="mx-2">/</span>
              <span>{currentRoute.parent}</span>
            </>
          )}
          {location.pathname !== '/' && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{currentRoute.label}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-red-500 text-sm font-medium mr-4">
          本平台为互联网非涉密平台，严禁处理、传输国家秘密、工作秘密
        </div>
        <button 
          onClick={() => navigate('/mobile')}
          className="text-gray-500 hover:text-blue-500 transition-colors"
          title="移动端预览"
        >
          <Smartphone className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Maximize className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 cursor-pointer pl-2 border-l border-gray-200">
          <UserCircle className="w-6 h-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">超级管理员</span>
        </div>
      </div>
    </header>
  );
}
