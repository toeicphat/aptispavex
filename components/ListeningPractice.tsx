import React from 'react';

type ListeningPracticeProps = {
  onBack: () => void;
  onNavigateTo1_13: () => void;
  onNavigateTo14: () => void;
};

export default function ListeningPractice({ onBack, onNavigateTo1_13, onNavigateTo14 }: ListeningPracticeProps) {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <button
                onClick={onBack}
                className="mb-8 flex items-center text-slate-500 hover:text-primary transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Menu
            </button>
            
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-dark dark:text-white">Listening Practice</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    Develop your listening comprehension across different formats and topics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={onNavigateTo1_13}
                    className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-primary text-left group"
                >
                    <h3 className="text-2xl font-bold text-primary group-hover:text-dark dark:group-hover:text-white mb-2">Question 1-13</h3>
                    <p className="text-slate-500 dark:text-slate-400">Listen to short recordings and identify specific information.</p>
                </button>
                <button
                    onClick={onNavigateTo14}
                    className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-primary text-left group"
                >
                    <h3 className="text-2xl font-bold text-primary group-hover:text-dark dark:group-hover:text-white mb-2">Question 14</h3>
                    <p className="text-slate-500 dark:text-slate-400">Listen to extended monologues.</p>
                </button>
                <button
                    onClick={() => alert("Coming soon!")}
                    className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 text-left opacity-70"
                >
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-2">Question 15</h3>
                    <p className="text-slate-500 dark:text-slate-400">Listen to conversations and answer questions.</p>
                </button>
                <button
                    onClick={() => alert("Coming soon!")}
                    className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 text-left opacity-70"
                >
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-2">Question 16-17</h3>
                    <p className="text-slate-500 dark:text-slate-400">Listen to longer extended monologues.</p>
                </button>
            </div>
        </div>
    );
}
