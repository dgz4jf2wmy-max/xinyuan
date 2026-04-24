import React, { useMemo } from "react";
import { Modal } from "../../../../../components/ui/modal";
import { Button } from "../../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { getMonthlyAgingVersionDetails } from "../../../../../data/plan/monthlyAgingPlanDetailData";
import { Download } from "lucide-react";
import { MonthlyAgingPlanItem } from "../../../../../types/monthly-plan";
import clsx from "clsx";

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionId: string;
  planName: string;
}

export function ExportPreviewModal({
  isOpen,
  onClose,
  versionId,
  planName,
}: ExportPreviewModalProps) {
  const currentVersionDetails = getMonthlyAgingVersionDetails(versionId);
  const initialVersionDetails = getMonthlyAgingVersionDetails("v1.0");

  // 整理数据结构以支持 rowSpan
  const formatDataForTable = (details: MonthlyAgingPlanItem[]) => {
    let currentBrand = "";

    return details.map((item, index) => {
      let rowSpanGroup = 0;
      if (item.brandName !== currentBrand) {
        currentBrand = item.brandName;
        rowSpanGroup = details.filter(
          (i) => i.brandName === currentBrand,
        ).length;
      }

      return {
        ...item,
        rowSpanGroup,
      };
    });
  };

  const currentRows = useMemo(
    () => formatDataForTable(currentVersionDetails),
    [currentVersionDetails],
  );
  const initialRows = useMemo(
    () => formatDataForTable(initialVersionDetails),
    [initialVersionDetails],
  );

  const handleExport = () => {
    // 模拟导出操作
    alert("导出成功，文件已保存到本地。");
    onClose();
  };

  const renderTable = (rows: any[], title: string, subTitle: string) => (
    <div className="w-full mx-auto p-8 bg-white text-black font-sans mb-8">
      {/* 报表标题 / Header */}
      <h1 className="text-2xl tracking-[0.2em] font-black text-center mb-8 border-b-2 border-black pb-4">
        {title} ({subTitle})
      </h1>

      {/* 报表基础信息列 */}
      <div className="flex justify-between items-end mb-3 text-[13px] font-medium">
        <div>
          <span className="text-gray-700">版本：</span>
          {subTitle}
        </div>
        <div>
          <span className="text-gray-700">制单人员：</span>张建国
        </div>
        <div>
          <span className="text-gray-700">印发时间：</span>2026-04-20 14:15:20
        </div>
      </div>

      {/* 核心高度结构化物理表格 */}
      <table className="w-full border-collapse border border-black mb-8 text-center text-sm">
        <thead>
          <tr className="bg-transparent">
            <th className="border border-black p-2 w-[50px] font-bold">序号</th>
            <th className="border border-black p-2 w-[120px] font-bold">
              总牌号和等级
            </th>
            <th className="border border-black p-2 w-[80px] font-bold">
              年月份
            </th>
            <th className="border border-black p-2 font-bold">分牌号和等级</th>
            <th className="border border-black p-2 w-[100px] font-bold">
              箱数
            </th>
            <th className="border border-black p-2 w-[120px] font-bold">
              日期
            </th>
            <th className="border border-black p-2 w-[100px] font-bold">
              码段计划号
            </th>
            <th className="border border-black p-2 w-[150px] font-bold">
              备注
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.sequenceNumber}>
              {row.rowSpanGroup > 0 && (
                <>
                  <td
                    rowSpan={row.rowSpanGroup}
                    className="border border-black p-2 text-center"
                  >
                    {
                      rows.filter((r, i) => i <= idx && r.rowSpanGroup > 0)
                        .length
                    }
                  </td>
                  <td
                    rowSpan={row.rowSpanGroup}
                    className="border border-black p-2 text-center font-bold"
                  >
                    {row.brandName}
                  </td>
                </>
              )}
              <td className="border border-black p-2">{row.month}</td>
              <td className="border border-black p-2">{row.subBrandGrade}</td>
              <td className="border border-black p-2 align-middle">
                {row.boxCount}
              </td>
              <td className="border border-black p-2">{row.date}</td>
              <td className="border border-black p-2">
                {row.processPlanNumber || "/"}
              </td>
              <td className="border border-black p-2">{row.remarks}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="border border-black p-8 text-center text-gray-400"
              >
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="导出预览"
      maxWidth="5xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            className="bg-[#409eff] hover:bg-[#66b1ff] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            确认导出
          </Button>
        </>
      }
    >
      <div className="p-4 bg-white max-h-[70vh] overflow-y-auto">
        {renderTable(initialRows, planName, "原醇化计划")}
        <div className="h-4 border-b-2 border-dashed border-gray-200 mb-8" />
        {renderTable(currentRows, planName, "现醇化计划")}
      </div>
    </Modal>
  );
}
