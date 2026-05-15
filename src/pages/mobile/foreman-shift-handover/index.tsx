import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Play, FileText } from "lucide-react";
import { mockShiftHandoverTasks } from "../../../data/mobile/shiftHandoverData";
import { mockForemanShiftHandoverData } from "../../../data/mobile/foremanShiftHandoverData";
import { mockShiftHandoverLogs } from "../../../data/mobile/shiftHandoverLogData";
import { MobileListLayout, MobileListItem } from "../components/MobileListLayout";
import { MobileTabs } from "../components/MobileTabs";

export default function MobileForemanShiftHandoverPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"production" | "logs" | "audit">("production");

  const filteredTasks = mockShiftHandoverTasks.filter((task) =>
    task.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.taskNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = mockForemanShiftHandoverData.filter((log) =>
    log.logName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.logNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAuditLogs = mockShiftHandoverLogs.filter((log) =>
    log.logName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.logNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headerSearch = (
    <div className="flex flex-col bg-white">
      <MobileTabs 
        tabs={[
          { key: "production", label: "生产报工" },
          { key: "logs", label: "我的交接班日志" },
          { key: "audit", label: "人工填报审核" }
        ]}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as "production" | "logs" | "audit")}
      />

      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-1 bg-slate-100 rounded-full flex items-center px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder={activeTab === 'production' ? "搜索牌号或任务单号" : "搜索日志名称或编号"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-[13px] w-full text-slate-800 placeholder:text-slate-400"
          />
        </div>
        <button className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <MobileListLayout title="工段长交接班报工" headerContent={headerSearch}>
      {activeTab === 'production' ? (
        filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <MobileListItem key={task.id}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center flex-wrap gap-2 pr-2 flex-1 relative">
                {task.productionOrder && (
                  <div className="bg-[#409eff] text-white text-[11px] px-1.5 py-0.5 rounded shadow-sm shrink-0 leading-none flex items-center justify-center">
                    顺序 {task.productionOrder}
                  </div>
                )}
                <span className="text-[15px] font-bold text-[#303133] leading-snug">
                  {task.brand}
                </span>
                {task.status === '在执行' ? (
                  <span className="bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8] px-1.5 py-0.5 rounded text-[10px]">在执行</span>
                ) : task.status === '待执行' ? (
                  <span className="bg-white text-[#c0c4cc] border border-[#e4e7ed] px-1.5 py-0.5 rounded text-[10px]">待执行</span>
                ) : (
                  <span className="bg-[#fafafa] text-[#909399] border border-[#e4e7ed] px-1.5 py-0.5 rounded text-[10px]">已执行</span>
                )}
              </div>
              <div className="text-[12px] text-[#909399] shrink-0 font-mono">
                {task.taskNo}
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-3 mt-1 text-[12px] text-[#606266]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-[#909399] shrink-0">产线：</span>
                  <span className="truncate">{task.productionLine}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#909399] shrink-0">完成日期：</span>
                  <span className="font-mono">{task.completionDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-[#909399] shrink-0">产量：</span>
                  <span className="font-medium text-[#303133]">{task.productionVolume.toFixed(2)} 吨</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#909399] shrink-0">报工产量：</span>
                  <span className="font-medium text-[#409eff]">{task.reportedVolume.toFixed(2)} 吨</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/mobile/shift-handover/detail/${task.id}`, { state: { fromForeman: true } });
                }}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 text-[12px] font-medium px-4 py-1.5 rounded transition-colors"
              >
                详情
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // For now, redirect to the same report page, or a different one later
                  navigate('/mobile/foreman-handover-submit');
                }}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 text-[12px] font-medium px-4 py-1.5 rounded transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                报工
              </button>
            </div>
          </MobileListItem>
        ))
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <p className="text-[14px]">没有找到对应的生产安排任务</p>
        </div>
      )
    ) : activeTab === 'logs' ? (
      filteredLogs.length > 0 ? (
        filteredLogs.map((log) => (
          <MobileListItem 
            key={log.id} 
            onClick={() => navigate(`/mobile/foreman-handover-detail/${log.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex font-medium text-[14px] text-slate-800 items-start leading-snug flex-1 pr-2">
                <span className="break-all">{log.logName}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-y-1.5 mt-2 bg-slate-50 p-2 rounded text-[12px]">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">日志编号</span>
                <span className="text-slate-700 font-mono text-right">{log.logNo}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">任务编号</span>
                <span className="text-slate-700 font-mono text-right">{log.productionTaskNo}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">班组班次</span>
                <span className="text-slate-700 text-right">{log.teamName} / {log.shiftName}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">提交时间</span>
                <span className="text-slate-700 font-mono text-right">{log.submitTime}</span>
              </div>
            </div>
          </MobileListItem>
        ))
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <FileText className="w-8 h-8 mb-2 opacity-30" />
          <p className="text-[14px]">暂无交接班日志</p>
        </div>
      )
    ) : (
      filteredAuditLogs.length > 0 ? (
        filteredAuditLogs.map((log) => (
          <MobileListItem 
            key={log.id} 
            onClick={() => navigate(`/mobile/shift-handover/log-detail/${log.id}?mode=audit`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex font-medium text-[14px] text-slate-800 items-start leading-snug flex-1 pr-2">
                <span className="break-all">{log.logName}</span>
                {log.isManualFill && (
                  <span className="ml-2 bg-rose-50 border border-rose-200 text-rose-500 px-1 py-0.5 rounded text-[10px] whitespace-nowrap mt-0.5">人工填报</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-y-1.5 mt-2 bg-slate-50 p-2 rounded text-[12px]">
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">日志编号</span>
                <span className="text-slate-700 font-mono text-right">{log.logNo}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">任务编号</span>
                <span className="text-slate-700 font-mono text-right">{log.taskNo || '-'}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">班组班次</span>
                <span className="text-slate-700 text-right">{log.teamName} / {log.shiftName}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">提交时间</span>
                <span className="text-slate-700 font-mono text-right">{log.submitTime}</span>
              </div>
            </div>
          </MobileListItem>
        ))
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <FileText className="w-8 h-8 mb-2 opacity-30" />
          <p className="text-[14px]">暂无待审核记录</p>
        </div>
      )
    )}
    </MobileListLayout>
  );
}
