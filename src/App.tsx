/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { MobileEmulatorLayout } from "./components/layout/MobileEmulatorLayout";
import MobileHome from "./pages/mobile/index";
import MobileDemo1 from "./pages/mobile/demo1";
import MobileDemo2 from "./pages/mobile/demo2";
import MobileAgingTaskPage from "./pages/mobile/aging-task/index";
import MobileAgingTaskDetailPage from "./pages/mobile/aging-task-detail/index";
import MobileShiftHandoverPage from "./pages/mobile/shift-handover/index";
import MobileShiftHandoverDetailPage from "./pages/mobile/shift-handover-detail/index";
import MobileHandoverLogDetail from "./pages/mobile/handover-log-detail/index";
import MobileForemanShiftHandoverPage from "./pages/mobile/foreman-shift-handover/index";
import PreProcessHandoverLogPage from "./pages/mobile/preprocess-handover-log/index";
import Home from "./pages/home";
import UserManagement from "./pages/system/user";
import RoleManagement from "./pages/system/role";
import PositionManagement from "./pages/system/position";
import AnnualPlan from "./pages/plan/annual";
import AnnualPlanCreate from "./pages/plan/annual/create";
import AnnualPlanDetail from "./pages/plan/annual/detail";
import AnnualPlanAdjust from "./pages/plan/annual/adjust";
import ProductionPoolList from "./pages/plan/pool";
import PlanPoolApplicationList from "./pages/plan/application";
import CustomerLedger from "./pages/customer/index";
import SubBrandLedger from "./pages/base/sub-brand/index";
import ProductionTypeManagement from "./pages/base/production-type/index";

import MonthlyProductionPlanIndex from "./pages/plan/monthly";
import MonthlyProductionPlanCreate from "./pages/plan/monthly/create";
import AgeingPlanCreate from "./pages/plan/monthly/aging/create";
import MonthlyProductionPlanDetailView from "./pages/plan/monthly/detail";
import MonthlyProductionPlanAdjust from "./pages/plan/monthly/adjust";
import AgeingPlanDetail from "./pages/plan/monthly/aging/detail";
import AgeingPlanAdjust from "./pages/plan/monthly/aging/adjust";
import PlanExecutionAnalysis from "./pages/plan/execution/analysis";
import PlanExecutionDashboard from "./pages/plan/execution/dashboard";

import TeamShiftsPage from "./pages/production/scheduling/shifts";
import TeamSchedulePage from "./pages/production/scheduling/schedule";
import SchedulePlanCreate from "./pages/production/scheduling/schedule/create";
import SchedulePlanDetail from "./pages/production/scheduling/schedule/detail";
import SchedulePlanEdit from "./pages/production/scheduling/schedule/edit";

import MonthlyProductionTaskPage from "./pages/production/execution/monthly-task";
import MonthlyTaskDetailView from "./pages/production/execution/monthly-task/detail";
import MonthlyProductionDashboardPage from "./pages/production/execution/monthly-dashboard";
import TempBlendingProcessPage from "./pages/production/execution/temp-blending";
import MonthlyTaskBuilder from "./pages/production/execution/monthly-task/builder";
import TempBlendingDetailView from "./pages/production/execution/temp-blending/detail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mobile" element={<MobileEmulatorLayout />}>
          <Route index element={<MobileHome />} />
          <Route path="demo1" element={<MobileDemo1 />} />
          <Route path="demo2" element={<MobileDemo2 />} />
          <Route path="shift-handover" element={<MobileShiftHandoverPage />} />
          <Route path="foreman-shift-handover" element={<MobileForemanShiftHandoverPage />} />
          <Route path="shift-handover/detail/:id" element={<MobileShiftHandoverDetailPage />} />
          <Route path="shift-handover/log-detail/:id" element={<MobileHandoverLogDetail />} />
          <Route path="preprocess-handover-log" element={<PreProcessHandoverLogPage />} />
          <Route path="aging-task" element={<MobileAgingTaskPage />} />
          <Route
            path="aging-task/detail/:id"
            element={<MobileAgingTaskDetailPage />}
          />
        </Route>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Home />} />
          <Route path="plan/annual" element={<AnnualPlan />} />
          <Route path="plan/annual/create" element={<AnnualPlanCreate />} />
          <Route path="plan/annual/detail/:id" element={<AnnualPlanDetail />} />
          <Route path="plan/annual/adjust/:id" element={<AnnualPlanAdjust />} />
          <Route path="plan/monthly" element={<MonthlyProductionPlanIndex />} />
          <Route
            path="plan/monthly/create"
            element={<MonthlyProductionPlanCreate />}
          />
          <Route
            path="plan/monthly/adjust/:id"
            element={<MonthlyProductionPlanAdjust />}
          />
          <Route
            path="plan/monthly/detail/:id"
            element={<MonthlyProductionPlanDetailView />}
          />
          <Route
            path="plan/monthly/aging/create"
            element={<AgeingPlanCreate />}
          />
          <Route
            path="plan/monthly/aging/adjust/:id"
            element={<AgeingPlanAdjust />}
          />
          <Route
            path="plan/monthly/aging/detail/:id"
            element={<AgeingPlanDetail />}
          />
          <Route path="plan/pool" element={<ProductionPoolList />} />
          <Route
            path="plan/application"
            element={<PlanPoolApplicationList />}
          />
          <Route
            path="plan/execution/analysis"
            element={<PlanExecutionAnalysis />}
          />
          <Route
            path="plan/execution/dashboard"
            element={<PlanExecutionDashboard />}
          />
          <Route
            path="production/scheduling/shifts"
            element={<TeamShiftsPage />}
          />
          <Route
            path="production/scheduling/schedule"
            element={<TeamSchedulePage />}
          />
          <Route
            path="production/scheduling/schedule/create"
            element={<SchedulePlanCreate />}
          />
          <Route
            path="production/scheduling/schedule/detail/:id"
            element={<SchedulePlanDetail />}
          />
          <Route
            path="production/scheduling/schedule/edit/:id"
            element={<SchedulePlanEdit />}
          />
          <Route
            path="production/execution/monthly-task"
            element={<MonthlyProductionTaskPage />}
          />
          <Route
            path="production/execution/monthly-task/detail/:id"
            element={<MonthlyTaskDetailView />}
          />
          <Route
            path="production/execution/monthly-task/builder"
            element={<MonthlyTaskBuilder />}
          />
          <Route
            path="production/execution/monthly-dashboard"
            element={<MonthlyProductionDashboardPage />}
          />
          <Route
            path="production/execution/temp-blending"
            element={<TempBlendingProcessPage />}
          />
          <Route
            path="production/execution/temp-blending/detail/:id"
            element={<TempBlendingDetailView />}
          />
          <Route path="customer/ledger" element={<CustomerLedger />} />
          <Route path="base/sub-brand" element={<SubBrandLedger />} />
          <Route
            path="base/production-type"
            element={<ProductionTypeManagement />}
          />
          <Route path="system/user" element={<UserManagement />} />
          <Route path="system/role" element={<RoleManagement />} />
          <Route path="system/position" element={<PositionManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
