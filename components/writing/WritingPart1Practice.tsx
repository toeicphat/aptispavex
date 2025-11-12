

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { writingPart1Questions, Question } from '../../lib/writingQuestions';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const cefrMapping: { [key: number]: string } = {
    3: "Trên A1",
    2: "A1.2",
    1: "A1.1",
    0: "A0"
};

type TestState = 'selecting' | 'practicing' | 'evaluating' | 'reviewed' | 'finished';

export interface FeedbackContent { // Exported for use in WritingFullTestPractice
    taskCompletion: string;
    grammarAccuracy: string;
    vocabularyAppropriateness: string;
    spellingPunctuation: string;
}

interface WritingPart1PracticeProps {
    onBack?: () => void; // Optional for standalone use
    onBackToFullTestMenu?: () => void; // For full test mode
    isFullTestMode?: boolean; // Flag to indicate if part of full test
    onSavePartProgress?: (answers: string[], feedback: { score: number; feedback: FeedbackContent } | null) => void; // For full test mode, saves progress
    onCompletePart?: (nextPart: 'part2&3' | 'finished') => void; // For full test mode, signals completion and requests navigation
    initialAnswers?: string[]; // For full test mode
    currentFullTestPart?: 'part1'; // To inform about its position in the full test
    initialFeedback?: { score: number; feedback: FeedbackContent } | null; // For full test mode, to display if already evaluated
}

