import React from "react";
import { useSidebar } from "./SidebarContext";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      onClick={toggleMobileSidebar}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs xl:hidden"
    ></div>
  );
};

export default Backdrop;
