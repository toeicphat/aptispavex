export interface ListeningQuestion15 {
    id: string;
    topic: string;
    instruction: string;
    opinions: {
        id: string;
        text: string;
        correctAnswer: 'Man' | 'Woman' | 'Both';
    }[];
    transcript: {
        speaker: 'Man' | 'Woman';
        text: string;
    }[];
}
