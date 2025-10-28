import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, icon, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </div>
        )}
        <input
          id={id}
          className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
