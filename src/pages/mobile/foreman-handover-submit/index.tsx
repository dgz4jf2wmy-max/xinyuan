import React, { useState } from 'react';
import { Save, CheckCircle2, ClipboardList, PenTool, Box, Info, FileText } from 'lucide-react';
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField,
  MobileModal
} from '../components/MobileDetailLayout';
import { initialForemanHandoverSubmitData } from '../../../data/mobile/foremanHandoverSubmitData';

export default function MobileForemanHandoverSubmitPage() {
  const [formData, setFormData] = useState(initialForemanHandoverSubmitData);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const CompactInput = ({ 
    value, 
    onChange, 
    type = "text", 
    placeholder = "", 
    className = "",
    width = "w-full"
  }: { 
    value: string, 
    onChange: (val: string) => void, 
    type?: string, 
    placeholder?: string,
    className?: string,
    width?: string
  }) => (
    <input 
      type={type} 
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`text-[13px] font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 ${width} ${className}`}
    />
  );

  return (
    <MobileDetailLayout>
      <div className="pb-16">
        {/* ================= 1. 基础信息区 ================= */}
        <MobileDetailInfoCard 
          title="基础信息" 
          icon={<FileText className="w-5 h-5" />}
          isCollapsible={true}
          defaultCollapsed={true}
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
          <MobileDetailInfoField label="提交时间" value="-" />
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
            label={<span className="font-medium text-slate-800">实到人数 <span className="text-red-500">*</span></span>} 
            value={<CompactInput value={formData.actualAttendance} onChange={v => handleChange('actualAttendance', v)} type="number" className="text-center w-20 font-bold text-blue-600" />} 
          />
          <MobileDetailInfoField 
            label={<span className="font-medium text-slate-800">备注说明</span>} 
            value={<CompactInput value={formData.remark} onChange={v => handleChange('remark', v)} placeholder="请输入备注内容..." className="w-full" />} 
            isFullWidth 
          />
          <div className="col-span-2 border-t border-slate-200 border-dashed my-2 pt-3" />
          <MobileDetailInfoField 
            label="在产牌号" 
            value={<CompactInput value={formData.brand} onChange={v => handleChange('brand', v)} />} 
            isFullWidth
          />
          <MobileDetailInfoField 
            label="当班打包量 (吨)" 
            value={<CompactInput value={formData.packVolume} onChange={v => handleChange('packVolume', v)} type="number" />} 
          />
          <MobileDetailInfoField 
            label="计划产量 (吨)" 
            value={<CompactInput value={formData.planVolume} onChange={v => handleChange('planVolume', v)} type="number" />} 
          />
          <MobileDetailInfoField 
            label="累计产量 (吨)" 
            value={<CompactInput value={formData.accVolume} onChange={v => handleChange('accVolume', v)} type="number" />} 
          />
          <MobileDetailInfoField 
            label="剩余产量 (吨)" 
            value={<CompactInput value={formData.remainingVolume} onChange={v => handleChange('remainingVolume', v)} type="number" />} 
          />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField 
            label="内部因素影响时间 (h)" 
            value={<CompactInput value={formData.internalImpactHours} onChange={v => handleChange('internalImpactHours', v)} type="number" />} 
          />
          <MobileDetailInfoField 
            label="外部因素影响时间 (h)" 
            value={<CompactInput value={formData.externalImpactHours} onChange={v => handleChange('externalImpactHours', v)} type="number" />} 
          />
          
          <MobileDetailInfoField 
            label="打包量 (箱 * kg)" 
            value={
              <div className="flex gap-2 items-center mt-1">
                <CompactInput value={formData.packBoxCount} onChange={v => handleChange('packBoxCount', v)} type="number" className="flex-1" />
                <span className="text-slate-400">*</span>
                <CompactInput value={formData.packBoxWeight} onChange={v => handleChange('packBoxWeight', v)} type="number" className="flex-1" />
              </div>
            }
            isFullWidth
          />
          <MobileDetailInfoField label="当班用水量 (吨)" value={<CompactInput value={formData.waterUsage} onChange={v => handleChange('waterUsage', v)} type="number" />} isFullWidth />
          <div className="col-span-2 border-t border-slate-200 border-dashed my-2 pt-3" />
          {/* 烟梗 */}
          <MobileDetailInfoField 
            label="烟梗投料 (批数 / 每批kg / 总计kg)" 
            value={
              <div className="flex gap-2 mt-1">
                <CompactInput value={formData.stemBatchCount} onChange={v => handleChange('stemBatchCount', v)} type="number" placeholder="批数" className="flex-1" />
                <CompactInput value={formData.stemPerBatch} onChange={v => handleChange('stemPerBatch', v)} type="number" placeholder="每批" className="flex-1" />
                <CompactInput value={formData.stemTotal} onChange={v => handleChange('stemTotal', v)} type="number" placeholder="总计" className="flex-1" />
              </div>
            }
            isFullWidth 
          />
          
          {/* 烟末 */}
          <MobileDetailInfoField 
            label="烟末投料 (批数 / 每批kg / 总计kg)" 
            value={
              <div className="flex gap-2 mt-1">
                <CompactInput value={formData.dustBatchCount} onChange={v => handleChange('dustBatchCount', v)} type="number" placeholder="批数" className="flex-1" />
                <CompactInput value={formData.dustPerBatch} onChange={v => handleChange('dustPerBatch', v)} type="number" placeholder="每批" className="flex-1" />
                <CompactInput value={formData.dustTotal} onChange={v => handleChange('dustTotal', v)} type="number" placeholder="总计" className="flex-1" />
              </div>
            }
            isFullWidth 
          />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField label="针叶浆(kg)" value={<CompactInput value={formData.softwoodPulp} onChange={v => handleChange('softwoodPulp', v)} type="number" />} />
          <MobileDetailInfoField label="阔叶浆(kg)" value={<CompactInput value={formData.hardwoodPulp} onChange={v => handleChange('hardwoodPulp', v)} type="number" />} />
          <MobileDetailInfoField label="碳酸钙(kg)" value={<CompactInput value={formData.calciumCarbonate} onChange={v => handleChange('calciumCarbonate', v)} type="number" />} />
          <MobileDetailInfoField label="瓜尔胶(kg)" value={<CompactInput value={formData.guarGum} onChange={v => handleChange('guarGum', v)} type="number" />} />
          <MobileDetailInfoField label="香精香料(kg)" value={<CompactInput value={formData.flavor} onChange={v => handleChange('flavor', v)} type="number" />} />
          <MobileDetailInfoField label="丙二醇(kg)" value={<CompactInput value={formData.propyleneGlycol} onChange={v => handleChange('propyleneGlycol', v)} type="number" />} />
          <MobileDetailInfoField label="蜂蜜(kg)" value={<CompactInput value={formData.honey} onChange={v => handleChange('honey', v)} type="number" />} />
          <MobileDetailInfoField label="柠檬酸(kg)" value={<CompactInput value={formData.citricAcid} onChange={v => handleChange('citricAcid', v)} type="number" />} />
          <MobileDetailInfoField label="糖类(kg)" value={<CompactInput value={formData.sugars} onChange={v => handleChange('sugars', v)} type="number" />} />
          <MobileDetailInfoField label="回掺量(kg)" value={<CompactInput value={formData.reblendVolume} onChange={v => handleChange('reblendVolume', v)} type="number" />} />
          <MobileDetailInfoField label="打包零头(kg)" value={<CompactInput value={formData.packFraction} onChange={v => handleChange('packFraction', v)} type="number" />} />
          <MobileDetailInfoField label="皮带秤流量(kg)" value={<CompactInput value={formData.beltScaleFlow} onChange={v => handleChange('beltScaleFlow', v)} type="number" />} />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          {/* 纸箱与内袋 */}
          <MobileDetailInfoField 
            label="纸箱 (领用 / 正常消耗 / 损耗)" 
            value={
              <div className="flex gap-2 mt-1">
                <CompactInput value={formData.cartonReceived} onChange={v => handleChange('cartonReceived', v)} type="number" placeholder="领用" className="flex-1" />
                <CompactInput value={formData.cartonConsumed} onChange={v => handleChange('cartonConsumed', v)} type="number" placeholder="消耗" className="flex-1" />
                <CompactInput value={formData.cartonWasted} onChange={v => handleChange('cartonWasted', v)} type="number" placeholder="损耗" className="flex-1" />
              </div>
            }
            isFullWidth 
          />
          <MobileDetailInfoField 
            label="内袋 (领用 / 正常消耗 / 损耗)" 
            value={
              <div className="flex gap-2 mt-1">
                <CompactInput value={formData.innerBagReceived} onChange={v => handleChange('innerBagReceived', v)} type="number" placeholder="领用" className="flex-1" />
                <CompactInput value={formData.innerBagConsumed} onChange={v => handleChange('innerBagConsumed', v)} type="number" placeholder="消耗" className="flex-1" />
                <CompactInput value={formData.innerBagWasted} onChange={v => handleChange('innerBagWasted', v)} type="number" placeholder="损耗" className="flex-1" />
              </div>
            }
            isFullWidth 
          />

          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField label="离心机渣料(kg)" value={<CompactInput value={formData.centrifugeResidue} onChange={v => handleChange('centrifugeResidue', v)} type="number" />} />
          <MobileDetailInfoField label="烟灰棒(kg)" value={<CompactInput value={formData.ashRod} onChange={v => handleChange('ashRod', v)} type="number" />} />
          <MobileDetailInfoField label="接黑液(桶)" value={<CompactInput value={formData.blackLiquorCount} onChange={v => handleChange('blackLiquorCount', v)} type="number" />} isFullWidth />
          
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          <MobileDetailInfoField label="接班水表示数(t)" value={<CompactInput value={formData.startWaterMeter} onChange={v => handleChange('startWaterMeter', v)} type="number" />} />
          <MobileDetailInfoField label="交班水表示数(t)" value={<CompactInput value={formData.endWaterMeter} onChange={v => handleChange('endWaterMeter', v)} type="number" />} />
          <div className="col-span-2 border-t border-slate-200 border-dashed my-2 pt-3" />
          <MobileDetailInfoField 
            label="1、设备运行情况" 
            isFullWidth
            value={
              <textarea 
                value={formData.equipmentStatus}
                onChange={e => handleChange('equipmentStatus', e.target.value)}
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal outline-none h-20 focus:border-blue-500 transition-colors placeholder:text-slate-400" 
                placeholder="请输入详细记录..."
              ></textarea>
            } 
          />
          <MobileDetailInfoField 
            label="2、质量情况" 
            isFullWidth
            value={
              <textarea 
                value={formData.qualityStatus}
                onChange={e => handleChange('qualityStatus', e.target.value)}
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal outline-none h-20 focus:border-blue-500 transition-colors placeholder:text-slate-400" 
                placeholder="请输入详细记录..."
              ></textarea>
            } 
          />
          <MobileDetailInfoField 
            label="3、现场情况" 
            isFullWidth
            value={
              <textarea 
                value={formData.onsiteStatus}
                onChange={e => handleChange('onsiteStatus', e.target.value)}
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal outline-none h-20 focus:border-blue-500 transition-colors placeholder:text-slate-400" 
                placeholder="请输入详细记录..."
              ></textarea>
            } 
          />
          <MobileDetailInfoField 
            label="4、其他 (香精香料、纸箱、内袋等定额非正常消耗详细说明)" 
            isFullWidth
            value={
              <textarea 
                value={formData.otherStatus}
                onChange={e => handleChange('otherStatus', e.target.value)}
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal outline-none h-24 focus:border-blue-500 transition-colors placeholder:text-slate-400" 
                placeholder="请输入详细记录..."
              ></textarea>
            } 
          />
        </MobileDetailInfoCard>
      </div>

      <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-200 p-2 flex space-x-2 z-30">
        <button className="flex-1 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-bold flex items-center justify-center active:bg-slate-50 transition-colors">
          保存
        </button>
        <button className="flex-[1.5] py-1.5 bg-blue-600 text-white rounded text-[13px] font-bold flex items-center justify-center active:bg-blue-700 transition-colors">
          提交
        </button>
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
        <MobileDetailInfoField label="状态" value="加工中" />
        <MobileDetailInfoField label="产品名称" value="HBZY-10 (河北)" isFullWidth />
        <MobileDetailInfoField label="产品编号" value="PRD-001" />
        <MobileDetailInfoField label="生产类型" value="正式生产" />
        <MobileDetailInfoField label="产量" value="12.00 吨" />
        <MobileDetailInfoField label="报工产量" value="6.00 吨" />
        <MobileDetailInfoField label="理论产量" value="12.00 吨" />
        <MobileDetailInfoField label="入库产量" value="0.00 吨/箱" />
        <MobileDetailInfoField label="完成日期" value="2026-05-12" />
      </MobileModal>

    </MobileDetailLayout>
  );
}
