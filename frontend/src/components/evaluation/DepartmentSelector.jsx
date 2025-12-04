import React from 'react';

const DepartmentSelector = ({ departments, selectedDept, onSelect, disabled }) => {
  return (
    <div>
      <label className="block text-lg font-semibold text-gray-800 mb-2">
        Select Department
      </label>
      <select
        value={selectedDept}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="w-full p-3 border-2 border-red-300 rounded-lg focus:border-red-600 focus:outline-none text-lg disabled:bg-gray-100"
      >
        <option value="">Choose a department...</option>
        {departments.map(dept => (
          <option 
            key={dept.code} 
            value={dept.code}
            disabled={dept.evaluated > 0}
          >
            {dept.code}  {dept.evaluated > 0 ? '(✓ Evaluated)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DepartmentSelector;
