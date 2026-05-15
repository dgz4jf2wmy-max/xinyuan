import React, { useState } from 'react';
import { ArrowLeft, FileText, ClipboardList } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Modal } from '../../../../components/ui/modal';
import { mockFeedRecords } from '../../../../data/mobile/handoverLogDetailData';
import { mockOperatorLogs } from '../../../../data/production/handover/operatorLogsData';

export default function OperatorLogDetailPage({ id: propId, embedded }: { id?: string | number; embedded?: boolean }) {
  const navigate = useNavigate();
  const params = useParams();
  const id = propId || params.id;
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  
  // Try to find log data in mockOperatorLogs. If not found, use first item to prevent crash
  const logData = mockOperatorLogs.find(l => l.id === Number(id)) || mockOperatorLogs[0];
  const feedRecords = mockFeedRecords;

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

  if (!logData) {
    return (
      <div className="flex flex-col h-full w-full bg-white relative items-center justify-center text-slate-500">
        日志不存在
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 px-4 lg:px-6 pt-[10px] pb-0 flex flex-col overflow-hidden">
          
          <div className="flex-1 flex flex-col overflow-hidden bg-white mb-0 relative">
            <div className="flex-1 overflow-auto custom-scrollbar px-2 lg:px-4 pb-[80px] pt-[10px]">
              <div className="border border-[#e4e7ed] p-4 lg:p-6 rounded-sm bg-white min-h-full relative pb-20">

              <div className="space-y-4 max-w-[1400px] mx-auto">
                
                {/* 1. 基础交接班日志信息独立边框 */}
                <div className="border border-[#e4e7ed] px-5 pb-5 pt-[10px] lg:px-8 lg:pb-8 lg:pt-[10px] rounded-sm">
                  <div className="text-center text-[#409eff] text-[14px] mb-3">
                    基础信息
                  </div>
                  <div className="border-b border-[#ebeef5] w-full mb-6" />

                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    <DisplayInfo label="交接班日志名称" value={logData.logName} isFull />
                    <DisplayInfo label="交接班日志编号" value={logData.logNo} isFull />
                    <DisplayInfo 
                      label="生产任务编号" 
                      value={
                        <button 
                           onClick={() => setIsTaskDetailOpen(true)}
                           className="text-[#409eff] hover:text-[#66b1ff] hover:underline"
                        >
                          {logData.taskNo}
                        </button>
                      } 
                    />
                    <DisplayInfo label="工序" value={logData.process} />
                    <DisplayInfo label="班组名称" value={logData.teamName} />
                    <DisplayInfo label="班次名称" value={logData.shiftName} />
                    <DisplayInfo label="提交人" value={logData.submitter} />
                    <DisplayInfo label="提交时间" value={logData.submitTime} />
                    <DisplayInfo 
                      label="人工填报标识" 
                      value={
                        logData.isManualFill ? 
                          <span className="text-[#f56c6c] font-bold">是</span> : 
                          <span className="text-[#909399]">否</span>
                      } 
                    />
                  </div>
                </div>

                {/* 2. 前处理工序生产运行记录独立边框 */}
                <div className="border border-[#e4e7ed] px-5 pb-5 pt-[10px] lg:px-8 lg:pb-8 lg:pt-[10px] rounded-sm">
                  <div className="text-center text-[#409eff] text-[14px] mb-3">前处理工序生产运行记录</div>
                  <div className="border-b border-[#ebeef5] w-full mb-6" />

                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    {/* 参数与批次配置区 */}
                    <DisplayInfo label="产品名称" value="JSN08-特级" />
                    <DisplayInfo label="日期" value="2026-05-12" />
                    <DisplayInfo label="剩余批次" value="85 批" />
                    <DisplayInfo label="烟梗出料重量/批" value="120.00 kg" />
                    <DisplayInfo label="烟末出料重量/批" value="80.00 kg" />
                    <DisplayInfo 
                      label="当班总量 / 牌号总量 (kg)" 
                      value="45.00 / 120.00"
                    />
                    <DisplayInfo label="原料种类及重量" value="烟梗:120kg | 烟末:80kg" />
                    <DisplayInfo label="当前投料批次 / 重量" value="1440.00 kg" />
                  </div>
                  
                  <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    {/* 备料与投料统计 */}
                    <DisplayInfo label="本班备料批次" value="12 批" />
                    <DisplayInfo label="本班备料总量" value="2640.00 kg" />
                    <DisplayInfo label="现场剩余批次" value="3 批" />
                    <DisplayInfo label="当班投料批次录入" value="已填报" />
                  </div>

                  <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                  {/* 投料时间 */}
                  <div className="mb-6">
                    <div className="text-[14px] font-bold text-[#606266] mb-4">投料时间统计</div>
                    <div className="border border-[#ebeef5] rounded">
                      <div className="grid grid-cols-3 bg-[#f5f7fa] border-b border-[#ebeef5] p-3 text-[13px] font-bold text-[#909399]">
                        <div>原料种类</div>
                        <div>投料时间</div>
                        <div>原料状况</div>
                      </div>
                      <div className="divide-y divide-[#ebeef5]">
                      {feedRecords.map((rec) => (
                          (['stem', 'dust', 'rod'] as const).map((matKey, idx) => {
                            const labelMap: Record<'stem' | 'dust' | 'rod', string> = { stem: '烟梗', dust: '烟末', rod: '烟末棒' };
                            const label = labelMap[matKey];
                            const isAbnormal = rec.status[matKey] === 'abnormal';
                            return (
                              <div key={`${rec.id}-${matKey}`} className={`grid grid-cols-3 p-3 text-[13px] ${isAbnormal ? 'bg-[#fef0f0]' : ''}`}>
                                <div className="text-[#606266] font-medium">{label}</div>
                                <div className="text-[#303133] font-mono">{rec.feedTime.slice(0, 5)}</div>
                                <div>
                                  <span className={`px-2 py-0.5 rounded text-[12px] border ${isAbnormal ? 'text-[#f56c6c] border-[#fde2e2] bg-[#fef0f0]' : 'text-[#909399] border-[#e4e7ed] bg-white'}`}>
                                    {isAbnormal ? '异常' : '正常'}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                      ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#ebeef5] border-dashed w-full my-6" />

                  {/* 其他记录 */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-6">
                    <DisplayInfo 
                      label="生产运行情况" 
                      value={<div className="whitespace-pre-wrap">正常运作</div>}
                      isFull
                    />
                    
                    {/* 烟末筛分生产运行记录表 */}
                    <DisplayInfo label="当班烟末投入量" value="-- kg" />
                    <DisplayInfo label="已投入烟末总量" value="1250.50 kg" />
                    <DisplayInfo label="当班烟末接料量" value="-- kg" />
                    <DisplayInfo label="烟末接料累积量" value="1180.00 kg" />
                    <DisplayInfo label="当班烟灰接料量" value="-- kg" />
                    <DisplayInfo label="烟灰接料累积量" value="45.50 kg" />
                    <DisplayInfo label="当班得率" value={<span className="text-[#e6a23c] font-bold">98.00%</span>} />
                    <DisplayInfo label="单批次总得率" value={<span className="text-[#303133] font-bold">97.96%</span>} />
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
            <DisplayInfo label="生产任务编号" value={logData.taskNo} isFull />
            <DisplayInfo label="产线" value="再造烟叶前处理工序" />
            <DisplayInfo label="产品类型" value="特级" />
            <DisplayInfo label="生产顺序" value="1" />
            <DisplayInfo label="状态" value="加工中" />
            <DisplayInfo label="产品名称" value="JSN08-特级" isFull />
            <DisplayInfo label="产品编号" value="PRD-001" />
            <DisplayInfo label="生产类型" value="正式生产" />
            <DisplayInfo label="产量" value="12.00 吨" />
            <DisplayInfo label="报工产量" value="6.00 吨" />
            <DisplayInfo label="理论产量" value="12.00 吨" />
            <DisplayInfo label="入库产量" value="0.00 吨/箱" />
            <DisplayInfo label="完成日期" value="2026-05-12" />
          </div>
        </Modal>
    </div>
  );
}
