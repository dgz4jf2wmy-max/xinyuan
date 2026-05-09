import { useState } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { mockMonthlyDashboardStat, mockDailyProductionStats } from '../../../../data/production/execution/dashboardData';

export default function MonthlyProductionDashboardPage() {
  const [stats] = useState(mockMonthlyDashboardStat);

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div className="flex items-center gap-2 text-[#303133]">
              <h2 className="text-xl font-bold text-gray-800">月度生产看板</h2>
              <span className="px-2 py-1 bg-blue-50 text-[#1890ff] text-xs font-medium rounded-full ml-2">
                {stats.yearMonth}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新数据
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
              <div className="border border-[#e4e7ed] rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
                <div className="text-gray-500 text-sm mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1 text-[#1890ff]" />
                  总计划产量
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stats.totalPlannedQuantity.toLocaleString()} <span className="text-sm font-normal text-gray-500">公斤</span>
                </div>
              </div>
              <div className="border border-[#e4e7ed] rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
                <div className="text-gray-500 text-sm mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-[#67c23a]" />
                  已完成产量
                </div>
                <div className="text-2xl font-bold text-[#67c23a]">
                  {stats.totalCompletedQuantity.toLocaleString()} <span className="text-sm font-normal text-gray-500">公斤</span>
                </div>
              </div>
              <div className="border border-[#e4e7ed] rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
                <div className="text-gray-500 text-sm mb-2">完成率</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-800">{stats.completionRate}</span>
                  <span className="text-gray-500 ml-1">%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  <div 
                    className="bg-[#1890ff] h-1.5 rounded-full" 
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="border border-[#e4e7ed] rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
                <div className="text-gray-500 text-sm mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-[#e6a23c]" />
                  风险提示
                </div>
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between mb-1">
                    <span>进行中任务</span>
                    <span className="font-bold">{stats.activeTasks} 项</span>
                  </div>
                  <div className="flex justify-between">
                    <span>延期风险任务</span>
                    <span className="font-bold text-red-500">{stats.delayedTasks} 项</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white border border-[#e4e7ed] rounded-lg shadow-sm p-4 flex flex-col min-h-[300px]">
              <h3 className="font-medium text-gray-800 mb-4 border-b border-[#e4e7ed] pb-2 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-[#909399]" />
                每日产出趋势
              </h3>
              <div className="flex-1 flex items-end gap-2 pt-4 px-2">
                {/* 简单的纯 CSS 柱状图展示 */}
                {mockDailyProductionStats.map((stat, i) => {
                  const maxVal = Math.max(...mockDailyProductionStats.map(s => Math.max(s.planned, s.completed)));
                  const plannedHeight = (stat.planned / maxVal) * 100;
                  const completedHeight = (stat.completed / maxVal) * 100;
                  
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div className="w-full flex justify-center items-end gap-1 h-full min-h-[150px] relative">
                         {/* 增加 tooltip 提示 */}
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-gray-800 text-white text-xs p-2 rounded whitespace-nowrap z-10 pointer-events-none transition-opacity">
                           计划: {stat.planned} | 完成: {stat.completed}
                         </div>
                         <div 
                           className="w-1/3 bg-gray-200 rounded-t-sm" 
                           style={{ height: `${plannedHeight}%` }}
                         />
                         <div 
                           className="w-1/3 bg-[#1890ff] rounded-t-sm transition-all duration-300" 
                           style={{ height: `${completedHeight}%` }}
                         />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 rotate-45 transform origin-top-left -ml-2 sm:rotate-0 sm:ml-0">
                        {stat.date}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-6 pt-2 border-t border-[#e4e7ed]">
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-3 h-3 bg-gray-200 mr-2 rounded-sm" /> 计划产量
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-3 h-3 bg-[#1890ff] mr-2 rounded-sm" /> 完成产量
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
