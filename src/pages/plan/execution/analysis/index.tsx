import React, { useState } from 'react';
import { Calendar, Database, History, TrendingUp } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { 
  mockAchievementData, 
  mockTrendData, 
  mockInventoryData, 
  mockHistoryData 
} from '../../../../data/plan/execution/analysisData';
import clsx from 'clsx';

export default function PlanExecutionAnalysis() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeTrack, setTimeTrack] = useState('natural'); // 'natural' | 'financial'

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-[#303133]">
      <div className="mx-auto max-w-7xl border border-[#ebeef5] bg-white pt-6 shadow-sm rounded-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-[#303133]">计划执行与数据看板</h1>
            <p className="mt-1 text-sm text-[#909399]">综合管理信息平台 - 生产经营核心模块</p>
          </div>
          
          {/* Dual-track time cutting switch (PM-04-01-02) */}
          <div className="flex items-center space-x-1 rounded-sm bg-[#f5f7fa] p-1 shadow-sm border border-[#ebeef5]">
            <button
              onClick={() => setTimeTrack('natural')}
              className={clsx(
                "flex items-center px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                timeTrack === 'natural' ? 'bg-[#409eff] text-white' : 'text-[#606266] hover:bg-[#e4e7ed]'
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              自然月基准
            </button>
            <button
              onClick={() => setTimeTrack('financial')}
              className={clsx(
                "flex items-center px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                timeTrack === 'financial' ? 'bg-[#409eff] text-white' : 'text-[#606266] hover:bg-[#e4e7ed]'
              )}
            >
              <Database className="mr-2 h-4 w-4" />
              财务月基准 (25日)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-6 border-b border-[#ebeef5] px-6">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<TrendingUp />} label="综合分析看板" />
          <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Database />} label="市场库存维护" />
          <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History />} label="计划调整台账" />
        </div>

        {/* Content Area */}
        <div className="p-6 pt-0">
          {activeTab === 'dashboard' && <DashboardView timeTrack={timeTrack} />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'history' && <HistoryView />}
        </div>
      </div>
    </div>
  );
}

// --- Sub Views ---

