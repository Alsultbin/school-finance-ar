import React, { useState, useContext } from 'react';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { LanguageContext } from '../../contexts/LanguageContext';

const Layout = ({ children }) => {
  const { direction } = useContext(LanguageContext);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex" dir={direction}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 ${isMobileSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setIsMobileSidebarOpen(false)}></div>
        <div className="relative">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <NavBar toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
