import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select } from '../../../../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { getPoolPage } from '../../../../data/plan/productionPoolData';
import { ProductionPlanPool } from '../../../../types/production-pool';
import { ProductType } from '../../../../types/plan';
import { AlertTriangle, GripVertical, ArrowRight, ChevronDown, ChevronUp, ChevronRight, ArrowUpDown } from 'lucide-react';
import { MonthlyProductionPlanDetail, MonthlyProductionPlanTable } from '../../../../types/monthly-plan';
import { RawMaterialInventoryDialog } from '../components/raw-material-inventory-dialog';
import { cn } from '../../../../lib/utils';

export default function MonthlyProductionPlanCreate() {
  const navigate = useNavigate();

  const [planName, setPlanName] = useState('');
  const [activeCategory, setActiveCategory] = useState<'raw_material' | 'flavor'>('raw_material');
  
  // Left side: Pending Pool
  const [pendingPool, setPendingPool] = useState<ProductionPlanPool[]>([]);
  const [selectedPoolIds, setSelectedPoolIds] = useState<Set<string>>(new Set());
  
  // Right side: Draft Plan Data
  const [draftTables, setDraftTables] = useState<MonthlyProductionPlanTable[]>([]);
  const [draftDetails, setDraftDetails] = useState<MonthlyProductionPlanDetail[]>([]);
  const [expandedTableIds, setExpandedTableIds] = useState<Set<string>>(new Set());
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);

  // Drag and Drop States
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [overLimitWarning, setOverLimitWarning] = useState<string | null>(null);

  // Computed: Category mapping
  const categoryTypesMap = {
    raw_material: [ProductType.ReconstitutedTobacco, ProductType.ReconstitutedStem],
    flavor: [ProductType.FlavorAndFragrance]
  };

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [groupByFilter, setGroupByFilter] = useState<string>('');

  // Filtered lists based on category
  let currentPendingPool = pendingPool.filter(p => 
    categoryTypesMap[activeCategory].includes(p.productType as ProductType)
  );

  if (sortConfig) {
    currentPendingPool.sort((a: any, b: any) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  useEffect(() => {
    // Load pending plans
    getPoolPage({ status: '待计划', pageNum: 1, pageSize: 100 }).then(res => {
      setPendingPool(res.list.filter(p => p.status === '待计划' && !p.productionType?.includes('醇化')));
    });
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const renderSortHeader = (title: string, key: string) => {
    const isSorted = sortConfig?.key === key;
    return (
      <div 
        className="flex items-center cursor-pointer select-none hover:text-[#409eff] transition-colors"
        onClick={() => handleSort(key)}
      >
        {title}
        <span className="ml-1 inline-flex flex-col text-[10px] text-gray-400">
          {isSorted ? (
            sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-[#409eff]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#409eff]" />
          ) : (
             <ArrowUpDown className="w-3.5 h-3.5" />
          )}
        </span>
      </div>
    );
  };
  
  const currentDraftTables = draftTables.filter(t => 
    categoryTypesMap[activeCategory].includes(t.productType as ProductType)
  );

  // Helper for merging production types
  const isSameProductionTypeForMerge = (t1: string | undefined, t2: string | undefined) => {
    if (t1 === t2) return true;
    const mergedTypes = ['配方生产（成品）', '配方生产（自制半成品）'];
    if (t1 && t2 && mergedTypes.includes(t1) && mergedTypes.includes(t2)) return true;
    return false;
  };

  // Helper to get details for a specific table row
  const getDetailsForTable = (table: MonthlyProductionPlanTable) => {
    return draftDetails.filter(d => 
      d.brandGrade === table.brandGrade && 
      d.productType === table.productType &&
      isSameProductionTypeForMerge(d.productionType, table.productionType)
    );
  };

  const toggleTableExpand = (id: string) => {
    const newExpanded = new Set(expandedTableIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTableIds(newExpanded);
  };

  const handleSelectPoolItem = (id: string) => {
    const newKeys = new Set(selectedPoolIds);
    if (newKeys.has(id)) {
      newKeys.delete(id);
    } else {
      newKeys.add(id);
    }
    setSelectedPoolIds(newKeys);
  };

  // ----- Drag and Drop Handlers -----

  const handleDragStart = (e: React.DragEvent, item: ProductionPlanPool) => {
    let itemsToDrag = [item];
    if (selectedPoolIds.has(item.id)) {
      itemsToDrag = pendingPool.filter(p => selectedPoolIds.has(p.id));
    }
    e.dataTransfer.setData('application/json', JSON.stringify(itemsToDrag));
    e.dataTransfer.effectAllowed = 'copyMove';
    setTimeout(() => setIsDragging(true), 10);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsDragging(false);
    
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      
      const items = JSON.parse(dataStr) as ProductionPlanPool[];
      if (items && items.length > 0) {
        
        let newDetails: MonthlyProductionPlanDetail[] = [];
        let updatedPendingPool = [...pendingPool];
        
        const validItems = items.filter(i => categoryTypesMap[activeCategory].includes(i.productType as ProductType));
        if (validItems.length === 0) return;

        validItems.forEach(item => {
           // Calculate subBrandGrade logic: brand + incrementing number for each unique customer under that brand
           const brandDetails = [...draftDetails, ...newDetails].filter(d => 
             d.brandGrade === item.brandGrade && 
             isSameProductionTypeForMerge(d.productionType, item.productionType)
           );
           const customerEntry = brandDetails.find(d => d.customerName === item.customerName);
           
           let subSuffix = '01';
           if (customerEntry) {
             subSuffix = customerEntry.subBrandGrade.split('-').pop() || '01';
           } else {
             // Find max suffix for this brand and increment
             const suffixes = brandDetails.map(d => parseInt(d.subBrandGrade.split('-').pop() || '0'));
             const maxSuffix = suffixes.length > 0 ? Math.max(...suffixes) : 0;
             subSuffix = (maxSuffix + 1).toString().padStart(2, '0');
           }

           newDetails.push({
              id: `detail-${Date.now()}-${item.id}`,
              productType: item.productType,
              productionType: item.productionType as string,
              productName: item.productName,
              productCode: item.productCode,
              customerName: item.customerName,
              brandGrade: item.brandGrade,
              specification: item.specification,
              requirementAmount: item.totalRequirementAmount,
              unit: item.unit,
              unitPriceExclTax: 0,
              unitPriceInclTax: 0,
              amountExclTax: 0,
              expectedCompletionDate: item.expectedCompletionDate,
              deliveryDate: item.deliveryDate,
              deliveryLocation: item.deliveryLocation,
              applicantName: item.applicantName?.toString() || '系统分配',
              applicantDepartment: item.applicantDepartment?.toString() || '生产部',
              subBrandGrade: `${item.brandGrade}-${subSuffix}`,
              applicationLedgerId: item.id
           });

           updatedPendingPool = updatedPendingPool.filter(p => p.id !== item.id);
        });

        // Update Draft Tables (Aggregation)
        let updatedDraftTables = [...draftTables];
        newDetails.forEach(detail => {
           const existingTable = updatedDraftTables.find(t => 
             t.productType === detail.productType && 
             t.brandGrade === detail.brandGrade &&
             isSameProductionTypeForMerge(t.productionType, detail.productionType)
           );
           if (existingTable) {
             existingTable.productionVolume += detail.requirementAmount;
           } else {
             updatedDraftTables.push({
               id: `table-${Date.now()}-${updatedDraftTables.length}`,
               sequenceNumber: updatedDraftTables.length + 1,
               productType: detail.productType,
               productionType: detail.productionType,
               brandGrade: detail.brandGrade,
               productionVolume: detail.requirementAmount,
               remarks: ''
             });
           }
        });

        setDraftDetails([...draftDetails, ...newDetails]);
        setDraftTables(updatedDraftTables);
        setPendingPool(updatedPendingPool);
        setSelectedPoolIds(new Set());
      }
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  const handleRemoveTable = (tableId: string) => {
    const tableToRemove = draftTables.find(t => t.id === tableId);
    if (!tableToRemove) return;
    
    // Return items to pool
    const detailsToReturn = getDetailsForTable(tableToRemove);
    const poolItemsToReturn = detailsToReturn.map(d => ({
       id: d.applicationLedgerId || d.id,
       sequenceNumber: pendingPool.length + 1,
       documentNo: `DD20260501${Math.floor(Math.random()*1000)}`,
       status: '待计划',
       applicationType: '普通',
       productType: d.productType,
       productionType: d.productionType,
       productName: d.productName,
       productCode: d.productCode,
       customerName: d.customerName,
       brandGrade: d.brandGrade,
       specification: d.specification,
       unit: d.unit,
       requirements: [],
       totalRequirementAmount: d.requirementAmount,
       initialRequirementAmount: d.requirementAmount,
       expectedCompletionDate: d.expectedCompletionDate,
       deliveryDate: d.deliveryDate,
       deliveryLocation: d.deliveryLocation,
       purchaseOrder: '',
       applicantName: d.applicantName || '',
       applicantDepartment: d.applicantDepartment || '',
    } as ProductionPlanPool));

    setPendingPool([...pendingPool, ...poolItemsToReturn]);
    setDraftDetails(draftDetails.filter(d => !(d.brandGrade === tableToRemove.brandGrade && d.productType === tableToRemove.productType)));
    setDraftTables(draftTables.filter(t => t.id !== tableId).map((t, idx) => ({ ...t, sequenceNumber: idx + 1 })));
  };

  const handleRemoveDetail = (detailId: string) => {
    const detailToRemove = draftDetails.find(d => d.id === detailId);
    if (!detailToRemove) return;

    // Return item to pool
    const poolItemToReturn = {
       id: detailToRemove.applicationLedgerId || detailToRemove.id,
       sequenceNumber: pendingPool.length + 1,
       documentNo: `DD20260501${Math.floor(Math.random()*1000)}`,
       status: '待计划',
       applicationType: '普通',
       productType: detailToRemove.productType,
       productionType: detailToRemove.productionType,
       productName: detailToRemove.productName,
       productCode: detailToRemove.productCode,
       customerName: detailToRemove.customerName,
       brandGrade: detailToRemove.brandGrade,
       specification: detailToRemove.specification,
       unit: detailToRemove.unit,
       requirements: [],
       totalRequirementAmount: detailToRemove.requirementAmount,
       initialRequirementAmount: detailToRemove.requirementAmount,
       expectedCompletionDate: detailToRemove.expectedCompletionDate,
       deliveryDate: detailToRemove.deliveryDate,
       deliveryLocation: detailToRemove.deliveryLocation,
       purchaseOrder: '',
       applicantName: detailToRemove.applicantName || '',
       applicantDepartment: detailToRemove.applicantDepartment || '',
    } as ProductionPlanPool;

    setPendingPool([...pendingPool, poolItemToReturn]);
    
    // Adjust draft details
    setDraftDetails(draftDetails.filter(d => d.id !== detailId));
    
    // Adjust draft tables (aggregate)
    setDraftTables(prev => {
      let updatedTables = prev.map(t => {
        if (t.brandGrade === detailToRemove.brandGrade && t.productType === detailToRemove.productType) {
          return { ...t, productionVolume: t.productionVolume - detailToRemove.requirementAmount };
        }
        return t;
      }).filter(t => t.productionVolume > 0);
      return updatedTables.map((t, idx) => ({ ...t, sequenceNumber: idx + 1 }));
    });
  };

  const updateTableRemark = (tableId: string, remarks: string) => {
    setDraftTables(draftTables.map(t => t.id === tableId ? { ...t, remarks } : t));
  };

  const handleSubmit = () => {
    if (!planName) {
      alert('请填写计划名称');
      return;
    }
    if (draftDetails.length === 0) {
      alert('计划明细不能为空');
      return;
    }
    alert('提交成功！模拟流转至审核流程...');
    navigate('/plan/monthly');
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden" onDragEnd={() => setIsDragging(false)}>
      {/* Header Info Area */}
      <div className="bg-white px-2 py-4 flex flex-col border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-800">月度产销计划编制</h2>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff]"
              onClick={() => setIsInventoryDialogOpen(true)}
            >
              原料库存对比
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/plan/monthly')}>取消</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>保存草稿</Button>
            <Button size="sm" className="bg-[#67c23a] text-white hover:bg-[#85ce61] font-medium" onClick={handleSubmit}>提交计划审核</Button>
          </div>
        </div>
        
        <div className="flex items-center px-2">
          <label className="text-sm font-bold text-gray-700 mr-4">
            <span className="text-red-500 mr-1">*</span>计划名称
          </label>
          <Input 
            className="w-96 h-9 border-gray-300 focus:border-[#1890ff]" 
            placeholder="例如：2026年5月份产销计划" 
            value={planName}
            onChange={e => setPlanName(e.target.value)}
          />
        </div>
      </div>
      
      {overLimitWarning && (
        <div className="bg-red-50 text-red-600 px-6 py-2 text-sm flex items-center shrink-0 border-b border-red-100">
           <AlertTriangle className="w-4 h-4 mr-3" />
           <span className="font-semibold">{overLimitWarning}</span>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Category Tabs Header */}
        <div className="border-b border-gray-100 shrink-0 px-2 mt-2">
          <Tabs value={activeCategory} onValueChange={(v: any) => setActiveCategory(v)} variant="card">
            <TabsList>
              <TabsTrigger value="raw_material">再造原料生产计划</TabsTrigger>
              <TabsTrigger value="flavor">香精香料生产计划</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area - No extra outer border, no redundant background color */}
        <div className="flex-1 flex overflow-hidden gap-4 p-4">
          {/* Left pane: Available Pool */}
          <div className="w-[38%] bg-white flex flex-col border border-gray-200 rounded-sm overflow-hidden">
            <div className="px-4 py-2 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center shrink-0">
              <span className="font-bold text-[13px] text-gray-700">可排计划 ({activeCategory === 'raw_material' ? '再造原料' : '香精香料'})</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-500">归类</span>
                  <div className="w-32">
                    <Select 
                      options={[
                        { label: '按【客户名称】归类', value: 'customerName' },
                        { label: '按【牌号】归类', value: 'brandGrade' },
                      ]}
                      value={groupByFilter}
                      onChange={(e) => setGroupByFilter(e.target.value)}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400">待办: {currentPendingPool.length}</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-1">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 isolate">
                  <TableRow className="border-none shadow-none hover:bg-transparent">
                    <TableHead className="w-10 px-2 flex justify-center">
                      <input 
                        type="checkbox"
                        className="rounded"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPoolIds(new Set(currentPendingPool.map(p => p.id)));
                          } else {
                            setSelectedPoolIds(new Set());
                          }
                        }}
                        checked={currentPendingPool.length > 0 && selectedPoolIds.size === currentPendingPool.length}
                      />
                    </TableHead>
                    <TableHead className="w-8 px-0"></TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">序号</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">单据编号</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">牌号</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">状态</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">申请类型</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">产品类型</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">生产类型</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">产品名称</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">产品编号</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">客户名称</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">规格</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">单位</TableHead>
                    <TableHead className="text-[12px] text-right whitespace-nowrap">需求量</TableHead>
                    <TableHead className="text-[12px] text-right whitespace-nowrap">初始需求量</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">{renderSortHeader('期望完成时间', 'expectedCompletionDate')}</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">{renderSortHeader('到货时间', 'deliveryDate')}</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">到货地点</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">采购订单</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">申请人</TableHead>
                    <TableHead className="text-[12px] whitespace-nowrap">申请人部门</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupByFilter ? (
                    // 归类展示模式
                    (() => {
                      const map = new Map<string, typeof currentPendingPool>();
                      currentPendingPool.forEach(item => {
                        const key = (item as any)[groupByFilter] || '暂无数据';
                        if (!map.has(key)) map.set(key, []);
                        map.get(key)!.push(item);
                      });
                      return Array.from(map.entries()).map(([groupName, items]) => (
                        <React.Fragment key={groupName}>
                          {/* 分组表头行 */}
                          <TableRow className="bg-[#f0f2f5] hover:bg-[#f0f2f5]">
                            <TableCell colSpan={22} className="py-2.5 text-[12px] font-semibold text-[#303133] border-t border-[#ebeef5]">
                              <span className="text-[#409eff] mr-2">◗</span>
                              {groupName} 
                              <span className="ml-2 text-[10px] font-normal text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                                {items.length} 个计划
                              </span>
                            </TableCell>
                          </TableRow>
                          {/* 分组内数据行 */}
                          {items.map((row) => {
                            const isSelected = selectedPoolIds.has(row.id);
                            return (
                              <TableRow 
                                key={row.id} 
                                className={cn(
                                  "cursor-grab active:cursor-grabbing hover:bg-blue-50/30 transition-colors border-b-gray-50",
                                  isSelected ? "bg-blue-50/50" : ""
                                )}
                                draggable
                                onDragStart={(e) => handleDragStart(e, row)}
                                onClick={() => handleSelectPoolItem(row.id)}
                              >
                                <TableCell className="w-10 px-2 !py-2 flex justify-center mt-0.5">
                                  <input 
                                    type="checkbox"
                                    className="rounded text-blue-500 focus:ring-blue-500"
                                    checked={isSelected}
                                    onChange={() => {}} 
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </TableCell>
                                <TableCell className="w-8 px-0 !py-2">
                                  <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                                </TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.sequenceNumber}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.documentNo}</TableCell>
                                <TableCell className="font-medium text-gray-700 text-[12px] px-2 !py-2 whitespace-nowrap">{row.brandGrade}</TableCell>
                                <TableCell className="px-2 !py-2 whitespace-nowrap text-[12px] text-[#409eff]">{row.status}</TableCell>
                                <TableCell className="px-2 !py-2 whitespace-nowrap">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-medium border",
                                    row.applicationType === '紧急' ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                                  )}>
                                    {row.applicationType || '普通'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productType}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap" title={row.productionType}>{row.productionType}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productName}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productCode}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap" title={row.customerName}>{row.customerName}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.specification}</TableCell>
                                <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap">{row.unit}</TableCell>
                                <TableCell className="font-bold text-gray-600 text-right text-[12px] px-2 !py-2 whitespace-nowrap">{row.totalRequirementAmount}</TableCell>
                                <TableCell className="text-gray-600 text-right text-[12px] px-2 !py-2 whitespace-nowrap">{row.initialRequirementAmount?.toFixed(2)}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.expectedCompletionDate || '--'}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.deliveryDate || '--'}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.deliveryLocation || '--'}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.purchaseOrder || '--'}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.applicantName || '--'}</TableCell>
                                <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.applicantDepartment || '--'}</TableCell>
                              </TableRow>
                            );
                          })}
                        </React.Fragment>
                      ));
                    })()
                  ) : (
                    currentPendingPool.map(row => {
                      const isSelected = selectedPoolIds.has(row.id);
                      return (
                        <TableRow 
                          key={row.id} 
                          className={cn(
                            "cursor-grab active:cursor-grabbing hover:bg-blue-50/30 transition-colors border-b-gray-50",
                            isSelected ? "bg-blue-50/50" : ""
                          )}
                          draggable
                          onDragStart={(e) => handleDragStart(e, row)}
                          onClick={() => handleSelectPoolItem(row.id)}
                        >
                          <TableCell className="w-10 px-2 !py-2 flex justify-center mt-0.5">
                            <input 
                              type="checkbox"
                              className="rounded text-blue-500 focus:ring-blue-500"
                              checked={isSelected}
                              onChange={() => {}} 
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell className="w-8 px-0 !py-2">
                            <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                          </TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.sequenceNumber}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.documentNo}</TableCell>
                          <TableCell className="font-medium text-gray-700 text-[12px] px-2 !py-2 whitespace-nowrap">{row.brandGrade}</TableCell>
                          <TableCell className="px-2 !py-2 whitespace-nowrap text-[12px] text-[#409eff]">{row.status}</TableCell>
                          <TableCell className="px-2 !py-2 whitespace-nowrap">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-medium border",
                              row.applicationType === '紧急' ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                            )}>
                              {row.applicationType || '普通'}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productType}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap" title={row.productionType}>{row.productionType}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productName}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productCode}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap" title={row.customerName}>{row.customerName}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.specification}</TableCell>
                          <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap">{row.unit}</TableCell>
                          <TableCell className="font-bold text-gray-600 text-right text-[12px] px-2 !py-2 whitespace-nowrap">
                            {row.totalRequirementAmount}
                          </TableCell>
                          <TableCell className="text-gray-600 text-right text-[12px] px-2 !py-2 whitespace-nowrap">{row.initialRequirementAmount?.toFixed(2)}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.expectedCompletionDate || '--'}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.deliveryDate || '--'}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.deliveryLocation || '--'}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.purchaseOrder || '--'}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.applicantName || '--'}</TableCell>
                          <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.applicantDepartment || '--'}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                  {currentPendingPool.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={22} className="text-center py-16 text-gray-400 border-none">暂无对应类型的待处理需求</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right pane: Selected for Plan */}
          <div className="flex-1 bg-white flex flex-col border border-gray-200 rounded-sm overflow-hidden">
             <div className="px-4 py-2.5 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center shrink-0">
              <span className="font-bold text-[13px] text-gray-700">已排计划 ({activeCategory === 'raw_material' ? '再造原料' : '香精香料'})</span>
              <span className="text-xs font-bold text-[#409eff] bg-[#ecf5ff] px-3 py-0.5 rounded-full border border-[#d9ecff]">已排: {currentDraftTables.length}</span>
            </div>
            
            <div 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave} 
              onDrop={handleDrop} 
              className={cn(
                "flex-1 overflow-auto transition-all duration-200 relative p-1",
                isDragOver ? "bg-blue-50/50 outline-2 outline-dashed outline-[#1890ff] outline-offset-[-4px]" : "bg-white"
              )}
            >
              {isDragging && currentDraftTables.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50 backdrop-blur-[1px] border-2 border-dashed border-blue-400 z-20 m-2 rounded pointer-events-none">
                   <div className="text-center">
                      <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-blue-600">释放至此处以排产</span>
                   </div>
                 </div>
              )}

              <Table>
                <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-10 isolate">
                  <TableRow className="border-none shadow-none hover:bg-transparent">
                    <TableHead className="w-8"></TableHead>
                    <TableHead className="w-10 text-center text-[12px]">序号</TableHead>
                    <TableHead className="text-[12px]">再造类型</TableHead>
                    <TableHead className="text-[12px]">生产类型</TableHead>
                    <TableHead className="text-[12px]">牌号</TableHead>
                    <TableHead className="text-right text-[12px]">总产量/吨</TableHead>
                    <TableHead className="text-[12px]">备注</TableHead>
                    <TableHead className="w-16 text-center text-[12px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {currentDraftTables.map((row, idx) => {
                     const isExpanded = expandedTableIds.has(row.id);
                     const details = getDetailsForTable(row);
                     
                     return (
                       <React.Fragment key={row.id}>
                        <TableRow className="hover:bg-gray-50 border-b-gray-50 group cursor-pointer" onClick={() => toggleTableExpand(row.id)}>
                          <TableCell className="w-8 p-0 text-center">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-500 m-auto" /> : <ChevronRight className="w-4 h-4 text-gray-400 m-auto" />}
                          </TableCell>
                          <TableCell className="text-center font-medium text-gray-400 text-[12px]">{idx + 1}</TableCell>
                          <TableCell className="text-gray-700 text-[12px]">{row.productType}</TableCell>
                          <TableCell className="text-gray-700 text-[12px]">{row.productionType}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[12px] text-gray-800">{row.brandGrade}</span>
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap", 
                                details.length > 1 ? "bg-orange-50 text-orange-600 border-orange-200 font-medium" : "bg-gray-50 text-gray-500 border-gray-200"
                              )}>
                                {details.length > 1 ? `合并 ${details.length} 项需求` : `单项需求`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-blue-600 text-right text-[12px]">
                            {row.productionVolume.toFixed(2)}
                          </TableCell>
                          <TableCell className="p-1" onClick={e => e.stopPropagation()}>
                            <Input
                              value={row.remarks || ''}
                              onChange={(e) => updateTableRemark(row.id, e.target.value)}
                              className="h-7 text-xs border-transparent hover:border-gray-200 focus:bg-white"
                              placeholder="备注..."
                            />
                          </TableCell>
                          <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-6 w-full" onClick={() => handleRemoveTable(row.id)}>
                              移除
                            </Button>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-[#fcfdfe] hover:bg-[#fcfdfe] border-b-0 shadow-inner">
                            <TableCell colSpan={8} className="p-0">
                              <div className="w-0 min-w-full">
                                <div className="px-6 py-3 border-l-2 border-blue-400 ml-4 mb-2">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-[11px] font-bold text-gray-500 flex items-center">
                                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                                      编制明细构成 ({details.length} 项记录)
                                    </p>
                                  </div>
                                  <div>
                                    <Table className="border border-gray-100 rounded-sm w-full bg-white relative">
                                      <TableHeader className="bg-gray-50/50">
                                        <TableRow className="h-7 hover:bg-transparent">
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">产品类型</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">生产类型</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">产品名称</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">产品编号</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">客户名称</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">牌号</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">规格</TableHead>
                                        <TableHead className="text-right text-[10px] h-7 whitespace-nowrap">需求量</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">单位</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">期望完成时间</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">到货时间</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">到货地点</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">申请人</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">申请人部门</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">分牌号</TableHead>
                                        <TableHead className="text-center text-[10px] h-7 w-12 whitespace-nowrap sticky right-0 bg-[#f8f9fa] shadow-[-1px_0_0_#ebeef5] z-10">操作</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {details.map(d => (
                                        <TableRow key={d.id} className="h-7 border-b-gray-50 bg-white">
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.productType || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.productionType || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.productName || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.productCode || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.customerName || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.brandGrade || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.specification || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-right font-medium whitespace-nowrap">{d.requirementAmount?.toFixed(2) || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.unit || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-400 whitespace-nowrap">{d.expectedCompletionDate || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-400 whitespace-nowrap">{d.deliveryDate || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-400 truncate max-w-[150px] whitespace-nowrap">{d.deliveryLocation || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.applicantName || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.applicantDepartment || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-blue-600 font-mono whitespace-nowrap">{d.subBrandGrade || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-center whitespace-nowrap sticky right-0 bg-[#fff] shadow-[-1px_0_0_#ebeef5] z-10 group-hover:bg-[#f5f7fa]">
                                            <button 
                                              className="text-red-500 hover:text-red-700 cursor-pointer text-[11px]"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveDetail(d.id);
                                              }}
                                            >
                                              移除
                                            </button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                        )}
                       </React.Fragment>
                     );
                   })}
                   {!isDragging && currentDraftTables.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={8} className="text-center py-20 border-none">
                          <div className="flex flex-col items-center justify-center text-gray-300">
                            <GripVertical className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-[13px]">将左侧需求项拖拽至此处排产</p>
                          </div>
                       </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <RawMaterialInventoryDialog 
        isOpen={isInventoryDialogOpen}
        onClose={() => setIsInventoryDialogOpen(false)}
      />
    </div>
  );
}
