
import React from 'react';
import Logo from './Logo';

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onHomeClick}>
          <Logo />
          <span className="text-2xl font-bold text-primary dark:text-white">APTIS Pavex</span>
        </div>
        <nav>
            <button 
                onClick={onHomeClick} 
                className="font-medium text-primary dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors px-4 py-2 rounded-lg"
                aria-label="Go to home page"
            >
                Home
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