// PM-04-01: 综合分析看板
const DashboardView = ({ timeTrack }: { timeTrack: string }) => {
  return (
    <div className="space-y-8">
      {/* PM-04-01-03: 年度产销达成率看板 */}
      <section>
        <h2 className="mb-4 text-[16px] font-bold border-l-4 border-[#409eff] pl-3 text-[#303133]">年度产销达成率 ({timeTrack === 'natural' ? '截止本月末' : '截止本月25日'})</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockAchievementData.map((data) => (
            <AchievementCard key={data.id} title={data.title} prodRate={data.prodRate} salesRate={data.salesRate} />
          ))}
        </div>
      </section>

      {/* PM-04-01-04: 跨年度产销趋势分析 (5 years) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold border-l-4 border-[#409eff] pl-3 text-[#303133]">5年产销趋势分析 (2021-2025)</h2>
          <select className="border border-[#dcdfe6] rounded-sm px-3 py-1.5 text-sm text-[#606266] focus:border-[#409eff] focus:outline-none bg-white">
            <option>全部产品类型</option>
            <option>再造烟叶</option>
            <option>再造梗丝</option>
            <option>香精香料</option>
          </select>
        </div>
        <div className="h-72 w-full rounded-sm border border-[#ebeef5] bg-[#fdfdfd] flex items-end justify-around p-6 relative">
          {mockTrendData.map((data) => (
            <TrendBar key={data.year} year={data.year} prod={data.prod} sales={data.sales} />
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4 text-sm text-[#606266]">
          <div className="flex items-center"><div className="w-3 h-3 bg-[#409eff] rounded-sm mr-2"></div>生产量</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-[#67c23a] rounded-sm mr-2"></div>销售量</div>
        </div>
      </section>
    </div>
  );
};

// PM-04-01-01: 月度市场库存信息维护
const InventoryView = () => {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-[16px] font-bold border-l-4 border-[#409eff] pl-3 text-[#303133]">市场库存信息录入表</h2>
        <Button variant="primary" size="sm" className="bg-[#409eff] hover:bg-[#66b1ff]">保存更新</Button>
      </div>
      
      <div className="bg-[#ecf5ff] border border-[#d9ecff] text-[#409eff] p-3 rounded-sm mb-6 text-sm flex items-center">
        提示：鑫源公司库存数据由平台自动从仓储逻辑库抓取。目标市场库存需由营销人员依据线下反馈人工维护，以辅助评估库存合理性。
      </div>

      <div className="border border-[#ebeef5] rounded-sm overflow-hidden">
        <Table className="border-collapse w-full">
          <TableHeader className="bg-[#f5f7fa]">
            <TableRow>
              <TableHead className="px-4 py-3 font-bold text-[#303133]">产品名称</TableHead>
              <TableHead className="px-4 py-3 font-bold text-[#303133]">所属品类</TableHead>
              <TableHead className="px-4 py-3 font-bold text-[#303133]">鑫源公司库存 (自动获取)</TableHead>
              <TableHead className="px-4 py-3 font-bold text-[#303133]">目标市场库存 (手工录入)</TableHead>
              <TableHead className="px-4 py-3 font-bold text-[#303133]">综合库存量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInventoryData.map((item) => (
              <InventoryRow key={item.id} product={item.product} type={item.type} autoStock={item.autoStock} initialManual={item.initialManual} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// PM-04-02-03: 计划调整台账
const HistoryView = () => {
  return (
    <div>
       <div className="mb-6 flex space-x-3">
          <select className="border border-[#dcdfe6] bg-white rounded-sm px-3 py-1.5 text-sm text-[#606266] w-48 focus:border-[#409eff] focus:outline-none">
            <option>2025年10月 计划</option>
            <option>2025年09月 计划</option>
          </select>
        </div>

      <div className="border-l border-[#ebeef5] ml-4 pl-6 space-y-8 relative">
        {mockHistoryData.map((item) => (
          <TimelineItem 
            key={item.id}
            date={item.date} 
            title={item.title} 
            user={item.user} 
            type={item.type}
            desc={item.desc}
            changes={item.changes}
          />
        ))}
      </div>
    </div>
  );
};

// --- Shared UI Components ---

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center pb-3 border-b-2 font-medium text-sm transition-colors",
      active ? 'border-[#409eff] text-[#409eff]' : 'border-transparent text-[#909399] hover:text-[#606266] hover:border-[#dcdfe6]'
    )}
  >
    <span className="mr-2 h-4 w-4">{icon}</span>
    {label}
  </button>
);

const AchievementCard = ({ title, prodRate, salesRate }: { title: string, prodRate: number, salesRate: number }) => (
  <div className="rounded-sm border border-[#ebeef5] p-5 bg-[#fafafa] transition-shadow hover:shadow-sm">
    <h3 className="font-bold text-[#303133] mb-4">{title}</h3>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#909399]">生产达成率</span>
          <span className="font-medium text-[#606266]">{prodRate}%</span>
        </div>
        <div className="w-full bg-[#ebeef5] rounded-full h-1.5 overflow-hidden">
          <div className="bg-[#409eff] h-1.5 rounded-full" style={{ width: `${prodRate}%` }}></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[#909399]">销售达成率</span>
          <span className="font-medium text-[#606266]">{salesRate}%</span>
        </div>
        <div className="w-full bg-[#ebeef5] rounded-full h-1.5 overflow-hidden">
          <div className="bg-[#67c23a] h-1.5 rounded-full" style={{ width: `${salesRate}%` }}></div>
        </div>
      </div>
    </div>
  </div>
);

const TrendBar = ({ year, prod, sales }: { year: string, prod: number, sales: number }) => (
  <div className="flex flex-col items-center group">
    <div className="flex items-end space-x-1 h-48 mb-3">
      <div 
        className="w-10 bg-[#409eff] rounded-t-sm transition-all duration-300 group-hover:bg-[#66b1ff] relative" 
        style={{ height: `${prod}%` }}
        title={`生产量: ${prod}吨`}
      ></div>
      <div 
        className="w-10 bg-[#67c23a] rounded-t-sm transition-all duration-300 group-hover:bg-[#85ce61] relative" 
        style={{ height: `${sales}%` }}
        title={`销售量: ${sales}吨`}
      ></div>
    </div>
    <span className="text-sm text-[#606266] font-medium">{year}</span>
  </div>
);

const InventoryRow = ({ product, type, autoStock, initialManual }: { product: string, type: string, autoStock: number, initialManual: number }) => {
  const [manualStock, setManualStock] = useState(initialManual);
  return (
    <TableRow className="hover:bg-gray-50 border-b border-[#ebeef5]">
      <TableCell className="px-4 py-3 font-medium text-[#303133]">{product}</TableCell>
      <TableCell className="px-4 py-3 text-[#606266]">{type}</TableCell>
      <TableCell className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-[#f4f4f5] text-[#909399] font-mono text-xs border border-[#e9e9eb]">
          {autoStock.toLocaleString()} kg
        </span>
      </TableCell>
      <TableCell className="px-4 py-3">
        <input 
          type="number" 
          value={manualStock}
          onChange={(e) => setManualStock(Number(e.target.value))}
          className="w-32 border border-[#dcdfe6] bg-white rounded-sm px-2 py-1 text-sm focus:ring-1 focus:ring-[#409eff] focus:border-[#409eff] outline-none text-[#606266]" 
        />
      </TableCell>
      <TableCell className="px-4 py-3 font-mono font-medium text-[#409eff]">
        {(autoStock + manualStock).toLocaleString()} kg
      </TableCell>
    </TableRow>
  );
};

const TimelineItem = ({ date, title, user, type, desc, changes }: any) => (
  <div className="relative">
    {/* Node */}
    <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#409eff] shadow-sm"></div>
    
    <div className="bg-white border border-[#ebeef5] rounded-sm p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-[#303133] flex items-center">
            {title}
            <span className="ml-3 px-2 py-0.5 text-[10px] rounded bg-[#ecf5ff] text-[#409eff] border border-[#d9ecff]">{type}</span>
          </h4>
          <p className="text-xs text-[#909399] mt-1.5">操作人: {user} &nbsp;•&nbsp; 时间: {date}</p>
        </div>
      </div>
      
      {desc && <p className="text-sm text-[#606266] mt-3 leading-relaxed">{desc}</p>}
      
      {changes && (
        <div className="mt-4 border border-[#ebeef5] rounded-sm overflow-hidden">
          <Table className="w-full text-left text-sm border-collapse">
            <TableHeader className="bg-[#f5f7fa]">
              <TableRow>
                <TableHead className="px-4 py-2 text-[#909399] font-normal w-1/3">调整项</TableHead>
                <TableHead className="px-4 py-2 text-[#909399] font-normal w-1/3 border-l border-[#ebeef5]">调整前</TableHead>
                <TableHead className="px-4 py-2 text-[#909399] font-normal w-1/3 border-l border-[#ebeef5]">调整后</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {changes.map((change: any, idx: number) => (
                <TableRow key={idx} className="border-t border-[#ebeef5]">
                  <TableCell className="px-4 py-2.5 text-[#606266]">{change.field}</TableCell>
                  <TableCell className="px-4 py-2.5 text-[#909399] line-through border-l border-[#ebeef5]">{change.old}</TableCell>
                  <TableCell className="px-4 py-2.5 text-[#f56c6c] font-medium border-l border-[#ebeef5]">{change.new}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  </div>
);

