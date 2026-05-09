
import React from 'react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, icon, onClick, disabled }) => {
  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
      relative
      bg-white dark:bg-slate-800 
      rounded-xl 
      shadow-lg 
      p-6 
      w-full max-w-sm
      flex flex-col items-center text-center 
      transform transition-all duration-300 
      border border-transparent
      ${disabled 
        ? 'opacity-40 grayscale cursor-not-allowed' 
        : 'hover:scale-105 hover:shadow-2xl hover:border-secondary cursor-pointer'}
    `}>
      {disabled && (
        <div className="absolute top-4 right-4">
          <span className="bg-slate-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wider">
            Coming Soon
          </span>
        </div>
      )}
      
      <div className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm">
        {description}
      </p>
    </div>
  );
};

export default SectionCard;
