import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { GripVertical, ArrowRight, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { MonthlyAgingPlanItem } from '../../../../../types/monthly-plan';
import { getPoolPage } from '../../../../../data/plan/productionPoolData';
import { mockMonthlyAgingPlanItems } from '../../../../../data/plan/monthlyAgingPlanData';
import { mockMonthlyAgingPlans } from '../../../../../data/plan/agingPlanData';
import { ProductionPlanPool } from '../../../../../types/production-pool';
import { cn } from '../../../../../lib/utils';

export default function AgeingPlanCreate() {
  const navigate = useNavigate();

  const [planName, setPlanName] = useState('');
  
  // Left side: Pending Pool
  const [pendingPool, setPendingPool] = useState<ProductionPlanPool[]>([]);
  const [selectedPoolIds, setSelectedPoolIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  // Right side: Scheduled Aging Plan Items
  const [items, setItems] = useState<(MonthlyAgingPlanItem & { poolItem: ProductionPlanPool })[]>([]);

  // Grouped items for rendering with rowSpan
  const groupData = useMemo(() => {
    const result: (MonthlyAgingPlanItem & { poolItem: ProductionPlanPool; brandSpan?: number; brandHasError?: boolean; brandTotalBoxCount?: number })[] = [];
    let currentBrand = '';
    let brandStartIndex = -1;

    // Calculate sums first
    const brandSums: Record<string, number> = {};
    const brandInventories: Record<string, number> = {};
    items.forEach(item => {
      brandSums[item.brandName] = (brandSums[item.brandName] || 0) + (Number(item.boxCount) || 0);
      if (item.availableInventory !== undefined) {
         brandInventories[item.brandName] = item.availableInventory;
      }
    });

    items.forEach((item, index) => {
      const hasError = brandInventories[item.brandName] !== undefined && brandSums[item.brandName] > brandInventories[item.brandName];
      if (item.brandName !== currentBrand) {
        if (brandStartIndex !== -1) {
          result[brandStartIndex].brandSpan = result.length - brandStartIndex;
        }
        currentBrand = item.brandName;
        brandStartIndex = result.length;
        result.push({ ...item, brandSpan: 1, brandHasError: hasError, brandTotalBoxCount: brandSums[item.brandName] });
      } else {
        result.push({ ...item, brandSpan: 0, brandHasError: hasError, brandTotalBoxCount: brandSums[item.brandName] });
      }
    });

    if (brandStartIndex !== -1) {
      result[brandStartIndex].brandSpan = result.length - brandStartIndex;
    }

    return result;
  }, [items]);

  // Drag and Drop States
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Load pending plans for Aging (productionType includes '醇化')
    getPoolPage({ status: '待计划', pageNum: 1, pageSize: 100 }).then(res => {
      // Filter for aging only as requested
      const agingPool = res.list.filter(p => p.productionType?.includes('醇化'));
      setPendingPool(agingPool);
    });
  }, []);

  const handleSelectPoolItem = (id: string) => {
    const newKeys = new Set(selectedPoolIds);
    if (newKeys.has(id)) {
      newKeys.delete(id);
    } else {
      newKeys.add(id);
    }
    setSelectedPoolIds(newKeys);
  };

  const handleRemoveItem = (seq: number) => {
    const itemToRemove = items.find(item => item.sequenceNumber === seq);
    if (!itemToRemove) return;

    // Return to pool
    setPendingPool(prev => [...prev, itemToRemove.poolItem]);

    // Update items and re-sequence
    const updated = items.filter(item => item.sequenceNumber !== seq)
      .map((item, index) => ({
        ...item,
        sequenceNumber: index + 1
      }));
    setItems(updated);
  };

  const updateItem = (seq: number, field: keyof MonthlyAgingPlanItem, value: any) => {
    setItems(items.map(item => {
      if (item.sequenceNumber === seq) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'boxCount') {
           updatedItem.appliedCompletionAmount = value;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // ----- Sorting logic for Left Pool -----
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedPendingPool = useMemo(() => {
    if (!sortField || !sortOrder) return pendingPool;
    
    return [...pendingPool].sort((a, b) => {
      const aVal = (a as any)[sortField] || '';
      const bVal = (b as any)[sortField] || '';
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [pendingPool, sortField, sortOrder]);

  const renderSortHeader = (label: string, field: string) => (
    <div className="flex items-center gap-1 cursor-pointer select-none group" onClick={() => handleSort(field)}>
      <span>{label}</span>
      <div className="flex flex-col">
        <ArrowUp className={cn("w-2 h-2", sortField === field && sortOrder === 'asc' ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400")} />
        <ArrowDown className={cn("w-2 h-2", sortField === field && sortOrder === 'desc' ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400")} />
      </div>
    </div>
  );

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
      
      const droppedItems = JSON.parse(dataStr) as ProductionPlanPool[];
      if (droppedItems && droppedItems.length > 0) {
        
        let newPlanItems: (MonthlyAgingPlanItem & { poolItem: ProductionPlanPool })[] = [];
        let updatedPendingPool = [...pendingPool];
        
        droppedItems.forEach(item => {
           const boxAmount = Math.ceil(item.totalRequirementAmount / 0.05);
           const mockInventory = item.brandGrade === 'GS01' ? 15000 : 20000;
           newPlanItems.push({
              id: item.id || Date.now().toString(),
              sequenceNumber: items.length + newPlanItems.length + 1,
              brandName: item.brandGrade || '', // 总牌号 GS60
              month: `${new Date().getMonth() + 1}月`, // 自动获取当月
              subBrandGrade: item.productName || '', // 分牌号 GS6001
              boxCount: boxAmount,
              appliedCompletionAmount: boxAmount,
              availableInventory: mockInventory,
              date: '',
              sectionPlanNumber: '',
              remarks: '',
              poolItem: item
           });

           updatedPendingPool = updatedPendingPool.filter(p => p.id !== item.id);
        });

        // Merge and Sort by brandName to maintain grouping structure
        const combined = [...items, ...newPlanItems].sort((a, b) => a.brandName.localeCompare(b.brandName));
        
        // Re-sequence after sort
        const reSequenced = combined.map((item, idx) => ({
          ...item,
          sequenceNumber: idx + 1
        }));

        setItems(reSequenced);
        setPendingPool(updatedPendingPool);
        setSelectedPoolIds(new Set());
      }
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  const handleSubmit = () => {
    if (!planName) {
      alert('请填写计划名称');
      return;
    }

    const brandSums: Record<string, number> = {};
    const brandInventories: Record<string, number> = {};
    
    for (const item of items) {
       brandSums[item.brandName] = (brandSums[item.brandName] || 0) + (Number(item.boxCount) || 0);
       if (item.availableInventory !== undefined) {
          brandInventories[item.brandName] = item.availableInventory;
       }
    }
    
    for (const brand in brandSums) {
       if (brandInventories[brand] !== undefined && brandSums[brand] > brandInventories[brand]) {
          alert(`牌号 ${brand} 的总箱数 (${brandSums[brand]}) 不能超过目前可用库存量 (${brandInventories[brand]})`);
          return;
       }
    }

    alert('提交成功！');
    navigate('/plan/monthly');
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden" onDragEnd={() => setIsDragging(false)}>
      {/* Header Info Area */}
      <div className="bg-white px-2 py-4 flex flex-col border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-800">月度醇化计划编制</h2>
          <div className="flex gap-3">
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
            className="w-96 h-9 border-gray-300 focus:border-[#1890ff] font-sans text-sm" 
            placeholder="请输入计划名称" 
            value={planName}
            onChange={e => setPlanName(e.target.value)}
          />
        </div>
      </div>
      
      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden gap-4 p-4 mt-2">
        {/* Left pane: Available Pool (Matching 17-column style of Production Plan) */}
        <div className="w-[45%] bg-white flex flex-col border border-gray-200 rounded-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[13px] text-gray-700">可排计划</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-medium">待编: {pendingPool.length}</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 isolate border-b border-gray-100">
                <TableRow className="border-none shadow-none hover:bg-transparent">
                  <TableHead className="w-10 px-2 flex justify-center">
                    <input 
                      type="checkbox"
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPoolIds(new Set(pendingPool.map(p => p.id)));
                        } else {
                          setSelectedPoolIds(new Set());
                        }
                      }}
                      checked={pendingPool.length > 0 && selectedPoolIds.size === pendingPool.length}
                    />
                  </TableHead>
                  <TableHead className="w-8 px-0"></TableHead>
                  <TableHead className="text-[12px] whitespace-nowrap">序号</TableHead>
                  <TableHead className="text-[12px] whitespace-nowrap">单据编号</TableHead>
                  <TableHead className="text-[12px] whitespace-nowrap">{renderSortHeader('牌号', 'brandGrade')}</TableHead>
                  <TableHead className="text-[12px] whitespace-nowrap">{renderSortHeader('状态', 'status')}</TableHead>
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
                  <TableHead className="text-[12px] whitespace-nowrap pr-4">申请人部门</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPendingPool.map((row) => {
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
                        <GripVertical className="w-3.5 h-3.5 text-gray-300 m-auto" />
                      </TableCell>
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap font-mono">{row.sequenceNumber}</TableCell>
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.documentNo}</TableCell>
                      <TableCell className="font-bold text-gray-700 text-[12px] px-2 !py-2 whitespace-nowrap">{row.brandGrade}</TableCell>
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
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productionType}</TableCell>
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.productName}</TableCell>
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap font-mono text-[11px]">{row.productCode}</TableCell>
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap" title={row.customerName}>{row.customerName}</TableCell>
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.specification}</TableCell>
                      <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap">{row.unit}</TableCell>
                      <TableCell className="font-bold text-gray-600 text-right text-[12px] px-2 !py-2 whitespace-nowrap">{row.totalRequirementAmount}</TableCell>
                      <TableCell className="text-gray-600 text-right text-[12px] px-2 !py-2 whitespace-nowrap">{row.initialRequirementAmount?.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-500 text-[12px] px-2 !py-2 whitespace-nowrap">{row.expectedCompletionDate || '--'}</TableCell>
                      <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap">{row.deliveryDate || '--'}</TableCell>
                      <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap">{row.deliveryLocation || '--'}</TableCell>
                      <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap">{row.purchaseOrder || '--'}</TableCell>
                      <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap">{row.applicantName || '--'}</TableCell>
                      <TableCell className="text-gray-400 text-[11px] px-2 !py-2 whitespace-nowrap pr-4">{row.applicantDepartment || '--'}</TableCell>
                    </TableRow>
                  );
                })}
                {pendingPool.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={23} className="text-center py-20 text-gray-400 font-sans border-none">
                      暂无待排产的醇化计划需求
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right pane: Scheduled Aging Plan */}
        <div className="flex-1 bg-white flex flex-col border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[13px] text-gray-700">已排计划</span>
              <span className="text-xs font-bold text-[#409eff] bg-[#ecf5ff] px-3 py-0.5 rounded-full border border-[#d9ecff]">已排: {items.length}</span>
            </div>
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
            {isDragging && items.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50 backdrop-blur-[1px] border-2 border-dashed border-blue-400 z-20 m-2 rounded pointer-events-none">
                 <div className="text-center">
                    <div className="bg-blue-100 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-blue-600 font-sans">释放至此处开启排产</span>
                 </div>
               </div>
            )}

            <Table className="border-collapse min-w-[1100px]">
              <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-10 isolate border-b border-gray-100">
                <TableRow className="border-none shadow-none hover:bg-transparent">
                  <TableHead className="w-16 text-center text-gray-600 font-bold font-sans border-r border-gray-200">序号</TableHead>
                  <TableHead className="w-28 min-w-[110px] text-gray-600 font-bold font-sans border-r border-gray-200">牌号</TableHead>
                  <TableHead className="w-24 text-right text-gray-600 font-bold font-sans border-r border-gray-200">目前可用库存量</TableHead>
                  <TableHead className="w-20 text-gray-600 font-bold font-sans text-center border-r border-gray-200">年月份</TableHead>
                  <TableHead className="w-32 min-w-[130px] text-gray-600 font-bold font-sans border-r border-gray-200">分牌号和等级</TableHead>
                  <TableHead className="w-24 text-right text-gray-600 font-bold font-sans border-r border-gray-200">箱数</TableHead>
                  <TableHead className="w-32 min-w-[120px] text-gray-600 font-bold font-sans border-r border-gray-200">日期</TableHead>
                  <TableHead className="w-32 min-w-[120px] text-gray-600 font-bold font-sans border-r border-gray-200">码段计划号</TableHead>
                  <TableHead className="w-64 min-w-[240px] text-gray-600 font-bold font-sans border-r border-gray-200">备注</TableHead>
                  <TableHead className="w-16 text-center text-gray-600 font-bold font-sans">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupData.map((item, index) => (
                  <TableRow key={item.sequenceNumber} className="hover:bg-gray-50 border-b border-gray-100 group">
                    <TableCell className="text-center text-gray-400 font-mono text-[12px] border-r border-gray-100">{item.sequenceNumber}</TableCell>
                    
                    {/* 牌号 - RowSpan logic */}
                    {item.brandSpan !== undefined && item.brandSpan > 0 && (
                      <>
                        <TableCell 
                          rowSpan={item.brandSpan} 
                          className="text-center bg-white border-r border-gray-100 font-bold text-gray-700"
                        >
                          {item.brandName}
                        </TableCell>
                        <TableCell 
                          rowSpan={item.brandSpan} 
                          className="border-r border-gray-100 text-right bg-blue-50/20 align-top pt-3"
                        >
                          <span className={cn("font-bold text-[12px] font-mono", item.brandHasError ? "text-red-500" : "text-blue-600")}>{item.availableInventory || '0.00'}</span>
                        </TableCell>
                      </>
                    )}

                    <TableCell className="border-r border-gray-100 text-center text-gray-700 text-[12px]">
                      {item.month}
                    </TableCell>

                    <TableCell className="border-r border-gray-100 text-gray-700 text-[12px] font-mono">
                      {item.subBrandGrade}
                    </TableCell>

                    <TableCell className={cn("border-r border-gray-100 text-right text-[12px] font-bold font-mono", item.brandHasError ? "text-red-600 bg-red-50" : "text-blue-600")}>
                      {item.boxCount || 0}
                    </TableCell>

                    <TableCell className="border-r border-gray-100">
                      <Input 
                        type="text"
                        value={item.date} 
                        onChange={(e) => updateItem(item.sequenceNumber, 'date', e.target.value)} 
                        placeholder="实时生产日期"
                        className="h-7 text-[12px] font-sans border-transparent hover:border-gray-200 focus:bg-white"
                      />
                    </TableCell>

                    <TableCell className="border-r border-gray-100">
                      <Input 
                        value={item.sectionPlanNumber || ''} 
                        onChange={(e) => updateItem(item.sequenceNumber, 'sectionPlanNumber', e.target.value)} 
                        placeholder=""
                        className="h-7 text-[12px] font-mono border-transparent hover:border-gray-200 focus:bg-white"
                      />
                    </TableCell>

                    <TableCell className="border-r border-gray-100">
                      <Input 
                        value={item.remarks || ''} 
                        onChange={(e) => updateItem(item.sequenceNumber, 'remarks', e.target.value)} 
                        placeholder="备注"
                        className="h-7 text-[12px] font-sans border-transparent hover:border-gray-200 focus:bg-white"
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                        onClick={() => handleRemoveItem(item.sequenceNumber)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-20 border-none">
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
  );
}
