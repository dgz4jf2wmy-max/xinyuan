import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAgingTasks } from "../../../data/aging-task";
import { MobileListLayout, MobileListItem } from "../components/MobileListLayout";
import { MobileTabs } from "../components/MobileTabs";

export default function MobileAgingTaskPage() {
  const [tasks] = useState(mockAgingTasks);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const navigate = useNavigate();

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    const progress = task.currentProgress || 0;
    return progress < task.boxesCount;
  });

  const headerTabs = (
    <MobileTabs 
      tabs={[
        { key: "pending", label: "待办任务" },
        { key: "all", label: "全部任务" }
      ]}
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key as "pending" | "all")}
    />
  );


  return (
    <MobileListLayout title="醇化任务" headerContent={headerTabs}>
      {filteredTasks.map((task) => {
        const progress = task.currentProgress || 0;
        const percentage = Math.min(
          100,
          Math.round((progress / task.boxesCount) * 100),
        );

        return (
          <MobileListItem
            key={task.id}
            onClick={() => navigate(`/mobile/aging-task/detail/${task.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-[15px] font-bold text-[#303133] leading-snug">
                {task.subBrandAndGrade}
              </div>
              <div className="text-[12px] text-[#909399] ml-2 shrink-0">
                {task.taskNo}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center text-[12px] text-[#606266]">
                  <span className="text-[#909399] w-14">牌号：</span>
                  <span>{task.brandCode}</span>
                </div>
                <div className="flex items-center text-[12px] text-[#606266]">
                  <span className="text-[#909399] w-14">计划月份：</span>
                  <span>{task.yearMonth}</span>
                </div>
                <div className="flex items-center text-[12px] text-[#606266]">
                  <span className="text-[#909399] w-14">日期：</span>
                  <span>{task.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end justify-center">
                  <div className="flex items-baseline">
                    <span className="text-[15px] font-bold text-[#409eff] mr-0.5">
                      {Number(progress || 0).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#909399]">
                      / {Number(task.boxesCount || 0).toFixed(2)} 箱
                    </span>
                  </div>
                </div>

                <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-full h-full transform -rotate-90"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="transparent"
                      stroke="#ebeef5"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="transparent"
                      stroke={percentage >= 100 ? "#67c23a" : "#409eff"}
                      strokeWidth="3.5"
                      strokeDasharray={100.53}
                      strokeDashoffset={
                        100.53 * (1 - (percentage || 0) / 100)
                      }
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-in-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-[#606266]">
                    {percentage}%
                  </div>
                </div>
              </div>
            </div>
          </MobileListItem>
        );
      })}
    </MobileListLayout>
  );
}
