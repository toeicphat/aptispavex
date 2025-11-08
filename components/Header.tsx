
import React from 'react';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <Logo />
          <span className="text-2xl font-bold text-primary dark:text-white">APTIS Pavex</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
