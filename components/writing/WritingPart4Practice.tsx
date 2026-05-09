

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FullTestPart } from './WritingFullTestPractice';

const scoreToCefrMapping: { [key: number]: string } = {
    5: 'B2+/C1',
    4: 'B2.1',
    3: 'B1.2',
    2: 'A2.2',
    1: 'A2.1',
    0: 'A1 or below'
};

type TestState = 'selecting' | 'practicing' | 'evaluating' | 'reviewed' | 'finished';

export interface Part4EmailFeedback { // Exported for use in WritingFullTestPractice
    score: number;
    feedback: {
        taskCompletionRelevance: string;
        grammarAccuracy: string;
        vocabularyRangeAppropriateness: string;
        coherenceCohesionOrganization: string;
        spellingPunctuationStyle: string;
    };
}

interface WritingPart4PracticeProps {
    onBack?: () => void; // Optional for standalone use
    onBackToFullTestMenu?: () => void; // For full test mode
    isFullTestMode?: boolean; // Flag to indicate if part of full test
    informalPrompt?: string; // Prompt for informal email, passed by parent in full test mode
    formalPrompt?: string; // Prompt for formal email, passed by parent in full test mode
    onSavePartProgress?: (informalPrompt: string, informalAnswer: string, formalPrompt: string, formalAnswer: string, feedback: { informalEmail: Part4EmailFeedback; formalEmail: Part4EmailFeedback } | null) => void; // For full test mode
    onCompletePart?: (nextPart: FullTestPart) => void; // For full test mode, signals completion and requests navigation
    initialInformalAnswer?: string; // For full test mode
    initialFormalAnswer?: string; // For full test mode
    currentFullTestPart?: 'part4'; // To inform about its position in the full test
    initialFeedback?: { informalEmail: Part4EmailFeedback; formalEmail: Part4EmailFeedback } | null; // For full test mode, to display if already evaluated
}

