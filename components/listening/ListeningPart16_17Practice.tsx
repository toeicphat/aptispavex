import React, { useState, useEffect, useRef } from 'react';
import { listeningQuestions16_17, ListeningQuestion16_17 } from '../../lib/listeningQuestion16_17Data';

// Simple TTS Audio Player restricted to 2 plays for test, unlimited for practice
const TTSAudioPlayer = ({ transcript, mode }: { transcript: string, mode: 'practice' | 'test' }) => {
    const defaultPlaysCount = mode === 'practice' ? Infinity : 2;
    const [playsLeft, setPlaysLeft] = useState(defaultPlaysCount);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('random');
    
    // Removing fullText logic and directly using the transript string

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
    }, [transcript, mode]);

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
            const utterance = new SpeechSynthesisUtterance(transcript);
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
            <div className="flex items-center justify-between bg-[#cc0000] text-white py-3 px-6 rounded-t-lg shadow-sm">
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

export default function ListeningPart16_17Practice({ onBack }: { onBack: () => void }) {
    const [mode, setMode] = useState<'menu' | 'practice' | 'test'>('menu');
    const [practiceSet, setPracticeSet] = useState<ListeningQuestion16_17[]>([]);

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
                    <h2 className="text-3xl font-bold text-dark dark:text-white mb-2">Question 16 & 17</h2>
                    <p className="text-slate-600 dark:text-slate-300">Listen to discussions and answer the questions.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button onClick={() => {
                        setPracticeSet(listeningQuestions16_17);
                        setMode('practice');
                    }} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-primary text-left group">
                        <h3 className="text-2xl font-bold text-primary mb-2">Luyện tập <br/> (Practice Mode)</h3>
                        <p className="text-slate-500 dark:text-slate-300">Sequential questions with unlimited audio replays and immediate feedback.</p>
                    </button>
                    
                    <button onClick={() => {
                        const randomSet = [...listeningQuestions16_17].sort(() => 0.5 - Math.random());
                        setPracticeSet(randomSet);
                        setMode('test');
                    }} className="p-8 bg-slate-50 dark:bg-slate-700 rounded-2xl hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary text-left group">
                        <h3 className="text-2xl font-bold text-secondary mb-2">Test ngẫu nhiên <br/> (Random Test)</h3>
                        <p className="text-slate-500 dark:text-slate-300">All questions in random order. Audio can only be played 2 times.</p>
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 flex justify-between items-center z-10 sticky top-0">
                <div className="flex items-center">
                    <button onClick={() => setMode('menu')} className="mr-3 text-dark text-xl font-medium flex items-center hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        Aptis Keys
                    </button>
                </div>
                <div className="text-xl font-bold text-slate-800">
                    Listening Question 16 & 17
                </div>
            </div>

            <div className="container mx-auto py-8 px-4 flex-grow max-w-4xl">
                <QuestionRunner mode={mode} practiceSet={practiceSet} onFinish={() => setMode('menu')} />
            </div>
        </div>
    );
}

