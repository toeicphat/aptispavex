import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
    listeningQuestions1_13, 
    listeningQuestions1_13_de5,
    listeningQuestions1_13_de6,
    listeningQuestions1_13_de7,
    listeningQuestions1_13_de8,
    listeningQuestions1_13_de9,
    listeningQuestions1_13_de10,
    listeningQuestions1_13_de11,
    listeningQuestions1_13_de12,
    listeningQuestions1_13_2026_1,
    listeningQuestions1_13_2026_2,
    ListeningQuestion 
} from '../../lib/Q1-13/listeningQuestion1_13Data';

type Mode = 'menu' | 'practice' | 'test';

const part1 = [...listeningQuestions1_13];
const part2 = [...listeningQuestions1_13_de5, ...listeningQuestions1_13_de6, ...listeningQuestions1_13_de7, ...listeningQuestions1_13_de8];
const part3 = [...listeningQuestions1_13_de9, ...listeningQuestions1_13_de10, ...listeningQuestions1_13_de11, ...listeningQuestions1_13_de12];
const part4 = [...listeningQuestions1_13_2026_1, ...listeningQuestions1_13_2026_2];

const PARTS = [
    { id: 1, name: 'Phần 1 (Base)', data: part1 },
    { id: 2, name: 'Phần 2 (De 5-8)', data: part2 },
    { id: 3, name: 'Phần 3 (De 9-12)', data: part3 },
    { id: 4, name: 'Phần 4 (2026)', data: part4 },
];

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const AudioPlayer = ({ text, maxPlays, mode, voiceURI, availableVoices }: { text: string; maxPlays?: number; mode: Mode; voiceURI: string; availableVoices: SpeechSynthesisVoice[] }) => {
    const [playsLeft, setPlaysLeft] = useState(maxPlays || 2);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setPlaysLeft(maxPlays || 2);
        setIsPlaying(false);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        return () => {
             if ('speechSynthesis' in window) {
                 window.speechSynthesis.cancel();
             }
        };
    }, [text, maxPlays, mode]);

    const handlePlayPause = () => {
        if (!('speechSynthesis' in window)) {
            console.error('Speech synthesis not supported');
            return;
        }
        
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            if (mode === 'test' && playsLeft <= 0) {
                return;
            }
            
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            
            if (voiceURI === 'random') {
                if (availableVoices.length > 0) {
                    utterance.voice = availableVoices[Math.floor(Math.random() * availableVoices.length)];
                }
            } else {
                const selectedVoice = availableVoices.find(v => v.voiceURI === voiceURI);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            }

            utterance.onend = () => {
                setIsPlaying(false);
            };
            utterance.onerror = () => {
                setIsPlaying(false);
            };
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
            
            if (mode === 'test') {
                setPlaysLeft(prev => prev - 1);
            }
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-100 dark:bg-slate-700 py-4 px-6 rounded-2xl mb-8 shadow-sm">
            <button 
                onClick={handlePlayPause}
                disabled={mode === 'test' && playsLeft <= 0 && !isPlaying}
                className={`w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full ${mode === 'test' && playsLeft <= 0 && !isPlaying ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed text-slate-500' : 'bg-primary hover:bg-primary/90 text-white shadow-md'} transition-all hover:scale-105 active:scale-95`}
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 9v6m4-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
            </button>
            <div className="flex-1 text-center sm:text-left">
                <div className="text-base font-bold text-slate-700 dark:text-slate-200">Listening Recording</div>
                {mode === 'test' ? (
                    <div className="text-sm font-medium mt-1">
                        <span className={playsLeft === 0 ? "text-red-500 font-bold" : "text-amber-600"}>
                            {playsLeft} of {maxPlays} plays remaining
                        </span>
                    </div>
                ) : (
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Unlimited replays
                    </div>
                )}
            </div>
        </div>
    );
};

