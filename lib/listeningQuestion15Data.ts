export * from './listeningQuestion15Data_types';
import { ListeningQuestion15 } from './listeningQuestion15Data_types';
import { listeningQuestions15_part1 } from './listeningQuestion15Data_1';
import { listeningQuestions15_part2 } from './listeningQuestion15Data_2';
import { listeningQuestions15_part3 } from './listeningQuestion15Data_3';

export const listeningQuestions15: ListeningQuestion15[] = [
    ...listeningQuestions15_part1,
    ...listeningQuestions15_part2,
    ...listeningQuestions15_part3
];
