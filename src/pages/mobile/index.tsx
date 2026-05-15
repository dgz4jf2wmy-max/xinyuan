import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Bell,
  User,
  Box,
  Settings,
  Search,
} from "lucide-react";

export default function MobileHome() {
  const navigate = useNavigate();

  // macOS Launchpad style apps
  const apps = [
    {
      title: "操作工交接班报工",
      icon: <FileText className="w-7 h-7 text-white" />,
      path: "/mobile/shift-handover",
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      title: "工段长交接班报工",
      icon: <FileText className="w-7 h-7 text-white" />,
      path: "/mobile/foreman-shift-handover",
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    },
    {
      title: "贴标任务",
      icon: <Box className="w-7 h-7 text-white" />,
      path: "/mobile/labeling-task",
      color: "bg-gradient-to-br from-teal-400 to-teal-600",
    },
    {
      title: "醇化任务",
      icon: <Box className="w-7 h-7 text-white" />,
      path: "/mobile/aging-task",
      color: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      title: "消息通知",
      icon: <Bell className="w-7 h-7 text-white" />,
      path: "/mobile/demo2",
      color: "bg-gradient-to-br from-orange-400 to-red-500",
      badge: "3",
    },
    {
      title: "生产大屏",
      icon: <LayoutGrid className="w-7 h-7 text-white" />,
      path: "/mobile/demo1",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      title: "个人中心",
      icon: <User className="w-7 h-7 text-white" />,
      path: "/mobile/demo2",
      color: "bg-gradient-to-br from-cyan-400 to-blue-500",
    },
    {
      title: "设置",
      icon: <Settings className="w-7 h-7 text-slate-700" />,
      path: "/mobile/demo2",
      color: "bg-gradient-to-br from-gray-200 to-gray-400",
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white text-slate-800 relative">
      <div className="relative z-10 flex flex-col h-full">
        {/* Search Bar */}
        <div className="pt-10 pb-6 px-8 flex justify-center">
          <div className="w-full max-w-[240px] flex items-center bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-slate-300 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="搜索"
              className="bg-transparent border-none outline-none text-slate-800 text-[13px] w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* App Grid */}
        <div className="flex-1 px-6 pt-4 pb-12">
          <div className="grid grid-cols-4 gap-y-8 gap-x-4 justify-items-center">
            {apps.map((app, index) => (
              <div
                key={index}
                onClick={() => navigate(app.path)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group w-16"
              >
                <div className="relative">
                  <div
                    className={`w-[54px] h-[54px] rounded-[14px] flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-all duration-200 ${app.color}`}
                  >
                    {app.icon}
                  </div>
                  {app.badge && (
                    <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[20px] h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-20">
                      {app.badge}
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-700 line-clamp-2 text-center w-[120%] tracking-wide leading-tight">
                  {app.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="pb-8 flex justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
