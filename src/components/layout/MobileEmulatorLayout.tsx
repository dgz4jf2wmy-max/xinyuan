import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Smartphone,
  Battery,
  Wifi,
  Signal,
  ChevronLeft,
  Home,
  Monitor,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function MobileEmulatorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Simple hardcoded header title based on paths, can be extended later or managed via context
  let pageTitle = "应用中心";
  if (location.pathname.includes("/mobile/demo1")) pageTitle = "演示页面1";
  else if (location.pathname.includes("/mobile/demo2")) pageTitle = "演示页面2";
  else if (location.pathname.includes("/mobile/shift-handover/log-detail")) pageTitle = "操作工交接班报工详情";
  else if (location.pathname.includes("/mobile/shift-handover/detail")) pageTitle = "生产任务详情";
  else if (location.pathname.includes("/mobile/shift-handover")) pageTitle = "操作工交接班报工";
  else if (location.pathname.includes("/mobile/foreman-shift-handover")) pageTitle = "工段长交接班报工";
  else if (location.pathname.includes("/mobile/foreman-handover-submit")) pageTitle = "工段长报工填报";
  else if (location.pathname.includes("/mobile/foreman-handover-detail")) pageTitle = "工段长交接班报工详情";
  else if (location.pathname.includes("/mobile/aging-task/detail")) pageTitle = "醇化任务详情";
  else if (location.pathname.includes("/mobile/aging-task")) pageTitle = "醇化任务";
  else if (location.pathname.includes("/mobile/labeling-task")) pageTitle = "贴标任务";
  else if (location.pathname.includes("/mobile/preprocess-handover-log")) pageTitle = "操作工报工填报";


  const isHome =
    location.pathname === "/mobile" || location.pathname === "/mobile/";

  return (
    <div className="flex justify-center items-center h-full w-full bg-[#f0f2f5] min-h-[calc(100vh-64px)] p-6 relative">
      <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-[#202124] flex flex-col">
        {/* Notch - Just an aesthetic overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[28px] w-[140px] bg-[#202124] rounded-b-[20px] z-50"></div>

        {/* Unified Top Area */}
        <div className="flex flex-col shrink-0 z-40 bg-white">
          {/* Status Bar */}
          <div className="h-11 w-full flex justify-between items-center px-6 pt-1">
            <div className="text-[14px] font-bold text-slate-800 tracking-wide">{timeString}</div>
            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-[18px] h-[18px]" />
            </div>
          </div>

          {/* Mobile Header */}
          {!isHome && (
            <div className="h-11 flex items-center justify-between px-4 border-b border-slate-100">
              <div className="w-10">
                <button
                  onClick={() => navigate(-1)}
                  className="p-1 -ml-1 hover:bg-slate-100 text-slate-700 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="text-[16px] font-bold text-slate-800">
                {pageTitle}
              </div>
              <div className="w-10 flex justify-end">
                <button
                  onClick={() => navigate("/mobile")}
                  className="p-1 -mr-1 hover:bg-slate-100 text-slate-700 rounded-full transition-colors"
                >
                  <Home className="w-[20px] h-[20px]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 bg-[#f5f7fa] overflow-y-auto w-full relative">
          <Outlet />
        </div>

        {/* Home Indicator */}
        <div className="h-8 w-full bg-white flex items-center justify-center shrink-0">
          <div className="w-[120px] h-[5px] bg-[#e0e0e0] rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-6 right-6">
        <Button
          variant="outline"
          className="bg-white gap-2 shadow-sm text-slate-700 hover:text-blue-600 border-slate-200"
          onClick={() => navigate("/")}
        >
          <Monitor className="w-4 h-4" />
          返回桌面端
        </Button>
      </div>
    </div>
  );
}
