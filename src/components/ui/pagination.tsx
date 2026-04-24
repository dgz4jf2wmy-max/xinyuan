import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
}

export function Pagination({ total, pageSize, current, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  
  if (totalPages <= 0) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-start px-2 py-3 text-[13px] text-[#606266]">
      <div className="mr-4">
        共 {total} 条
      </div>
      <div className="mr-4 flex items-center">
        <select 
          className="border border-[#dcdfe6] rounded-[3px] px-2 py-1 bg-white focus:outline-none focus:border-[#409eff] text-[13px]"
          value={pageSize}
          onChange={() => {}} // 预留切换 pageSize 的接口
        >
          <option value="10">10条/页</option>
          <option value="20">20条/页</option>
          <option value="50">50条/页</option>
        </select>
      </div>
      <div className="flex items-center space-x-1 mr-4">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="p-1 rounded-[3px] bg-[#f4f4f5] text-[#606266] hover:text-[#409eff] disabled:opacity-50 disabled:cursor-not-allowed border-none min-w-[28px] h-7 flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`min-w-[28px] h-7 px-2 text-[13px] rounded-[3px] font-medium ${
              current === page
                ? 'bg-[#409eff] text-white'
                : 'bg-[#f4f4f5] text-[#606266] hover:text-[#409eff]'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages}
          className="p-1 rounded-[3px] bg-[#f4f4f5] text-[#606266] hover:text-[#409eff] disabled:opacity-50 disabled:cursor-not-allowed border-none min-w-[28px] h-7 flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center">
        前往 
        <input 
          type="number" 
          className="w-[46px] h-7 border border-[#dcdfe6] rounded-[3px] px-1 mx-2 text-center focus:outline-none focus:border-[#409eff] text-[13px]" 
          defaultValue={current}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = parseInt(e.currentTarget.value);
              if (!isNaN(val) && val >= 1 && val <= totalPages) {
                onChange(val);
              }
            }
          }}
        /> 
        页
      </div>
    </div>
  )
}
