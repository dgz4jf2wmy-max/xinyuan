import React, { useState, useMemo } from 'react';
import { 
  Calendar, Database, TrendingUp, BarChart3, 
  Package, Download, Edit2, Check,
  Layers, Target, PieChart, AlertCircle
} from 'lucide-react';
import { monthlyProgress, annualFulfillment, historicalTrends, marketInventory as mockMarketInventory } from '../../../../data/plan/execution/analysisData';

// 内联样式合并函数
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- 原生组合图表：月度柱状图(体量) + 折线图(达成率) ---
import ReactECharts from 'echarts-for-react';

// --- 库存偏离度图表 ---
const InventoryDeviationChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ebeef5',
      textStyle: { color: '#303133', fontSize: 13 },
      padding: 12,
      formatter: (params: any[]) => {
        let title = `<div style="font-weight:bold;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #ebeef5;">${params[0].axisValue}</div>`;
        let content = params.map(item => {
          if (item.seriesName === '100% 标准水位') return ''; // Ignore markLine series in tooltip
          
          const isRate = item.seriesName === '实际/目标库存比率';
          const value = isRate ? `${item.value}%` : item.value;
          const colorHTML = `<span style="display:inline-block;margin-right:8px;border-radius:2px;width:10px;height:10px;background-color:${item.color.colorStops ? item.color.colorStops[0].color : item.color};"></span>`;
          return `<div style="display:flex;justify-content:space-between;line-height:22px;margin-bottom:4px;">
                    <span style="color:#606266;display:flex;align-items:center;">${colorHTML}${item.seriesName}</span>
                    <span style="font-family:monospace;font-weight:${isRate ? 'bold' : 'normal'};color:${isRate ? '#9333ea' : '#303133'};margin-left:24px;">${value}</span>
                  </div>`;
        }).join('');
        return title + content;
      }
    },
    legend: {
      top: 10,
      right: '4%',
      itemGap: 24,
      textStyle: { color: '#606266', fontSize: 13, fontWeight: '500' }
    },
    grid: { left: '3%', right: '3%', bottom: '10%', top: '25%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        data: data.map(d => d.product),
        axisPointer: { type: 'shadow' },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#303133', fontWeight: 'bold', margin: 16 }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } },
        axisLabel: { color: '#909399', fontFamily: 'monospace' }
      },
      {
        type: 'value',
        name: '',
        min: 0,
        max: (value: { max: number }) => Math.max(151, value.max + 10),
        splitLine: { show: false },
        axisLabel: { color: '#909399', fontFamily: 'monospace', formatter: '{value}%' }
      }
    ],
    series: [
      {
        name: '公司实际库存',
        type: 'bar',
        barWidth: 18,
        itemStyle: { color: '#409eff', borderRadius: [2, 2, 0, 0] },
        data: data.map(d => d.companyStock)
      },
      {
        name: '目标市场库存',
        type: 'bar',
        barWidth: 18,
        barGap: '30%',
        itemStyle: { 
          color: '#fff', 
          borderColor: '#f6c374', 
          borderWidth: 1,
          borderRadius: [2, 2, 0, 0] 
        },
        data: data.map(d => d.targetMarketStock)
      },
      {
        name: '实际/目标库存比率',
        type: 'line',
        yAxisIndex: 1,
        symbolSize: 8,
        itemStyle: { color: '#a855f7', borderWidth: 2, borderColor: '#fff' },
        lineStyle: { width: 3, color: '#a855f7' },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#fff',
          backgroundColor: '#a855f7',
          padding: [3, 6],
          borderRadius: 2,
          fontWeight: 'bold',
          fontSize: 11,
          distance: 10
        },
        data: data.map(d => d.targetMarketStock > 0 ? Math.round((d.companyStock / d.targetMarketStock) * 100) : 0),
        markLine: {
          data: [{ yAxis: 100 }],
          lineStyle: { color: '#a8abb2', type: 'dashed', width: 2 },
          symbol: 'none',
          label: {
            show: true,
            position: 'end',
            formatter: '100% 标准水位',
            color: '#fff',
            backgroundColor: '#a8abb2',
            padding: [3, 4],
            borderRadius: 2,
            fontSize: 11
          }
        }
      },
      {
        name: '100% 标准水位',
        type: 'line',
        itemStyle: { color: '#a8abb2' },
        lineStyle: { type: 'dashed', color: '#a8abb2' },
        data: []
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '320px', width: '100%' }} opts={{ renderer: 'svg' }} />;
};

const SvgMonthlyComboChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ebeef5',
      textStyle: { color: '#303133', fontSize: 13 },
      padding: 12,
      formatter: (params: any[]) => {
        let title = `<div style="font-weight:bold;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #ebeef5;">${params[0].axisValue}</div>`;
        let content = params.map(item => {
          const isRate = item.seriesName === '生产完成率';
          const value = isRate ? `${item.value}%` : item.value;
          const colorHTML = `<span style="display:inline-block;margin-right:8px;border-radius:2px;width:10px;height:10px;background-color:${item.color.colorStops ? item.color.colorStops[0].color : item.color};"></span>`;
          return `<div style="display:flex;justify-content:space-between;line-height:22px;margin-bottom:4px;">
                    <span style="color:#606266;display:flex;align-items:center;">${colorHTML}${item.seriesName}</span>
                    <span style="font-family:monospace;font-weight:${isRate ? 'bold' : 'normal'};color:${isRate ? '#e6a23c' : '#303133'};margin-left:24px;">${value}</span>
                  </div>`;
        }).join('');
        return title + content;
      }
    },
    grid: { left: '3%', right: '3%', bottom: '15%', top: '20%', containLabel: true },
    xAxis: [
      {
        type: 'category',
        data: data.map(d => d.month),
        axisPointer: { type: 'shadow' },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#606266', fontWeight: 'bold', margin: 12 }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: { lineStyle: { type: 'dashed', color: '#ebeef5' } },
        axisLabel: { color: '#909399', fontFamily: 'monospace' }
      },
      {
        type: 'value',
        name: '',
        min: 0,
        max: (value: { max: number }) => Math.max(120, value.max + 10),
        splitLine: { show: false },
        axisLabel: { color: '#e6a23c', fontFamily: 'monospace', formatter: '{value}%' }
      }
    ],
    series: [
      {
        name: '需求量',
        type: 'bar',
        barWidth: 12,
        itemStyle: { color: '#c8c9cc', borderRadius: [2, 2, 0, 0] },
        data: data.map(d => d.demand)
      },
      {
        name: '排产量',
        type: 'bar',
        barWidth: 12,
        itemStyle: { color: '#a0cfff', borderRadius: [2, 2, 0, 0] },
        data: data.map(d => d.scheduled)
      },
      {
        name: '生产量',
        type: 'bar',
        barWidth: 12,
        itemStyle: { color: '#409eff', borderRadius: [2, 2, 0, 0] },
        data: data.map(d => d.actual)
      },
      {
        name: '生产完成率',
        type: 'line',
        yAxisIndex: 1,
        symbolSize: 8,
        itemStyle: { color: '#e6a23c', borderWidth: 2, borderColor: '#fff' },
        lineStyle: { width: 3, color: '#e6a23c' },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#fff',
          backgroundColor: '#e6a23c',
          padding: [4, 8],
          borderRadius: 4,
          fontWeight: 'bold',
          distance: 10
        },
        data: data.map(d => d.rate)
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '320px', width: '100%' }} opts={{ renderer: 'svg' }} />;
};


