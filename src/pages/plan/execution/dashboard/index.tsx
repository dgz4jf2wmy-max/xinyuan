import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Target } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { getDerivedDashboardData } from '../../../../data/plan/execution/dashboardData';

export default function PlanExecutionDashboard() {
  const mockDashboardData = getDerivedDashboardData();
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calcPercent = (actual: number, planned?: number) => {
    if (!planned || planned === 0) return 0;
    return Math.min(100, Math.round((actual / planned) * 100));
  };

  const totalRequirement = mockDashboardData.columns.reduce((sum, col) => sum + (col.unit === '吨' ? col.requirement : 0), 0);
  const totalActual = mockDashboardData.columns.reduce((sum, col) => sum + (col.unit === '吨' ? col.actual : 0), 0);
  const totalRate = totalRequirement > 0 ? Math.round((totalActual / totalRequirement) * 100) : 0;

  return (
    <div className="h-full w-full bg-[#f5f7fa] flex flex-col font-sans overflow-hidden">
      
      {/* 顶部监控状态栏 */}
      <div className="h-14 bg-white border-b border-[#ebeef5] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-[16px] font-bold text-[#303133] tracking-wide">
            {mockDashboardData.planName} <span className="text-[#909399] ml-2 font-normal text-sm">全景进度监控板</span>
          </h1>
          <div className="px-2 py-0.5 rounded border border-[#d9ecff] bg-[#ecf5ff] text-[#409eff] text-[11px] font-bold ml-2 flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#409eff] mr-1.5 animate-pulse"></div>
            {mockDashboardData.status}
          </div>
        </div>
        <div className="flex items-center gap-6 text-[13px] text-[#606266]">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-[#c0c4cc]" />
            数据更新: <span className="ml-1 font-mono">{mockDashboardData.updateTime}</span>
          </div>
          <div className="font-mono text-base font-bold text-[#303133]">
            {currentTime || '00:00:00'}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 shrink-0">
        <div className="bg-white border border-[#ebeef5] shadow-sm rounded-lg p-5 flex items-center justify-between w-full relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none">
            <Target className="w-48 h-48 -mr-10 -mt-10" />
          </div>
          
          <div className="flex-1 flex items-center gap-10 z-10">
            <div className="flex flex-col min-w-[280px]">
              <h3 className="text-[13px] font-bold text-[#909399] flex items-center mb-2 tracking-wider">
                <Target className="w-4 h-4 mr-1.5" /> 本月度累计计划达成率
              </h3>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl leading-none font-black text-[#409eff] tracking-tighter">
                  {totalRate}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#409eff] rounded-full transition-all duration-1000" style={{ width: `${totalRate}%` }}></div>
              </div>
            </div>

            <div className="h-12 w-px bg-[#ebeef5] hidden md:block"></div>

            <div className="flex gap-12">
              <div className="flex flex-col gap-1">
                <span className="text-[#909399] text-[12px] font-medium mb-1">累计排产下达量</span>
                <span className="font-bold text-[#303133] font-mono text-2xl leading-none">{Number(totalRequirement.toFixed(3))} <span className="text-[#909399] font-sans font-normal text-[12px] ml-1">吨</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#909399] text-[12px] font-medium mb-1">累计实际生产量</span>
                <span className="font-bold text-[#67c23a] font-mono text-2xl leading-none">{Number(totalActual.toFixed(3))} <span className="text-[#909399] font-sans font-normal text-[12px] ml-1">吨</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 核心监控内容区：单屏四列满铺，无外部滚动条 */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        
        {mockDashboardData.columns.map((column) => {
          const Icon = column.icon;
          const totalPercent = calcPercent(column.actual, column.requirement);

          return (
            <div key={column.id} className="w-1/4 bg-white rounded-lg shadow-sm border border-[#ebeef5] flex flex-col overflow-hidden">
              
              {/* 大类数据统计头 */}
              <div className="p-3 border-b border-[#ebeef5] bg-[#fdfdfe] shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-sm bg-opacity-10", column.color.replace('bg-', 'bg-').replace(']', '/10]'), column.textColor)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-[15px] font-bold text-[#303133]">{column.title}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#909399] mb-0.5">总体进度</div>
                    <div className={cn("text-lg font-bold font-mono leading-none", totalPercent === 100 ? "text-[#67c23a]" : "text-[#409eff]")}>
                      {totalPercent}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#ebeef5] rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", column.color)} 
                      style={{ width: `${totalPercent}%` }} 
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-[#909399] mt-1.5 font-mono">
                  <span>完工: <span className="text-[#303133] font-semibold">{column.actual}</span></span>
                  <span>需求: <span className="text-[#303133] font-semibold">{column.requirement}</span> {column.unit}</span>
                </div>
              </div>

              {/* 牌号平铺区：内部自适应挤压，无滚动条 */}
              <div className="flex-1 p-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
                {column.brands.map(brand => {
                  const brandPercent = calcPercent(brand.actual, brand.requirement);
                  
                  return (
                    <div key={brand.id} className="border border-[#ebeef5] rounded-sm flex flex-col bg-[#fafafa]">
                      
                      {/* 主牌号层 */}
                      <div className="px-3 py-2 border-b border-[#ebeef5] bg-[#f5f7fa] flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="font-bold text-[#303133] text-[13px] flex items-center flex-wrap gap-1.5">
                            {brandPercent >= 100 && <CheckCircle2 className="w-3.5 h-3.5 text-[#67c23a]" />}
                            <span>{brand.brand}</span>
                            <span className={cn(
                              "px-1 py-0.5 rounded text-[10px] font-normal leading-none",
                              brand.status === '已执行' ? "bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8]" :
                              brand.status === '在执行' ? "bg-[#ecf5ff] text-[#409eff] border border-[#d9ecff]" :
                              "bg-[#fdf6ec] text-[#e6a23c] border border-[#faecd8]"
                            )}>
                              {brand.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#909399]">
                            需求量: <span className="font-mono text-[#303133] font-bold">{brand.requirement}</span> <span className="font-sans font-normal text-[10px]">{column.unit}</span>
                          </div>
                        </div>

                        {/* 对比进度条 */}
                        <div className="flex flex-col gap-1.5">
                          {/* 理论进度 */}
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] text-[#909399] w-6 shrink-0 text-right">理论</div>
                            <div className="flex-1 h-1.5 bg-[#ebeef5] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.1)_4px,rgba(0,0,0,0.1)_8px)] bg-[#c0c4cc] opacity-80 rounded-full" 
                                style={{ width: `${Math.min(100, brand.requirement ? (brand.planned / brand.requirement) * 100 : 0)}%` }} 
                              />
                            </div>
                            <div className="text-[10px] font-mono text-[#909399] w-14 text-right">
                              {brand.planned} <span className="font-sans font-normal text-[9px]">{column.unit}</span>
                            </div>
                          </div>
                          
                          {/* 实际进度 */}
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] text-[#909399] w-6 shrink-0 text-right">实际</div>
                            <div className="flex-1 h-1.5 bg-[#ebeef5] rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full transition-all duration-500", brand.actual >= brand.planned && brand.planned > 0 ? "bg-[#67c23a]" : column.color)} 
                                style={{ width: `${Math.min(100, brand.requirement ? (brand.actual / brand.requirement) * 100 : 0)}%` }} 
                              />
                            </div>
                            <div className="text-[10px] font-mono text-[#303133] w-14 text-right font-bold">
                              {brand.actual} <span className="font-sans font-normal text-[9px]">{column.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 分牌号层：高密度列表 */}
                      <div className="p-2 flex flex-col gap-1.5 bg-white">
                        {brand.subs.map(sub => {
                          const subPercent = calcPercent(sub.actual, sub.requirement);
                          return (
                            <div key={sub.id} className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 w-[110px] shrink-0">
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", subPercent === 100 ? "bg-[#67c23a]" : subPercent > 0 ? column.color : "bg-[#c0c4cc]")} />
                                <span className="text-[#606266] truncate font-medium" title={sub.subBrand}>{sub.subBrand}</span>
                              </div>
                              <div className="flex-1 text-[#909399] truncate px-1 text-[10px] scale-90 origin-left" title={sub.customer}>
                                {sub.customer}
                              </div>
                              {sub.requirement !== undefined && (
                                <div className="flex items-center gap-2 w-[70px] shrink-0">
                                  <div className="flex-1 h-1 bg-[#ebeef5] rounded-full overflow-hidden">
                                    <div 
                                      className={cn("h-full rounded-full", subPercent === 100 ? "bg-[#67c23a]" : column.color)} 
                                      style={{ width: `${subPercent}%` }} 
                                    />
                                  </div>
                                  <span className="font-mono text-[#303133] w-7 text-right font-bold">{subPercent}%</span>
                                </div>
                              )}
                              {sub.requirement === undefined && (
                                <div className="flex items-center gap-2 w-[70px] shrink-0 justify-end">
                                  <span className="font-mono text-[#303133] text-right font-bold">{sub.actual} 吨</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
