import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { mockShiftHandoverTasks } from "../../../data/mobile/shiftHandoverData";
import { mockProcessSubmissionData } from "../../../data/mobile/processSubmissionData";
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField
} from "../components/MobileDetailLayout";

export default function MobileShiftHandoverDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isFromForeman = location.state?.fromForeman;

  const task = mockShiftHandoverTasks.find((t) => t.id === Number(id));
  const submissions = mockProcessSubmissionData.filter(s => s.taskId === Number(id));

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

  return (
    <MobileDetailLayout>
      <MobileDetailInfoCard
        title={task.brand}
      >
        <MobileDetailInfoField label="生产任务编号" value={task.taskNo} isFullWidth />
        <MobileDetailInfoField label="产线" value={task.productionLine} />
        <MobileDetailInfoField label="产品类型" value={task.productType} />
        <MobileDetailInfoField label="生产顺序" value={task.productionOrder} />
        <MobileDetailInfoField label="状态" value={task.status} />
        <MobileDetailInfoField label="产品名称" value={task.productName} isFullWidth />
        <MobileDetailInfoField label="产品编号" value={task.productCode} />
        <MobileDetailInfoField label="生产类型" value={task.productionType || '-'} valueClass="truncate" />
        <MobileDetailInfoField label="产量" value={`${task.productionVolume.toFixed(2)} 吨`} />
        <MobileDetailInfoField label="报工产量" value={`${task.reportedVolume.toFixed(2)} 吨`} />
        <MobileDetailInfoField label="理论产量" value={`${task.theoreticalVolume.toFixed(2)} 吨`} />
        <MobileDetailInfoField label="入库产量" value={`${task.inboundVolume.toFixed(2)} 吨/箱`} />
        <MobileDetailInfoField label="完成日期" value={task.completionDate} />
        {task.blendingQuantity > 0 && (
          <>
            <MobileDetailInfoField label="回掺数量" value={`${task.blendingQuantity.toFixed(2)} 吨`} />
            <MobileDetailInfoField label="回掺比例" value={`${task.blendingRatio.toFixed(2)}%`} />
          </>
        )}
      </MobileDetailInfoCard>

      {isFromForeman && (
        <div className="mt-4 px-4 pb-6">
          <div className="text-[13px] font-medium text-slate-700 mb-3 px-1 border-l-2 border-blue-500 pl-2">
            工序提交列表
          </div>
          {submissions.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 flex flex-col">
              {submissions.map((sub, index) => (
                <div key={sub.id} className={`p-3 flex flex-col gap-1.5 ${index !== submissions.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-800 text-[14px] pr-2 leading-snug">{sub.logNo}</span>
                    {sub.isSubmitted ? (
                      <span className="shrink-0 mt-0.5 bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8] px-1.5 py-0.5 rounded text-[10px]">已提交</span>
                    ) : (
                      <span className="shrink-0 mt-0.5 bg-[#fafafa] text-[#909399] border border-[#e4e7ed] px-1.5 py-0.5 rounded text-[10px]">未提交</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-y-1 text-[12px] mt-1 text-slate-500">
                    <div className="flex justify-between items-start">
                      <span className="shrink-0">提交人</span>
                      <span className="text-slate-700 text-right">{sub.submitter || '-'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="shrink-0">提交时间</span>
                      <span className="text-slate-700 font-mono text-right">{sub.submitTime || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 shadow-sm border border-slate-100">
              <p className="text-[13px]">暂无提交记录</p>
            </div>
          )}
        </div>
      )}

    </MobileDetailLayout>
  );
}
