import React, { useMemo } from 'react';
import { PackageSearch, ClipboardList, Clock, User, FileBox } from 'lucide-react';
import { getPCLabelingTasksByBrand, getPCRecordsByTaskNo } from '../../../../data/production/execution/labelingTaskPCData';
import { cn } from '../../../../lib/utils';

interface LabelingTaskDetailPCProps {
  brandCode: string;
}

export default function LabelingTaskDetailPC({ brandCode }: LabelingTaskDetailPCProps) {
  const tasks = useMemo(() => {
    return getPCLabelingTasksByBrand(brandCode);
  }, [brandCode]);

  if (tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[#909399]">
        暂无贴标任务数据
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6 bg-[#f5f7fa]">
      {tasks.map(task => {
        const records = getPCRecordsByTaskNo(task.taskNo);
        const percent = Math.min(100, task.requiredVolume > 0 ? Math.round((task.appliedCompletionVolume / task.requiredVolume) * 100) : 0);

        return (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border border-[#e4e7ed] overflow-hidden">
            {/* Task Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#e4e7ed] bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#ecf5ff] text-[#409eff] flex items-center justify-center">
                  <PackageSearch className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#303133]">{task.subBrandCode}</h3>
                  <span className="text-xs text-[#909399] font-mono">{task.taskNo}</span>
                </div>
              </div>
              <div className="w-[300px]">
                <div className="flex justify-between items-end mb-1.5 text-xs">
                  <span className="font-medium text-[#606266]">申请完工量</span>
                  <div>
                    <span className="text-[#409eff] font-bold text-sm mr-1">{task.appliedCompletionVolume.toFixed(2)}</span>
                    <span className="text-[#909399]">/ {task.requiredVolume.toFixed(2)} {task.unit}</span>
                  </div>
                </div>
                <div className="w-full bg-[#ebeef5] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#409eff] h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-5">
              <h4 className="flex items-center text-sm font-bold text-[#303133] mb-4">
                <div className="w-1 h-3.5 bg-[#409eff] rounded-sm mr-2"></div>
                基本信息
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[13px]">
                <div>
                  <div className="text-[#909399] mb-1">产品类型</div>
                  <div className="text-[#303133]">{task.productType}</div>
                </div>
                <div>
                  <div className="text-[#909399] mb-1">牌号</div>
                  <div className="text-[#303133]">{task.brandCode}</div>
                </div>
                <div>
                  <div className="text-[#909399] mb-1">规格</div>
                  <div className="text-[#303133]">{task.specification}</div>
                </div>
                <div>
                  <div className="text-[#909399] mb-1">初始需求量</div>
                  <div className="text-[#303133]">{task.initialRequiredVolume} {task.unit}</div>
                </div>
                <div>
                  <div className="text-[#909399] mb-1">到货地点</div>
                  <div className="text-[#303133]">{task.arrivalLocation}</div>
                </div>
                <div>
                  <div className="text-[#909399] mb-1">到货时间</div>
                  <div className="text-[#303133]">{task.arrivalTime}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[#909399] mb-1">期望完成时间</div>
                  <div className="text-[#303133]">{task.expectedCompletionTime}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
