
import React from 'react';
import SectionCard from './SectionCard';

const PartIcon: React.FC<{ part: string }> = ({ part }) => (
    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
        {part}
    </div>
);

const readingParts = [
    {
        id: 1,
        title: 'Part 1',
        description: 'Choose the correct word to complete the sentence.',
        icon: <PartIcon part="1" />,
    },
    {
        id: 2,
        title: 'Part 2 & 3',
        description: 'Order sentences to make a story & Match people to opinions.',
        icon: <PartIcon part="2&3" />,
    },
    {
        id: 3,
        title: 'Part 4',
        description: 'Read a long text and answer questions.',
        icon: <PartIcon part="4" />,
    },
    {
        id: 4,
        title: 'Part 5',
        description: 'Match headings to paragraphs.',
        icon: <PartIcon part="5" />,
    },
];

interface ReadingPracticeProps {
    onBack: () => void;
    onNavigateToPart1: () => void;
    onNavigateToPart2And3: () => void;
    onNavigateToPart4: () => void;
    onNavigateToPart5: () => void;
}

const ReadingPractice: React.FC<ReadingPracticeProps> = ({ onBack, onNavigateToPart1, onNavigateToPart2And3, onNavigateToPart4, onNavigateToPart5 }) => {

    const handlePartClick = (partId: number) => {
        if (partId === 1) {
            onNavigateToPart1();
        } else if (partId === 2) {
            onNavigateToPart2And3();
        } else if (partId === 3) {
            onNavigateToPart4();
        } else if (partId === 4) {
            onNavigateToPart5();
        } else {
            alert(`Reading Part ${partId} is coming soon!`);
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
                <h2 className="text-4xl md:text-5xl font-extrabold text-dark dark:text-white">Reading Practice</h2>
                <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    The Reading test is divided into four parts. Select one to begin your practice.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {readingParts.map((part) => (
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

export default ReadingPractice;
