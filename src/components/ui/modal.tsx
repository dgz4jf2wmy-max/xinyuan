import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-full",
};

export function Modal({ isOpen, onClose, title, children, footer, className, maxWidth = "md" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={cn("bg-white rounded-lg shadow-lg w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]", maxWidthMap[maxWidth], className)}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

