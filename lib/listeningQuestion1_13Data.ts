import { listeningQuestions1_13_de5 } from './listeningQuestion1_13Data_de5';
import { listeningQuestions1_13_de6 } from './listeningQuestion1_13Data_de6';
import { listeningQuestions1_13_de7 } from './listeningQuestion1_13Data_de7';
import { listeningQuestions1_13_de8 } from './listeningQuestion1_13Data_de8';
import { listeningQuestions1_13_de9 } from './listeningQuestion1_13Data_de9';
import { listeningQuestions1_13_de10 } from './listeningQuestion1_13Data_de10';
import { listeningQuestions1_13_de11 } from './listeningQuestion1_13Data_de11';
import { listeningQuestions1_13_de12 } from './listeningQuestion1_13Data_de12';
import { listeningQuestions1_13_2026_1 } from './listeningQuestion1_13Data_2026_1';
import { listeningQuestions1_13_2026_2 } from './listeningQuestion1_13Data_2026_2';

export { 
  listeningQuestions1_13_de5,
  listeningQuestions1_13_de6,
  listeningQuestions1_13_de7,
  listeningQuestions1_13_de8,
  listeningQuestions1_13_de9,
  listeningQuestions1_13_de10,
  listeningQuestions1_13_de11,
  listeningQuestions1_13_de12,
  listeningQuestions1_13_2026_1,
  listeningQuestions1_13_2026_2 
};

export interface ListeningQuestion {
    heading: string;
    audioUrl: string;
    question: string;
    options: string[];
    correctAnswer: string;
    transcript: string;
}

