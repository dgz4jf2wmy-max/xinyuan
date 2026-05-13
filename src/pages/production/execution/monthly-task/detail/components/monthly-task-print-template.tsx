import React from 'react';
import { MonthlyTaskDetailModel } from '../../../../../../types/production/execution/monthlyTaskDetail';

interface Props {
  data: MonthlyTaskDetailModel;
}

export function MonthlyTaskPrintTemplate({ data }: Props) {
  const reconTasks = data.productionArrangements.filter(t => t.productionLine === '再造原料');
  const flavorTasks = data.productionArrangements.filter(t => t.productionLine === '香精香料');
  const otherTasks = data.otherArrangements;

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
    <div className="w-full bg-white print-safe-area flex justify-center py-6 h-full overflow-y-auto print:h-auto print:overflow-visible">
      <div className="bg-white text-center w-full max-w-5xl px-4 print:px-0">
        <div className="font-bold text-2xl py-4 border border-black text-black border-b-0 w-full text-center">
          {data.baseInfo.taskName}安排表
        </div>
        <table className="w-full border-collapse border border-black text-sm text-center bg-white">
          <tbody>
            <tr>
              <td className="border border-black font-bold py-3 w-[12%]">事项名称</td>
              <td className="border border-black font-bold py-3">具体内容</td>
            </tr>
            
            {/* 生产安排 */}
            <tr>
              <td className="border border-black font-bold text-black">{data.baseInfo.month}月生产安排</td>
              <td className="border border-black p-0">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* 再造原料 */}
                    <tr>
                       <td colSpan={8} className="border-b border-black font-bold py-2">再造原料</td>
                    </tr>
                    <tr>
                       <td colSpan={8} className="border-b border-black py-2 text-black">
                         {data.baseInfo.month}月<span className="underline underline-offset-2">1</span>日<span className="underline underline-offset-2">早</span>班起，按如下次序开始生产（起始班次为：<span className="underline underline-offset-2">甲</span>工段第<span className="underline underline-offset-2">1</span>个<span className="underline underline-offset-2">早</span>班，倒班顺序为<span className="underline underline-offset-2">甲、工、丙</span>）
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
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{idx * 2 + 1}</td>
                        <td className={`${bClass}border-r border-black py-2`}>{row[0] ? (row[0].productType || '再造烟叶/再造梗丝') : '再造烟叶/再造梗丝'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[0]?.productName || '-'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[0] ? (row[0].productionVolume || '-') : '-'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[1] ? (idx * 2 + 2) : '-'}</td>
                        <td className={`${bClass}border-r border-black py-2`}>{row[1] ? (row[1].productType || '再造梗丝/再造烟叶') : '再造梗丝/再造烟叶'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[1]?.productName || '-'}</td>
                        <td className={`${bClass}border-black py-2 text-black font-medium`}>{row[1] ? (row[1].productionVolume || '-') : '-'}</td>
                      </tr>
                      )
                    }) : (
                      <tr>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-r border-black py-2">再造烟叶/再造梗丝</td>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-r border-black py-2">再造梗丝/再造烟叶</td>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-black py-2 text-black font-medium">-</td>
                      </tr>
                    )}

                    {/* 香精香料 */}
                    <tr>
                       <td colSpan={8} className="border-y border-black font-bold py-2">香精香料</td>
                    </tr>
                    <tr>
                       <td colSpan={8} className="border-y border-black py-2">
                         {data.baseInfo.month}月<span className="underline underline-offset-2">1</span>日<span className="underline underline-offset-2">早</span>班起，按如下次序开始生产（起始班次为：<span className="underline underline-offset-2">甲</span>组<span className="underline underline-offset-2">早</span>班，倒班顺序为<span className="underline underline-offset-2">甲、工</span>）
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
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{idx * 2 + 1}</td>
                        <td colSpan={2} className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[0]?.productName || '-'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[0] ? (row[0].productionVolume || '-') : '-'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[1] ? (idx * 2 + 2) : '-'}</td>
                        <td colSpan={2} className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[1]?.productName || '-'}</td>
                        <td className={`${bClass}border-black py-2 text-black font-medium`}>{row[1] ? (row[1].productionVolume || '-') : '-'}</td>
                      </tr>
                      )
                    }) : (
                      <tr>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td colSpan={2} className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td colSpan={2} className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-black py-2 text-black font-medium">-</td>
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
                        <td className={`${bClass}border-r border-black py-2 font-medium`}>{row[0]?.type || '/'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[0]?.productName || '/'}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[0] ? (row[0].productionVolume || '-') : '-'}</td>
                        <td className={`${bClass}border-r border-black py-2 font-medium`}>{row[1]?.type || ''}</td>
                        <td className={`${bClass}border-r border-black py-2 text-black font-medium`}>{row[1] ? (row[1].productName || '/') : ''}</td>
                        <td className={`${bClass}border-black py-2 text-black font-medium`}>{row[1] ? (row[1].productionVolume || '-') : ''}</td>
                      </tr>
                      )
                    }) : (
                      <tr>
                        <td className="border-r border-black py-2 font-medium">/</td>
                        <td className="border-r border-black py-2 text-black font-medium">/</td>
                        <td className="border-r border-black py-2 text-black font-medium">-</td>
                        <td className="border-r border-black py-2 font-medium"></td>
                        <td className="border-r border-black py-2 text-black font-medium"></td>
                        <td className="border-black py-2 text-black font-medium"></td>
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
                  <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-2">技改装备处</div>
                  <div className="flex-1 py-2 px-2 text-black flex items-center">请根据本生产安排做好动力能源供应等工作。</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-0 text-left" colSpan={1}>
                <div className="flex w-full h-full">
                  <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-2">办公室</div>
                  <div className="flex-1 py-2 px-2 text-black flex items-center">请根据本生产安排做好班车、食堂保障等工作。</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-0 text-left" colSpan={1}>
                <div className="flex w-full h-full">
                  <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-2">技术中心</div>
                  <div className="flex-1 py-2 px-2 text-black flex items-center">请根据本生产安排做好工艺配方下发等工作。</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-0 text-left" colSpan={1}>
                <div className="flex w-full h-full">
                  <div className="w-[10.5%] border-r border-black font-bold text-black flex items-center justify-center py-2">营销物资处</div>
                  <div className="flex-1 py-2 px-2 text-black flex items-center">请根据本生产安排做好原辅料保障等工作。</div>
                </div>
              </td>
            </tr>
            
            {/* 备注 */}
            <tr>
              <td className="border border-black font-bold py-3">备注</td>
              <td className="border border-black text-left px-2 py-3">无</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