export function QuestionRunner({ mode, practiceSet, onFinish }: { mode: 'practice' | 'test', practiceSet: ListeningQuestion16_17[], onFinish: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(34 * 60); // 34:00 for test
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showTranscript, setShowTranscript] = useState(false);
    const [showResult, setShowResult] = useState(false);
    
    const currentQuestion = practiceSet[currentIndex];
    
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (mode === 'test' && timeLeft > 0 && !showResult) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !showResult) {
            checkResult();
        }
        return () => clearInterval(timer);
    }, [mode, timeLeft, showResult]);

    // Reset state when question changes
    useEffect(() => {
        setAnswers({});
        setShowTranscript(false);
        setShowResult(false);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, [currentIndex]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAnswerChange = (subQuestionId: string, value: string) => {
        if (showResult && mode === 'test') return;
        
        setAnswers(prev => ({
            ...prev,
            [subQuestionId]: value
        }));
    };

    const checkResult = () => {
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
        let correct = 0;
        currentQuestion.subQuestions.forEach(sq => {
            if (answers[sq.id] === sq.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    if (!currentQuestion) return <div>Loading...</div>;

    const isAllAnswered = currentQuestion.subQuestions.every(sq => answers[sq.id]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            {/* Countdown Timer for Test Mode */}
            {mode === 'test' && (
                <div className="absolute top-4 right-6 flex items-center bg-white z-10">
                    <span className="text-slate-600 mr-2">Time remaining:</span>
                    <span className="text-xl font-medium text-slate-800">{formatTime(timeLeft)}</span>
                </div>
            )}

            <div className="p-6 md:p-8 pt-16">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">
                        Question {currentIndex + 1} of {practiceSet.length}
                    </h3>
                </div>

                <div className="mb-8">
                    <TTSAudioPlayer transcript={currentQuestion.transcript} mode={mode} />
                </div>

                <div className="mb-8">
                    <h5 className="text-lg font-bold mb-4 text-slate-800">Topic: {currentQuestion.topic}</h5>
                    
                    <div className="space-y-6">
                        {currentQuestion.subQuestions.map((sq, index) => (
                            <div key={sq.id} className="mb-4">
                                <label className="form-label font-medium text-slate-700 block mb-2">{sq.text}</label>
                                <div className="space-y-2">
                                    {sq.options.map(opt => (
                                        <div key={opt.id} className="flex items-center">
                                            <input 
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" 
                                                type="radio" 
                                                name={`sq_${sq.id}`} 
                                                id={`sq_${sq.id}_${opt.id}`} 
                                                value={opt.id}
                                                checked={answers[sq.id] === opt.id}
                                                onChange={(e) => handleAnswerChange(sq.id, e.target.value)}
                                                disabled={showResult && mode === 'test'}
                                            />
                                            <label className="ml-2 text-slate-700 cursor-pointer" htmlFor={`sq_${sq.id}_${opt.id}`}>
                                                {opt.id}. {opt.text}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Show Transcript Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        {showTranscript ? 'Hide Paragraph' : 'Show Paragraph'}
                    </button>
                </div>

                {/* Transcript Box */}
                {showTranscript && (
                    <div className="bg-white border rounded-lg p-5 shadow-sm mb-6">
                        <p className="font-bold mb-2">Paragraph:</p>
                        <div className="space-y-3 whitespace-pre-wrap text-slate-700">
                            {currentQuestion.transcript}
                        </div>
                    </div>
                )}
                
                {/* Result Message (Practice Mode) */}
                {showResult && mode === 'practice' && (
                    <div className="p-4 mb-6 rounded-lg bg-slate-100 border border-slate-200">
                        <h4 className="font-bold text-lg mb-4 text-center">Test and Answer Review for Question 16 & 17</h4>
                        <div className="text-center mb-4">
                            <span className="text-xl font-bold">{calculateScore()} / {currentQuestion.subQuestions.length}</span> Correct
                        </div>
                        <div className="border rounded bg-white overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="p-3">Question</th>
                                        <th className="p-3">Your Answer</th>
                                        <th className="p-3">Correct Answer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentQuestion.subQuestions.map(sq => {
                                        const isCorrect = answers[sq.id] === sq.correctAnswer;
                                        return (
                                            <tr key={sq.id} className="border-b last:border-0">
                                                <td className="p-3 text-slate-700 text-sm align-middle">{sq.text}</td>
                                                <td className={`p-3 font-medium align-middle ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                    {answers[sq.id] || 'Not answered'}
                                                </td>
                                                <td className="p-3 font-medium text-green-600 align-middle">
                                                    {sq.correctAnswer}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between">
                <button 
                    onClick={() => {
                        if (currentIndex > 0) {
                            setCurrentIndex(currentIndex - 1);
                        } else {
                            onFinish();
                        }
                    }}
                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-medium transition-colors"
                >
                    Back
                </button>
                
                {!showResult ? (
                    <button 
                        onClick={checkResult}
                        disabled={!isAllAnswered && mode !== 'test'}
                        className="px-6 py-2 bg-[#cccc99] hover:bg-[#b3b380] disabled:bg-slate-200 disabled:text-slate-400 rounded text-dark font-medium transition-colors"
                    >
                        Check result
                    </button>
                ) : null}
                
                <button 
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-medium transition-colors"
                >
                    Next
                </button>
            </div>
            
            {/* Modal for Test Result (Test Mode) */}
            {showResult && mode === 'test' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
                            <h5 className="text-xl font-bold">Test and Answer Review for Question 16 & 17</h5>
                            <button onClick={() => setShowResult(false)} className="text-slate-400 hover:text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full">
                            <h5 className="text-center text-2xl font-bold mb-2">Score: {calculateScore()} / {currentQuestion.subQuestions.length}</h5>
                            
                            <table className="w-full text-left mt-6 border">
                                <thead className="bg-slate-100 border-b">
                                    <tr>
                                        <th className="p-3">Question</th>
                                        <th className="p-3">Your Answer</th>
                                        <th className="p-3">Correct Answer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentQuestion.subQuestions.map(sq => {
                                        const isCorrect = answers[sq.id] === sq.correctAnswer;
                                        return (
                                            <tr key={sq.id} className="border-b last:border-0 hover:bg-slate-50">
                                                <td className="p-3 text-sm text-slate-600 truncate max-w-[200px]">{sq.text}</td>
                                                <td className={`p-3 font-medium ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                    {answers[sq.id] || 'None'}
                                                </td>
                                                <td className="p-3 font-medium text-green-600">
                                                    {sq.correctAnswer}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-3 rounded-b-lg bg-slate-50">
                            <button onClick={nextQuestion} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Continue</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

