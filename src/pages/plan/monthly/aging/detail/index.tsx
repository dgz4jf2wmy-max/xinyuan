import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GitPullRequest, Download } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { MonthlyAgingPlan } from "../../../../../types/monthly-plan";
import { mockMonthlyAgingPlans } from "../../../../../data/plan/agingPlanData";
import {
  mockMonthlyAgingVersionHistory,
  mockMonthlyAgingApprovalProcess,
  getMonthlyAgingVersionDetails,
} from "../../../../../data/plan/monthlyAgingPlanDetailData";
import { ApprovalProcessTimeline } from "../../../../../components/ui/approval-process";
import { VerticalFlowchart } from "../../../../../components/ui/vertical-flowchart";
import { ExportPreviewModal } from "./ExportPreviewModal";
import clsx from "clsx";

export default function AgeingPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MonthlyAgingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "flow">("form");
  const [isComparing, setIsComparing] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState("v2.0");
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);

  useEffect(() => {
    // 模拟数据加载
    const foundPlan = mockMonthlyAgingPlans.find(
      (p) => p.sequenceNumber === Number(id),
    ) || {
      sequenceNumber: Number(id) || 1,
      planName: "2026年6月月度醇化计划",
      status: "已发布",
      creator: "张建国",
      createTime: "2026-06-25 10:30:00",
    };
    setPlan(foundPlan);
  }, [id]);

  const versionDetails = getMonthlyAgingVersionDetails(selectedVersionId);
  const initialDetails = getMonthlyAgingVersionDetails("v1.0");

  // 渲染版本历史
  const renderVersionHistory = () => {
    const coreVersions = mockMonthlyAgingVersionHistory.filter(
      (v) =>
        v.isInitial || v.isCurrent || v.isDraft || v.id === selectedVersionId,
    );
    const visibleVersions = showAllVersions
      ? mockMonthlyAgingVersionHistory
      : coreVersions;

    return (
      <div className="w-[200px] border border-[#ebeef5] rounded-sm flex flex-col h-full shrink-0 bg-white">
        <div className="p-4 border-b border-[#ebeef5] text-sm text-[#303133] font-medium bg-[#f5f7fa]">
          版本历史
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="relative border-l-2 border-[#ebeef5] ml-3 space-y-6">
            {mockMonthlyAgingVersionHistory.map((version, index) => {
              const isVisible = visibleVersions.includes(version);
              const isCore = coreVersions.includes(version);
              const prevWasNotCore =
                index > 0 &&
                !coreVersions.includes(
                  mockMonthlyAgingVersionHistory[index - 1],
                );

              if (!isVisible) return null;

              return (
                <React.Fragment key={version.id}>
                  {isCore && prevWasNotCore && (
                    <div className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-[#ebeef5] bg-[#ebeef5]"></div>
                      <button
                        className="text-xs text-[#909399] hover:text-[#409eff] underline transition-colors"
                        onClick={() => setShowAllVersions(!showAllVersions)}
                      >
                        {showAllVersions ? "收起中间版本" : "展开所有版本"}
                      </button>
                    </div>
                  )}

                  <div
                    className="relative pl-6 cursor-pointer group"
                    onClick={() => setSelectedVersionId(version.id)}
                  >
                    <div
                      className={clsx(
                        "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white transition-colors",
                        selectedVersionId === version.id
                          ? "border-[#409eff]"
                          : "border-[#c0c4cc] group-hover:border-[#409eff]",
                      )}
                    >
                      {selectedVersionId === version.id && (
                        <div className="absolute inset-[2px] rounded-full bg-[#409eff]" />
                      )}
                    </div>

                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-2 w-full pr-2">
                        <span
                          className={clsx(
                            "font-medium",
                            selectedVersionId === version.id
                              ? "text-[#409eff]"
                              : "text-[#303133]",
                          )}
                        >
                          {version.versionNo}
                        </span>
                        {version.isCurrent && (
                          <span className="text-[10px] bg-[#ecf5ff] text-[#409eff] px-1 py-0.5 rounded leading-none shrink-0 border border-[#b3d8ff]">
                            当前生效
                          </span>
                        )}
                        {version.isInitial && (
                          <span className="text-[10px] bg-[#f4f4f5] text-[#909399] px-1 py-0.5 rounded leading-none shrink-0 border border-[#e9e9eb]">
                            初始版本
                          </span>
                        )}
                        {version.isDraft && (
                          <span className="text-[10px] bg-[#fdf6ec] text-[#e6a23c] px-1 py-0.5 rounded leading-none shrink-0 border border-[#faecd8]">
                            草稿
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#909399] mt-1">
                        {version.createdAt}
                      </span>
                      <span className="text-xs text-[#909399]">
                        {version.createdBy}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 整理数据结构以支持 rowSpan
  const renderRows = useMemo(() => {
    const list = versionDetails;
    let currentBrand = "";

    return list.map((item, index) => {
      let rowSpanGroup = 0;
      if (item.brandName !== currentBrand) {
        currentBrand = item.brandName;
        // count how many items have this brand
        rowSpanGroup = list.filter((i) => i.brandName === currentBrand).length;
      }

      // 寻找用来对比的 initial 数据
      const initItem = initialDetails.find(
        (d) =>
          d.brandName === item.brandName &&
          d.subBrandGrade === item.subBrandGrade &&
          d.month === item.month,
      );

      return {
        ...item,
        rowSpanGroup,
        initialBoxCount: initItem?.boxCount,
      };
    });
  }, [versionDetails, initialDetails]);

  const renderFormData = () => {
    const isInitialVersionView = selectedVersionId === "v1.0";

    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-bold text-[#303133]">
            {plan?.planName || '2026年6月月度醇化计划'}
          </div>
          <Button
            variant={isComparing ? "primary" : "outline"}
            size="sm"
            onClick={() => setIsComparing(!isComparing)}
          >
            <GitPullRequest className="w-4 h-4 mr-1" />
            {isComparing ? "退出对比" : "版本对比"}
          </Button>
        </div>

        {isComparing && (
          <div className="bg-[#fdf6ec] text-[#e6a23c] p-2 rounded text-sm mb-2 border border-[#faecd8]">
            当前正在进行 <strong>与初始版本 (V1.0)</strong>{" "}
            的数据对比。黄色标签为初始版本的数据。
          </div>
        )}

        <div className="border border-[#ebeef5] rounded overflow-hidden">
          <Table className="border-collapse w-full">
            <TableHeader className="bg-[#f5f7fa]">
              <TableRow>
                <TableHead className="w-16 text-center text-[#303133] font-bold border-r border-[#ebeef5]">
                  序号
                </TableHead>
                <TableHead className="w-28 text-center text-[#303133] font-bold border-r border-[#ebeef5]">
                  总牌号和等级
                </TableHead>
                <TableHead className="w-20 text-center text-[#303133] font-bold border-r border-[#ebeef5]">
                  年月份
                </TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold border-r border-[#ebeef5]">
                  分牌号和等级
                </TableHead>
                <TableHead className="w-28 text-center text-[#409eff] font-bold border-r border-[#ebeef5]">
                  箱数
                </TableHead>
                <TableHead className="w-40 text-center text-[#303133] font-bold border-r border-[#ebeef5]">
                  日期
                </TableHead>
                <TableHead className="w-32 text-center text-[#303133] font-bold border-r border-[#ebeef5]">
                  码段计划号
                </TableHead>
                <TableHead className="w-48 text-center text-[#303133] font-bold">
                  备注
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows.map((row, idx) => (
                <TableRow
                  key={row.sequenceNumber}
                  className="hover:bg-gray-50 border-b border-[#ebeef5]"
                >
                  {row.rowSpanGroup > 0 && (
                    <>
                      <TableCell
                        rowSpan={row.rowSpanGroup}
                        className="text-center bg-white border-r border-[#ebeef5]"
                      >
                        {/* 自动计算品牌组序号 */}
                        {
                          renderRows.filter(
                            (r, i) => i <= idx && r.rowSpanGroup > 0,
                          ).length
                        }
                      </TableCell>
                      <TableCell
                        rowSpan={row.rowSpanGroup}
                        className="text-center font-bold text-[#303133] bg-white border-r border-[#ebeef5]"
                      >
                        {row.brandName}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-center text-[#606266] border-r border-[#ebeef5]">
                    {row.month}
                  </TableCell>
                  <TableCell className="text-center text-[#303133] border-r border-[#ebeef5]">
                    {row.subBrandGrade}
                  </TableCell>

                  <TableCell className="text-center align-middle border-r border-[#ebeef5]">
                    <div
                      className={clsx(
                        "text-[#409eff]",
                        isComparing && "font-bold mb-1",
                      )}
                    >
                      {row.boxCount}
                    </div>
                    {isComparing && (
                      <div className="text-[10px] text-[#e6a23c] bg-[#fdf6ec] px-1 rounded inline-block border border-[#faecd8]">
                        初始: {row.initialBoxCount || "-"}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-center text-[#606266] border-r border-[#ebeef5]">
                    {row.date}
                  </TableCell>
                  <TableCell className="text-center text-[#909399] border-r border-[#ebeef5]">
                    {row.sectionPlanNumber || "/"}
                  </TableCell>
                  <TableCell className="text-center text-[#606266]">
                    {row.remarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {renderRows.length === 0 && (
            <div className="py-12 text-center text-gray-400 font-sans">
              暂无数据
            </div>
          )}
        </div>
      </div>
    );
  };

  const flowchartSteps = [
    { id: 1, title: "草稿中(计划管理员)" },
    { id: 2, title: "已发布(计划管理员)", isActive: true },
    { id: 3, title: "结束" },
  ];

  return (
    <div className="flex h-full w-full gap-4 items-stretch p-4 bg-gray-50/30">
      {/* 左侧版本历史 */}
      {renderVersionHistory()}

      {/* 右侧主体内容 */}
      <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm">
        {/* 选项卡 */}
        <div className="flex-shrink-0">
          <Tabs
            value={activeTab}
            onValueChange={(val: any) => setActiveTab(val)}
            variant="card"
          >
            <TabsList>
              <TabsTrigger value="form">月度醇化计划</TabsTrigger>
              <TabsTrigger value="flow">流程图</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 内容区 */}
        <div className={clsx("flex-1 overflow-y-auto relative p-6")}>
          {activeTab === "form" && (
            <div className="space-y-10">
              {/* 表单数据 */}
              <div className="bg-white">{renderFormData()}</div>

              {/* 审批过程 */}
              <div className="border-t border-[#ebeef5] pt-8 mt-8">
                <div className="text-base font-bold text-[#303133] mb-6 pl-2 border-l-4 border-[#409eff]">
                  过程审批信息
                </div>
                <ApprovalProcessTimeline
                  data={mockMonthlyAgingApprovalProcess}
                />
              </div>
            </div>
          )}

          {activeTab === "flow" && (
            <div className="py-4">
              <VerticalFlowchart steps={flowchartSteps} />
            </div>
          )}
        </div>

        {/* 底部按钮区 */}
        <div className="p-4 border-t border-[#ebeef5] bg-white flex items-center justify-end gap-4 shrink-0 relative z-10">
          <Button
            variant="outline"
            className="border-[#409eff] text-[#409eff] hover:bg-[#ecf5ff] bg-white px-6"
            onClick={() => setIsExportPreviewOpen(true)}
          >
            导出
          </Button>
          <Button
            type="button"
            className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 min-w-[80px]"
            onClick={() => navigate("/plan/monthly")}
          >
            返 回
          </Button>
        </div>
      </div>

      <ExportPreviewModal
        isOpen={isExportPreviewOpen}
        onClose={() => setIsExportPreviewOpen(false)}
        versionId={selectedVersionId}
        planName={plan?.planName || "2026年6月月度醇化计划"}
      />
    </div>
  );
}
