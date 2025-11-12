

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FullTestPart } from './WritingFullTestPractice';

const scoreToCefrMapping: { [key: number]: string } = {
    5: 'B1+',
    4: 'A2.2',
    3: 'A2.1',
    2: 'A1.2',
    1: 'A1.1',
    0: 'A0'
};

type TestState = 'selecting' | 'practicing' | 'evaluating' | 'reviewed' | 'finished';

export interface Part2And3Feedback { // Exported for use in WritingFullTestPractice
    score: number;
    feedback: {
        taskCompletionRelevance: string;
        grammarAccuracy: string;
        vocabularyRangeAppropriateness: string;
        coherenceCohesionOrganization: string;
        spellingPunctuation: string;
    };
}

interface WritingPart2And3PracticeProps {
    onBack?: () => void; // Optional for standalone use
    onBackToFullTestMenu?: () => void; // For full test mode
    isFullTestMode?: boolean; // Flag to indicate if part of full test
    part2Question?: string; // Prompt for part 2, passed by parent in full test mode
    part3Questions?: string[]; // Prompts for part 3, passed by parent in full test mode
    onSavePartProgress?: (part2Question: string, part2Answer: string, part3Questions: string[], part3Answers: string[], feedback: { part2: Part2And3Feedback; part3: Part2And3Feedback } | null) => void; // For full test mode
    onCompletePart?: (nextPart: FullTestPart) => void; // For full test mode, signals completion and requests navigation
    initialPart2Answer?: string; // For full test mode
    initialPart3Answers?: string[]; // For full test mode
    currentFullTestPart?: 'part2&3'; // To inform about its position in the full test
    initialFeedback?: { part2: Part2And3Feedback; part3: Part2And3Feedback } | null; // For full test mode, to display if already evaluated
}

