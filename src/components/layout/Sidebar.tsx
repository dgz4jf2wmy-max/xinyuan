import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FileEdit, ChevronDown, ChevronUp, Home, Calendar, Factory } from 'lucide-react';
import { cn } from '../../lib/utils';

export const menuItems = [
  { path: '/', label: '首页', icon: Home },
  {
    label: '计划管理',
    icon: Calendar,
    children: [
      { path: '/plan/annual', label: '年度产销计划', icon: FileEdit },
      { path: '/plan/monthly', label: '月度产销计划', icon: FileEdit },
      { path: '/plan/pool', label: '生产计划池', icon: FileEdit },
      { path: '/plan/application', label: '计划池入池申请', icon: FileEdit },
      { 
        label: '计划执行与数据看板', 
        icon: FileEdit,
        children: [
          { path: '/plan/execution/analysis', label: '计划执行综合分析', icon: FileEdit },
          { path: '/plan/execution/dashboard', label: '月度计划统计看板', icon: FileEdit }
        ]
      }
    ]
  },
  {
    label: '生产业务',
    icon: Factory,
    children: [
      {
        label: '班组排班',
        icon: FileEdit,
        children: [
          { path: '/production/scheduling/shifts', label: '班组班次', icon: FileEdit },
          { path: '/production/scheduling/schedule', label: '班组排班表', icon: FileEdit }
        ]
      },
      {
        label: '生产任务执行',
        icon: FileEdit,
        children: [
          { path: '/production/execution/monthly-task', label: '月度生产任务', icon: FileEdit },
          { path: '/production/execution/monthly-dashboard', label: '月度生产看板', icon: FileEdit },
          { path: '/production/execution/temp-blending', label: '临时回掺流程', icon: FileEdit }
        ]
      }
    ]
  },
  {
    label: '系统管理',
    icon: LayoutGrid,
    children: [
      { path: '/system/user', label: '用户管理', icon: FileEdit },
      { path: '/system/role', label: '角色管理', icon: FileEdit },
      { path: '/system/position', label: '岗位管理', icon: FileEdit },
    ]
  },
  {
    label: '基础项',
    icon: LayoutGrid,
    children: [
      { path: '/customer/ledger', label: '客户台账', icon: FileEdit },
      { path: '/base/sub-brand', label: '分牌号台账', icon: FileEdit },
      { path: '/base/production-type', label: '生产类型', icon: FileEdit }
    ]
  }
];

export function Sidebar() {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>(['系统管理']);

  const toggleOpen = (label: string) => {
    setOpenKeys(prev => 
      prev.includes(label) ? prev.filter(k => k !== label) : [...prev, label]
    );
  };

  return (
    <aside className="w-64 bg-[#f4f5f7] border-r border-gray-200 flex flex-col h-full z-10">
      <div className="h-14 flex items-center px-4 border-b border-gray-200 bg-white">
        <div className="w-8 h-8 bg-[#1890ff] rounded-md flex items-center justify-center mr-2">
          <span className="text-white font-bold text-lg">C</span>
        </div>
        <h1 className="text-lg font-bold text-gray-800 truncate">综合管理信息平台</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-6 py-3 text-[15px] transition-colors",
                    location.pathname === item.path
                      ? "text-[#1890ff]"
                      : "text-gray-800 hover:text-[#1890ff]"
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0", location.pathname === item.path ? "text-[#1890ff]" : "text-[#1890ff]")} />
                  {item.label}
                </Link>
              ) : (
                <div className="space-y-1">
                  <div 
                    className="flex items-center justify-between px-6 py-3 text-[15px] text-gray-800 cursor-pointer hover:text-[#1890ff] transition-colors"
                    onClick={() => toggleOpen(item.label)}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-[#409eff]" />
                      {item.label}
                    </div>
                    {openKeys.includes(item.label) ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  {openKeys.includes(item.label) && (
                    <div className="space-y-1 py-1">
                      {item.children?.map((child) => (
                        child.path ? (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              "flex items-center pl-[52px] pr-6 py-2.5 text-[14px] transition-colors",
                              location.pathname === child.path
                                ? "text-[#1890ff]"
                                : "text-gray-800 hover:text-[#1890ff]"
                            )}
                          >
                            <child.icon className={cn("mr-3 h-[18px] w-[18px] flex-shrink-0", location.pathname === child.path ? "text-[#1890ff]" : "text-gray-800")} />
                            {child.label}
                          </Link>
                        ) : (
                          <div key={child.label} className="space-y-1">
                            <div 
                              className="flex items-center justify-between pl-[52px] pr-6 py-2.5 text-[14px] text-gray-800 cursor-pointer hover:text-[#1890ff] transition-colors"
                              onClick={() => toggleOpen(child.label)}
                            >
                              <div className="flex items-center">
                                {/* @ts-ignore */}
                                {child.icon && <child.icon className="mr-3 h-[18px] w-[18px] flex-shrink-0 text-gray-800" />}
                                {child.label}
                              </div>
                              {openKeys.includes(child.label) ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                            {openKeys.includes(child.label) && (
                              <div className="space-y-1 py-1">
                                {/* @ts-ignore */}
                                {child.children?.map((subChild) => (
                                  <Link
                                    key={subChild.path}
                                    to={subChild.path}
                                    className={cn(
                                      "flex items-center pl-[76px] pr-6 py-2 text-[13px] transition-colors",
                                      location.pathname === subChild.path
                                        ? "text-[#1890ff]"
                                        : "text-gray-800 hover:text-[#1890ff]"
                                    )}
                                  >
                                    {subChild.icon && <subChild.icon className={cn("mr-3 h-4 w-4 flex-shrink-0", location.pathname === subChild.path ? "text-[#1890ff]" : "text-gray-800")} />}
                                    {subChild.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
