import React from 'react';
import { MobileListLayout } from "../components/MobileListLayout";
import { mockForemanShiftHandoverData } from "../../../data/mobile/foremanShiftHandoverData";

export default function MobileForemanShiftHandoverPage() {
  return (
    <MobileListLayout title="工段长交接班报工">
      <div className="flex flex-col items-center justify-center p-8 text-slate-500">
        <p>暂无数据</p>
      </div>
    </MobileListLayout>
  );
}