const WritingPart1Practice: React.FC<WritingPart1PracticeProps> = ({ onBack, onBackToFullTestMenu, isFullTestMode = false, onSavePartProgress, onCompletePart, initialAnswers, currentFullTestPart, initialFeedback }) => {
    const [testState, setTestState] = useState<TestState>(isFullTestMode ? 'practicing' : 'selecting');
    const [timeLimit, setTimeLimit] = useState(isFullTestMode ? 0 : 600); // Time limit is handled by parent in full test mode
    const [timeLeft, setTimeLeft] = useState(isFullTestMode ? 0 : 600);
    const [practiceQuestions, setPracticeQuestions] = useState<Question[]>(() => {
        // Always generate a new set for standalone, or use fixed for full test if needed
        return shuffleArray(writingPart1Questions).slice(0, 5);
    });
    const [userAnswers, setUserAnswers] = useState<string[]>(initialAnswers || new Array(5).fill(''));
    const [result, setResult] = useState<{ score: number; feedback: FeedbackContent } | null>(initialFeedback || null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Initial setup for full test mode:
    useEffect(() => {
        if (isFullTestMode) {
            setTestState('practicing'); // Directly start practicing
            setUserAnswers(initialAnswers || new Array(5).fill('')); // Use initial answers
            setResult(initialFeedback || null); // Use initial feedback if available
            if (initialFeedback) { // If feedback is already present, means it's been evaluated
                setTestState('reviewed');
            }
            // No internal timer in full test mode
        }
    }, [isFullTestMode, initialAnswers, initialFeedback]);

    useEffect(() => {
        return () => {
            if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        };
    }, [isFullTestMode]);

    const startPractice = (newSet = true) => {
        if (!isFullTestMode) { // Only manage selection and timer in standalone mode
            if (newSet) {
                const randomQuestions = shuffleArray(writingPart1Questions).slice(0, 5);
                setPracticeQuestions(randomQuestions);
                setUserAnswers(new Array(5).fill(''));
            } else {
                setUserAnswers(new Array(5).fill('')); // Reset answers for "Try Again"
            }
            
            setResult(null);
            setTimeLeft(timeLimit);
            setTestState('practicing');

            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        handleSubmit(); // Auto-submit when time is up
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const handleAnswerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = e.target.value;
        setUserAnswers(newAnswers);
        // In full test mode, save progress immediately, but no feedback yet
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(newAnswers, null); // Feedback is null until final evaluation
        }
    };

    const handleSubmit = async () => {
        if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        setTestState('evaluating');
        setIsEvaluating(true);

        if (!isFullTestMode) { // Perform AI evaluation only in standalone practice mode
            try {
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY
});
                const promptContent = practiceQuestions.map((q, i) => 
                    `${i + 1}. Question: "${q.text}" -> Answer: "${userAnswers[i] || '(no answer)'}"`
                ).join('\n');

                const textPart = {
                    text: `You are an expert English examiner for the official APTIS test. A student has provided 5 short answers (1-5 words each) for the Aptis Writing Part 1 task.
        
                    The questions and the student's answers are as follows:
                    ${promptContent}
                    
                    Please evaluate all 5 responses together based on the official Aptis Writing Part 1 scoring criteria. Your goal is to provide a single overall score and detailed, constructive feedback in VIETNAMESE.
                    
                    **Provide your feedback in a structured JSON format, covering the following criteria in VIETNAMESE:**
                    1.  **Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề (Task Completion / Topic Relevance):** Đánh giá xem câu trả lời có hoàn thành nhiệm vụ và liên quan trực tiếp đến đề bài hay không. Nêu rõ những điểm tốt hoặc cần cải thiện.
                    2.  **Ngữ pháp và độ chính xác (Grammar and Accuracy):** Phân tích các cấu trúc ngữ pháp và độ chính xác. Nêu ví dụ cụ thể về lỗi ngữ pháp hoặc cấu trúc tốt.
                    3.  **Từ vựng và mức độ phù hợp (Vocabulary Range and Appropriateness):** Bình luận về sự đa dạng và phù hợp của từ vựng. Nêu từ/cụm từ hay hoặc cần thay đổi.
                    4.  **Chính tả và dấu câu (Spelling and Punctuation):** Nhận xét về lỗi chính tả và dấu câu.
                    
                    **Use the following scoring logic:**
                    - Score 3 (Trên A1): The answers are complete, clear, and grammatically correct with correct spelling.
                    - Score 2 (A1.2): 3-4 answers are understandable, with minor errors that are acceptable.
                    - Score 1 (A1.1): Only 1-2 answers are correct, with many spelling/grammar mistakes.
                    - Score 0 (A0): No valid or meaningful answers.
                    
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
                                score: { type: Type.NUMBER, description: "A single numerical score from 0 to 3." },
                                feedback: { 
                                    type: Type.OBJECT,
                                    properties: {
                                        taskCompletion: { type: Type.STRING },
                                        grammarAccuracy: { type: Type.STRING },
                                        vocabularyAppropriateness: { type: Type.STRING },
                                        spellingPunctuation: { type: Type.STRING }
                                    },
                                    required: ["taskCompletion", "grammarAccuracy", "vocabularyAppropriateness", "spellingPunctuation"]
                                }
                            },
                            required: ["score", "feedback"],
                        },
                    },
                });

                const parsedResult = JSON.parse(response.text);
                setResult(parsedResult);
                
                // In full test mode, feedback is saved later
                if (onSavePartProgress) {
                    onSavePartProgress(userAnswers, parsedResult);
                }

            } catch (error) {
                console.error("Error getting AI feedback:", error);
                const errorFeedback = { 
                    taskCompletion: "Lỗi phân tích.", 
                    grammarAccuracy: "Lỗi phân tích.", 
                    vocabularyAppropriateness: "Lỗi phân tích.", 
                    spellingPunctuation: "Lỗi phân tích." 
                };
                const errorResult = { score: 0, feedback: errorFeedback };
                setResult(errorResult);
                if (onSavePartProgress) {
                    onSavePartProgress(userAnswers, errorResult);
                }
            } finally {
                setIsEvaluating(false);
                setTestState('finished');
            }
        } else { // Full test mode: only save answers, defer evaluation
            if (onSavePartProgress) {
                onSavePartProgress(userAnswers, null); // Feedback is null, pending full test evaluation
            }
            setIsEvaluating(false);
            setTestState('reviewed'); // Transition to reviewed state, but feedback is pending
        }
    };
    
    const exportResults = () => {
        if (!result) return;
        let content = `APTIS Writing Part 1 Practice Results\n\n`;
        content += `Overall Score: ${result.score}/3\n`;
        content += `CEFR Level: ${cefrMapping[result.score]}\n`;
        content += `\n**Nhận xét chi tiết:**\n`;
        content += `- Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề: ${result.feedback.taskCompletion}\n`;
        content += `- Ngữ pháp và độ chính xác: ${result.feedback.grammarAccuracy}\n`;
        content += `- Từ vựng và mức độ phù hợp: ${result.feedback.vocabularyAppropriateness}\n`;
        content += `- Chính tả và dấu câu: ${result.feedback.spellingPunctuation}\n`;
        content += `\n--------------------------------------\n\n`;
        practiceQuestions.forEach((q, i) => {
            content += `Question ${i+1}: ${q.text}\n`;
            content += `Your Answer: ${userAnswers[i] || '(No Answer)'}\n\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aptis_writing_part1_results.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleBackClick = () => {
        if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        if (isFullTestMode && onBackToFullTestMenu) {
            onBackToFullTestMenu();
        } else if (onBack) {
            onBack();
        }
    };

    const FeedbackSection: React.FC<{ feedback: FeedbackContent | null; isFullTestMode: boolean }> = ({ feedback, isFullTestMode }) => {
        if (isFullTestMode && !feedback) {
            return (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <p className="text-yellow-700 dark:text-yellow-300">Bài làm của bạn đã được lưu. Phản hồi chi tiết sẽ có sau khi hoàn thành toàn bộ bài kiểm tra.</p>
                </div>
            );
        }
        if (!feedback) return null; // Should not happen if not in full test mode, or if feedback is just null
        return (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <h3 className="font-bold text-dark dark:text-white mb-2">Phản hồi chi tiết (Tiếng Việt)</h3>
                <div className="space-y-3 text-slate-700 dark:text-slate-200 text-sm">
                    <p><strong>Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề:</strong> {feedback.taskCompletion}</p>
                    <p><strong>Ngữ pháp và độ chính xác:</strong> {feedback.grammarAccuracy}</p>
                    <p><strong>Từ vựng và mức độ phù hợp:</strong> {feedback.vocabularyAppropriateness}</p>
                    <p><strong>Chính tả và dấu câu:</strong> {feedback.spellingPunctuation}</p>
                </div>
            </div>
        );
    };

    if (testState === 'selecting' && !isFullTestMode) {
        return (
            <div className="max-w-2xl mx-auto text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-dark dark:text-white">Aptis Writing Part 1 Practice</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Respond to 5 short prompts using 1-5 words. Choose your time limit.</p>
                <div className="mb-6">
                    <label htmlFor="time-limit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Time Limit:</label>
                    <select
                        id="time-limit"
                        value={timeLimit / 60}
                        onChange={(e) => setTimeLimit(Number(e.target.value) * 60)}
                        className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-dark dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    >
                        {[5, 10, 15, 20, 25, 30].map(min => <option key={min} value={min}>{min} minutes</option>)}
                    </select>
                </div>
                <button onClick={() => startPractice(true)} className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-dark transition-colors">
                    Start Practice
                </button>
                 <button onClick={onBack} className="w-full mt-4 text-sm text-slate-500 hover:underline">Back to Writing Menu</button>
            </div>
        );
    }
    
    if (testState === 'evaluating') {
        return (
            <div className="max-w-2xl mx-auto text-center p-8">
                <h2 className="text-3xl font-bold text-dark dark:text-white animate-pulse">Evaluating your answers...</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2">Please wait while the AI examiner reviews your responses.</p>
            </div>
        );
    }

    if ((testState === 'finished') && result && !isFullTestMode) { // Only show results screen in standalone mode
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-dark dark:text-white text-center">Results</h2>
                <div className="text-center my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Your Score</p>
                    <p className="text-6xl font-extrabold text-primary my-2">{result.score}<span className="text-3xl font-bold text-slate-500">/3</span></p>
                    <p className="font-semibold px-3 py-1 bg-secondary text-white inline-block rounded-full text-sm">{cefrMapping[result.score]}</p>
                </div>
                <FeedbackSection feedback={result.feedback} isFullTestMode={false} />
                 <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onClick={() => startPractice(false)} className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-600 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Try Again (Same Questions)</button>
                    <button onClick={() => startPractice(true)} className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-dark transition-colors">New Random Set</button>
                </div>
                 <button onClick={exportResults} className="w-full mt-4 px-4 py-2 text-sm text-primary dark:text-secondary hover:underline">Export Results (.txt)</button>
                <button onClick={onBack} className="w-full mt-2 text-sm text-slate-500 hover:underline">Back to Writing Menu</button>
            </div>
        )
    }

    // New 'reviewed' state for full test mode
    if (testState === 'reviewed' && isFullTestMode) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-dark dark:text-white text-center">Kết quả Phần 1</h2>
                <div className="text-center my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Điểm của bạn</p>
                    {result ? (
                        <>
                            <p className="text-6xl font-extrabold text-primary my-2">{result.score}<span className="text-3xl font-bold text-slate-500">/3</span></p>
                            <p className="font-semibold px-3 py-1 bg-secondary text-white inline-block rounded-full text-sm">{cefrMapping[result.score]}</p>
                        </>
                    ) : (
                        <p className="text-3xl font-extrabold text-slate-500 my-2">Đang chờ đánh giá</p>
                    )}
                </div>
                <FeedbackSection feedback={result?.feedback || null} isFullTestMode={isFullTestMode} />
                 <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onClick={() => onCompletePart?.('part2&3')} className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark transition-colors">Tiếp theo: Phần 2 & 3</button>
                </div>
            </div>
        );
    }

    // Hide progress and timer UI in full test mode, parent manages it
    const displayTimerBar = !isFullTestMode && timeLeft > 0;
    const displayTimeLeft = !isFullTestMode && timeLeft > 0;

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
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
            {/* Timer Bar (Only in standalone mode) */}
            {displayTimerBar && (
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-2">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / timeLimit) * 100}%` }}></div>
                </div>
            )}
            {displayTimeLeft && (
                <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">
                    Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </p>
            )}

            <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-dark dark:text-white mt-2">Trả lời 5 câu hỏi sau:</h3>
            </div>
            
            <div className="space-y-6">
                {practiceQuestions.map((q, index) => (
                    <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-lg font-semibold text-dark dark:text-white mb-2">{index + 1}. {q.text}</p>
                        <input
                            type="text"
                            value={userAnswers[index]}
                            onChange={(e) => handleAnswerChange(index, e)}
                            placeholder="Type your answer (1-5 words)"
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-base text-left bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary"
                            maxLength={40} // Maintain word limit hint
                            aria-label={`Answer for question ${index + 1}`}
                        />
                    </div>
                ))}
            </div>

            {/* Submission Button */}
            <div className="flex justify-center items-center mt-8">
                <button onClick={handleSubmit} className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                    Nộp bài
                </button>
            </div>
        </div>
    );
};

export default WritingPart1Practice;
