import React, { useState } from 'react';
import { ArrowLeft, Search, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Input } from '../../../../components/ui/input';
import { Select } from '../../../../components/ui/select';

import { mockProductionDailyReports, mockProductionWeeklyReports, mockProductionMonthlyReports } from '../../../../data/production/statistics/reportData';

export default function StatisticsReportPage() {
  const navigate = useNavigate();
  const location = window.location;
  const initialTab = new URLSearchParams(location.search).get('tab') || 'daily';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [queryParams, setQueryParams] = useState({
    reportNo: '',
    reportName: '',
    status: ''
  });

  const handleReset = () => {
    setQueryParams({ reportNo: '', reportName: '', status: '' });
  };

  const renderDailyTable = () => {
    const filteredData = mockProductionDailyReports.filter(item => {
      let match = true;
      if (queryParams.reportNo && !item.reportNo.includes(queryParams.reportNo)) match = false;
      if (queryParams.reportName && !item.reportName.includes(queryParams.reportName)) match = false;
      if (queryParams.status && item.status !== queryParams.status) match = false;
      return match;
    });

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>生产日报编号</TableHead>
            <TableHead>生产日报名称</TableHead>
            <TableHead>提交人</TableHead>
            <TableHead>提交时间</TableHead>
            <TableHead className="w-24">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <span className={`px-2 py-0.5 rounded text-xs ${item.status === '已发布' ? 'bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8]' : item.status === '待审核' ? 'bg-[#fdf6ec] text-[#e6a23c] border border-[#faecd8]' : 'bg-[#ecf5ff] text-[#409eff] border border-[#d9ecff]'}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="font-medium text-[#409eff] cursor-pointer hover:underline">{item.reportNo}</TableCell>
              <TableCell>{item.reportName}</TableCell>
              <TableCell>{item.submitter}</TableCell>
              <TableCell>{item.submitTime}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Button variant="link" size="sm" className="h-auto p-0 text-[#409eff] font-normal hover:text-[#66b1ff]" onClick={() => navigate('/production/statistics/report/daily-detail')}>查看</Button>
                  {item.status === '待提交' ? (
                    <Button variant="link" size="sm" className="h-auto p-0 text-[#409eff] font-normal hover:text-[#66b1ff]" onClick={() => navigate(`/production/statistics/report/daily-edit`)}>编辑</Button>
                  ) : (
                    <Button variant="link" size="sm" className="h-auto p-0 text-[#c0c4cc] font-normal cursor-not-allowed hover:no-underline" disabled>编辑</Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-[#909399]">暂无日报记录</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const renderWeeklyTable = () => {
    const filteredData = mockProductionWeeklyReports.filter(item => {
      let match = true;
      if (queryParams.reportNo && !item.reportNo.includes(queryParams.reportNo)) match = false;
      if (queryParams.reportName && !item.reportName.includes(queryParams.reportName)) match = false;
      if (queryParams.status && item.status !== queryParams.status) match = false;
      return match;
    });

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>生产周报编号</TableHead>
            <TableHead>生产周报名称</TableHead>
            <TableHead>提交人</TableHead>
            <TableHead>提交时间</TableHead>
            <TableHead className="w-24">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <span className={`px-2 py-0.5 rounded text-xs ${item.status === '已发布' ? 'bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8]' : item.status === '待审核' ? 'bg-[#fdf6ec] text-[#e6a23c] border border-[#faecd8]' : 'bg-[#ecf5ff] text-[#409eff] border border-[#d9ecff]'}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="font-medium text-[#409eff] cursor-pointer hover:underline">{item.reportNo}</TableCell>
              <TableCell>{item.reportName}</TableCell>
              <TableCell>{item.submitter}</TableCell>
              <TableCell>{item.submitTime}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Button variant="link" size="sm" className="h-auto p-0 text-[#409eff] font-normal hover:text-[#66b1ff]" onClick={() => navigate('/production/statistics/report/weekly-detail')}>查看</Button>
                  {item.status === '待提交' ? (
                    <Button variant="link" size="sm" className="h-auto p-0 text-[#409eff] font-normal hover:text-[#66b1ff]" onClick={() => navigate('/production/statistics/report/weekly-edit')}>编辑</Button>
                  ) : (
                    <Button variant="link" size="sm" className="h-auto p-0 text-[#c0c4cc] font-normal cursor-not-allowed hover:no-underline" disabled>编辑</Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-[#909399]">暂无周报记录</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const renderMonthlyTable = () => {
    const filteredData = mockProductionMonthlyReports.filter(item => {
      let match = true;
      if (queryParams.reportNo && !item.reportNo.includes(queryParams.reportNo)) match = false;
      if (queryParams.reportName && !item.reportName.includes(queryParams.reportName)) match = false;
      if (queryParams.status && item.status !== queryParams.status) match = false;
      return match;
    });

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>生产月报编号</TableHead>
            <TableHead>生产月报名称</TableHead>
            <TableHead>提交人</TableHead>
            <TableHead>提交时间</TableHead>
            <TableHead className="w-24">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <span className={`px-2 py-0.5 rounded text-xs ${item.status === '已发布' ? 'bg-[#f0f9eb] text-[#67c23a] border border-[#e1f3d8]' : item.status === '待审核' ? 'bg-[#fdf6ec] text-[#e6a23c] border border-[#faecd8]' : 'bg-[#ecf5ff] text-[#409eff] border border-[#d9ecff]'}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="font-medium text-[#409eff] cursor-pointer hover:underline">{item.reportNo}</TableCell>
              <TableCell>{item.reportName}</TableCell>
              <TableCell>{item.submitter}</TableCell>
              <TableCell>{item.submitTime}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Button variant="link" size="sm" className="h-auto p-0 text-[#409eff] font-normal hover:text-[#66b1ff]" onClick={() => navigate('/production/statistics/report/monthly-detail')}>查看</Button>
                  {item.status === '待提交' ? (
                    <Button variant="link" size="sm" className="h-auto p-0 text-[#409eff] font-normal hover:text-[#66b1ff]" onClick={() => navigate('/production/statistics/report/monthly-edit')}>编辑</Button>
                  ) : (
                    <Button variant="link" size="sm" className="h-auto p-0 text-[#c0c4cc] font-normal cursor-not-allowed hover:no-underline" disabled>编辑</Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-[#909399]">暂无月报记录</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* 1. 操作区 */}
          <div className="flex justify-between items-center mb-4 shrink-0 border-b border-[#e4e7ed] pb-2">
            <div className="flex items-center gap-2 text-[#303133]">
              <Tabs variant="line" value={activeTab} onValueChange={(val) => { setActiveTab(val); handleReset(); }} className="w-auto">
                <TabsList className="bg-transparent h-auto p-0 border-b-0 space-x-2 w-full justify-start">
                  <TabsTrigger value="daily">生产日报</TabsTrigger>
                  <TabsTrigger value="weekly">生产周报</TabsTrigger>
                  <TabsTrigger value="monthly">生产月报</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center mb-4 shrink-0">
            <div className="w-48">
              <Input 
                placeholder="编号" 
                value={queryParams.reportNo}
                onChange={e => setQueryParams({...queryParams, reportNo: e.target.value})}
              />
            </div>
            <div className="w-48">
              <Input 
                placeholder="名称" 
                value={queryParams.reportName}
                onChange={e => setQueryParams({...queryParams, reportName: e.target.value})}
              />
            </div>
            <div className="w-48">
              <Select
                value={queryParams.status}
                onChange={e => setQueryParams({...queryParams, status: e.target.value})}
                options={[
                  { label: '全部状态', value: '' },
                  { label: '待提交', value: '待提交' },
                  { label: '待审核', value: '待审核' },
                  { label: '已发布', value: '已发布' }
                ]}
                placeholder="状态查询"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => {}}>
                <Search className="w-3.5 h-3.5 mr-1" /> 查询
              </Button>
              <Button variant="primary" onClick={handleReset}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> 重置
              </Button>
            </div>
          </div>

          {/* 2. 页面主内容区 */}
          <div className="flex-1 min-h-0 overflow-auto">
             {activeTab === 'daily' && renderDailyTable()}
             {activeTab === 'weekly' && renderWeeklyTable()}
             {activeTab === 'monthly' && renderMonthlyTable()}
          </div>

        </div>
      </div>
    </div>
  );
}
