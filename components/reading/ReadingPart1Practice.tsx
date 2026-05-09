
import React, { useState, useEffect } from 'react';
import { readingPart1Data, readingPart1Data2, ReadingPart1Set } from '../../lib/readingPart1Data';

type Mode = 'menu' | 'practice' | 'practice2' | 'test';

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const ReadingPart1Practice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mode, setMode] = useState<Mode>('menu');
    const [practiceSet, setPracticeSet] = useState<ReadingPart1Set[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [showResult, setShowResult] = useState(false);
    const [showTip, setShowTip] = useState(false);
    
    // Timer for Test Mode
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes for Part 1 (approx)
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
            setShowResult(true);
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
        setPracticeSet([...readingPart1Data]); // Sequential
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setShowTip(false);
        setIsActive(false);
    };

    const startTest = () => {
        setMode('test');
        setPracticeSet(shuffleArray([...readingPart1Data, ...readingPart1Data2])); // Random
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setShowTip(false);
        setTimeLeft(20 * 60);
        setIsActive(true);
    };

    const startPractice2 = () => {
        setMode('practice2');
        setPracticeSet([...readingPart1Data2]); // Sequential
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setShowTip(false);
        setIsActive(false);
    };

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        if (showResult && (mode === 'practice' || mode === 'practice2')) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const checkResult = () => {
        setShowResult(true);
    };

    const nextQuestion = () => {
        if (currentIndex < practiceSet.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswers({});
            if (mode === 'practice' || mode === 'practice2') {
                setShowResult(false);
                setShowTip(false);
            }
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setUserAnswers({});
            if (mode === 'practice' || mode === 'practice2') {
                setShowResult(false);
                setShowTip(false);
            }
        }
    };

    const calculateScore = (dataset: ReadingPart1Set) => {
        let score = 0;
        dataset.questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) score++;
        });
        return score;
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
                <h2 className="text-3xl font-bold text-dark dark:text-white mt-12">Reading Part 1: Sentence Completion</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-8">Choose the correct word to complete the sentence.</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                    <button onClick={startPractice} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-primary group">
                        <h3 className="text-2xl font-bold text-primary group-hover:text-dark dark:group-hover:text-white mb-2">Luyện tập (Practice Mode)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Practice questions in order. "Mẹo nhớ" (Tips) available.</p>
                    </button>

                    <button onClick={startPractice2} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-primary group">
                        <h3 className="text-2xl font-bold text-primary group-hover:text-dark dark:group-hover:text-white mb-2">Luyện tập 2 (Chỉ làm sau khi nhớ đáp án)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Practice newest questions. "Mẹo nhớ" (Tips) available.</p>
                    </button>

                    <button onClick={startTest} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary group">
                        <h3 className="text-2xl font-bold text-secondary group-hover:text-dark dark:group-hover:text-white mb-2">Test ngẫu nhiên (Random Test)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Questions shuffled. Timer included.</p>
                    </button>
                </div>
            </div>
        );
    }

    const currentSet = practiceSet[currentIndex];

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl min-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-slate-700">
                <button onClick={() => setMode('menu')} className="text-sm text-slate-500 hover:text-dark dark:hover:text-white flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                     Back to Menu
                </button>
                <div className="flex items-center gap-4">
                     <span className="text-sm font-bold text-slate-500">Set: {currentIndex + 1} / {practiceSet.length}</span>
                    {mode === 'test' && (
                        <div className="text-xl font-bold text-red-600 font-mono bg-red-50 px-3 py-1 rounded">
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
            </div>

            {/* Tip Section - Only in Practice Mode */}
            {(mode === 'practice' || mode === 'practice2') && (
                <div className="mb-6">
                    <button 
                        onClick={() => setShowTip(!showTip)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-semibold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {showTip ? "Ẩn Mẹo nhớ" : "Hiện Mẹo nhớ"}
                    </button>
                    {showTip && (
                        <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-slate-700 dark:text-slate-300 animate-fade-in">
                            <p className="font-medium italic">{currentSet.tip}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex-grow space-y-6">
                <h3 className="text-xl font-bold text-dark dark:text-white mb-4">Choose the correct word to complete the sentences.</h3>
                {currentSet.questions.map((q, idx) => {
                    const selected = userAnswers[idx];
                    const isCorrect = selected === q.correctAnswer;
                    
                    return (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex flex-wrap items-center gap-2 text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                                <span>{idx + 1}. {q.textBefore}</span>
                                <select 
                                    value={selected || ""}
                                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                    className={`
                                        p-2 rounded border font-medium cursor-pointer transition-colors
                                        ${showResult 
                                            ? (isCorrect 
                                                ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200')
                                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 dark:text-white hover:border-primary'
                                        }
                                        focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none
                                    `}
                                    disabled={showResult && mode === 'test'}
                                >
                                    <option value="" disabled>---</option>
                                    {q.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <span>{q.textAfter}</span>
                            </div>
                            
                            {showResult && !isCorrect && (
                                <p className="mt-2 text-sm text-red-600 font-semibold ml-6">
                                    Correct answer: {q.correctAnswer}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky bottom-0">
                 {showResult && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-primary">Score: {calculateScore(currentSet)} / 5</p>
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
                            onClick={() => { setShowResult(false); setUserAnswers({}); }} 
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

export default ReadingPart1Practice;
