// components/SidebarToggleLayout.tsx
"use client";
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface SidebarToggleLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function SidebarToggleLayout({
  sidebar,
  main,
  header,
  footer,
}: SidebarToggleLayoutProps) {
  // When true, the sidebar is fully expanded; when false, it collapses.
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Optional Header */}
      {header && <header className="bg-gray-200 p-4">{header}</header>}

      {/* Main Content Area */}
      <div className="flex flex-1">
        <aside
          className={`border-r border-gray-200 bg-white transition-all duration-300 ${
            sidebarExpanded ? "w-2/6" : "w-10"
          }`}
        >
          <div className="relative h-full">
            {/* Toggle Icon placed at the right edge of the sidebar */}
            <button
              onClick={toggleSidebar}
              className="absolute top-14 -right-3 transform -translate-y-1/2 bg-red-400 text-white p-1 rounded-full shadow-lg"
            >
              {sidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
            {/* Render full sidebar content only when expanded */}
            {sidebarExpanded && <div>{sidebar}</div>}
          </div>
        </aside>

        <main className="flex-1 p-4 transition-all duration-300">
          {main}
        </main>
      </div>

      {/* Optional Footer */}
      {footer && <footer className="bg-gray-200 p-4">{footer}</footer>}
    </div>
  );
}
