import React from 'react';
import { Modal } from '../../../../components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { mockExperimentalProgressData } from '../../../../data/plan/experimentalProgressData';
import { cn } from '../../../../lib/utils';

interface ProjectProgressConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectProgressConfirmDialog: React.FC<ProjectProgressConfirmDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="试验信息完善进度"
      maxWidth="5xl"
      className="p-0 border-none shadow-2xl overflow-hidden"
    >
      <div className="flex flex-col h-full bg-white rounded-lg">
        <div className="px-6 py-3 bg-[#f8f9fb] border-b border-gray-200">
          <p className="text-xs text-gray-500 font-medium">查看并确认各试验项目的相关信息填报进度</p>
        </div>

        <div className="p-4 overflow-x-auto overflow-y-auto max-h-[70vh]">
          <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm min-w-[2200px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fcfcfc] hover:bg-[#fcfcfc] border-b border-gray-200 whitespace-nowrap">
                  <TableHead className="w-16 text-center font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">序号</TableHead>
                  <TableHead className="w-32 text-center font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">产品类型</TableHead>
                  <TableHead className="w-40 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">生产类型</TableHead>
                  <TableHead className="w-40 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">产品名称</TableHead>
                  <TableHead className="w-40 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">产品编号</TableHead>
                  <TableHead className="w-40 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">客户名称</TableHead>
                  <TableHead className="w-40 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">牌号</TableHead>
                  <TableHead className="w-32 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">完善需填报表单</TableHead>
                  <TableHead className="w-24 text-center font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">是否已填报</TableHead>
                  <TableHead className="w-32 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">试验信息填报人</TableHead>
                  <TableHead className="w-32 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">填报人所属部门</TableHead>
                  <TableHead className="w-24 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">规格</TableHead>
                  <TableHead className="w-16 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">单位</TableHead>
                  <TableHead className="w-32 text-right font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">需求量</TableHead>
                  <TableHead className="w-32 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">期望完成时间</TableHead>
                  <TableHead className="w-32 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">到货时间</TableHead>
                  <TableHead className="w-48 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">到货地点</TableHead>
                  <TableHead className="w-32 font-bold text-gray-700 h-10 py-0 text-xs border-r border-gray-200">申请人</TableHead>
                  <TableHead className="w-32 font-bold text-gray-700 h-10 py-0 text-xs">申请人部门</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExperimentalProgressData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-blue-50/10 border-b border-gray-200 last:border-0 transition-colors whitespace-nowrap">
                    <TableCell className="text-center py-2.5 text-xs text-gray-600 border-r border-gray-200">{item.sequenceNumber}</TableCell>
                    <TableCell className="text-center py-2.5 text-xs text-gray-600 border-r border-gray-200">{item.productType}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600 border-r border-gray-200">{item.productionType}</TableCell>
                    <TableCell className="py-2.5 text-xs font-bold text-gray-800 border-r border-gray-200">{item.productName}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600 border-r border-gray-200">{item.productCode}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-600 border-r border-gray-200">{item.customerName}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-700 font-medium border-r border-gray-200">{item.brandGrade}</TableCell>
                    <TableCell className="py-2.5 border-r border-gray-200">
                      <span className="text-xs bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-200">
                        {item.formToFill}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-center border-r border-gray-200">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        item.isFilled 
                          ? "bg-green-50 text-green-600 border border-green-200" 
                          : "bg-red-50 text-red-600 border border-red-200"
                      )}>
                        {item.isFilled ? '是' : '否'}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-700 font-medium border-r border-gray-200">{item.reporter}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-500 border-r border-gray-200">{item.reporterDepartment}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-500 border-r border-gray-200">{item.specification}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-500 border-r border-gray-200">{item.unit}</TableCell>
                    <TableCell className="py-2.5 text-right text-xs font-bold text-gray-800 border-r border-gray-200">{item.requirementAmount.toFixed(2)}</TableCell>
                    <TableCell className="py-2.5 text-xs text-blue-600 border-r border-gray-200">{item.expectedCompletionDate}</TableCell>
                    <TableCell className="py-2.5 text-xs text-orange-600 border-r border-gray-200">{item.deliveryDate}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-500 border-r border-gray-200">{item.deliveryLocation}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-700 font-medium border-r border-gray-200">{item.applicantName}</TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-500">{item.applicantDepartment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-all font-medium text-sm shadow-sm active:scale-95"
          >
            取 消
          </button>
          <button 
            onClick={() => {
              alert('进度已同步！');
              onClose();
            }}
            className="px-6 py-2 bg-[#409eff] text-white rounded-md hover:bg-[#66b1ff] transition-all font-medium text-sm shadow-md active:scale-95"
          >
            同步进度
          </button>
        </div>
      </div>
    </Modal>
  );
};
