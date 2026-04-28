/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import Home from './pages/home';
import UserManagement from './pages/system/user';
import RoleManagement from './pages/system/role';
import PositionManagement from './pages/system/position';
import AnnualPlan from './pages/plan/annual';
import AnnualPlanCreate from './pages/plan/annual/create';
import AnnualPlanDetail from './pages/plan/annual/detail';
import AnnualPlanAdjust from './pages/plan/annual/adjust';
import ProductionPoolList from './pages/plan/pool';
import PlanPoolApplicationList from './pages/plan/application';
import CustomerLedger from './pages/customer/index';
import SubBrandLedger from './pages/base/sub-brand/index';

import MonthlyProductionPlanIndex from './pages/plan/monthly';
import MonthlyProductionPlanCreate from './pages/plan/monthly/create';
import AgeingPlanCreate from './pages/plan/monthly/aging/create';
import MonthlyProductionPlanDetailView from './pages/plan/monthly/detail';
import AgeingPlanDetail from './pages/plan/monthly/aging/detail';
import PlanExecutionAnalysis from './pages/plan/execution/analysis';
import PlanExecutionDashboard from './pages/plan/execution/dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Home />} />
          <Route path="plan/annual" element={<AnnualPlan />} />
          <Route path="plan/annual/create" element={<AnnualPlanCreate />} />
          <Route path="plan/annual/detail/:id" element={<AnnualPlanDetail />} />
          <Route path="plan/annual/adjust/:id" element={<AnnualPlanAdjust />} />
          <Route path="plan/monthly" element={<MonthlyProductionPlanIndex />} />
          <Route path="plan/monthly/create" element={<MonthlyProductionPlanCreate />} />
          <Route path="plan/monthly/detail/:id" element={<MonthlyProductionPlanDetailView />} />
          <Route path="plan/monthly/aging/create" element={<AgeingPlanCreate />} />
          <Route path="plan/monthly/aging/detail/:id" element={<AgeingPlanDetail />} />
          <Route path="plan/pool" element={<ProductionPoolList />} />
          <Route path="plan/application" element={<PlanPoolApplicationList />} />
          <Route path="plan/execution/analysis" element={<PlanExecutionAnalysis />} />
          <Route path="plan/execution/dashboard" element={<PlanExecutionDashboard />} />
          <Route path="customer/ledger" element={<CustomerLedger />} />
          <Route path="base/sub-brand" element={<SubBrandLedger />} />
          <Route path="system/user" element={<UserManagement />} />
          <Route path="system/role" element={<RoleManagement />} />
          <Route path="system/position" element={<PositionManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
