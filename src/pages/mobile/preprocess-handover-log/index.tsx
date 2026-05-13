import React, { useState } from 'react';
import { Camera, Upload, Save, CheckCircle2, ClipboardList, PackageSearch, FileText, Settings, Activity, ListFilter, AlertCircle, X } from 'lucide-react';
import { initialFeedRecords } from '../../../data/mobile/preprocessHandoverData';
import { FeedStatus, FeedDesc } from '../../../types/production/execution/preprocessHandover';
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField,
  MobileDetailSection,
  MobileDetailLogItem,
  MobileModal
} from '../components/MobileDetailLayout';

export default function PreProcessHandoverLog() {
  const [feedRecords, setFeedRecords] = useState(initialFeedRecords);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isManualMode, setIsManualMode] = useState(() => localStorage.getItem('preprocess-manual-mode') === 'true');

  const updateFeedRecord = (id: string, field: 'inTime' | 'status' | 'desc', material: string | null, value: string) => {
    setFeedRecords(prev => prev.map(rec => {
      if (rec.id !== id) return rec;
      if (field === 'inTime') return { ...rec, inTime: value };
      if (field === 'status' && material) return { ...rec, status: { ...rec.status, [material]: value as 'normal' | 'abnormal' } };
      if (field === 'desc' && material) return { ...rec, desc: { ...rec.desc, [material]: value } };
      return rec;
    }));
  };

  const handleManualToggle = () => {
    setIsManualMode(!isManualMode);
  };

  const handleSave = () => {
    localStorage.setItem('preprocess-manual-mode', String(isManualMode));
  };

  const CompactInput = ({ defaultValue = "", type = "text", placeholder = "", className = "" }: { defaultValue?: string, type?: string, placeholder?: string, className?: string }) => (
    <input 
      type={type} 
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`w-full text-[13px] font-normal text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400 ${className}`}
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
          <MobileDetailInfoField label="交接班日志名称" value="再造烟叶前处理工序_早班_20260512_JSN08" isFullWidth />
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
          <MobileDetailInfoField label="工序" value="再造烟叶前处理工序" />
          <MobileDetailInfoField label="班组名称" value="甲班" />
          <MobileDetailInfoField label="班次名称" value="早班" />
          <MobileDetailInfoField label="提交人" value="张建国" />
        </MobileDetailInfoCard>

        {/* ================= 前处理工序生产运行记录 ================= */}
        <MobileDetailInfoCard 
          title="前处理工序生产运行记录" 
          icon={<ListFilter className="w-5 h-5" />}
        >
          {/* --- 参数与批次配置区 --- */}
          <MobileDetailInfoField label="产品名称" value="JSN08-特级" isFullWidth />
          <MobileDetailInfoField label="日期" value={isManualMode ? <CompactInput defaultValue="2026-05-12" type="date" /> : "2026-05-12"} />
          <MobileDetailInfoField label="剩余批次" value={isManualMode ? <CompactInput defaultValue="85 批" /> : "85 批"} />
          <MobileDetailInfoField label="烟梗出料重量/批" value={isManualMode ? <CompactInput defaultValue="120.00 kg" /> : "120.00 kg"} />
          <MobileDetailInfoField label="烟末出料重量/批" value={isManualMode ? <CompactInput defaultValue="80.00 kg" /> : "80.00 kg"} />
          
          <MobileDetailInfoField 
            label="当班总量 / 牌号总量 (kg)" 
            value={
              <div className="flex gap-2 font-mono mt-1">
                {isManualMode ? (
                  <>
                    <CompactInput defaultValue="45.00" />
                    <CompactInput defaultValue="120.00" />
                  </>
                ) : (
                  <>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-center">45.00</div>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-center">120.00</div>
                  </>
                )}
              </div>
            }
            isFullWidth
          />
          <MobileDetailInfoField label="原料种类及重量" value={isManualMode ? <CompactInput defaultValue="烟梗:120kg | 烟末:80kg" /> : "烟梗:120kg | 烟末:80kg"} isFullWidth />
          
          <MobileDetailInfoField
            label="当前投料批次 / 重量"
            isFullWidth
            value={
              <div className="flex gap-2 mt-1">
                <CompactInput type="number" placeholder="批次" />
                {isManualMode ? (
                  <CompactInput defaultValue="1440.00 kg" />
                ) : (
                  <div className="w-full text-[13px] font-mono font-bold text-slate-700 text-center bg-slate-50 border border-slate-200 rounded px-2 py-1.5 flex items-center justify-center">1440.00 kg</div>
                )}
              </div>
            }
          />
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />
          {/* --- 备料与投料统计 --- */}
          <MobileDetailInfoField label="本班备料批次" value={isManualMode ? <CompactInput defaultValue="12 批" /> : "12 批"} />
          <MobileDetailInfoField label="本班备料总量" value={isManualMode ? <CompactInput defaultValue="2640.00 kg" /> : "2640.00 kg"} />
          <MobileDetailInfoField label="现场剩余批次" value={isManualMode ? <CompactInput defaultValue="3 批" /> : "3 批"} />
          <MobileDetailInfoField 
            label="当班投料批次录入" 
            value={<CompactInput placeholder="录入批次" className="mt-1" />}
          />
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />
          {/* --- 投料时间 --- */}
          <div className="col-span-2">
            <div className="grid grid-cols-[2.5fr_3fr_4.5fr] gap-2 mb-2 pb-2 border-b border-slate-100 text-[11px] font-bold text-slate-500">
              <div>原料种类</div>
              <div>投料时间</div>
              <div>原料状况</div>
            </div>
            
            <div className="space-y-3">
            {feedRecords.map((rec, index) => (
              <div key={rec.id} className="space-y-1 relative">
                {(['stem', 'dust', 'rod'] as const).map(matKey => {
                  const labelMap: Record<'stem' | 'dust' | 'rod', string> = { stem: '烟梗', dust: '烟末', rod: '烟末棒' };
                  const label = labelMap[matKey];
                  const isAbnormal = rec.status[matKey] === 'abnormal';
                  return (
                    <div key={matKey} className={`grid grid-cols-[2.5fr_3fr_4.5fr] gap-2 items-start py-1.5 rounded transition-colors ${isAbnormal ? 'bg-red-50/50 -mx-1 px-1' : ''}`}>
                      <div className="text-[12px] font-bold text-slate-700 mt-0.5">{label}</div>
                      <div className="text-[12px] font-mono font-medium text-slate-600 mt-0.5">
                        {isManualMode ? <CompactInput defaultValue={rec.feedTime.slice(0, 5)} type="time" /> : rec.feedTime.slice(0, 5)}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" checked={!isAbnormal} onChange={() => updateFeedRecord(rec.id, 'status', matKey, 'normal')} className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-[11px] text-slate-600">正常</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" checked={isAbnormal} onChange={() => updateFeedRecord(rec.id, 'status', matKey, 'abnormal')} className="w-3.5 h-3.5 text-red-500" />
                            <span className={`text-[11px] ${isAbnormal ? 'text-red-600 font-bold' : 'text-slate-600'}`}>异常</span>
                          </label>
                        </div>
                        {isAbnormal && (
                          <div className="mt-2 flex space-x-1">
                            <button className="p-1 min-w-[24px] flex items-center justify-center bg-white border border-red-200 rounded text-red-500 hover:bg-red-50 shadow-sm"><Camera className="w-3 h-3"/></button>
                            <button className="p-1 min-w-[24px] flex items-center justify-center bg-white border border-red-200 rounded text-red-500 hover:bg-red-50 shadow-sm"><Upload className="w-3 h-3"/></button>
                            <input 
                              type="text" 
                              placeholder="异常描述"
                              value={rec.desc[matKey]} 
                              onChange={(e) => updateFeedRecord(rec.id, 'desc', matKey, e.target.value)} 
                              className="w-full text-[10px] font-normal border border-red-200 rounded px-1.5 py-1 outline-none focus:border-red-400 bg-white text-red-700 placeholder:text-red-300 min-w-0" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {index < feedRecords.length - 1 && (
                  <div className="border-b border-slate-100 border-dashed w-full pt-1" />
                )}
              </div>
            ))}
          </div>
          </div>
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />
          {/* --- 出料时间 --- */}
          <div className="col-span-2">
            <div className="mb-2 pb-2 border-b border-slate-100 text-[11px] font-bold text-slate-500">
              出料时间
            </div>
            
            <div className="space-y-1">
              {[
                { id: 'OUT-001', time: '11:45:00' },
                { id: 'OUT-002', time: '15:00:00' }
              ].map((rec, index, arr) => (
                <div key={rec.id} className="space-y-1 relative">
                  <div className="py-1.5 rounded">
                    <div className="text-[12px] font-mono font-medium text-slate-600">
                      {isManualMode ? <CompactInput defaultValue={rec.time} type="time" /> : rec.time}
                    </div>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="border-b border-slate-100 border-dashed w-full pt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />
          {/* --- 进料时间 --- */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-2 mb-2 pb-2 border-b border-slate-100 text-[11px] font-bold text-slate-500">
              <div>原料种类</div>
              <div>进料时间</div>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'IN-001', times: { stem: '11:18', dust: '11:18', rod: '11:18' } },
                { id: 'IN-002', times: { stem: '14:35', dust: '14:35', rod: '14:35' } }
              ].map((rec, index, arr) => (
                <div key={rec.id} className="space-y-1 relative">
                  {(['stem', 'dust', 'rod'] as const).map(matKey => {
                    const labelMap: Record<'stem' | 'dust' | 'rod', string> = { stem: '烟梗', dust: '烟末', rod: '烟末棒' };
                    const label = labelMap[matKey];
                    return (
                      <div key={matKey} className="grid grid-cols-2 gap-2 items-center py-1.5 rounded transition-colors">
                        <div className="text-[12px] font-bold text-slate-700">{label}</div>
                        <div className="text-[12px] font-mono font-medium text-slate-600">
                          {isManualMode ? <CompactInput defaultValue={rec.times[matKey]} type="time" /> : rec.times[matKey]}
                        </div>
                      </div>
                    );
                  })}
                  {index < arr.length - 1 && (
                    <div className="border-b border-slate-100 border-dashed w-full pt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />
          {/* --- 生产运行情况 --- */}
          <MobileDetailInfoField 
            label="生产运行情况（含设备运行、工艺质量及保养情况）" 
            isFullWidth
            value={
              <textarea 
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal outline-none h-24 focus:border-blue-500 transition-colors placeholder:text-slate-400" 
                placeholder="请输入详细记录..."
              ></textarea>
            } 
          />
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />
          {/* --- 烟末筛分生产运行记录表 --- */}
          <MobileDetailInfoField 
            label="当班烟末投入量" 
            value={<CompactInput type="number" placeholder="当班投入量" />} 
          />
          <MobileDetailInfoField 
            label="已投入烟末总量" 
            value={isManualMode ? <CompactInput defaultValue="1250.50 kg" /> : "1250.50 kg"}
          />
          <MobileDetailInfoField 
            label="当班烟末接料量" 
            value={<CompactInput type="number" placeholder="当班接料量" />} 
          />
          <MobileDetailInfoField 
            label="烟末接料累积量" 
            value={isManualMode ? <CompactInput defaultValue="1180.00 kg" /> : "1180.00 kg"}
          />
          <MobileDetailInfoField 
            label="当班烟灰接料量" 
            value={<CompactInput type="number" placeholder="当班接料量" />} 
          />
          <MobileDetailInfoField 
            label="烟灰接料累积量" 
            value={isManualMode ? <CompactInput defaultValue="45.50 kg" /> : "45.50 kg"}
          />
          <MobileDetailInfoField 
            label="当班得率" 
            value={
              isManualMode ? <CompactInput defaultValue="98.00%" /> : <span className="text-amber-500 font-black">98.00%</span>
            }
          />
          <MobileDetailInfoField 
            label="单批次总得率" 
            value={
              isManualMode ? <CompactInput defaultValue="97.96%" /> : <span className="text-slate-700 font-black">97.96%</span>
            }
          />
        </MobileDetailInfoCard>
      </div>

      <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-200 p-2 flex space-x-2 z-30">
        <button 
          onClick={handleManualToggle}
          className={`flex-1 py-1.5 border rounded text-[13px] font-bold flex items-center justify-center transition-colors ${
            isManualMode 
              ? 'bg-slate-100 border-slate-300 text-slate-600 active:bg-slate-200' 
              : 'bg-rose-50 border-rose-200 text-rose-600 active:bg-rose-100'
          }`}
        >
          {isManualMode ? "退出转人工" : "异常转人工"}
        </button>
        <button 
          onClick={handleSave}
          className="flex-1 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-[13px] font-bold flex items-center justify-center active:bg-slate-50 transition-colors"
        >
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
        <MobileDetailInfoField label="产品名称" value="JSN08-特级" isFullWidth />
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

