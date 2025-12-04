import React from 'react';
import { Star } from 'lucide-react';
import { GUIDELINES } from '../../utils/constants';

const GuidelinesBox = () => {
  return (
    <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
        <Star className="w-5 h-5" /> Guidelines
      </h3>
      <ul className="space-y-2">
        {GUIDELINES.map((guideline, idx) => (
          <li key={idx} className="text-green-900 flex items-start gap-2">
            <span className="text-red-600 font-bold">•</span>
            <span>{guideline}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuidelinesBox;