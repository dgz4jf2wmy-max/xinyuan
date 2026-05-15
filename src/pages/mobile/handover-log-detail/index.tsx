import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FileText, ListFilter } from 'lucide-react';
import { getHandoverLogById, mockFeedRecords } from '../../../data/mobile/handoverLogDetailData';
import { 
  MobileDetailLayout, 
  MobileDetailInfoCard, 
  MobileDetailInfoField,
  MobileModal
} from '../components/MobileDetailLayout';

export default function MobileHandoverLogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');
  const logData = getHandoverLogById(Number(id));
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  // Read-only feed records from data source
  const feedRecords = mockFeedRecords;

  if (!logData) {
    return (
      <MobileDetailLayout>
        <div className="flex flex-col items-center justify-center text-slate-500 h-full p-6">
          日志不存在
        </div>
      </MobileDetailLayout>
    );
  }

  return (
    <MobileDetailLayout>
      <div className="pb-16 pt-2">
        
        {/* ================= 1. 基础交接班日志信息 ================= */}
        <MobileDetailInfoCard 
          title="基础信息" 
          icon={<FileText className="w-5 h-5" />}
        >
          <MobileDetailInfoField label="交接班日志名称" value={logData.logName} isFullWidth />
          <MobileDetailInfoField label="交接班日志编号" value={logData.logNo} isFullWidth />
          <MobileDetailInfoField 
            label="生产任务编号" 
            value={
              <button 
                onClick={() => setIsTaskDetailOpen(true)}
                className="text-blue-500 underline underline-offset-2 decoration-blue-200 outline-none text-[13px] font-bold text-left"
              >
                {logData.taskNo}
              </button>
            } 
            isFullWidth 
          />
          <MobileDetailInfoField label="工序" value={logData.process} />
          <MobileDetailInfoField label="班组名称" value={logData.teamName} />
          <MobileDetailInfoField label="班次名称" value={logData.shiftName} />
          <MobileDetailInfoField label="提交人" value={logData.submitter} />
          <MobileDetailInfoField label="提交时间" value={logData.submitTime} />
          <MobileDetailInfoField 
            label="人工填报标识" 
            value={
              logData.isManualFill ? 
                <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded text-[12px]">是</span> : 
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[12px]">否</span>
            } 
          />
        </MobileDetailInfoCard>

        {/* ================= 前处理工序生产运行记录 ================= */}
        <MobileDetailInfoCard 
          title="前处理工序生产运行记录" 
          icon={<ListFilter className="w-5 h-5" />}
        >
          {/* --- 参数与批次配置区 --- */}
          <MobileDetailInfoField label="产品名称" value="JSN08-特级" isFullWidth />
          <MobileDetailInfoField label="日期" value="2026-05-12" />
          <MobileDetailInfoField label="剩余批次" value="85 批" />
          <MobileDetailInfoField label="烟梗出料重量/批" value="120.00 kg" />
          <MobileDetailInfoField label="烟末出料重量/批" value="80.00 kg" />
          
          <MobileDetailInfoField 
            label="当班总量 / 牌号总量 (kg)" 
            value={
              <div className="flex gap-2 font-mono mt-1">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-center">45.00</div>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-center">120.00</div>
              </div>
            }
            isFullWidth
          />
          <MobileDetailInfoField label="原料种类及重量" value="烟梗:120kg | 烟末:80kg" isFullWidth />
          
          <MobileDetailInfoField
            label="当前投料批次 / 重量"
            isFullWidth
            value={
              <div className="flex gap-2 mt-1">
                <div className="w-full text-[13px] font-mono font-bold text-slate-700 text-center bg-slate-50 border border-slate-200 rounded px-2 py-1.5 flex items-center justify-center">1440.00 kg</div>
              </div>
            }
          />
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />
          
          {/* --- 备料与投料统计 --- */}
          <MobileDetailInfoField label="本班备料批次" value="12 批" />
          <MobileDetailInfoField label="本班备料总量" value="2640.00 kg" />
          <MobileDetailInfoField label="现场剩余批次" value="3 批" />
          <MobileDetailInfoField label="当班投料批次录入" value="已填报" />
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
                      <div className="text-[12px] font-mono font-medium text-slate-600 mt-0.5">{rec.feedTime.slice(0, 5)}</div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[11px] ${isAbnormal ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                            {isAbnormal ? '异常' : '正常'}
                          </span>
                        </div>
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
                    <div className="text-[12px] font-mono font-medium text-slate-600">{rec.time}</div>
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
                        <div className="text-[12px] font-mono font-medium text-slate-600">{rec.times[matKey]}</div>
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
              <div className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] font-normal min-h-24 text-slate-600">
                正常运作
              </div>
            } 
          />
          <div className="col-span-2 border-t border-slate-100 my-1 pt-3" />

          {/* --- 烟末筛分生产运行记录表 --- */}
          <MobileDetailInfoField label="当班烟末投入量" value="-- kg" />
          <MobileDetailInfoField label="已投入烟末总量" value="1250.50 kg" />
          <MobileDetailInfoField label="当班烟末接料量" value="-- kg" />
          <MobileDetailInfoField label="烟末接料累积量" value="1180.00 kg" />
          <MobileDetailInfoField label="当班烟灰接料量" value="-- kg" />
          <MobileDetailInfoField label="烟灰接料累积量" value="45.50 kg" />
          <MobileDetailInfoField label="当班得率" value={<span className="text-amber-500 font-black">98.00%</span>} />
          <MobileDetailInfoField label="单批次总得率" value={<span className="text-slate-700 font-black">97.96%</span>} />
        </MobileDetailInfoCard>
      </div>

      <MobileModal 
        isOpen={isTaskDetailOpen} 
        onClose={() => setIsTaskDetailOpen(false)} 
        title="生产任务详情"
        titleIcon={<FileText className="w-4 h-4" />}
        className="p-5 grid grid-cols-2 gap-y-3 gap-x-4"
      >
        <MobileDetailInfoField label="生产任务编号" value={logData.taskNo} isFullWidth />
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

      {mode === 'audit' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20 mx-auto w-full pb-[calc(12px+env(safe-area-inset-bottom))]">
          <button 
            type="button"
            className="flex-1 bg-white border border-[#409eff] text-[#409eff] active:bg-[#ecf5ff] text-[15px] font-medium py-2.5 rounded-lg transition-colors"
            onClick={() => navigate(-1)}
          >
            驳回
          </button>
          <button 
            type="button"
            className="flex-1 bg-[#409eff] active:bg-[#66b1ff] text-white text-[15px] font-medium py-2.5 rounded-lg transition-colors"
            onClick={() => navigate(-1)}
          >
            通过
          </button>
        </div>
      )}
    </MobileDetailLayout>
  );
}
