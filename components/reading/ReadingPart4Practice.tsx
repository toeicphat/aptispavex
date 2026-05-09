
import React, { useState, useEffect } from 'react';
import { readingPart4Data, ReadingPart4Set } from '../../lib/readingPart4Data';

type Mode = 'menu' | 'practice' | 'test';
type Tool = 'cursor' | 'highlight' | 'eraser';

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const CursorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l2.559 9.549a1 1 0 101.932-.518L6.672 1.911z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3.328 1.911a1 1 0 10-1.932.518l5.5 20.519a1 1 0 001.932-.518l-5.5-20.52z" clipRule="evenodd" />
        <path d="M10 12l2-2 4 4-6 6-4-4 4-4z" />
        {/* Simple cursor shape representation */}
        <path d="M5.5 3.5l3 11 2.5-3.5L14.5 15 16 13.5l-3.5-3.5 3.5-2.5-11-3z" />
    </svg>
);

const HighlightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const EraserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ReadingPart4Practice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mode, setMode] = useState<Mode>('menu');
    const [practiceSet, setPracticeSet] = useState<ReadingPart4Set[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
    const [showResult, setShowResult] = useState(false);
    
    // Tools State
    const [activeTool, setActiveTool] = useState<Tool>('cursor');
    const [modifiedParagraphs, setModifiedParagraphs] = useState<{ [key: number]: string[] }>({});

    // Timer for Test Mode
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes for long reading
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: number | undefined;
        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            alert("Time's up!");
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startPractice = () => {
        setMode('practice');
        setPracticeSet([...readingPart4Data]); // Sequential
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setIsActive(false);
        setActiveTool('cursor');
        setModifiedParagraphs({});
    };

    const startTest = () => {
        setMode('test');
        
        // 1. Shuffle the order of the topics (sets)
        const shuffledSets = shuffleArray([...readingPart4Data]);

        // 2. For each set, shuffle questions and paragraphs (keeping instruction first)
        const randomizedData = shuffledSets.map(set => {
            // Shuffle questions
            const shuffledQuestions = shuffleArray([...set.questions]);

            // Shuffle paragraphs, but preserve the first one (Instruction)
            // Assuming paragraphs[0] is always the instruction text
            let shuffledParagraphs = [...set.paragraphs];
            if (shuffledParagraphs.length > 1) {
                const instruction = shuffledParagraphs[0];
                const contentParagraphs = shuffledParagraphs.slice(1);
                const shuffledContent = shuffleArray(contentParagraphs);
                shuffledParagraphs = [instruction, ...shuffledContent];
            }

            return {
                ...set,
                questions: shuffledQuestions,
                paragraphs: shuffledParagraphs
            };
        });

        setPracticeSet(randomizedData);
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setTimeLeft(30 * 60);
        setIsActive(true);
        setActiveTool('cursor');
        setModifiedParagraphs({});
    };

    const handleAnswerSelect = (questionId: string, answer: string) => {
        if (showResult && mode === 'practice') return; // Prevent changing in practice after check
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const checkResult = () => {
        setShowResult(true);
    };

    const nextQuestion = () => {
        if (currentIndex < practiceSet.length - 1) {
            setCurrentIndex(currentIndex + 1);
            if (mode === 'practice') setShowResult(false);
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            if (mode === 'practice') setShowResult(false);
        }
    };

    // Calculate score for current set or total test
    const calculateScore = (dataset: ReadingPart4Set) => {
        let score = 0;
        dataset.questions.forEach(q => {
            if (userAnswers[q.id] === q.correctAnswer) score++;
        });
        return score;
    };

    const getCurrentParagraphs = () => {
        const currentSet = practiceSet[currentIndex];
        return modifiedParagraphs[currentSet.id] || currentSet.paragraphs;
    };

    const handleHighlight = (e: React.MouseEvent, pIndex: number) => {
        if (activeTool !== 'highlight') return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
        
        // Ensure selection is inside the target paragraph
        const pElement = e.currentTarget as HTMLElement;
        if (!pElement.contains(selection.anchorNode) || !pElement.contains(selection.focusNode)) return;

        try {
            const range = selection.getRangeAt(0);
            
            const mark = document.createElement('mark');
            mark.className = "bg-yellow-200 dark:bg-yellow-700 text-inherit rounded-sm cursor-pointer";
            
            range.surroundContents(mark);
            selection.removeAllRanges();

            // Update state with new HTML
            const currentSet = practiceSet[currentIndex];
            const currentParas = getCurrentParagraphs();
            const newParas = [...currentParas];
            newParas[pIndex] = pElement.innerHTML;
            
            setModifiedParagraphs(prev => ({
                ...prev,
                [currentSet.id]: newParas
            }));
        } catch (err) {
            console.warn("Highlight selection crossed element boundaries - unsupported in this simplified mode.");
        }
    };

    const handleEraser = (e: React.MouseEvent, pIndex: number) => {
        if (activeTool !== 'eraser') return;
        const target = e.target as HTMLElement;
        // Check if clicked target is a highlight mark
        if (target.tagName.toLowerCase() === 'mark') {
            const pElement = e.currentTarget as HTMLElement;
            const parent = target.parentNode;
            if (parent) {
                // Unwrap the mark
                while (target.firstChild) {
                    parent.insertBefore(target.firstChild, target);
                }
                parent.removeChild(target);
                
                // Update state with new HTML
                const currentSet = practiceSet[currentIndex];
                const currentParas = getCurrentParagraphs();
                const newParas = [...currentParas];
                newParas[pIndex] = pElement.innerHTML;
                
                setModifiedParagraphs(prev => ({
                    ...prev,
                    [currentSet.id]: newParas
                }));
            }
        }
    };

    if (mode === 'menu') {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center">
                <button
                    onClick={onBack}
                    className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors absolute top-6 left-6"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back
                </button>
                <h2 className="text-3xl font-bold text-dark dark:text-white mt-12">Reading Part 4: Long Text Comprehension</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-8">Read the text and answer 7 questions about 4 people's opinions.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <button onClick={startPractice} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-primary group">
                        <h3 className="text-2xl font-bold text-primary group-hover:text-dark dark:group-hover:text-white mb-2">Luyện tập (Practice Mode)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Practice questions in order. Immediate feedback available.</p>
                    </button>

                    <button onClick={startTest} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary group">
                        <h3 className="text-2xl font-bold text-secondary group-hover:text-dark dark:group-hover:text-white mb-2">Test ngẫu nhiên (Random Test)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Questions & Paragraphs shuffled. 30-minute timer. Check results at the end.</p>
                    </button>
                </div>
            </div>
        );
    }

    const currentSet = practiceSet[currentIndex];
    const currentParagraphs = getCurrentParagraphs();

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl min-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-slate-700">
                <button onClick={() => setMode('menu')} className="text-sm text-slate-500 hover:text-dark dark:hover:text-white flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                     Back to Menu
                </button>
                <div className="flex items-center gap-4">
                     <span className="text-sm font-bold text-slate-500">Topic: {currentSet.topic}</span>
                    {mode === 'test' && (
                        <div className="text-xl font-bold text-red-600 font-mono bg-red-50 px-3 py-1 rounded">
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-grow grid lg:grid-cols-2 gap-8">
                {/* Left Column: Text */}
                <div className="lg:pr-4 lg:border-r border-slate-200 dark:border-slate-700 overflow-y-auto max-h-[75vh]">
                    {/* Toolbar */}
                    <div className="flex gap-2 mb-4 sticky top-0 bg-white dark:bg-slate-800 z-10 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-500 uppercase mr-2 self-center">Tools:</span>
                        <button 
                            onClick={() => setActiveTool('cursor')}
                            className={`p-2 rounded flex items-center gap-1 transition-all ${activeTool === 'cursor' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Select / Read"
                        >
                            <CursorIcon /> <span className="text-xs font-medium">Read</span>
                        </button>
                        <button 
                            onClick={() => setActiveTool('highlight')}
                            className={`p-2 rounded flex items-center gap-1 transition-all ${activeTool === 'highlight' ? 'bg-yellow-400 text-slate-900 shadow-md' : 'text-slate-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600'}`}
                            title="Highlight Text (Select text to highlight)"
                        >
                            <HighlightIcon /> <span className="text-xs font-medium">Highlight</span>
                        </button>
                        <button 
                            onClick={() => setActiveTool('eraser')}
                            className={`p-2 rounded flex items-center gap-1 transition-all ${activeTool === 'eraser' ? 'bg-red-500 text-white shadow-md' : 'text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'}`}
                            title="Remove Highlight (Click on highlighted text)"
                        >
                            <EraserIcon /> <span className="text-xs font-medium">Eraser</span>
                        </button>
                    </div>

                    <div className="prose dark:prose-invert max-w-none space-y-4">
                        {currentParagraphs.map((para, idx) => (
                            <p 
                                key={idx} 
                                onMouseUp={(e) => handleHighlight(e, idx)}
                                onClick={(e) => handleEraser(e, idx)}
                                className={`text-slate-800 dark:text-slate-200 leading-relaxed text-justify 
                                    ${activeTool === 'highlight' ? 'cursor-text selection:bg-yellow-200 selection:text-black' : ''} 
                                    ${activeTool === 'eraser' ? 'cursor-pointer' : ''}`}
                                dangerouslySetInnerHTML={{ __html: para }}
                            ></p>
                        ))}
                    </div>
                </div>

                {/* Right Column: Questions */}
                <div className="flex flex-col h-full overflow-y-auto max-h-[75vh]">
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-4 sticky top-0 bg-white dark:bg-slate-800 py-2 z-10">Questions</h3>
                    <div className="space-y-6 flex-grow">
                        {currentSet.questions.map((q, qIdx) => {
                            const selected = userAnswers[q.id];
                            const isCorrect = selected === q.correctAnswer;
                            
                            return (
                                <div key={q.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{qIdx + 1}. {q.text}</p>
                                    <div className="flex gap-4">
                                        <select 
                                            value={selected || ""}
                                            onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                                            className={`
                                                block w-full max-w-[120px] p-2 rounded border 
                                                ${showResult 
                                                    ? (isCorrect 
                                                        ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                        : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200')
                                                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                                                }
                                                focus:ring-primary focus:border-primary
                                            `}
                                            disabled={showResult && mode === 'test'} // Disable in test review
                                        >
                                            <option value="">Select...</option>
                                            {q.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        
                                        {/* Result Indicator */}
                                        {showResult && (
                                            <div className="flex items-center">
                                                {isCorrect ? (
                                                    <span className="text-green-600 font-bold flex items-center">
                                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        Correct
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 font-bold flex items-center">
                                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        Ans: {q.correctAnswer}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky bottom-0">
                         {showResult && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
                                <p className="text-lg font-bold text-primary">Score: {calculateScore(currentSet)} / 7</p>
                            </div>
                        )}
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={prevQuestion} 
                                disabled={currentIndex === 0}
                                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Previous
                            </button>
                            
                            {!showResult ? (
                                <button 
                                    onClick={checkResult}
                                    className="flex-grow px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition-colors"
                                >
                                    {mode === 'test' && currentIndex < practiceSet.length - 1 ? 'Review Current (Or go Next)' : (mode === 'test' ? 'Submit Test' : 'Check Answers')}
                                </button>
                            ) : (
                                <button 
                                    onClick={() => { setShowResult(false); setUserAnswers({}); }} // Reset for retry in practice
                                    className={`flex-grow px-6 py-2 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-600 ${mode === 'test' ? 'hidden' : ''}`}
                                >
                                    Try Again
                                </button>
                            )}

                            <button 
                                onClick={nextQuestion} 
                                disabled={currentIndex === practiceSet.length - 1}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadingPart4Practice;