export const listeningQuestions1_13: ListeningQuestion[] = [
  {
    heading: "Question 1 of 17", 
    audioUrl: "audio/question1_13/audio_q1.mp3", 
    question: "What is not original?",
    options: ["Furniture", "Home", "Bicycle"], 
    correctAnswer: "Furniture", 
    transcript: "Welcome! I’m so glad you are interested in this beautiful property. This house was built in the 1920s and has maintained much of its original charm. The hardwood floors you see here are completely original, and they’ve been carefully preserved over the years. The same goes for the architecture- those high ceilings and detailed mouldings are a testament to the craftsmanship of that era. However, the furniture you see isn’t original. It was replaced a few years ago to give the home a more modern, functional feel. But don’t worry, the updates blend well with the classic features, giving you the best of both words- historic charm with modern comfort." 
  },
  {
    heading: "Question 2 of 17", 
    audioUrl: "audio/question1_13/audio_q2.mp3", 
    question: "What did she advice for people who lack motivation at work?",
    options: ["Attend a time management workshop", "Request a transfer", "Take on additional responsibilities"], 
    correctAnswer: "Request a transfer", 
    transcript: "Many people feel unhappy at work, and often, they think a higher salary or less work will fix it. But that’s not always the solution. Sometimes, the problem is the work environment. A change of place can help improve how we feel at work. However, looking for a new job can be stressful and take time. One option is to ask for a transfer to another branch within the same company. This can offer the same benefits as getting a new job, without the challenges of starting over somewhere new." 
  },
  {
    heading: "Question 3 of 17", 
    audioUrl: "audio/question1_13/audio_q3.mp3", 
    question: "What time do they meet?",
    options: ["6.30pm", "8.00pm", "7.00pm"], 
    correctAnswer: "6.30pm", 
    transcript: "Hey, I was just checking in to confirm what time we’re meeting up tonight. I know we’ve been talking about hanging out, but I wanted to make sure. Are we still on for 6:30? That time works great for me, so I just wanted to double-check if it’s good for you too. Alright, looking forward to it. See you then!"  
  },
  {
    heading: "Question 4 of 17", 
    audioUrl: "audio/question1_13/audio_q4.mp3", 
    question: "Where does she go shopping?",
    options: ["at a new shopping mall", "at a department store", "at a local market"], 
    correctAnswer: "at a new shopping mall", 
    transcript: "Person A: 'Hey, do you know where Sarah likes to go shopping?' \nPerson B: 'Oh, yeah! She usually goes to that new shopping mall that just opened. It's got a lot of cool stores.' \nPerson A: 'Really? I haven't been there yet. What's it like?' \nPerson B: 'It's amazing! It's really modern, and there’s a big variety of shops. She loves it because she can find pretty much anything she needs, from clothes to electronics.' \nPerson A: 'That sounds great. I should check it out sometime.' \nPerson B: 'Definitely! The food court is great too. She always grabs a bite there after shopping.'"  
  },
  {
    heading: "Question 5 of 17", 
    audioUrl: "audio/question1_13/audio_q5.mp3", 
    question: "What is her favorite thing to do in her spare time?",
    options: ["watching a movie at home", "going to the theatre", "playing sports"], 
    correctAnswer: "going to the theatre", 
    transcript: "Whenever she has some free time, she loves going to the theatre. There's something special about watching live performances that really captures her attention. Whether it’s a play, musical, or even a stand-up comedy show, she enjoys the atmosphere and the excitement of being in a theatre. It’s her favorite way to unwind and escape into a different world for a few hours."
  },
  {
    heading: "Question 6 of 17", 
    audioUrl: "audio/question1_13/audio_q6.mp3", 
    question: "Which sports is she good at?",
    options: ["Running", "Swimming", "Football"], 
    correctAnswer: "Football", 
    transcript: "She’s always enjoyed sports, and football is the one she’s really good at. She has great control over the ball and is quick on her feet, whether she’s playing with friends or in a competitive setting."
  },
  {
    heading: "Question 7 of 17", 
    audioUrl: "audio/question1_13/audio_q7.mp3", 
    question: "The woman is discussing her new exercise routine. How much time does she spend cycling?",
    options: ["45 minutes", "35 minutes", "60 minutes"], 
    correctAnswer: "35 minutes", 
    transcript: "Lately, I’ve started a new routine that I’m really enjoying! I decided to involve more exercise into my life. So, I began by walking for about 15 minutes every day, just to get moving. After that, I hop on my bike and cycle for 35 minutes. It’s been refreshing! I love how it helps me clear my mind after a busy day. I’m thinking of sticking with this habit for the long run!" 
  },
  {
    heading: "Question 8 of 17", 
    audioUrl: "audio/question1_13/audio_q8.mp3", 
    question: "When do they meet each other? ",
    options: ["On Thursday morning", "On Wednesday morning", "On monday morning"], 
    correctAnswer: "On Thursday morning", 
    transcript: "Hi Professor Smith, this is John calling about our meeting for the assignment. I wanted to confirm our appointment time. I know we discussed a few options earlier. At first, I thought we agreed on Tuesday morning, but then I remembered that doesn’t work with your schedule. Then I considered Thursday afternoon, but I have another class then. So, I’m pretty sure we settled on Thursday morning at 10 AM in your office. That’s what I have written down. I’ll bring my draft and notes for the project. If I’ve got the day or time wrong, or if you need me to bring anything else, please let me know. Looking forward to discussing the assignment with you. Have a great day!" 
  },
  {
    heading: "Question 9 of 17", 
    audioUrl: "audio/question1_13/audio_q9.mp3", 
    question: "A woman is calling her son. What time will the mother meet the son?",
    options: ["Six o’clock", "Two o’clock", "Three o'clock"], 
    correctAnswer: "Three o'clock", 
    transcript: "Hi, sweetheart! I just wanted to tell you that we’ll meet at 3 o'clock when you finish school. After that, I can take you to your soccer club at 4 o'clock. If you need anything, just let me know, and I can pick it up for you. Then, we can head out to dinner at 5 o'clock. Looking forward to seeing you!" 
  },
  {
    heading: "Question 10 of 17", 
    audioUrl: "audio/question1_13/audio_q10.mp3", 
    question: "Jack is calling to invite a friend to his house. What color is Jack’s house??",
    options: ["Black", "Red", "Green"], 
    correctAnswer: "Red", 
    transcript: "Hey! It’s Jack. I just moved to a new house in this busy neighborhood, and it’s really cool! There are so many houses here in different colors—purple, blue, and white. My house is big and red! I’d love for you to come over and check it out. Let me know when you’re free!." 
  },
  {
    heading: "Question 11 of 17", 
    audioUrl: "audio/question1_13/audio_q11.mp3", 
    question: "A man is talking about his daily routine. What does he do after work?",
    options: ["Go home", "Go to the coffee shop", "Play football"], 
    correctAnswer: "Play football", 
    transcript: "Every day, I wake up at 7 A.M. and have a quick breakfast before going to work. I usually take the bus, and it takes about 30 minutes to get to the office. At work, I spend most of my time on the computer, answering emails and working on projects. I have lunch at noon and get back to work until 5 P.M. After work, I like to relax by playing football with my friends. It’s a great way to stay active and have fun!" 
  },
  {
    heading: "Question 12 of 17", 
    audioUrl: "audio/question1_13/audio_q12.mp3", 
    question: "A mom is talking to her son. What does the son like to study?",
    options: ["Art", "Math", "Science"], 
    correctAnswer: "Art", 
    transcript: "Hey sweetheart, I’m so proud of you! Your art project looks amazing, you’re really talented. I love how you used all those bright colors. You always do such a great job with your drawings. But remember, you also need to spend some time on your other subjects too, like math and science. I know you can do well in those if you try hard, just like you do with art. Let’s work on it together, okay?" 
  },
  {
    heading: "Question 13 of 17", 
    audioUrl: "audio/question1_13/audio_q13.mp3", 
    question: "How many weeks did they spend in India?",
    options: ["Three weeks", "Two weeks", "One week"], 
    correctAnswer: "Two weeks", 
    transcript: "They traveled to India for a short trip, and they spent two weeks there. During that time, they explored different cities, experienced the local culture, and visited some famous landmarks. It was a quick but memorable visit."
  },
  {
    heading: "Question 1 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q1.mp3", 
    question: "Doctor’s office is calling about a change in the appointment. When is the new appointment?",
    options: ["Thursday 13th", "Friday 14th", "Wednesday 12th"],
    correctAnswer: "Thursday 13th",
    transcript: "Hello! This is the doctor’s office calling to change your appointment. I wanted to let you know that the new appointment is on Thursday the 13th. I understand you might have been expecting it to be on Friday the 14th, but we’re all off this day due to the national dentist holiday. Please let us know if that works for you!"
  },
  {
    heading: "Question 2 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q2.mp3", 
    question: "A man is ordering a drink. What does he want?",
    options: ["Water", "Iced tea", "Beer"],
    correctAnswer: "Iced tea",
    transcript: "Hi there! I’m really thirsty. Can I have a drink, please? I was thinking about getting a beer, but it's a bit too early for that. Water sounds good, but I’m in the mood for something cooler. I’ll go with an iced tea, please. That sounds perfect for this weather!"
  },
  {
    heading: "Question 3 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q3.mp3", 
    question: "An author is talking about her daily routine. When does she usually write?",
    options: ["In the afternoons", "In the mornings", "At night"],
    correctAnswer: "In the afternoons",
    transcript: "Every morning, I start my day by going for a run. It helps me clear my mind and gives me energy. After lunch, at around two o’clock, I sit down at my working table, ready to write. My husband is my best critic, so I try to produce something before he gets home in the afternoon."
  },
  {
    heading: "Question 4 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q4.mp3",  
    question: "How does he travel?",
    options: ["By car", "By plane", "By train"],
    correctAnswer: "By train",
    transcript: "He travels most of the time, enjoying the convenience and comfort of his journeys. Whether it's for work or leisure, he finds it the best way to get around, especially because of the scenic views. He travels by train."
  },
  {
    heading: "Question 5 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q5.mp3", 
    question: "A woman is talking about her usual Saturday routine. What does she usually do on Saturdays?",
    options: ["Goes shopping", "Sees her family", "Goes to a birthday party"],
    correctAnswer: "Sees her family",
    transcript: "Normally, on Saturdays, I spend the day with my family. We like to have brunch together and then do some fun activities, like playing board games or going for a walk. It’s a nice way to relax and catch up. But this week, I have something different planned. I’m going to see a friend for her birthday and go shopping together instead. I’m looking forward to it, but I know I’ll miss our usual family time!"
  },
  {
    heading: "Question 6 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q6.mp3", 
    question: "A man is talking about his family trip. What does the man’s wife enjoy?",
    options: ["Photography", "Shopping", "Hiking"],
    correctAnswer: "Photography",
    transcript: "On our family trip last summer, we had such a great time! My wife really enjoys photography. So, when we went walking together in the parks, she spent a lot of time taking pictures of the beautiful landscapes. Well, at least she is not crazy about shopping."
  },
  {
    heading: "Question 7 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q7.mp3", 
    question: "A woman is talking about her job. What encouraged her to become a scientist?",
    options: ["Her computer", "Her mother", "A large stone"],
    correctAnswer: "A large stone",
    transcript: "I’ve always loved science, but there was a moment that really encouraged me to become a scientist. I remember when I was a child, I found a large stone during a school trip. It sparked my curiosity about geology. My mother also inspired me to explore my interests in science. Of course, I use the computer a lot now for my research, but that stone was the beginning."
  },
  {
    heading: "Question 8 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q8.mp3", 
    question: "Listen to the speaker talking about their weekly schedule. When is the meeting scheduled?",
    options: ["Monday morning", "Friday afternoon", "Wednesday afternoon"],
    correctAnswer: "Wednesday afternoon",
    transcript: "This week is pretty busy, but the most important thing is the meeting on Wednesday afternoon. We usually have it on Monday, but this time we had to change the day. Wednesday works better because everyone is free. I have a lot to prepare before then, so I'll spend Tuesday getting everything ready. It's a big meeting, and we need to finalize some plans. I'm just glad it's not on Friday, or I'd be too tired!"
  },
  {
    heading: "Question 9 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q9.mp3", 
    question: "A man is reading the news about a housing development plan. How many new houses are going to be built?",
    options: ["1500", "2000", "2500"],
    correctAnswer: "2000",
    transcript: "I just heard the news that the local authority is planning to build 2000 new houses! I remember they were initially saying it would only be 1500. But then I heard someone mention 2500! That’s quite a jump. I wonder how this will affect the neighborhood. Will it bring in more families or just more traffic? It’ll be interesting to see how it all unfolds."
  },
  {
    heading: "Question 10 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q10.mp3", 
    question: "Listen to a writer talking about her job. What is her first job?",
    options: ["Writer", "Librarian", "Teacher"],
    correctAnswer: "Teacher",
    transcript: "When I was younger, I didn’t always dream of being a writer. My first job was actually as a teacher. I taught English to small children, and I loved helping them learn to read and write. It wasn’t easy, though. I spent a lot of time grading papers and preparing lessons. But that job taught me how to use words well, and now I write stories for everyone to enjoy."
  },
  {
    heading: "Question 11 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q11.mp3", 
    question: "Listen to Marry talking to Jane while waiting for James. What did they decide to do?",
    options: ["Cancel the meeting", "Having the meeting without him", "Wait for him longer"],
    correctAnswer: "Having the meeting without him",
    transcript: "Hi, Jane! It looks like James is running late again. I’m starting to wonder if we should wait for him. I don’t want to waste too much time. I feel like we could have the meeting without him. We have a lot to discuss, and we can always update him later. I think it’s better to move forward instead of just waiting. So let’s go ahead."
  },
  {
    heading: "Question 12 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q12.mp3", 
    question: "A woman is talking to her coworker. When does the meeting start?",
    options: ["10.15", "10.30", "9.45"],
    correctAnswer: "10.15",
    transcript: "Hey, just wanted to give you a quick heads-up. I won’t be able to join the meeting with the clients at 10:15 like we planned—I’ve got something that suddenly came up. I know it’s last minute, but could you go ahead and handle the presentation on your own? You’re familiar with everything, so I trust you’ve got this. Let me know how it goes afterward. Thanks, I really appreciate it!"
  },
  {
    heading: "Question 13 of 17", 
    audioUrl: "audio/question1_13/audio_de2_q13.mp3", 
    question: "Vincent is calling James. Why does Vincent call James?",
    options: ["Invite him to a party", "Suggest a drink", "Ask for help"],
    correctAnswer: "Suggest a drink",
    transcript: "Hi James, it’s Vincent. I just want to check in and see how you’re doing. It’s been a while since we last caught up! How about we grab a drink later? I know a great new place that has very nice tea. You should definitely try it next time you visit me. Text me back!"
  },
  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_de3_q1.mp3",
    question: "What did the mother call her daughter to help her buy?",
    options: ["eggs", "bread", "milk"],
    correctAnswer: "eggs",
    transcript: "Hi Sally, it’s Mom. How are you? I just wanted to remind you about dinner tonight. We’re having your favorite, spaghetti! Don’t forget to pick up your brother from school at 4 o’clock. Oh, and can you stop by the store on your way home? We’re out of eggs, and I need some to finish baking the cake. Thanks, sweetie!"
  },
  {
    heading: "Question 2 of 17",
    audioUrl: "audio/question1_13/audio_de3_q2.mp3",
    question: "Samia is going to meet her friend. What time are they going to meet?",
    options: ["9:30", "11:00", "10:00"],
    correctAnswer: "10:00",
    transcript: "Hey! I was thinking about our meet-up. We plan to meet at 9:30, but I just realized I have a class that finishes at 9:00, so I might not make it in time. How about we meet at 10:00 instead? That should give me enough time to get there. Does that work for you?"
  },
  {
    heading: "Question 3 of 17",
    audioUrl: "audio/question1_13/audio_de3_q3.mp3",
    question: "Anna is calling her brother Max. What does Anna do later in the afternoon?",
    options: ["Pick up the kids", "Stay late at the office", "Hang out with friends"],
    correctAnswer: "Stay late at the office",
    transcript: "Hey Max, it’s Anna. I want to ask you for a favor this afternoon. I have to stay late at the office to finish some work. Could you please pick up my kids from school? After that, I know you’ll want to hang out with your friends, so feel free to take them along. I really appreciate your help!"
  },
  {
    heading: "Question 4 of 17",
    audioUrl: "audio/question1_13/audio_de3_q4.mp3",
    question: "A woman is talking about her favorite film on the radio. What film did she recommend?",
    options: ["Action film", "Romantic film", "Comedy film"],
    correctAnswer: "Action film",
    transcript: "Today, I want to recommend an action film that really impressed me. The lead actor, who is usually known for his romantic roles, delivered an outstanding performance. Of course, if you’re in the mood for something lighter, there are plenty of comedies to enjoy as well. But if you’re looking for excitement, this action film is definitely worth a watch!"
  },
  {
    heading: "Question 5 of 17",
    audioUrl: "audio/question1_13/audio_de3_q5.mp3",
    question: "Where does Malik want to go?",
    options: ["The town hall", "The library", "The park"],
    correctAnswer: "The town hall",
    transcript: "Malik has been hearing a lot about an important event, and the town hall is where he wants to go because he believes it will give him a chance to learn more, engage with the community, and share his own ideas."
  },
  {
    heading: "Question 6 of 17",
    audioUrl: "audio/question1_13/audio_de3_q6.mp3",
    question: "Greg is talking about a working day in his life. How does he go to work?",
    options: ["By bus", "By car", "By bike"],
    correctAnswer: "By bus",
    transcript: "Hi, everyone! I’m Greg, and I want to tell you about a typical working day in my life. I usually wake up early, around 7 A.M. After a quick breakfast, I get ready for work. I like to wear smart clothes because I work in an office. I go by bus every day, which takes about 30 minutes. I enjoy looking out the window and listening to music on my way. When I arrive at the office, I start my day by checking emails and planning my tasks. I have meetings with my team, and we work together on projects."
  },
  {
    heading: "Question 7 of 17",
    audioUrl: "audio/question1_13/audio_de3_q7.mp3",
    question: "Listen to a nutrition expert. What time is the best for children to eat fruit?",
    options: ["In the morning", "In the afternoon", "In the evening"],
    correctAnswer: "In the morning",
    transcript: "Hello, everyone! I’m here to talk about nutrition and how important it is for our health. Eating fruits is very beneficial, especially for children. Fruits have vitamins and minerals that help kids grow strong and stay healthy. The best time for children to eat fruit is in the morning. This gives them energy for the day ahead. You can add fruit to breakfast, like in a smoothie or with yogurt. It’s a delicious and healthy way to start the day! So, let’s encourage our kids to eat more fruit in the morning! Thank you!"
  },
  {
    heading: "Question 8 of 17",
    audioUrl: "audio/question1_13/audio_de3_q8.mp3",
    question: "Listen to a woman explaining her morning routine to her friend. Why do women get up early?",
    options: ["To go to work", "To take care of their kids", "To have some quiet time"],
    correctAnswer: "To have some quiet time",
    transcript: "I usually wake up early each day before anyone else. Some people get up early to go to work or to take care of their kids, but for me, it’s all about enjoying that calm before the busyness begins. I enjoy this quiet time because it helps me start my day peacefully. It’s nice to have a few moments to myself, sipping coffee and planning my day ahead."
  },
  {
    heading: "Question 9 of 17",
    audioUrl: "audio/question1_13/audio_de3_q9.mp3",
    question: "A man is talking to his friend. Why does he need to learn to drive?",
    options: ["To go on a road trip", "To take his family on vacations", "He has to drive to work"],
    correctAnswer: "He has to drive to work",
    transcript: "Man: Hey, Sarah. I’ve got some news—I’m moving to a new place.\nWoman: Oh really? That sounds exciting! Where’s your new place?\nMan: It's actually pretty far from my workplace, and the public transport there isn't great. So, I've been thinking, I need to learn how to drive.\nWoman: Yeah, that makes sense. It's hard to rely on public transport if it's not reliable. Have you ever driven before? Man: Not really. I've always used buses and trains, but now it looks like I don't have a choice. I need to get a license.\nWoman: You'll get the hang of it. Driving will definitely make your commute easier. Are you planning to take lessons soon?\nMan: Yeah, I'm going to sign up for a driving school next week. Hopefully, I can get it done quickly."
  },
  {
    heading: "Question 10 of 17",
    audioUrl: "audio/question1_13/audio_de3_q10.mp3",
    question: "Two friends are talking with each other. What did they both buy?",
    options: ["Clothes", "Shoes", "Books"],
    correctAnswer: "Clothes",
    transcript: "Man: I just got back from shopping. I found a great jacket and also picked up some tea.\nWoman: Nice! What kind of jacket did you get?\nMan: It’s a stylish leather jacket. I think it’ll be perfect for the fall. What about you?\nWoman: I bought a cozy sweater and also grabbed a delicious cake.\nMan: Sounds great! Those are perfect for this weather. Woman: Thanks! I’m excited to try the cake later. Looks like we both made good choices today!\nMan: Absolutely! New clothes and tasty treats for the chilly days ahead!"
  },
  {
    heading: "Question 11 of 17",
    audioUrl: "audio/question1_13/audio_de3_q11.mp3",
    question: "What area is he describing?",
    options: ["A shopping district", "A university area", "A residential neighborhood"],
    correctAnswer: "A university area",
    transcript: "He’s describing a place with a vibrant atmosphere, full of students and professors. The university area is where he’s talking about, known for its lively campus, beautiful buildings, and the mix of academic and social life that surrounds it."
  },
  {
    heading: "Question 12 of 17",
    audioUrl: "audio/question1_13/audio_de3_q12.mp3",
    question: "A man wants to buy a new house. What is his biggest problem?",
    options: ["Finding the right house", "Persuading his family", "Getting the financing"],
    correctAnswer: "Persuading his family",
    transcript: "I’ve been having a tough time lately. I really want to move abroad for a new job, but my family isn’t on board with it. They’re worried about me leaving and don’t understand why I want to go so far away. I’ve tried to explain all the benefits, but they just don’t seem to get it. It’s really frustrating because I want their support, but it feels like I’m not getting through to them."
  },
  {
    heading: "Question 13 of 17",
    audioUrl: "audio/question1_13/audio_de3_q13.mp3",
    question: "Listening to a tour guide talking about Rock City. How old is the city?",
    options: ["1000 years", "2000 years", "1500 years"],
    correctAnswer: "1500 years",
    transcript: "Welcome to Rock City, everyone! I'm excited to show you around this amazing place. Rock City has a very long and interesting history. People first started living here about 1500 years ago. Can you believe how old that is? It's older than many famous cities in the world! The city got its name because of all the big rocks you can see around us. Over time, people built houses and roads between these rocks. Today, we can still see many old buildings from long ago."
  },
  {
    heading: "Question 1 of 17",
    audioUrl: "audio/question1_13/audio_de4_q1.mp3",
    question: "Listen to the instructions of a university. Where is the main office?",
    options: ["in the basement", "on the first floor", "on the second floor"],
    correctAnswer: "on the first floor",
    transcript: "Welcome to our university! When you enter the campus, you’ll see the library on your left and the cafeteria on your right. If you need help with anything, the main office is on the first floor of the center campus building. There, you can ask about classes, schedules, or anything else. Behind the main building, you’ll find the gym and sports area. For quiet study, there are some nice spots in the garden near the science building. Make sure to explore and enjoy your time here!"
  },
  {
    heading: "Question 2 of 17",
    audioUrl: "audio/question1_13/audio_de4_q2.mp3",
    question: "How much can Max pay for the computer?",
    options: ["200 pounds", "250 pounds", "300 pounds"],
    correctAnswer: "250 pounds",
    transcript: "Hi, it’s me Max. I’m calling about the computer that you are selling. You see. My computer is old and slow. I can’t play any games on it any more and would like to replace it with a new one. How much do you offer? I can pay 250 pounds. This afternoon I am busy but we can discuss this tomorrow morning. Is that okay? Call me back soon."
  },
  {
    heading: "Question 3 of 17",
    audioUrl: "audio/question1_13/audio_de4_q3.mp3",
    question: "Where does he want to go tomorrow?",
    options: ["The park", "The cinema", "The town hall"],
    correctAnswer: "The town hall",
    transcript: "He has some important things to discuss tomorrow, and the town hall is where he wants to go, as it’s the perfect place for the meeting and gathering more information."
  },
  {
    heading: "Question 4 of 17",
    audioUrl: "audio/question1_13/audio_de4_q4.mp3",
    question: "What will they bring to the picnic?",
    options: ["Drinks", "Food", "Snacks"],
    correctAnswer: "Food",
    transcript: "Pierre: Hey, Emma, are you ready for the picnic this weekend?\nEmma: Definitely! I’m really looking forward to it. Do you know what everyone’s bringing?\nPierre: Yeah, I spoke with a few people. Sarah’s bringing cups and bowls, and Tom said he’ll take care of drinks. He’s got some lemonade and iced tea ready.\nEmma: Sounds great! I think Clara mentioned she’s making a fruit salad, right?\nPierre: Yep, and Leo’s bringing chips and dips. I guess we’re pretty covered on snacks.\nEmma: Awesome! So, what should we bring? Maybe some food in case we might get hungry?\nPierre: That’s a good idea. How about we prepare some chicken and french fries?\nEmma: Perfect! This picnic is going to be amazing!"
  },
  {
    heading: "Question 5 of 17",
    audioUrl: "audio/question1_13/audio_de4_q5.mp3",
    question: "How many people live in the town?",
    options: ["5,000", "10,000", "20,000"],
    correctAnswer: "10,000",
    transcript: "Welcome, everyone! Today, I’m excited to introduce you to our charming small town. Right here in the town square, you’ll find local shops, cozy cafes, and a beautiful fountain where people gather to relax. This square is the heart of our community, often filled with cool events like farmers' markets and live music. Currently, there are 10,000 people living in this town. As we explore, you’ll see the unique blend of history and modern life that makes our town so special."
  },
  {
    heading: "Question 6 of 17",
    audioUrl: "audio/question1_13/audio_de4_q6.mp3",
    question: "Where are they going to meet?",
    options: ["at the park", "at the station", "at the university"],
    correctAnswer: "at the park",
    transcript: "Hi, it’s me! I wanted to confirm where we’re meeting today. I thought we agreed to meet at the park, right? It’s a nice place to relax and catch up. The station would be too crowded, and the university is a bit far for me. Let’s stick to the park so we can enjoy the weather. What time should I meet you there?"
  },
  {
    heading: "Question 7 of 17",
    audioUrl: "audio/question1_13/audio_de4_q7.mp3",
    question: "What color top is he going to buy?",
    options: ["Green", "Red", "Black"],
    correctAnswer: "Black",
    transcript: "Man: Hello, I would like to buy a top, please.\nWoman: Sure, do you have anything particular in mind? Man: I like the design of that green one over there. Do you have it in blue?\nWoman: Maybe. What size are you?\nMan: I am wearing large.\nWoman: Let me see. Ohh. We have that one in blue but small. The red and black ones, however, are available in large.\nMan: Red is not my cup of tea. Well, I will go with the other option then."
  },
  {
    heading: "Question 8 of 17",
    audioUrl: "audio/question1_13/audio_de4_q8.mp3",
    question: "What career did he choose?",
    options: ["to work in business", "to become a teacher", "to become a researcher"],
    correctAnswer: "to work in business",
    transcript: "Woman: Welcome, how may I help you?\nMan: Yes, I would like to have some advice for my future job. I majored in Mathematics. Is there anything that I could do?\nWoman: Well, there are a variety of career paths you can take, let say becoming a teacher, a businessman, or continue to study higher to become a researcher.\nMan: I have a friend who also majors in Mathematics and he is now a businessman with his own company. I guess that would be my choice then. I am not suitable to become a teacher since I think I am a bit impatient."
  },
  {
    heading: "Question 9 of 17",
    audioUrl: "audio/question1_13/audio_de4_q9.mp3",
    question: "When is the assignment due?",
    options: ["on Friday", "on Saturday", "on Sunday"],
    correctAnswer: "on Saturday",
    transcript: "The assignment needs to be submitted soon, and it’s due on Saturday. Make sure to finish it by then to avoid any last-minute stress."
  },
  {
    heading: "Question 10 of 17",
    audioUrl: "audio/question1_13/audio_de4_q10.mp3",
    question: "What course did he take? / Listen to a student talking about his study. What course is the student going to take this year?",
    options: ["English", "Math", "Computer"],
    correctAnswer: "Computer",
    transcript: "Hi, I’m Ben, and I want to share a bit about my studies. Last term, I took English, math, and science. They were all interesting, but math was a bit tough for me. I worked hard, though, and got good results in the end. This year, I’m really excited because I’m going to take a computer course. I’ve always wanted to learn more about technology, so I’m looking forward to it!"
  },
  {
    heading: "Question 11 of 17",
    audioUrl: "audio/question1_13/audio_de4_q11.mp3",
    question: "What did she like best about the film?",
    options: ["the mountain scenes", "the action scenes", "the ending"],
    correctAnswer: "the mountain scenes",
    transcript: "\"The Fall\" is one of my favorite films, which I saw last weekend. The film was so terrific that it kept me on the edge of my seat all the time. I usually don’t like watching action movies as they feel the same and repetitive with those dull racing car scenes and meaningless fights that go on for hours. The mountain scenes were rather unusual. The sequencing fascinatingly brings out the most captivating parts for me. The ending, however, was a bit sad. Many people wish it was a happy ending."
  },
  {
    heading: "Question 12 of 17",
    audioUrl: "audio/question1_13/audio_de4_q12.mp3",
    question: "What elements of the film do they agree on?",
    options: ["the soundtrack", "the characters", "the ending"],
    correctAnswer: "the ending",
    transcript: "Man: \"I just finished watching that film we talked about. What did you think?\"\nWoman: \"I loved it! The ending was so satisfying!\"\nMan: \"Absolutely! It wrapped everything up perfectly. But I wasn’t really sold on the characters.\"\nWoman: \"Really? I thought the characters were great and well developed!\"\nMan: \"I felt they were a bit cliché, especially the main character. But I really love the soundtrack.\"\nWoman: \"Honestly, I didn’t like the music at all. It felt out of place.\""
  },
  {
    heading: "Question 13 of 17",
    audioUrl: "audio/question1_13/audio_de4_q13.mp3",
    question: "Why does Douglas call Kay?",
    options: ["to ask for a favor", "to say thank you", "to discuss ideas"],
    correctAnswer: "to say thank you",
    transcript: "Hi, Kay! It’s Douglas. I hope you are doing well. I wanted to call you today to say thank you for all your help with the project. Your advice was really valuable, and it made a big difference. I also wanted to ask for a favor. If you have some time, I would love to meet and discuss a few ideas I have. Let me know when you are free!"
  }
];
