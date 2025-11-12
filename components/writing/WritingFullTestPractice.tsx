

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai"; // Import GoogleGenAI and Type
import WritingPart1Practice, { FeedbackContent } from './WritingPart1Practice';
import WritingPart2And3Practice, { Part2And3Feedback } from './WritingPart2And3Practice';
import WritingPart4Practice, { Part4EmailFeedback } from './WritingPart4Practice';

interface WritingFullTestPracticeProps {
    onBack: () => void; // To go back to the main Writing menu
}

export type FullTestPart = 'intro' | 'part1' | 'part2&3' | 'part4' | 'finished';

// CEFR mappings for summary display (copied from respective practice files)
const scoreToCefrMappingPart1: { [key: number]: string } = {
    3: "Trên A1",
    2: "A1.2",
    1: "A1.1",
    0: "A0"
};

const scoreToCefrMappingParts23: { [key: number]: string } = { // Renamed for clarity
    5: 'B1+',
    4: 'A2.2',
    3: 'A2.1',
    2: 'A1.2',
    1: 'A1.1',
    0: 'A0',
};

const scoreToCefrMappingPart4: { [key: number]: string } = {
    5: 'B2+/C1',
    4: 'B2.1',
    3: 'B1.2',
    2: 'A2.2',
    1: 'A2.1',
    0: 'A1 or below'
};

