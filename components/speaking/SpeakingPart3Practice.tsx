
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { speakingPart3Questions, Part3QuestionSet } from '../../lib/part3questions';

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
    audioUrls: string[];
    feedback: string;
    score: number;
    cefr: string;
}

type TestState = 'selecting' | 'practicing' | 'evaluating' | 'reviewing' | 'finished';

const BackButton: React.FC<{ onClick: () => void; text: string; }> = ({ onClick, text }) => (
    <button onClick={onClick} className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        {text}
    </button>
);

const SpeakingPart3Practice: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [practiceQueue, setPracticeQueue] = useState<Part3QuestionSet[]>([]);
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [currentQuestionInTopicIndex, setCurrentQuestionInTopicIndex] = useState(0);
    const [results, setResults] = useState<Result[]>([]);
    const [testState, setTestState] = useState<TestState>('selecting');

    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    
    const [currentTopicAudio, setCurrentTopicAudio] = useState<string[]>([]);
    const [currentTopicAudioBlobs, setCurrentTopicAudioBlobs] = useState<Blob[]>([]);
    const [aiFeedback, setAiFeedback] = useState<{ feedback: string; score: number; cefr: string } | null>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    
    const [generatedImageUrls, setGeneratedImageUrls] = useState<[string | null, string | null]>([null, null]);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);

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
        const groupIds = speakingPart3Questions.filter(q => q.id >= start && q.id <= end).map(q => q.id);
        setSelectedIds(prev => new Set([...prev, ...groupIds]));
    };

    const selectAll = () => setSelectedIds(new Set(speakingPart3Questions.map(q => q.id)));

    const startPractice = async () => {
        if (selectedIds.size === 0) {
            alert('Please select at least one topic to practice.');
            return;
        }
        const queue = speakingPart3Questions.filter(q => selectedIds.has(q.id));
        setPracticeQueue(shuffleArray(queue));
        setCurrentTopicIndex(0);
        setCurrentQuestionInTopicIndex(0);
        setResults([]);
        setTestState('practicing');
        await generateImagesForTopic(queue[0]);
    };
    
    const generateImagesForTopic = async (topic: Part3QuestionSet) => {
        setIsGeneratingImages(true);
        setGeneratedImageUrls([null, null]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Split topic into two prompts for comparison
            const prompts = topic.topic.split(/[\/&]| or /).map(s => s.trim());
            const prompt1 = prompts[0] || "first scene";
            const prompt2 = prompts[1] || "second contrasting scene";

            const generate = async (p: string) => {
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: `A photorealistic image depicting: ${p}. The image should be suitable for a side-by-side comparison.`,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '3:4', // Portrait aspect ratio to fit side-by-side
                    },
                });
                if (response.generatedImages && response.generatedImages.length > 0) {
                    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                    return `data:image/jpeg;base64,${base64ImageBytes}`;
                }
                return null;
            };

            const [url1, url2] = await Promise.all([generate(prompt1), generate(prompt2)]);
            setGeneratedImageUrls([url1, url2]);

        } catch (error) {
            console.error("Error generating images:", error);
            setGeneratedImageUrls(["https://placehold.co/400x300/e2e8f0/475569?text=Error", "https://placehold.co/400x300/e2e8f0/475569?text=Error"]);
        } finally {
            setIsGeneratingImages(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = event => audioChunksRef.current.push(event.data);
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setCurrentTopicAudio(prev => [...prev, url]);
                
                const updatedBlobs = [...currentTopicAudioBlobs, audioBlob];
                setCurrentTopicAudioBlobs(updatedBlobs);

                stream.getTracks().forEach(track => track.stop());
                
                if (currentQuestionInTopicIndex < (practiceQueue[currentTopicIndex].questions.length - 1)) {
                    setCurrentQuestionInTopicIndex(prev => prev + 1);
                    setTestState('practicing');
                } else {
                    setTestState('evaluating');
                    getAIFeedback(updatedBlobs);
                }
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTimeLeft(45);
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
        }
    };

    const getAIFeedback = async (allAudioBlobs: Blob[]) => {
        setIsEvaluating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const currentTopic = practiceQueue[currentTopicIndex];
            
            const audioParts = await Promise.all(
                allAudioBlobs.map(async (blob) => ({
                    inlineData: {
                        mimeType: 'audio/wav',
                        data: await blobToBase64(blob),
                    },
                }))
            );

            const textPart = {
                text: `You are an expert English examiner for the official APTIS test. A student has provided audio responses for a Speaking Part 3 task, which involves describing and comparing two images.
    
                The topic was: "${currentTopic.topic}".
                The questions and their corresponding audio parts are:
                1. "${currentTopic.questions[0]}" (audio 1)
                ${currentTopic.questions[1] ? `2. "${currentTopic.questions[1]}" (audio 2)` : ""}
                ${currentTopic.questions[2] ? `3. "${currentTopic.questions[2]}" (audio 3)` : ""}
                
                Please analyze all the spoken audio responses provided. Pay close attention to how well the student compares and contrasts the two scenes.
                
                Provide a single, combined, constructive evaluation in VIETNAMESE ONLY. Your feedback should be specific, based directly on the audio, and not a generic template.
                
                Your evaluation must cover these five official APTIS criteria, with a special focus on comparative language:
                1.  **Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề:** Did the student effectively describe BOTH images and answer the comparison/opinion questions?
                2.  **Ngữ pháp và độ chính xác:** Analyze grammar. Did they use comparative structures correctly (e.g., "-er than", "more...than", "while", "whereas")? Note specific examples.
                3.  **Từ vựng và mức độ phù hợp:** Comment on the vocabulary used for description and comparison.
                4.  **Phát âm:** Comment on overall pronunciation, intonation, and clarity.
                5.  **Độ trôi chảy và liên kết ý:** Assess fluency and coherence. How well did they transition between describing one image and the other? Did they use linking words for comparison?
                
                Based on this detailed analysis, provide a single numerical score (an integer from 0 to 5) and assign an overall CEFR level (e.g., A2.1, B1.2, B2).
                
                The feedback should be encouraging but precise, offering concrete advice on how to improve their comparative speaking skills.`
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [...audioParts, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            feedback: { type: Type.STRING, description: "Constructive feedback in Vietnamese, covering all 5 required areas with a focus on comparison skills based on the audio." },
                            score: { type: Type.NUMBER, description: "A single numerical score from 0 to 5." },
                            cefr: { type: Type.STRING, description: "The corresponding average CEFR level." }
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
                audioUrls: currentTopicAudio,
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

    const goToNextTopic = async () => {
        setCurrentTopicAudio([]);
        setCurrentTopicAudioBlobs([]);
        setAiFeedback(null);
        if (currentTopicIndex < practiceQueue.length - 1) {
            const nextIndex = currentTopicIndex + 1;
            setCurrentTopicIndex(nextIndex);
            setCurrentQuestionInTopicIndex(0);
            setTestState('practicing');
            await generateImagesForTopic(practiceQueue[nextIndex]);
        } else {
            setTestState('finished');
        }
    };
    
    const tryAgain = async () => {
        setCurrentTopicAudio([]);
        setCurrentTopicAudioBlobs([]);
        setAiFeedback(null);
        setCurrentQuestionInTopicIndex(0);
        setTestState('practicing');
        await generateImagesForTopic(practiceQueue[currentTopicIndex]);
    };

    const renderPracticeContent = () => {
        const currentTopic = practiceQueue[currentTopicIndex];
        const currentQuestionText = currentTopic.questions[currentQuestionInTopicIndex];
        
        return (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg h-full flex flex-col">
                <p className="text-sm font-semibold text-secondary">Topic {currentTopicIndex + 1} of {practiceQueue.length} - Question {currentQuestionInTopicIndex + 1} of {currentTopic.questions.length}</p>
                <h3 className="text-xl font-bold text-dark dark:text-white mt-1 mb-4">{currentTopic.topic}</h3>
                
                <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {isGeneratingImages ? <p className="animate-pulse text-slate-500">Generating Images...</p> : 
                     <div className="flex w-full h-full">
                        <div className="w-1/2 h-full bg-slate-300 dark:bg-slate-600">{generatedImageUrls[0] && <img src={generatedImageUrls[0]} alt={currentTopic.topic.split('/')[0]} className="w-full h-full object-cover" />}</div>
                        <div className="w-1/2 h-full bg-slate-400 dark:bg-slate-500">{generatedImageUrls[1] && <img src={generatedImageUrls[1]} alt={currentTopic.topic.split('/')[1]} className="w-full h-full object-cover" />}</div>
                     </div>
                    }
                </div>

                <div className="text-center my-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-md">
                    <p className="text-lg font-semibold text-dark dark:text-white">{currentQuestionText}</p>
                </div>

                <div className="mt-auto flex flex-col items-center">
                   <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-slate-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle className="text-primary" strokeWidth="8" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft / 45)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear'}}/>
                        </svg>
                         <span className="text-3xl font-bold text-dark dark:text-white">{timeLeft}s</span>
                    </div>
                    
                    {!isRecording ? (
                         <button onClick={startRecording} disabled={isGeneratingImages} className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 disabled:bg-slate-400 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            <span>Start Recording</span>
                        </button>
                    ) : (
                         <button onClick={stopRecording} className="mt-4 px-6 py-3 bg-slate-700 text-white font-semibold rounded-full shadow-lg hover:bg-slate-800 transition-all flex items-center space-x-2 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM10 8h4v8h-4z"/></svg>
                            <span>Stop</span>
                        </button>
                    )}
                </div>
            </div>
        )
    };
    
    const renderReviewContent = () => (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-dark dark:text-white">Topic Evaluation</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{practiceQueue[currentTopicIndex].topic}</p>
            
            <div className="mb-4">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Your Answers:</h4>
                <div className="space-y-2">
                    {currentTopicAudio.map((url, i) => (
                        <div key={i}>
                            <p className="text-xs text-slate-500">Question {i+1}</p>
                            <audio controls src={url} className="w-full h-10"></audio>
                        </div>
                    ))}
                </div>
            </div>

            {isEvaluating && <p className="text-center text-primary animate-pulse">Đang phân tích câu trả lời của bạn...</p>}
            {aiFeedback && !isEvaluating && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <h4 className="text-lg font-bold text-dark dark:text-white">Phản hồi từ AI</h4>
                    <div className="flex items-center space-x-4 my-2">
                        <span className="px-3 py-1 bg-secondary text-white text-sm font-bold rounded-full">Điểm: {aiFeedback.score}/5</span>
                        <span className="px-3 py-1 bg-accent text-dark text-sm font-bold rounded-full">CEFR: {aiFeedback.cefr}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{aiFeedback.feedback}</p>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={tryAgain} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Thử lại</button>
                        <button onClick={goToNextTopic} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-dark">
                            {currentTopicIndex < practiceQueue.length - 1 ? 'Chủ đề tiếp theo' : 'Hoàn thành'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
    const renderMainContent = () => {
        switch(testState) {
            case 'selecting': return <div className="text-center p-8"><h2 className="text-3xl font-bold text-dark dark:text-white">Prepare for Speaking Part 3</h2><p className="text-slate-600 dark:text-slate-300 mt-2">Select topics to compare two images and answer related questions.</p></div>;
            case 'practicing': return renderPracticeContent();
            case 'evaluating':
            case 'reviewing': return renderReviewContent();
            case 'finished': return <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg"><h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Practice Complete!</h2><p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Excellent work! You've finished all selected topics.</p><div className="flex justify-center space-x-4"><button onClick={() => setTestState('selecting')} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark transition-colors">Practice Again</button><button onClick={onBack} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-600">Back to Speaking Menu</button></div></div>;
        }
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
                        <button onClick={() => selectGroup(11, 20)} className="text-xs px-2 py-1 bg-secondary text-white rounded">11-20</button>
                        <button onClick={() => selectGroup(21, 43)} className="text-xs px-2 py-1 bg-secondary text-white rounded">21+</button>
                        <button onClick={() => setSelectedIds(new Set())} className="text-xs px-2 py-1 bg-slate-300 dark:bg-slate-600 rounded">Clear</button>
                    </div>
                    <div className="h-96 overflow-y-auto pr-2">
                        {speakingPart3Questions.map(q => (
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

export default SpeakingPart3Practice;
