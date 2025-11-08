import React from 'react';

const CEFRChart: React.FC = () => {
    const levels = [
        { level: 'A1', color: 'bg-red-400' },
        { level: 'A2', color: 'bg-orange-400' },
        { level: 'B1', color: 'bg-yellow-400' },
        { level: 'B2', color: 'bg-green-400' },
        { level: 'C1', color: 'bg-blue-400' },
    ];

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 text-center">CEFR Levels</h4>
            <div className="flex items-end h-24 space-x-2">
                {levels.map((item, index) => (
                    <div key={item.level} className="flex-1 flex flex-col items-center justify-end">
                        <div
                            className={`${item.color} w-full rounded-t-sm`}
                            style={{ height: `${20 * (index + 1)}%` }}
                            title={item.level}
                        ></div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">{item.level}</p>
                    </div>
                ))}
            </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                The Common European Framework of Reference for Languages.
            </p>
        </div>
    );
};

export default CEFRChart;
