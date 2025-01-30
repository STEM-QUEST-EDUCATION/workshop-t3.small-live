"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Discriminated union type for better type safety
type DescriptionContent = 
  | { type: "paragraph"; content: string }
  | { type: "list"; content: string[] };

interface WorkshopDetailsSectionProps {
  description?: DescriptionContent[];
}

const WorkshopDetailsSection = ({
  description = [],
}: WorkshopDetailsSectionProps) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText((prev) => !prev);
  };

  // Improved type safety for shouldShowToggle check
  const shouldShowToggle = description.some((item) => 
    item.type === "paragraph" && item.content.length > 100
  );

  // Helper function to render content based on type
  const renderContent = (item: DescriptionContent, index: number) => {
    switch (item.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-2 text-gray-600">
            {item.content}
          </p>
        );
      case "list":
        return (
          <ul key={index} className="list-disc ml-6 space-y-2">
            {item.content.map((listItem, i) => (
              <li key={i} className="mb-2 text-gray-600 text-xs">
                {listItem}
              </li>
            ))}
          </ul>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-2 mb-4">
        <h2 className="text-base font-semibold custom-font mb-1 mx-3">
          Workshop Details
        </h2>
        <div className="relative">
          <div
            className={`text-xs font-normal text-gray-600 mx-3 transition-all duration-300 ease-in-out ${
              !showFullText ? "max-h-24 overflow-hidden" : ""
            }`}
          >
            {description.map((item, index) => renderContent(item, index))}
          </div>
          {!showFullText && shouldShowToggle && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"
              aria-hidden="true"
            />
          )}
        </div>

        {shouldShowToggle && (
          <Button
            variant="link"
            className="text-blue-500 p-0 text-xs font-normal mb-2 mx-3 hover:text-blue-600"
            onClick={toggleText}
            aria-expanded={showFullText}
          >
            {showFullText ? "View Less" : "View More"}
          </Button>
        )}
      </div>
    </>
  );
};

export default WorkshopDetailsSection;