import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Modal } from '../../../../../components/ui/modal';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { mockMonthlyProductionTasks } from '../../../../../data/production/execution/monthlyTaskData';
import { TemporaryBlendingApplication } from '../../../../../types/production/execution/temporaryBlendingApplication';
import { MonthlyProductionArrangement } from '../../../../../types/production/execution/monthlyTask';

interface TempBlendingApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TemporaryBlendingApplication) => void;
}

export function TempBlendingApplyModal({ isOpen, onClose, onSubmit }: TempBlendingApplyModalProps) {
  const [selectedTaskNo, setSelectedTaskNo] = useState('');
  const [blendingQuantity, setBlendingQuantity] = useState('');
  const [blendingRatio, setBlendingRatio] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all production arrangements avoiding "otherArrangements"
  const availableTasks: MonthlyProductionArrangement[] = mockMonthlyProductionTasks.flatMap(mpt => mpt.productionArrangements);
  
  const filteredTasks = availableTasks.filter(t => 
    t.taskNo.includes(searchTerm) || 
    t.productName.includes(searchTerm) || 
    t.productCode.includes(searchTerm) || 
    t.brand.includes(searchTerm)
  );

  const selectedTask = availableTasks.find(t => t.taskNo === selectedTaskNo);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedTaskNo('');
      setBlendingQuantity('');
      setBlendingRatio('');
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedTask) return;
    
    onSubmit({
      monthlyTaskNo: selectedTask.taskNo,
      productionType: selectedTask.productType,
      productName: selectedTask.productName,
      productCode: selectedTask.productCode,
      brand: selectedTask.brand,
      blendingQuantity: Number(blendingQuantity),
      blendingRatio: Number(blendingRatio),
      applicationNo: `LSHC-20260510-00${Math.floor(Math.random() * 9 + 1)}`,
      status: '草稿中',
      applicant: '当前用户',
      createdAt: '2026-05-10 10:00'
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="新增临时回掺申请" 
      maxWidth="4xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!selectedTaskNo || !blendingQuantity || !blendingRatio}>确认</Button>
        </>
      }
    >
      <div className="flex flex-col h-full gap-6 py-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#303133]"><span className="text-red-500 mr-1">*</span>选择月度生产安排</label>
            <div className="w-64 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                className="pl-9 bg-white"
                placeholder="搜索生产任务编号、产品..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border border-[#e4e7ed] rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
                <TableRow>
                  <TableHead className="w-[60px] text-center"></TableHead>
                  <TableHead className="text-center">生产任务编号</TableHead>
                  <TableHead className="text-center">产品类型</TableHead>
                  <TableHead className="text-center">产品名称</TableHead>
                  <TableHead className="text-center">产品编号</TableHead>
                  <TableHead className="text-center">牌号</TableHead>
                  <TableHead className="text-center">产量/投料量(吨)</TableHead>
                  <TableHead className="text-center">完成日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => (
                  <TableRow 
                    key={task.taskNo} 
                    className="cursor-pointer hover:bg-[#f5f7fa]"
                    onClick={() => setSelectedTaskNo(task.taskNo)}
                  >
                    <TableCell className="text-center">
                      <input 
                        type="radio" 
                        name="taskSelection" 
                        checked={selectedTaskNo === task.taskNo}
                        onChange={() => setSelectedTaskNo(task.taskNo)}
                        className="w-4 h-4 text-[#409eff] focus:ring-[#409eff]"
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium text-[#303133]">{task.taskNo}</TableCell>
                    <TableCell className="text-center text-[#606266]">{task.productType}</TableCell>
                    <TableCell className="text-center text-[#606266]">{task.productName}</TableCell>
                    <TableCell className="text-center text-[#606266]">{task.productCode}</TableCell>
                    <TableCell className="text-center text-[#606266]">{task.brand}</TableCell>
                    <TableCell className="text-center text-[#606266]">{task.productionVolume}</TableCell>
                    <TableCell className="text-center text-[#606266]">{task.completionDate}</TableCell>
                  </TableRow>
                ))}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-[#909399]">
                      暂无相关生产安排
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-sm font-medium text-[#606266]"><span className="text-red-500 mr-1">*</span>回掺数量</label>
             <Input 
               type="number" 
               placeholder="请输入回掺数量" 
               value={blendingQuantity} 
               onChange={e => setBlendingQuantity(e.target.value)} 
             />
           </div>

           <div className="space-y-2">
             <label className="text-sm font-medium text-[#606266]"><span className="text-red-500 mr-1">*</span>回掺比例 (%)</label>
             <Input 
               type="number" 
               placeholder="请输入回掺比例" 
               value={blendingRatio} 
               onChange={e => setBlendingRatio(e.target.value)} 
             />
           </div>
        </div>
      </div>
    </Modal>
  );
}
