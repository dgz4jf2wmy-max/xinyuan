import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { mockWeeklyEditMaterialDetails, mockWeeklyEditFlavorDetails, mockWeeklyEditTestDetails, mockWeeklyEditOtherInfo, mockWeeklyEditWorkSummary, mockWeeklyReportEditBaseInfo } from '../../../../data/production/statistics/weeklyReportEditData';
import { ProductionWeeklyReportMaterialDetail, ProductionWeeklyReportFlavorDetail, ProductionWeeklyReportTestDetail } from '../../../../types/production/statistics/report';

export default function WeeklyReportEditPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<ProductionWeeklyReportMaterialDetail[]>(mockWeeklyEditMaterialDetails);
  const [flavors, setFlavors] = useState<ProductionWeeklyReportFlavorDetail[]>(mockWeeklyEditFlavorDetails);
  const [tests, setTests] = useState<ProductionWeeklyReportTestDetail[]>(mockWeeklyEditTestDetails);
  
  const [otherInfo, setOtherInfo] = useState(mockWeeklyEditOtherInfo);
  const [workSummary, setWorkSummary] = useState(mockWeeklyEditWorkSummary.workSummary);
  
  const [baseInfo] = useState(mockWeeklyReportEditBaseInfo);

  const categories = Array.from(new Set(flavors.map(f => f.productionType)));
  const flavorsByCategory = categories.map(cat => ({
    category: cat,
    items: flavors.filter(f => f.productionType === cat)
  }));

  const flavorPlans = [
    { customerName: '江苏中烟', production: 1850, cumulative: 296.63, progress: 0.1603 },
    { customerName: '新桥', production: 220, cumulative: 39.31, progress: 0.1787 },
    { customerName: '合计', production: 2070, cumulative: 335.94, progress: 0.1623 },
  ];

  const formatPercent = (val: number) => {
    return (val * 100).toFixed(2) + '%';
  };

  const handleMaterialChange = (index: number, field: keyof ProductionWeeklyReportMaterialDetail, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = { ...newMaterials[index], [field]: field === 'remark' ? value : (value === '' || isNaN(Number(value)) ? 0 : Number(value)) } as any;
    setMaterials(newMaterials);
  };

  const handleFlavorChange = (catIdx: number, itemIdx: number, field: keyof ProductionWeeklyReportFlavorDetail, value: string) => {
    const category = categories[catIdx];
    const absIdx = flavors.findIndex(f => f.productionType === category && f.brandCode === flavorsByCategory[catIdx].items[itemIdx].brandCode);
    if (absIdx !== -1) {
      const newFlavors = [...flavors];
      newFlavors[absIdx] = { ...newFlavors[absIdx], [field]: field === 'remark' ? value : (value === '' || isNaN(Number(value)) ? 0 : Number(value)) } as any;
      setFlavors(newFlavors);
    }
  };

  const handleTestChange = (index: number, field: keyof ProductionWeeklyReportTestDetail, value: string) => {
    const newTests = [...tests];
    newTests[index] = { ...newTests[index], [field]: field === 'remark' || field === 'recipeName' ? value : (value === '' || isNaN(Number(value)) ? 0 : Number(value)) } as any;
    setTests(newTests);
  };

  const handleOtherInfoChange = (field: keyof typeof otherInfo, value: string) => {
    setOtherInfo(prev => ({
      ...prev,
      [field]: value === '' || isNaN(Number(value)) ? 0 : Number(value)
    }));
  };

  const handleSave = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full w-full relative pb-16 space-y-4 pt-4 px-4 lg:px-6 bg-white">
      {/* 顶部操作区 */}
      <div className="flex justify-between items-center bg-white p-4 shrink-0 border border-[#ebeef5] rounded-sm">
        <div className="flex items-center gap-2 text-[#303133]">
          <h2 className="text-sm font-bold text-[#303133]">生产周报编辑</h2>
          <div className="flex items-center space-x-6 ml-6">
            <span className="text-[13px] text-[#606266] flex items-center">
              审批状态: <span className="ml-2 text-[#e6a23c]">{baseInfo?.status || '-'}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-[13px] text-[#606266]">
          <span>提交人: <span className="text-[#303133]">{baseInfo?.submitter || '-'}</span></span>
          <span>提交时间: <span className="text-[#303133]">{baseInfo?.submitTime || '-'}</span></span>
          <span>周报编号: <span className="text-[#303133]">{baseInfo?.reportNo || '系统自动生成'}</span></span>
        </div>
      </div>

      {/* 详情数据录入表格 */}
      <div className="flex-1 bg-white p-6 flex flex-col overflow-auto relative border border-[#ebeef5] rounded-sm space-y-8">
        
        {/* 再造原料生产情况 */}
        <div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm text-[#303133]">一、再造原料生产情况（单位：吨）</h3>
          </div>
          <div className="border border-[#ebeef5] rounded">
            <Table className="border-collapse w-full">
              <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
                <TableRow className="bg-[#f5f7fa]">
                  <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">序号</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">产品类型</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">牌号</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">实际产量</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold">备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((m, i) => (
                  <TableRow key={`mat-${i}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                    <TableCell className="text-center border-r border-[#ebeef5]">{i + 1}</TableCell>
                    <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{m.productType}</TableCell>
                    <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{m.brandCode}</TableCell>
                    <TableCell className="text-center text-[#303133] border-r border-[#ebeef5] p-1">
                      <Input 
                        type="number" 
                        value={m.actualProduction || ''} 
                        onChange={(e) => handleMaterialChange(i, 'actualProduction', e.target.value)}
                        className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input 
                        type="text" 
                        value={m.remark || ''} 
                        onChange={(e) => handleMaterialChange(i, 'remark', e.target.value)}
                        className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                  <TableCell colSpan={3} className="text-center border-r border-[#ebeef5]">小计</TableCell>
                  <TableCell colSpan={2} className="text-center text-[#303133]">{materials[0]?.subtotalActualProduction}</TableCell>
                </TableRow>
                {/* 年度计划 */}
                <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                  <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">再造烟叶年度计划产量</TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedTobaccoYearlyPlan}</TableCell>
                  <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">累计完成产量</TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedTobaccoCumulative}</TableCell>
                  <TableCell className="text-center bg-[#f5f7fa]">产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(materials[0]?.reconstitutedTobaccoProgress || 0)}</span></TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                  <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">再造梗丝年度计划产量</TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedStemYearlyPlan}</TableCell>
                  <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">累计完成产量</TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.reconstitutedStemCumulative}</TableCell>
                  <TableCell className="text-center bg-[#f5f7fa]">产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(materials[0]?.reconstitutedStemProgress || 0)}</span></TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
                  <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">多孔颗粒年度计划产量</TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.porousGranuleYearlyPlan}</TableCell>
                  <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">累计完成产量</TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{materials[0]?.porousGranuleCumulative}</TableCell>
                  <TableCell className="text-center bg-[#f5f7fa]">产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(materials[0]?.porousGranuleProgress || 0)}</span></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 香精香料生产情况 */}
        <div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm text-[#303133]">二、香精香料生产情况（单位：吨）</h3>
          </div>
          <div className="border border-[#ebeef5] rounded">
            <Table className="border-collapse w-full">
              <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
                <TableRow className="bg-[#f5f7fa]">
                  <TableHead className="w-20 text-center text-[#303133] font-bold border-r border-[#ebeef5]">序号</TableHead>
                  <TableHead className="w-32 text-center text-[#303133] font-bold border-r border-[#ebeef5]">生产类型</TableHead>
                  <TableHead className="w-64 text-center text-[#303133] font-bold border-r border-[#ebeef5]">牌号</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">实际产量</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold">备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flavorsByCategory.map((catGroup, catIdx) => {
                  const startIndex = flavorsByCategory.slice(0, catIdx).reduce((acc, curr) => acc + curr.items.length, 0);
                  return (
                    <React.Fragment key={`cat-${catIdx}`}>
                      {catGroup.items.map((item, itemIdx) => (
                        <TableRow key={`flavor-${catIdx}-${itemIdx}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                          <TableCell className="text-center border-r border-[#ebeef5]">{startIndex + itemIdx + 1}</TableCell>
                          {itemIdx === 0 && (
                             <TableCell rowSpan={catGroup.items.length} className="text-center bg-white border-r border-[#ebeef5]">{catGroup.category}</TableCell>
                          )}
                          <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">{item.brandCode}</TableCell>
                          <TableCell className="text-center border-r border-[#ebeef5] p-1">
                            <Input 
                              type="number" 
                              value={item.actualProduction || ''} 
                              onChange={(e) => handleFlavorChange(catIdx, itemIdx, 'actualProduction', e.target.value)}
                              className="h-8 text-[#303133] mx-auto text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                            />
                          </TableCell>
                          <TableCell className="text-center p-1">
                            <Input 
                              type="text" 
                              value={item.remark || ''} 
                              onChange={(e) => handleFlavorChange(catIdx, itemIdx, 'remark', e.target.value)}
                              className="h-8 mx-auto text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5] bg-[#fafafa]">
                        <TableCell colSpan={3} className="text-center font-medium border-r border-[#ebeef5]">小计</TableCell>
                        <TableCell colSpan={2} className="text-center text-[#303133]">
                          {catGroup.items[0]?.subtotalActualProduction}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
                <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5] hover:bg-[#fafafa]">
                  <TableCell colSpan={3} className="text-center font-medium border-r border-[#ebeef5]">合计</TableCell>
                  <TableCell colSpan={2} className="text-center text-[#303133]">
                    117.535
                  </TableCell>
                </TableRow>

                {flavorPlans.map((plan, i) => (
                  <TableRow key={`plan-${i}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                    {i === 0 && (
                      <TableCell rowSpan={flavorPlans.length} className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">香精香料<br/>年度计划<br/>产量</TableCell>
                    )}
                    <TableCell colSpan={2} className="text-center border-r border-[#ebeef5] bg-white">
                      <div className="flex justify-between px-6">
                        <span>{plan.customerName}</span>
                        <span className="text-[#303133]">{plan.production}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center border-r border-[#ebeef5] bg-[#f5f7fa]">
                      累计完成产量<span className="text-[#303133] font-normal ml-4">{plan.cumulative}</span>
                    </TableCell>
                    <TableCell className="text-center bg-[#f5f7fa]">
                      产量执行进度 <span className="text-[#303133] font-normal ml-2">{formatPercent(plan.progress)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 工艺配方试验情况 */}
        <div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm text-[#303133]">三、工艺配方试验情况（kg）</h3>
          </div>
          <div className="border border-[#ebeef5] rounded">
            <Table className="border-collapse w-full">
              <TableHeader className="sticky top-0 z-10 shadow-[0_1px_0_#ebeef5]">
                <TableRow className="bg-[#f5f7fa]">
                  <TableHead className="w-24 text-center text-[#303133] font-bold border-r border-[#ebeef5]">序号</TableHead>
                  <TableHead className="w-64 text-center text-[#303133] font-bold border-r border-[#ebeef5]">配方名称</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold border-r border-[#ebeef5]">实际产量</TableHead>
                  <TableHead className="text-center text-[#303133] font-bold">备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((t, i) => (
                  <TableRow key={`test-${i}`} className="hover:bg-gray-50 border-b border-[#ebeef5]">
                    <TableCell className="text-center border-r border-[#ebeef5]">{i + 1}</TableCell>
                    <TableCell className="text-center border-r border-[#ebeef5] p-1">
                      <Input 
                        type="text" 
                        value={t.recipeName || ''} 
                        onChange={(e) => handleTestChange(i, 'recipeName', e.target.value)}
                        className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    </TableCell>
                    <TableCell className="text-center border-r border-[#ebeef5] p-1">
                      <Input 
                        type="number" 
                        value={t.actualProduction || ''} 
                        onChange={(e) => handleTestChange(i, 'actualProduction', e.target.value)}
                        className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    </TableCell>
                    <TableCell className="text-center p-1">
                      <Input 
                        type="text" 
                        value={t.remark || ''} 
                        onChange={(e) => handleTestChange(i, 'remark', e.target.value)}
                        className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* 其他情况 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-[#303133]">四、其他情况</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#606266]">再造烟叶补贴标数量（箱） <span className="text-[#e02020]">*</span></label>
              <Input 
                type="number" 
                value={otherInfo.reconstitutedTobaccoLabelingAmount} 
                onChange={(e) => handleOtherInfoChange('reconstitutedTobaccoLabelingAmount', e.target.value)} 
                className="h-8 border-[#dcdfe6] focus:border-[#409eff]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#606266]">再造梗丝补贴标数量（箱） <span className="text-[#e02020]">*</span></label>
              <Input 
                type="number" 
                value={otherInfo.reconstitutedStemLabelingAmount} 
                onChange={(e) => handleOtherInfoChange('reconstitutedStemLabelingAmount', e.target.value)}
                className="h-8 border-[#dcdfe6] focus:border-[#409eff]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#606266]">原料预混打包数量（吨） <span className="text-[#e02020]">*</span></label>
              <Input 
                type="number" 
                value={otherInfo.rawMaterialPremixingAmount} 
                onChange={(e) => handleOtherInfoChange('rawMaterialPremixingAmount', e.target.value)}
                className="h-8 border-[#dcdfe6] focus:border-[#409eff]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#606266]">烟末筛分数量（吨） <span className="text-[#e02020]">*</span></label>
              <Input 
                type="number" 
                value={otherInfo.tobaccoDustScreeningAmount} 
                onChange={(e) => handleOtherInfoChange('tobaccoDustScreeningAmount', e.target.value)}
                className="h-8 border-[#dcdfe6] focus:border-[#409eff]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#606266]">翻箱数量（吨） <span className="text-[#e02020]">*</span></label>
              <Input 
                type="number" 
                value={otherInfo.boxFlippingAmount} 
                onChange={(e) => handleOtherInfoChange('boxFlippingAmount', e.target.value)}
                className="h-8 border-[#dcdfe6] focus:border-[#409eff]"
              />
            </div>
          </div>
        </div>

        {/* 各条线工作简述 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-sm text-[#303133]">五、各条线工作简述</h3>
            <span className="text-xs text-[#e02020]">*</span>
          </div>
          <textarea 
            className="w-full border border-[#dcdfe6] rounded focus:outline-none focus:border-[#409eff] resize-y min-h-[120px] p-3 text-sm transition-colors text-[#606266]" 
            value={workSummary}
            onChange={(e) => setWorkSummary(e.target.value)}
            placeholder="请输入各条线工作简述..."
          />
        </div>
      </div>

      {/* 底部按钮区 */}
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
