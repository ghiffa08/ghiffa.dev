import React from "react";

const Label = ({ htmlFor, children, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-xs font-bold font-mono tracking-wider text-gray-700 uppercase ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