export default function ListeningPart1_13Practice({ onBack }: { onBack: () => void }) {
    const [mode, setMode] = useState<Mode>('menu');
    const [practiceSet, setPracticeSet] = useState<ListeningQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [showResult, setShowResult] = useState(false);
    const [showScript, setShowScript] = useState(false);
    
    const [selectedParts, setSelectedParts] = useState<number[]>([1, 2, 3, 4]);
    const [showTestModal, setShowTestModal] = useState(false);

    // Voice options
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('random');

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
            setVoices(available);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handlePartSelection = (partId: number) => {
        setSelectedParts(prev => 
            prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId].sort()
        );
    };

    const aggregatedPracticeSet = useMemo(() => {
        let qs: ListeningQuestion[] = [];
        PARTS.forEach(p => {
            if (selectedParts.includes(p.id)) {
                qs = qs.concat(p.data);
            }
        });
        return qs;
    }, [selectedParts]);

    useEffect(() => {
        if (mode === 'practice') {
            if (aggregatedPracticeSet.length > 0) {
                setPracticeSet(aggregatedPracticeSet);
                // Try to keep the index valid if possible
                if (currentIndex >= aggregatedPracticeSet.length) {
                    setCurrentIndex(0);
                }
            } else {
                setPracticeSet([]);
            }
        }
    }, [aggregatedPracticeSet, mode]);


    const startPractice = () => {
        if (selectedParts.length === 0) {
            alert('Please select at least one part to practice');
            return;
        }
        setMode('practice');
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
        setShowScript(false);
    };

    const startTest = () => {
        if (selectedParts.length === 0) {
            alert('Please select at least one part for the test');
            return;
        }
        setShowTestModal(false);
        setMode('test');
        let qs: ListeningQuestion[] = [];
        PARTS.forEach(p => {
            if (selectedParts.includes(p.id)) {
                qs = qs.concat(p.data);
            }
        });
        setPracticeSet(shuffleArray(qs));
        setCurrentIndex(0);
        setUserAnswers({});
        setShowResult(false);
    };

    const handleAnswerChange = (answer: string) => {
        if (showResult && mode === 'practice') return;
        if (mode === 'test' && showResult) return;
        setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: answer
        }));
    };

    const nextQuestion = () => {
        if (currentIndex < practiceSet.length - 1) {
            setCurrentIndex(currentIndex + 1);
            if (mode === 'practice') {
                setShowResult(false);
                setShowScript(false);
            }
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            if (mode === 'practice') {
                setShowResult(false);
                setShowScript(false);
            }
        }
    };

    const calculateScore = () => {
        let correct = 0;
        practiceSet.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) {
                correct++;
            }
        });
        return `${correct} / ${practiceSet.length}`;
    };

    // Voice Selector Component
    const VoiceSelector = () => (
        <div className="mb-6 flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <label className="font-medium text-slate-700 dark:text-slate-300">Speaker Voice:</label>
            <select 
                value={selectedVoiceURI} 
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200"
            >
                <option value="random">Random Voice</option>
                {voices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                ))}
            </select>
        </div>
    );

    if (mode === 'menu') {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8 relative">
                <button
                    onClick={onBack}
                    className="mb-8 flex items-center text-slate-500 hover:text-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Listening Sections
                </button>
                
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-dark dark:text-white mb-2">Question 1-13</h2>
                    <p className="text-slate-600 dark:text-slate-300">Information Recognition format</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button onClick={startPractice} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-primary text-left group">
                        <h3 className="text-2xl font-bold text-primary mb-2">Luyện tập <br/> (Practice Mode)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Sequential questions with unlimited audio replays and immediate feedback.</p>
                    </button>
                    
                    <button onClick={() => setShowTestModal(true)} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary text-left group">
                        <h3 className="text-2xl font-bold text-secondary mb-2">Test ngẫu nhiên <br/> (Random Test)</h3>
                        <p className="text-slate-500 dark:text-slate-300">All questions shuffled. Audio can only be played 2 times.</p>
                    </button>
                </div>

                {showTestModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-dark dark:text-white mb-4">Select Parts for Test</h3>
                            <div className="space-y-3 mb-6">
                                {PARTS.map(part => (
                                    <label key={part.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                                        <input
                                            type="checkbox"
                                            checked={selectedParts.includes(part.id)}
                                            onChange={() => handlePartSelection(part.id)}
                                            className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary"
                                        />
                                        <span className="text-slate-700 dark:text-slate-300">{part.name} ({part.data.length} Qs)</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowTestModal(false)}
                                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={startTest}
                                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                                    disabled={selectedParts.length === 0}
                                >
                                    Start Test
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (practiceSet.length === 0) return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 text-center text-red-500 font-bold">
            No questions available for the selected parts.
        </div>
    );

    const currentQuestion = practiceSet[currentIndex];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
            {mode === 'practice' && (
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 sticky top-4">
                        <h3 className="font-bold text-dark dark:text-white mb-4">Select Parts</h3>
                        <div className="space-y-3 mb-6">
                            {PARTS.map(part => (
                                <label key={part.id} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedParts.includes(part.id)}
                                        onChange={() => handlePartSelection(part.id)}
                                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{part.name}</span>
                                </label>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => setShowScript(!showScript)}
                            className="w-full py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-200"
                        >
                            {showScript ? 'Ẩn script' : 'Hiện script'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => {
                            setMode('menu');
                        }}
                        className="flex items-center text-slate-500 hover:text-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Section Menu
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-500">
                            {currentIndex + 1} / {practiceSet.length}
                        </span>
                    </div>
                </div>

                <VoiceSelector />

                <AudioPlayer 
                    text={currentQuestion.transcript} 
                    maxPlays={2} 
                    mode={mode} 
                    voiceURI={selectedVoiceURI} 
                    availableVoices={voices} 
                />

                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-6">
                        {currentQuestion.question}
                    </h3>
                    
                    <div className="space-y-4">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = userAnswers[currentIndex] === option;
                            let optionClass = "flex items-center p-4 border rounded-xl cursor-pointer transition-all ";
                            
                            if (showResult) {
                                if (option === currentQuestion.correctAnswer) {
                                    optionClass += "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-300";
                                } else if (isSelected) {
                                    optionClass += "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-300";
                                } else {
                                    optionClass += "border-slate-200 dark:border-slate-600 opacity-50";
                                }
                            } else {
                                optionClass += isSelected 
                                    ? "border-primary bg-primary/5 text-primary" 
                                    : "border-slate-200 dark:border-slate-600 hover:border-primary/50 text-slate-700 dark:text-slate-300";
                            }

                            return (
                                <div key={idx} className={optionClass} onClick={() => handleAnswerChange(option)}>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${isSelected ? 'border-primary' : 'border-slate-400'}`}>
                                        {isSelected && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </div>
                            );
                        })}
                    </div>

                    {(showScript || (showResult && mode === 'practice')) && (
                        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Transcript</h4>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                {currentQuestion.transcript}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                        className="px-6 py-3 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                        Previous
                    </button>

                    {mode === 'practice' && !showResult && (
                        <button
                            onClick={() => setShowResult(true)}
                            disabled={!userAnswers[currentIndex]}
                            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium disabled:opacity-50 transition-colors"
                        >
                            Check Answer
                        </button>
                    )}

                    {showResult && currentIndex < practiceSet.length - 1 && mode === 'practice' && (
                        <button
                            onClick={nextQuestion}
                            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors"
                        >
                            Next Question
                        </button>
                    )}

                    {mode === 'test' && currentIndex < practiceSet.length - 1 && (
                        <button
                            onClick={nextQuestion}
                            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors"
                        >
                            Next Question
                        </button>
                    )}

                    {mode === 'test' && currentIndex === practiceSet.length - 1 && !showResult && (
                        <button
                            onClick={() => { setShowResult(true); }}
                            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold transition-colors"
                        >
                            Finish Test
                        </button>
                    )}
                </div>

                {mode === 'test' && showResult && (
                    <div className="mt-12 p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-200 text-center">
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Test Completed!</h3>
                        <div className="text-4xl font-black text-green-600 mb-4">Score: {calculateScore()}</div>
                        <p className="text-slate-600 dark:text-slate-300">You can now review your answers.</p>
                    </div>
                )}
                
                {mode === 'test' && showResult && (
                    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Transcript Reference</h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                            {currentQuestion.transcript}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
