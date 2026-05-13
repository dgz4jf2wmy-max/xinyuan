import React, { useEffect, useState } from 'react';
import { X, FileText, ClipboardList, PenTool, CheckCircle, Clock, Package } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../lib/utils';
import { mockMonthlyTaskDetail } from '../../../../data/production/execution/monthlyTaskDetailData';
import { mockTaskReportingData, ShiftLog } from '../../../../data/production/execution/taskReportingData';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../../components/ui/table';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: any | null;
}

export default function TaskDetailDrawer({ isOpen, onClose, task }: TaskDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'demand' | 'report'>('demand');
  const [demandDetails, setDemandDetails] = useState<any[]>([]);
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>([]);

  useEffect(() => {
    if (task) {
      const pName = task.brand;
      const matches = [];
      const unit = task.productionType?.includes('醇化') ? '箱' : '吨';
      
      if (pName === 'NC0220L05') {
        matches.push({ productionType: '受托加工', customerName: '徐州卷烟厂', brandGrade: pName + ' 常规', requirementAmount: 1.8, unit, deliveryLocation: '徐州', applicantDepartment: '调拨中心', applicantName: '李经理' });
        matches.push({ productionType: '集中调配', customerName: '延安卷烟厂', brandGrade: pName + ' 合作', requirementAmount: 3.1, unit, deliveryLocation: '延安', applicantDepartment: '销售二部', applicantName: '赵经理' });
        matches.push({ productionType: '集中调配', customerName: '柳州卷烟厂', brandGrade: pName + ' 合作', requirementAmount: 2.645, unit, deliveryLocation: '柳州', applicantDepartment: '销售二部', applicantName: '赵经理' });
        matches.push({ productionType: '受托加工', customerName: '徐州卷烟厂', brandGrade: pName + ' 补充', requirementAmount: 1.5, unit, deliveryLocation: '徐州', applicantDepartment: '调拨中心', applicantName: '李经理' });
      } else if (pName === 'SC0280L24') {
        matches.push({ productionType: '集中调配', customerName: '徐州卷烟厂', brandGrade: pName, requirementAmount: 0.3, unit, deliveryLocation: '徐州仓', applicantDepartment: '调拨中心', applicantName: '张工' });
        matches.push({ productionType: '省公司试验', customerName: '徐州卷烟厂', brandGrade: pName, requirementAmount: 1.7, unit, deliveryLocation: '徐州二仓', applicantDepartment: '调拨中心', applicantName: '张工' });
      } else if (pName === 'SC0220L25') {
        matches.push({ productionType: '集中调配', customerName: '徐州卷烟厂', brandGrade: pName, requirementAmount: 34.5, unit, deliveryLocation: '徐州总仓', applicantDepartment: '生产部', applicantName: '王五' });
        matches.push({ productionType: '受托加工', customerName: '延安卷烟厂', brandGrade: pName, requirementAmount: 7.15, unit, deliveryLocation: '延安库', applicantDepartment: '销售部', applicantName: '孙总' });
        matches.push({ productionType: '受托加工', customerName: '延安卷烟厂', brandGrade: pName, requirementAmount: 1.75, unit, deliveryLocation: '延安库', applicantDepartment: '销售部', applicantName: '孙总' });
        matches.push({ productionType: '省公司试验', customerName: '徐州卷烟厂', brandGrade: pName, requirementAmount: 39, unit, deliveryLocation: '徐州总仓', applicantDepartment: '生产部', applicantName: '王五' });
      } else if (pName === 'NX0160L20') {
        matches.push({ productionType: '受托加工', customerName: '赣州厂', brandGrade: pName, requirementAmount: 3.76, unit, deliveryLocation: '赣州', applicantDepartment: '调拨组', applicantName: '钱队' });
        matches.push({ productionType: '受托加工', customerName: '哈尔滨厂', brandGrade: pName, requirementAmount: 5.352, unit, deliveryLocation: '哈尔滨', applicantDepartment: '调拨组', applicantName: '吴队' });
        matches.push({ productionType: '集中调配', customerName: '柳州厂', brandGrade: pName, requirementAmount: 1.05, unit, deliveryLocation: '柳州', applicantDepartment: '调拨组', applicantName: '周队' });
        matches.push({ productionType: '集中调配', customerName: '延安厂', brandGrade: pName, requirementAmount: 1.95, unit, deliveryLocation: '延安', applicantDepartment: '调拨组', applicantName: '郑队' });
        matches.push({ productionType: '自主试验', customerName: '山西昆明', brandGrade: pName, requirementAmount: 0.9, unit, deliveryLocation: '山西', applicantDepartment: '调拨组', applicantName: '郑队' });
        matches.push({ productionType: '省公司试验', customerName: '淮阴厂', brandGrade: pName, requirementAmount: 11.2, unit, deliveryLocation: '淮阴', applicantDepartment: '销售一', applicantName: '陈总' });
      } else if (pName === 'HBZY-10') {
        matches.push({ productionType: '配方生产（成品）', customerName: '公司B', brandGrade: pName + ' 常规', requirementAmount: 100, unit, deliveryLocation: '二号库', applicantDepartment: '销售部', applicantName: '王经理' });
        matches.push({ productionType: '配方生产（成品）', customerName: '公司C', brandGrade: pName + ' 常规', requirementAmount: 100, unit, deliveryLocation: '二号库', applicantDepartment: '销售部', applicantName: '王经理' });
      } else if (pName === 'JSN08') {
        matches.push({ productionType: '配方生产（自制半成品）', customerName: '代理A', brandGrade: pName, requirementAmount: 120, unit, deliveryLocation: '三号库', applicantDepartment: '大客户部', applicantName: '刘总' });
        matches.push({ productionType: '配方生产（自制半成品）', customerName: '代理B', brandGrade: pName, requirementAmount: 80, unit, deliveryLocation: '三号库', applicantDepartment: '大客户部', applicantName: '刘总' });
        matches.push({ productionType: '自主试验', customerName: '广西基地', brandGrade: pName+'(试验)', requirementAmount: 2.5, unit, deliveryLocation: '实验仓', applicantDepartment: '研发中心', applicantName: '陈工' });
      } else if (pName === 'GS22') {
        matches.push({ productionType: '预混', customerName: '徐州卷烟厂', brandGrade: pName, requirementAmount: 35, unit, deliveryLocation: '一号库', applicantDepartment: '生产办', applicantName: '张主任' });
      } else if (pName === 'GS60') {
        matches.push({ productionType: '配方生产（成品）', customerName: '南京卷烟厂', brandGrade: pName, requirementAmount: 40, unit, deliveryLocation: '南京库', applicantDepartment: '生产办', applicantName: '张主任' });
        matches.push({ productionType: '配方生产（成品）', customerName: '淮阴卷烟厂', brandGrade: pName, requirementAmount: 50, unit, deliveryLocation: '淮阴库', applicantDepartment: '生产办', applicantName: '张主任' });
      } else {
        const amount = Number(task.productionVolume) || 10;
        matches.push({
           productionType: task.productionType || '计划安排',
           customerName: '公司B',
           brandGrade: pName + ' 常规',
           requirementAmount: Number((amount * 0.6).toFixed(2)),
           unit,
           deliveryLocation: '二号库',
           applicantDepartment: '销售部',
           applicantName: '王经理'
        });
        matches.push({
           productionType: task.productionType || '计划安排',
           customerName: '公司C',
           brandGrade: pName + ' 常规',
           requirementAmount: Number((amount * 0.4).toFixed(2)),
           unit,
           deliveryLocation: '二号库',
           applicantDepartment: '销售部',
           applicantName: '王经理'
        });
      }
      setDemandDetails(matches);

      // Load shift logs if any
      const logs = mockTaskReportingData[task.taskNo]?.shiftLogs || [];
      setShiftLogs(logs);
      setActiveTab('demand');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#e4e7ed] bg-[#f8f9fb] shrink-0">
          <div>
            <h3 className="text-base font-bold text-[#303133]">{task.brand} 任务明细</h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="text-[#909399] font-mono">任务编号: {task.taskNo}</span>
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px]",
                task.status === '在执行' ? 'bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8]' :
                task.status === '已暂停' ? 'bg-[#fdf6ec] text-[#e6a23c] border border-[#f5dab1]' :
                task.status === '待执行' ? 'bg-white text-[#c0c4cc] border border-[#e4e7ed]' :
                'bg-[#fafafa] text-[#909399] border border-[#e4e7ed]'
              )}>{task.status || '未启动'}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#e4e7ed] rounded-full text-[#606266] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs and Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          {task.productionType === '醇化' ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f5f7fa]">
              {/* Aging Task Details Card */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-[#e4e7ed]">
                <div className="flex items-center text-lg font-bold text-[#303133] mb-4">
                  <div className="w-8 h-8 rounded-md bg-[#ecf5ff] text-[#409eff] flex items-center justify-center mr-3">
                    <Package className="w-4 h-4" />
                  </div>
                  {task.brand || 'JSN08'}
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <div className="text-[#909399] mb-1">任务编号</div>
                    <div className="font-mono text-[#303133]">CHRW-202605-001</div>
                  </div>
                  <div>
                    {/* Placeholder to balance grid if needed, or leave empty if design changes */}
                  </div>
                  <div>
                    <div className="text-[#909399] mb-1">牌号</div>
                    <div className="font-medium text-[#303133]">{task.brand || 'JSN08'}</div>
                  </div>
                  <div>
                    <div className="text-[#909399] mb-1">月份</div>
                    <div className="text-[#303133]">2026-05</div>
                  </div>
                  <div>
                    <div className="text-[#909399] mb-1">码段计划号</div>
                    <div className="font-mono text-[#303133]">MD-202605-001</div>
                  </div>
                  <div>
                    <div className="text-[#909399] mb-1">日期</div>
                    <div className="text-[#303133]">1月实时生产日期</div>
                  </div>
                  <div className="col-span-2 border-t border-dashed border-[#e4e7ed] pt-4">
                    <div className="text-[#909399] mb-1">备注</div>
                    <div className="text-[#303133]">加急批次</div>
                  </div>
                </div>
                <div className="mt-5 bg-[#fafafa] rounded-md p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-[#303133]">完成进度</span>
                    <span>
                      <span className="text-[#409eff] font-bold text-base">50.00</span>
                      <span className="text-[#909399]"> / {task.productionVolume || '150.00'} 箱</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#e4e7ed] rounded-full overflow-hidden">
                    <div className="h-full bg-[#409eff] rounded-full" style={{ width: `${(50 / (task.productionVolume || 150)) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Aging Report Records */}
              <div>
                <div className="flex items-center mb-3 px-1">
                  <div className="w-1 h-3.5 bg-[#409eff] rounded-sm mr-2"></div>
                  <h4 className="font-bold text-[#303133]">醇化报工记录</h4>
                  <span className="ml-2 bg-[#f4f4f5] text-[#909399] text-[11px] px-1.5 py-0.5 rounded-full">2</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-[#e4e7ed] relative">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm font-medium text-[#303133]">
                        <ClipboardList className="w-4 h-4 text-[#909399] mr-1.5" />
                        <span className="font-mono">CHBG-20260510-0001</span>
                      </div>
                      <div className="text-[#67c23a] font-bold text-base">+20.00<span className="text-xs ml-0.5 font-normal">箱</span></div>
                    </div>
                    <div className="bg-[#f8f9fb] rounded p-2.5 space-y-2 mb-3">
                      <div className="flex items-center text-xs">
                        <span className="text-[#909399] border border-[#e4e7ed] bg-white rounded px-1.5 py-0.5 mr-2">出库单</span>
                        <span className="font-mono text-[#606266]">CK-20260510-001</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="text-[#909399] border border-[#e4e7ed] bg-white rounded px-1.5 py-0.5 mr-2">入库单</span>
                        <span className="font-mono text-[#606266]">RK-20260510-001</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#909399] pt-1">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> 张三
                      </div>
                      <div>2026-05-10 14:30:00</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-[#e4e7ed] relative">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-sm font-medium text-[#303133]">
                        <ClipboardList className="w-4 h-4 text-[#909399] mr-1.5" />
                        <span className="font-mono">CHBG-20260511-0001</span>
                      </div>
                      <div className="text-[#67c23a] font-bold text-base">+30.00<span className="text-xs ml-0.5 font-normal">箱</span></div>
                    </div>
                    <div className="bg-[#f8f9fb] rounded p-2.5 space-y-2 mb-3">
                      <div className="flex items-center text-xs">
                        <span className="text-[#909399] border border-[#e4e7ed] bg-white rounded px-1.5 py-0.5 mr-2">出库单</span>
                        <span className="font-mono text-[#606266]">CK-20260511-001</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="text-[#909399] border border-[#e4e7ed] bg-white rounded px-1.5 py-0.5 mr-2">入库单</span>
                        <span className="font-mono text-[#606266]">RK-20260511-001</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#909399] pt-1">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> 李四
                      </div>
                      <div>2026-05-11 09:15:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="flex flex-col h-full w-full">
              <div className="px-4 border-b border-[#e4e7ed] shrink-0">
                <TabsList variant="line" className="border-b-0">
                  <TabsTrigger value="demand"><FileText className="w-4 h-4 mr-1.5" /> 需求明细</TabsTrigger>
                  <TabsTrigger value="report"><ClipboardList className="w-4 h-4 mr-1.5" /> 生产报工 (交接班)</TabsTrigger>
                </TabsList>
              </div>
  
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                <TabsContent value="demand" className="mt-0 h-full">
                  <div className="space-y-4">
                    <div className="bg-white overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                            <TableHead className="font-medium text-[#909399] text-center">生产类型</TableHead>
                            <TableHead className="font-medium text-[#909399] text-center">客户名称</TableHead>
                            <TableHead className="font-medium text-[#909399] text-center">厂内牌号规格</TableHead>
                            <TableHead className="font-medium text-[#909399] text-center">需求量({demandDetails[0]?.unit || '吨'})</TableHead>
                            <TableHead className="font-medium text-[#909399] text-center">交货地点</TableHead>
                            <TableHead className="font-medium text-[#909399] text-center">需求申请人</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {demandDetails.map((demand, idx) => (
                            <TableRow key={idx} className="hover:bg-[#f5f7fa]">
                              <TableCell className="text-center">{demand.productionType || '配方生产'}</TableCell>
                              <TableCell className="text-center">{demand.customerName}</TableCell>
                              <TableCell className="text-center">{demand.brandGrade} {demand.specification || ''}</TableCell>
                              <TableCell className="text-center">{demand.requirementAmount}</TableCell>
                              <TableCell className="text-center">{demand.deliveryLocation}</TableCell>
                              <TableCell className="text-[#606266] text-center">
                                {demand.applicantDepartment ? `${demand.applicantDepartment} - ` : ''}
                                {demand.applicantName}
                              </TableCell>
                            </TableRow>
                          ))}
                          {demandDetails.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="py-8 text-center text-[#909399]">暂无需求明细数据</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
  
                <TabsContent value="report" className="mt-0">
                  <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-[#303133] flex items-center"><PenTool className="w-4 h-4 mr-1.5 text-[#909399]"/>报工记录</h4>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff]">新增报工</Button>
                </div>
  
                {shiftLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#c0c4cc] bg-white rounded-lg border border-dashed border-[#dcdfe6]">
                    <Clock className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">暂无生产报工记录</span>
                    <span className="text-xs mt-1">请在班次结束后填报实际产量</span>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-[#e4e7ed] ml-3 pl-5 space-y-6">
                    {shiftLogs.map((log, idx) => (
                      <div key={idx} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[27px] top-1">
                          <CheckCircle className="w-4 h-4 text-[#67c23a] bg-white rounded-full" />
                        </div>
                        <div className="bg-white rounded-md border border-[#e4e7ed] p-3">
                          <div className="flex justify-between items-start mb-2 border-b border-[#fafafa] pb-2">
                            <div>
                              <div className="text-sm font-bold text-[#303133]">{log.shift}</div>
                              <div className="text-xs text-[#909399] mt-0.5">填报时间: {log.reportTime}</div>
                            </div>
                            <div className="text-right">
                               <div className="text-sm font-medium text-[#67c23a]">产出: +{log.productionQuantity} {log.unit}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-[#606266]">
                             <div><span className="text-[#909399] mr-2">值班长:</span>{log.shiftManager}</div>
                             <div><span className="text-[#909399] mr-2">填报人:</span>{log.reporter}</div>
                             <div className="col-span-2"><span className="text-[#909399] mr-2">设备状态:</span>{log.equipmentStatus}</div>
                             <div className="col-span-2"><span className="text-[#909399] mr-2">备注情况:</span>{log.remarks || '无'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
}
