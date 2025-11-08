import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { speakingPart1Questions, Question } from '../../lib/questions';
import CEFRChart from './CEFRChart';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

// Helper function to convert audio blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            // remove the "data:audio/wav;base64," prefix
            resolve(base64data.split(',')[1]); 
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

interface Result {
    questionId: number;
    questionText: string;
    audioUrl: string;
    feedback: string;
    score: number;
    cefr: string;
}

type TestState = 'selecting' | 'practicing' | 'evaluating' | 'reviewing' | 'finished';

const BackButton: React.FC<{ onClick: () => void; text: string; }> = ({ onClick, text }) => (
    <button
        onClick={onClick}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {text}
    </button>
);


const SpeakingPart1Practice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [practiceQueue, setPracticeQueue] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState<Result[]>([]);
    const [testState, setTestState] = useState<TestState>('selecting');
    
    // Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    
    const [aiFeedback, setAiFeedback] = useState<{ feedback: string; score: number; cefr: string } | null>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    
    // Teardown timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleSelectionChange = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectGroup = (start: number, end: number) => {
        const groupIds = speakingPart1Questions.filter(q => q.id >= start && q.id <= end).map(q => q.id);
        setSelectedIds(prev => new Set([...prev, ...groupIds]));
    };
    
    const selectAll = () => {
        setSelectedIds(new Set(speakingPart1Questions.map(q => q.id)));
    };

    const startPractice = () => {
        if (selectedIds.size === 0) {
            alert('Please select at least one question to practice.');
            return;
        }
        const queue = speakingPart1Questions.filter(q => selectedIds.has(q.id));
        setPracticeQueue(shuffleArray(queue));
        setCurrentQuestionIndex(0);
        setResults([]);
        setTestState('practicing');
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop()); // Stop mic access
                getAIFeedback(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setAudioUrl(null);
            setAiFeedback(null);
            
            // Timer
            setTimeLeft(30);
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access the microphone. Please check your browser permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            setTestState('evaluating');
        }
    };
    
    const getAIFeedback = async (audioBlob: Blob) => {
        setIsEvaluating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const currentQuestion = practiceQueue[currentQuestionIndex];
            const audioBase64 = await blobToBase64(audioBlob);

            const audioPart = {
                inlineData: {
                    mimeType: 'audio/wav',
                    data: audioBase64,
                },
            };

            const textPart = {
                text: `You are an expert English examiner for the official APTIS test. A student has provided an audio response to the question: "${currentQuestion.text}".
    
                Please analyze the student's spoken audio response.
                
                Provide a detailed, constructive evaluation in VIETNAMESE ONLY. Your feedback should be specific and based directly on the audio provided, not a generic template.
                
                Your evaluation must cover these five official APTIS criteria:
                1.  **Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề:** Did the student answer the question directly and fully?
                2.  **Ngữ pháp và độ chính xác:** Analyze the grammar. Mention specific correct usages and any noticeable errors (e.g., verb tense, prepositions, sentence structure).
                3.  **Từ vựng và mức độ phù hợp:** Comment on the range and appropriateness of the vocabulary. Did they use varied language or repeat words? Mention specific good words or phrases used.
                4.  **Phát âm:** Comment on pronunciation, intonation, and clarity. Mention any specific words that were pronounced well or could be improved.
                5.  **Độ trôi chảy và liên kết ý:** Assess the fluency. Note any hesitations, pauses, or self-corrections. Comment on the use of fillers (e.g., "um", "ah").
                
                Based on this detailed analysis, provide a single numerical score (an integer from 0 to 5) and assign an overall CEFR level (e.g., A2.1, A2.2, B1.1, B1.2, B2).
                
                The feedback should be encouraging but also precise enough to help the student improve.`
            };


            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [audioPart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            feedback: { type: Type.STRING, description: "Constructive feedback in Vietnamese, analyzing the provided audio based on 5 APTIS criteria." },
                            score: { type: Type.NUMBER, description: "A single numerical score from 0 to 5." },
                            cefr: { type: Type.STRING, description: "The corresponding average CEFR level." }
                        },
                        required: ["feedback", "score", "cefr"],
                    },
                },
            });
            
            const parsedFeedback = JSON.parse(response.text);
            setAiFeedback(parsedFeedback);

        } catch (error) {
            console.error("Error getting AI feedback:", error);
            setAiFeedback({ feedback: "Đã có lỗi xảy ra khi phân tích âm thanh của bạn. Vui lòng thử lại.", score: 0, cefr: "N/A" });
        } finally {
            setIsEvaluating(false);
            setTestState('reviewing');
        }
    };

    const goToNextQuestion = () => {
        if (!aiFeedback || !audioUrl) return;

        const currentResult: Result = {
            questionId: practiceQueue[currentQuestionIndex].id,
            questionText: practiceQueue[currentQuestionIndex].text,
            audioUrl: audioUrl,
            ...aiFeedback,
        };
        setResults(prev => [...prev, currentResult]);
        
        setAudioUrl(null);
        setAiFeedback(null);
        
        if (currentQuestionIndex < practiceQueue.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTestState('practicing');
        } else {
            setTestState('finished');
        }
    };
    
    const tryAgain = () => {
        setAudioUrl(null);
        setAiFeedback(null);
        setTestState('practicing');
    };
    
    const exportResults = () => {
        const headers = "Question,Score,CEFR Level,Feedback";
        const rows = results.map(r => 
            `"${r.questionText.replace(/"/g, '""')}",${r.score},${r.cefr},"${r.feedback.replace(/"/g, '""')}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "aptis_speaking_part1_results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderContent = () => {
        if (testState === 'selecting') {
            return (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-dark dark:text-white">Prepare for Speaking Part 1</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">Select the questions you want to practice, then press start.</p>
                </div>
            );
        }
        
        if (testState === 'finished') {
            return (
                <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Practice Complete!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Well done! You have completed all selected questions. You can review your results on the right panel.</p>
                    <div className="flex justify-center space-x-4">
                        <button onClick={() => setTestState('selecting')} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark transition-colors">Practice Again</button>
                        <button onClick={onBack} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Back to Speaking Menu</button>
                    </div>
                </div>
            )
        }

        const currentQuestion = practiceQueue[currentQuestionIndex];
        return (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg h-full flex flex-col justify-between">
                <div>
                    <p className="text-sm font-semibold text-secondary">Question {currentQuestionIndex + 1} of {practiceQueue.length}</p>
                    <h3 className="text-2xl font-bold text-dark dark:text-white mt-2 mb-4">{currentQuestion.text}</h3>
                    
                    <div className="my-6 flex flex-col items-center">
                       <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                                <circle className="text-slate-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                                <circle 
                                    className="text-primary" 
                                    strokeWidth="8" 
                                    strokeDasharray={2 * Math.PI * 45} 
                                    strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft / 30)}
                                    strokeLinecap="round" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="45" cx="50" cy="50" 
                                    style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear'}}
                                />
                            </svg>
                             <span className="text-3xl font-bold text-dark dark:text-white">{timeLeft}s</span>
                        </div>
                        
                        {!isRecording && testState === 'practicing' && (
                             <button onClick={startRecording} className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                <span>Start Recording</span>
                            </button>
                        )}
                         {isRecording && (
                             <button onClick={stopRecording} className="mt-4 px-6 py-3 bg-slate-700 text-white font-semibold rounded-full shadow-lg hover:bg-slate-800 transition-all flex items-center space-x-2 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM10 8h4v8h-4z"/></svg>
                                <span>Stop</span>
                            </button>
                        )}
                    </div>
                </div>

                {(testState === 'evaluating' || testState === 'reviewing') && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        {audioUrl && (
                             <div className="mb-4">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Your Answer:</p>
                                <audio controls src={audioUrl} className="w-full"></audio>
                            </div>
                        )}
                        {isEvaluating && <p className="text-center text-primary animate-pulse">Evaluating your response...</p>}
                        {aiFeedback && !isEvaluating && (
                            <div>
                                <h4 className="text-lg font-bold text-dark dark:text-white">AI Feedback</h4>
                                <div className="flex items-center space-x-4 my-2">
                                    <span className="px-3 py-1 bg-secondary text-white text-sm font-bold rounded-full">Score: {aiFeedback.score}/5</span>
                                    <span className="px-3 py-1 bg-accent text-dark text-sm font-bold rounded-full">CEFR: {aiFeedback.cefr}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{aiFeedback.feedback}</p>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button onClick={tryAgain} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Try Again</button>
                                    <button onClick={goToNextQuestion} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-dark">
                                        {currentQuestionIndex < practiceQueue.length - 1 ? 'Next Question' : 'Finish'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    };
    
    return (
        <div>
            <BackButton onClick={testState === 'selecting' ? onBack : () => setTestState('selecting')} text={testState === 'selecting' ? "Back to Speaking Menu" : "Back to Question Selection"}/>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* Left Panel: Question Selection */}
                <div className={`lg:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg ${testState !== 'selecting' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Select Questions</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <button onClick={selectAll} className="text-xs px-2 py-1 bg-primary text-white rounded">All</button>
                        <button onClick={() => selectGroup(1, 10)} className="text-xs px-2 py-1 bg-secondary text-white rounded">1-10</button>
                        <button onClick={() => selectGroup(11, 20)} className="text-xs px-2 py-1 bg-secondary text-white rounded">11-20</button>
                        <button onClick={() => selectGroup(21, 37)} className="text-xs px-2 py-1 bg-secondary text-white rounded">21+</button>
                        <button onClick={() => setSelectedIds(new Set())} className="text-xs px-2 py-1 bg-slate-300 dark:bg-slate-600 rounded">Clear</button>
                    </div>
                    <div className="h-96 overflow-y-auto pr-2">
                        {speakingPart1Questions.map(q => (
                            <div key={q.id} className="flex items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                                <input
                                    type="checkbox"
                                    id={`q-${q.id}`}
                                    checked={selectedIds.has(q.id)}
                                    onChange={() => handleSelectionChange(q.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-secondary"
                                />
                                <label htmlFor={`q-${q.id}`} className="ml-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">{q.id}. {q.text}</label>
                            </div>
                        ))}
                    </div>
                     <button onClick={startPractice} disabled={selectedIds.size === 0} className="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                        Start Practice ({selectedIds.size} selected)
                    </button>
                </div>

                {/* Main Panel: Practice Area */}
                <div className="lg:col-span-2">
                    {renderContent()}
                </div>

                {/* Right Panel: Score Summary */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Score Summary</h3>
                    <div className="mb-4">
                        <CEFRChart />
                    </div>
                    {results.length > 0 && 
                        <button onClick={exportResults} className="w-full text-sm mb-4 px-3 py-2 bg-primary text-white rounded-lg hover:bg-dark">Export Results (CSV)</button>
                    }
                    <div className="h-96 overflow-y-auto space-y-3">
                        {results.length > 0 ? results.map(r => (
                            <div key={r.questionId} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{r.questionText}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs font-bold px-2 py-0.5 bg-secondary text-white rounded-full">Score: {r.score}</span>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-accent text-dark rounded-full">{r.cefr}</span>
                                </div>
                            </div>
                        )).reverse() : (
                             <p className="text-sm text-slate-500 dark:text-slate-400 text-center pt-8">Your results will appear here after you complete each question.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeakingPart1Practice;