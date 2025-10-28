import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        className="w-full h-40 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        {...props}
      ></textarea>
    </div>
  );
};

export default TextArea;
