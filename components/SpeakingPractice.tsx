
import React from 'react';
import SectionCard from './SectionCard';

const PartIcon: React.FC<{ part: number }> = ({ part }) => (
    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
        {part}
    </div>
);

const speakingParts = [
    {
        id: 1,
        title: 'Part 1: Interview',
        description: 'Answer questions about yourself, your work, or your studies.',
        icon: <PartIcon part={1} />,
    },
    {
        id: 2,
        title: 'Part 2: Describe & Explain',
        description: 'Describe a picture and answer related questions.',
        icon: <PartIcon part={2} />,
    },
    {
        id: 3,
        title: 'Part 3: Compare',
        description: 'Compare two pictures and answer related questions.',
        icon: <PartIcon part={3} />,
    },
    {
        id: 4,
        title: 'Part 4: Discuss',
        description: 'Discuss abstract topics related to the theme from Part 3.',
        icon: <PartIcon part={4} />,
    },
];

interface SpeakingPracticeProps {
    onBack: () => void;
    onNavigateToPart1: () => void;
    onNavigateToPart2: () => void;
    onNavigateToPart3: () => void;
    onNavigateToPart4: () => void;
}

const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({ onBack, onNavigateToPart1, onNavigateToPart2, onNavigateToPart3, onNavigateToPart4 }) => {

    const handlePartClick = (partId: number) => {
        if (partId === 1) {
            onNavigateToPart1();
        } else if (partId === 2) {
            onNavigateToPart2();
        } else if (partId === 3) {
            onNavigateToPart3();
        } else if (partId === 4) {
            onNavigateToPart4();
        } else {
            alert(`Speaking Part ${partId} is coming soon!`);
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
                <h2 className="text-4xl md:text-5xl font-extrabold text-dark dark:text-white">Speaking Practice</h2>
                <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    The Speaking test is divided into four parts. Select one to begin your practice.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {speakingParts.map((part) => (
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

export default SpeakingPractice;
