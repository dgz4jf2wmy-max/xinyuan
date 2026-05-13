import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Clock,
  PackageSearch,
  ClipboardList,
  FileBox,
  Plus,
  X,
} from "lucide-react";
import { mockAgingTasks } from "../../../data/aging-task";
import { getReportsByTaskId } from "../../../data/aging-task-detail";
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField, 
  MobileDetailSection, 
  MobileDetailLogItem,
  MobileModal
} from "../components/MobileDetailLayout";

export default function MobileAgingTaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = useMemo(() => {
    return mockAgingTasks.find((t) => t.id === Number(id));
  }, [id]);

  const initialReports = useMemo(() => {
    return getReportsByTaskId(id || 1);
  }, [id]);

  const [localReports, setLocalReports] = useState(initialReports);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    reportedBoxesCount: "",
    reporter: "管理员",
  });

  const progress = useMemo(() => {
    return localReports.reduce((sum, r) => sum + r.reportedBoxesCount, 0);
  }, [localReports]);

  if (!task) {
    return (
      <MobileDetailLayout>
        <div className="flex flex-col items-center justify-center text-slate-500 h-full p-6">
          任务不存在
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            返回
          </button>
        </div>
      </MobileDetailLayout>
    );
  }

  const percent = Math.min(100, Math.round((progress / task.boxesCount) * 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reportedBoxesCount) {
      alert("请填写完成数量");
      return;
    }
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const newReport = {
      id: Date.now(),
      taskNo: task.taskNo,
      reportNo: `CHBG-${dateStr}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, "0")}`,
      reportedBoxesCount: Number(formData.reportedBoxesCount),
      outboundOrderNo: `CK-${dateStr}-${Math.floor(Math.random() * 100)
        .toString()
        .padStart(3, "0")}`,
      inboundOrderNo: `RK-${dateStr}-${Math.floor(Math.random() * 100)
        .toString()
        .padStart(3, "0")}`,
      reporter: formData.reporter,
      reportTime: new Date()
        .toLocaleString("zh-CN", { hour12: false })
        .replace(/\//g, "-"),
    };
    setLocalReports([newReport, ...localReports]);
    setIsFormOpen(false);
    setFormData({
      ...formData,
      reportedBoxesCount: "",
    });
  };

  const progressFooter = (
    <>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-xs font-bold text-slate-600">完成进度</span>
        <div className="text-xs">
          <span className="text-blue-600 font-bold text-sm mr-0.5">
            {progress.toFixed(2)}
          </span>
          <span className="text-slate-400 font-mono">
            / {task.boxesCount.toFixed(2)} 箱
          </span>
        </div>
      </div>
      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden border border-slate-200/50">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </>
  );

  return (
    <MobileDetailLayout>
      <MobileDetailInfoCard 
        title={task.subBrandAndGrade}
        icon={<PackageSearch className="w-5 h-5" />}
        footerContent={progressFooter}
      >
        <MobileDetailInfoField label="任务编号" value={task.taskNo} isFullWidth />
        <MobileDetailInfoField label="牌号" value={task.brandCode} />
        <MobileDetailInfoField label="年月份" value={task.yearMonth} />
        <MobileDetailInfoField label="码段计划号" value={task.codeSegmentPlanNo} />
        <MobileDetailInfoField label="日期" value={task.date} valueClass="truncate" />
        {task.remark && (
          <MobileDetailInfoField label="备注" value={task.remark} isFullWidth isTextArea />
        )}
      </MobileDetailInfoCard>

      <MobileDetailSection title="醇化报工记录" count={localReports.length}>
        {localReports.map((record) => (
          <MobileDetailLogItem
            key={record.id}
            title={record.reportNo}
            titleIcon={<ClipboardList className="w-3.5 h-3.5" />}
            rightTitle={
              <div className="flex items-baseline text-emerald-500">
                <span className="text-[16px] font-black tracking-tight">
                  +{record.reportedBoxesCount.toFixed(2)}
                </span>
                <span className="text-[10px] ml-0.5 font-medium">箱</span>
              </div>
            }
            footerLeft={record.reporter}
            footerLeftIcon={<User className="w-3 h-3" />}
            footerRight={record.reportTime}
            footerRightIcon={<Clock className="w-3 h-3" />}
          >
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center">
                  <span className="text-slate-500 bg-white border border-slate-200 px-1 py-0.5 rounded-sm mr-2">
                    出库单
                  </span>
                  <span className="text-slate-600 font-mono font-medium">
                    {record.outboundOrderNo}
                  </span>
                </div>
                <FileBox className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center">
                  <span className="text-slate-500 bg-white border border-slate-200 px-1 py-0.5 rounded-sm mr-2">
                    入库单
                  </span>
                  <span className="text-slate-600 font-mono font-medium">
                    {record.inboundOrderNo}
                  </span>
                </div>
                <FileBox className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          </MobileDetailLogItem>
        ))}
      </MobileDetailSection>

      {/* --- 悬浮新增按钮 --- */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.4)] hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* --- 报工表单侧边栏/底部弹窗 --- */}
      <MobileModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title="新增醇化报工"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700">
              报工数量 (箱)
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="请输入报工数"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono"
              value={formData.reportedBoxesCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reportedBoxesCount: e.target.value,
                })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700">
              报工人
            </label>
            <div className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-[13px] text-slate-500 cursor-not-allowed flex items-center">
              <User className="w-4 h-4 mr-2" />
              {formData.reporter}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            确认报工
          </button>
        </form>
      </MobileModal>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </MobileDetailLayout>
  );
}
