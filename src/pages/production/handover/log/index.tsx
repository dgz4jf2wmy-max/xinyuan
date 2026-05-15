import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';

import AllLogs from './components/AllLogs';
import ForemanLogs from './components/ForemanLogs';
import OperatorLogs from './components/OperatorLogs';

export default function HandoverLogPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
          
          {/* 2. 页面主内容区 - Tabs */}
          <div className="flex-1 flex flex-col min-h-0">
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="flex-1 flex flex-col w-full h-full"
            >
              <div className="border-b border-[#e4e7ed] mb-4">
                <TabsList className="bg-transparent h-auto p-0 border-b-0 space-x-8 w-full justify-start">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#409eff] data-[state=active]:text-[#409eff] data-[state=active]:bg-transparent px-1 py-2 font-medium text-[#909399] transition-none"
                  >
                    全部
                  </TabsTrigger>
                  <TabsTrigger 
                    value="foreman" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#409eff] data-[state=active]:text-[#409eff] data-[state=active]:bg-transparent px-1 py-2 font-medium text-[#909399] transition-none"
                  >
                    工段长交接班
                  </TabsTrigger>
                  <TabsTrigger 
                    value="operator" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#409eff] data-[state=active]:text-[#409eff] data-[state=active]:bg-transparent px-1 py-2 font-medium text-[#909399] transition-none"
                  >
                    操作工交接班
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 min-h-0">
                <TabsContent value="all" className="h-full m-0">
                  <AllLogs />
                </TabsContent>
                <TabsContent value="foreman" className="h-full m-0">
                  <ForemanLogs />
                </TabsContent>
                <TabsContent value="operator" className="h-full m-0">
                  <OperatorLogs />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
