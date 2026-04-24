import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import ProductionPlanTab from './components/ProductionPlanTab';
import AgeingPlanTab from './components/AgeingPlanTab';

export default function MonthlyPlanIndex() {
  const [activeTab, setActiveTab] = useState('production');

  return (
    <div className="flex flex-col h-full w-full bg-white px-6 pt-2 pb-6">
      <div className="flex-shrink-0 mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="line">
          <TabsList>
            <TabsTrigger value="production">产销计划</TabsTrigger>
            <TabsTrigger value="ageing">醇化计划</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'production' && <ProductionPlanTab />}
        {activeTab === 'ageing' && <AgeingPlanTab />}
      </div>
    </div>
  );
}
