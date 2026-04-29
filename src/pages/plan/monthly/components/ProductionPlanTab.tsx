import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Pagination } from '../../../../components/ui/pagination';
import { Search, RotateCcw, Plus, Edit, ChevronDown } from 'lucide-react';
import { MonthlyProductionPlanBase } from '../../../../types/monthly-plan';
import { getMonthlyPlanPage } from '../../../../data/plan/monthlyPlanData';

export default function ProductionPlanTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MonthlyProductionPlanBase[]>([]);
  const [total, setTotal] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [queryParams, setQueryParams] = useState({
    planName: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getMonthlyPlanPage(queryParams);
      setData(res.list);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [queryParams.pageNum, queryParams.pageSize]);

  const handleSearch = () => {
    setQueryParams(prev => ({ ...prev, pageNum: 1 }));
    loadData();
  };

  const handleReset = () => {
    setQueryParams({
      planName: '',
      status: '',
      pageNum: 1,
      pageSize: 10,
    });
    setTimeout(loadData, 0);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case '草稿中': return <span className="text-[#909399]">草稿中</span>;
      case '已发布': return <span className="text-[#67c23a]">已发布</span>;
      case '待试验信息完善': return <span className="text-[#e6a23c]">待试验信息完善</span>;
      case '待确认': return <span className="text-[#409eff]">待确认</span>;
      case '待发布': return <span className="text-[#409eff]">待发布</span>;
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Search Header */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="w-48">
          <Input 
            placeholder="计划名称" 
            value={queryParams.planName}
            onChange={e => setQueryParams({...queryParams, planName: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Select 
            options={[
              { label: '草稿中', value: '草稿中' },
              { label: '已发布', value: '已发布' },
            ]}
            value={queryParams.status}
            onChange={e => setQueryParams({...queryParams, status: e.target.value})}
            placeholder="选择状态"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="primary" onClick={handleSearch}>
            <Search className="w-3.5 h-3.5 mr-1" /> 查询
          </Button>
          <Button variant="primary" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4 shrink-0">
        <div 
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <Button variant="primary" className="pr-2 cursor-pointer shrink-0" onClick={() => navigate('/plan/monthly/create')}>
            <Plus className="w-3.5 h-3.5 mr-1" /> 新增产销计划 <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full pt-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="bg-white border border-[#ebeef5] rounded shadow-lg py-1 w-40 flex flex-col items-stretch">
                <div 
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700 font-medium border-l-[3px] border-transparent hover:border-blue-500 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/plan/monthly/create');
                  }}
                >
                  月度产销计划
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700 font-medium border-l-[3px] border-transparent hover:border-blue-500 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/plan/monthly/aging/create');
                  }}
                >
                  月度醇化计划
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col border border-[#ebeef5] rounded-sm bg-white">
        <Table className="relative w-full">
          <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
            <TableRow>
              <TableHead className="w-[80px] text-center">序号</TableHead>
              <TableHead>计划名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建人</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {data.length > 0 ? data.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center">{row.sequenceNumber}</TableCell>
                  <TableCell>{row.planName}</TableCell>
                  <TableCell>{getStatusText(row.status)}</TableCell>
                  <TableCell>{row.creator}</TableCell>
                  <TableCell>{row.createTime}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#409eff] h-6 px-2"
                            onClick={() => {
                              if (row.status === '草稿中') {
                                navigate('/plan/monthly/create');
                              } else {
                                navigate(`/plan/monthly/detail/${row.id}`);
                              }
                            }}
                          >
                            {row.status === '草稿中' ? '编辑' : '查看'}
                          </Button>
                          
                          {row.status === '已发布' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[#e6a23c] h-6 px-2"
                              onClick={() => {
                                navigate(`/plan/monthly/adjust/${row.id}`);
                              }}
                            >
                              调整
                            </Button>
                          )}
                          
                          {(row.status === '草稿中' || row.status === '待试验信息完善') && (
                            <Button variant="ghost" size="sm" className="text-[#f56c6c] hover:bg-red-50 h-6 px-2">
                              删除
                            </Button>
                          )}
                        </div>
                      </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    {loading ? '加载中...' : '暂无数据'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="mt-4 pt-2 mb-4 pr-4">
            <Pagination 
              total={total} 
              pageSize={queryParams.pageSize} 
              current={queryParams.pageNum} 
              onChange={(page) => setQueryParams({...queryParams, pageNum: page})} 
            />
          </div>
        </div>
    </div>
  );
}
