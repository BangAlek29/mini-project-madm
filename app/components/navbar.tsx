import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
      darkMode 
        ? 'bg-slate-900/95 backdrop-blur-sm border-slate-700' 
        : 'bg-white/95 backdrop-blur-sm border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                : 'bg-gradient-to-br from-indigo-600 to-purple-600'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </div>
            <div>
              <h1 className={`text-lg md:text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                DSS MADM
              </h1>
              <p className={`text-xs hidden md:block ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Decision Support System
              </p>
            </div>
          </div>

          {/* Navigation Items & Theme Toggle */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 md:p-3 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-indigo-600'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
