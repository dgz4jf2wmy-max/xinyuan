import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Save, Send, ArrowLeft, Plus, RefreshCw, GitPullRequest, X } from 'lucide-react';
import { AnnualPlanDetail, ProductType, RegionType, AnnualPlanStatistics, ProductInfo } from '../../../types/plan';
import { mockCurrentVersionDetails, getVersionDetails } from '../../../data/plan/annualPlanDetailData';
import { ProductSelector } from '../components/ProductSelector';
import clsx from 'clsx';

type RenderRow =
  | { type: 'data'; data: AnnualPlanDetail; originalIndex: number; seq: number | null; rowSpanGroup: number; rowSpanCustomer: number; groupLabel: string; sales: number; production: number; initialSales: number; initialProduction: number }
  | { type: 'subtotal' | 'total' | 'grand_total'; label: string; sales: number; production: number; initialSales: number; initialProduction: number };

export default function AnnualPlanAdjust() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // 表单状态
  const [year, setYear] = useState('2026');
  const [details, setDetails] = useState<AnnualPlanDetail[]>([]);

  // 对比状态
  const [isComparing, setIsComparing] = useState(false);
  const initialDetails = useMemo(() => getVersionDetails('v1.0'), []);

  // 产品选择弹窗状态
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'single' | 'multiple'>('multiple');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 初始化加载要调整的数据 (默认加载当前已发布的版本)
  useEffect(() => {
    // 根据 ID (这里 mock) 获取需要调整版本的具体数据
    // 在真实情况会去调用接口拉取该计划详情
    setDetails(mockCurrentVersionDetails.map(d => ({...d})));
  }, [id]);

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
    newDetails[index].estimatedProductionVolume = estimatedSalesVolume - (initialInventory || 0) + (reserveQuantity || 0);

    setDetails(newDetails);
  };

  // 处理产品选择
  const handleConfirmProducts = (products: ProductInfo[]) => {
    if (products.length === 0) return;

    if (editingIndex !== null && productModalMode === 'single') {
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
        unitPriceExclTax: 0,
        initialInventory: 0,
        reserveQuantity: 0,
        estimatedProductionVolume: 0,
      }));
      setDetails([...details, ...newRows]);
    }
    setIsProductModalOpen(false);
    setEditingIndex(null);
  };

  const handleRefreshPrice = (index: number) => {
    const mockFetchedPrice = Math.floor(Math.random() * 90) + 10;
    handleDetailChange(index, 'unitPriceExclTax', mockFetchedPrice.toString());
  };

  // 构建复杂表格渲染数据 (处理 rowSpan 和 合计行，加入对比逻辑)
  const renderRows = useMemo(() => {
    const rows: RenderRow[] = [];
    let seq = 1;

    const processCategoryWithRegions = (category: ProductType) => {
      let categorySales = 0;
      let categoryProd = 0;
      let initialCategorySales = 0;
      let initialCategoryProd = 0;
      let hasCategoryData = false;

      [RegionType.InProvince, RegionType.OutProvince].forEach(region => {
        const regionItems = details
          .map((d, i) => ({ ...d, originalIndex: i }))
          .filter(d => d.productType === category && d.regionType === region);

        if (regionItems.length > 0) {
          hasCategoryData = true;
          let regionSales = 0;
          let regionProd = 0;
          let initRegionSales = 0;
          let initRegionProd = 0;

          const customers = Array.from(new Set(regionItems.map(d => d.customerName)));

          customers.forEach((customer, cIdx) => {
            const customerItems = regionItems.filter(d => d.customerName === customer);

            customerItems.forEach((item, iIdx) => {
              const initItem = initialDetails.find(d => d.productCode === item.productCode);
              const iSales = initItem?.estimatedSalesVolume || 0;
              const iProd = initItem?.estimatedProductionVolume || 0;

              regionSales += item.estimatedSalesVolume || 0;
              regionProd += item.estimatedProductionVolume || 0;
              initRegionSales += iSales;
              initRegionProd += iProd;

              rows.push({
                type: 'data',
                data: item,
                originalIndex: item.originalIndex,
                seq: (cIdx === 0 && iIdx === 0) ? seq : null,
                rowSpanGroup: (cIdx === 0 && iIdx === 0) ? regionItems.length : 0,
                rowSpanCustomer: iIdx === 0 ? customerItems.length : 0,
                groupLabel: `${region}${category}`,
                sales: item.estimatedSalesVolume || 0,
                production: item.estimatedProductionVolume || 0,
                initialSales: iSales,
                initialProduction: iProd,
              });
            });
          });

          seq++;

          rows.push({
            type: 'subtotal',
            label: `${region}合计`,
            sales: regionSales,
            production: regionProd,
            initialSales: initRegionSales,
            initialProduction: initRegionProd
          });

          categorySales += regionSales;
          categoryProd += regionProd;
          initialCategorySales += initRegionSales;
          initialCategoryProd += initRegionProd;
        }
      });

      if (hasCategoryData) {
        rows.push({
          type: 'total',
          label: `${category}合计`,
          sales: categorySales,
          production: categoryProd,
          initialSales: initialCategorySales,
          initialProduction: initialCategoryProd
        });
      }

      return { 
        sales: categorySales, 
        production: categoryProd, 
        initialSales: initialCategorySales,
        initialProduction: initialCategoryProd,
        hasData: hasCategoryData 
      };
    };

    const tobaccoStats = processCategoryWithRegions(ProductType.ReconstitutedTobacco);
    const stemStats = processCategoryWithRegions(ProductType.ReconstitutedStem);

    if (tobaccoStats.hasData || stemStats.hasData) {
      rows.push({
        type: 'grand_total',
        label: `再造原料总计`,
        sales: tobaccoStats.sales + stemStats.sales,
        production: tobaccoStats.production + stemStats.production,
        initialSales: tobaccoStats.initialSales + stemStats.initialSales,
        initialProduction: tobaccoStats.initialProduction + stemStats.initialProduction
      });
    }

    const flavorItems = details
      .map((d, i) => ({ ...d, originalIndex: i }))
      .filter(d => d.productType === ProductType.FlavorAndFragrance);

    if (flavorItems.length > 0) {
      let flavorSales = 0;
      let flavorProd = 0;
      let initialFlavorSales = 0;
      let initialFlavorProd = 0;

      const customers = Array.from(new Set(flavorItems.map(d => d.customerName)));

      customers.forEach((customer, cIdx) => {
        const customerItems = flavorItems.filter(d => d.customerName === customer);

        customerItems.forEach((item, iIdx) => {
          const initItem = initialDetails.find(d => d.productCode === item.productCode);
          const iSales = initItem?.estimatedSalesVolume || 0;
          const iProd = initItem?.estimatedProductionVolume || 0;

          flavorSales += item.estimatedSalesVolume || 0;
          flavorProd += item.estimatedProductionVolume || 0;
          initialFlavorSales += iSales;
          initialFlavorProd += iProd;

          rows.push({
            type: 'data',
            data: item,
            originalIndex: item.originalIndex,
            seq: (cIdx === 0 && iIdx === 0) ? seq : null,
            rowSpanGroup: (cIdx === 0 && iIdx === 0) ? flavorItems.length : 0,
            rowSpanCustomer: iIdx === 0 ? customerItems.length : 0,
            groupLabel: ProductType.FlavorAndFragrance,
            sales: item.estimatedSalesVolume || 0,
            production: item.estimatedProductionVolume || 0,
            initialSales: iSales,
            initialProduction: iProd
          });
        });
      });

      seq++;

      rows.push({
        type: 'total',
        label: `${ProductType.FlavorAndFragrance}合计`,
        sales: flavorSales,
        production: flavorProd,
        initialSales: initialFlavorSales,
        initialProduction: initialFlavorProd
      });

      rows.push({
        type: 'grand_total',
        label: `总计`,
        sales: tobaccoStats.sales + stemStats.sales + flavorSales,
        production: tobaccoStats.production + stemStats.production + flavorProd,
        initialSales: tobaccoStats.initialSales + stemStats.initialSales + initialFlavorSales,
        initialProduction: tobaccoStats.initialProduction + stemStats.initialProduction + initialFlavorProd
      });
    } else if (tobaccoStats.hasData || stemStats.hasData) {
      rows.push({
        type: 'grand_total',
        label: `总计`,
        sales: tobaccoStats.sales + stemStats.sales,
        production: tobaccoStats.production + stemStats.production,
        initialSales: tobaccoStats.initialSales + stemStats.initialSales,
        initialProduction: tobaccoStats.initialProduction + stemStats.initialProduction
      });
    }

    return rows;
  }, [details, initialDetails]);

  const handleSubmit = () => {
    const hasNegativeProduction = details.some(d => d.estimatedProductionVolume < 0);
    if (hasNegativeProduction) {
      alert("存在预计生产量为负数的异常数据，禁止提交！");
      return;
    }
    alert("调整提交审批成功！");
    navigate('/plan/annual');
  };

  return (
    <div className="flex flex-col h-full w-full relative pb-16 space-y-4">
      {/* 顶部操作区 */}
      <div className="flex justify-between items-center bg-white p-4 shrink-0 border border-[#ebeef5] rounded-sm">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-bold text-[#303133]">调整年度产销计划</h2>
          <div className="flex items-center space-x-2 ml-4 bg-gray-50 px-3 py-1.5 rounded text-sm text-[#606266] border border-gray-100">
            <span>计划年份:</span>
            <span className="font-bold">{year}年</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-sm text-[#606266]">
          <span>凭证编号: <span className="text-[#303133]">YCSQ{year}0736</span></span>
        </div>
      </div>

      {/* 详情数据录入表格 */}
      <div className="flex-1 bg-white p-6 flex flex-col overflow-hidden relative border border-[#ebeef5] rounded-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-[#303133]">产销计划明细</h3>
          <div className="flex items-center space-x-2">
            <Button variant="primary" size="sm" onClick={() => { setProductModalMode('multiple'); setEditingIndex(null); setIsProductModalOpen(true); }}>
              <Plus className="w-3.5 h-3.5 mr-1" /> 添加产品
            </Button>
            <Button 
              variant={isComparing ? "primary" : "outline"} 
              size="sm"
              onClick={() => setIsComparing(!isComparing)}
              className="ml-2"
            >
              <GitPullRequest className="w-4 h-4 mr-1" />
              {isComparing ? '退出对比' : '版本对比'}
            </Button>
          </div>
        </div>

        {isComparing && (
          <div className="bg-[#fdf6ec] text-[#e6a23c] p-2 rounded text-sm mb-2 border border-[#faecd8]">
            当前正在进行 <strong>与初始版本 (V1.0)</strong> 的数据对比。黄色标签为初始版本的数据。
          </div>
        )}

        <div className="flex-1 overflow-auto border border-[#ebeef5] rounded-sm">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-16 text-center text-[#303133] font-bold">序号</TableHead>
                <TableHead className="w-24 text-center text-[#303133] font-bold">产品类型</TableHead>
                <TableHead className="w-32 text-center text-[#303133] font-bold">客户名称</TableHead>
                <TableHead className="w-32 text-center text-[#303133] font-bold">牌号</TableHead>
                <TableHead className="w-28 text-center text-[#409eff] font-bold">预计销售量</TableHead>
                <TableHead className="w-24 text-center text-[#303133] font-bold">期初库存</TableHead>
                <TableHead className="w-24 text-center text-[#303133] font-bold">备产数量</TableHead>
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
                          <TableCell rowSpan={row.rowSpanGroup} className="text-center bg-white">{row.seq}</TableCell>
                          <TableCell rowSpan={row.rowSpanGroup} className="text-center bg-white">{row.groupLabel}</TableCell>
                        </>
                      )}
                      {row.rowSpanCustomer > 0 && (
                        <TableCell rowSpan={row.rowSpanCustomer} className="text-center bg-white">{row.data.customerName}</TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center justify-between group">
                          <span>{row.data.brandGrade || '-'}</span>
                          <div className="flex items-center">
                            <button 
                              className="text-[#409eff] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-50 rounded"
                              onClick={() => { setProductModalMode('single'); setEditingIndex(row.originalIndex); setIsProductModalOpen(true); }}
                              title="更换产品"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              className="text-[#f56c6c] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                              onClick={() => {
                                const newDetails = [...details];
                                newDetails.splice(row.originalIndex, 1);
                                setDetails(newDetails);
                              }}
                              title="删除产品"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-1 align-middle text-center">
                        <Input 
                          type="number"
                          className={clsx("h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff]", isComparing ? "bg-white border-gray-200" : "bg-transparent")}
                          value={row.data.estimatedSalesVolume || ''}
                          onChange={(e) => handleDetailChange(row.originalIndex, 'estimatedSalesVolume', e.target.value)}
                        />
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 mt-1 rounded inline-block border border-[#faecd8]">
                            初始: {row.initialSales?.toFixed(2) || '0.00'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="p-1 text-center align-middle text-[#303133]">
                        {row.data.initialInventory?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell className="p-1">
                        <Input 
                          type="number"
                          className="h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent"
                          value={row.data.reserveQuantity || ''}
                          onChange={(e) => handleDetailChange(row.originalIndex, 'reserveQuantity', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1 text-center align-middle">
                        <Input 
                          type="number"
                          className={clsx("h-8 text-center border-transparent hover:border-gray-300 focus:border-[#409eff]", isComparing ? "bg-white border-gray-200" : "bg-transparent", row.data.estimatedProductionVolume < 0 ? 'text-[#f56c6c] font-bold' : 'text-[#303133]')}
                          value={row.data.estimatedProductionVolume || ''}
                          onChange={(e) => handleDetailChange(row.originalIndex, 'estimatedProductionVolume', e.target.value)}
                        />
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block border border-[#faecd8]">
                            初始: {row.initialProduction?.toFixed(2) || '0.00'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="p-1">
                        <div className="flex items-center justify-center group">
                          <Input 
                            type="number"
                            className="h-8 w-24 text-center border-transparent hover:border-gray-300 focus:border-[#409eff] bg-transparent"
                            value={row.data.unitPriceExclTax || row.data.unitPrice || ''}
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
                      <TableCell className="text-center align-middle">
                        <div className={clsx("text-[#409eff]", isComparing && "mb-1")}>
                          {row.sales?.toFixed(2)}
                        </div>
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block border border-[#faecd8]">
                            初始汇总: {row.initialSales?.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-gray-400">/</TableCell>
                      <TableCell className="text-center text-gray-400">/</TableCell>
                      <TableCell className="text-center align-middle">
                         <div className={clsx(isComparing && "mb-1")}>
                          {row.production?.toFixed(2)}
                        </div>
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block border border-[#faecd8]">
                            初始汇总: {row.initialProduction?.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-gray-400">/</TableCell>
                    </TableRow>
                  );
                } else if (row.type === 'total' || row.type === 'grand_total') {
                  return (
                    <TableRow key={`total-${idx}`} className="bg-[#f0f2f5] font-bold">
                      <TableCell colSpan={4} className="text-center">{row.label}</TableCell>
                      <TableCell className="text-center align-middle">
                        <div className={clsx("text-[#409eff]", isComparing && "mb-1")}>
                          {row.sales?.toFixed(2)}
                        </div>
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block font-normal border border-[#faecd8]">
                            初始汇总: {row.initialSales?.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-gray-400">/</TableCell>
                      <TableCell className="text-center text-gray-400">/</TableCell>
                      <TableCell className="text-center align-middle">
                        <div className={clsx(isComparing && "mb-1")}>
                          {row.production?.toFixed(2)}
                        </div>
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block font-normal border border-[#faecd8]">
                            初始汇总: {row.initialProduction?.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
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

      {/* 底部按钮区 */}
      <div className="absolute flex bottom-0 right-0 w-full p-4 border border-[#ebeef5] rounded-sm bg-white items-center justify-end gap-4 shrink-0 z-10">
        <Button variant="outline" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6">
          <Save className="w-3.5 h-3.5 mr-1" /> 保存调整
        </Button>
        <Button type="button" className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6" onClick={handleSubmit}>
          <Send className="w-3.5 h-3.5 mr-1" /> 提交变更
        </Button>
        <Button type="button" variant="outline" className="px-6 min-w-[80px]" onClick={() => navigate('/plan/annual')}>返 回</Button>
      </div>
    </div>
  );
}
