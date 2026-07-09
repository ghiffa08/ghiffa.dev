import React from 'react';

export const Table = ({ children, className = "" }) => {
  return (
    <div className="w-full overflow-x-auto border border-black/10 rounded-none bg-white">
      <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children, className = "" }) => {
  return (
    <thead className={`bg-[#FAFAFA] border-b border-black/10 font-mono text-xs text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = "" }) => {
  return <tbody className={`divide-y divide-black/10 bg-white ${className}`}>{children}</tbody>;
};

export const TableRow = ({ children, className = "" }) => {
  return <tr className={`hover:bg-gray-50 transition-colors ${className}`}>{children}</tr>;
};

export const TableCell = ({ children, isHeader = false, className = "" }) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={`p-4 text-sm ${isHeader ? "font-bold text-xs uppercase font-mono tracking-wider text-gray-500" : "text-[#111111]"} ${className}`}>
      {children}
    </CellTag>
  );
};
