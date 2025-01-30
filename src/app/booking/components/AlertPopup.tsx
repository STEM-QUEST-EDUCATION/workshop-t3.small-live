import React, { useState } from 'react';
import Image from "next/image";

interface AlertPopupProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ onClose, onConfirm, message }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleCancelClick = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match the duration of the animation
  };

  const handleDoneClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className={`bg-white w-96 h-auto p-6 rounded-lg relative flex flex-col items-center transform transition-transform duration-300 ${isClosing ? 'animate-slide-up-out' : 'animate-slide-up'
          }`}
      >
        <Image
          src="/icons/Robot.svg"
          alt=" "
          width={34}
          height={34}
        />
        <h2 className="text-xl font-bold mb-2">Are you sure!</h2>
        <p className="text-gray-600 mb-6 text-center">
          {message}
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleCancelClick}
            className="bg-blue-100 text-blue-500 py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDoneClick}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;

