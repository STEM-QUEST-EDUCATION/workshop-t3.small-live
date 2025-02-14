import { ChevronsDown } from "lucide-react";
import Image from "next/image";

interface StepIndicatorProps {
  step: number;
  title: string;
}

const StepIndicator = ({ step, title }: StepIndicatorProps) => (
  <div className="bg-white rounded-lg shadow-md p-2 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center"
          style={{
            backgroundImage:
              "linear-gradient(99.82deg, rgba(239, 113, 143, 0.4) 1.29%, rgba(254, 224, 2, 0.4) 98.34%)",
          }}
        >
          <Image
            src="/icons/Flag-filled.svg"
            alt="Flag Icon"
            width={21} // Adjust the size as needed
            height={20}
            className="w-6 h-6"
          />
          <span className="text-xs font-medium ">Step {step}</span>
        </div>
        <h2 className="text-lg xs:text-base xxs:text-sm custom-font font-medium">
          {title}
        </h2>
      </div>
      <ChevronsDown
        className="w-8 h-8 text-blue-gl animate-bounce-custom blue-gl"
        strokeWidth={2}
      />
    </div>
  </div>
);

export default StepIndicator;
