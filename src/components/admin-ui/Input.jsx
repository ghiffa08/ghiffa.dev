import React from 'react';

export const Input = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  error = false,
  required = false
}) => {
  let classes = `w-full px-3 py-2 border rounded-none bg-[#FAFAFA] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors duration-200 font-mono text-sm ${
    error ? 'border-red-500' : 'border-[#E5E5E5]'
  } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''} ${className}`;

  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={classes}
    />
  );
};

export const TextArea = ({
  placeholder,
  rows = 3,
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  required = false,
  id,
  name
}) => {
  let classes = `w-full px-3 py-2 border rounded-none bg-[#FAFAFA] text-[#111111] focus:outline-none focus:border-[#111111] transition-colors duration-200 font-mono text-sm ${
    error ? 'border-red-500' : 'border-[#E5E5E5]'
  } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''} ${className}`;

  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={classes}
    />
  );
};
