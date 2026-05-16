import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Clock,
  PackageSearch,
  ClipboardList,
  FileBox,
  Plus,
} from "lucide-react";
import { mockLabelingTasks } from "../../../data/mobile/labelingTaskData";
import { getRecordsByTaskNo } from "../../../data/mobile/labelingTaskRecordData";
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField, 
  MobileDetailSection, 
  MobileDetailLogItem,
  MobileModal
} from "../components/MobileDetailLayout";

export default function MobileLabelingTaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = useMemo(() => {
    return mockLabelingTasks.find((t) => t.id === Number(id));
  }, [id]);

  const initialRecords = useMemo(() => {
    if (!task) return [];
    return getRecordsByTaskNo(task.taskNo);
  }, [task]);

  const [localRecords, setLocalRecords] = useState(initialRecords);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    applicant: "管理员",
  });

  const progress = task?.appliedCompletionVolume || 0;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const newRecord = {
      id: Date.now(),
      taskNo: task.taskNo,
      warehousingNo: `RK-${dateStr}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, "0")}`,
      applicant: formData.applicant,
      applyTime: new Date()
        .toLocaleString("zh-CN", { hour12: false })
        .replace(/\//g, "-"),
    };
    setLocalRecords([newRecord, ...localRecords]);
    setIsFormOpen(false);
  };

  const percent = Math.min(100, task.requiredVolume > 0 ? Math.round((progress / task.requiredVolume) * 100) : 0);

  const progressFooter = (
    <>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-xs font-bold text-slate-600">申请完工量</span>
        <div className="text-xs">
          <span className="text-blue-600 font-bold text-sm mr-0.5">
            {progress.toFixed(2)}
          </span>
          <span className="text-slate-400 font-mono">
            / {task.requiredVolume.toFixed(2)} {task.unit}
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
        title={task.subBrandCode}
        icon={<PackageSearch className="w-5 h-5" />}
        footerContent={progressFooter}
      >
        <MobileDetailInfoField label="任务编号" value={task.taskNo} isFullWidth />
        <MobileDetailInfoField label="产品类型" value={task.productType} />
        <MobileDetailInfoField label="牌号" value={task.brandCode} />
        <MobileDetailInfoField label="规格" value={task.specification} />
        <MobileDetailInfoField label="初始需求量" value={`${task.initialRequiredVolume} ${task.unit}`} />
        <MobileDetailInfoField label="到货时间" value={task.arrivalTime} />
        <MobileDetailInfoField label="到货地点" value={task.arrivalLocation} isFullWidth />
        <MobileDetailInfoField label="期望完成时间" value={task.expectedCompletionTime} isFullWidth />
      </MobileDetailInfoCard>

      <MobileDetailSection title="贴标入库记录" count={localRecords.length}>
        {localRecords.map((record) => (
          <MobileDetailLogItem
            key={record.id}
            title={record.warehousingNo}
            titleIcon={<ClipboardList className="w-3.5 h-3.5" />}
            footerLeft={record.applicant}
            footerLeftIcon={<User className="w-3 h-3" />}
            footerRight={record.applyTime}
            footerRightIcon={<Clock className="w-3 h-3" />}
          >
            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center">
                  <span className="text-slate-500 bg-white border border-slate-200 px-1 py-0.5 rounded-sm mr-2">
                    入库单号
                  </span>
                  <span className="text-slate-600 font-mono font-medium">
                    {record.warehousingNo}
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
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.4)] hover:bg-blue-700 active:scale-95 transition-all text-[12px] font-bold flex-col gap-0.5"
        >
          <Plus className="w-5 h-5 mb-0.5" />
          <span className="leading-none tracking-wider scale-90">入库</span>
        </button>
      </div>

      {/* --- 表单侧边栏/底部弹窗 --- */}
      <MobileModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title="申报入库"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700">
              申请人
            </label>
            <div className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-[13px] text-slate-500 cursor-not-allowed flex items-center">
              <User className="w-4 h-4 mr-2" />
              {formData.applicant}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            确认入库
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
