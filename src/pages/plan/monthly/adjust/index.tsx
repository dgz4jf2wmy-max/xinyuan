import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { MonthlyProductionPlanTable, MonthlyProductionPlanDetail } from '../../../../types/monthly-plan';
import { ProductType } from '../../../../types/plan';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { mockMonthlyProductionPlans } from '../../../../data/plan/monthlyPlanData';
import { mockMonthlyProductionPlanDetail } from '../../../../data/plan/monthlyPlanDetailData';
import { PurchaseOrderApplicationModal } from '../../pool/components/PurchaseOrderApplicationModal';
import { NonPurchaseOrderApplicationModal } from '../../pool/components/NonPurchaseOrderApplicationModal';
import { PoolApplicationStatus } from '../../../../types/production-pool';
import { cn } from '../../../../lib/utils';
import { RawMaterialInventoryDialog } from '../components/raw-material-inventory-dialog';

export default function MonthlyProductionPlanAdjust() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [planName, setPlanName] = useState('');
  const [activeCategory, setActiveCategory] = useState<'raw_material' | 'flavor'>('raw_material');
  
  const [draftTables, setDraftTables] = useState<MonthlyProductionPlanTable[]>([]);
  const [draftDetails, setDraftDetails] = useState<MonthlyProductionPlanDetail[]>([]);
  const [expandedTableIds, setExpandedTableIds] = useState<Set<string>>(new Set());
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);

  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isNonPOModalOpen, setIsNonPOModalOpen] = useState(false);

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

  // Computed: Category mapping
  const categoryTypesMap = {
    raw_material: [ProductType.ReconstitutedTobacco, ProductType.ReconstitutedStem],
    flavor: [ProductType.FlavorAndFragrance]
  };

  useEffect(() => {
    // 引用月度产销计划详情页的数据，以确保有真实对应的计划数据展示
    const plan = mockMonthlyProductionPlanDetail;
    setPlanName(plan.planName);
    
    // 杜撰报工产量相关数据 (仅在调整页面展示有数据的报工产量和申请完工量)
    const tablesWithMockReportedData = (plan.planList || []).map(t => {
      // 为了显得真实一点，报工产量我们杜撰为总需求量的 30% 到 80% 之间
      const mockReportedVolume = Number((t.productionVolume * (0.3 + 0.5 * Math.random())).toFixed(2));
      return {
        ...t,
        reportedProductionVolume: mockReportedVolume
      };
    });
    setDraftTables(tablesWithMockReportedData);
    
    // Populate draft details with initial values if they don't exist
    const initialDetails = (plan.details || []).map(d => {
      // 杜撰此明细的申请完工量，这里我们杜撰为需求量的一部分
      const mockAppliedAmount = Number((d.requirementAmount * (0.3 + 0.5 * Math.random())).toFixed(2));
      
      return {
        ...d,
        initialRequirementAmount: d.initialRequirementAmount ?? d.requirementAmount,
        appliedCompletionAmount: d.appliedCompletionAmount ?? mockAppliedAmount,
      };
    });
    
    setDraftDetails(initialDetails);
  }, [id]);

  const currentDraftTables = draftTables.filter(t => {
    if (activeCategory === 'raw_material') {
      return t.productType.includes('再造') || t.productType.includes('多孔');
    } else {
      return t.productType.includes('料') || t.productType.includes('香');
    }
  });

  const getDetailsForTable = (table: MonthlyProductionPlanTable) => {
    return draftDetails.filter(d => d.brandGrade === table.brandGrade && d.productType === table.productType);
  };

  const toggleTableExpand = (tableId: string) => {
    const newExpanded = new Set(expandedTableIds);
    if (newExpanded.has(tableId)) {
      newExpanded.delete(tableId);
    } else {
      newExpanded.add(tableId);
    }
    setExpandedTableIds(newExpanded);
  };

  const handleRemoveTable = (tableId: string) => {
    showConfirm("移除后将无法再加入计划中，需要进行重新申请，确定要移除吗？", () => {
      const tableToRemove = draftTables.find(t => t.id === tableId);
      if (!tableToRemove) return;
      setDraftDetails(prev => prev.filter(d => !(d.brandGrade === tableToRemove.brandGrade && d.productType === tableToRemove.productType)));
      setDraftTables(prev => prev.filter(t => t.id !== tableId).map((t, idx) => ({ ...t, sequenceNumber: idx + 1 })));
    });
  };

  const handleRemoveDetail = (detailId: string) => {
    const detailToRemove = draftDetails.find(d => d.id === detailId);
    if (!detailToRemove) return;

    const relatedTable = draftTables.find(t => t.brandGrade === detailToRemove.brandGrade && t.productType === detailToRemove.productType);
    if (relatedTable) {
      const reportedVol = relatedTable.reportedProductionVolume || 0;
      const otherDetailsSum = draftDetails
        .filter(d => d.brandGrade === relatedTable.brandGrade && d.productType === relatedTable.productType && d.id !== detailId)
        .reduce((sum, obj) => sum + obj.requirementAmount, 0);
        
      if (otherDetailsSum < reportedVol) {
        showAlert("无法移除该需求记录：移除后总产量将低于报工产量");
        return;
      }
    }

    showConfirm("移除后将无法再加入计划中，需要进行重新申请，确定要移除吗？", () => {
      setDraftDetails(prev => prev.filter(d => d.id !== detailId));
      
      setDraftTables(prev => {
        let updatedTables = prev.map(t => {
          if (t.brandGrade === detailToRemove.brandGrade && t.productType === detailToRemove.productType) {
            return { ...t, productionVolume: t.productionVolume - detailToRemove.requirementAmount };
          }
          return t;
        }).filter(t => t.productionVolume > 0);
        return updatedTables.map((t, idx) => ({ ...t, sequenceNumber: idx + 1 }));
      });
    });
  };

  const updateTableRemark = (tableId: string, remarks: string) => {
    setDraftTables(draftTables.map(t => t.id === tableId ? { ...t, remarks } : t));
  };

  // Modify production volume or requirement amount
  const updateDetailRequirementAmount = (detailId: string, newAmount: string | number) => {
    let valStr = String(newAmount);
    let val = valStr === '' ? 0 : Number(newAmount);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    
    const detailToUpdate = draftDetails.find(d => d.id === detailId);
    if (!detailToUpdate) return;
    
    // 约束：需求不可以>初始需求量；
    const initialReq = detailToUpdate.initialRequirementAmount ?? detailToUpdate.requirementAmount;
    if (val > initialReq) {
      val = initialReq;
    }
    
    // 约束：产量不可以<报工产量
    const relatedTable = draftTables.find(t => t.brandGrade === detailToUpdate.brandGrade && t.productType === detailToUpdate.productType);
    if (relatedTable) {
      const reportedVol = relatedTable.reportedProductionVolume || 0;
      const otherDetailsSum = draftDetails
        .filter(d => d.brandGrade === relatedTable.brandGrade && d.productType === relatedTable.productType && d.id !== detailId)
        .reduce((sum, obj) => sum + obj.requirementAmount, 0);
        
      if (Number((otherDetailsSum + val).toFixed(5)) < reportedVol) {
        val = reportedVol - otherDetailsSum;
      }
    }

    // 处理浮点数精度问题：限制最多保留2位小数 (数字(.00)属性)
    val = Number(val.toFixed(2));

    const newDetails = draftDetails.map(d => d.id === detailId ? { ...d, requirementAmount: val } : d);
    setDraftDetails(newDetails);
    
    // 规则：对月度产销计划编制明细下牌号与月度产销计划表牌号一致的进行求和需求量求和
    setDraftTables(prev => {
      return prev.map(t => {
        if (t.brandGrade === detailToUpdate.brandGrade && t.productType === detailToUpdate.productType) {
          const detailsForTable = newDetails.filter(d => d.brandGrade === t.brandGrade && d.productType === t.productType);
          const newVol = detailsForTable.reduce((sum, item) => sum + item.requirementAmount, 0);
          return { ...t, productionVolume: Number(newVol.toFixed(2)) };
        }
        return t;
      });
    });
  };

  const handleApplicationSubmit = (formData: any) => {
    
    // 分牌号自动生成规则
    const bg = formData.brandGrade || 'Unknown';
    const cn = formData.customerName || '-';
    
    const brandGradeFilter = draftDetails.filter(d => d.brandGrade === bg);
    const existingForCustomer = brandGradeFilter.find(d => d.customerName === cn);
    
    let calculatedSubBrandGrade = '';
    if (existingForCustomer && existingForCustomer.subBrandGrade) {
      calculatedSubBrandGrade = existingForCustomer.subBrandGrade;
    } else {
      let maxSuffix = 0;
      brandGradeFilter.forEach(d => {
        if (d.subBrandGrade && d.subBrandGrade.includes('-')) {
          const suffixStr = d.subBrandGrade.split('-').pop() || '0';
          const suffix = parseInt(suffixStr, 10);
          if (!isNaN(suffix) && suffix > maxSuffix) {
            maxSuffix = suffix;
          }
        }
      });
      const nextSuffix = (maxSuffix + 1).toString().padStart(2, '0');
      calculatedSubBrandGrade = `${bg}-${nextSuffix}`;
    }

    const newDetail: MonthlyProductionPlanDetail = {
      ...formData,
      id: `detail-new-${Date.now()}`,
      brandGrade: bg,
      productType: formData.productType || '-',
      productionType: formData.productionType || '-',
      productName: formData.productName || '-',
      productCode: formData.productCode || '-',
      customerName: cn,
      specification: formData.specification || '-',
      unit: formData.unit || '-',
      requirementAmount: formData.totalRequirementAmount || 0,
      initialRequirementAmount: formData.totalRequirementAmount || 0,
      appliedCompletionAmount: 0,
      applicantName: formData.applicantName || '当前用户',
      applicantDepartment: formData.applicantDepartment || '生产部',
      subBrandGrade: calculatedSubBrandGrade,
    };

    let updatedDraftTables = [...draftTables];
    const existingTable = updatedDraftTables.find(t => t.productType === newDetail.productType && t.brandGrade === newDetail.brandGrade);
    
    if (existingTable) {
      existingTable.productionVolume += newDetail.requirementAmount;
    } else {
      updatedDraftTables.push({
        id: `table-new-${Date.now()}`,
        sequenceNumber: updatedDraftTables.length + 1,
        productType: newDetail.productType,
        brandGrade: newDetail.brandGrade,
        productionVolume: newDetail.requirementAmount,
        reportedProductionVolume: 0,
        remarks: ''
      });
    }

    setDraftDetails([...draftDetails, newDetail]);
    setDraftTables(updatedDraftTables);
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
    showAlert('计划调整提交成功！', () => navigate('/plan/monthly'));
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Header Info Area */}
      <div className="bg-white px-2 py-4 flex flex-col border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-800">月度产销计划调整</h2>
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
            <Button variant="outline" size="sm" onClick={handleSave}>保存</Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>提交</Button>
          </div>
        </div>
        
        <div className="flex items-center px-2">
          <label className="text-sm font-bold text-gray-700 mr-4">
            <span className="text-red-500 mr-1">*</span>计划名称
          </label>
          <Input 
            className="w-96 h-9 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed" 
            placeholder="例如：2026年5月份产销计划(调整一)" 
            value={planName}
            readOnly
          />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="border-b border-gray-100 shrink-0 px-2 mt-2 flex justify-between items-end">
          <Tabs value={activeCategory} onValueChange={(v: any) => setActiveCategory(v)} variant="card">
            <TabsList>
              <TabsTrigger value="raw_material">再造原料生产计划</TabsTrigger>
              <TabsTrigger value="flavor">香精香料生产计划</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area - Single wide pane */}
        <div className="flex-1 flex overflow-hidden gap-4 p-4">
          <div className="flex-1 bg-white flex flex-col border border-gray-200 rounded-sm overflow-hidden">
             <div className="px-4 py-2.5 bg-[#f8f9fb] border-b border-gray-200 flex justify-between items-center shrink-0">
               <span className="font-bold text-[13px] text-gray-700 mt-1">已排计划 ({activeCategory === 'raw_material' ? '再造原料' : '香精香料'})</span>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-[#409eff] bg-[#ecf5ff] px-3 py-1 rounded-full border border-[#d9ecff]">已排: {currentDraftTables.length}</span>
                 <Button variant="outline" size="sm" className="h-7 text-xs border-blue-400 text-blue-500 hover:bg-blue-50" onClick={() => setIsPOModalOpen(true)}>
                   <Plus className="w-3 h-3 mr-1" /> 新增需求(销售订单)
                 </Button>
                 <Button variant="outline" size="sm" className="h-7 text-xs border-amber-400 text-amber-500 hover:bg-amber-50" onClick={() => setIsNonPOModalOpen(true)}>
                   <Plus className="w-3 h-3 mr-1" /> 新增需求(非销售订单)
                 </Button>
               </div>
            </div>
            
            <div className="flex-1 overflow-auto p-1 bg-white relative">
              <Table>
                <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-10 isolate">
                  <TableRow className="border-none shadow-none hover:bg-transparent">
                    <TableHead className="w-8"></TableHead>
                    <TableHead className="w-10 text-center text-[12px]">序号</TableHead>
                    <TableHead className="text-[12px]">再造类型</TableHead>
                    <TableHead className="text-[12px]">牌号</TableHead>
                    <TableHead className="text-right text-[12px]">总产量/吨</TableHead>
                    <TableHead className="text-right text-[12px]">报工产量/吨</TableHead>
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
                          <TableCell className="font-bold text-teal-600 text-right text-[12px]">
                            {row.reportedProductionVolume?.toFixed(2) || '0.00'}
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
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">客户名称</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">分牌号</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">规格</TableHead>
                                        <TableHead className="text-right text-[10px] h-7 whitespace-nowrap border-l border-gray-200">需求量(调整后)</TableHead>
                                        <TableHead className="text-right text-[10px] h-7 whitespace-nowrap">初始需求量</TableHead>
                                        <TableHead className="text-right text-[10px] h-7 whitespace-nowrap border-r border-gray-200">申请完工量</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">单位</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">期望完成时间</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">到货时间</TableHead>
                                        <TableHead className="text-[10px] h-7 whitespace-nowrap">到货地点</TableHead>
                                        <TableHead className="text-center text-[10px] h-7 w-12 whitespace-nowrap sticky right-0 bg-[#f8f9fa] shadow-[-1px_0_0_#ebeef5] z-10">操作</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {details.map(d => (
                                        <TableRow key={d.id} className="h-7 border-b-gray-50 bg-white">
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.productType || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.productionType || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.productName || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.customerName || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-blue-600 font-mono whitespace-nowrap">{d.subBrandGrade || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.specification || '-'}</TableCell>
                                          
                                          <TableCell className="text-[11px] py-0.5 text-right font-medium whitespace-nowrap border-l border-gray-100 bg-blue-50/30">
                                            <Input
                                              type="number"
                                              value={d.requirementAmount}
                                              onChange={(e) => updateDetailRequirementAmount(d.id, e.target.value)}
                                              className="h-6 w-20 text-right text-[11px] p-1 font-bold text-blue-600 border-gray-200"
                                            />
                                          </TableCell>
                                          <TableCell className="text-[11px] py-1 text-right text-gray-500 whitespace-nowrap bg-gray-50/50">
                                            {d.initialRequirementAmount?.toFixed(2) || '-'}
                                          </TableCell>
                                          <TableCell className="text-[11px] py-1 text-right text-teal-600 whitespace-nowrap border-r border-gray-100 bg-teal-50/30">
                                            {d.appliedCompletionAmount?.toFixed(2) || '0.00'}
                                          </TableCell>

                                          <TableCell className="text-[11px] py-1 text-gray-600 whitespace-nowrap">{d.unit || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-400 whitespace-nowrap">{d.expectedCompletionDate || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-400 whitespace-nowrap">{d.deliveryDate || '-'}</TableCell>
                                          <TableCell className="text-[11px] py-1 text-gray-400 truncate max-w-[150px] whitespace-nowrap" title={d.deliveryLocation}>{d.deliveryLocation || '-'}</TableCell>
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
                   {currentDraftTables.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={8} className="text-center py-20 border-none">
                          <div className="flex flex-col items-center justify-center text-gray-300">
                            <p className="text-[13px]">暂无已排计划数据，请点击上方按钮新增需求</p>
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

      <PurchaseOrderApplicationModal 
        isOpen={isPOModalOpen} 
        onClose={() => setIsPOModalOpen(false)} 
        onSubmit={handleApplicationSubmit}
      />
      <NonPurchaseOrderApplicationModal 
        isOpen={isNonPOModalOpen} 
        onClose={() => setIsNonPOModalOpen(false)} 
        onSubmit={handleApplicationSubmit}
        allowedProductionTypes={['成品', '自制半成品']}
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
    </div>
  );
}

