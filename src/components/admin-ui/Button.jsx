import React from "react";

const Button = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button"
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-[#111111] text-[#FAFAFA] border border-[#111111] hover:bg-[#666666] hover:border-[#666666] disabled:bg-gray-300 disabled:border-gray-300",
    outline:
      "bg-transparent text-[#111111] border border-black/20 hover:bg-[#111111] hover:text-[#FAFAFA] hover:border-[#111111]",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-mono font-bold tracking-wider uppercase transition-colors duration-200 ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
