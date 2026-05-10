
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionCard from './components/SectionCard';
import SpeakingPractice from './components/SpeakingPractice';
import SpeakingPart1Practice from './components/speaking/SpeakingPart1Practice';
import SpeakingPart2Practice from './components/speaking/SpeakingPart2Practice';
import SpeakingPart3Practice from './components/speaking/SpeakingPart3Practice';
import SpeakingPart4Practice from './components/speaking/SpeakingPart4Practice';
import WritingPractice from './components/WritingPractice';
import WritingPart1Practice from './components/writing/WritingPart1Practice';
import WritingPart2And3Practice from './components/writing/WritingPart2And3Practice';
import WritingPart4Practice from './components/writing/WritingPart4Practice';
import WritingFullTestPractice from './components/writing/WritingFullTestPractice';
import ReadingPractice from './components/ReadingPractice';
import ReadingPart1Practice from './components/reading/ReadingPart1Practice';
import ReadingPart2And3Practice from './components/reading/ReadingPart2And3Practice';
import ReadingPart4Practice from './components/reading/ReadingPart4Practice';
import ReadingPart5Practice from './components/reading/ReadingPart5Practice';
import ListeningPractice from './components/ListeningPractice';
import ListeningPart1_13Practice from './components/listening/ListeningPart1_13Practice';
import ListeningPart14Practice from './components/listening/ListeningPart14Practice';
import ListeningPart15Practice from './components/listening/ListeningPart15Practice';
import ListeningPart16_17Practice from './components/listening/ListeningPart16_17Practice';

const ListeningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.75h.01M12 12.75h.01M16 12.75h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ReadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const SpeakingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const WritingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const GrammarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.881 4.002L9.25 6.025m3.5 0l1.369-2.023M15.119 4.002l1.369 2.023m-4.888 0l1.369-2.023M3 21h18M12 6.75h.008v.008H12V6.75z" />
        <path d="M11 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0111 2.25zM12 15.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" />
    </svg>
);

const sections = [
  {
    id: 1,
    title: 'Listening',
    description: 'Enhance your comprehension of spoken English with a variety of audio exercises.',
    icon: <ListeningIcon />,
    isDisabled: false,
  },
  {
    id: 2,
    title: 'Reading',
    description: 'Improve your reading speed and understanding with diverse texts and questions.',
    icon: <ReadingIcon />,
    isDisabled: false,
  },
  {
    id: 3,
    title: 'Speaking',
    description: 'Practice your pronunciation and fluency through interactive speaking tasks.',
    icon: <SpeakingIcon />,
    isDisabled: true, // Faded
  },
  {
    id: 4,
    title: 'Writing',
    description: 'Develop your writing skills with structured exercises for emails, essays, and more.',
    icon: <WritingIcon />,
    isDisabled: true, // Faded
  },
  {
    id: 5,
    title: 'Grammar & Vocabulary',
    description: 'Strengthen your core language skills with targeted grammar and vocabulary drills.',
    icon: <GrammarIcon />,
    isDisabled: true, // Faded
  },
];

type View = 'main' | 'listening' | 'listening1_13' | 'listening14' | 'listening15' | 'listening16_17' | 'speaking' | 'speakingPart1' | 'speakingPart2' | 'speakingPart3' | 'speakingPart4' | 'writing' | 'writingPart1' | 'writingPart2And3' | 'writingPart4' | 'writingFullTest' | 'reading' | 'readingPart1' | 'readingPart2And3' | 'readingPart4' | 'readingPart5';

