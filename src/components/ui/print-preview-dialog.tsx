import React from 'react';
import { Button } from './button';
import clsx from 'clsx';

export interface PrintPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function PrintPreviewDialog({ isOpen, onClose, title = '打印预览', children }: PrintPreviewDialogProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:bg-white print:static print:z-auto print:block">
      {/* 
        This style block handles the core logic for printing:
        It hides everything else in the body, and ONLY shows the .print-safe-area.
        This allows us to leverage browser printing natively while turning the current DOM into a printable state.
      */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-safe-area, .print-safe-area * {
              visibility: visible;
            }
            .print-safe-area {
              position: absolute !important;
              left: 0;
              top: 0;
              width: 100vw;
              min-height: 100vh;
              margin: 0;
              padding: 0;
              background: white;
              overflow: visible !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Main Wrapper Box in Preview Mode */}
      <div className="flex flex-col w-[90vw] max-w-5xl h-[90vh] bg-gray-100 rounded shadow-2xl overflow-hidden print:w-full print:h-auto print:shadow-none print:rounded-none">
        
        {/* Header toolbar (Hidden during actual print) */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0 no-print z-10 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#409eff]">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            {title}
          </h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="px-6 border-[#dcdfe6] text-[#606266] hover:text-[#409eff] hover:border-[#c6e2ff] bg-white">
              取 消
            </Button>
            <Button className="px-6 bg-[#409eff] hover:bg-[#66b1ff] text-white flex items-center gap-1" onClick={handlePrint}>
              打 印
            </Button>
          </div>
        </div>
        
        {/* Content Area (Will be printed) */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center print:overflow-visible print:p-0 print-safe-area bg-[#f5f7fa] print:bg-white">
          <div className="bg-white shadow border border-gray-200 print:shadow-none print:border-none mx-auto w-full max-w-[800px] print:max-w-none print:w-auto relative">
            {children}
          </div>
        </div>
        
      </div>
    </div>
  );
}
