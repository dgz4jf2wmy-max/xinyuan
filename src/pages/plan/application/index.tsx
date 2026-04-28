import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Search, Plus, Filter, RotateCcw } from 'lucide-react';
import { mockApplicationLedgerData } from '../../../data/plan/applicationData';
import { PoolApplicationStatus } from '../../../types/production-pool';
import { PurchaseOrderApplicationModal } from '../pool/components/PurchaseOrderApplicationModal';
import { NonPurchaseOrderApplicationModal } from '../pool/components/NonPurchaseOrderApplicationModal';
import clsx from 'clsx';

export default function PlanPoolApplicationList() {
  const [data, setData] = useState(mockApplicationLedgerData);
  const [searchKey, setSearchKey] = useState('');
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isNonPOModalOpen, setIsNonPOModalOpen] = useState(false);
  const [isApplicationDropdownOpen, setIsApplicationDropdownOpen] = useState(false);

  // Apply filters
  const getProcessedData = () => {
    let result = [...data];
    if (searchKey) {
      result = result.filter(item => 
        item.productName.includes(searchKey) || 
        item.specification.includes(searchKey)
      );
    }
    return result;
  };

  const processedData = getProcessedData();

  const handleReset = () => {
    setSearchKey('');
    setData(mockApplicationLedgerData);
  };

  const handleApplicationSubmit = (formData: any) => {
    // Inject mock sequence number & ID
    const newRecord = {
      ...formData,
      id: `app-new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: PoolApplicationStatus.PendingPlan,
    };
    setData(prev => [{ ...newRecord, sequenceNumber: prev.length + 1 }, ...prev]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* 组合检索区 */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="w-48">
            <div className="flex items-center border border-[#dcdfe6] rounded-sm bg-white px-3 py-1.5 focus-within:border-[#409eff] focus-within:outline-1 focus-within:outline-[#409eff]">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="产品名称/规格检索" 
                className="outline-none border-none text-sm w-full text-[#606266] placeholder:text-gray-400"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="primary" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
            </Button>
            <div 
              className="relative"
              onMouseEnter={() => setIsApplicationDropdownOpen(true)}
              onMouseLeave={() => setIsApplicationDropdownOpen(false)}
            >
              <Button variant="primary" className="pr-2 cursor-default">
                <Plus className="w-3.5 h-3.5 mr-1" /> 发起申请 <span className="transform rotate-0 ml-1">▼</span>
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
        </div>
      </div>

      {/* 视图内容区 */}
      <div className="flex-1 overflow-auto flex flex-col border border-[#ebeef5] rounded-sm">
        <Table className="relative w-full">
          <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa] whitespace-nowrap text-xs">
            <TableRow>
              <TableHead className="w-[60px] text-center">序号</TableHead>
              <TableHead>单据编号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>申请类型</TableHead>
              <TableHead>产品类型</TableHead>
              <TableHead>生产类型</TableHead>
              <TableHead>产品名称</TableHead>
              <TableHead>产品编号</TableHead>
              <TableHead>客户名称</TableHead>
              <TableHead>牌号</TableHead>
              <TableHead>规格</TableHead>
              <TableHead>单位</TableHead>
              <TableHead className="text-right">需求量</TableHead>
              <TableHead className="text-right">初始需求量</TableHead>
              <TableHead className="text-right">申请完工量</TableHead>
              <TableHead>期望完成时间</TableHead>
              <TableHead>到货时间</TableHead>
              <TableHead>到货地点</TableHead>
              <TableHead>采购订单</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {processedData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="text-center">{row.sequenceNumber}</TableCell>
                <TableCell>{row.documentNo}</TableCell>
                <TableCell>
                  <span className={clsx(
                    row.status === PoolApplicationStatus.PendingPlan && "text-[#409eff]",
                    row.status === PoolApplicationStatus.Cancelled && "text-[#909399]",
                    row.status === PoolApplicationStatus.Planned && "text-[#e6a23c]",
                    row.status === PoolApplicationStatus.Scheduled && "text-[#409eff]",
                    row.status === PoolApplicationStatus.Completed && "text-[#67c23a] font-semibold"
                  )}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={clsx(
                    "px-2 py-0.5 rounded text-xs font-medium border",
                    row.applicationType === '紧急' ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                  )}>
                    {row.applicationType || '普通'}
                  </span>
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
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-[10px] rounded shadow-lg z-50 p-2">
                        <div className="font-semibold mb-1 border-b border-gray-600 pb-1 text-center">明细</div>
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-gray-400">
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
                <TableCell className="text-right">{row.applyCompletionAmount?.toFixed(2) || '--'}</TableCell>
                <TableCell>{row.expectedCompletionDate || '--'}</TableCell>
                <TableCell>{row.deliveryDate || '--'}</TableCell>
                <TableCell>{row.deliveryLocation || '--'}</TableCell>
                <TableCell>{row.purchaseOrder || '--'}</TableCell>
              </TableRow>
            ))}
            {processedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={22} className="text-center py-8 text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
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