// --- 原生趋势折线面积图 ---
const SvgTrendChart = ({ data }: { data: any[] }) => {
  const width = 1200;
  const height = 280;
  const paddingX = 80;
  const paddingY = 40;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  if (!data || data.length === 0) return null;

  const allValues = data.flatMap(d => [d.prod, d.sales]);
  const dataMax = Math.max(...allValues, 1);
  const dataMin = Math.min(...allValues, dataMax);
  const diff = dataMax - dataMin;
  
  const buffer = diff * 0.2 || dataMax * 0.1;
  const yMax = dataMax + buffer;
  const yMin = Math.max(0, dataMin - buffer);
  const yRange = yMax - yMin;

  const getX = (index: number) => paddingX + (index * (chartWidth / Math.max(1, data.length - 1)));
  const getY = (val: number) => height - paddingY - ((val - yMin) / yRange) * chartHeight;

  const prodPoints = data.map((d, i) => `${getX(i)},${getY(d.prod)}`).join(' ');
  const salesPoints = data.map((d, i) => `${getX(i)},${getY(d.sales)}`).join(' ');

  const prodArea = `${getX(0)},${height - paddingY} ${prodPoints} ${getX(data.length - 1)},${height - paddingY}`;
  const salesArea = `${getX(0)},${height - paddingY} ${salesPoints} ${getX(data.length - 1)},${height - paddingY}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible ">
      <defs>
        <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#409eff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#409eff" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67c23a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#67c23a" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
        const y = height - paddingY - ratio * chartHeight;
        const tickValue = yMin + yRange * ratio;
        return (
          <g key={ratio}>
            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#ebeef5" strokeDasharray="4 4" strokeWidth="1" />
            <text x={paddingX - 10} y={y + 4} fontSize="12" fill="#909399" textAnchor="end" fontFamily="monospace">
              {Math.round(tickValue).toLocaleString()}
            </text>
          </g>
        )
      })}

      <polygon points={prodArea} fill="url(#prodGrad)" />
      <polygon points={salesArea} fill="url(#salesGrad)" />

      <polyline points={prodPoints} fill="none" stroke="#409eff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={salesPoints} fill="none" stroke="#67c23a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {data.map((d, i) => (
        <g key={i}>
          <text x={getX(i)} y={height - paddingY + 24} fontSize="14" fill="#606266" textAnchor="middle" fontWeight="bold">{d.year}</text>
          
          <circle cx={getX(i)} cy={getY(d.prod)} r="5" fill="#fff" stroke="#409eff" strokeWidth="2.5" />
          <rect x={getX(i) - 26} y={getY(d.prod) - 30} width="52" height="20" fill="#409eff" rx="3" />
          <text x={getX(i)} y={getY(d.prod) - 16} fontSize="11" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{d.prod}</text>

          <circle cx={getX(i)} cy={getY(d.sales)} r="5" fill="#fff" stroke="#67c23a" strokeWidth="2.5" />
          <rect x={getX(i) - 26} y={getY(d.sales) + 10} width="52" height="20" fill="#67c23a" rx="3" />
          <text x={getX(i)} y={getY(d.sales) + 24} fontSize="11" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{d.sales}</text>
        </g>
      ))}
    </svg>
  );
};


export default function PlanExecutionAnalysis() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual' | 'inventory'>('monthly');
  const [timeTrack, setTimeTrack] = useState<'natural' | 'financial'>('natural');
  const [trendCategory, setTrendCategory] = useState('再造烟叶');
  const [monthlyCategory, setMonthlyCategory] = useState('全厂统筹');
  const [inventoryMonth, setInventoryMonth] = useState('4月');
  
  const [selectedYear, setSelectedYear] = useState('2024');
  const [inventoryData, setInventoryData] = useState(mockMarketInventory);
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());

  const handleTargetStockChange = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setInventoryData(prev => prev.map(item => item.id === id ? { ...item, targetMarketStock: num } : item));
  };

  const toggleEditRow = (id: string) => {
    setEditingRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const filteredTrendData = useMemo(() => {
    return historicalTrends.filter((d: any) => d.category === trendCategory);
  }, [trendCategory]);

  // 计算省内、省外及总体合计 (防范空对象报错)
  const calcSubtotal = (items: any[]) => {
    const keys = Array.from({length: 12}, (_, i) => i + 1).flatMap(i => [`m${i}Demand`, `m${i}Scheduled`, `m${i}Actual`]);
    const zeroObj = { initialStock: 0, ...Object.fromEntries(keys.map(k => [k, 0])), accDemand: 0, accScheduled: 0, accActual: 0 };
    if (!items || items.length === 0) return zeroObj;
    return items.reduce((acc, curr) => {
      const res: any = {
        initialStock: acc.initialStock + (curr.initialStock || 0),
        accDemand: acc.accDemand + (curr.accDemand || 0), 
        accScheduled: acc.accScheduled + (curr.accScheduled || 0), 
        accActual: acc.accActual + (curr.accActual || 0),
      };
      keys.forEach(k => {
        res[k] = acc[k] + (curr[k] || 0);
      });
      return res;
    }, zeroObj);
  };

  const filteredInProvince = useMemo(() => {
    return monthlyCategory === '全厂统筹' 
      ? monthlyProgress.inProvince 
      : monthlyProgress.inProvince.filter((d: any) => d.category === monthlyCategory);
  }, [monthlyCategory]);

  const filteredOutProvince = useMemo(() => {
    return monthlyCategory === '全厂统筹' 
      ? monthlyProgress.outProvince 
      : monthlyProgress.outProvince.filter((d: any) => d.category === monthlyCategory);
  }, [monthlyCategory]);

  const inSubtotal = calcSubtotal(filteredInProvince);
  const outSubtotal = calcSubtotal(filteredOutProvince);
  
  const grandTotal = {
    initialStock: inSubtotal.initialStock + outSubtotal.initialStock,
    m1Demand: inSubtotal.m1Demand + outSubtotal.m1Demand,
    m1Scheduled: inSubtotal.m1Scheduled + outSubtotal.m1Scheduled,
    m1Actual: inSubtotal.m1Actual + outSubtotal.m1Actual,
    m2Demand: inSubtotal.m2Demand + outSubtotal.m2Demand,
    m2Scheduled: inSubtotal.m2Scheduled + outSubtotal.m2Scheduled,
    m2Actual: inSubtotal.m2Actual + outSubtotal.m2Actual,
    m3Demand: inSubtotal.m3Demand + outSubtotal.m3Demand,
    m3Scheduled: inSubtotal.m3Scheduled + outSubtotal.m3Scheduled,
    m3Actual: inSubtotal.m3Actual + outSubtotal.m3Actual,
    m4Demand: inSubtotal.m4Demand + outSubtotal.m4Demand,
    m4Scheduled: inSubtotal.m4Scheduled + outSubtotal.m4Scheduled,
    m4Actual: inSubtotal.m4Actual + outSubtotal.m4Actual,
    m5Demand: inSubtotal.m5Demand + outSubtotal.m5Demand,
    m5Scheduled: inSubtotal.m5Scheduled + outSubtotal.m5Scheduled,
    m5Actual: inSubtotal.m5Actual + outSubtotal.m5Actual,
    m6Demand: inSubtotal.m6Demand + outSubtotal.m6Demand,
    m6Scheduled: inSubtotal.m6Scheduled + outSubtotal.m6Scheduled,
    m6Actual: inSubtotal.m6Actual + outSubtotal.m6Actual,
    m7Demand: inSubtotal.m7Demand + outSubtotal.m7Demand,
    m7Scheduled: inSubtotal.m7Scheduled + outSubtotal.m7Scheduled,
    m7Actual: inSubtotal.m7Actual + outSubtotal.m7Actual,
    m8Demand: inSubtotal.m8Demand + outSubtotal.m8Demand,
    m8Scheduled: inSubtotal.m8Scheduled + outSubtotal.m8Scheduled,
    m8Actual: inSubtotal.m8Actual + outSubtotal.m8Actual,
    m9Demand: inSubtotal.m9Demand + outSubtotal.m9Demand,
    m9Scheduled: inSubtotal.m9Scheduled + outSubtotal.m9Scheduled,
    m9Actual: inSubtotal.m9Actual + outSubtotal.m9Actual,
    m10Demand: inSubtotal.m10Demand + outSubtotal.m10Demand,
    m10Scheduled: inSubtotal.m10Scheduled + outSubtotal.m10Scheduled,
    m10Actual: inSubtotal.m10Actual + outSubtotal.m10Actual,
    m11Demand: inSubtotal.m11Demand + outSubtotal.m11Demand,
    m11Scheduled: inSubtotal.m11Scheduled + outSubtotal.m11Scheduled,
    m11Actual: inSubtotal.m11Actual + outSubtotal.m11Actual,
    m12Demand: inSubtotal.m12Demand + outSubtotal.m12Demand,
    m12Scheduled: inSubtotal.m12Scheduled + outSubtotal.m12Scheduled,
    m12Actual: inSubtotal.m12Actual + outSubtotal.m12Actual,
    accDemand: inSubtotal.accDemand + outSubtotal.accDemand, 
    accScheduled: inSubtotal.accScheduled + outSubtotal.accScheduled, 
    accActual: inSubtotal.accActual + outSubtotal.accActual,
  };

  // 生成月度对比图表所需的数据
  const chartData = [
    { 
      month: '1月', 
      demand: grandTotal.m1Demand, 
      scheduled: grandTotal.m1Scheduled, 
      actual: grandTotal.m1Actual, 
      rate: grandTotal.m1Scheduled > 0 ? Math.round((grandTotal.m1Actual / grandTotal.m1Scheduled) * 100) : 0 
    },
    { 
      month: '2月', 
      demand: grandTotal.m2Demand, 
      scheduled: grandTotal.m2Scheduled, 
      actual: grandTotal.m2Actual, 
      rate: grandTotal.m2Scheduled > 0 ? Math.round((grandTotal.m2Actual / grandTotal.m2Scheduled) * 100) : 0 
    },
    { 
      month: '3月', 
      demand: grandTotal.m3Demand, 
      scheduled: grandTotal.m3Scheduled, 
      actual: grandTotal.m3Actual, 
      rate: grandTotal.m3Scheduled > 0 ? Math.round((grandTotal.m3Actual / grandTotal.m3Scheduled) * 100) : 0 
    },
    { 
      month: '4月', 
      demand: grandTotal.m4Demand, 
      scheduled: grandTotal.m4Scheduled, 
      actual: grandTotal.m4Actual, 
      rate: grandTotal.m4Scheduled > 0 ? Math.round((grandTotal.m4Actual / grandTotal.m4Scheduled) * 100) : 0 
    },
    { 
      month: '5月', 
      demand: grandTotal.m5Demand, 
      scheduled: grandTotal.m5Scheduled, 
      actual: grandTotal.m5Actual, 
      rate: grandTotal.m5Scheduled > 0 ? Math.round((grandTotal.m5Actual / grandTotal.m5Scheduled) * 100) : 0 
    },
    { 
      month: '6月', 
      demand: grandTotal.m6Demand, 
      scheduled: grandTotal.m6Scheduled, 
      actual: grandTotal.m6Actual, 
      rate: grandTotal.m6Scheduled > 0 ? Math.round((grandTotal.m6Actual / grandTotal.m6Scheduled) * 100) : 0 
    },
    { 
      month: '7月', 
      demand: grandTotal.m7Demand, 
      scheduled: grandTotal.m7Scheduled, 
      actual: grandTotal.m7Actual, 
      rate: grandTotal.m7Scheduled > 0 ? Math.round((grandTotal.m7Actual / grandTotal.m7Scheduled) * 100) : 0 
    },
    { 
      month: '8月', 
      demand: grandTotal.m8Demand, 
      scheduled: grandTotal.m8Scheduled, 
      actual: grandTotal.m8Actual, 
      rate: grandTotal.m8Scheduled > 0 ? Math.round((grandTotal.m8Actual / grandTotal.m8Scheduled) * 100) : 0 
    },
    { 
      month: '9月', 
      demand: grandTotal.m9Demand, 
      scheduled: grandTotal.m9Scheduled, 
      actual: grandTotal.m9Actual, 
      rate: grandTotal.m9Scheduled > 0 ? Math.round((grandTotal.m9Actual / grandTotal.m9Scheduled) * 100) : 0 
    },
    { 
      month: '10月', 
      demand: grandTotal.m10Demand, 
      scheduled: grandTotal.m10Scheduled, 
      actual: grandTotal.m10Actual, 
      rate: grandTotal.m10Scheduled > 0 ? Math.round((grandTotal.m10Actual / grandTotal.m10Scheduled) * 100) : 0 
    },
    { 
      month: '11月', 
      demand: grandTotal.m11Demand, 
      scheduled: grandTotal.m11Scheduled, 
      actual: grandTotal.m11Actual, 
      rate: grandTotal.m11Scheduled > 0 ? Math.round((grandTotal.m11Actual / grandTotal.m11Scheduled) * 100) : 0 
    },
    { 
      month: '12月', 
      demand: grandTotal.m12Demand, 
      scheduled: grandTotal.m12Scheduled, 
      actual: grandTotal.m12Actual, 
      rate: grandTotal.m12Scheduled > 0 ? Math.round((grandTotal.m12Actual / grandTotal.m12Scheduled) * 100) : 0 
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden w-full">
      
      {/* 顶部通栏：页签导航和双轨时间核算引擎融合 */}
      <div className="bg-white border-b border-gray-200 px-6 pt-3 pb-0 flex justify-between items-end flex-wrap gap-4 z-20 shrink-0">
        
        <div className="flex space-x-8">
          {[
            { id: 'monthly', icon: Layers, label: '月度执行追踪' },
            { id: 'annual', icon: PieChart, label: '年度产销大盘' },
            { id: 'inventory', icon: Package, label: '市场库存台账' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center pb-3 text-[14px] font-bold border-b-[3px] transition-colors relative top-[1px]",
                activeTab === tab.id 
                  ? "border-[#409eff] text-[#409eff]" 
                  : "border-transparent text-gray-500 hover:text-gray-800"
              )}
            >
              <tab.icon className="w-4 h-4 mr-1.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-gray-50 p-1 rounded border border-gray-200 mb-2.5">
          <button
            onClick={() => setTimeTrack('natural')}
            className={cn(
              "flex items-center px-3 py-1.5 text-[13px] font-bold rounded transition-all",
              timeTrack === 'natural' ? 'bg-white text-[#409eff] border border-gray-100' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            自然月基准 (匹配生产月报)
          </button>
          <button
            onClick={() => setTimeTrack('financial')}
            className={cn(
              "flex items-center px-3 py-1.5 text-[13px] font-bold rounded transition-all",
              timeTrack === 'financial' ? 'bg-white text-[#409eff] border border-gray-100' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <Database className="mr-1.5 h-3.5 w-3.5" />
            25日关账基准 (匹配财务流转)
          </button>
        </div>
      </div>

      {/* 主体分析区域 */}
      <div className="flex-1 overflow-y-auto p-6 w-full">
        
        {/* ======================================= */}
        {/* 模块一：月度执行追踪 (图表在上，表格在下) */}
        {/* ======================================= */}
        {activeTab === 'monthly' && (
          <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
            
            {/* 上半部分：各月度对比动态组合图 (图表直出趋势) */}
            <div className="bg-white border border-gray-200 rounded flex flex-col overflow-hidden w-full h-[360px] shrink-0">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <h2 className="text-[15px] font-bold text-gray-800 flex items-center border-l-4 border-[#409eff] pl-3">
                    <TrendingUp className="w-4 h-4 mr-1.5 text-gray-500" />
                    月度体量与生产完成率对比图
                  </h2>
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-[13px] font-medium text-gray-700 outline-none focus:border-[#409eff] focus:ring-1 focus:ring-[#409eff] bg-white cursor-pointer"
                    value={monthlyCategory}
                    onChange={(e) => setMonthlyCategory(e.target.value)}
                  >
                    <option value="全厂统筹">全厂统筹</option>
                    <option value="再造烟叶">再造烟叶</option>
                    <option value="再造梗丝">再造梗丝</option>
                    <option value="香精香料">香精香料</option>
                  </select>
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-[13px] font-medium text-gray-700 outline-none focus:border-[#409eff] focus:ring-1 focus:ring-[#409eff] bg-white cursor-pointer ml-3"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="2024">2024年</option>
                    <option value="2023">2023年</option>
                    <option value="2022">2022年</option>
                  </select>
                </div>
                <div className="flex items-center text-[12px] gap-5 bg-white px-3 py-1.5 border border-gray-200 rounded">
                  <span className="flex items-center"><div className="w-3 h-3 bg-[#c0c4cc] rounded-sm mr-1.5"></div>需求量</span>
                  <span className="flex items-center"><div className="w-3 h-3 bg-[#a0cfff] rounded-sm mr-1.5"></div>排产量</span>
                  <span className="flex items-center"><div className="w-3 h-3 bg-[#409eff] rounded-sm mr-1.5"></div>生产量</span>
                  <span className="flex items-center ml-2 border-l pl-4"><div className="w-5 h-1 bg-[#e6a23c] mr-1.5"></div>生产完成率 (右轴)</span>
                </div>
              </div>
              <div className="p-4 flex-1">
                <SvgMonthlyComboChart data={chartData} />
              </div>
            </div>

            {/* 下半部分：沉降的数据下钻台账 (保留原始报表) */}
            <div className="bg-white border border-gray-200 rounded flex flex-col overflow-hidden w-full flex-1">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe]">
                <h2 className="text-[15px] font-bold text-gray-800 flex items-center border-l-4 border-[#67c23a] pl-3">
                  <Database className="w-4 h-4 mr-1.5 text-gray-500" />
                  基础数据台账：产量计划对比进度明细表
                </h2>
                <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors h-8 bg-white ">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> 导出明细表
                </button>
              </div>
              
              <div className="overflow-x-auto p-4 bg-white">
                <table className="w-full text-center border-collapse min-w-[1200px] border border-[#ebeef5]">
                  <thead className="bg-[#f5f7fa]">
                    <tr>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#606266] align-middle" rowSpan={2}>产品编号</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#606266] align-middle" rowSpan={2}>产品名称</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#606266] align-middle" rowSpan={2}>牌号</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#606266] align-middle" rowSpan={2}>规格</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#606266] align-middle bg-orange-50/50" rowSpan={2}>期末<br/>库存</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>1月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>2月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>3月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>4月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>5月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>6月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>7月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>8月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>9月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>10月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>11月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#303133]" colSpan={3}>12月执行情况</th>
                      <th className="py-2.5 px-3 border border-[#ebeef5] text-[13px] font-bold text-[#409eff] bg-[#ecf5ff]" colSpan={3}>1-12月累计执行情况</th>
                    </tr>
                    <tr>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">市场<br/>需求计划</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">排产量</th>
                        <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-medium text-[#606266]">生产量</th>
                      <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-bold text-[#409eff] bg-[#ecf5ff]">累计市<br/>场需求</th>
                      <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-bold text-[#409eff] bg-[#ecf5ff]">累计<br/>排产量</th>
                      <th className="py-2 px-3 border border-[#ebeef5] text-[12px] font-bold text-[#409eff] bg-[#ecf5ff]">累计<br/>生产量</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {/* 省内部分 */}
                    {filteredInProvince.map((item: any, idx: number) => (
                      <tr key={item.productCode} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-700 text-left">{item.productCode}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-bold text-gray-700 text-left whitespace-pre-wrap leading-relaxed max-w-[120px]">{item.productName}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-bold text-gray-700 text-center">{item.brandGrade}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] text-gray-500 whitespace-pre-wrap">{item.specification}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600 bg-orange-50/20">{item.initialStock}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m1Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m1Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m1Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m2Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m2Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m2Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m3Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m3Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m3Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m4Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m4Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m4Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m5Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m5Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m5Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m6Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m6Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m6Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m7Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m7Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m7Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m8Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m8Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m8Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m9Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m9Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m9Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m10Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m10Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m10Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m11Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m11Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m11Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m12Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m12Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m12Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono font-bold text-gray-800 bg-[#ecf5ff]/50">{item.accDemand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono font-bold text-gray-800 bg-[#ecf5ff]/50">{item.accScheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono font-bold text-[#409eff] bg-[#ecf5ff]/50">{item.accActual}</td>
                      </tr>
                    ))}
                    {/* 省内小计 */}
                    <tr className="bg-[#fafafa] font-bold">
                      <td colSpan={4} className="py-3 px-3 border border-[#ebeef5] text-gray-700 text-center tracking-widest">省内合计</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800 bg-orange-50/50">{inSubtotal.initialStock}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m1Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m1Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m1Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m2Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m2Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m2Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m3Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m3Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m3Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m4Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m4Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m4Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m5Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m5Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m5Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m6Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m6Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m6Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m7Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m7Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m7Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m8Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m8Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m8Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m9Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m9Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m9Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m10Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m10Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m10Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m11Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m11Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m11Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m12Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m12Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{inSubtotal.m12Actual}</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-900 bg-[#ecf5ff]">{inSubtotal.accDemand}</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-900 bg-[#ecf5ff]">{inSubtotal.accScheduled}</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-[#409eff] bg-[#ecf5ff]">{inSubtotal.accActual}</td>
                    </tr>

                    {/* 省外部分 */}
                    {filteredOutProvince.map((item: any, idx: number) => (
                      <tr key={item.productCode} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-700 text-left">{item.productCode}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-bold text-gray-700 text-left whitespace-pre-wrap leading-relaxed max-w-[120px]">{item.productName}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-bold text-gray-700 text-center">{item.brandGrade}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] text-gray-500 whitespace-pre-wrap">{item.specification}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600 bg-orange-50/20">{item.initialStock}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m1Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m1Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m1Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m2Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m2Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m2Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m3Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m3Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m3Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m4Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m4Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m4Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m5Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m5Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m5Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m6Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m6Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m6Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m7Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m7Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m7Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m8Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m8Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m8Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m9Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m9Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m9Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m10Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m10Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m10Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m11Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m11Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m11Actual}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m12Demand}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m12Scheduled}</td>
                          <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-600">{item.m12Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono font-bold text-gray-800 bg-[#ecf5ff]/50">{item.accDemand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono font-bold text-gray-800 bg-[#ecf5ff]/50">{item.accScheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono font-bold text-[#409eff] bg-[#ecf5ff]/50">{item.accActual}</td>
                      </tr>
                    ))}
                    {/* 省外小计 */}
                    <tr className="bg-[#fafafa] font-bold">
                      <td colSpan={4} className="py-3 px-3 border border-[#ebeef5] text-gray-700 text-center tracking-widest">省外合计</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800 bg-orange-50/50">{outSubtotal.initialStock}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m1Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m1Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m1Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m2Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m2Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m2Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m3Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m3Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m3Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m4Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m4Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m4Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m5Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m5Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m5Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m6Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m6Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m6Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m7Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m7Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m7Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m8Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m8Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m8Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m9Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m9Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m9Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m10Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m10Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m10Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m11Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m11Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m11Actual}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m12Demand}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m12Scheduled}</td>
                        <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-800">{outSubtotal.m12Actual}</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-900 bg-[#ecf5ff]">{outSubtotal.accDemand}</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-gray-900 bg-[#ecf5ff]">{outSubtotal.accScheduled}</td>
                      <td className="py-3 px-3 border border-[#ebeef5] font-mono text-[#409eff] bg-[#ecf5ff]">{outSubtotal.accActual}</td>
                    </tr>

                    {/* 整体总计 */}
                    <tr className="bg-[#f0f2f5] font-black border-t-[3px] border-[#dcdfe6]">
                      <td colSpan={4} className="py-3.5 px-3 border border-[#ebeef5] text-[14px] text-gray-900 text-center tracking-widest">省内外总计</td>
                      <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900 bg-orange-100">{grandTotal.initialStock}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m1Demand}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m1Scheduled}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m1Actual}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m2Demand}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m2Scheduled}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m2Actual}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m3Demand}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m3Scheduled}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m3Actual}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m4Demand}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m4Scheduled}</td>
                        <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900">{grandTotal.m4Actual}</td>
                      <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900 bg-[#d9ecff]">{grandTotal.accDemand}</td>
                      <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-gray-900 bg-[#d9ecff]">{grandTotal.accScheduled}</td>
                      <td className="py-3.5 px-3 border border-[#ebeef5] font-mono text-[#409eff] text-[15px] bg-[#d9ecff]">{grandTotal.accActual}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 模块二：年度产销大盘 (含当年累计与跨年趋势) */}
        {/* ======================================= */}
        {activeTab === 'annual' && (
          <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
            
            {/* 顶层：将原来月度中的“本年累计生产达成率”移至此处 */}
            <div className="bg-white border border-[#ebeef5] rounded-md p-6 flex flex-col justify-center w-full relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none">
                 <Target className="w-48 h-48 -mr-10 -mt-10" />
              </div>
              <h3 className="text-[14px] font-bold text-[#909399] flex items-center mb-4 tracking-wider">
                <Target className="w-5 h-5 mr-2" /> 全厂本年累计计划达成率
              </h3>
              <div className="flex items-baseline mb-3">
                <span className="text-5xl font-black text-[#409eff] tracking-tighter">
                  {grandTotal.accScheduled > 0 ? Math.round((grandTotal.accActual / grandTotal.accScheduled) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-4 ">
                <div className="h-full bg-[#409eff] rounded-full" style={{ width: `${Math.round((grandTotal.accActual / grandTotal.accScheduled) * 100)}%` }}></div>
              </div>
              <div className="flex gap-8 mt-2 border-t border-gray-100 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-[13px]">累计排产下达量</span>
                  <span className="font-bold text-gray-800 font-mono text-lg">{grandTotal.accScheduled} <span className="text-gray-400 font-normal text-[12px]">吨</span></span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-[13px]">累计实际生产量</span>
                  <span className="font-bold text-[#67c23a] font-mono text-lg">{grandTotal.accActual} <span className="text-gray-400 font-normal text-[12px]">吨</span></span>
                </div>
              </div>
            </div>

            {/* 年度各类别目标达成率 */}
            <section className="bg-white border border-gray-200 rounded flex flex-col overflow-hidden w-full">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-[15px] font-bold text-gray-800 flex items-center border-l-4 border-[#409eff] pl-3">
                  分类年度产销目标达成率
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 p-1">
                {annualFulfillment.map((item, idx) => {
                  const prodPercent = Math.min(100, Math.round((item.prodActual / item.prodPlan) * 100));
                  const salesPercent = Math.min(100, Math.round((item.salesActual / item.salesPlan) * 100));
                  
                  return (
                    <div key={idx} className="p-6 flex flex-col gap-6 hover:bg-gray-50/50 transition-colors">
                      <h3 className="text-lg font-bold text-gray-700">{item.category}</h3>
                      
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[13px] font-medium text-gray-600">计划达成率</span>
                          <div className="text-right">
                            <span className="text-xl font-bold text-[#409eff] leading-none">{prodPercent}%</span>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                          <div className="h-full bg-[#409eff] rounded-full" style={{ width: `${prodPercent}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[12px] text-gray-500 font-mono">
                          <span>实际: {item.prodActual}</span>
                          <span>目标: {item.prodPlan} {item.unit}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[13px] font-medium text-gray-600">发货进度</span>
                          <div className="text-right">
                            <span className="text-xl font-bold text-[#67c23a] leading-none">{salesPercent}%</span>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                          <div className="h-full bg-[#67c23a] rounded-full" style={{ width: `${salesPercent}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[12px] text-gray-500 font-mono">
                          <span>实际: {item.salesActual}</span>
                          <span>目标: {item.salesPlan} {item.unit}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            
            {/* ======================================= */}
            {/* 模块三：跨年度产销趋势 (Moved inside annual flow) */}
            {/* ======================================= */}
            <section className="bg-white border border-gray-200 rounded flex flex-col overflow-hidden w-full mt-2">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe]">
                <h2 className="text-[15px] font-bold text-gray-800 flex items-center border-l-4 border-[#e6a23c] pl-3">
                  近三年产销趋势分析透视图
                </h2>
                <select 
                  className="border border-gray-300 rounded px-3 py-1.5 text-[13px] font-medium text-gray-700 outline-none focus:border-[#409eff] focus:ring-1 focus:ring-[#409eff] bg-white cursor-pointer"
                  value={trendCategory}
                  onChange={(e) => setTrendCategory(e.target.value)}
                >
                  <option value="再造烟叶">视角：再造烟叶</option>
                  <option value="再造梗丝">视角：再造梗丝</option>
                  <option value="香精香料">视角：香精香料</option>
                </select>
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-center">
                <div className="relative h-80 w-full mt-4 pr-8">
                  <SvgTrendChart data={filteredTrendData} />
                </div>
                
                <div className="flex justify-center items-center gap-10 mt-10 pb-4">
                  <div className="flex items-center text-[14px] text-gray-600 font-medium"><span className="w-4 h-4 bg-[#409eff] rounded mr-2 "></span>年度生产量</div>
                  <div className="flex items-center text-[14px] text-gray-600 font-medium"><span className="w-4 h-4 bg-[#67c23a] rounded mr-2 "></span>年度销售量</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================= */}
        {/* 模块四：市场库存台账 */}
        {/* ======================================= */}
        {activeTab === 'inventory' && (
          <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
            {/* 顶部分析条件过滤 */}
            <div className="bg-white border border-gray-200 rounded px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center text-[13px] text-gray-700">
                  <span className="mr-2 font-bold whitespace-nowrap">年度:</span>
                  <select 
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#409eff] bg-white min-w-[100px]"
                  >
                    {['2024', '2025', '2026', '2027'].map(y => (
                      <option key={y} value={y}>{y}年</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center text-[13px] text-gray-700">
                  <span className="mr-2 font-bold whitespace-nowrap">月份:</span>
                  <select 
                    value={inventoryMonth}
                    onChange={e => {
                      setInventoryMonth(e.target.value);
                      // In a real app we'd fetch or filter data based on the selected month here
                    }}
                    className="border border-gray-300 rounded px-3 py-1.5 text-[13px] outline-none focus:border-[#409eff] bg-white min-w-[100px]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={`${m}月`}>{m}月</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 图表部分 */}
            <section className="bg-white border border-gray-200 rounded flex flex-col overflow-hidden w-full">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe]">
                <h2 className="text-[15px] font-bold text-gray-800 flex items-center border-l-4 border-[#67c23a] pl-3">
                  {inventoryMonth}市场库存水位偏离度分析图
                </h2>
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-center text-[13px] text-gray-500 mb-2 ml-4">
                  <AlertCircle className="w-4 h-4 mr-1.5" /> 库存水位偏离度分析 (实际与目标的动态关系)
                </div>
                <InventoryDeviationChart data={inventoryData} />
              </div>
            </section>

            {/* 表格部分 */}
            <section className="bg-white border border-gray-200 rounded flex flex-col overflow-hidden w-full">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-[#fcfdfe]">
                <h2 className="text-[15px] font-bold text-gray-800 flex items-center border-l-4 border-[#67c23a] pl-3">
                  {selectedYear}年{inventoryMonth}再造原料产品库存情况汇总表
                </h2>
                <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors h-8 bg-white ">
                  <Download className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> 导出报表
                </button>
              </div>
            
            <div className="flex-1 overflow-x-auto bg-white p-4">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="bg-[#f5f7fa] border-y border-[#ebeef5]">
                  <tr>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] text-center w-12">序号</th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] w-24">种类</th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] w-28">市场</th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] w-32">产品名称</th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] text-right">年度销售目标<br/><span className="text-[10px] font-normal text-gray-400">(吨)</span></th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] text-right">2025年期末库存<br/><span className="text-[10px] font-normal text-gray-400">(吨)</span></th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] text-right">截止上月底产品<br/>生产数量(吨)</th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] text-right">截止上月底产品<br/>发运数量(吨)</th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] border-r border-[#ebeef5] text-right bg-blue-50/30">鑫源公司库存<br/><span className="text-[10px] font-normal text-gray-400">(吨)</span></th>
                    <th className="py-3 px-4 text-[13px] font-bold text-[#606266] text-right bg-orange-50/50 min-w-[140px]">目标市场库存<br/>数量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebeef5]">
                  {inventoryData.map((row) => {
                    const isEditing = editingRows.has(row.id);
                    return (
                      <tr key={row.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="py-3 px-4 text-[13px] text-[#909399] border-r border-[#ebeef5] text-center font-mono">{row.seq}</td>
                        <td className="py-3 px-4 text-[13px] text-[#606266] border-r border-[#ebeef5] font-medium">{row.category}</td>
                        <td className="py-3 px-4 text-[13px] text-[#606266] border-r border-[#ebeef5]">{row.market}</td>
                        <td className="py-3 px-4 text-[13px] font-bold text-[#303133] border-r border-[#ebeef5]">{row.product}</td>
                        
                        <td className="py-3 px-4 text-[13px] text-right font-mono text-[#606266] border-r border-[#ebeef5]">{row.annualTarget}</td>
                        <td className="py-3 px-4 text-[13px] text-right font-mono text-[#606266] border-r border-[#ebeef5]">{row.lastYearStock}</td>
                        <td className="py-3 px-4 text-[13px] text-right font-mono text-[#606266] border-r border-[#ebeef5]">{row.prodUpToLastMonth}</td>
                        <td className="py-3 px-4 text-[13px] text-right font-mono text-[#606266] border-r border-[#ebeef5]">{row.shippedUpToLastMonth}</td>
                        <td className="py-3 px-4 text-[14px] text-right font-bold font-mono text-[#409eff] border-r border-[#ebeef5] bg-blue-50/10">
                          {row.companyStock.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-right bg-orange-50/10 relative group">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <input 
                                type="number"
                                autoFocus
                                className="w-24 text-right border border-[#e6a23c] rounded px-2 py-1.5 text-[14px] font-bold text-gray-700 outline-none ring-2 ring-[#e6a23c]/20 bg-white "
                                value={row.targetMarketStock}
                                onChange={(e) => handleTargetStockChange(row.id, e.target.value)}
                                onBlur={() => toggleEditRow(row.id)}
                                onKeyDown={(e) => e.key === 'Enter' && toggleEditRow(row.id)}
                              />
                              <button 
                                className="p-1.5 text-[#67c23a] hover:bg-green-50 rounded transition-colors"
                                title="确认保存"
                                onMouseDown={(e) => e.preventDefault()} 
                                onClick={() => toggleEditRow(row.id)}
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2 pr-1">
                              <span className="text-[15px] font-bold text-gray-800 font-mono">
                                {row.targetMarketStock}
                              </span>
                              <button 
                                onClick={() => toggleEditRow(row.id)}
                                className="p-1.5 text-gray-400 hover:text-[#e6a23c] opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-orange-50"
                                title="编辑库存"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
          </div>
        )}

      </div>
    </div>
  );
}
