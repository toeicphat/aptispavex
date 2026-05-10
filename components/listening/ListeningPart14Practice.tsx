import React, { useState, useEffect } from 'react';
import { ListeningQuestion14, listeningQuestions14 } from '../../lib/listeningQuestion14Data';

// Simple TTS Audio Player restricted to 2 plays for test, unlimited for practice
const TTSAudioPlayer = ({ transcripts, mode }: { transcripts: { person1: string, person2: string, person3: string, person4: string }, mode: 'practice' | 'test' }) => {
    const defaultPlaysCount = mode === 'practice' ? Infinity : 2;
    const [playsLeft, setPlaysLeft] = useState(defaultPlaysCount);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('random');
    
    const fullText = `Person 1: ${transcripts.person1}... Person 2: ${transcripts.person2}... Person 3: ${transcripts.person3}... Person 4: ${transcripts.person4}`;

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
            setVoices(available);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        setPlaysLeft(mode === 'practice' ? Infinity : 2);
        setIsPlaying(false);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        return () => {
             if ('speechSynthesis' in window) {
                 window.speechSynthesis.cancel();
             }
        };
    }, [fullText, mode]);

    const handlePlayPause = () => {
        if (!('speechSynthesis' in window)) {
            console.error('Speech synthesis not supported');
            return;
        }
        
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            if (playsLeft <= 0 && mode !== 'practice') return;
            
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = 'en-US';
            
            if (selectedVoiceURI === 'random') {
                if (voices.length > 0) {
                    utterance.voice = voices[Math.floor(Math.random() * voices.length)];
                }
            } else {
                const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
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
            if (mode !== 'practice') {
                setPlaysLeft(prev => prev - 1);
            }
        }
    };

    return (
        <div>
            <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between">
                <label className="font-medium text-slate-700">Speaker Voice:</label>
                <select 
                    value={selectedVoiceURI} 
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="p-2 border border-slate-300 rounded text-slate-700"
                >
                    <option value="random">Random Voice</option>
                    {voices.map(v => (
                        <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center justify-between bg-[#df3b3b] text-white py-3 px-6 rounded-t-lg shadow-sm">
                <div className="flex items-center gap-4 w-full">
                    <button 
                        onClick={handlePlayPause}
                        disabled={playsLeft <= 0 && !isPlaying && mode !== 'practice'}
                        className={`flex items-center justify-center rounded-full transition-all ${playsLeft <= 0 && !isPlaying && mode !== 'practice' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 9v6m4-6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    </div>
                    <input type="range" className="w-32 md:w-48 h-1 bg-white/50 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="flex-shrink-0 text-sm font-medium">
                    {mode === 'practice' ? 'Unlimited plays' : `${playsLeft} of 2 plays remaining`}
                </div>
            </div>
        </div>
    );
};

export default function ListeningPart14Practice({ onBack }: { onBack: () => void }) {
    const [mode, setMode] = useState<'menu' | 'practice' | 'test'>('menu');
    const [practiceSet, setPracticeSet] = useState<ListeningQuestion14[]>([]);
    
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white text-dark shadow-sm">
                <div className="flex items-center">
                    <button onClick={mode === 'menu' ? onBack : () => setMode('menu')} className="mr-3 text-dark text-xl font-medium flex items-center hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        Aptis Keys
                    </button>
                </div>
                {mode !== 'menu' && (
                    <div className="text-xl font-bold text-slate-800">
                        Listening Part 4 (Question 14)
                    </div>
                )}
            </div>

            <div className="container mx-auto py-8 px-4 flex-grow max-w-4xl">
                {mode === 'menu' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Listening Question 14</h2>
                                <p className="text-slate-500">Listen to extended monologues</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setPracticeSet(listeningQuestions14);
                                    setMode('practice');
                                }}
                                className="w-full relative overflow-hidden group flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 rounded-xl transition-all"
                            >
                                <div className="text-left relative z-10">
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">Practice Mode</h3>
                                    <p className="text-blue-700/80">Practice all {listeningQuestions14.length} questions without time limits.</p>
                                </div>
                                <div className="relative z-10 bg-white/50 p-2 rounded-full text-blue-600 group-hover:translate-x-1 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    const randomSet = [...listeningQuestions14].sort(() => 0.5 - Math.random()).slice(0, 5);
                                    setPracticeSet(randomSet);
                                    setMode('test');
                                }}
                                className="w-full relative overflow-hidden group flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 hover:border-purple-300 rounded-xl transition-all"
                            >
                                <div className="text-left relative z-10">
                                    <h3 className="text-xl font-bold text-purple-900 mb-2">Random Test (5 questions)</h3>
                                    <p className="text-purple-700/80">Test yourself with 5 random questions. Timed and restricted plays.</p>
                                </div>
                                <div className="relative z-10 bg-white/50 p-2 rounded-full text-purple-600 group-hover:translate-x-1 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <QuestionRunner mode={mode} practiceSet={practiceSet} onFinish={() => setMode('menu')} />
                )}
            </div>
        </div>
    );
}

function QuestionRunner({ mode, practiceSet, onFinish }: { mode: 'practice' | 'test', practiceSet: ListeningQuestion14[], onFinish: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15:00 for test
    const [answers, setAnswers] = useState({ person1: "", person2: "", person3: "", person4: "" });
    const [showTranscript, setShowTranscript] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = practiceSet[currentIndex];

    // Reset state on question change
    useEffect(() => {
        setAnswers({ person1: "", person2: "", person3: "", person4: "" });
        setShowTranscript(false);
        setShowResult(false);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, [currentIndex]);

    useEffect(() => {
        if (mode === 'practice') return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowResult(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [mode]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (person: string, value: string) => {
        setAnswers(prev => ({ ...prev, [person]: value }));
    };

    const handleCheckResult = () => {
        setShowResult(true);
    };

    const nextQuestion = () => {
        if (currentIndex < practiceSet.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onFinish();
        }
    };

    const calculateScore = () => {
        let score = 0;
        if (answers.person1 === currentQuestion.correctAnswers.person1) score++;
        if (answers.person2 === currentQuestion.correctAnswers.person2) score++;
        if (answers.person3 === currentQuestion.correctAnswers.person3) score++;
        if (answers.person4 === currentQuestion.correctAnswers.person4) score++;
        return score;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <div className="font-medium text-slate-600">
                    Question {currentIndex + 1} of {practiceSet.length}
                </div>
                {mode === 'test' ? (
                    <div className="flex items-center text-red-600 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {formatTime(timeLeft)}
                    </div>
                ) : (
                    <div className="text-green-600 font-bold flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Practice Mode
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
                <TTSAudioPlayer transcripts={currentQuestion.transcripts} mode={mode} />
                
                <div className="p-6 md:p-8">
                    <h5 className="text-lg font-bold mb-4">Topic: {currentQuestion.topic}</h5>
                    <p className="mb-8 text-slate-700">{currentQuestion.instruction}</p>

                    <div className="space-y-4 max-w-2xl">
                        {['person1', 'person2', 'person3', 'person4'].map((person, index) => (
                            <div key={person} className="flex items-center gap-4">
                                <label className="font-semibold text-slate-700 w-24 shrink-0">Person {index + 1}</label>
                                <select 
                                    className="flex-1 p-2 border border-[#cccc99] rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    value={answers[person as keyof typeof answers]}
                                    onChange={(e) => handleAnswerChange(person, e.target.value)}
                                    disabled={showResult}
                                >
                                    <option value="">-- Select an answer --</option>
                                    {currentQuestion.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {(mode === 'practice' || showResult) && (
                <div className="mb-8">
                    <button 
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="w-full py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-200"
                    >
                        {showTranscript ? "Ẩn script" : "Hiện script"}
                    </button>
                </div>
            )}

            {showTranscript && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                    <p className="font-bold mb-3">Paragraph:</p>
                    <div className="space-y-4 text-slate-700">
                        <p><span className="font-semibold">Person 1:</span> {currentQuestion.transcripts.person1}</p>
                        <p><span className="font-semibold">Person 2:</span> {currentQuestion.transcripts.person2}</p>
                        <p><span className="font-semibold">Person 3:</span> {currentQuestion.transcripts.person3}</p>
                        <p><span className="font-semibold">Person 4:</span> {currentQuestion.transcripts.person4}</p>
                    </div>
                </div>
            )}

            {showResult && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                    <h3 className="text-xl font-bold mb-4">Results</h3>
                    <p className="font-bold text-lg text-primary mb-4">Total Score: {calculateScore()}/4</p>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="p-3 border-b border-t border-l border-slate-300">STT</th>
                                    <th className="p-3 border-b border-t border-l border-slate-300">Your Answer</th>
                                    <th className="p-3 border-b border-t border-l border-r border-slate-300">Correct Answer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['person1', 'person2', 'person3', 'person4'].map((person, index) => {
                                    const k = person as keyof typeof answers;
                                    const isCorrect = answers[k] === currentQuestion.correctAnswers[k];
                                    return (
                                        <tr key={person} className="border-b border-slate-200">
                                            <td className="p-3 border-l border-slate-300 font-medium">Person {index + 1}</td>
                                            <td className={`p-3 border-l border-slate-300 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                {answers[k] || "(No answer)"}
                                            </td>
                                            <td className="p-3 border-l border-r border-slate-300 text-green-600">
                                                {currentQuestion.correctAnswers[k]}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-auto mb-8">
                <button 
                    onClick={onFinish} 
                    className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    Back to Menu
                </button>
                <div className="flex gap-4">
                    {!showResult && (
                        <button 
                            onClick={handleCheckResult} 
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm font-medium"
                        >
                            Check Result
                        </button>
                    )}
                    {(showResult || mode === 'practice') && (
                        <button 
                            onClick={nextQuestion} 
                            className="px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 transition-colors shadow-sm font-medium"
                        >
                            {currentIndex < practiceSet.length - 1 ? 'Next Question' : 'Finish'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
