import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '../../../../components/ui/table';
import { mockMonthlyReportBaseInfo, mockMonthlyReportItems } from '../../../../data/production/statistics/monthlyReportEditData';
import { ProductionMonthlyReportReportInfo } from '../../../../types/production/statistics/report';

export default function MonthlyReportEditPage() {
  const navigate = useNavigate();
  const [baseInfo] = useState(mockMonthlyReportBaseInfo);
  const [items, setItems] = useState<ProductionMonthlyReportReportInfo[]>(mockMonthlyReportItems);

  const handleSave = () => {
    navigate('/production/statistics/report?tab=monthly');
  };

  const handleChange = (brandCode: string, field: keyof ProductionMonthlyReportReportInfo, value: string) => {
    setItems(items.map(i => i.brandCode === brandCode ? { ...i, [field]: value === '' || isNaN(Number(value)) ? 0 : Number(value) } : i));
  };

  const handleGlobalChange = (value: string) => {
    setItems(items.map(i => ({ 
      ...i, 
      flavorProductionLineMonthlyActualDeploymentWarehousingVolume: value === '' || isNaN(Number(value)) ? 0 : Number(value) 
    })));
  };

  const handleProductGroupChange = (productType: string, field: 'monthlyProductionTime' | 'monthlyAverageDailyProduction', value: string) => {
    setItems(items.map(i => i.productType === productType ? { ...i, [field]: value === '' || isNaN(Number(value)) ? 0 : Number(value) } : i));
  };

  const tobaccoItems = items.filter(i => i.productType === '再造烟叶');
  const stemItems = items.filter(i => i.productType === '再造梗丝');

  const sumField = (arr: ProductionMonthlyReportReportInfo[], field: keyof ProductionMonthlyReportReportInfo) => {
    return arr.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  };

  // Safe global stat value
  const globalFlavorVol = items[0]?.flavorProductionLineMonthlyActualDeploymentWarehousingVolume || 0;

  return (
    <div className="flex flex-col h-full w-full relative pb-16 space-y-4 pt-4 px-4 lg:px-6 bg-white">
      {/* 顶部操作区 */}
      <div className="flex justify-between items-center bg-white p-4 shrink-0 border border-[#ebeef5] rounded-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-bold text-[#303133]">生产月报编辑</h2>
          <div className="flex items-center space-x-6 ml-6">
            <span className="text-[13px] text-[#606266] flex items-center">
              状态: <span className="ml-2 text-[#303133]">{baseInfo?.status || '-'}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-[13px] text-[#606266]">
          <span>提交人: <span className="text-[#303133]">{baseInfo?.submitter || '-'}</span></span>
          <span>提交时间: <span className="text-[#303133]">{baseInfo?.submitTime || '-'}</span></span>
          <span>月报编号: <span className="text-[#303133]">{baseInfo?.reportNo || '系统自动生成'}</span></span>
        </div>
      </div>

      {/* 报表信息区 */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white p-6 border border-[#ebeef5] rounded-sm h-full">
          <div className="mb-4">
             <h3 className="font-bold text-sm text-[#303133] border-l-4 border-[#409eff] pl-3">报表信息</h3>
          </div>
          
          <Table className="border-collapse w-full border border-[#ebeef5]">
            <TableBody>
              {/* Row 1: 产品种类 */}
              <TableRow className="bg-[#f5f7fa] hover:bg-transparent">
                <TableCell className="w-32 text-center text-[#303133] font-bold border border-[#ebeef5]">产品种类</TableCell>
                <TableCell className="text-center text-[#303133] font-bold border border-[#ebeef5]" colSpan={tobaccoItems.length + 1}>再造烟叶线</TableCell>
                <TableCell className="text-center text-[#303133] font-bold border border-[#ebeef5]" colSpan={stemItems.length + 1}>再造梗丝线</TableCell>
                <TableCell className="w-40 text-center text-[#303133] font-bold border border-[#ebeef5]" rowSpan={2}>香精香料生产线当月实际调配入库量（吨）</TableCell>
              </TableRow>

              {/* Row 2: 牌号 */}
              <TableRow className="bg-[#f5f7fa] hover:bg-transparent">
                <TableCell className="text-center text-[#303133] font-bold border border-[#ebeef5]">牌号</TableCell>
                {tobaccoItems.map((item) => (
                  <TableCell key={item.brandCode} className="text-center text-[#303133] font-medium border border-[#ebeef5] w-24">{item.brandCode}</TableCell>
                ))}
                <TableCell className="text-center text-[#303133] font-bold border border-[#ebeef5] w-24">合计</TableCell>
                {stemItems.map((item) => (
                  <TableCell key={item.brandCode} className="text-center text-[#303133] font-medium border border-[#ebeef5] w-24">{item.brandCode}</TableCell>
                ))}
                <TableCell className="text-center text-[#303133] font-bold border border-[#ebeef5] w-24">合计</TableCell>
              </TableRow>

              {/* Row 3: 原料消耗 (吨) */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-center text-[#303133] border border-[#ebeef5]">原料消耗（吨）</TableCell>
                {tobaccoItems.map((item) => (
                  <TableCell key={item.brandCode} className="p-1 border border-[#ebeef5]">
                    <Input 
                      type="number" 
                      value={item.materialConsumption || ''} 
                      onChange={(e) => handleChange(item.brandCode, 'materialConsumption', e.target.value)}
                      className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">{sumField(tobaccoItems, 'materialConsumption')}</TableCell>
                {stemItems.map((item) => (
                  <TableCell key={item.brandCode} className="p-1 border border-[#ebeef5]">
                    <Input 
                      type="number" 
                      value={item.materialConsumption || ''} 
                      onChange={(e) => handleChange(item.brandCode, 'materialConsumption', e.target.value)}
                      className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">{sumField(stemItems, 'materialConsumption')}</TableCell>
                <TableCell className="p-1 border border-[#ebeef5] align-middle" rowSpan={6}>
                  <Input 
                    type="number" 
                    value={globalFlavorVol || ''} 
                    onChange={(e) => handleGlobalChange(e.target.value)}
                    className="h-full min-h-[120px] text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                  />
                </TableCell>
              </TableRow>

              {/* Row 4: 实际产量 (吨) */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-center text-[#303133] border border-[#ebeef5]">实际产量（吨）</TableCell>
                {tobaccoItems.map((item) => (
                  <TableCell key={item.brandCode} className="p-1 border border-[#ebeef5]">
                    <Input 
                      type="number" 
                      value={item.actualProduction || ''} 
                      onChange={(e) => handleChange(item.brandCode, 'actualProduction', e.target.value)}
                      className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">{sumField(tobaccoItems, 'actualProduction')}</TableCell>
                {stemItems.map((item) => (
                  <TableCell key={item.brandCode} className="p-1 border border-[#ebeef5]">
                    <Input 
                      type="number" 
                      value={item.actualProduction || ''} 
                      onChange={(e) => handleChange(item.brandCode, 'actualProduction', e.target.value)}
                      className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">{sumField(stemItems, 'actualProduction')}</TableCell>
              </TableRow>

              {/* Row 5: 入库产量 (吨) */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-center text-[#303133] border border-[#ebeef5]">入库产量（吨）</TableCell>
                {tobaccoItems.map((item) => (
                  <TableCell key={item.brandCode} className="p-1 border border-[#ebeef5]">
                    <Input 
                      type="number" 
                      value={item.warehousingProduction || ''} 
                      onChange={(e) => handleChange(item.brandCode, 'warehousingProduction', e.target.value)}
                      className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">{sumField(tobaccoItems, 'warehousingProduction')}</TableCell>
                {stemItems.map((item) => (
                  <TableCell key={item.brandCode} className="p-1 border border-[#ebeef5]">
                    <Input 
                      type="number" 
                      value={item.warehousingProduction || ''} 
                      onChange={(e) => handleChange(item.brandCode, 'warehousingProduction', e.target.value)}
                      className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">{sumField(stemItems, 'warehousingProduction')}</TableCell>
              </TableRow>

              {/* Row 6: 得率 (%) */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-center text-[#303133] border border-[#ebeef5]">得率（%）</TableCell>
                {tobaccoItems.map((item) => {
                   const yieldVal = item.materialConsumption > 0 ? (item.actualProduction / item.materialConsumption) * 100 : 0;
                   return (
                     <TableCell key={item.brandCode} className="text-center text-[#303133] border border-[#ebeef5]">
                        {yieldVal.toFixed(2)}
                     </TableCell>
                   );
                })}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">
                  {(sumField(tobaccoItems, 'materialConsumption') > 0 ? (sumField(tobaccoItems, 'actualProduction') / sumField(tobaccoItems, 'materialConsumption')) * 100 : 0).toFixed(2)}
                </TableCell>
                {stemItems.map((item) => {
                   const yieldVal = item.materialConsumption > 0 ? (item.actualProduction / item.materialConsumption) * 100 : 0;
                   return (
                     <TableCell key={item.brandCode} className="text-center text-[#303133] border border-[#ebeef5]">
                        {yieldVal.toFixed(2)}
                     </TableCell>
                   );
                })}
                <TableCell className="text-center text-[#409eff] font-medium border border-[#ebeef5]">
                  {(sumField(stemItems, 'materialConsumption') > 0 ? (sumField(stemItems, 'actualProduction') / sumField(stemItems, 'materialConsumption')) * 100 : 0).toFixed(2)}
                </TableCell>
              </TableRow>

              {/* Row 7: 月度生产时间 (h) */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-center text-[#303133] border border-[#ebeef5]">月度生产时间（h）</TableCell>
                <TableCell className="p-1 border border-[#ebeef5]" colSpan={tobaccoItems.length + 1}>
                  <Input 
                    type="number" 
                    value={tobaccoItems[0]?.monthlyProductionTime || ''} 
                    onChange={(e) => handleProductGroupChange('再造烟叶', 'monthlyProductionTime', e.target.value)}
                    className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                  />
                </TableCell>
                <TableCell className="p-1 border border-[#ebeef5]" colSpan={stemItems.length + 1}>
                  <Input 
                    type="number" 
                    value={stemItems[0]?.monthlyProductionTime || ''} 
                    onChange={(e) => handleProductGroupChange('再造梗丝', 'monthlyProductionTime', e.target.value)}
                    className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                  />
                </TableCell>
              </TableRow>

              {/* Row 8: 月度平均日产量 (吨) */}
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-center text-[#303133] border border-[#ebeef5]">月度平均日产量(吨)</TableCell>
                <TableCell className="p-1 border border-[#ebeef5]" colSpan={tobaccoItems.length + 1}>
                  <Input 
                    type="number" 
                    value={tobaccoItems[0]?.monthlyAverageDailyProduction || ''} 
                    onChange={(e) => handleProductGroupChange('再造烟叶', 'monthlyAverageDailyProduction', e.target.value)}
                    className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                  />
                </TableCell>
                <TableCell className="p-1 border border-[#ebeef5]" colSpan={stemItems.length + 1}>
                  <Input 
                    type="number" 
                    value={stemItems[0]?.monthlyAverageDailyProduction || ''} 
                    onChange={(e) => handleProductGroupChange('再造梗丝', 'monthlyAverageDailyProduction', e.target.value)}
                    className="h-8 text-center text-[#303133] border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
        <Button variant="outline" className="px-6 min-w-[80px]" onClick={() => navigate('/production/statistics/report?tab=monthly')}>
          返 回
        </Button>
      </div>
    </div>
  );
}
