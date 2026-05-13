import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Settings } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { mockMonthlyProductionTasks } from '../../../../data/production/execution/monthlyTaskData';
import { MonthlyProductionTask } from '../../../../types/production/execution/monthlyTask';

export default function MonthlyProductionTaskPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks] = useState<MonthlyProductionTask[]>(mockMonthlyProductionTasks);
  
  // 公式配置 modal state
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [coefficient, setCoefficient] = useState<string>('2');


  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case '待编制':
        return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 border border-red-200 font-medium">{status}</span>;
      case '待审核':
      case '待审批':
        return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 border border-yellow-200">{status}</span>;
      case '待发布':
        return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 border border-blue-200">{status}</span>;
      case '已发布':
        return <span className="px-2 py-1 text-xs rounded bg-[#fafafa] text-[#909399] border border-[#e4e7ed]">{status}</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-[#fafafa] text-[#c0c4cc] border border-[#e4e7ed]">{status}</span>;
    }
  };

  const getExecutionStatusBadge = (status: string) => {
    switch (status) {
      case '待执行':
        return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 border border-yellow-200">{status}</span>;
      case '在执行':
        return <span className="px-2 py-1 text-xs rounded bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8]">{status}</span>;
      case '已执行':
        return <span className="px-2 py-1 text-xs rounded bg-[#fafafa] text-[#909399] border border-[#e4e7ed]">{status}</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded bg-[#fafafa] text-[#c0c4cc] border border-[#e4e7ed]">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* Search Area */}
          <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
            <div className="w-48">
              <Input 
                placeholder="生产任务编号 / 名称..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => setIsFormulaModalOpen(true)}>
                <Settings className="w-3.5 h-3.5 mr-1" /> 回填液公式配置
              </Button>
              <Button variant="primary" size="sm">
                <Search className="w-3.5 h-3.5 mr-1" /> 查询
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSearchTerm('')}>
                <Filter className="w-3.5 h-3.5 mr-1" /> 重置
              </Button>
            </div>
          </div>


          {/* Table Area */}
          <div className="flex-1 overflow-auto flex flex-col">
            <Table className="relative w-full">
              <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
                <TableRow>
                  <TableHead className="w-[80px] text-center">序号</TableHead>
                  <TableHead className="text-center">月度生产任务编号</TableHead>
                  <TableHead className="text-center">月度生产任务名称</TableHead>
                  <TableHead className="text-center">审批状态</TableHead>
                  <TableHead className="text-center">执行状态</TableHead>
                  <TableHead className="text-center">所属月份</TableHead>
                  <TableHead className="text-center">当前版本号</TableHead>
                  <TableHead className="text-center">创建人</TableHead>
                  <TableHead className="text-center">创建时间</TableHead>
                  <TableHead className="text-center">最后更新时间</TableHead>
                  <TableHead className="text-center w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.filter(t => t.baseInfo.taskNo.includes(searchTerm) || t.baseInfo.taskName.includes(searchTerm)).map((task, index) => (
                  <TableRow key={task.baseInfo.id} className="hover:bg-[#f5f7fa]">
                    <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                    <TableCell className="text-center font-medium text-[#1890ff] cursor-pointer">
                      {task.baseInfo.taskNo}
                    </TableCell>
                    <TableCell className="text-center">{task.baseInfo.taskName}</TableCell>
                    <TableCell className="text-center">{getApprovalStatusBadge(task.baseInfo.approvalStatus)}</TableCell>
                    <TableCell className="text-center">{getExecutionStatusBadge(task.baseInfo.executionStatus)}</TableCell>
                    <TableCell className="text-center">{task.baseInfo.month}</TableCell>
                    <TableCell className="text-center">{task.baseInfo.currentVersion}</TableCell>
                    <TableCell className="text-center">{task.baseInfo.creator}</TableCell>
                    <TableCell className="text-center">{task.baseInfo.createTime}</TableCell>
                    <TableCell className="text-center">{task.baseInfo.lastUpdateTime}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-3">
                        <span 
                           className="text-[#1890ff] cursor-pointer hover:opacity-80"
                           onClick={() => navigate(`/production/execution/monthly-task/detail/${task.baseInfo.id}`)}
                        >查看</span>
                        {task.baseInfo.approvalStatus === '待编制' ? (
                          <span 
                            onClick={() => navigate('/production/execution/monthly-task/builder')} 
                            className="text-[#e6a23c] cursor-pointer hover:opacity-80"
                          >
                            编制
                          </span>
                        ) : (
                          <span className="text-[#c0c4cc] cursor-not-allowed">
                            编制
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* 弹窗组件：回填液公式配置 */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[400px] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#e4e7ed] bg-[#fafafa] flex items-center text-gray-800">
              <h3 className="font-semibold text-sm">省内梗丝回填液公式配制</h3>
            </div>
            <div className="px-5 py-10 flex items-center justify-center gap-4">
              <span className="text-lg font-medium text-gray-800">产量</span>
              <span className="text-xl text-gray-400">/</span>
              <div className="relative">
                <input 
                  type="text" 
                  list="coefficient-options" 
                  value={coefficient} 
                  onChange={(e) => setCoefficient(e.target.value)} 
                  placeholder="经验系数"
                  className="w-32 border border-slate-300 rounded px-3 py-2 text-base focus:border-[#409eff] outline-none text-center bg-white"
                />
                <datalist id="coefficient-options">
                  <option value="2" />
                  <option value="2.5" />
                </datalist>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-[#e4e7ed] bg-[#fafafa] flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsFormulaModalOpen(false)}>取消</Button>
              <Button variant="primary" size="sm" onClick={() => {
                localStorage.setItem('blend_coefficient', coefficient);
                alert('保存成功');
                setIsFormulaModalOpen(false);
              }}>保存配置</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
