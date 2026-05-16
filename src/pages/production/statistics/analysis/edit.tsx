import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { mockProductionStatisticsReportData, mockBaseInfo, ProductionStatisticsReportItem } from '../../../../data/production/statistics/analysisReportEditData';

export default function StatisticsReportEditPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ProductionStatisticsReportItem[]>(mockProductionStatisticsReportData);
  const [baseInfo] = useState(mockBaseInfo);
  const [remark, setRemark] = useState('');

  const handleInputChange = (index: number, field: keyof ProductionStatisticsReportItem, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const handleSave = () => {
    navigate(-1);
  };

  const calculateRowSpan = (list: ProductionStatisticsReportItem[], key: keyof ProductionStatisticsReportItem) => {
    const spanMap: Record<number, number> = {};
    let currentVal: any = null;
    let startIdx = 0;
    
    list.forEach((item, index) => {
      if (item[key] !== currentVal) {
        currentVal = item[key];
        spanMap[index] = 1;
        startIdx = index;
      } else {
        spanMap[startIdx] += 1;
        spanMap[index] = 0;
      }
    });
    return spanMap;
  };

  const monthSpans = calculateRowSpan(data, 'month');

  return (
    <div className="flex flex-col h-full w-full relative pb-16 space-y-4 pt-4 px-4 lg:px-6 bg-white overflow-hidden">
      {/* 顶部操作区 */}
      <div className="flex items-center justify-between bg-white p-4 shrink-0 border border-[#ebeef5] rounded-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-bold text-[#303133]">生产统计报表编辑</h2>
          <div className="flex items-center space-x-6 ml-6">
            <span className="text-[13px] text-[#606266] flex items-center">
              审批状态: <span className="ml-2 text-[#303133]">{baseInfo?.status || '-'}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-[13px] text-[#606266]">
          <span>提交人: <span className="text-[#303133]">{baseInfo?.submitter || '-'}</span></span>
          <span>提交时间: <span className="text-[#303133]">{baseInfo?.submitTime || '-'}</span></span>
          <span>报表编号: <span className="text-[#303133]">{baseInfo?.reportNo || '系统自动生成'}</span></span>
        </div>
      </div>

      {/* 详情数据录入表格 */}
      <div className="flex-1 bg-white p-6 flex flex-col overflow-hidden relative border border-[#ebeef5] rounded-sm">
        <div className="flex flex-col mb-4 shrink-0 gap-2">
          <h3 className="font-bold text-sm text-[#303133]">数据明细</h3>
          <div className="text-xs text-[#606266] flex items-center">
            部门：生产管理处（在制品：计入实际产量，未计入入库产量；回掺品：计入入库产量。实际产量需扣除该部分。计划量底色 <span className="inline-block w-3 h-3 bg-[#409eff] ml-1 mr-1"></span> 为增补，<span className="inline-block w-3 h-3 bg-[#e6a23c] ml-1 mr-1"></span> 为调整）
          </div>
        </div>
        
        <div className="flex-1 overflow-auto rounded border border-[#ebeef5]">
          <Table className="border-collapse w-max min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
              <TableRow>
                <TableHead className="sticky left-0 z-30 bg-[#f5f7fa] min-w-[60px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">月份</TableHead>
                <TableHead className="sticky left-[60px] z-30 bg-[#f5f7fa] min-w-[60px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">生产<br/>顺序</TableHead>
                <TableHead className="sticky left-[120px] z-30 bg-[#f5f7fa] min-w-[60px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">类别</TableHead>
                <TableHead className="sticky left-[180px] z-30 bg-[#f5f7fa] min-w-[120px] whitespace-nowrap text-center outline outline-1 outline-[#ebeef5]">牌号</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">计划产量<br/>(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">实际产量<br/>(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">入库产量<br/>(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">长梗原料量<br/>(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">自产回填液<br/>烟末量<br/>(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">原料量<br/>(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">得率(%)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">木浆板*</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">碳酸钙*</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">瓜尔胶*</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">香精香料*</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">全口径得率*</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">生产过程自制<br/>半成品量<br/>(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">自制半成品<br/>产生原因</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">处理方式</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">已处理量</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">回掺品总<br/>量(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">贴标成品<br/>量(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">未贴标成<br/>品量(吨)</TableHead>
                <TableHead className="whitespace-nowrap px-4 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">补贴标量</TableHead>
                <TableHead className="whitespace-nowrap px-8 text-center text-[#303133] outline outline-1 outline-[#ebeef5]">备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  {monthSpans[index] > 0 && (
                    <TableCell style={{ position: 'sticky', left: 0 }} rowSpan={monthSpans[index]} className="z-20 text-center font-medium border-r border-[#ebeef5] bg-[#fafafa]">
                      {item.month}
                    </TableCell>
                  )}
                  <TableCell style={{ position: 'sticky', left: '60px' }} className="z-20 bg-white text-center border-r border-[#ebeef5]">{item.productionOrder}</TableCell>
                  <TableCell style={{ position: 'sticky', left: '120px' }} className="z-20 bg-white text-center border-r border-[#ebeef5] text-[#303133]">{item.category}</TableCell>
                  <TableCell style={{ position: 'sticky', left: '180px' }} className="z-20 bg-white text-center border-r border-[#ebeef5] text-[#303133]">{item.formulaName}</TableCell>
                  
                  {/* 输入部分 */}
                  <TableCell className={`p-1 border-r border-[#ebeef5] w-24 ${
                    item.plannedYieldStatus === 'addition' ? 'bg-[#409eff] bg-opacity-20' : 
                    item.plannedYieldStatus === 'adjustment' ? 'bg-[#e6a23c] bg-opacity-20' : ''
                  }`}>
                    <Input 
                      className={`h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] ${
                        item.plannedYieldStatus ? 'bg-transparent text-[#303133]' : 'bg-transparent text-[#303133]'
                      }`} 
                      value={item.plannedYield}
                      onChange={(e) => handleInputChange(index, 'plannedYield', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.actualYield}
                      onChange={(e) => handleInputChange(index, 'actualYield', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.warehousedYield}
                      onChange={(e) => handleInputChange(index, 'warehousedYield', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.longStemRawVolume}
                      onChange={(e) => handleInputChange(index, 'longStemRawVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.selfProducedBackfillVolume}
                      onChange={(e) => handleInputChange(index, 'selfProducedBackfillVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.rawMaterialVolume}
                      onChange={(e) => handleInputChange(index, 'rawMaterialVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.yieldRate}
                      onChange={(e) => handleInputChange(index, 'yieldRate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.woodPulpBoard}
                      onChange={(e) => handleInputChange(index, 'woodPulpBoard', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.calciumCarbonate}
                      onChange={(e) => handleInputChange(index, 'calciumCarbonate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.guarGum}
                      onChange={(e) => handleInputChange(index, 'guarGum', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.flavorFragrance}
                      onChange={(e) => handleInputChange(index, 'flavorFragrance', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.fullCaliberYield}
                      onChange={(e) => handleInputChange(index, 'fullCaliberYield', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.inProcessSemiFinishedVolume}
                      onChange={(e) => handleInputChange(index, 'inProcessSemiFinishedVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-32">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.semiFinishedReason}
                      onChange={(e) => handleInputChange(index, 'semiFinishedReason', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.treatmentMethod}
                      onChange={(e) => handleInputChange(index, 'treatmentMethod', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.processedVolume}
                      onChange={(e) => handleInputChange(index, 'processedVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.totalBlendedVolume}
                      onChange={(e) => handleInputChange(index, 'totalBlendedVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.labeledFinishedVolume}
                      onChange={(e) => handleInputChange(index, 'labeledFinishedVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.unlabeledFinishedVolume}
                      onChange={(e) => handleInputChange(index, 'unlabeledFinishedVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 border-r border-[#ebeef5] w-24">
                    <Input 
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133]" 
                      value={item.supplementaryLabeledVolume}
                      onChange={(e) => handleInputChange(index, 'supplementaryLabeledVolume', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-1 w-48 border-r border-[#ebeef5]">
                    <Input 
                      title={item.remark}
                      className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent text-[#303133] overflow-hidden text-ellipsis" 
                      value={item.remark}
                      onChange={(e) => handleInputChange(index, 'remark', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 底部按钮区 (固定在侧边下方独立) */}
      <div className="absolute flex bottom-0 right-0 w-full p-4 border-t border-[#ebeef5] rounded-sm bg-white items-center justify-end gap-4 shrink-0 z-10">
        <Button variant="outline" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6">
          保存草稿
        </Button>
        <Button onClick={handleSave} className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6">
          提交审批
        </Button>
        <Button variant="outline" className="px-6 min-w-[80px]" onClick={() => navigate(-1)}>
          返 回
        </Button>
      </div>
    </div>
  );
}
