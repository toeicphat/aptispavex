export * from './listeningQuestion14Data_types';
import { ListeningQuestion14 } from './listeningQuestion14Data_types';
import { listeningQuestions14_part1 } from './listeningQuestion14Data_1';
import { listeningQuestions14_part2 } from './listeningQuestion14Data_2';
import { listeningQuestions14_part3 } from './listeningQuestion14Data_3';

export const listeningQuestions14: ListeningQuestion14[] = [
    ...listeningQuestions14_part1,
    ...listeningQuestions14_part2,
    ...listeningQuestions14_part3
];
