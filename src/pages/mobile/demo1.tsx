import React from 'react';
import { Button } from '../../components/ui/button';

export default function MobileDemo1() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">申请单详情</h2>
        
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">申请编号</span>
            <span className="text-gray-800 font-medium">LSHC-20260502</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">月度生产任务</span>
            <span className="text-gray-800 font-medium">RW-202605-001</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">产品名称</span>
            <span className="text-gray-800 font-medium">再造烟叶 (省外) JSN08</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">回掺比例</span>
            <span className="text-gray-800 font-medium">2.50%</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 w-full">
        <Button className="w-full bg-[#409eff] hover:bg-[#66b1ff] text-white">通过审批</Button>
        <Button className="w-full bg-[#f56c6c] hover:bg-[#f78989] text-white">拒绝申请</Button>
      </div>
    </div>
  );
}
