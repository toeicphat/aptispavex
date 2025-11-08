import React from 'react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
      bg-white dark:bg-slate-800 
      rounded-xl 
      shadow-lg 
      p-6 
      w-full max-w-sm
      flex flex-col items-center text-center 
      transform transition-all duration-300 
      hover:scale-105 hover:shadow-2xl 
      border border-transparent hover:border-secondary
      ${onClick ? 'cursor-pointer' : ''}
    `}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
};

export default SectionCard;