import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Pagination } from '../../../components/ui/pagination';
import { Search, RotateCcw, Plus, Edit, History, GitCompare } from 'lucide-react';
import { AnnualPlanLedger } from '../../../types/plan';
import { getAnnualPlanPage } from '../../../data/plan/annualPlanData';

export default function AnnualPlanIndex() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnnualPlanLedger[]>([]);
  const [total, setTotal] = useState(0);

  const [queryParams, setQueryParams] = useState({
    year: '',
    productType: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAnnualPlanPage(queryParams);
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
      year: '',
      productType: '',
      status: '',
      pageNum: 1,
      pageSize: 10,
    });
    setTimeout(loadData, 0);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case '草稿中': return <span className="text-[#909399]">草稿中</span>;
      case '更新中': return <span className="text-[#409eff]">更新中</span>;
      case '待审核': return <span className="text-[#e6a23c]">待审核</span>;
      case '待确认': return <span className="text-[#e6a23c]">待确认</span>;
      case '已发布': return <span className="text-[#67c23a]">已发布</span>;
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* 需求 PM-01-01-01: 组合检索与精简展示 (按年份、产品类型、计划状态) */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="w-48">
          <Select 
            options={[
              { label: '2026年', value: '2026年' },
              { label: '2025年', value: '2025年' },
            ]}
            value={queryParams.year}
            onChange={e => setQueryParams({...queryParams, year: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Input 
            placeholder="产品类型" 
            value={queryParams.productType}
            onChange={e => setQueryParams({...queryParams, productType: e.target.value})}
          />
        </div>
        <div className="w-48">
          <Select 
            options={[
              { label: '草稿中', value: '草稿中' },
              { label: '更新中', value: '更新中' },
              { label: '待审核', value: '待审核' },
              { label: '待确认', value: '待确认' },
              { label: '已发布', value: '已发布' },
            ]}
            value={queryParams.status}
            onChange={e => setQueryParams({...queryParams, status: e.target.value})}
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
        {/* 需求 PM-01-02-03: 初始起草场景与流转 */}
        <Button variant="primary" onClick={() => navigate('/plan/annual/create')}>
          <Plus className="w-3.5 h-3.5 mr-1" /> 计划编制
        </Button>
        {/* 需求 PM-01-02-04: 中期调整、数据调整 */}
        <Button variant="primary">
          <Edit className="w-3.5 h-3.5 mr-1" /> 计划调整
        </Button>
      </div>

      <div className="flex-1 overflow-auto flex flex-col border border-[#ebeef5] rounded-sm">
        <Table className="relative w-full">
          <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
            <TableRow>
              <TableHead>计划名称</TableHead>
              <TableHead>所属年份</TableHead>
              <TableHead>当前版本号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建人</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>最后更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {data.length > 0 ? data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.planName}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.currentVersion}</TableCell>
                  <TableCell>{getStatusText(row.status)}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>{row.lastUpdatedAt}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#409eff] h-6 px-2"
                        onClick={() => {
                          if (row.status === '草稿中' || row.status === '更新中') {
                            navigate('/plan/annual/create');
                          } else {
                            navigate(`/plan/annual/detail/${row.id}`);
                          }
                        }}
                      >
                        {(row.status === '草稿中' || row.status === '更新中') ? '编辑' : '查看'}
                      </Button>
                      
                      {row.status === '已发布' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#e6a23c] hover:text-[#cf9236] hover:bg-orange-50 h-6 px-2"
                          onClick={() => {
                            navigate(`/plan/annual/adjust/${row.id}`);
                          }}
                        >
                          调整
                        </Button>
                      )}

                      {(row.status === '草稿中' || row.status === '更新中') && (
                        <Button variant="ghost" size="sm" className="text-[#f56c6c] hover:bg-red-50 h-6 px-2">
                          删除
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
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
