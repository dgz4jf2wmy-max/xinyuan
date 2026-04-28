import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { mockDashboardData } from '../../../../data/plan/execution/dashboardData';
import { mockProductionPoolData } from '../../../../data/plan/productionPoolData';

export default function PlanExecutionDashboard() {
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calcPercent = (actual: number, planned: number) => {
    if (planned === 0) return 0;
    return Math.min(100, Math.round((actual / planned) * 100));
  };

  const urgentRequests = mockProductionPoolData.filter(p => p.applicationType === '紧急' || p.isChanged === true);

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

      {urgentRequests.length > 0 && (
        <div className="px-4 pt-4 shrink-0 bg-white">
          <div className="bg-[#fef0f0] border border-[#fde2e2] rounded flex flex-col shadow-sm">
            <div className="p-3 border-b border-[#fde2e2] flex items-center justify-between">
              <div className="flex items-center text-[#f56c6c] text-[13px] font-bold">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                发现 {urgentRequests.length} 项紧急/变更生产需求
              </div>
              <button className="text-[12px] text-[#f56c6c] hover:text-[#f78989] font-medium flex items-center transition-colors">
                前往处理 <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
            <div className="p-2">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead className="bg-[#fff6f6] text-[#909399]">
                  <tr>
                    <th className="py-1.5 px-3 font-medium">类型</th>
                    <th className="py-1.5 px-3 font-medium">申请单号</th>
                    <th className="py-1.5 px-3 font-medium">产品名称</th>
                    <th className="py-1.5 px-3 font-medium">产品规格</th>
                    <th className="py-1.5 px-3 font-medium text-right">需求数量</th>
                    <th className="py-1.5 px-3 font-medium">交货日期</th>
                    <th className="py-1.5 px-3 font-medium">客户</th>
                  </tr>
                </thead>
                <tbody>
                  {urgentRequests.map(req => (
                    <tr key={req.id} className="border-b border-[#fde2e2] border-dashed last:border-0 hover:bg-[#fff9f9]">
                      <td className="py-1.5 px-3">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[11px]",
                          req.isChanged ? "bg-orange-100 text-orange-600" : "bg-red-100 text-red-600"
                        )}>
                          {req.isChanged ? '变更' : req.applicationType}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 font-mono text-[#606266]">{req.documentNo}</td>
                      <td className="py-1.5 px-3 font-medium text-[#303133]">
                        {req.productName}
                      </td>
                      <td className="py-1.5 px-3 text-[#606266]">{req.specification}</td>
                      <td className="py-1.5 px-3 text-right font-mono font-bold text-[#f56c6c]">
                        {req.totalRequirementAmount}{req.unit}
                      </td>
                      <td className="py-1.5 px-3 text-[#606266]">{req.deliveryDate}</td>
                      <td className="py-1.5 px-3 text-[#606266] truncate max-w-[150px]">{req.customerName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 核心监控内容区：单屏四列满铺，无外部滚动条 */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden bg-white">
        
        {mockDashboardData.columns.map((column) => {
          const Icon = column.icon;
          const totalPercent = calcPercent(column.actual, column.planned);

          return (
            <div key={column.id} className="w-1/4 bg-white rounded-sm border border-[#ebeef5] flex flex-col overflow-hidden">
              
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
                  <span>目标: <span className="text-[#303133] font-semibold">{column.planned}</span> {column.unit}</span>
                </div>
              </div>

              {/* 牌号平铺区：内部自适应挤压，无滚动条 */}
              <div className="flex-1 p-3 flex flex-col gap-3 min-h-0 overflow-y-auto">
                {column.brands.map(brand => {
                  const brandPercent = calcPercent(brand.actual, brand.planned);
                  
                  return (
                    <div key={brand.id} className="border border-[#ebeef5] rounded-sm flex flex-col bg-[#fafafa]">
                      
                      {/* 主牌号层 */}
                      <div className="px-3 py-2 border-b border-[#ebeef5] bg-[#f5f7fa] flex justify-between items-center">
                        <div className="font-bold text-[#303133] text-[13px] flex items-center">
                          {brandPercent === 100 && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#67c23a]" />}
                          {brand.brand}
                        </div>
                        <div className="flex items-center gap-2 w-1/2">
                          <div className="flex-1 h-1.5 bg-[#dcdfe6] rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", brandPercent === 100 ? "bg-[#67c23a]" : column.color)} 
                              style={{ width: `${brandPercent}%` }} 
                            />
                          </div>
                          <div className="text-[11px] font-mono text-[#606266] w-16 text-right">
                            {brandPercent}%
                          </div>
                        </div>
                      </div>

                      {/* 分牌号层：高密度列表 */}
                      <div className="p-2 flex flex-col gap-1.5 bg-white">
                        {brand.subs.map(sub => {
                          const subPercent = calcPercent(sub.actual, sub.planned);
                          return (
                            <div key={sub.id} className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 w-[110px] shrink-0">
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", subPercent === 100 ? "bg-[#67c23a]" : subPercent > 0 ? column.color : "bg-[#c0c4cc]")} />
                                <span className="text-[#606266] truncate font-medium" title={sub.subBrand}>{sub.subBrand}</span>
                              </div>
                              <div className="flex-1 text-[#909399] truncate px-1 text-[10px] scale-90 origin-left" title={sub.customer}>
                                {sub.customer}
                              </div>
                              <div className="flex items-center gap-2 w-[70px] shrink-0">
                                <div className="flex-1 h-1 bg-[#ebeef5] rounded-full overflow-hidden">
                                  <div 
                                    className={cn("h-full rounded-full", subPercent === 100 ? "bg-[#67c23a]" : column.color)} 
                                    style={{ width: `${subPercent}%` }} 
                                  />
                                </div>
                                <span className="font-mono text-[#303133] w-7 text-right font-bold">{subPercent}%</span>
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
        })}

      </div>
    </div>
  );
}
