import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Save, Send, ArrowLeft, Plus, X, RefreshCw } from 'lucide-react';
import { AnnualPlanDetail, ProductType, RegionType, AnnualPlanStatistics, ProductInfo } from '../../../types/plan';
import { mockInitialDetails } from '../../../data/plan/annualPlanData';
import { ProductSelector } from '../components/ProductSelector';
import clsx from 'clsx';

type RenderRow =
  | { type: 'data'; data: AnnualPlanDetail; originalIndex: number; seq: number | null; rowSpanGroup: number; rowSpanCustomer: number; groupLabel: string }
  | { type: 'subtotal' | 'total' | 'grand_total'; label: string; sales: number; production: number };

export default function AnnualPlanCreate() {
  const navigate = useNavigate();
  
  // 表单状态
  const [year, setYear] = useState('2026');
  const [details, setDetails] = useState<AnnualPlanDetail[]>([]);

  // 产品选择弹窗状态
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'single' | 'multiple'>('multiple');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 初始化加载模板数据
  useEffect(() => {
    setDetails(mockInitialDetails);
  }, []);

  // 处理输入框变化
  const handleDetailChange = (index: number, field: keyof AnnualPlanDetail, value: string) => {
    const newDetails = [...details];
    const numValue = parseFloat(value) || 0;
    
    newDetails[index] = {
      ...newDetails[index],
      [field]: numValue
    };

    // 动态核算：预计生产量 = 预计销售量 - 期初库存 + 备产数量
    const { estimatedSalesVolume, initialInventory, reserveQuantity } = newDetails[index];
    newDetails[index].estimatedProductionVolume = estimatedSalesVolume - initialInventory + reserveQuantity;

    setDetails(newDetails);
  };

  // 处理产品选择
  const handleConfirmProducts = (products: ProductInfo[]) => {
    if (products.length === 0) return;

    if (editingIndex !== null && productModalMode === 'single') {
      // 更换产品
      const product = products[0];
      const newDetails = [...details];
      newDetails[editingIndex] = {
        ...newDetails[editingIndex],
        productId: product.id,
        product: product,
        productType: product.productType,
        customerName: product.customerName,
        productName: product.productName,
        productCode: product.productCode,
        brandGrade: product.brandGrade,
        regionType: product.sourceRegion,
      };
      setDetails(newDetails);
    } else {
      // 新增产品 (多选)
      const newRows: AnnualPlanDetail[] = products.map((product, idx) => ({
        id: Date.now().toString() + idx,
        productId: product.id,
        product: product,
        sequenceNumber: 0,
        productType: product.productType,
        regionType: product.sourceRegion,
        customerName: product.customerName,
        productName: product.productName,
        productCode: product.productCode,
        brandGrade: product.brandGrade,
        estimatedSalesVolume: 0,
        unitPriceExclTax: 0, // 实际应从财务系统获取
        initialInventory: 0,
        reserveQuantity: 0,
        estimatedProductionVolume: 0,
      }));
      setDetails([...details, ...newRows]);
    }
    setIsProductModalOpen(false);
    setEditingIndex(null);
  };

  // 模拟从财务系统刷新单价
  const handleRefreshPrice = (index: number) => {
    // 模拟获取 10 到 100 之间的随机单价
    const mockFetchedPrice = Math.floor(Math.random() * 90) + 10;
    handleDetailChange(index, 'unitPriceExclTax', mockFetchedPrice.toString());
  };

  // 动态计算统计数据
  const statistics = useMemo<AnnualPlanStatistics>(() => {
    const stats: AnnualPlanStatistics = {
      inProvinceEstimatedSales: 0,
      inProvinceEstimatedProduction: 0,
      outProvinceEstimatedSales: 0,
      outProvinceEstimatedProduction: 0,
      totalEstimatedSales: 0,
      totalEstimatedProduction: 0,
    };

    details.forEach(item => {
      stats.totalEstimatedSales += item.estimatedSalesVolume || 0;
      stats.totalEstimatedProduction += item.estimatedProductionVolume || 0;

      if (item.productType === ProductType.ReconstitutedTobacco || item.productType === ProductType.ReconstitutedStem) {
        if (item.regionType === RegionType.InProvince) {
          stats.inProvinceEstimatedSales += item.estimatedSalesVolume || 0;
          stats.inProvinceEstimatedProduction += item.estimatedProductionVolume || 0;
        } else if (item.regionType === RegionType.OutProvince) {
          stats.outProvinceEstimatedSales += item.estimatedSalesVolume || 0;
          stats.outProvinceEstimatedProduction += item.estimatedProductionVolume || 0;
        }
      }
    });

    return stats;
  }, [details]);

  // 构建复杂表格渲染数据 (处理 rowSpan 和 合计行)
  const renderRows = useMemo(() => {
    const rows: RenderRow[] = [];
    let seq = 1;

    // 辅助函数：处理区分省内外的产品类型（再造烟叶、再造梗丝）
    const processCategoryWithRegions = (category: ProductType) => {
      let categorySales = 0;
      let categoryProd = 0;
      let hasCategoryData = false;

      [RegionType.InProvince, RegionType.OutProvince].forEach(region => {
        const regionItems = details
          .map((d, i) => ({ ...d, originalIndex: i }))
          .filter(d => d.productType === category && d.regionType === region);

        if (regionItems.length > 0) {
          hasCategoryData = true;
          let regionSales = 0;
          let regionProd = 0;

          const customers = Array.from(new Set(regionItems.map(d => d.customerName)));

          customers.forEach((customer, cIdx) => {
            const customerItems = regionItems.filter(d => d.customerName === customer);

            customerItems.forEach((item, iIdx) => {
              regionSales += item.estimatedSalesVolume || 0;
              regionProd += item.estimatedProductionVolume || 0;

              rows.push({
                type: 'data',
                data: item,
                originalIndex: item.originalIndex,
                seq: (cIdx === 0 && iIdx === 0) ? seq : null,
                rowSpanGroup: (cIdx === 0 && iIdx === 0) ? regionItems.length : 0,
                rowSpanCustomer: iIdx === 0 ? customerItems.length : 0,
                groupLabel: `${region}${category}`
              });
            });
          });

          seq++;

          rows.push({
            type: 'subtotal',
            label: `${region}合计`,
            sales: regionSales,
            production: regionProd
          });

          categorySales += regionSales;
          categoryProd += regionProd;
        }
      });

      if (hasCategoryData) {
        rows.push({
          type: 'total',
          label: `${category}合计`,
          sales: categorySales,
          production: categoryProd
        });
      }

      return { sales: categorySales, production: categoryProd, hasData: hasCategoryData };
    };

    // 1. 再造烟叶
    const tobaccoStats = processCategoryWithRegions(ProductType.ReconstitutedTobacco);

    // 2. 再造梗丝
    const stemStats = processCategoryWithRegions(ProductType.ReconstitutedStem);

    // 3. 再造原料总计
    if (tobaccoStats.hasData || stemStats.hasData) {
      rows.push({
        type: 'grand_total',
        label: `再造原料总计`,
        sales: tobaccoStats.sales + stemStats.sales,
        production: tobaccoStats.production + stemStats.production
      });
    }

    // 4. 香精香料 (不区分省内外)
    const flavorItems = details
      .map((d, i) => ({ ...d, originalIndex: i }))
      .filter(d => d.productType === ProductType.FlavorAndFragrance);

    if (flavorItems.length > 0) {
      let flavorSales = 0;
      let flavorProd = 0;

      const customers = Array.from(new Set(flavorItems.map(d => d.customerName)));

      customers.forEach((customer, cIdx) => {
        const customerItems = flavorItems.filter(d => d.customerName === customer);

        customerItems.forEach((item, iIdx) => {
          flavorSales += item.estimatedSalesVolume || 0;
          flavorProd += item.estimatedProductionVolume || 0;

          rows.push({
            type: 'data',
            data: item,
            originalIndex: item.originalIndex,
            seq: (cIdx === 0 && iIdx === 0) ? seq : null,
            rowSpanGroup: (cIdx === 0 && iIdx === 0) ? flavorItems.length : 0,
            rowSpanCustomer: iIdx === 0 ? customerItems.length : 0,
            groupLabel: ProductType.FlavorAndFragrance
          });
        });
      });

      seq++;

      rows.push({
        type: 'total',
        label: `${ProductType.FlavorAndFragrance}合计`,
        sales: flavorSales,
        production: flavorProd
      });
    }

    return rows;
  }, [details]);

  const handleSubmit = () => {
    const hasNegativeProduction = details.some(d => d.estimatedProductionVolume < 0);
    if (hasNegativeProduction) {
      alert("存在预计生产量为负数的异常数据，禁止提交！");
      return;
    }
    alert("提交审批成功！");
    navigate('/plan/annual');
  };

  return (
    <div className="flex flex-col h-full w-full relative pb-16 space-y-4">
      {/* 顶部操作区 */}
      <div className="flex justify-between items-center bg-white p-4 shrink-0 border border-[#ebeef5] rounded-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-bold text-[#303133]">编制年度产销计划</h2>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-[13px] text-[#606266]">计划年份:</span>
            <Input 
              className="w-32 h-8" 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              placeholder="输入年份"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3 text-sm text-[#606266]">
          <span>凭证编号: <span className="text-[#303133]">系统自动生成</span></span>
        </div>
      </div>

      {/* 详情数据录入表格 */}
      <div className="flex-1 bg-white p-6 flex flex-col overflow-hidden relative border border-[#ebeef5] rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-[#303133]">产销计划明细</h3>
          <div className="flex space-x-2">
            <Button variant="primary" size="sm" onClick={() => { setProductModalMode('multiple'); setEditingIndex(null); setIsProductModalOpen(true); }}>
              <Plus className="w-3.5 h-3.5 mr-1" /> 添加产品
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto border border-[#ebeef5] rounded-sm">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-16 text-center text-[#303133] font-bold">序号</TableHead>
                <TableHead className="w-24 text-center text-[#303133] font-bold">产品类型</TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold">客户名称</TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold">产品型号</TableHead>
                <TableHead className="w-28 text-center text-[#409eff] font-bold">预计销售量</TableHead>
                <TableHead className="w-28 text-center text-[#303133] font-bold">预计生产量</TableHead>
                <TableHead className="w-32 text-center text-[#303133] font-bold">销售单价元/公斤<br/>(不含税)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows.map((row, idx) => {
                if (row.type === 'data') {
                  return (
                    <TableRow key={`data-${row.originalIndex}`} className="hover:bg-gray-50">
                      {row.rowSpanGroup > 0 && (
                        <>
                          <TableCell rowSpan={row.rowSpanGroup} className="text-center">{row.seq}</TableCell>
                          <TableCell rowSpan={row.rowSpanGroup} className="text-center">{row.groupLabel}</TableCell>
                        </>
                      )}
                      {row.rowSpanCustomer > 0 && (
                        <TableCell rowSpan={row.rowSpanCustomer} className="text-center">{row.data.customerName}</TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center justify-between group">
                          <span>{row.data.productCode}</span>
                          <button 
                            className="text-[#409eff] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded"
                            onClick={() => { setProductModalMode('single'); setEditingIndex(row.originalIndex); setIsProductModalOpen(true); }}
                            title="更换产品"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="p-1">
                        <Input 
                          type="number"
                          className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent"
                          value={row.data.estimatedSalesVolume || ''}
                          onChange={(e) => handleDetailChange(row.originalIndex, 'estimatedSalesVolume', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input 
                          type="number"
                          className={clsx("h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent", row.data.estimatedProductionVolume < 0 ? 'text-[#f56c6c] font-bold' : 'text-[#303133]')}
                          value={row.data.estimatedProductionVolume || ''}
                          onChange={(e) => handleDetailChange(row.originalIndex, 'estimatedProductionVolume', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <div className="flex items-center justify-center group">
                          <Input 
                            type="number"
                            className="h-8 w-24 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent"
                            value={row.data.unitPriceExclTax || ''}
                            onChange={(e) => handleDetailChange(row.originalIndex, 'unitPriceExclTax', e.target.value)}
                            placeholder="0.00"
                          />
                          <button 
                            className="text-[#409eff] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded ml-1"
                            onClick={() => handleRefreshPrice(row.originalIndex)}
                            title="从财务系统同步最新单价"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                } else if (row.type === 'subtotal') {
                  return (
                    <TableRow key={`subtotal-${idx}`} className="bg-[#fafafa] font-medium">
                      <TableCell colSpan={4} className="text-center">{row.label}</TableCell>
                      <TableCell className="text-center text-[#409eff]">{row.sales.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-gray-400">{row.production.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-gray-400">/</TableCell>
                    </TableRow>
                  );
                } else if (row.type === 'total' || row.type === 'grand_total') {
                  return (
                    <TableRow key={`total-${idx}`} className="bg-[#f0f2f5] font-bold">
                      <TableCell colSpan={4} className="text-center">{row.label}</TableCell>
                      <TableCell className="text-center text-[#409eff]">{row.sales.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-gray-400">{row.production.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-gray-400">/</TableCell>
                    </TableRow>
                  );
                }
                return null;
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 产品选择弹窗 */}
      <ProductSelector 
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setEditingIndex(null); }}
        multiple={productModalMode === 'multiple'}
        onConfirm={handleConfirmProducts}
      />

      {/* 底部按钮区 (固定在侧边下方独立) */}
      <div className="absolute flex bottom-0 right-0 w-full p-4 border border-[#ebeef5] rounded-sm bg-white items-center justify-end gap-4 shrink-0 z-10">
        <Button variant="outline" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6">
          <Save className="w-3.5 h-3.5 mr-1" /> 保存草稿
        </Button>
        <Button type="button" className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6" onClick={handleSubmit}>
          <Send className="w-3.5 h-3.5 mr-1" /> 提交审批
        </Button>
        <Button type="button" variant="outline" className="px-6 min-w-[80px]" onClick={() => navigate('/plan/annual')}>返 回</Button>
      </div>
    </div>
  );
}