function App() {
  const [view, setView] = useState<View>('main');

  const handleSectionClick = (section: typeof sections[0]) => {
    if (section.isDisabled) return;

    if (section.title === 'Speaking') {
      setView('speaking');
    } else if (section.title === 'Writing') {
      setView('writing');
    } else if (section.title === 'Reading') {
      setView('reading');
    } else if (section.title === 'Listening') {
      setView('listening');
    } else {
      alert(`The '${section.title}' section is coming soon!`);
    }
  };

  const renderContent = () => {
    switch(view) {
      case 'listening':
        return <ListeningPractice
                  onBack={() => setView('main')}
                  onNavigateTo1_13={() => setView('listening1_13')}
                  onNavigateTo14={() => setView('listening14')}
                  onNavigateTo15={() => setView('listening15')}
                  onNavigateTo16_17={() => setView('listening16_17')}
               />;
      case 'listening1_13':
        return <ListeningPart1_13Practice onBack={() => setView('listening')} />;
      case 'listening14':
        return <ListeningPart14Practice onBack={() => setView('listening')} />;
      case 'listening15':
        return <ListeningPart15Practice onBack={() => setView('listening')} />;
      case 'listening16_17':
        return <ListeningPart16_17Practice onBack={() => setView('listening')} />;
      case 'speaking':
        return <SpeakingPractice 
                  onBack={() => setView('main')} 
                  onNavigateToPart1={() => setView('speakingPart1')} 
                  onNavigateToPart2={() => setView('speakingPart2')}
                  onNavigateToPart3={() => setView('speakingPart3')}
                  onNavigateToPart4={() => setView('speakingPart4')}
               />;
      case 'speakingPart1':
        return <SpeakingPart1Practice onBack={() => setView('speaking')} />;
      case 'speakingPart2':
        return <SpeakingPart2Practice onBack={() => setView('speaking')} />;
      case 'speakingPart3':
        return <SpeakingPart3Practice onBack={() => setView('speaking')} />;
      case 'speakingPart4':
        return <SpeakingPart4Practice onBack={() => setView('speaking')} />;
      case 'writing':
        return <WritingPractice 
                    onBack={() => setView('main')} 
                    onNavigateToPart1={() => setView('writingPart1')} 
                    onNavigateToPart2And3={() => setView('writingPart2And3')}
                    onNavigateToPart4={() => setView('writingPart4')}
                    onNavigateToFullTest={() => setView('writingFullTest')}
                />;
      case 'writingPart1':
        return <WritingPart1Practice onBack={() => setView('writing')} />;
      case 'writingPart2And3':
        return <WritingPart2And3Practice onBack={() => setView('writing')} />;
      case 'writingPart4':
        return <WritingPart4Practice onBack={() => setView('writing')} />;
      case 'writingFullTest':
        return <WritingFullTestPractice onBack={() => setView('writing')} />;
      case 'reading':
        return <ReadingPractice
                  onBack={() => setView('main')}
                  onNavigateToPart1={() => setView('readingPart1')}
                  onNavigateToPart2And3={() => setView('readingPart2And3')}
                  onNavigateToPart4={() => setView('readingPart4')}
                  onNavigateToPart5={() => setView('readingPart5')}
              />;
      case 'readingPart1':
        return <ReadingPart1Practice onBack={() => setView('reading')} />;
      case 'readingPart2And3':
        return <ReadingPart2And3Practice onBack={() => setView('reading')} />;
      case 'readingPart4':
        return <ReadingPart4Practice onBack={() => setView('reading')} />;
      case 'readingPart5':
        return <ReadingPart5Practice onBack={() => setView('reading')} />;
      case 'main':
      default:
        return (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-dark dark:text-white">Welcome to APTIS Pavex</h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                  Your path to success in the APTIS ESOL exam starts here. Select a section to begin your practice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {sections.slice(0,3).map((section) => (
                      <SectionCard 
                        key={section.id} 
                        title={section.title} 
                        description={section.description} 
                        icon={section.icon} 
                        disabled={section.isDisabled}
                        onClick={() => handleSectionClick(section)}
                      />
                  ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center mt-8 lg:w-2/3 lg:mx-auto">
                  {sections.slice(3,5).map((section) => (
                      <SectionCard 
                        key={section.id} 
                        title={section.title} 
                        description={section.description} 
                        icon={section.icon} 
                        disabled={section.isDisabled}
                        onClick={() => handleSectionClick(section)}
                      />
                  ))}
              </div>
            </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header onHomeClick={() => setView('main')} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
