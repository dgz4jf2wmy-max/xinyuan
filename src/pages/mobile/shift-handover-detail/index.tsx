import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockShiftHandoverTasks } from "../../../data/mobile/shiftHandoverData";
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField
} from "../components/MobileDetailLayout";

export default function MobileShiftHandoverDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = mockShiftHandoverTasks.find((t) => t.id === Number(id));

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

    </MobileDetailLayout>
  );
}
