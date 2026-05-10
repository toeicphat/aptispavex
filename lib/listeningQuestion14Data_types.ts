export interface ListeningQuestion14 {
    id: string;
    heading: string;
    topic: string;
    instruction: string;
    options: string[];
    correctAnswers: {
        person1: string;
        person2: string;
        person3: string;
        person4: string;
    };
    transcripts: {
        person1: string;
        person2: string;
        person3: string;
        person4: string;
    };
}
