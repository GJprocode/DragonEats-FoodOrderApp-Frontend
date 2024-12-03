import React from "react";

interface BusinessTypeFilterProps {
  selectedBusinessType: string[];
  onChange: (selectedBusinessType: string[]) => void;
  onReset: () => void;  // Reset the business type filter
}

const BusinessTypeFilter = ({ selectedBusinessType, onChange, onReset }: BusinessTypeFilterProps) => {
  const handleChange = (type: string) => {
    const isSelected = selectedBusinessType.includes(type);
    if (isSelected) {
      onChange(selectedBusinessType.filter((t) => t !== type)); // Remove the selected type
    } else {
      onChange([...selectedBusinessType, type]); // Add the selected type
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold mb-2">Business Type</h3>
        <div
          onClick={onReset}
          className="text-sm font-semibold mb-2 underline cursor-pointer text-blue-500"
        >
          Reset Filters
        </div>
      </div>
      <div className="flex flex-col">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={selectedBusinessType.includes("Restaurant")}
            onChange={() => handleChange("Restaurant")}
          />
          Restaurant
        </label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={selectedBusinessType.includes("Wholesale")}
            onChange={() => handleChange("Wholesale")}
          />
          Wholesale
        </label>
      </div>
    </div>
  );
};

export default BusinessTypeFilter;
