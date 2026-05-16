import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, RotateCcw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Pagination } from '../../../../components/ui/pagination';
import { ProductionStatisticsReport } from '../../../../types/production/statistics/report';
import { getProductionStatisticsReports } from '../../../../data/production/statistics/analysisData';

export default function StatisticsAnalysisPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductionStatisticsReport[]>([]);
  const [total, setTotal] = useState(0);

  const [queryParams, setQueryParams] = useState({
    reportNo: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getProductionStatisticsReports(queryParams);
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
      reportNo: '',
      status: '',
      pageNum: 1,
      pageSize: 10,
    });
    setTimeout(loadData, 0);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case '待提交': return <span className="text-[#909399]">待提交</span>;
      case '待审核': return <span className="text-[#e6a23c]">待审核</span>;
      case '已发布': return <span className="text-[#67c23a]">已发布</span>;
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* 1. 页面主内容区 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <div className="w-48">
                <Input 
                  placeholder="生产统计报表编号" 
                  value={queryParams.reportNo}
                  onChange={e => setQueryParams({...queryParams, reportNo: e.target.value})}
                />
              </div>
              <div className="w-48">
                <Select 
                  options={[
                    { label: '待提交', value: '待提交' },
                    { label: '待审核', value: '待审核' },
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
              <Button variant="primary" onClick={() => {}}>
                <Plus className="w-3.5 h-3.5 mr-1" /> 后续新增按钮预留位置
              </Button>
            </div>

            <div className="flex-1 overflow-auto flex flex-col border border-[#e4e7ed] rounded-lg">
              <Table className="relative w-full">
                <TableHeader className="sticky top-0 z-10 bg-[#f5f7fa]">
                  <TableRow>
                    <TableHead className="w-[80px] text-center">序号</TableHead>
                    <TableHead>生产统计报表编号</TableHead>
                    <TableHead>生产统计报表名称</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>提交人</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? data.map(row => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center">{row.id}</TableCell>
                      <TableCell>{row.reportNo}</TableCell>
                      <TableCell>{row.reportName}</TableCell>
                      <TableCell>{getStatusText(row.status)}</TableCell>
                      <TableCell>{row.submitter}</TableCell>
                      <TableCell>{row.submitTime}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#409eff] h-6 px-2"
                            onClick={() => navigate('/production/statistics/analysis/detail')}
                          >
                            查看
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#409eff] h-6 px-2 disabled:text-gray-400 disabled:bg-transparent"
                            disabled={row.status !== '待提交'}
                            onClick={() => navigate('/production/statistics/analysis/edit')}
                          >
                            编辑
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                        {loading ? '加载中...' : '暂无数据'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

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
      </div>
    </div>
  );
}