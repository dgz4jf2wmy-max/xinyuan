import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseInfo: any;
  reconTasks: any[];
  flavorTasks: any[];
  otherTasks: any[];
}

export function MonthlyTaskPreviewModal({ isOpen, onClose, baseInfo, reconTasks, flavorTasks, otherTasks }: PreviewModalProps) {
  const [activeTab, setActiveTab] = useState('table');

  if (!isOpen) return null;

  const leafTasks = reconTasks.filter(t => !t.productName.startsWith('GS') && !t.productName.includes('梗丝')); 
  const stemTasks = reconTasks.filter(t => t.productName.startsWith('GS') || t.productName.includes('梗丝'));

  const maxReconLen = Math.max(leafTasks.length, stemTasks.length);
  const reconRows = Array.from({ length: maxReconLen }).map((_, i) => {
    return [leafTasks[i] || null, stemTasks[i] || null];
  });

  const flavorLeft = flavorTasks.slice(0, Math.ceil(flavorTasks.length / 2));
  const flavorRight = flavorTasks.slice(Math.ceil(flavorTasks.length / 2));
  const maxFlavorLen = Math.max(flavorLeft.length, flavorRight.length);
  const flavorRows = Array.from({ length: maxFlavorLen }).map((_, i) => {
    return [flavorLeft[i] || null, flavorRight[i] || null];
  });

  const otherLeft = otherTasks.slice(0, Math.ceil(otherTasks.length / 2));
  const otherRight = otherTasks.slice(Math.ceil(otherTasks.length / 2));
  const maxOtherLen = Math.max(otherLeft.length, otherRight.length);
  const otherRows = Array.from({ length: maxOtherLen }).map((_, i) => {
    return [otherLeft[i] || null, otherRight[i] || null];
  });
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl flex flex-col overflow-hidden max-w-[70vw] w-full max-h-[85vh]">
        <div className="px-6 py-3 border-b border-[#e4e7ed] shrink-0 bg-[#f5f7fa] flex justify-between items-center">
          <div className="flex items-end">
            <h2 className="text-lg font-bold text-gray-800 mr-6">月度生产任务编制预览</h2>
            <div className="flex gap-4">
              <button 
                className={`pb-1 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'table' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('table')}
              >任务表</button>
              <button 
                className={`pb-1 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'gantt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('gantt')}
              >甘特图</button>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {activeTab === 'table' ? (
            <>
              <div className="bg-white border text-center font-bold text-xl py-3 border-black text-black">
                月度生产任务安排
              </div>
              <table className="w-full border-collapse border border-black text-sm text-center bg-white">
            <tbody>
              <tr>
                <td className="border border-black font-bold py-3 w-[12%]">事项名称</td>
                <td className="border border-black font-bold py-3">具体内容</td>
              </tr>
              
              {/* 3月生产安排 */}
              <tr>
                <td className="border border-black font-bold text-black">{baseInfo.month}月生产安排</td>
                <td className="border border-black p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      {/* 再造原料 */}
                      <tr>
                         <td colSpan={8} className="border-b border-black font-bold py-1">再造原料</td>
                      </tr>
                      <tr>
                         <td colSpan={8} className="border-b border-black py-1 text-black">
                           {baseInfo.month}月<span className="underline underline-offset-2">1</span>日<span className="underline underline-offset-2">早</span>班起，按如下次序开始生产（起始班次为：<span className="underline underline-offset-2">甲</span>工段第<span className="underline underline-offset-2">1</span>个<span className="underline underline-offset-2">早</span>班，倒班顺序为<span className="underline underline-offset-2">甲、工、丙</span>）
                         </td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black font-bold py-1 w-[10%]">生产顺序</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[15%]">种类</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[15%]">牌号</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[10%]">产量（吨）</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[10%]">生产顺序</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[15%]">种类</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[15%]">牌号</td>
                        <td className="border-b border-black font-bold py-1 w-[10%]">产量（吨）</td>
                      </tr>
                      
                      {reconRows.length > 0 ? reconRows.map((row, idx) => {
                        const bClass = idx === reconRows.length - 1 ? "" : "border-b ";
                        return (
                        <tr key={idx}>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{idx * 2 + 1}</td>
                          <td className={`${bClass}border-r border-black py-1`}>{row[0] ? (row[0].type || '再造烟叶/再造梗丝') : '再造烟叶/再造梗丝'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[0]?.productName || '-'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[0] ? (row[0].amount || '-') : '-'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[1] ? (idx * 2 + 2) : '-'}</td>
                          <td className={`${bClass}border-r border-black py-1`}>{row[1] ? (row[1].type || '再造梗丝/再造烟叶') : '再造梗丝/再造烟叶'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[1]?.productName || '-'}</td>
                          <td className={`${bClass}border-black py-1 text-black font-medium`}>{row[1] ? (row[1].amount || '-') : '-'}</td>
                        </tr>
                        )
                      }) : (
                        <tr>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-r border-black py-1">再造烟叶/再造梗丝</td>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-r border-black py-1">再造梗丝/再造烟叶</td>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-black py-1 text-black font-medium">-</td>
                        </tr>
                      )}

                      {/* 香精香料 */}
                      <tr>
                         <td colSpan={8} className="border-y border-black font-bold py-1">香精香料</td>
                      </tr>
                      <tr>
                         <td colSpan={8} className="border-y border-black py-1">
                           _月_日_班起，按如下次序开始生产（起始班次为：_组_班，倒班顺序为_、_）
                         </td>
                      </tr>
                      <tr>
                        <td className="border-b border-r border-black font-bold py-1 w-[10%]">生产顺序</td>
                        <td colSpan={2} className="border-b border-r border-black font-bold py-1 w-[30%]">牌号</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[10%]">产量（吨）</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[10%]">生产顺序</td>
                        <td colSpan={2} className="border-b border-r border-black font-bold py-1 w-[30%]">牌号</td>
                        <td className="border-b border-black font-bold py-1 w-[10%]">产量（吨）</td>
                      </tr>
                      {flavorRows.length > 0 ? flavorRows.map((row, idx) => {
                        const bClass = idx === flavorRows.length - 1 ? "" : "border-b ";
                        return (
                        <tr key={idx}>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{idx * 2 + 1}</td>
                          <td colSpan={2} className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[0]?.productName || '-'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[0] ? (row[0].amount || '-') : '-'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[1] ? (idx * 2 + 2) : '-'}</td>
                          <td colSpan={2} className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[1]?.productName || '-'}</td>
                          <td className={`${bClass}border-black py-1 text-black font-medium`}>{row[1] ? (row[1].amount || '-') : '-'}</td>
                        </tr>
                        )
                      }) : (
                        <tr>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td colSpan={2} className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td colSpan={2} className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-black py-1 text-black font-medium">-</td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </td>
              </tr>

              {/* 其他生产安排 */}
              <tr>
                <td className="border border-black font-bold py-3">其他生产安排</td>
                <td className="border border-black p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border-b border-r border-black font-bold py-1 w-[16.6%]">类型</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[16.6%]">牌号</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[16.6%]">产量/投料量(吨)</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[16.6%]">类型</td>
                        <td className="border-b border-r border-black font-bold py-1 w-[16.6%]">牌号</td>
                        <td className="border-b border-black font-bold py-1 w-[16%]">数量 (箱) /比例%</td>
                      </tr>
                      {otherRows.length > 0 ? otherRows.map((row, idx) => {
                        const bClass = idx === otherRows.length - 1 ? "" : "border-b ";
                        return (
                        <tr key={idx}>
                          <td className={`${bClass}border-r border-black py-1 font-medium`}>{row[0]?.subType || row[0]?.type || '/'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[0]?.productName || '/'}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[0] ? (row[0].amount || '-') : '-'}</td>
                          <td className={`${bClass}border-r border-black py-1 font-medium`}>{row[1]?.subType || row[1]?.type || ''}</td>
                          <td className={`${bClass}border-r border-black py-1 text-black font-medium`}>{row[1] ? (row[1].productName || '/') : ''}</td>
                          <td className={`${bClass}border-black py-1 text-black font-medium`}>{row[1] ? (row[1].amount || '-') : ''}</td>
                        </tr>
                        )
                      }) : (
                        <tr>
                          <td className="border-r border-black py-1 font-medium">/</td>
                          <td className="border-r border-black py-1 text-black font-medium">/</td>
                          <td className="border-r border-black py-1 text-black font-medium">-</td>
                          <td className="border-r border-black py-1 font-medium"></td>
                          <td className="border-r border-black py-1 text-black font-medium"></td>
                          <td className="border-black py-1 text-black font-medium"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
              
              {/* 其他部门配合事项 */}
              <tr>
                <td className="border border-black font-bold py-3" rowSpan={4}>其他部门配合事项</td>
                <td className="border border-black p-0 text-left" colSpan={1}>
                  <div className="flex w-full h-full">
                    <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-1">技改装备处</div>
                    <div className="flex-1 py-1 px-2 text-black flex items-center">{baseInfo.cooperationEquipment || '请根据本生产安排做好动力能源供应等工作。'}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-0 text-left" colSpan={1}>
                  <div className="flex w-full h-full">
                    <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-1">办公室</div>
                    <div className="flex-1 py-1 px-2 text-black flex items-center">{baseInfo.cooperationOffice || '请根据本生产安排做好班车、食堂保障等工作。'}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-0 text-left" colSpan={1}>
                  <div className="flex w-full h-full">
                    <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-1">技术中心</div>
                    <div className="flex-1 py-1 px-2 text-black flex items-center">{baseInfo.cooperationTechnology || '请根据本生产安排做好工艺配方下发等工作。'}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-black p-0 text-left" colSpan={1}>
                  <div className="flex w-full h-full">
                    <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-1">营销物资处</div>
                    <div className="flex-1 py-1 px-2 text-black flex items-center">{baseInfo.cooperationSales || '请根据本生产安排做好原辅料保障等工作。'}</div>
                  </div>
                </td>
              </tr>
              
              {/* 备注 */}
              <tr>
                <td className="border border-black font-bold py-3">备注</td>
                <td className="border border-black text-left px-2">{baseInfo.remarks}</td>
              </tr>

            </tbody>
          </table>
          </>
          ) : (
            <div className="bg-white rounded-lg border border-[#e4e7ed] shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-4 py-3 border-b border-[#e4e7ed] bg-[#fafafa]">
                <h3 className="font-bold text-[#303133]">甘特图排程预览</h3>
              </div>
              <div className="flex-1 overflow-x-auto p-4">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="flex border-b border-gray-300">
                     <div className="w-48 shrink-0 font-bold p-2 border-r border-gray-300">生产任务名称</div>
                     <div className="flex-1 flex">
                       {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <div key={d} className="flex-1 text-xs text-center border-r border-gray-100 p-1 bg-[#f5f7fa]">{d}</div>
                       ))}
                     </div>
                  </div>
                  
                  {/* Rows */}
                  {[...reconTasks, ...flavorTasks].filter(t => t).map((t, idx) => {
                     let dayStart = (idx * 2) % 20 + 1;
                     let duration = Math.round(Math.max(3, (Number(t.amount) || 10) % 7 + 2));
                     if (t.deadline) {
                        const d = new Date(t.deadline.replace(/\//g, '-'));
                        if (!isNaN(d.getDate())) {
                          const end = d.getDate();
                          if (end > 2) {
                            dayStart = Math.max(1, end - duration);
                          } else {
                            dayStart = 1;
                          }
                        }
                     }
                     if (dayStart + duration > 31) duration = 31 - dayStart + 1;
                     return (
                       <div key={idx} className="flex border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                         <div className="w-48 shrink-0 text-xs p-2 border-r border-gray-300 font-medium truncate flex items-center h-10" title={t.productName}>
                           <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shrink-0"></span>
                           {t.productName}
                         </div>
                         <div className="flex-1 flex relative h-10 items-center border-r border-gray-100">
                           {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                              <div key={d} className="flex-1 border-r border-gray-50 h-full"></div>
                           ))}
                           <div 
                             className="absolute h-6 bg-blue-500 rounded shadow-sm text-[10px] text-white flex items-center px-2 overflow-hidden cursor-pointer hover:bg-blue-600 transition-colors z-10"
                             style={{
                                left: `calc(${((dayStart - 1) / 31) * 100}% + 2px)`,
                                width: `calc(${(duration / 31) * 100}% - 4px)`
                             }}
                             title={`${t.productName} 产量: ${t.amount || '-'}`}
                           >
                             <span className="truncate">任务排期 ({duration}天)</span>
                           </div>
                         </div>
                       </div>
                     );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-[#e4e7ed] bg-[#fafafa] flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="px-6 border-[#dcdfe6] text-[#606266] hover:bg-[#f4f4f5] hover:text-[#409eff] hover:border-[#c6e2ff]">
            关闭
          </Button>
          <Button onClick={onClose} className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 border-none">
            确认
          </Button>
        </div>
      </div>
    </div>
  );
}
