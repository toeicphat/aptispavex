
import React from 'react';
import SectionCard from './SectionCard';

const PartIcon: React.FC<{ part: number | string }> = ({ part }) => (
    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
        {part}
    </div>
);

const FullTestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const writingParts = [
    {
        id: 1,
        title: 'Part 1',
        description: 'Respond to 5 short messages using single words or short phrases.',
        icon: <PartIcon part={1} />,
    },
    {
        id: 2,
        title: 'Part 2 & 3',
        description: 'Write a short text and respond within a social media conversation.',
        icon: <PartIcon part={"2&3"} />,
    },
    {
        id: 3,
        title: 'Part 4',
        description: 'Write an informal email and a formal email based on given scenarios.',
        icon: <PartIcon part={4} />,
    },
    {
        id: 4,
        title: 'Full Test',
        description: 'Simulate the complete writing test with all parts under timed conditions.',
        icon: <FullTestIcon />,
    },
];

interface WritingPracticeProps {
    onBack: () => void;
    onNavigateToPart1: () => void;
    onNavigateToPart2And3: () => void;
    onNavigateToPart4: () => void;
    onNavigateToFullTest: () => void; // Added for the full test
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ onBack, onNavigateToPart1, onNavigateToPart2And3, onNavigateToPart4, onNavigateToFullTest }) => {

    const handlePartClick = (partId: number) => {
        if (partId === 1) {
            onNavigateToPart1();
        } else if (partId === 2) {
            onNavigateToPart2And3();
        } else if (partId === 3) {
            onNavigateToPart4();
        } else if (partId === 4) { // Handle Full Test click
            onNavigateToFullTest();
        } else {
            alert(`This practice part is coming soon!`);
        }
    };

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Sections
            </button>
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-dark dark:text-white">Writing Practice</h2>
                <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    The Writing test is divided into four parts. Select one to begin your practice.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {writingParts.map((part) => (
                    <SectionCard
                        key={part.id}
                        title={part.title}
                        description={part.description}
                        icon={part.icon}
                        onClick={() => handlePartClick(part.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default WritingPractice;
