import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCommit, CheckCircle2, Clock, XCircle, FileText, GitPullRequest, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { mockVersionHistory, mockApprovalProcess, mockCurrentVersionDetails, mockInitialVersionDetails, getVersionDetails } from '../../../data/plan/annualPlanDetailData';
import { AnnualPlanDetail, ProductType, RegionType } from '../../../types/plan';
import { ApprovalProcessTimeline } from '../../../components/ui/approval-process';
import { VerticalFlowchart } from '../../../components/ui/vertical-flowchart';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { PrintPreviewDialog } from '../../../components/ui/print-preview-dialog';
import { AnnualPlanPrintTemplate } from './components/annual-plan-print-template';
import clsx from 'clsx';

export default function AnnualPlanDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'flow'>('form');
  const [isComparing, setIsComparing] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState('v2.0'); // 默认选中当前生效版或草稿
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const versionDetails = getVersionDetails(selectedVersionId);
  const isInitialVersionView = mockVersionHistory.find(v => v.id === selectedVersionId)?.isInitial || false;

  // 渲染版本历史
  const renderVersionHistory = () => {
    // 核心需要强展示的版本
    const coreVersions = mockVersionHistory.filter(v => v.isInitial || v.isCurrent || v.isDraft || v.id === selectedVersionId);
    // 根据状态过滤需要显示的版本
    const visibleVersions = showAllVersions ? mockVersionHistory : coreVersions;

    return (
      <div className="w-[200px] border border-[#ebeef5] rounded-sm flex flex-col h-full shrink-0 bg-white">
        <div className="p-4 border-b border-[#ebeef5] text-sm text-[#303133] font-medium bg-[#f5f7fa]">版本历史</div>
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="relative border-l-2 border-[#ebeef5] ml-3 space-y-6">
            {mockVersionHistory.map((version, index) => {
              const isVisible = visibleVersions.includes(version);
              const isCore = coreVersions.includes(version);
              const prevWasNotCore = index > 0 && !coreVersions.includes(mockVersionHistory[index - 1]);
              
              if (!isVisible) return null;

              return (
                <React.Fragment key={version.id}>
                  {/* 在被折叠区域的末尾（即下一个核心节点之前）渲染展开/收起按钮 */}
                  {isCore && prevWasNotCore && (
                    <div className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-[#ebeef5] bg-[#ebeef5]"></div>
                      <button 
                        className="text-xs text-[#909399] hover:text-[#409eff] underline transition-colors"
                        onClick={() => setShowAllVersions(!showAllVersions)}
                      >
                        {showAllVersions ? '收起中间版本' : '展开所有版本'}
                      </button>
                    </div>
                  )}

                  <div 
                    className="relative pl-6 cursor-pointer group"
                    onClick={() => {
                      setSelectedVersionId(version.id);
                      // 如果切换版本时处于对比模式，可根据业务选择是否退出对比，这里我们保持选择
                    }}
                  >
                    <div className={clsx(
                      "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-colors",
                      selectedVersionId === version.id ? "border-[#409eff]" : "border-[#c0c4cc] group-hover:border-[#409eff]"
                    )}>
                      {selectedVersionId === version.id && <div className="absolute inset-[2px] rounded-full bg-[#409eff]" />}
                    </div>
                    
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-2 w-full pr-2">
                        <span className={clsx("font-medium", selectedVersionId === version.id ? "text-[#409eff]" : "text-[#303133]")}>
                          {version.versionNo}
                        </span>
                        {version.isCurrent && <span className="text-[10px] bg-[#ecf5ff] text-[#409eff] px-1 py-0.5 rounded leading-none shrink-0 border border-[#b3d8ff]">当前生效</span>}
                        {version.isInitial && <span className="text-[10px] bg-[#f4f4f5] text-[#909399] px-1 py-0.5 rounded leading-none shrink-0 border border-[#e9e9eb]">初始版本</span>}
                        {version.isDraft && <span className="text-[10px] bg-[#fdf6ec] text-[#e6a23c] px-1 py-0.5 rounded leading-none shrink-0 border border-[#faecd8]">草稿</span>}
                      </div>
                      <span className="text-xs text-[#909399] mt-1">{version.createdAt}</span>
                      <span className="text-xs text-[#909399]">{version.createdBy}</span>
                    </div>
                  </div>

                  {/* 如果末尾恰好是非核心隐藏版本，且处于展开状态，在最后追加一个按钮 */}
                  {showAllVersions && !isCore && index === mockVersionHistory.length - 1 && (
                     <div className="relative pl-6 mt-6">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-[#ebeef5] bg-[#ebeef5]"></div>
                      <button 
                        className="text-xs text-[#909399] hover:text-[#409eff] underline transition-colors"
                        onClick={() => setShowAllVersions(!showAllVersions)}
                      >
                        收起中间版本
                      </button>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 计算分组汇总的表格数据 (带有初始版本对比注入)
  const renderRows = useMemo(() => {
    const details = getVersionDetails(selectedVersionId);
    const initialDetails = mockInitialVersionDetails; // 总是用 V1.0 作为基准比对

    const rows: {
      type: 'data' | 'subtotal' | 'total' | 'grand_total',
      data?: AnnualPlanDetail,
      originalIndex?: number,
      seq?: number | null,
      rowSpanGroup?: number,
      rowSpanCustomer?: number,
      groupLabel?: string,
      label?: string,
      sales?: number,
      production?: number,
      initialSales?: number,
      initialProduction?: number
    }[] = [];

    let seq = 1;

    const processCategoryWithRegions = (category: string) => {
      let categorySales = 0;
      let categoryProd = 0;
      let initialCategorySales = 0;
      let initialCategoryProd = 0;
      let hasCategoryData = false;

      const regions = [RegionType.InProvince, RegionType.OutProvince];
      
      regions.forEach(region => {
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
                sales: item.estimatedSalesVolume,
                production: item.estimatedProductionVolume,
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
            sales: item.estimatedSalesVolume,
            production: item.estimatedProductionVolume,
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
  }, [selectedVersionId]);

  // 渲染表单数据 (对比逻辑)
  const renderFormData = () => {
    // 判断当前选中的版本是否为初始版本
    // 假设 V1.0 就是初始版本（实际可根据 mockVesionHistory 中 isInitial 判断）
    const isInitialVersionView = selectedVersionId === 'v1.0';

    return (
      <div className="flex flex-col space-y-4">
        {/* 表单头部（参考凭证编号占位） */}
        <div className="flex justify-end items-center text-sm text-[#606266] mb-2">
          <span>凭证编号: YCSQ20260736</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm font-bold text-[#303133]">产销计划明细</div>
          <Button 
            variant={isComparing ? "primary" : "outline"} 
            size="sm"
            onClick={() => setIsComparing(!isComparing)}
          >
            <GitPullRequest className="w-4 h-4 mr-1" />
            {isComparing ? '退出对比' : '版本对比'}
          </Button>
        </div>
        
        {isComparing && (
          <div className="bg-[#fdf6ec] text-[#e6a23c] p-2 rounded text-sm mb-2 border border-[#faecd8]">
            当前正在进行 <strong>与初始版本 (V1.0)</strong> 的数据对比。黄色标签为初始版本的数据。
          </div>
        )}

        <div className="border border-[#ebeef5] rounded overflow-hidden">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-[#f5f7fa]">
                <TableHead className="w-16 text-center text-[#303133] font-bold">序号</TableHead>
                <TableHead className="w-24 text-center text-[#303133] font-bold">产品类型</TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold">客户名称</TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold">产品型号</TableHead>
                <TableHead className="w-28 text-center text-[#409eff] font-bold">预计销售量</TableHead>
                {!isInitialVersionView && (
                  <>
                    <TableHead className="w-24 text-center text-[#303133] font-bold">期初库存</TableHead>
                    <TableHead className="w-24 text-center text-[#303133] font-bold">备产数量</TableHead>
                  </>
                )}
                <TableHead className="w-28 text-center text-[#303133] font-bold">预计生产量</TableHead>
                <TableHead className="w-32 text-center text-[#303133] font-bold">销售单价元/公斤<br/>(不含税)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows.map((row, idx) => {
                if (row.type === 'data' && row.data) {
                  return (
                    <TableRow key={`data-${row.originalIndex}`} className="hover:bg-gray-50">
                      {row.rowSpanGroup !== undefined && row.rowSpanGroup > 0 && (
                        <>
                          <TableCell rowSpan={row.rowSpanGroup} className="text-center bg-white">{row.seq}</TableCell>
                          <TableCell rowSpan={row.rowSpanGroup} className="text-center bg-white">{row.groupLabel}</TableCell>
                        </>
                      )}
                      {row.rowSpanCustomer !== undefined && row.rowSpanCustomer > 0 && (
                        <TableCell rowSpan={row.rowSpanCustomer} className="text-center bg-white">{row.data.customerName}</TableCell>
                      )}
                      <TableCell className="text-center text-[#303133]">
                        {row.data.productCode}
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <div className={clsx("text-[#409eff]", isComparing && "font-bold mb-1")}>
                          {row.data.estimatedSalesVolume?.toFixed(2)}
                        </div>
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block border border-[#faecd8]">
                            初始: {row.initialSales?.toFixed(2) || '0.00'}
                          </div>
                        )}
                      </TableCell>
                      
                      {!isInitialVersionView && (
                        <>
                          <TableCell className="text-center text-[#303133]">
                            {row.data.initialInventory?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell className="text-center text-[#303133]">
                            {row.data.reserveQuantity?.toFixed(2) || '0.00'}
                          </TableCell>
                        </>
                      )}

                      <TableCell className="text-center align-middle">
                        <div className={clsx("text-[#303133]", isComparing && "font-bold mb-1")}>
                          {row.data.estimatedProductionVolume?.toFixed(2)}
                        </div>
                        {isComparing && (
                          <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block border border-[#faecd8]">
                            初始: {row.initialProduction?.toFixed(2) || '0.00'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-[#303133]">
                        {row.data.unitPriceExclTax?.toFixed(2) || '0.00'}
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
                      {!isInitialVersionView && (
                        <>
                          <TableCell className="text-center text-gray-400">/</TableCell>
                          <TableCell className="text-center text-gray-400">/</TableCell>
                        </>
                      )}
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
                      {!isInitialVersionView && (
                        <>
                          <TableCell className="text-center text-gray-400">/</TableCell>
                          <TableCell className="text-center text-gray-400">/</TableCell>
                        </>
                      )}
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
    );
  };

  // 根据用户流程图调整审批流程节点
  const flowchartSteps = [
    { id: 1, title: '草稿中(计划管理员)' },
    { id: 2, title: '待审核(分管领导)' },
    { id: 3, title: '待确认(计划管理员)' },
    { id: 4, title: '已发布(计划管理员)', isActive: true },
    { id: 5, title: '结束' },
  ];

  const renderFlowchart = () => {
    return <VerticalFlowchart steps={flowchartSteps} />;
  };

  return (
    <div className="flex h-full w-full gap-4 items-stretch">
      {/* 左侧版本历史 */}
      {renderVersionHistory()}

      {/* 右侧主体内容 */}
      <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm">
        {/* 选项卡 */}
        <div className="flex-shrink-0">
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} variant="card">
            <TabsList>
              <TabsTrigger value="form">年度产销计划</TabsTrigger>
              <TabsTrigger value="flow">流程图</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 内容区 */}
        <div className={clsx("flex-1 overflow-y-auto relative", activeTab === 'flow' ? 'bg-white' : 'bg-white p-6')}>
          {activeTab === 'form' && (
            <div className="space-y-10">
              {/* 表单数据 */}
              <div className="bg-white">
                {renderFormData()}
              </div>
              
              {/* 审批过程 */}
              <div className="border-t border-[#ebeef5] pt-8 mt-8">
                <div className="text-base font-bold text-[#303133] mb-6 pl-2 border-l-4 border-[#409eff]">过程审批信息</div>
                <ApprovalProcessTimeline data={mockApprovalProcess} />
              </div>
            </div>
          )}

          {activeTab === 'flow' && renderFlowchart()}
        </div>

        {/* 底部按钮区 (固定在容器底部) */}
        <div className="p-4 border-t border-[#ebeef5] bg-white flex items-center justify-end gap-4 shrink-0 relative z-10">
          {mockVersionHistory.find(v => v.id === selectedVersionId)?.isDraft && (
            <Button 
              type="button" 
              className="bg-[#e6a23c] hover:bg-[#ebbb6f] text-white px-6 min-w-[80px]" 
              onClick={() => navigate(`/plan/annual/adjust/${id || 'draft'}`)}
            >
              继续调整
            </Button>
          )}
          <Button variant="outline" className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6" onClick={() => setIsPrintPreviewOpen(true)}>打印</Button>
          <Button type="button" className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 min-w-[80px]" onClick={() => navigate('/plan/annual')}>返 回</Button>
        </div>
      </div>

      {/* 打印预览弹窗 */}
      <PrintPreviewDialog 
        title="打印预览 - 年度产销计划报表"
        isOpen={isPrintPreviewOpen} 
        onClose={() => setIsPrintPreviewOpen(false)}
      >
        <AnnualPlanPrintTemplate 
          renderRows={renderRows}
          versionNo={mockVersionHistory.find(v => v.id === selectedVersionId)?.versionNo || ''}
          year="2026"
          createdAt={mockVersionHistory.find(v => v.id === selectedVersionId)?.createdAt || ''}
          createdBy={mockVersionHistory.find(v => v.id === selectedVersionId)?.createdBy || ''}
          isInitialVersion={isInitialVersionView}
          approvalProcess={mockApprovalProcess}
        />
      </PrintPreviewDialog>
    </div>
  );
}
