import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { MonthlyAgingPlanItem } from '../../../../../types/monthly-plan';
import { mockMonthlyAgingPlanItems } from '../../../../../data/plan/monthlyAgingPlanData';
import { mockMonthlyAgingPlans } from '../../../../../data/plan/agingPlanData';
import { NonPurchaseOrderApplicationModal } from '../../../pool/components/NonPurchaseOrderApplicationModal';
import { ProductionPoolSelectionModal } from './components/ProductionPoolSelectionModal';
import { ProductionPlanPool } from '../../../../../types/production-pool';
import { cn } from '../../../../../lib/utils';

export default function AgeingPlanAdjust() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [planName, setPlanName] = useState('');
  
  // Right side: Scheduled Aging Plan Items
  const [items, setItems] = useState<MonthlyAgingPlanItem[]>([]);
  const [isNonPOModalOpen, setIsNonPOModalOpen] = useState(false);
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; message: string; onConfirm: () => void; onCancel: () => void; }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showConfirm = (message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const [alertModal, setAlertModal] = useState<{isOpen: boolean, message: string, onClose?: () => void}>({isOpen: false, message: ''});
  const showAlert = (message: string, onClose?: () => void) => setAlertModal({isOpen: true, message, onClose});

  // Grouped items for rendering with rowSpan
  const groupData = useMemo(() => {
    const result: (MonthlyAgingPlanItem & { brandSpan?: number; brandHasError?: boolean; brandTotalBoxCount?: number })[] = [];
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

  useEffect(() => {
    if (id) {
      // 引用基础信息
      const sourcePlan = mockMonthlyAgingPlans.find(plan => plan.sequenceNumber === Number(id));
      if (sourcePlan) {
        setPlanName(sourcePlan.planName);
      }
      // 初始化数据为从详情拷贝的数据
      setItems(JSON.parse(JSON.stringify(mockMonthlyAgingPlanItems)));
    }
  }, [id]);

  const handleRemoveItem = (seq: number) => {
    showConfirm("移除后将无法再加入计划中，需要进行重新申请，确定要移除吗？", () => {
      // Update items and re-sequence
      const updated = items.filter(item => item.sequenceNumber !== seq)
        .map((item, index) => ({
          ...item,
          sequenceNumber: index + 1
        }));
      setItems(updated);
    });
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

  const handleSave = () => {
    if (!planName) {
      showAlert('请填写计划名称');
      return;
    }
    showAlert('计划调整保存成功！', () => navigate('/plan/monthly'));
  };

  const handleSubmit = () => {
    if (!planName) {
      showAlert('请填写计划名称');
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
          showAlert(`牌号 ${brand} 的总箱数 (${brandSums[brand]}) 不能超过目前可用库存量 (${brandInventories[brand]})`);
          return;
       }
    }

    showAlert('计划调整提交成功！', () => navigate('/plan/monthly'));
  };

  const handleNonPOApplicationSubmit = (formDatas: any[]) => {
    if (formDatas && formDatas.length > 0) {
      const newPlanItems: MonthlyAgingPlanItem[] = [];
      
      formDatas.forEach(item => {
         const boxAmount = Math.ceil((item.totalRequirementAmount || 0) / 0.05);
         newPlanItems.push({
            sequenceNumber: 0, // will be re-sequenced below
            brandName: item.brandGrade || '', 
            month: item.deliveryDate ? `${parseInt(item.deliveryDate.split('-')[1], 10)}月` : '/',
            subBrandGrade: item.productName || '',
            boxCount: boxAmount,
            appliedCompletionAmount: boxAmount,
            date: '实时生产日期',
            processPlanNumber: '',
            remarks: '由非采购订单新增'
         });
      });

      const combined = [...items, ...newPlanItems].sort((a, b) => a.brandName.localeCompare(b.brandName));
      
      const reSequenced = combined.map((item, idx) => ({
        ...item,
        sequenceNumber: idx + 1
      }));

      setItems(reSequenced);
    }
    setIsNonPOModalOpen(false);
  };

  const handlePoolSelectionSubmit = (selectedPoolItems: ProductionPlanPool[]) => {
    if (selectedPoolItems && selectedPoolItems.length > 0) {
      const newPlanItems: MonthlyAgingPlanItem[] = [];
      
      selectedPoolItems.forEach(item => {
         const boxAmount = Math.ceil((item.totalRequirementAmount || 0) / 0.05);
         newPlanItems.push({
            sequenceNumber: 0,
            brandName: item.brandGrade || '', 
            month: item.deliveryDate ? `${parseInt(item.deliveryDate.split('-')[1], 10)}月` : '/',
            subBrandGrade: item.productName || '',
            boxCount: boxAmount,
            appliedCompletionAmount: boxAmount,
            date: '实时生产日期',
            processPlanNumber: '',
            remarks: '由计划池导入'
         });
      });

      const combined = [...items, ...newPlanItems].sort((a, b) => a.brandName.localeCompare(b.brandName));
      
      const reSequenced = combined.map((item, idx) => ({
        ...item,
        sequenceNumber: idx + 1
      }));

      setItems(reSequenced);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Header Info Area */}
      <div className="bg-white px-2 py-4 flex flex-col border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-800">月度醇化计划调整</h2>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/plan/monthly')}>取消</Button>
            <Button variant="outline" size="sm" onClick={handleSave}>保存</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>提交</Button>
          </div>
        </div>
        
        <div className="flex items-center px-2">
          <label className="text-sm font-bold text-gray-700 mr-4">
            <span className="text-red-500 mr-1">*</span>计划名称
          </label>
          <Input 
            className="w-96 h-9 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed font-sans text-sm" 
            placeholder="请输入计划名称" 
            value={planName}
            readOnly
          />
        </div>
      </div>
      
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden gap-4 p-4 mt-2">
        <div className="flex-1 bg-white flex flex-col border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center shrink-0">
            <span className="font-bold text-[13px] text-gray-700 mt-1">已排计划</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#409eff] bg-[#ecf5ff] px-3 py-1 rounded-full border border-[#d9ecff]">已排: {items.length}</span>
              <Button variant="outline" size="sm" className="h-7 text-xs border-blue-400 text-blue-500 hover:bg-blue-50" onClick={() => setIsPoolModalOpen(true)}>
                <Plus className="w-3 h-3 mr-1" /> 从计划池中选择
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs border-amber-400 text-amber-500 hover:bg-amber-50" onClick={() => setIsNonPOModalOpen(true)}>
                <Plus className="w-3 h-3 mr-1" /> 新增需求(非订单)
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto transition-all duration-200 relative p-1 bg-white">
            <Table className="border-collapse min-w-[1100px]">
              <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-10 isolate border-b border-gray-100">
                <TableRow className="border-none shadow-none hover:bg-transparent">
                  <TableHead className="w-16 text-center text-gray-600 font-bold font-sans border-r border-gray-200">序号</TableHead>
                  <TableHead className="w-28 min-w-[110px] text-gray-600 font-bold font-sans border-r border-gray-200">牌号</TableHead>
                  <TableHead className="w-24 text-right text-gray-600 font-bold font-sans border-r border-gray-200">目前可用库存量</TableHead>
                  <TableHead className="w-20 text-gray-600 font-bold font-sans text-center border-r border-gray-200">年月份</TableHead>
                  <TableHead className="w-32 min-w-[130px] text-gray-600 font-bold font-sans border-r border-gray-200">分牌号和等级</TableHead>
                  <TableHead className="w-24 text-right text-gray-600 font-bold font-sans border-r border-gray-200">箱数</TableHead>
                  <TableHead className="w-24 text-right text-gray-600 font-bold font-sans border-r border-gray-200">申请完工量</TableHead>
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
                          className="border-r border-gray-100 text-right bg-white align-top pt-3"
                        >
                          <span className="font-bold text-gray-700 text-[12px] font-mono px-2">{item.availableInventory || '0.00'}</span>
                        </TableCell>
                      </>
                    )}

                    <TableCell className="border-r border-gray-100">
                      <Input 
                        value={item.month} 
                        onChange={(e) => updateItem(item.sequenceNumber, 'month', e.target.value)} 
                        placeholder="/"
                        className="h-7 text-[12px] font-sans text-center border-transparent hover:border-gray-200 focus:bg-white"
                      />
                    </TableCell>

                    <TableCell className="border-r border-gray-100">
                      <span className="text-[12px] font-sans px-2 flex items-center h-7">{item.subBrandGrade}</span>
                    </TableCell>

                    <TableCell className="border-r border-gray-100">
                      <Input 
                        type="number"
                        value={item.boxCount || ''} 
                        onChange={(e) => updateItem(item.sequenceNumber, 'boxCount', parseFloat(e.target.value) || 0)} 
                        placeholder="0"
                        className={cn("h-7 text-[12px] text-right font-bold font-mono border-transparent hover:border-gray-200 focus:bg-white", item.brandHasError ? "text-red-600 bg-red-50" : "text-gray-700")}
                      />
                    </TableCell>

                    <TableCell className="border-r border-gray-100 text-right bg-white">
                      <span className="font-bold text-gray-700 text-[12px] font-mono px-2 flex items-center justify-end h-7">{item.appliedCompletionAmount || '0.00'}</span>
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
                        value={item.processPlanNumber || ''} 
                        onChange={(e) => updateItem(item.sequenceNumber, 'processPlanNumber', e.target.value)} 
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
                      <span 
                        className="text-red-500 hover:text-red-600 text-[12px] cursor-pointer"
                        onClick={() => handleRemoveItem(item.sequenceNumber)}
                      >
                        移除
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-20 text-gray-500 text-sm">
                      暂无排产记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <NonPurchaseOrderApplicationModal 
        isOpen={isNonPOModalOpen} 
        onClose={() => setIsNonPOModalOpen(false)} 
        onSubmit={handleNonPOApplicationSubmit}
        allowedProductionTypes={['醇化']}
      />

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-[15px]">系统提示</h3>
            </div>
            <div className="p-5 text-gray-600 text-sm">
              {confirmModal.message}
            </div>
            <div className="px-5 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={confirmModal.onCancel}>
                取消
              </Button>
              <Button variant="primary" size="sm" onClick={confirmModal.onConfirm}>
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-[15px]">系统提示</h3>
            </div>
            <div className="p-5 text-gray-600 text-sm">
              {alertModal.message}
            </div>
            <div className="px-5 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
              <Button variant="primary" size="sm" onClick={() => {
                if (alertModal.onClose) alertModal.onClose();
                setAlertModal({isOpen: false, message: ''});
              }}>
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      <ProductionPoolSelectionModal
        isOpen={isPoolModalOpen}
        onClose={() => setIsPoolModalOpen(false)}
        onSubmit={handlePoolSelectionSubmit}
      />
    </div>
  );
}