const WritingPart2And3Practice: React.FC<WritingPart2And3PracticeProps> = ({ onBack, onBackToFullTestMenu, isFullTestMode = false, part2Question: propPart2Question, part3Questions: propPart3Questions, onSavePartProgress, onCompletePart, initialPart2Answer, initialPart3Answers, currentFullTestPart, initialFeedback }) => {
    const [testState, setTestState] = useState<TestState>(isFullTestMode ? 'practicing' : 'selecting');
    const [timeLimit, setTimeLimit] = useState(isFullTestMode ? 0 : 600); // Time limit is handled by parent in full test mode
    const [timeLeft, setTimeLeft] = useState(isFullTestMode ? 0 : 600);
    
    const [part2Question, setPart2Question] = useState(propPart2Question || '');
    const [part2Answer, setPart2Answer] = useState(initialPart2Answer || '');
    
    // Part 3 now has 3 questions and 3 answers
    const [part3Questions, setPart3Questions] = useState(propPart3Questions || ['', '', '']);
    const [part3Answers, setPart3Answers] = useState(initialPart3Answers || ['', '', '']);

    const [results, setResults] = useState<{ part2: Part2And3Feedback; part3: Part2And3Feedback } | null>(initialFeedback || null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Initial setup for full test mode:
    useEffect(() => {
        if (isFullTestMode) {
            setTestState('practicing'); // Directly start practicing
            if (propPart2Question !== undefined) setPart2Question(propPart2Question);
            if (propPart3Questions !== undefined) setPart3Questions(propPart3Questions);
            if (initialPart2Answer !== undefined) setPart2Answer(initialPart2Answer);
            if (initialPart3Answers !== undefined) setPart3Answers(initialPart3Answers);
            setResults(initialFeedback || null); // Use initial feedback if available
            if (initialFeedback) { // If feedback is already present, means it's been evaluated
                setTestState('reviewed');
            }
            // No internal timer in full test mode
        }
    }, [isFullTestMode, propPart2Question, propPart3Questions, initialPart2Answer, initialPart3Answers, initialFeedback]);

    useEffect(() => {
        return () => {
            if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        };
    }, [isFullTestMode]);

    const startPractice = () => {
        if (!isFullTestMode) { // Only manage selection and timer in standalone mode
            setTimeLeft(timeLimit);
            setTestState('practicing');
            setPart2Question('');
            setPart2Answer('');
            setPart3Questions(['', '', '']); // Reset to 3 questions
            setPart3Answers(['', '', '']); // Reset to 3 answers
            setResults(null); // Clear previous results

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
            setPart2Answer(initialPart2Answer || '');
            setPart3Answers(initialPart3Answers || ['', '', '']); // Reset to 3 answers
            setResults(null);
            setTestState('practicing');
        }
    };
    
    const handleReset = () => {
        startPractice(); // Simply restart practice which also resets fields
    };

    const handleBackClick = () => {
        if (timerRef.current && !isFullTestMode) clearInterval(timerRef.current);
        if (isFullTestMode && onBackToFullTestMenu) {
            onBackToFullTestMenu();
        } else if (onBack) {
            onBack();
        }
    };

    const handlePart2QuestionChange = (value: string) => {
        setPart2Question(value);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(value, part2Answer, part3Questions, part3Answers, null); // Save prompt and answers
        }
    };

    const handlePart3QuestionChange = (index: number, value: string) => {
        const newQuestions = [...part3Questions];
        newQuestions[index] = value;
        setPart3Questions(newQuestions);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(part2Question, part2Answer, newQuestions, part3Answers, null); // Save prompt and answers
        }
    };

    const handlePart2AnswerChange = (value: string) => {
        setPart2Answer(value);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(part2Question, value, part3Questions, part3Answers, null); // Save prompt and answers
        }
    };

    const handlePart3AnswerChange = (index: number, value: string) => {
        const newAnswers = [...part3Answers];
        newAnswers[index] = value;
        setPart3Answers(newAnswers);
        if (isFullTestMode && onSavePartProgress) {
            onSavePartProgress(part2Question, part2Answer, part3Questions, newAnswers, null); // Save prompt and answers
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
                
                const part3PromptDetails = part3Questions.map((q, i) => `Question ${i + 1} ("Đề bài ${i + 1}"): "${q || '(not provided)'}"\nAnswer ${i + 1} ("Câu trả lời ${i + 1}"): "${part3Answers[i] || '(no answer)'}"`).join('\n');

                const textPart = {
                    text: `You are an expert English examiner for the official APTIS test. A student has submitted answers for Aptis Writing Part 2 and Part 3.
                    
                    Please evaluate each part separately based on the official Aptis Writing scoring criteria and provide a score and detailed, constructive feedback in VIETNAMESE for each.
                    
                    **Part 2 Submission:**
                    - Question ("Đề bài"): "${part2Question || '(not provided)'}"
                    - Answer ("Câu trả lời"): "${part2Answer || '(no answer)'}"
                    - Word count requirement: 20-30 words.
                    
                    **Part 3 Submission (3 questions and 3 answers):**
                    ${part3PromptDetails}
                    - Word count requirement for EACH answer: 30-40 words.
                    
                    **Provide your feedback for each part in a structured JSON format, covering the following criteria in VIETNAMESE:**
                    1.  **Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề (Task Completion / Topic Relevance):** Đánh giá xem câu trả lời có hoàn thành nhiệm vụ và liên quan trực tiếp đến đề bài hay không. Nêu rõ những điểm tốt hoặc cần cải thiện.
                    2.  **Ngữ pháp và độ chính xác (Grammar and Accuracy):** Phân tích các cấu trúc ngữ pháp và độ chính xác. Nêu ví dụ cụ thể về lỗi ngữ pháp hoặc cấu trúc tốt.
                    3.  **Từ vựng và mức độ phù hợp (Vocabulary Range and Appropriateness):** Bình luận về sự đa dạng và phù hợp của từ vựng. Nêu từ/cụm từ hay hoặc cần thay đổi.
                    4.  **Mạch lạc và liên kết ý (Coherence and Cohesion):** Đánh giá cách các ý được sắp xếp và kết nối với nhau, có sử dụng các từ nối hay không.
                    5.  **Chính tả và dấu câu (Spelling and Punctuation):** Nhận xét về lỗi chính tả và dấu câu.
                    
                    **Scoring Rubric (0-5 scale):**
                    - 5 (B1+): Fully answers the prompt, accurate grammar, clear ideas, good cohesion.
                    - 4 (A2.2): Simple structure, main ideas covered, minor errors don't impede understanding.
                    - 3 (A2.1): Understandable response but with grammatical errors, limited vocabulary.
                    - 2 (A1.2): Short response, unclear ideas, many spelling/grammar errors.
                    - 1 (A1.1): Lacks ideas, many errors making it hard to understand.
                    - 0 (A0): No meaningful or relevant response.
                    
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
                               part2: { 
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
                                                spellingPunctuation: { type: Type.STRING }
                                            },
                                            required: ["taskCompletionRelevance", "grammarAccuracy", "vocabularyRangeAppropriateness", "coherenceCohesionOrganization", "spellingPunctuation"]
                                        }
                                    }
                               },
                               part3: {
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
                                                spellingPunctuation: { type: Type.STRING }
                                            },
                                            required: ["taskCompletionRelevance", "grammarAccuracy", "vocabularyRangeAppropriateness", "coherenceCohesionOrganization", "spellingPunctuation"]
                                        }
                                    }
                               }
                            },
                            required: ["part2", "part3"],
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
                    spellingPunctuation: "Lỗi phân tích." 
                };
                const errorResult = {
                    part2: { score: 0, feedback: errorFeedback },
                    part3: { score: 0, feedback: errorFeedback }
                };
                setResults(errorResult);
            } finally {
                setIsEvaluating(false);
                setTestState('finished');
            }
        } else { // Full test mode: only save answers, defer evaluation
            if (onSavePartProgress) {
                onSavePartProgress(part2Question, part2Answer, part3Questions, part3Answers, null); // Feedback is null, pending full test evaluation
            }
            setIsEvaluating(false);
            setTestState('reviewed'); // Transition to reviewed state, but feedback is pending
        }
    };
    
    const exportResults = () => {
        if (!results) return;
        let content = `APTIS Writing Part 2 & 3 Practice Results\n\n`;
        content += `--- PHẦN 2 ---\n`;
        content += `Đề bài: ${part2Question}\n`;
        content += `Câu trả lời của bạn: ${part2Answer}\n`;
        content += `Điểm: ${results.part2.score}/5 (${scoreToCefrMapping[results.part2.score]})\n`;
        content += `\n**Nhận xét chi tiết:**\n`;
        content += `- Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề: ${results.part2.feedback.taskCompletionRelevance}\n`;
        content += `- Ngữ pháp và độ chính xác: ${results.part2.feedback.grammarAccuracy}\n`;
        content += `- Từ vựng và mức độ phù hợp: ${results.part2.feedback.vocabularyRangeAppropriateness}\n`;
        content += `- Mạch lạc và liên kết ý: ${results.part2.feedback.coherenceCohesionOrganization}\n`;
        content += `- Chính tả và dấu câu: ${results.part2.feedback.spellingPunctuation}\n`;
        
        content += `\n--- PHẦN 3 ---\n`;
        part3Questions.forEach((q, i) => { // Iterate only over the 3 questions
            content += `\nCâu hỏi ${i + 1}:\n`;
            content += `Đề bài: ${q}\n`;
            content += `Câu trả lời của bạn: ${part3Answers[i]}\n`;
        });
        content += `\nĐiểm tổng thể: ${results.part3.score}/5 (${scoreToCefrMapping[results.part3.score]})\n`;
        content += `\n**Nhận xét chi tiết:**\n`;
        content += `- Hoàn thành nhiệm vụ / Mức độ liên quan chủ đề: ${results.part3.feedback.taskCompletionRelevance}\n`;
        content += `- Ngữ pháp và độ chính xác: ${results.part3.feedback.grammarAccuracy}\n`;
        content += `- Từ vựng và mức độ phù hợp: ${results.part3.feedback.vocabularyRangeAppropriateness}\n`;
        content += `- Mạch lạc và liên kết ý: ${results.part3.feedback.coherenceCohesionOrganization}\n`;
        content += `- Chính tả và dấu câu: ${results.part3.feedback.spellingPunctuation}\n`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aptis_writing_part2_3_results.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const FeedbackSection: React.FC<{ title: string; feedback: Part2And3Feedback['feedback'] | null; isFullTestMode: boolean }> = ({ title, feedback, isFullTestMode }) => {
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
                    <p><strong>Mạch lạc và liên kết ý:</strong> {feedback.coherenceCohesionOrganization}</p>
                    <p><strong>Chính tả và dấu câu:</strong> {feedback.spellingPunctuation}</p>
                </div>
            </div>
        );
    };


    if (testState === 'selecting' && !isFullTestMode) {
        return (
            <div className="max-w-2xl mx-auto text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-dark dark:text-white">Aptis Writing Part 2 & 3 Practice</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Enter your prompts and answers for both parts, then submit for evaluation.</p>
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
                    {/* Part 2 Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Phần 2</h3>
                        <p className="text-2xl font-bold text-primary my-2">{results.part2.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.part2.score]}</span></p>
                        <FeedbackSection title="" feedback={results.part2.feedback} isFullTestMode={false} />
                    </div>
                    {/* Part 3 Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Phần 3 (Tổng thể)</h3>
                        <p className="text-2xl font-bold text-primary my-2">{results.part3.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.part3.score]}</span></p>
                        <FeedbackSection title="" feedback={results.part3.feedback} isFullTestMode={false} />
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
                <h2 className="text-3xl font-bold text-dark dark:text-white text-center mb-6">Kết quả Phần 2 & 3</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Part 2 Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Phần 2</h3>
                        {results ? (
                            <p className="text-2xl font-bold text-primary my-2">{results.part2.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.part2.score]}</span></p>
                        ) : (
                            <p className="text-xl font-extrabold text-slate-500 my-2">Đang chờ đánh giá</p>
                        )}
                        <FeedbackSection title="" feedback={results?.part2.feedback || null} isFullTestMode={isFullTestMode} />
                    </div>
                    {/* Part 3 Results */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-dark dark:text-white">Phần 3 (Tổng thể)</h3>
                        {results ? (
                            <p className="text-2xl font-bold text-primary my-2">{results.part3.score}<span className="text-lg font-semibold text-slate-500">/5</span> - <span className="text-lg font-semibold">{scoreToCefrMapping[results.part3.score]}</span></p>
                        ) : (
                            <p className="text-xl font-extrabold text-slate-500 my-2">Đang chờ đánh giá</p>
                        )}
                        <FeedbackSection title="" feedback={results?.part3.feedback || null} isFullTestMode={isFullTestMode} />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button onClick={() => onCompletePart?.('part4')} className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark transition-colors">Tiếp theo: Phần 4</button>
                </div>
            </div>
        );
    }

    // Hide time display in full test mode
    const displayTimeSection = !isFullTestMode;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
            {displayTimeSection && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Aptis Writing Part 2 & Part 3 Practice</h2>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Thời gian còn lại</p>
                        <p className="text-xl font-bold text-primary">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                    </div>
                </div>
            )}
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
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* Part 2 */}
                <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="text-lg font-bold">✍️ Phần 2: Hãy viết đề và câu trả lời của bạn.</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">⚠️ Giới hạn độ dài: khoảng 20–30 từ.</p>
                    <div>
                        <label className="block text-sm font-medium mb-1">Đề bài</label>
                        <textarea 
                            value={part2Question} 
                            onChange={e => handlePart2QuestionChange(e.target.value)} 
                            rows={2} 
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Câu trả lời</label>
                        <textarea 
                            value={part2Answer} 
                            onChange={e => handlePart2AnswerChange(e.target.value)} 
                            rows={3} 
                            className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                        ></textarea>
                    </div>
                </div>

                {/* Part 3 - Now with 3 questions and 3 answers */}
                <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h3 className="text-lg font-bold">✍️ Phần 3: Hãy viết đề và câu trả lời của bạn.</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">⚠️ Giới hạn độ dài: khoảng 30–40 từ MỖI câu trả lời.</p>
                    
                    {[0, 1, 2].map(index => (
                        <div key={index} className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4 first:border-t-0 first:pt-0">
                            <h4 className="font-semibold text-dark dark:text-white">Câu hỏi {index + 1}</h4>
                            <div>
                                <label className="block text-sm font-medium mb-1">Đề bài</label>
                                <textarea 
                                    value={part3Questions[index]} 
                                    onChange={e => handlePart3QuestionChange(index, e.target.value)} 
                                    rows={2} 
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Câu trả lời</label>
                                <textarea 
                                    value={part3Answers[index]} 
                                    onChange={e => handlePart3AnswerChange(index, e.target.value)} 
                                    rows={3} 
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary"
                                ></textarea>
                            </div>
                        </div>
                    ))}
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

export default WritingPart2And3Practice;
