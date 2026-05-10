export interface ListeningQuestion16_17 {
    id: string;
    audioUrl?: string;
    topic: string;
    subQuestions: {
        id: string;
        text: string;
        options: {
            id: string;
            text: string;
        }[];
        correctAnswer: string;
    }[];
    transcript: string;
}
