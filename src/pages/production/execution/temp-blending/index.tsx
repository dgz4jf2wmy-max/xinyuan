import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, RotateCcw } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select } from '../../../../components/ui/select';
import { mockTempBlendingRecords } from '../../../../data/production/execution/tempBlendingData';
import { TemporaryBlendingApplication } from '../../../../types/production/execution/temporaryBlendingApplication';
import { TempBlendingApplyModal } from './components/TempBlendingApplyModal';

export default function TempBlendingProcessPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<TemporaryBlendingApplication[]>(mockTempBlendingRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusText = (status: TemporaryBlendingApplication['status']) => {
    switch (status) {
      case '草稿中':
        return <span className="text-gray-500">草稿中</span>;
      case '待审核':
      case '待确认':
        return <span className="text-[#e6a23c]">{status}</span>;
      case '已同意':
        return <span className="text-[#67c23a]">已同意</span>;
      case '已拒绝':
        return <span className="text-[#f56c6c]">已拒绝</span>;
      default:
        return status;
    }
  };

  const handleCreate = (newApply: TemporaryBlendingApplication) => {
    setRecords([newApply, ...records]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* Search Area */}
          <div className="flex justify-between items-start mb-4 shrink-0">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="w-64">
                <Input 
                  placeholder="搜索申请编号、产品..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => {}} className="bg-[#409eff] hover:bg-[#66b1ff]">
                <Search className="w-3.5 h-3.5 mr-1" /> 查询
              </Button>
              <Button variant="primary" onClick={() => setSearchTerm('')} className="bg-[#409eff] hover:bg-[#66b1ff]">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
              </Button>
            </div>
          </div>

          <div className="flex justify-end mb-4 shrink-0">
            <Button variant="primary" onClick={() => setIsModalOpen(true)} className="bg-[#409eff] hover:bg-[#66b1ff]">
              <Plus className="w-3.5 h-3.5 mr-1" /> 新增申请
            </Button>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f5f7fa] hover:bg-[#f5f7fa]">
                  <TableHead className="text-center font-medium text-[#606266]">申请编号</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">状态</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">月度生产任务编号</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">产品名称</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">产品编号</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">牌号</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">生产类型</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">回掺数量</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">回掺比例</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">申请人</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">创建时间</TableHead>
                  <TableHead className="text-center font-medium text-[#606266]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.filter(r => r.applicationNo.includes(searchTerm) || r.productName.includes(searchTerm)).map((record) => (
                  <TableRow key={record.applicationNo}>
                    <TableCell className="text-center text-[#606266]">{record.applicationNo}</TableCell>
                    <TableCell className="text-center font-medium">{getStatusText(record.status)}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.monthlyTaskNo}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.productName}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.productCode}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.brand}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.productionType}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.blendingQuantity ? record.blendingQuantity.toFixed(2) : ''}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.blendingRatio ? record.blendingRatio.toFixed(2) : ''}{record.blendingRatio ? '%' : ''}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.applicant}</TableCell>
                    <TableCell className="text-center text-[#606266]">{record.createdAt}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        {record.status === '草稿中' ? (
                          <>
                            <Button variant="ghost" size="sm" className="text-[#409eff] hover:text-[#66b1ff] h-6 px-2">编辑</Button>
                            <Button variant="ghost" size="sm" className="text-[#f56c6c] hover:bg-red-50 hover:text-[#f78989] h-6 px-2">删除</Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-[#409eff] hover:text-[#66b1ff] h-6 px-2" onClick={() => navigate(`/production/execution/temp-blending/detail/${record.applicationNo}`)}>查看</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center text-[#909399]">
                      暂无数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* 模拟分页器位置 */}
            <div className="mt-4 pt-2 mb-4">
              <div className="flex items-center text-sm text-[#606266]">
                共 {records.length} 条
                <div className="ml-4 flex items-center gap-2">
                  <Select 
                    options={[
                      { label: '10条/页', value: '10' },
                      { label: '20条/页', value: '20' },
                      { label: '50条/页', value: '50' }
                    ]}
                    defaultValue="10"
                    className="w-[100px] h-8 bg-white text-xs border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TempBlendingApplyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