const WritingPart4Practice: React.FC<WritingPart4PracticeProps> = ({ onBack, onBackToFullTestMenu, isFullTestMode = false, informalPrompt: propInformalPrompt, formalPrompt: propFormalPrompt, onSavePartProgress, onCompletePart, initialInformalAnswer, initialFormalAnswer, currentFullTestPart, initialFeedback }) => {
    const [testState, setTestState] = useState<TestState>(isFullTestMode ? 'practicing' : 'selecting');
    const [timeLimit, setTimeLimit] = useState(isFullTestMode ? 0 : 1800); // Time limit is handled by parent in full test mode
    const [timeLeft, setTimeLeft] = useState(isFullTestMode ? 0 : 1800);
    
    const [informalPrompt, setInformalPrompt] = useState(propInformalPrompt || '');
    const [informalAnswer, setInformalAnswer] = useState(initialInformalAnswer || '');
    const [formalPrompt, setFormalPrompt] = useState(propFormalPrompt || '');
    const [formalAnswer, setFormalAnswer] = useState(initialFormalAnswer || '');

    const [results, setResults] = useState<{ informalEmail: Part4EmailFeedback; formalEmail: Part4EmailFeedback } | null>(initialFeedback || null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Initial setup for full test mode:
    useEffect(() => {
        if (isFullTestMode) {
            setTestState('practicing'); // Directly start practicing
            if (propInformalPrompt !== undefined) setInformalPrompt(propInformalPrompt);
            if (propFormalPrompt !== undefined) setFormalPrompt(propFormalPrompt);
            if (initialInformalAnswer !== undefined) setInformalAnswer(initialInformalAnswer);
            if (initialFormalAnswer !== undefined) setFormalAnswer(initialFormalAnswer);
            setResults(initialFeedback || null); // Use initial feedback if available
            if (initialFeedback) { // If feedback is already present, means it's been evaluated
                setTestState('reviewed');
            }
            // No internal timer in full test mode
        }
    }, [isFullTestMode, propInformalPrompt, propFormalPrompt, initialInformalAnswer, initialFormalAnswer, initialFeedback]);

    useEffect(() => {
        return () => {
            if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        };
    }, [isFullTestMode]);

    const startPractice = () => {
        if (!isFullTestMode) { // Only manage selection and timer in standalone mode
            setTimeLeft(timeLimit);
            setTestState('practicing');

            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else { // In full test mode, reset answers and use provided prompts
            setInformalAnswer(initialInformalAnswer || '');
            setFormalAnswer(initialFormalAnswer || '');
            setResults(null);
            setTestState('practicing');
        }
    };
    
    const handleReset = () => {
        setInformalPrompt('');
        setInformalAnswer('');
        setFormalPrompt('');
        setFormalAnswer('');
        setResults(null);
        startPractice();
    };

    const handleBackClick = () => {
        if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        if (isFullTestMode && onBackToFullTestMenu) {
            onBackToFullTestMenu();
        } else if (onBack) {
            onBack();
        }
    };

    const handleInformalPromptChange = (value: string) => {
        setInformalPrompt(value);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(value, informalAnswer, formalPrompt, formalAnswer, null); // Save prompts and answers
        }
    };

    const handleInformalAnswerChange = (value: string) => {
        setInformalAnswer(value);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(informalPrompt, value, formalPrompt, formalAnswer, null); // Save prompts and answers
        }
    };

    const handleFormalPromptChange = (value: string) => {
        setFormalPrompt(value);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(informalPrompt, informalAnswer, value, formalAnswer, null); // Save prompts and answers
        }
    };

    const handleFormalAnswerChange = (value: string) => {
        setFormalAnswer(value);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(informalPrompt, informalAnswer, formalPrompt, value, null); // Save prompts and answers
        }
    };


    const handleSubmit = async () => {
        if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        setTestState('evaluating');
        setIsEvaluating(true);

        if (!isFullTestMode) { // Perform AI evaluation only in standalone practice mode
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const textPart = {
                    text: `You are an expert English examiner for the official APTIS test. A student has submitted two emails for Aptis Writing Part 4.
                    
                    Please evaluate each email separately based on the official Aptis Writing Part 4 scoring criteria and provide a score and detailed, constructive feedback in VIETNAMESE for each.

                    **Email 1 (Informal):**
                    - Prompt ("Đề bài"): "${informalPrompt || '(not provided)'}"
                    - Answer ("Câu trả lời"): "${informalAnswer || '(no answer)'}"
                    - Word count requirement: 40-50 words.

                    **Email 2 (Formal):**
                    - Prompt ("Đề bài"): "${formalPrompt || '(not provided)'}"
                    - Answer ("Câu trả lời"): "${formalAnswer || '(no answer)'}"
                    - Word count requirement: 120-150 words.

                    **Provide your feedback for each email in a structured JSON format, covering the following criteria in VIETNAMESE:**
                    1.  **Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề (Task Completion / Topic Relevance):** Đánh giá xem email có hoàn thành nhiệm vụ và liên quan trực tiếp đến đề bài hay không. Nêu rõ những điểm tốt hoặc cần cải thiện.
                    2.  **Ngữ pháp và độ chính xác (Grammar and Accuracy):** Phân tích các cấu trúc ngữ pháp và độ chính xác. Nêu ví dụ cụ thể về lỗi ngữ pháp hoặc cấu trúc tốt.
                    3.  **Từ vựng và mức độ phù hợp (Vocabulary Range and Appropriateness):** Bình luận về sự đa dạng và phù hợp của từ vựng. Nêu từ/cụm từ hay hoặc cần thay đổi.
                    4.  **Mạch lạc, liên kết ý và tổ chức (Coherence, Cohesion & Organization):** Đánh giá cách các ý được sắp xếp, liên kết với nhau và cấu trúc tổng thể của email.
                    5.  **Chính tả, dấu câu và văn phong (Spelling, Punctuation & Style):** Nhận xét về lỗi chính tả, dấu câu và sự phù hợp của văn phong (trang trọng/không trang trọng).

                    **Scoring Rubric (0-5 scale):**
                    - 5 (B2+/C1): Clear, well-structured writing, correct style, good grammar and vocabulary.
                    - 4 (B2.1): Task completed, minor errors, adequate vocabulary range.
                    - 3 (B1.2): Addresses prompt, some lack of coherence or unnatural language.
                    - 2 (A2.2): Frequent grammar/vocabulary errors, underdeveloped response.
                    - 1 (A2.1): Short, many basic errors, unclear style.
                    - 0 (A1 or below): Insufficient, irrelevant, or meaningless.
                    
                    Ensure the feedback is encouraging but precise enough to help the student improve.`
                };

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [textPart] },
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                               informalEmail: { 
                                    type: Type.OBJECT,
                                    properties: {
                                        score: { type: Type.NUMBER },
                                        feedback: { 
                                            type: Type.OBJECT,
                                            properties: {
                                                taskCompletionRelevance: { type: Type.STRING },
                                                grammarAccuracy: { type: Type.STRING },
                                                vocabularyRangeAppropriateness: { type: Type.STRING },
                                                coherenceCohesionOrganization: { type: Type.STRING },
                                                spellingPunctuationStyle: { type: Type.STRING }
                                            },
                                            required: ["taskCompletionRelevance", "grammarAccuracy", "vocabularyRangeAppropriateness", "coherenceCohesionOrganization", "spellingPunctuationStyle"]
                                        }
                                    }
                               },
                               formalEmail: {
                                    type: Type.OBJECT,
                                    properties: {
                                        score: { type: Type.NUMBER },
                                        feedback: { 
                                            type: Type.OBJECT,
                                            properties: {
                                                taskCompletionRelevance: { type: Type.STRING },
                                                grammarAccuracy: { type: Type.STRING },
                                                vocabularyRangeAppropriateness: { type: Type.STRING },
                                                coherenceCohesionOrganization: { type: Type.STRING },
                                                spellingPunctuationStyle: { type: Type.STRING }
                                            },
                                            required: ["taskCompletionRelevance", "grammarAccuracy", "vocabularyRangeAppropriateness", "coherenceCohesionOrganization", "spellingPunctuationStyle"]
                                        }
                                    }
                               }
                            },
                            required: ["informalEmail", "formalEmail"],
                        },
                    },
                });

                const parsedResult = JSON.parse(response.text);
                setResults(parsedResult);

            } catch (error) {
                console.error("Error getting AI feedback:", error);
                const errorFeedback = { 
                    taskCompletionRelevance: "Lỗi phân tích.", 
                    grammarAccuracy: "Lỗi phân tích.", 
                    vocabularyRangeAppropriateness: "Lỗi phân tích.", 
                    coherenceCohesionOrganization: "Lỗi phân tích.", 
                    spellingPunctuationStyle: "Lỗi phân tích." 
                };
                const errorResult = {
                    informalEmail: { score: 0, feedback: errorFeedback },
                    formalEmail: { score: 0, feedback: errorFeedback }
                };
                setResults(errorResult);
            } finally {
                setIsEvaluating(false);
                setTestState('finished');
            }
        } else { // Full test mode: only save answers, defer evaluation
            if (onSavePartProgress) {
                onSavePartProgress(informalPrompt, informalAnswer, formalPrompt, formalAnswer, null); // Feedback is null, pending full test evaluation
            }
            setIsEvaluating(false);
            setTestState('reviewed'); // Transition to reviewed state, but feedback is pending
        }
    };
    
    const exportResults = () => {
        if (!results) return;
        let content = `APTIS Writing Part 4 Practice Results\n\n`;
        content += `--- EMAIL 1 (Informal) ---\n`;
        content += `Đề bài: ${informalPrompt}\n`;
        content += `Câu trả lời của bạn: ${informalAnswer}\n`;
        content += `Điểm: ${results.informalEmail.score}/5 (${scoreToCefrMapping[results.informalEmail.score]})\n`;
        content += `\n**Nhận xét chi tiết:**\n`;
        content += `- Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề: ${results.informalEmail.feedback.taskCompletionRelevance}\n`;
        content += `- Ngữ pháp và độ chính xác: ${results.informalEmail.feedback.grammarAccuracy}\n`;
        content += `- Từ vựng và mức độ phù hợp: ${results.informalEmail.feedback.vocabularyRangeAppropriateness}\n`;
        content += `- Mạch lạc, liên kết ý và tổ chức: ${results.informalEmail.feedback.coherenceCohesionOrganization}\n`;
        content += `- Chính tả, dấu câu và văn phong: ${results.informalEmail.feedback.spellingPunctuationStyle}\n`;

        content += `\n--- EMAIL 2 (Formal) ---\n`;
        content += `Đề bài: ${formalPrompt}\n`;
        content += `Câu trả lời của bạn: ${formalAnswer}\n`;
        content += `Điểm: ${results.formalEmail.score}/5 (${scoreToCefrMapping[results.formalEmail.score]})\n`;
        content += `\n**Nhận xét chi tiết:**\n`;
        content += `- Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề: ${results.formalEmail.feedback.taskCompletionRelevance}\n`;
        content += `- Ngữ pháp và độ chính xác: ${results.formalEmail.feedback.grammarAccuracy}\n`;
        content += `- Từ vựng và mức độ phù hợp: ${results.formalEmail.feedback.vocabularyRangeAppropriateness}\n`;
        content += `- Mạch lạc, liên kết ý và tổ chức: ${results.formalEmail.feedback.coherenceCohesionOrganization}\n`;
        content += `- Chính tả, dấu câu và văn phong: ${results.formalEmail.feedback.spellingPunctuationStyle}\n`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aptis_writing_part4_results.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const FeedbackSection: React.FC<{ title: string; feedback: Part4EmailFeedback['feedback'] | null; isFullTestMode: boolean }> = ({ title, feedback, isFullTestMode }) => {
        if (isFullTestMode && !feedback) {
            return (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <p className="text-yellow-700 dark:text-yellow-300">Bài làm của bạn đã được lưu. Phản hồi chi tiết sẽ có sau khi hoàn thành toàn bộ bài kiểm tra.</p>
                </div>
            );
        }
        if (!feedback) return null;
        return (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-bold text-dark dark:text-white mb-2">{title}</h4>
                <div className="space-y-3 text-slate-700 dark:text-slate-200 text-sm">
                    <p><strong>Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề:</strong> {feedback.taskCompletionRelevance}</p>
                    <p><strong>Ngữ pháp và độ chính xác:</strong> {feedback.grammarAccuracy}</p>
                    <p><strong>Từ vựng và mức độ phù hợp:</strong> {feedback.vocabularyRangeAppropriateness}</p>
                    <p><strong>Mạch lạc, liên kết ý và tổ chức:</strong> {feedback.coherenceCohesionOrganization}</p>
                    <p><strong>Chính tả, dấu câu và văn phong:</strong> {feedback.spellingPunctuationStyle}</p>
                </div>
            </div>
        );
    };

    if (testState === 'selecting' && !isFullTestMode) {
        return (
            <div className="max-w-2xl mx-auto text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-dark dark:text-white">Aptis Writing Part 4 Practice</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Write an informal and a formal email based on your prompts. Choose a time limit to begin.</p>
                <div className="mb-6">
                    <label htmlFor="time-limit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Time Limit:</label>
                    <select
                        id="time-limit"
                        value={timeLimit / 60}
                        onChange={(e) => setTimeLimit(Number(e.target.value) * 60)}
                        className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-dark dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    >
                        {[20, 30, 40, 60].map(min => <option key={min} value={min}>{min} minutes</option>)}
                    </select>
                </div>
                <button onClick={startPractice} className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-dark transition-colors">
                    Start Practice
                </button>
                 <button onClick={onBack} className="w-full mt-4 text-sm text-slate-500 hover:underline">Back to Writing Menu</button>
            </div>
        );
    }
    
    if (testState === 'evaluating') {
        return (
            <div className="max-w-4xl mx-auto text-center p-8">
                <h2 className="text-3xl font-bold text-dark dark:text-white animate-pulse">Đang chấm bài...</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2">Vui lòng chờ trong khi giám khảo AI đánh giá bài viết của bạn.</p>
            </div>
        );
    }

    if ((testState === 'finished') && results && !isFullTestMode) { // Only show results screen in standalone mode
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-dark dark:text-white text-center mb-6">Kết quả</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Informal Email Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Email 1 (Không trang trọng)</h3>
                        <p className="text-2xl font-bold text-primary my-2">{results.informalEmail.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.informalEmail.score]}</span></p>
                        <FeedbackSection title="" feedback={results.informalEmail.feedback} isFullTestMode={false} />
                    </div>
                    {/* Formal Email Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Email 2 (Trang trọng)</h3>
                        <p className="text-2xl font-bold text-primary my-2">{results.formalEmail.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.formalEmail.score]}</span></p>
                        <FeedbackSection title="" feedback={results.formalEmail.feedback} isFullTestMode={false} />
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onClick={handleReset} className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Làm lại</button>
                    <button onClick={exportResults} className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-dark transition-colors">Xuất kết quả</button>
                </div>
                <button onClick={onBack} className="w-full mt-4 text-sm text-slate-500 hover:underline">Quay lại Menu Writing</button>
            </div>
        )
    }

    // New 'reviewed' state for full test mode
    if (testState === 'reviewed' && isFullTestMode) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-dark dark:text-white text-center mb-6">Kết quả Phần 4</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Informal Email Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Email 1 (Không trang trọng)</h3>
                        {results ? (
                            <p className="text-2xl font-bold text-primary my-2">{results.informalEmail.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.informalEmail.score]}</span></p>
                        ) : (
                            <p className="text-xl font-extrabold text-slate-500 my-2">Đang chờ đánh giá</p>
                        )}
                        <FeedbackSection title="" feedback={results?.informalEmail.feedback || null} isFullTestMode={isFullTestMode} />
                    </div>
                    {/* Formal Email Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Email 2 (Trang trọng)</h3>
                        {results ? (
                            <p className="text-2xl font-bold text-primary my-2">{results.formalEmail.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.formalEmail.score]}</span></p>
                        ) : (
                            <p className="text-xl font-extrabold text-slate-500 my-2">Đang chờ đánh giá</p>
                        )}
                        <FeedbackSection title="" feedback={results?.formalEmail.feedback || null} isFullTestMode={isFullTestMode} />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onClick={() => onCompletePart?.('finished')} className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark transition-colors">Hoàn thành bài kiểm tra</button>
                </div>
            </div>
        );
    }
    
    // Hide timer UI in full test mode
    const displayTimeSection = !isFullTestMode;
    const timeProgress = (timeLeft / timeLimit) * 100;


    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
             {displayTimeSection && (
                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${timeProgress}%` }}></div>
                </div>
             )}
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-dark dark:text-white">Aptis Writing Part 4 Practice</h2>
                 {displayTimeSection && (
                     <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Thời gian còn lại</p>
                        <p className="text-xl font-bold text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                    </div>
                 )}
            </div>
            {/* "Quay lại" button during practicing */}
            <button
                onClick={handleBackClick}
                className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
                aria-label="Quay lại"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quay lại
            </button>
            
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Informal Email */}
                <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="text-lg font-bold">✉️ Email 1 (Không trang trọng)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hãy viết đề bài và câu trả lời của bạn. <br/>⚠️ Giới hạn độ dài: khoảng 40–50 từ.</p>
                    <div>
                        <label className="block text-sm font-medium mb-1">Đề bài</label>
                        <textarea 
                            value={informalPrompt} 
                            onChange={e => handleInformalPromptChange(e.target.value)} 
                            rows={3} 
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Câu trả lời</label>
                        <textarea 
                            value={informalAnswer} 
                            onChange={e => handleInformalAnswerChange(e.target.value)} 
                            rows={5} 
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                </div>

                {/* Formal Email */}
                <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="text-lg font-bold">✉️ Email 2 (Trang trọng)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hãy viết đề bài và câu trả lời của bạn. <br/>⚠️ Giới hạn độ dài: khoảng 120–150 từ.</p>
                     <div>
                        <label className="block text-sm font-medium mb-1">Đề bài</label>
                        <textarea 
                            value={formalPrompt} 
                            onChange={e => handleFormalPromptChange(e.target.value)} 
                            rows={3} 
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Câu trả lời</label>
                        <textarea 
                            value={formalAnswer} 
                            onChange={e => handleFormalAnswerChange(e.target.value)} 
                            rows={10} 
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4 mt-6">
                 <button onClick={handleSubmit} className="flex-1 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Nộp bài</button>
                 {!isFullTestMode && ( // Hide reset in full test mode
                     <button onClick={handleReset} className="flex-1 px-6 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Làm lại</button>
                 )}
            </div>
        </div>
    );
};

export default WritingPart4Practice;