import React from 'react';

const CriteriaInput = ({ criterion, value, onChange, disabled }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Allow empty string for clearing
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    // Convert to number
    const numValue = parseFloat(inputValue);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      return;
    }
    
    // Ensure it's not negative
    if (numValue < 0) {
      onChange('0');
      return;
    }
    
    // Ensure it doesn't exceed maximum
    if (numValue > criterion.max) {
      onChange(criterion.max.toString());
      return;
    }
    
    // Allow the input as-is without rounding during typing
    onChange(inputValue);
  };

  const handleBlur = () => {
    // Only validate and round when user finishes typing (on blur)
    if (value === '' || value === null || value === undefined) {
      return;
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      onChange('');
      return;
    }
    
    // Round to nearest 0.5
    const rounded = Math.round(numValue * 2) / 2;
    
    // Ensure within bounds
    const final = Math.max(0, Math.min(rounded, criterion.max));
    
    onChange(final.toString());
  };

  return (
    <div>
      <label className="block text-lg font-semibold text-gray-800 mb-2">
        {criterion.label} <span className="text-red-600">(Max: {criterion.max})</span>
      </label>
      <input
        type="number"
        min="0"
        max={criterion.max}
        step="0.5"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className="w-full p-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none text-lg disabled:bg-gray-100"
        placeholder={`Enter marks (0-${criterion.max})`}
      />
    </div>
  );
};

export default CriteriaInput;