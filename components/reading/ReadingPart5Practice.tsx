
import React, { useState, useEffect } from 'react';
import { readingPart5Data, ReadingPart5Set } from '../../lib/readingPart5Data';

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

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const LightBulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const ReadingPart5Practice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mode, setMode] = useState<Mode>('menu');
    const [practiceSet, setPracticeSet] = useState<ReadingPart5Set[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({}); 
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    
    // Tools State
    const [activeTool, setActiveTool] = useState<Tool>('cursor');
    const [modifiedParagraphs, setModifiedParagraphs] = useState<{ [key: number]: string[] }>({});
    const [showText, setShowText] = useState(true);
    const [showTip, setShowTip] = useState(false); // State for "Mẹo"

    // Timer for Test Mode
    const [timeLeft, setTimeLeft] = useState(30 * 60); 
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

    useEffect(() => {
        if (practiceSet.length > 0) {
            if (currentIndex < practiceSet.length) {
                setShuffledOptions(shuffleArray([...practiceSet[currentIndex].headings]));
            }
        }
    }, [currentIndex, practiceSet]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startPractice = () => {
        setMode('practice');
        setPracticeSet([...readingPart5Data]); // Sequential order
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setIsActive(false);
        setActiveTool('cursor');
        setModifiedParagraphs({});
        setShowText(true);
        setShowTip(false);
    };

    const startTest = () => {
        setMode('test');
        setPracticeSet(shuffleArray([...readingPart5Data])); // Shuffle topics
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setTimeLeft(30 * 60);
        setIsActive(true);
        setActiveTool('cursor');
        setModifiedParagraphs({});
        setShowText(true);
        setShowTip(false);
    };

    const handleAnswerSelect = (paragraphIndex: number, heading: string) => {
        if (showResult && mode === 'practice') return;
        setUserAnswers(prev => ({
            ...prev,
            [paragraphIndex]: heading
        }));
    };

    const checkResult = () => {
        setShowResult(true);
        setShowText(true); // Always show text when checking results
    };

    const nextQuestion = () => {
        if (currentIndex < practiceSet.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswers({});
            if (mode === 'practice') {
                setShowResult(false);
                setShowTip(false);
            }
            setShowText(true);
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setUserAnswers({});
            if (mode === 'practice') {
                setShowResult(false);
                setShowTip(false);
            }
            setShowText(true);
        }
    };

    const calculateScore = (dataset: ReadingPart5Set) => {
        let score = 0;
        dataset.paragraphs.forEach((_, idx) => {
            const correctHeading = dataset.headings[idx];
            if (userAnswers[idx] === correctHeading) score++;
        });
        return score;
    };

    const getCurrentParagraphs = () => {
        if (practiceSet.length === 0) return [];
        const currentSet = practiceSet[currentIndex];
        return modifiedParagraphs[currentSet.id] || currentSet.paragraphs;
    };

    const handleHighlight = (e: React.MouseEvent, pIndex: number) => {
        if (activeTool !== 'highlight') return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
        
        const pElement = e.currentTarget as HTMLElement;
        if (!pElement.contains(selection.anchorNode) || !pElement.contains(selection.focusNode)) return;

        try {
            const range = selection.getRangeAt(0);
            const mark = document.createElement('mark');
            mark.className = "bg-yellow-200 dark:bg-yellow-700 text-inherit rounded-sm cursor-pointer";
            range.surroundContents(mark);
            selection.removeAllRanges();

            const currentSet = practiceSet[currentIndex];
            const currentParas = getCurrentParagraphs();
            const newParas = [...currentParas];
            newParas[pIndex] = pElement.innerHTML;
            
            setModifiedParagraphs(prev => ({
                ...prev,
                [currentSet.id]: newParas
            }));
        } catch (err) {
            console.warn("Highlight selection error");
        }
    };

    const handleEraser = (e: React.MouseEvent, pIndex: number) => {
        if (activeTool !== 'eraser') return;
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'mark') {
            const pElement = e.currentTarget as HTMLElement;
            const parent = target.parentNode;
            if (parent) {
                while (target.firstChild) {
                    parent.insertBefore(target.firstChild, target);
                }
                parent.removeChild(target);
                
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
                <h2 className="text-3xl font-bold text-dark dark:text-white mt-12">Reading Part 5: Matching Headings</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-8">Match the correct heading to each paragraph.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <button onClick={startPractice} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-primary group">
                        <h3 className="text-2xl font-bold text-primary group-hover:text-dark dark:group-hover:text-white mb-2">Luyện tập (Practice Mode)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Practice topics in order. Immediate feedback available.</p>
                    </button>

                    <button onClick={startTest} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary group">
                        <h3 className="text-2xl font-bold text-secondary group-hover:text-dark dark:group-hover:text-white mb-2">Test ngẫu nhiên (Random Test)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Topics and options are shuffled. 30-minute timer.</p>
                    </button>
                </div>
            </div>
        );
    }

    const currentSet = practiceSet[currentIndex];
    if (!currentSet) return <div>Loading...</div>;
    
    const currentParagraphs = getCurrentParagraphs();

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl min-h-[90vh] flex flex-col">
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

            <div className="mb-4 flex gap-2 justify-end sticky top-0 z-20 bg-white dark:bg-slate-800 py-2 border-b border-slate-100 dark:border-slate-700">
                {mode === 'practice' && (
                    <button 
                        onClick={() => setShowTip(!showTip)}
                        className={`px-3 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors ${showTip ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200'}`}
                    >
                        <LightBulbIcon /> <span>Mẹo</span>
                    </button>
                )}
                <div className="w-px bg-slate-200 dark:bg-slate-600 mx-2"></div>
                <button 
                    onClick={() => setShowText(!showText)}
                    className={`px-3 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors ${!showText ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200'}`}
                >
                    {showText ? <><EyeOffIcon /> <span>Ẩn đoạn văn</span></> : <><EyeIcon /> <span>Hiện đoạn văn</span></>}
                </button>
                <div className="w-px bg-slate-200 dark:bg-slate-600 mx-2"></div>
                <button onClick={() => setActiveTool('cursor')} className={`p-2 rounded flex items-center gap-1 ${activeTool === 'cursor' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`} title="Read Mode"><CursorIcon /></button>
                <button onClick={() => setActiveTool('highlight')} className={`p-2 rounded flex items-center gap-1 ${activeTool === 'highlight' ? 'bg-yellow-400 text-black' : 'text-slate-500 hover:bg-yellow-50'}`} title="Highlight Text"><HighlightIcon /></button>
                <button onClick={() => setActiveTool('eraser')} className={`p-2 rounded flex items-center gap-1 ${activeTool === 'eraser' ? 'bg-red-500 text-white' : 'text-slate-500 hover:bg-red-50'}`} title="Eraser"><EraserIcon /></button>
            </div>

            {showTip && mode === 'practice' && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg animate-fade-in">
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                        <LightBulbIcon /> Mẹo làm bài & Từ khóa (Tips & Keywords)
                    </h4>
                    <div className="text-slate-700 dark:text-slate-300 space-y-2">
                        <p><strong>Từ khóa (Keywords):</strong> {currentSet.keywords || "No specific keywords provided for this topic."}</p>
                        <p><strong>Mẹo (Tip):</strong> {currentSet.tip || "Look for synonyms between headings and paragraph content."}</p>
                    </div>
                </div>
            )}

            <div className="flex-grow space-y-8">
                {currentParagraphs.map((para, idx) => {
                    const selected = userAnswers[idx];
                    const isCorrect = selected === currentSet.headings[idx];
                    
                    return (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col sm:flex-row gap-4 mb-3">
                                <div className="flex-shrink-0">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold">{idx + 1}</span>
                                </div>
                                <div className="flex-grow">
                                    <select 
                                        value={selected || ""}
                                        onChange={(e) => handleAnswerSelect(idx, e.target.value)}
                                        className={`
                                            w-full p-2 rounded border font-medium
                                            ${showResult 
                                                ? (isCorrect 
                                                    ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                    : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200')
                                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-white'
                                            }
                                            focus:ring-primary focus:border-primary
                                        `}
                                        disabled={showResult && mode === 'test'}
                                    >
                                        <option value="">Choose a heading...</option>
                                        {shuffledOptions.map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    
                                    {showResult && !isCorrect && (
                                        <p className="mt-2 text-sm text-red-600 font-semibold">Correct Answer: {currentSet.headings[idx]}</p>
                                    )}
                                </div>
                            </div>
                            
                            {showText ? (
                                <div 
                                    className={`text-slate-800 dark:text-slate-200 leading-relaxed text-justify pl-12 
                                        ${activeTool === 'highlight' ? 'cursor-text selection:bg-yellow-200 selection:text-black' : ''} 
                                        ${activeTool === 'eraser' ? 'cursor-pointer' : ''}`}
                                    onMouseUp={(e) => handleHighlight(e, idx)}
                                    onClick={(e) => handleEraser(e, idx)}
                                    dangerouslySetInnerHTML={{ __html: para }}
                                ></div>
                            ) : (
                                <div className="pl-12 py-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 italic border border-dashed border-slate-300 dark:border-slate-700">
                                    <EyeOffIcon />
                                    <span className="ml-2">Paragraph Hidden</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky bottom-0">
                 {showResult && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-primary">Score: {calculateScore(currentSet)} / {currentSet.paragraphs.length}</p>
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
    );
};

export default ReadingPart5Practice;
