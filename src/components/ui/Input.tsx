import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 w-full focus:ring-green-500 focus:border-green-500 ${className}`}
      {...props}
    />
  );
};

export default Input;
