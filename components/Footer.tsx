
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 text-center text-slate-500 dark:text-slate-400">
        <p>&copy; {currentYear} APTIS Pavex. All rights reserved.</p>
        <p className="text-sm mt-1">Your dedicated platform for APTIS ESOL preparation.</p>
      </div>
    </footer>
  );
};

export default Footer;
