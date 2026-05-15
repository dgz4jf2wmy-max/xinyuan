import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { ApprovalProcessTimeline } from "../../../../components/ui/approval-process";
import { VerticalFlowchart } from "../../../../components/ui/vertical-flowchart";
import {
  getTempBlendingDetail,
  mockTempBlendingApprovalProcess,
} from "../../../../data/production/execution/tempBlendingDetailData";

export default function TempBlendingDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"form" | "flow">("form");

  const detail = getTempBlendingDetail(id || "");

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          {/* 页面主内容区 */}
          <div className="flex-1 flex flex-col overflow-hidden border border-[#ebeef5] bg-white rounded-sm">
            {/* 选项卡 */}
            <div className="flex-shrink-0">
              <Tabs
                value={activeTab}
                onValueChange={(val: any) => setActiveTab(val)}
                variant="card"
              >
                <TabsList>
                  <TabsTrigger value="form">临时回掺申请</TabsTrigger>
                  <TabsTrigger value="flow">流程图</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto relative bg-white">
              {activeTab === "form" && (
                <div className="space-y-10 p-6">
                  {/* 表单数据 */}
                  <div className="bg-white">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-end items-center text-sm text-[#606266] mb-2">
                        <span>凭证编号: {detail?.applicationNo || "暂无"}</span>
                      </div>

                      <div className="w-full">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              申请编号
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.applicationNo}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              申请状态
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.status}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              月度生产任务编号
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.monthlyTaskNo}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              产品名称
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.productName}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              产品编号
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.productCode}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">牌号</span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.brand}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              生产类型
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.productionType}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              回掺数量
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133] font-bold text-[#409eff]">
                              {detail?.blendingQuantity?.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              回掺比例
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133] font-bold text-[#409eff]">
                              {detail?.blendingRatio?.toFixed(2)}
                              {detail?.blendingRatio ? "%" : ""}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              申请人
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.applicant}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm text-[#909399]">
                              创建时间
                            </span>
                            <div className="px-3 py-2 bg-[#f5f7fa] border border-[#e4e7ed] rounded text-sm text-[#303133]">
                              {detail?.createdAt}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 审批过程 */}
                  <div className="w-full border-t border-[#ebeef5] pt-8 mt-8">
                    <div className="text-base font-bold text-[#303133] mb-6 pl-2 border-l-4 border-[#409eff]">
                      过程审批信息
                    </div>
                    <ApprovalProcessTimeline
                      data={mockTempBlendingApprovalProcess}
                    />
                  </div>
                </div>
              )}

              {activeTab === "flow" && (
                <div className="py-6">
                  <VerticalFlowchart
                    steps={[
                      {
                        id: 1,
                        title: "草稿中(质量管理员/技术中心)",
                        isActive:
                          detail?.status === "草稿中" || !detail?.status,
                      },
                      {
                        id: 2,
                        title: "待审核(部门负责人/技术中心)",
                        isActive: detail?.status === "待审核",
                      },
                      {
                        id: 3,
                        title: "待确认(工艺员/生产管理处)",
                        isActive: detail?.status === "待确认",
                      },
                      {
                        id: 4,
                        title:
                          detail?.status === "已拒绝" ? "已拒绝" : "已同意",
                        isActive:
                          detail?.status === "已同意" ||
                          detail?.status === "已拒绝",
                      },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* 底部按钮区 (固定在容器底部) */}
            <div className="p-4 border-t border-[#ebeef5] bg-white flex items-center justify-end gap-4 shrink-0 relative z-10">
              <Button
                variant="outline"
                className="border-[#f56c6c] text-[#f56c6c] hover:bg-[#fef0f0] bg-white px-6"
              >
                拒绝
              </Button>
              <Button
                type="button"
                className="bg-[#67c23a] hover:bg-[#85ce61] text-white px-6 min-w-[80px]"
              >
                同意
              </Button>
              <Button
                type="button"
                className="bg-[#409eff] hover:bg-[#66b1ff] text-white px-6 min-w-[80px]"
                onClick={() => navigate(-1)}
              >
                返 回
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
