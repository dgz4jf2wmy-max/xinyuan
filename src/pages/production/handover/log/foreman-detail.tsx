import React, { useState } from 'react';
import { ArrowLeft, FileText, ClipboardList, Box } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Modal } from '../../../../components/ui/modal';
import { foremanHandoverDetailData } from '../../../../data/mobile/foremanHandoverDetailData';

export default function ForemanLogDetailPage({ id: propId, embedded }: { id?: string | number; embedded?: boolean }) {
  const navigate = useNavigate();
  const params = useParams();
  const id = propId || params.id;
  const [formData] = useState(foremanHandoverDetailData);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const DisplayInfo = ({ label, value, isFull = false }: { label: React.ReactNode, value: React.ReactNode, isFull?: boolean }) => (
    <div className={`flex items-start gap-2 ${isFull ? 'col-span-full' : ''}`}>
      <span className="text-[14px] text-[#606266] w-[125px] text-right pt-[9px] shrink-0">
        <span className="text-[#f56c6c] mr-1">*</span>{label}
      </span>
      <div className="flex-1 px-3 py-2 bg-white border border-[#e4e7ed] rounded text-[14px] text-[#303133] min-h-[38px] min-w-0 break-words whitespace-pre-wrap flex items-center">
        {value}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 px-4 lg:px-6 pt-[10px] pb-0 flex flex-col overflow-hidden">
          
          <div className="flex-1 flex flex-col overflow-hidden bg-white mb-0 relative">
            <div className="flex-1 overflow-auto custom-scrollbar px-2 lg:px-4 pb-[80px] pt-[10px]">
              <div className="border border-[#e4e7ed] p-4 lg:p-6 rounded-sm bg-white min-h-full relative pb-20">

              <div className="space-y-4 max-w-[1400px] mx-auto">
                
                {/* 1. 基础信息独立边框 */}
                <div className="border border-[#e4e7ed] px-5 pb-5 pt-[10px] lg:px-8 lg:pb-8 lg:pt-[10px] rounded-sm">
                  <div className="text-center text-[#409eff] text-[14px] mb-3">
                    基础信息
                  </div>
                  <div className="border-b border-[#ebeef5] w-full mb-6" />

                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    <DisplayInfo label="交接班日志名称" value="工段长_乙班_20260512" />
                    <DisplayInfo 
                      label="生产任务编号" 
                      value={
                        <button 
                           onClick={() => setIsTaskDetailOpen(true)}
                           className="text-[#409eff] hover:text-[#66b1ff] hover:underline"
                        >
                          RW-20260512-001
                        </button>
                      } 
                    />
                    <DisplayInfo label="班组名称" value="乙班" />
                    <DisplayInfo label="班次名称" value="早班" />
                    <DisplayInfo label="提交人" value="张工段长" />
                    <DisplayInfo label="提交时间" value="2026-05-12 16:30" />
                  </div>
                </div>

                {/* 2. 工段工作日志独立边框 */}
                <div className="border border-[#e4e7ed] px-5 pb-5 pt-[10px] lg:px-8 lg:pb-8 lg:pt-[10px] rounded-sm">
                  <div className="text-center text-[#409eff] text-[14px] mb-3">工段工作日志</div>
                  <div className="border-b border-[#ebeef5] w-full mb-6" />

                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                   <DisplayInfo 
                      label="本班班组 / 班次" 
                      value={`${formData.currentShiftType}班组 · 第${formData.currentWorkShop}个${formData.currentShiftName}`}
                    />
                    <DisplayInfo 
                      label="下班班组 / 班次" 
                      value={`${formData.nextShiftType}班组 · 第${formData.nextWorkShop}个${formData.nextShiftName}`}
                    />
                    <DisplayInfo label="本班应到 (人)" value={formData.expectedAttendance} />
                    <DisplayInfo 
                      label="实到人数" 
                      value={formData.actualAttendance} 
                    />
                    <DisplayInfo label="备注说明" value={formData.remark || '-'} isFull />
                </div>

                <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    <DisplayInfo label="在产牌号" value={formData.brand} />
                    <DisplayInfo label="当班打包量 (吨)" value={formData.packVolume} />
                    <DisplayInfo label="计划产量 (吨)" value={formData.planVolume} />
                    <DisplayInfo label="累计产量 (吨)" value={formData.accVolume} />
                    <DisplayInfo label="剩余产量 (吨)" value={formData.remainingVolume} />
                </div>

                <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    <DisplayInfo label="内部因素时间(h)" value={formData.internalImpactHours} />
                    <DisplayInfo label="外部因素时间(h)" value={formData.externalImpactHours} />
                    <DisplayInfo 
                      label="打包量 (箱 * kg)" 
                      value={`${formData.packBoxCount} * ${formData.packBoxWeight}`}
                    />
                    <DisplayInfo label="当班用水量 (吨)" value={formData.waterUsage} />
                </div>

                <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-6">
                   <DisplayInfo 
                      label="烟梗 (批/每批/总计)" 
                      value={`${formData.stemBatchCount} / ${formData.stemPerBatch} / ${formData.stemTotal}`}
                    />
                    <DisplayInfo 
                      label="烟末 (批/每批/总计)" 
                      value={`${formData.dustBatchCount} / ${formData.dustPerBatch} / ${formData.dustTotal}`}
                    />
                </div>

                <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                  <DisplayInfo label="针叶浆(kg)" value={formData.softwoodPulp} />
                  <DisplayInfo label="阔叶浆(kg)" value={formData.hardwoodPulp} />
                  <DisplayInfo label="碳酸钙(kg)" value={formData.calciumCarbonate} />
                  <DisplayInfo label="瓜尔胶(kg)" value={formData.guarGum} />
                  <DisplayInfo label="香精香料(kg)" value={formData.flavor} />
                  <DisplayInfo label="丙二醇(kg)" value={formData.propyleneGlycol} />
                  <DisplayInfo label="蜂蜜(kg)" value={formData.honey} />
                  <DisplayInfo label="柠檬酸(kg)" value={formData.citricAcid} />
                  <DisplayInfo label="糖类(kg)" value={formData.sugars} />
                  <DisplayInfo label="回掺量(kg)" value={formData.reblendVolume} />
                  <DisplayInfo label="打包零头(kg)" value={formData.packFraction} />
                  <DisplayInfo label="皮带秤流量(kg)" value={formData.beltScaleFlow} />
                </div>

                <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    <DisplayInfo 
                      label="纸箱 (领/耗/损)" 
                      value={`${formData.cartonReceived} / ${formData.cartonConsumed} / ${formData.cartonWasted}`}
                    />
                    <DisplayInfo 
                      label="内袋 (领/耗/损)" 
                      value={`${formData.innerBagReceived} / ${formData.innerBagConsumed} / ${formData.innerBagWasted}`}
                    />
                   <DisplayInfo label="接班水表(t)" value={formData.startWaterMeter} />
                   <DisplayInfo label="交班水表(t)" value={formData.endWaterMeter} />
                </div>

                <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                   <DisplayInfo label="离心机渣料(kg)" value={formData.centrifugeResidue} />
                   <DisplayInfo label="烟灰棒(kg)" value={formData.ashRod} />
                   <DisplayInfo label="接黑液(桶)" value={formData.blackLiquorCount} />
                </div>

                <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                <div className="grid grid-cols-1 gap-y-6">
                   <DisplayInfo 
                      label="1、设备运行情况" 
                      value={<div className="whitespace-pre-wrap">{formData.equipmentStatus || "无异常记录"}</div>}
                      isFull
                   />
                   <DisplayInfo 
                      label="2、质量情况" 
                      value={<div className="whitespace-pre-wrap">{formData.qualityStatus || "无异常记录"}</div>}
                      isFull
                   />
                   <DisplayInfo 
                      label="3、现场情况" 
                      value={<div className="whitespace-pre-wrap">{formData.onsiteStatus || "无异常记录"}</div>}
                      isFull
                   />
                   <DisplayInfo 
                      label="4、其他" 
                      value={<div className="whitespace-pre-wrap">{formData.otherStatus || "无记录"}</div>}
                      isFull
                   />
                </div>
                </div> {/* End section border */}
              </div>

            </div>
            
            {/* 行动按钮 */}
            {!embedded && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-[#e4e7ed] bg-white px-8 py-4 flex items-center justify-end z-20">
                 <button 
                   onClick={() => navigate(-1)} 
                   className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 py-2 rounded shadow-sm text-sm border-none"
                 >
                   返回
                 </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>

        <Modal
          isOpen={isTaskDetailOpen}
          onClose={() => setIsTaskDetailOpen(false)}
          title="生产任务详情"
          maxWidth="2xl"
          footer={
            <Button onClick={() => setIsTaskDetailOpen(false)} variant="outline">关闭</Button>
          }
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-6">
            <DisplayInfo label="生产任务编号" value="RW-20260512-001" isFull />
            <DisplayInfo label="产线" value="再造烟叶前处理工序" />
            <DisplayInfo label="产品类型" value="特级" />
            <DisplayInfo label="生产顺序" value="1" />
            <DisplayInfo label="状态" value="已执行" />
            <DisplayInfo label="产品名称" value="HBZY-10 (河北)" isFull />
            <DisplayInfo label="产品编号" value="PRD-001" />
            <DisplayInfo label="生产类型" value="正式生产" />
            <DisplayInfo label="产量" value="12.00 吨" />
            <DisplayInfo label="报工产量" value="12.00 吨" />
            <DisplayInfo label="理论产量" value="12.00 吨" />
            <DisplayInfo label="入库产量" value="12.00 吨/箱" />
            <DisplayInfo label="完成日期" value="2026-05-12" />
          </div>
        </Modal>
    </div>
  );
}
