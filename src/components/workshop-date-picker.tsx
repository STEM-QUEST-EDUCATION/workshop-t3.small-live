"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { ChevronsDown } from "lucide-react";
import Image from "next/image";

interface WorkshopDatePickerProps {
  stepLabel: string;
  title: string;
}

export default function WorkshopDatePicker({
  stepLabel,
  title,
}: WorkshopDatePickerProps) {
  return (
    <Card>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center bg-[linear-gradient(99.82deg,_rgba(239,_113,_143,_0.4)_1.29%,_rgba(254,_224,_2,_0.4)_98.34%)]">
              <div className="w-3 h-3 sm:w-4 sm:h-4">
                <Image
                  src="/icons/Flag-filled.svg"
                  alt="Flag Icon"
                  width={16}
                  height={16}
                  priority={true} // Optimizes loading for critical images
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium">
                {stepLabel}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-medium">{title}</h2>
            <ChevronsDown
              className="w-6 h-6 sm:w-8 sm:h-8 text-blue-gl animate-bounce-custom mr-0"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
