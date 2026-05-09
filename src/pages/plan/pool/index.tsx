import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Search, Plus, RotateCcw, ArrowUpDown, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react';
import { mockProductionPoolData } from '../../../data/plan/productionPoolData';
import { PoolApplicationStatus } from '../../../types/production-pool';
import { PurchaseOrderApplicationModal } from './components/PurchaseOrderApplicationModal';
import { NonPurchaseOrderApplicationModal } from './components/NonPurchaseOrderApplicationModal';
import clsx from 'clsx';

export default function ProductionPoolList() {
  const navigate = useNavigate();
  const [data, setData] = useState(mockProductionPoolData);
  const [frozenIds, setFrozenIds] = useState<Set<string>>(new Set());

  const handleToggleFreeze = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(frozenIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setFrozenIds(newSet);
  };

  const [searchKey, setSearchKey] = useState('');
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [customerFilter, setCustomerFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [expectedDateFilter, setExpectedDateFilter] = useState('');
  const [deliveryDateFilter, setDeliveryDateFilter] = useState('');

  // Sorting & Grouping
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [groupByFilter, setGroupByFilter] = useState('');

  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isNonPOModalOpen, setIsNonPOModalOpen] = useState(false);
  const [isApplicationDropdownOpen, setIsApplicationDropdownOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Apply filters and sorting
  const getProcessedData = () => {
    let result = [...data];

    // Global Search
    if (searchKey) {
      result = result.filter(item => 
        item.productName.includes(searchKey) || 
        item.specification.includes(searchKey)
      );
    }

    // Advanced Filters
    if (customerFilter) {
      result = result.filter(item => item.customerName.includes(customerFilter));
    }
    if (brandFilter) {
      result = result.filter(item => item.brandGrade.includes(brandFilter));
    }
    if (productTypeFilter) {
      result = result.filter(item => item.productType === productTypeFilter);
    }
    if (expectedDateFilter) {
      result = result.filter(item => item.expectedCompletionDate === expectedDateFilter);
    }
    if (deliveryDateFilter) {
      result = result.filter(item => item.deliveryDate === deliveryDateFilter);
    }

    // Sorting
    result.sort((a: any, b: any) => {
      if (sortConfig) {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  };

  const processedData = getProcessedData();

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      // Third click removes sorting
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

  const handleReset = () => {
    setSearchKey('');
    setCustomerFilter('');
    setBrandFilter('');
    setProductTypeFilter('');
    setExpectedDateFilter('');
    setDeliveryDateFilter('');
    setSortConfig(null);
    setGroupByFilter('');
    setData(mockProductionPoolData);
  };

  const handleApplicationSubmit = (formData: any) => {
    // Inject mock sequence number & ID
    const newRecord = {
      ...formData,
      id: `pool-new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: PoolApplicationStatus.PendingPlan,
    };
    setData(prev => [{ ...newRecord, sequenceNumber: prev.length + 1 }, ...prev]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* 公共搜索栏样式 */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="w-48">
          <Input 
            placeholder="客户名称 (来源)" 
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="牌号" 
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="辅助检索(名称/规格)" 
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select 
            options={[
              { label: '再造烟叶', value: '再造烟叶' },
              { label: '再造梗丝', value: '再造梗丝' },
              { label: '香精香料', value: '香精香料' },
            ]}
            value={productTypeFilter}
            onChange={(e) => setProductTypeFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <span className="text-[13px] text-[#606266] shrink-0">展示归类</span>
          <div className="w-48">
            <Select 
              options={[
                { label: '按【客户/来源】归类', value: 'customerName' },
                { label: '按【产品大类】归类', value: 'productType' },
                { label: '按【生产类型】归类', value: 'productionType' },
                { label: '按【产品牌号】归类', value: 'brandGrade' },
              ]}
              value={groupByFilter}
              onChange={(e) => setGroupByFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <Button variant="primary" onClick={() => {}}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      {/* 顶部操作按钮区 */}
      <div className="flex justify-end gap-2 mb-4 shrink-0">
        <div 
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <Button variant="primary" className="pr-2 cursor-default">
            <Plus className="w-3.5 h-3.5 mr-1" /> 新增月度产销计划 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full pt-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="bg-white border border-[#ebeef5] rounded shadow-lg py-1 w-40 flex flex-col items-stretch">
                <div 
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700 font-medium border-l-[3px] border-transparent hover:blue-500 transition-colors"
                  onClick={() => navigate('/plan/monthly/create')}
                >
                  月度产销计划
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700 font-medium border-l-[3px] border-transparent hover:blue-500 transition-colors"
                  onClick={() => navigate('/plan/monthly/aging/create')}
                >
                  月度醇化计划
                </div>
              </div>
            </div>
          )}
        </div>
        <div 
          className="relative"
          onMouseEnter={() => setIsApplicationDropdownOpen(true)}
          onMouseLeave={() => setIsApplicationDropdownOpen(false)}
        >
          <Button variant="primary" className="pr-2 cursor-default">
            <Plus className="w-3.5 h-3.5 mr-1" /> 发起申请 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          
          {isApplicationDropdownOpen && (
            <div className="absolute right-0 top-full pt-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="bg-white border border-[#ebeef5] rounded shadow-lg py-1 w-48 flex flex-col items-stretch">
                <div 
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700 font-medium border-l-[3px] border-transparent hover:border-blue-500 transition-colors"
                  onClick={() => { setIsPOModalOpen(true); setIsApplicationDropdownOpen(false); }}
                >
                  采购订单类申请
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700 font-medium border-l-[3px] border-transparent hover:border-blue-500 transition-colors"
                  onClick={() => { setIsNonPOModalOpen(true); setIsApplicationDropdownOpen(false); }}
                >
                  非采购订单类申请
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 视图内容区 */}
      <div className="flex-1 overflow-auto flex flex-col">
        <Table className="relative w-full">
          <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa] whitespace-nowrap">
            <TableRow>
              <TableHead className="w-[60px] text-center">序号</TableHead>
              <TableHead>单据编号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>申请类型</TableHead>
              <TableHead>{renderSortHeader('产品类型', 'productType')}</TableHead>
              <TableHead>生产类型</TableHead>
              <TableHead>产品名称</TableHead>
              <TableHead>产品编号</TableHead>
              <TableHead>{renderSortHeader('客户名称', 'customerName')}</TableHead>
              <TableHead>{renderSortHeader('牌号', 'brandGrade')}</TableHead>
              <TableHead>规格</TableHead>
              <TableHead>单位</TableHead>
              <TableHead className="text-right">需求量</TableHead>
              <TableHead className="text-right">初始需求量</TableHead>
              <TableHead>{renderSortHeader('期望完成时间', 'expectedCompletionDate')}</TableHead>
              <TableHead>{renderSortHeader('到货时间', 'deliveryDate')}</TableHead>
              <TableHead>到货地点</TableHead>
              <TableHead>采购订单</TableHead>
              <TableHead>申请人</TableHead>
              <TableHead>申请人部门</TableHead>
              <TableHead className="text-center w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupByFilter ? (
              // 归类展示模式
              (() => {
                const map = new Map<string, typeof processedData>();
                processedData.forEach(item => {
                  const key = (item as any)[groupByFilter] || '暂无数据';
                  if (!map.has(key)) map.set(key, []);
                  map.get(key)!.push(item);
                });
                return Array.from(map.entries()).map(([groupName, items]) => (
                  <React.Fragment key={groupName}>
                    {/* 分组表头行 */}
                    <TableRow className="bg-[#f0f2f5] hover:bg-[#f0f2f5]">
                      <TableCell colSpan={25} className="py-2.5 text-sm font-semibold text-[#303133] border-t border-[#ebeef5]">
                        <span className="text-[#409eff] mr-2">◗</span>
                        {groupName} 
                        <span className="ml-2 text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                          {items.length} 个计划
                        </span>
                      </TableCell>
                    </TableRow>
                    {/* 分组内数据行 */}
                    {items.map((row) => (
                      <TableRow key={row.id} className={clsx(frozenIds.has(row.id) && "opacity-50 grayscale bg-gray-50")}>
                        <TableCell className="text-center">{row.sequenceNumber}</TableCell>
                        <TableCell>{row.documentNo}</TableCell>
                        <TableCell>
                          <span className={clsx(
                            row.status === PoolApplicationStatus.PendingPlan ? "text-[#409eff]" : "text-[#909399]"
                          )}>
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={clsx(
                              "px-2 py-0.5 rounded text-xs font-medium border",
                              row.applicationType === '紧急' ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                            )}>
                              {row.applicationType || '普通'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{row.productType}</TableCell>
                        <TableCell>{row.productionType}</TableCell>
                        <TableCell>{row.productName}</TableCell>
                        <TableCell>{row.productCode}</TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell>{row.brandGrade}</TableCell>
                        <TableCell>{row.specification}</TableCell>
                        <TableCell>{row.unit}</TableCell>
                        <TableCell className="text-right">
                          <div className="group relative inline-block cursor-help border-b border-dashed border-gray-400">
                            {row.totalRequirementAmount?.toFixed(2)}
                            {row.requirements && row.requirements.length > 0 && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded shadow-lg z-50 p-2">
                                <div className="font-semibold mb-1 border-b border-gray-600 pb-1 text-center">明细</div>
                                <table className="w-full text-left">
                                  <thead>
                                    <tr className="text-gray-300">
                                      <th className="pr-4 pb-1 font-medium">序号</th>
                                      <th className="pr-4 pb-1 font-medium">版本号</th>
                                      <th className="pr-4 pb-1 font-medium text-right">需求量</th>
                                      <th className="pb-1 font-medium text-center">单位</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {row.requirements.map((req, i) => (
                                      <tr key={req.id}>
                                        <td className="pr-4 py-0.5">{req.sequenceNumber}</td>
                                        <td className="pr-4 py-0.5 text-[#409eff]">{req.versionNo}</td>
                                        <td className="pr-4 py-0.5 text-right font-mono">{req.requirementAmount}</td>
                                        <td className="py-0.5 text-center">{req.unit}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{row.initialRequirementAmount?.toFixed(2)}</TableCell>
                        <TableCell>{row.expectedCompletionDate || '--'}</TableCell>
                        <TableCell>{row.deliveryDate || '--'}</TableCell>
                        <TableCell>{row.deliveryLocation || '--'}</TableCell>
                        <TableCell>{row.purchaseOrder || '--'}</TableCell>
                        <TableCell>{row.applicantName || '--'}</TableCell>
                        <TableCell>{row.applicantDepartment || '--'}</TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={clsx("px-2 py-1 h-auto text-xs font-normal", frozenIds.has(row.id) ? "text-[#f56c6c] hover:bg-red-50 hover:text-[#f56c6c]" : "text-[#409eff] hover:bg-blue-50")}
                            onClick={(e) => handleToggleFreeze(row.id, e)}
                          >
                            {frozenIds.has(row.id) ? <><Unlock className="w-3 h-3 mr-1" />解冻</> : <><Lock className="w-3 h-3 mr-1" />冻结</>}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ));
              })()
            ) : (
              // 扁平展示模式
              processedData.map((row, index) => (
                <TableRow key={row.id} className={clsx(frozenIds.has(row.id) && "opacity-50 grayscale bg-gray-50")}>
                  <TableCell className="text-center">{row.sequenceNumber}</TableCell>
                  <TableCell>{row.documentNo}</TableCell>
                  <TableCell>
                    <span className={clsx(
                      row.status === PoolApplicationStatus.PendingPlan ? "text-[#409eff]" : "text-[#909399]"
                    )}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={clsx(
                        "px-2 py-0.5 rounded text-xs font-medium border",
                        row.applicationType === '紧急' ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                      )}>
                        {row.applicationType || '普通'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{row.productType}</TableCell>
                  <TableCell>{row.productionType}</TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.productCode}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.brandGrade}</TableCell>
                  <TableCell>{row.specification}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell className="text-right">
                    <div className="group relative inline-block cursor-help border-b border-dashed border-gray-400">
                      {row.totalRequirementAmount?.toFixed(2)}
                      {row.requirements && row.requirements.length > 0 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded shadow-lg z-50 p-2">
                          <div className="font-semibold mb-1 border-b border-gray-600 pb-1 text-center">明细</div>
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-gray-300">
                                <th className="pr-4 pb-1 font-medium">序号</th>
                                <th className="pr-4 pb-1 font-medium">版本号</th>
                                <th className="pr-4 pb-1 font-medium text-right">需求量</th>
                                <th className="pb-1 font-medium text-center">单位</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.requirements.map((req, i) => (
                                <tr key={req.id}>
                                  <td className="pr-4 py-0.5">{req.sequenceNumber}</td>
                                  <td className="pr-4 py-0.5 text-[#409eff]">{req.versionNo}</td>
                                  <td className="pr-4 py-0.5 text-right font-mono">{req.requirementAmount}</td>
                                  <td className="py-0.5 text-center">{req.unit}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.initialRequirementAmount?.toFixed(2)}</TableCell>
                  <TableCell>{row.expectedCompletionDate || '--'}</TableCell>
                  <TableCell>{row.deliveryDate || '--'}</TableCell>
                  <TableCell>{row.deliveryLocation || '--'}</TableCell>
                  <TableCell>{row.purchaseOrder || '--'}</TableCell>
                  <TableCell>{row.applicantName || '--'}</TableCell>
                  <TableCell>{row.applicantDepartment || '--'}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={clsx("px-2 py-1 h-auto text-xs font-normal", frozenIds.has(row.id) ? "text-[#f56c6c] hover:bg-red-50 hover:text-[#f56c6c]" : "text-[#409eff] hover:bg-blue-50")}
                      onClick={(e) => handleToggleFreeze(row.id, e)}
                    >
                      {frozenIds.has(row.id) ? <><Unlock className="w-3 h-3 mr-1" />解冻</> : <><Lock className="w-3 h-3 mr-1" />冻结</>}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PurchaseOrderApplicationModal 
        isOpen={isPOModalOpen} 
        onClose={() => setIsPOModalOpen(false)} 
        onSubmit={handleApplicationSubmit}
      />
      <NonPurchaseOrderApplicationModal 
        isOpen={isNonPOModalOpen} 
        onClose={() => setIsNonPOModalOpen(false)} 
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
}