const WritingFullTestPractice: React.FC<WritingFullTestPracticeProps> = ({ onBack }) => {
    const totalTimeLimit = 60 * 60; // 60 minutes for the entire test
    const [currentPart, setCurrentPart] = useState<FullTestPart>('intro');
    const [timeLeft, setTimeLeft] = useState(totalTimeLimit);
    const timerRef = useRef<number | null>(null);

    const [isFullTestEvaluating, setIsFullTestEvaluating] = useState(false); // New state for full test evaluation

    // Stored results and answers from each part
    const [part1Data, setPart1Data] = useState<{ answers: string[]; feedback: { score: number; feedback: FeedbackContent } | null } | null>(null);
    const [part2And3Data, setPart2And3Data] = useState<{ part2Question: string; part2Answer: string; part3Questions: string[]; part3Answers: string[]; feedback: { part2: Part2And3Feedback; part3: Part2And3Feedback } | null } | null>(null);
    const [part4Data, setPart4Data] = useState<{ informalPrompt: string; informalAnswer: string; formalPrompt: string; formalAnswer: string; feedback: { informalEmail: Part4EmailFeedback; formalEmail: Part4EmailFeedback } | null } | null>(null);

    useEffect(() => {
        if (currentPart !== 'intro' && currentPart !== 'finished' && !isFullTestEvaluating) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        handleAutoSubmitCurrentPart(); // Auto-submit if global time runs out
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentPart, isFullTestEvaluating]); // Re-run effect if currentPart or evaluation status changes

    const handleStartFullTest = () => {
        setTimeLeft(totalTimeLimit); // Reset timer for full test
        setCurrentPart('part1');
        setPart1Data({ answers: Array(5).fill(''), feedback: null }); // Clear previous data for a new test
        setPart2And3Data({ part2Question: '', part2Answer: '', part3Questions: ['', '', ''], part3Answers: ['', '', ''], feedback: null });
        setPart4Data({ informalPrompt: '', informalAnswer: '', formalPrompt: '', formalAnswer: '', feedback: null });
        setIsFullTestEvaluating(false); // Reset evaluation status
    };

    const runFullTestEvaluation = async () => {
        setIsFullTestEvaluating(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        // Helper for consistent error feedback
        const getErrorFeedback = (part: string) => ({
            taskCompletionRelevance: `Lỗi phân tích phần ${part}.`,
            grammarAccuracy: `Lỗi phân tích phần ${part}.`,
            vocabularyRangeAppropriateness: `Lỗi phân tích phần ${part}.`,
            coherenceCohesionOrganization: `Lỗi phân tích phần ${part}.`,
            spellingPunctuation: `Lỗi phân tích phần ${part}.`,
            spellingPunctuationStyle: `Lỗi phân tích phần ${part}.`,
        });

        // Evaluate Part 1
        if (part1Data?.answers) {
            try {
                // Assuming `writingPart1Questions` are available globally or passed down
                // For a full test, these should ideally be fixed and known.
                // For now, let's use dummy placeholders if the real ones aren't accessible here.
                const dummyPart1Questions = [
                    "What is your name?",
                    "What do you do?",
                    "Where do you live?",
                    "What is your favourite device?",
                    "What's your favourite colour?",
                ];
                const promptContent = part1Data.answers.map((ans, i) => 
                    `${i + 1}. Question: "${(dummyPart1Questions[i] || "Question " + (i + 1))}" -> Answer: "${ans || '(no answer)'}"`
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
                setPart1Data(prev => ({ ...prev!, feedback: parsedResult }));
            } catch (error) {
                console.error("Error evaluating Part 1:", error);
                setPart1Data(prev => ({ ...prev!, feedback: { score: 0, feedback: { taskCompletion: "Lỗi đánh giá.", grammarAccuracy: "Lỗi đánh giá.", vocabularyAppropriateness: "Lỗi đánh giá.", spellingPunctuation: "Lỗi đánh giá." } } }));
            }
        }

        // Evaluate Part 2 & 3
        if (part2And3Data?.part2Question !== undefined && part2And3Data?.part2Answer !== undefined && part2And3Data?.part3Questions !== undefined && part2And3Data?.part3Answers !== undefined) {
            try {
                const part3PromptDetails = part2And3Data.part3Questions.map((q, i) => `Question ${i + 1} ("Đề bài ${i + 1}"): "${q || '(not provided)'}"\nAnswer ${i + 1} ("Câu trả lời ${i + 1}"): "${part2And3Data.part3Answers[i] || '(no answer)'}"`).join('\n');

                const textPart = {
                    text: `You are an expert English examiner for the official APTIS test. A student has submitted answers for Aptis Writing Part 2 and Part 3.
                    
                    Please evaluate each part separately based on the official Aptis Writing scoring criteria and provide a score and detailed, constructive feedback in VIETNAMESE for each.
                    
                    **Part 2 Submission:**
                    - Question ("Đề bài"): "${part2And3Data.part2Question || '(not provided)'}"
                    - Answer ("Câu trả lời"): "${part2And3Data.part2Answer || '(no answer)'}"
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
                setPart2And3Data(prev => ({ ...prev!, feedback: parsedResult }));
            } catch (error) {
                console.error("Error evaluating Part 2 & 3:", error);
                setPart2And3Data(prev => ({ ...prev!, feedback: { part2: { score: 0, feedback: getErrorFeedback("2") }, part3: { score: 0, feedback: getErrorFeedback("3") } } }));
            }
        }

        // Evaluate Part 4
        if (part4Data?.informalPrompt !== undefined && part4Data?.informalAnswer !== undefined && part4Data?.formalPrompt !== undefined && part4Data?.formalAnswer !== undefined) {
            try {
                const textPart = {
                    text: `You are an expert English examiner for the official APTIS test. A student has submitted two emails for Aptis Writing Part 4.
                    
                    Please evaluate each email separately based on the official Aptis Writing Part 4 scoring criteria and provide a score and detailed, constructive feedback in VIETNAMESE for each.

                    **Email 1 (Informal):**
                    - Prompt ("Đề bài"): "${part4Data.informalPrompt || '(not provided)'}"
                    - Answer ("Câu trả lời"): "${part4Data.informalAnswer || '(no answer)'}"
                    - Word count requirement: 40-50 words.

                    **Email 2 (Formal):**
                    - Prompt ("Đề bài"): "${part4Data.formalPrompt || '(not provided)'}"
                    - Answer ("Câu trả lời"): "${part4Data.formalAnswer || '(no answer)'}"
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
                setPart4Data(prev => ({ ...prev!, feedback: parsedResult }));
            } catch (error) {
                console.error("Error evaluating Part 4:", error);
                setPart4Data(prev => ({ ...prev!, feedback: { informalEmail: { score: 0, feedback: getErrorFeedback("4 informal") }, formalEmail: { score: 0, feedback: getErrorFeedback("4 formal") } } }));
            }
        }

        setIsFullTestEvaluating(false);
        setCurrentPart('finished'); // Finally move to finished state
    };


    const handleAutoSubmitCurrentPart = () => {
        // Just save current answers, evaluation will happen at the end
        if (currentPart === 'part1') {
            handlePart1Save(part1Data?.answers || Array(5).fill(''), null); // Save answers without feedback
        } else if (currentPart === 'part2&3') {
            handlePart2And3Save(part2And3Data?.part2Question || '', part2And3Data?.part2Answer || '', part2And3Data?.part3Questions || Array(3).fill(''), part2And3Data?.part3Answers || Array(3).fill(''), null); // Save answers without feedback, ensure correct length
        } else if (currentPart === 'part4') {
            handlePart4Save(part4Data?.informalPrompt || '', part4Data?.informalAnswer || '', part4Data?.formalPrompt || '', part4Data?.formalAnswer || '', null); // Save answers without feedback
        }
        runFullTestEvaluation(); // Trigger final evaluation
    };

    // New save handlers that only store data, not navigate
    const handlePart1Save = (answers: string[], feedback: { score: number; feedback: FeedbackContent } | null) => {
        setPart1Data({ answers, feedback });
    };

    const handlePart2And3Save = (part2Question: string, part2Answer: string, part3Questions: string[], part3Answers: string[], feedback: { part2: Part2And3Feedback; part3: Part2And3Feedback } | null) => {
        setPart2And3Data({ part2Question, part2Answer, part3Questions, part3Answers, feedback });
    };

    const handlePart4Save = (informalPrompt: string, informalAnswer: string, formalPrompt: string, formalAnswer: string, feedback: { informalEmail: Part4EmailFeedback; formalEmail: Part4EmailFeedback } | null) => {
        setPart4Data({ informalPrompt, informalAnswer, formalPrompt, formalAnswer, feedback });
    };

    // New complete handler that navigates to the next part
    const handlePartComplete = (nextPart: FullTestPart) => {
        if (nextPart === 'finished') {
            runFullTestEvaluation(); // Trigger final evaluation
        } else {
            setCurrentPart(nextPart);
        }
    };

    const handleBackToWritingMenu = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        onBack();
    };

    const renderQuestionPalette = () => {
        const parts: { id: FullTestPart; title: string; score?: string; cefr?: string; isCompleted: boolean; isActive: boolean; }[] = [
            {
                id: 'part1',
                title: 'Phần 1',
                isCompleted: !!part1Data?.feedback,
                isActive: currentPart === 'part1',
                score: part1Data?.feedback?.score !== undefined ? `${part1Data.feedback.score}/3` : undefined,
                cefr: part1Data?.feedback?.score !== undefined ? scoreToCefrMappingPart1[part1Data.feedback.score] : undefined,
            },
            {
                id: 'part2&3',
                title: 'Phần 2 & 3',
                isCompleted: !!part2And3Data?.feedback,
                isActive: currentPart === 'part2&3',
                score: part2And3Data?.feedback?.part2.score !== undefined ? `${(part2And3Data.feedback.part2.score + part2And3Data.feedback.part3.score) / 2}/5` : undefined, // Average score for display
                cefr: part2And3Data?.feedback?.part2.score !== undefined ? `${scoreToCefrMappingParts23[part2And3Data.feedback.part2.score]}/${scoreToCefrMappingParts23[part2And3Data.feedback.part3.score]}` : undefined,
            },
            {
                id: 'part4',
                title: 'Phần 4',
                isCompleted: !!part4Data?.feedback,
                isActive: currentPart === 'part4',
                score: part4Data?.feedback?.informalEmail.score !== undefined ? `${(part4Data.feedback.informalEmail.score + part4Data.feedback.formalEmail.score) / 2}/5` : undefined, // Average score
                cefr: part4Data?.feedback?.informalEmail.score !== undefined ? `${scoreToCefrMappingPart4[part4Data.feedback.informalEmail.score]}/${scoreToCefrMappingPart4[part4Data.feedback.formalEmail.score]}` : undefined,
            },
        ];

        return (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Danh mục câu hỏi</h3>
                <nav className="space-y-3">
                    {parts.map(part => (
                        <button
                            key={part.id}
                            onClick={() => setCurrentPart(part.id)} // Allow free navigation
                            className={`
                                w-full text-left p-3 rounded-lg transition-colors duration-200
                                ${part.isActive ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}
                            `}
                        >
                            <span className="font-semibold">{part.title}</span>
                            <div className="text-sm mt-1">
                                {part.isActive ? (
                                    <span className="text-white">Đang làm bài</span>
                                ) : (part.isCompleted && !isFullTestEvaluating) ? ( // Only show score if evaluated AND not currently evaluating
                                    <div className="flex items-center justify-between">
                                        <span className={`text-green-600 dark:text-green-400`}>Đã hoàn thành</span>
                                        {part.score && <span className={`font-medium text-primary`}>{part.score}</span>}
                                        {part.cefr && <span className={`font-medium ml-2 text-accent`}>{part.cefr}</span>}
                                    </div>
                                ) : ( // If not completed or currently evaluating, show pending/not started
                                    <span className="text-slate-500 dark:text-slate-400">{isFullTestEvaluating ? 'Đang chờ đánh giá' : 'Chưa bắt đầu'}</span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>
        );
    };

    const renderTestContent = () => {
        const commonProps = {
            onBackToFullTestMenu: handleBackToWritingMenu, // Prop for sub-components to go back to Writing menu
            isFullTestMode: true, // A flag to tell sub-components they are part of a full test
            onCompletePart: handlePartComplete, // Pass the completion handler
        };

        switch (currentPart) {
            case 'intro':
                return (
                    <div className="max-w-2xl mx-auto text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                        <h2 className="text-3xl font-bold text-dark dark:text-white">Aptis Writing Full Test Practice</h2>
                        <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Phiên thực hành này mô phỏng bài kiểm tra Viết Aptis đầy đủ. Bạn sẽ có {Math.floor(totalTimeLimit / 60)} phút để hoàn thành tất cả các phần. Bài làm của bạn sẽ được chấm tự động sau khi bạn hoàn thành hoặc hết thời gian.</p>
                        <button onClick={handleStartFullTest} className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-dark transition-colors">
                            Bắt đầu bài kiểm tra đầy đủ
                        </button>
                        <button onClick={onBack} className="w-full mt-4 text-sm text-slate-500 hover:underline">Quay lại Menu Writing</button>
                    </div>
                );
            case 'part1':
                return (
                    <WritingPart1Practice
                        {...commonProps}
                        onSavePartProgress={handlePart1Save}
                        initialAnswers={part1Data?.answers || Array(5).fill('')}
                        initialFeedback={part1Data?.feedback || null} // Pass existing feedback if available
                        currentFullTestPart="part1"
                    />
                );
            case 'part2&3':
                return (
                    <WritingPart2And3Practice
                        {...commonProps}
                        part2Question={part2And3Data?.part2Question || ''}
                        part3Questions={part2And3Data?.part3Questions || ['', '', '']} // Ensure correct length
                        onSavePartProgress={handlePart2And3Save}
                        initialPart2Answer={part2And3Data?.part2Answer || ''}
                        initialPart3Answers={part2And3Data?.part3Answers || ['', '', '']} // Use correct length here
                        initialFeedback={part2And3Data?.feedback || null} // Pass existing feedback if available
                        currentFullTestPart="part2&3"
                    />
                );
            case 'part4':
                return (
                    <WritingPart4Practice
                        {...commonProps}
                        informalPrompt={part4Data?.informalPrompt || ''}
                        formalPrompt={part4Data?.formalPrompt || ''}
                        onSavePartProgress={handlePart4Save}
                        initialInformalAnswer={part4Data?.informalAnswer || ''}
                        initialFormalAnswer={part4Data?.formalAnswer || ''}
                        initialFeedback={part4Data?.feedback || null} // Pass existing feedback if available
                        currentFullTestPart="part4"
                    />
                );
            case 'finished':
                if (isFullTestEvaluating) {
                    return (
                        <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
                            <h2 className="text-3xl font-bold text-dark dark:text-white animate-pulse">Đang chấm bài kiểm tra đầy đủ...</h2>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">Vui lòng chờ trong khi giám khảo AI đánh giá tất cả các phần của bài làm của bạn.</p>
                            <div className="mt-6 flex justify-center">
                                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center">
                        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">Bài kiểm tra đầy đủ đã hoàn thành!</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-8">Bạn đã hoàn thành tất cả các phần của Bài kiểm tra Viết đầy đủ. Xem lại kết quả của bạn dưới đây.</p>
                        
                        {part1Data?.feedback && (
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-md text-left">
                                <h3 className="text-xl font-bold text-primary mb-2">Phần 1 Kết quả</h3>
                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Điểm: {part1Data.feedback.score}/3</p>
                                <p className="text-md text-slate-700 dark:text-slate-200">Cấp độ CEFR: {scoreToCefrMappingPart1[part1Data.feedback.score]}</p>
                            </div>
                        )}
                        {part2And3Data?.feedback && (
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-md text-left">
                                <h3 className="text-xl font-bold text-primary mb-2">Phần 2 & 3 Kết quả</h3>
                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Điểm Phần 2: {part2And3Data.feedback.part2.score}/5</p>
                                <p className="text-md text-slate-700 dark:text-slate-200">Cấp độ CEFR Phần 2: {scoreToCefrMappingParts23[part2And3Data.feedback.part2.score]}</p>
                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-2">Điểm Phần 3: {part2And3Data.feedback.part3.score}/5</p>
                                <p className="text-md text-slate-700 dark:text-slate-200">Cấp độ CEFR Phần 3: {scoreToCefrMappingParts23[part2And3Data.feedback.part3.score]}</p>
                            </div>
                        )}
                        {part4Data?.feedback && (
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-md text-left">
                                <h3 className="text-xl font-bold text-primary mb-2">Phần 4 Kết quả</h3>
                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Điểm Email không trang trọng: {part4Data.feedback.informalEmail.score}/5</p>
                                <p className="text-md text-slate-700 dark:text-slate-200">Cấp độ CEFR Email không trang trọng: {scoreToCefrMappingPart4[part4Data.feedback.informalEmail.score]}</p>
                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-2">Điểm Email trang trọng: {part4Data.feedback.formalEmail.score}/5</p>
                                <p className="text-md text-slate-700 dark:text-slate-200">Cấp độ CEFR Email trang trọng: {scoreToCefrMappingPart4[part4Data.feedback.formalEmail.score]}</p>
                            </div>
                        )}

                        <button onClick={() => setCurrentPart('intro')} className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-dark transition-colors mr-4">
                            Bắt đầu bài kiểm tra đầy đủ mới
                        </button>
                        <button onClick={onBack} className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-600">
                            Quay lại Menu Writing
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {currentPart !== 'intro' && currentPart !== 'finished' && (
                <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            )}
            {(currentPart === 'intro' || currentPart === 'finished') ? (
                renderTestContent()
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="lg:col-span-3">
                        {renderTestContent()}
                    </div>
                    <div className="lg:col-span-1">
                        {renderQuestionPalette()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WritingFullTestPractice;