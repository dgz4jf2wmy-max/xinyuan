import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { mockMaterialDetails, mockFlavorDetails, mockDailyReportRemark, mockDailyReportBaseInfo } from '../../../../data/production/statistics/dailyReportDetailData';
import { ProductionDailyReportDetail } from '../../../../types/production/statistics/report';

export default function DailyReportEditPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<ProductionDailyReportDetail[]>(mockMaterialDetails);
  const [flavors, setFlavors] = useState<ProductionDailyReportDetail[]>(mockFlavorDetails);
  const [remark, setRemark] = useState<string>(mockDailyReportRemark);
  const [baseInfo] = useState(mockDailyReportBaseInfo);

  const totalPackagedBoxes = materials.reduce((sum, item) => sum + (Number(item.dailyPackagedBoxes) || 0), 0);
  const totalPackagedAmount = materials.reduce((sum, item) => sum + (Number(item.dailyPackagedAmount) || 0), 0);
  const totalCumulativeFlow = materials.reduce((sum, item) => sum + (Number(item.dailyCumulativeFlow) || 0), 0);

  const categories = Array.from(new Set(flavors.map(f => f.category)));
  const flavorsByCategory = categories.map(cat => ({
    category: cat,
    items: flavors.filter(f => f.category === cat)
  }));
  
  const handleMaterialChange = (index: number, field: keyof ProductionDailyReportDetail, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value === '' || isNaN(Number(value)) ? 0 : Number(value) };
    setMaterials(newMaterials);
  };

  const handleFlavorChange = (catIdx: number, itemIdx: number, value: string) => {
    const category = categories[catIdx];
    const absIdx = flavors.findIndex(f => f.category === category && f.brandCode === flavorsByCategory[catIdx].items[itemIdx].brandCode);
    if (absIdx !== -1) {
      const newFlavors = [...flavors];
      newFlavors[absIdx] = { ...newFlavors[absIdx], dailyPreparationAmount: value === '' || isNaN(Number(value)) ? 0 : Number(value) };
      setFlavors(newFlavors);
    }
  };

  const handleSave = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-full w-full relative pb-16 space-y-4 pt-4 px-4 lg:px-6 bg-white">
      {/* 顶部操作区 */}
      <div className="flex justify-between items-center bg-white p-4 shrink-0 border border-[#ebeef5] rounded-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-bold text-[#303133]">生产日报编辑</h2>
          <div className="flex items-center space-x-6 ml-6">
            <span className="text-[13px] text-[#606266] flex items-center">
              审批状态: <span className="ml-2 text-[#303133]">{baseInfo?.status || '-'}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-[13px] text-[#606266]">
          <span>提交人: <span className="text-[#303133]">{baseInfo?.submitter || '-'}</span></span>
          <span>提交时间: <span className="text-[#303133]">{baseInfo?.submitTime || '-'}</span></span>
          <span>日报编号: <span className="text-[#303133]">{baseInfo?.reportNo || '系统自动生成'}</span></span>
        </div>
      </div>

      {/* 详情数据录入表格 */}
      <div className="flex-1 bg-white p-6 flex flex-col overflow-auto relative border border-[#ebeef5] rounded-sm space-y-8">
        
        {/* 再造原料 */}
        <div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm text-[#303133]">再造原料</h3>
          </div>
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-24 text-center text-[#303133] font-bold">班组名称</TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold">牌号</TableHead>
                <TableHead className="w-40 text-center text-[#409eff] font-bold">当日打包数（箱）</TableHead>
                <TableHead className="w-40 text-center text-[#409eff] font-bold">当日打包量（t）</TableHead>
                <TableHead className="w-40 text-center text-[#409eff] font-bold">当日累计流量（t）</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((m, i) => (
                <TableRow key={`mat-${i}`} className="hover:bg-gray-50">
                  <TableCell>{m.teamName}</TableCell>
                  <TableCell>{m.brandCode}</TableCell>
                  <TableCell className="p-1">
                    {m.brandCode === '-' ? '-' : (
                      <Input 
                        type="number" 
                        value={m.dailyPackagedBoxes || ''} 
                        onChange={(e) => handleMaterialChange(i, 'dailyPackagedBoxes', e.target.value)}
                        className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    )}
                  </TableCell>
                  <TableCell className="p-1">
                    {m.brandCode === '-' ? '-' : (
                      <Input 
                        type="number" 
                        value={m.dailyPackagedAmount || ''} 
                        onChange={(e) => handleMaterialChange(i, 'dailyPackagedAmount', e.target.value)}
                        className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    )}
                  </TableCell>
                  <TableCell className="p-1">
                    {m.brandCode === '-' ? '-' : (
                      <Input 
                        type="number" 
                        value={m.dailyCumulativeFlow || ''} 
                        onChange={(e) => handleMaterialChange(i, 'dailyCumulativeFlow', e.target.value)}
                        className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-[#fafafa] font-medium">
                <TableCell colSpan={2} className="text-center">当日合计</TableCell>
                <TableCell className="text-[#409eff]">{Number.isInteger(totalPackagedBoxes) ? totalPackagedBoxes : totalPackagedBoxes.toFixed(2)}</TableCell>
                <TableCell className="text-[#409eff]">{Number.isInteger(totalPackagedAmount) ? totalPackagedAmount : totalPackagedAmount.toFixed(2)}</TableCell>
                <TableCell className="text-[#409eff]">{Number.isInteger(totalCumulativeFlow) ? totalCumulativeFlow : totalCumulativeFlow.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* 香精香料 */}
        <div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm text-[#303133]">香精香料</h3>
          </div>
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-40 text-center text-[#303133] font-bold">类别</TableHead>
                <TableHead className="w-64 text-center text-[#303133] font-bold">牌号</TableHead>
                <TableHead className="text-center text-[#409eff] font-bold">当日调配量（t）</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flavorsByCategory.map((catGroup, catIdx) => {
                const catSubtotal = catGroup.items.reduce((sum, item) => sum + (Number(item.dailyPreparationAmount) || 0), 0);
                return (
                  <React.Fragment key={`cat-${catIdx}`}>
                    {catGroup.items.map((item, itemIdx) => (
                      <TableRow key={`flavor-${catIdx}-${itemIdx}`} className="hover:bg-gray-50">
                        {itemIdx === 0 && (
                           <TableCell rowSpan={catGroup.items.length}>{catGroup.category}</TableCell>
                        )}
                        <TableCell>{item.brandCode}</TableCell>
                        <TableCell className="p-1">
                          <Input 
                            type="number" 
                            value={item.dailyPreparationAmount || ''} 
                            onChange={(e) => handleFlavorChange(catIdx, itemIdx, e.target.value)}
                            className="h-8 mx-auto text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-[#fafafa] font-medium" style={{ borderTop: 'none' }}>
                      <TableCell colSpan={2} className="text-center">当日小计 ({catGroup.category})</TableCell>
                      <TableCell className="text-[#409eff]">
                        {Number.isInteger(catSubtotal) ? catSubtotal : catSubtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* 备注说明 */}
        <div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm text-[#303133]">备注</h3>
          </div>
          <textarea 
            className="w-full border border-[#dcdfe6] rounded focus:outline-none focus:border-[#409eff] resize-y min-h-[100px] p-3 text-sm transition-colors text-[#606266]" 
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="请输入生产情况总述..."
          />
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
