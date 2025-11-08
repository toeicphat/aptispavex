
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { speakingPart4Questions, Part4QuestionSet } from '../../lib/part4questions';

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

interface Result {
    topicId: number;
    topicText: string;
    audioUrl: string;
    feedback: string;
    score: number;
    cefr: string;
}

type TestState = 'selecting' | 'preparing' | 'speaking' | 'evaluating' | 'reviewing' | 'finished';

const BackButton: React.FC<{ onClick: () => void; text: string; }> = ({ onClick, text }) => (
    <button onClick={onClick} className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        {text}
    </button>
);

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const SpeakingPart4Practice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [practiceQueue, setPracticeQueue] = useState<Part4QuestionSet[]>([]);
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [results, setResults] = useState<Result[]>([]);
    const [testState, setTestState] = useState<TestState>('selecting');

    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [aiFeedback, setAiFeedback] = useState<{ feedback: string; score: number; cefr: string } | null>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);
    
    const handleSelectionChange = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };
    
    const selectGroup = (start: number, end: number) => {
        const groupIds = speakingPart4Questions.filter(q => q.id >= start && q.id <= end).map(q => q.id);
        setSelectedIds(prev => new Set([...prev, ...groupIds]));
    };

    const selectAll = () => setSelectedIds(new Set(speakingPart4Questions.map(q => q.id)));

    const startPractice = () => {
        if (selectedIds.size === 0) {
            alert('Please select at least one topic to practice.');
            return;
        }
        const queue = speakingPart4Questions.filter(q => selectedIds.has(q.id));
        setPracticeQueue(shuffleArray(queue));
        setCurrentTopicIndex(0);
        setResults([]);
        setTestState('preparing');
        setTimeLeft(60);
        timerRef.current = null; // Reset timer ref for new practice
    };

    const startPreparationTimer = () => {
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startSpeakingPhase = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeLeft(120);
        setTestState('speaking');
        startRecording();
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = event => audioChunksRef.current.push(event.data);
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
                getAIFeedback(blob);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
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
            alert("Could not access microphone. Check permissions.");
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

    const getAIFeedback = async (blob: Blob) => {
        setIsEvaluating(true);
        try {
const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GOOGLE_API_KEY});
            const currentTopic = practiceQueue[currentTopicIndex];
            const audioBase64 = await blobToBase64(blob);

            const audioPart = { inlineData: { mimeType: 'audio/wav', data: audioBase64 } };
            const textPart = {
                text: `You are an expert English examiner for the official APTIS test, specializing in Speaking Part 4. A student has provided a single, continuous audio response to three questions on an abstract topic.
    
                The topic was: "${currentTopic.topic}".
                The questions were:
                1. "${currentTopic.questions[0]}"
                2. "${currentTopic.questions[1]}"
                3. "${currentTopic.questions[2]}"
                
                Please analyze the entire spoken audio response.
                
                Provide a detailed, constructive evaluation in VIETNAMESE ONLY.
                
                Your evaluation must cover these five official APTIS criteria:
                1.  **Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề:** Did the student address all three questions and develop their ideas?
                2.  **Ngữ pháp và độ chính xác:** Analyze the range and accuracy of grammatical structures. Look for complex sentences and note any significant errors.
                3.  **Từ vựng và mức độ phù hợp:** Comment on the vocabulary for discussing abstract topics.
                4.  **Phát âm:** Assess overall clarity, intonation, and pronunciation.
                5.  **Độ trôi chảy và mạch lạc của bài nói:** Evaluate fluency, coherence, and the use of cohesive devices to structure their long-form answer.
                
                Based on this analysis, provide a single numerical score on a scale of 0 to 6 and assign an overall CEFR level (from B1.1 to C2).`
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [audioPart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            feedback: { type: Type.STRING },
                            score: { type: Type.NUMBER },
                            cefr: { type: Type.STRING }
                        },
                        required: ["feedback", "score", "cefr"],
                    },
                },
            });

            const parsedFeedback = JSON.parse(response.text);
            setAiFeedback(parsedFeedback);
            
            const currentResult: Result = {
                topicId: currentTopic.id,
                topicText: currentTopic.topic,
                audioUrl: audioUrl!,
                ...parsedFeedback,
            };
            setResults(prev => [...prev, currentResult]);
            
        } catch (error) {
            console.error("Error getting AI feedback:", error);
            setAiFeedback({ feedback: "Đã có lỗi xảy ra khi phân tích âm thanh của bạn. Vui lòng thử lại.", score: 0, cefr: "N/A" });
        } finally {
            setIsEvaluating(false);
            setTestState('reviewing');
        }
    };

    const goToNextTopic = () => {
        setAudioUrl(null);
        setAudioBlob(null);
        setAiFeedback(null);
        if (currentTopicIndex < practiceQueue.length - 1) {
            setCurrentTopicIndex(prev => prev + 1);
            setTimeLeft(60);
            setTestState('preparing');
            timerRef.current = null; // Reset timer
        } else {
            setTestState('finished');
        }
    };
    
    const tryAgain = () => {
        setAudioUrl(null);
        setAudioBlob(null);
        setAiFeedback(null);
        setTimeLeft(60);
        setTestState('preparing');
        timerRef.current = null; // Reset timer
    };

    const renderMainContent = () => {
        if (testState === 'selecting') {
            return <div className="text-center p-8"><h2 className="text-3xl font-bold text-dark dark:text-white">Prepare for Speaking Part 4</h2><p className="text-slate-600 dark:text-slate-300 mt-2">Select a topic, prepare for 1 minute, then speak for 2 minutes.</p></div>;
        }
        
        const currentTopic = practiceQueue[currentTopicIndex];

        if (testState === 'preparing') {
             return (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-center">
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Preparation Time</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">You have 1 minute to prepare your answers for the following questions. Make notes on paper.</p>
                    <div className="my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-left space-y-2">
                         {currentTopic.questions.map((q, i) => <p key={i} className="text-slate-800 dark:text-slate-200"><strong>{i+1}.</strong> {q}</p>)}
                    </div>
                    <div className="text-5xl font-bold text-primary my-4">{formatTime(timeLeft)}</div>
                    
                    {/* Button to start the preparation timer */}
                    {!timerRef.current && (
                        <button onClick={startPreparationTimer} className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark">
                            Bắt đầu ghi chú
                        </button>
                    )}

                    {/* Button shown WHILE the timer is running */}
                    {timerRef.current && timeLeft > 0 && (
                         <button onClick={startSpeakingPhase} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                            Start Speaking Now
                        </button>
                    )}
                    
                    {/* Button shown AFTER the timer has finished */}
                    {timeLeft === 0 && (
                        <button onClick={startSpeakingPhase} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 animate-pulse">
                            Start Speaking
                        </button>
                    )}
                </div>
            );
        }

        if (testState === 'speaking') {
            return (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-center">
                     <h3 className="text-2xl font-bold text-dark dark:text-white">Recording...</h3>
                     <p className="text-slate-600 dark:text-slate-300 mt-1">Please answer all three questions.</p>
                     <div className="my-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-left text-sm space-y-1">
                         {currentTopic.questions.map((q, i) => <p key={i} className="text-slate-700 dark:text-slate-300"><strong>{i+1}.</strong> {q}</p>)}
                    </div>
                     <div className="text-5xl font-bold text-red-600 my-4">{formatTime(timeLeft)}</div>
                     <button onClick={stopRecording} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 flex items-center space-x-2 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM10 8h4v8h-4z"/></svg>
                        <span>Stop</span>
                    </button>
                </div>
            );
        }

        if (testState === 'evaluating' || testState === 'reviewing') {
            return (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Topic Evaluation</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{currentTopic.topic}</p>
                    {audioUrl && <div className="mb-4"><h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Your Answer:</h4><audio controls src={audioUrl} className="w-full"></audio></div>}
                    {isEvaluating && <p className="text-center text-primary animate-pulse">Đang phân tích câu trả lời của bạn...</p>}
                    {aiFeedback && !isEvaluating && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <h4 className="text-lg font-bold text-dark dark:text-white">Phản hồi từ AI</h4>
                            <div className="flex items-center space-x-4 my-2">
                                <span className="px-3 py-1 bg-secondary text-white text-sm font-bold rounded-full">Điểm: {aiFeedback.score}/6</span>
                                <span className="px-3 py-1 bg-accent text-dark text-sm font-bold rounded-full">CEFR: {aiFeedback.cefr}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{aiFeedback.feedback}</p>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button onClick={tryAgain} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Thử lại</button>
                                <button onClick={goToNextTopic} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-dark">{currentTopicIndex < practiceQueue.length - 1 ? 'Chủ đề tiếp theo' : 'Hoàn thành'}</button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        
        if (testState === 'finished') {
             return <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg"><h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Practice Complete!</h2><p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Excellent work! You can export your results if needed.</p><div className="flex justify-center space-x-4"><button onClick={() => setTestState('selecting')} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark transition-colors">Practice Again</button><button onClick={onBack} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-600">Back to Speaking Menu</button></div></div>;
        }
        
        return null;
    }
    
    return (
        <div>
            <BackButton onClick={testState === 'selecting' ? onBack : () => setTestState('selecting')} text={testState === 'selecting' ? "Back to Speaking Menu" : "Back to Topic Selection"}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className={`lg:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg ${testState !== 'selecting' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-2">Select Topics</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <button onClick={selectAll} className="text-xs px-2 py-1 bg-primary text-white rounded">All</button>
                        <button onClick={() => selectGroup(1, 10)} className="text-xs px-2 py-1 bg-secondary text-white rounded">1-10</button>
                        <button onClick={() => selectGroup(11, 14)} className="text-xs px-2 py-1 bg-secondary text-white rounded">11-14</button>
                        <button onClick={() => setSelectedIds(new Set())} className="text-xs px-2 py-1 bg-slate-300 dark:bg-slate-600 rounded">Clear</button>
                    </div>
                    <div className="h-96 overflow-y-auto pr-2">
                        {speakingPart4Questions.map(q => (
                            <div key={q.id} className="flex items-center p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                                <input type="checkbox" id={`q-${q.id}`} checked={selectedIds.has(q.id)} onChange={() => handleSelectionChange(q.id)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-secondary"/>
                                <label htmlFor={`q-${q.id}`} className="ml-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">{q.id}. {q.topic}</label>
                            </div>
                        ))}
                    </div>
                     <button onClick={startPractice} disabled={selectedIds.size === 0} className="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">Start Practice ({selectedIds.size} selected)</button>
                </div>

                <div className="lg:col-span-2">
                    {renderMainContent()}
                </div>
            </div>
        </div>
    );
};

export default SpeakingPart4Practice;
