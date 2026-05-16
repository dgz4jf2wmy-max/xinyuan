import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileListLayout, MobileListItem } from "../components/MobileListLayout";
import { mockLabelingTasks } from "../../../data/mobile/labelingTaskData";
import { LabelingTask } from "../../../types/production/execution/labelingTask";

export default function MobileLabelingTaskPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const navigate = useNavigate();

  const filteredTasks = mockLabelingTasks.filter((task) => {
    const matchesSearch =
      task.taskNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subBrandCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIncomplete = showIncompleteOnly
      ? task.appliedCompletionVolume < task.requiredVolume
      : true;

    return matchesSearch && matchesIncomplete;
  });

  const headerSearch = (
    <div className="flex flex-col bg-white">
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <div className="flex-1 bg-slate-100 rounded-full flex items-center px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="搜索贴标任务编号/分牌号"
            className="bg-transparent border-none outline-none text-[14px] w-full text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowIncompleteOnly(!showIncompleteOnly)}
          className={`shrink-0 px-2.5 py-1.5 rounded-full text-[12px] flex items-center gap-1 transition-all ${
            showIncompleteOnly 
              ? "bg-blue-50 text-blue-600 border border-blue-200" 
              : "bg-slate-50 text-slate-500 border border-slate-200"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          未完成
        </button>
      </div>
    </div>
  );

  return (
    <MobileListLayout title="贴标任务" headerContent={headerSearch}>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <MobileListItem 
            key={task.id}
            onClick={() => navigate(`/mobile/labeling-task/detail/${task.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[16px] text-slate-800 break-all leading-tight">
                  {task.subBrandCode}
                </span>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="shrink-0 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[11px] leading-none border border-blue-100">
                    {task.brandCode}
                  </span>
                  <span className="shrink-0 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[11px] leading-none">
                    {task.productType}
                  </span>
                  <span className="text-[12px] text-slate-400 font-mono">
                    {task.taskNo}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-y-2 mt-3 bg-slate-50 p-2.5 rounded text-[12px]">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">申请完工量/需求量</span>
                  <span className="text-slate-700 font-mono">
                    <span className="text-[#409eff] font-medium">{task.appliedCompletionVolume.toFixed(2)}</span> / {task.requiredVolume.toFixed(2)} {task.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#409eff] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, task.requiredVolume > 0 ? (task.appliedCompletionVolume / task.requiredVolume) * 100 : 0)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-start gap-2 pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 shrink-0">期望完成时间</span>
                <span className="text-slate-700 font-mono text-right">{task.expectedCompletionTime}</span>
              </div>
            </div>
          </MobileListItem>
        ))
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <p className="text-[14px]">没有找到对应的贴标任务</p>
        </div>
      )}
    </MobileListLayout>
  );
}
