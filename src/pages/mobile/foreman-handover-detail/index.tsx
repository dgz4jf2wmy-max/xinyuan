import React, { useState } from 'react';
import { ClipboardList, FileText } from 'lucide-react';
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField,
  MobileModal
} from '../components/MobileDetailLayout';
import { foremanHandoverDetailData } from '../../../data/mobile/foremanHandoverDetailData';

export default function MobileForemanHandoverDetailPage() {
  const [formData] = useState(foremanHandoverDetailData);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const DisplayText = ({ value }: { value: string | number }) => (
    <div className="text-[13px] font-medium text-slate-800 text-right">{value}</div>
  );

  return (
    <MobileDetailLayout>
      <div className="pb-6">
        {/* ================= 1. 基础信息区 ================= */}
        <MobileDetailInfoCard 
          title="基础信息" 
          icon={<FileText className="w-5 h-5" />}
          isCollapsible={true}
          defaultCollapsed={false}
        >
          <MobileDetailInfoField label="交接班日志编号" value="LOG-20260512-001" isFullWidth />
          <MobileDetailInfoField label="交接班日志名称" value="工段长_乙班_20260512" isFullWidth />
          <MobileDetailInfoField 
            label="生产任务编号" 
            value={
              <button 
                onClick={() => setIsTaskDetailOpen(true)}
                className="text-blue-500 underline underline-offset-2 decoration-blue-200 outline-none text-[13px] font-bold text-left"
              >
                RW-20260512-001
              </button>
            } 
            isFullWidth 
          />
          <MobileDetailInfoField label="班组名称" value="乙班" />
          <MobileDetailInfoField label="班次名称" value="早班" />
          <MobileDetailInfoField label="提交人" value="张工段长" />
          <MobileDetailInfoField label="提交时间" value="2026-05-12 16:30" />
        </MobileDetailInfoCard>

        {/* ================= 工段工作日志 ================= */}
        <MobileDetailInfoCard 
          title="工段工作日志" 
          icon={<ClipboardList className="w-5 h-5" />}
        >
          <MobileDetailInfoField 
            label="本班班组 / 班次" 
            value={<div className="text-[13px] text-slate-700 bg-slate-100/80 px-2 py-1.5 rounded">{formData.currentShiftType}班组 · 第{formData.currentWorkShop}个{formData.currentShiftName}</div>}
            isFullWidth 
          />
          <MobileDetailInfoField 
            label="下班班组 / 班次" 
            value={<div className="text-[13px] text-slate-700 bg-slate-100/80 px-2 py-1.5 rounded">{formData.nextShiftType}班组 · 第{formData.nextWorkShop}个{formData.nextShiftName}</div>}
            isFullWidth 
          />
          <MobileDetailInfoField 
            label="本班应到 (人)" 
            value={<div className="text-[13px] font-medium text-slate-700 bg-slate-100/80 px-2 py-1.5 rounded text-center min-w-[3rem]">{formData.expectedAttendance}</div>} 
          />
          <MobileDetailInfoField 
            label="实到人数" 
            value={<div className="text-[14px] font-bold text-blue-600 text-right">{formData.actualAttendance}</div>} 
          />
          <MobileDetailInfoField 
            label={<span className="font-medium text-slate-800">备注说明</span>} 
            value={<DisplayText value={formData.remark || '-'} />} 
            isFullWidth 
          />
          <div className="col-span-2 border-t border-slate-200 border-dashed my-2 pt-3" />
          <MobileDetailInfoField 
            label="在产牌号" 
            value={<DisplayText value={formData.brand} />} 
            isFullWidth
          />
          <MobileDetailInfoField 
            label="当班打包量 (吨)" 
            value={<DisplayText value={formData.packVolume} />} 
          />
          <MobileDetailInfoField 
            label="计划产量 (吨)" 
            value={<DisplayText value={formData.planVolume} />} 
          />
          <MobileDetailInfoField 
            label="累计产量 (吨)" 
            value={<DisplayText value={formData.accVolume} />} 
          />
          <MobileDetailInfoField 
            label="剩余产量 (吨)" 
            value={<DisplayText value={formData.remainingVolume} />} 
          />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField 
            label="内部因素影响时间 (h)" 
            value={<DisplayText value={formData.internalImpactHours} />} 
          />
          <MobileDetailInfoField 
            label="外部因素影响时间 (h)" 
            value={<DisplayText value={formData.externalImpactHours} />} 
          />
          
          <MobileDetailInfoField 
            label="打包量 (箱 * kg)" 
            value={
              <div className="flex gap-2 items-center justify-end w-full text-[13px] font-medium text-slate-800">
                {formData.packBoxCount} <span className="text-slate-400">*</span> {formData.packBoxWeight}
              </div>
            }
            isFullWidth
          />
          <MobileDetailInfoField label="当班用水量 (吨)" value={<DisplayText value={formData.waterUsage} />} isFullWidth />
          <div className="col-span-2 border-t border-slate-200 border-dashed my-2 pt-3" />
          {/* 烟梗 */}
          <MobileDetailInfoField 
            label="烟梗投料 (批数 / 每批kg / 总计kg)" 
            value={
              <div className="flex gap-2 mt-1 justify-end text-[13px] font-medium text-slate-800 w-full">
                {formData.stemBatchCount} <span className="text-slate-400">/</span> {formData.stemPerBatch} <span className="text-slate-400">/</span> {formData.stemTotal}
              </div>
            }
            isFullWidth 
          />
          
          {/* 烟末 */}
          <MobileDetailInfoField 
            label="烟末投料 (批数 / 每批kg / 总计kg)" 
            value={
              <div className="flex gap-2 mt-1 justify-end text-[13px] font-medium text-slate-800 w-full">
                {formData.dustBatchCount} <span className="text-slate-400">/</span> {formData.dustPerBatch} <span className="text-slate-400">/</span> {formData.dustTotal}
              </div>
            }
            isFullWidth 
          />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField label="针叶浆(kg)" value={<DisplayText value={formData.softwoodPulp} />} />
          <MobileDetailInfoField label="阔叶浆(kg)" value={<DisplayText value={formData.hardwoodPulp} />} />
          <MobileDetailInfoField label="碳酸钙(kg)" value={<DisplayText value={formData.calciumCarbonate} />} />
          <MobileDetailInfoField label="瓜尔胶(kg)" value={<DisplayText value={formData.guarGum} />} />
          <MobileDetailInfoField label="香精香料(kg)" value={<DisplayText value={formData.flavor} />} />
          <MobileDetailInfoField label="丙二醇(kg)" value={<DisplayText value={formData.propyleneGlycol} />} />
          <MobileDetailInfoField label="蜂蜜(kg)" value={<DisplayText value={formData.honey} />} />
          <MobileDetailInfoField label="柠檬酸(kg)" value={<DisplayText value={formData.citricAcid} />} />
          <MobileDetailInfoField label="糖类(kg)" value={<DisplayText value={formData.sugars} />} />
          <MobileDetailInfoField label="回掺量(kg)" value={<DisplayText value={formData.reblendVolume} />} />
          <MobileDetailInfoField label="打包零头(kg)" value={<DisplayText value={formData.packFraction} />} />
          <MobileDetailInfoField label="皮带秤流量(kg)" value={<DisplayText value={formData.beltScaleFlow} />} />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          {/* 纸箱与内袋 */}
          <MobileDetailInfoField 
            label="纸箱 (领用 / 正常消耗 / 损耗)" 
            value={
              <div className="flex gap-2 mt-1 justify-end text-[13px] font-medium text-slate-800 w-full">
                {formData.cartonReceived} <span className="text-slate-400">/</span> {formData.cartonConsumed} <span className="text-slate-400">/</span> {formData.cartonWasted}
              </div>
            }
            isFullWidth 
          />
          <MobileDetailInfoField 
            label="内袋 (领用 / 正常消耗 / 损耗)" 
            value={
               <div className="flex gap-2 mt-1 justify-end text-[13px] font-medium text-slate-800 w-full">
                {formData.innerBagReceived} <span className="text-slate-400">/</span> {formData.innerBagConsumed} <span className="text-slate-400">/</span> {formData.innerBagWasted}
              </div>
            }
            isFullWidth 
          />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField label="离心机渣料(kg)" value={<DisplayText value={formData.centrifugeResidue} />} />
          <MobileDetailInfoField label="烟灰棒(kg)" value={<DisplayText value={formData.ashRod} />} />
          <MobileDetailInfoField label="接黑液(桶)" value={<DisplayText value={formData.blackLiquorCount} />} isFullWidth />
          
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField label="接班水表示数(t)" value={<DisplayText value={formData.startWaterMeter} />} />
          <MobileDetailInfoField label="交班水表示数(t)" value={<DisplayText value={formData.endWaterMeter} />} />
          <div className="col-span-2 border-t border-slate-200 border-dashed my-2 pt-3" />
          <MobileDetailInfoField 
            label="1、设备运行情况" 
            isFullWidth
            value={
              <div className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal text-slate-700 min-h-[4rem] whitespace-pre-wrap">
                {formData.equipmentStatus || "无异常记录"}
              </div>
            } 
          />
          <MobileDetailInfoField 
            label="2、质量情况" 
            isFullWidth
            value={
              <div className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal text-slate-700 min-h-[4rem] whitespace-pre-wrap">
                {formData.qualityStatus || "无异常记录"}
              </div>
            } 
          />
          <MobileDetailInfoField 
            label="3、现场情况" 
            isFullWidth
            value={
               <div className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal text-slate-700 min-h-[4rem] whitespace-pre-wrap">
                {formData.onsiteStatus || "无异常记录"}
              </div>
            } 
          />
          <MobileDetailInfoField 
            label="4、其他 (香精香料、纸箱、内袋等定额非正常消耗详细说明)" 
            isFullWidth
            value={
               <div className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal text-slate-700 min-h-[4rem] whitespace-pre-wrap">
                {formData.otherStatus || "无记录"}
              </div>
            } 
          />
        </MobileDetailInfoCard>
      </div>

      <MobileModal 
        isOpen={isTaskDetailOpen} 
        onClose={() => setIsTaskDetailOpen(false)} 
        title="生产任务详情"
        titleIcon={<FileText className="w-4 h-4" />}
        className="p-5 grid grid-cols-2 gap-y-3 gap-x-4"
      >
        <MobileDetailInfoField label="生产任务编号" value="RW-20260512-001" isFullWidth />
        <MobileDetailInfoField label="产线" value="再造烟叶前处理工序" />
        <MobileDetailInfoField label="产品类型" value="特级" />
        <MobileDetailInfoField label="生产顺序" value="1" />
        <MobileDetailInfoField label="状态" value="已执行" />
        <MobileDetailInfoField label="产品名称" value="HBZY-10 (河北)" isFullWidth />
        <MobileDetailInfoField label="产品编号" value="PRD-001" />
        <MobileDetailInfoField label="生产类型" value="正式生产" />
        <MobileDetailInfoField label="产量" value="12.00 吨" />
        <MobileDetailInfoField label="报工产量" value="12.00 吨" />
        <MobileDetailInfoField label="理论产量" value="12.00 吨" />
        <MobileDetailInfoField label="入库产量" value="12.00 吨/箱" />
        <MobileDetailInfoField label="完成日期" value="2026-05-12" />
      </MobileModal>

    </MobileDetailLayout>
  );
}
