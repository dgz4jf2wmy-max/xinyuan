import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Pagination } from '../../../../components/ui/pagination';
import { Search, RotateCcw, Plus, Edit } from 'lucide-react';
import { MonthlyAgingPlan } from '../../../../types/monthly-plan';
import { getAgeingPlanPage } from '../../../../data/plan/agingPlanData';

export default function AgeingPlanTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MonthlyAgingPlan[]>([]);
  const [total, setTotal] = useState(0);

  const [queryParams, setQueryParams] = useState({
    planName: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAgeingPlanPage(queryParams);
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
        <Button variant="primary" onClick={() => navigate('/plan/monthly/aging/create')}>
          <Plus className="w-3.5 h-3.5 mr-1" /> 新增醇化计划
        </Button>
      </div>

      {/* Table Content */}
      <div className="flex-1 min-h-0 bg-white border border-[#ebeef5] rounded-sm flex flex-col shadow-sm">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-[#f5f7fa] z-10">
              <TableRow>
                <TableHead className="w-16 text-center">序号</TableHead>
                <TableHead>计划名称</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建人</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-24 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-sans">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-sans">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.sequenceNumber}>
                    <TableCell className="text-gray-500 text-center font-sans">{row.sequenceNumber}</TableCell>
                    <TableCell 
                      className="font-medium text-[#409eff] cursor-pointer hover:underline font-sans"
                      onClick={() => navigate(`/plan/monthly/aging/detail/${row.sequenceNumber}`)}
                    >
                      {row.planName}
                    </TableCell>
                    <TableCell className="font-sans">{getStatusText(row.status)}</TableCell>
                    <TableCell className="font-sans">{row.creator}</TableCell>
                    <TableCell className="font-sans">{row.createTime}</TableCell>
                    <TableCell className="text-center font-sans">
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#409eff] px-2 hover:bg-blue-50" 
                          onClick={() => navigate(`/plan/monthly/aging/detail/${row.sequenceNumber}`)}
                        >
                          {row.status === '草稿中' ? '编辑' : '查看'}
                        </Button>
                        {row.status === '草稿中' && (
                          <Button variant="ghost" size="sm" className="text-[#f56c6c] px-2 hover:bg-red-50">
                            删除
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Toolbar */}
        <div className="h-12 flex items-center px-4 border-t border-[#ebeef5] shrink-0 bg-white">
          <Pagination 
            total={total}
            pageSize={queryParams.pageSize}
            current={queryParams.pageNum}
            onChange={(page) => setQueryParams({ ...queryParams, pageNum: page })}
          />
        </div>
      </div>
    </div>
  );
}
