
import React, { useState, useEffect } from 'react';
import { readingPart2Data, QuestionSet } from '../../lib/readingPart2Data';

type Mode = 'menu' | 'practice' | 'test';

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const ReadingPart2And3Practice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mode, setMode] = useState<Mode>('menu');
    const [questions, setQuestions] = useState<QuestionSet[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSentences, setCurrentSentences] = useState<string[]>([]);
    const [userOrder, setUserOrder] = useState<string[]>([]);
    const [isChecked, setIsChecked] = useState(false);
    
    // Timer for Test Mode
    const [timeLeft, setTimeLeft] = useState(35 * 60); // 35 minutes
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

    const loadQuestion = (index: number, list: QuestionSet[]) => {
        const q = list[index];
        // Shuffle sentences for the user to order
        const shuffled = shuffleArray([...q.sentences]);
        setCurrentSentences(shuffled);
        setUserOrder(shuffled);
        setIsChecked(false);
    };

    const startPractice = () => {
        setMode('practice');
        const qList = [...readingPart2Data]; // In order
        setQuestions(qList);
        setCurrentIndex(0);
        loadQuestion(0, qList);
        setIsActive(false);
    };

    const startTest = () => {
        setMode('test');
        const qList = shuffleArray([...readingPart2Data]); // Random order
        setQuestions(qList);
        setCurrentIndex(0);
        loadQuestion(0, qList);
        setTimeLeft(35 * 60);
        setIsActive(true);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        const dragIndexStr = e.dataTransfer.getData('text/plain');
        if (dragIndexStr === "") return;
        
        const dragIndex = parseInt(dragIndexStr);
        if (dragIndex === dropIndex) return;

        const newOrder = [...userOrder];
        const [movedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, movedItem);
        setUserOrder(newOrder);
        setIsChecked(false); // Reset check if user moves items
    };
    
    // Mobile Touch Support for DnD simulation (Swap)
    const moveItem = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === userOrder.length - 1)) return;
        const newOrder = [...userOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
        setUserOrder(newOrder);
        setIsChecked(false);
    };

    const checkResult = () => {
        setIsChecked(true);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            loadQuestion(nextIdx, questions);
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            const prevIdx = currentIndex - 1;
            setCurrentIndex(prevIdx);
            loadQuestion(prevIdx, questions);
        }
    };

    const currentQuestionSet = questions[currentIndex];

    // Helper to calculate score
    const getScore = () => {
        let score = 0;
        userOrder.forEach((sentence, idx) => {
            if (sentence === currentQuestionSet.sentences[idx]) score++;
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
                <h2 className="text-3xl font-bold text-dark dark:text-white mt-12">Reading Part 2: Text Organization</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-8">Order the sentences to make a story.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <button onClick={startPractice} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-primary group">
                        <h3 className="text-2xl font-bold text-primary group-hover:text-dark dark:group-hover:text-white mb-2">Luyện tập (Practice Mode)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Practice questions in order (1-38). No time limit. Immediate feedback.</p>
                    </button>

                    <button onClick={startTest} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary group">
                        <h3 className="text-2xl font-bold text-secondary group-hover:text-dark dark:group-hover:text-white mb-2">Test ngẫu nhiên (Random Test)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Questions are shuffled. 35-minute timer. Simulate test conditions.</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl min-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setMode('menu')} className="text-sm text-slate-500 hover:text-dark dark:hover:text-white flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                     Back to Menu
                </button>
                {mode === 'test' && (
                    <div className="text-xl font-bold text-red-600 font-mono bg-red-50 px-3 py-1 rounded">
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Question {currentIndex + 1} / {questions.length}</h3>
                        <h2 className="text-2xl font-bold text-dark dark:text-white mt-1">Topic: {currentQuestionSet.topic}</h2>
                    </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 mt-4 rounded-full">
                     <div className="bg-primary h-2 rounded-full transition-all" style={{width: `${((currentIndex + 1) / questions.length) * 100}%`}}></div>
                </div>
            </div>

            <div className="flex-grow grid md:grid-cols-2 gap-8">
                {/* Drag Area */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">Drag and drop the sentences to reorder them.</p>
                    <div className="space-y-3">
                        {userOrder.map((sentence, index) => (
                            <div
                                key={index}
                                draggable={!isChecked}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`
                                    p-4 rounded-lg shadow-sm border cursor-move transition-all select-none flex items-center justify-between
                                    ${isChecked 
                                        ? (sentence === currentQuestionSet.sentences[index] 
                                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800')
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary hover:shadow-md'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                        {index + 1}
                                    </span>
                                    <span className="text-slate-800 dark:text-slate-200 text-sm md:text-base">{sentence}</span>
                                </div>
                                {/* Mobile/Touch Controls */}
                                {!isChecked && (
                                    <div className="flex flex-col ml-2 md:hidden">
                                        <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-primary disabled:opacity-30">▲</button>
                                        <button onClick={() => moveItem(index, 'down')} disabled={index === userOrder.length - 1} className="p-1 text-slate-400 hover:text-primary disabled:opacity-30">▼</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feedback / Control Area */}
                <div className="flex flex-col">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-full">
                        <h4 className="font-bold text-lg mb-4 text-dark dark:text-white">Controls & Results</h4>
                        
                        {!isChecked ? (
                            <button onClick={checkResult} className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-dark transition-colors shadow-md">
                                Check Result
                            </button>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">
                                    <p className="text-slate-600 dark:text-slate-300 text-sm uppercase font-semibold">Your Score</p>
                                    <p className="text-4xl font-bold text-dark dark:text-white my-2">
                                        <span className={getScore() === 5 ? "text-green-600" : "text-primary"}>{getScore()}</span>
                                        <span className="text-slate-400 text-2xl">/5</span>
                                    </p>
                                </div>
                                
                                <h5 className="font-semibold text-sm text-slate-500 dark:text-slate-400 mb-2">Correct Order:</h5>
                                <div className="space-y-2 mb-6">
                                    {currentQuestionSet.sentences.map((s, i) => (
                                        <div key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 p-2 rounded bg-slate-50 dark:bg-slate-700/50">
                                            <span className="font-bold text-slate-400">{i + 1}.</span> {s}
                                        </div>
                                    ))}
                                </div>
                                
                                <button onClick={() => {setIsChecked(false); setUserOrder([...currentSentences]);}} className="w-full mb-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    Try Again
                                </button>
                            </div>
                        )}

                        <div className="mt-auto flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                             <button 
                                onClick={prevQuestion} 
                                disabled={currentIndex === 0}
                                className="flex-1 py-2 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={nextQuestion} 
                                disabled={currentIndex === questions.length - 1}
                                className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
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

export default ReadingPart2And3Practice;
