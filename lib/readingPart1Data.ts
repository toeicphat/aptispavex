
export interface Part1Question {
    textBefore: string;
    textAfter: string;
    options: string[];
    correctAnswer: string;
}

export interface ReadingPart1Set {
    id: number;
    questions: Part1Question[];
    tip: string;
}

export const readingPart1Data: ReadingPart1Set[] = [
    {
        id: 1,
        tip: "Station (Trạm) stops (dừng) ở nơi green (xanh) để ăn dinner (tối) và xem movies (phim).",
        questions: [
            { textBefore: "Can you meet me at the", textAfter: "please?", options: ["station", "office", "corner"], correctAnswer: "station" },
            { textBefore: "The bus usually", textAfter: "here for ten minutes.", options: ["stops", "runs", "goes"], correctAnswer: "stops" },
            { textBefore: "The grass in the park is very", textAfter: "in the summer.", options: ["green", "blue", "red"], correctAnswer: "green" },
            { textBefore: "We will have", textAfter: "at 7 PM.", options: ["dinner", "lunch", "breakfast"], correctAnswer: "dinner" },
            { textBefore: "Do you like watching", textAfter: "at the cinema?", options: ["movies", "books", "games"], correctAnswer: "movies" }
        ]
    },
    {
        id: 2,
        tip: "Mỗi morning (sáng), các friends (bạn bè) leave (rời đi) tìm đồ good food (ăn ngon).",
        questions: [
            { textBefore: "Every", textAfter: "I go for a run.", options: ["morning", "night", "evening"], correctAnswer: "morning" },
            { textBefore: "I like spending time with my", textAfter: ".", options: ["friends", "enemies", "strangers"], correctAnswer: "friends" },
            { textBefore: "What time do you usually", textAfter: "the house?", options: ["leave", "stay", "come"], correctAnswer: "leave" },
            { textBefore: "This restaurant serves very", textAfter: "meals.", options: ["good", "bad", "slow"], correctAnswer: "good" },
            { textBefore: "We bought some", textAfter: "at the market.", options: ["food", "water", "air"], correctAnswer: "food" }
        ]
    },
    {
        id: 3,
        tip: "Tại home (nhà), các customers (khách hàng) thấy easy (dễ) để prepare (chuẩn bị) và watch (xem).",
        questions: [
            { textBefore: "I prefer to stay at", textAfter: "on Sundays.", options: ["home", "work", "school"], correctAnswer: "home" },
            { textBefore: "The shop has many happy", textAfter: ".", options: ["customers", "sellers", "managers"], correctAnswer: "customers" },
            { textBefore: "It is", textAfter: "to learn English if you practice.", options: ["easy", "hard", "heavy"], correctAnswer: "easy" },
            { textBefore: "Can you help me", textAfter: "the table?", options: ["prepare", "make", "do"], correctAnswer: "prepare" },
            { textBefore: "I like to", textAfter: "TV in the evening.", options: ["watch", "see", "look"], correctAnswer: "watch" }
        ]
    },
    {
        id: 4,
        tip: "Ở park (công viên), các classes (lớp học) rất easy (dễ) cho việc breakfast (ăn sáng) và meditation (thiền).",
        questions: [
            { textBefore: "Let's go for a walk in the", textAfter: ".", options: ["park", "road", "sea"], correctAnswer: "park" },
            { textBefore: "I attend yoga", textAfter: "every week.", options: ["classes", "rooms", "jobs"], correctAnswer: "classes" },
            { textBefore: "The exam was very", textAfter: ", everyone passed.", options: ["easy", "difficult", "long"], correctAnswer: "easy" },
            { textBefore: "I usually eat eggs for", textAfter: ".", options: ["breakfast", "dinner", "supper"], correctAnswer: "breakfast" },
            { textBefore: "He practices", textAfter: "to relax his mind.", options: ["meditation", "sports", "running"], correctAnswer: "meditation" }
        ]
    },
    {
        id: 5,
        tip: "Một cuộc friendly (thân thiện) walk (đi bộ) là điều first (đầu tiên) để ta speak (nói chuyện) together (cùng nhau).",
        questions: [
            { textBefore: "The staff here are very", textAfter: "and helpful.", options: ["friendly", "angry", "sad"], correctAnswer: "friendly" },
            { textBefore: "We went for a long", textAfter: "in the forest.", options: ["walk", "drive", "fly"], correctAnswer: "walk" },
            { textBefore: "This is my", textAfter: "time visiting this city.", options: ["first", "one", "once"], correctAnswer: "first" },
            { textBefore: "Can I", textAfter: "to the manager?", options: ["speak", "tell", "say"], correctAnswer: "speak" },
            { textBefore: "They always study", textAfter: "in the library.", options: ["together", "alone", "separate"], correctAnswer: "together" }
        ]
    },
    {
        id: 6,
        tip: "Cạnh chiếc bicycle (xe đạp), những tall trees (cây cao) che cho buổi breakfast (ăn sáng) và meditation (thiền).",
        questions: [
            { textBefore: "He rides his", textAfter: "to work every day.", options: ["bicycle", "car", "bus"], correctAnswer: "bicycle" },
            { textBefore: "The building is very", textAfter: ".", options: ["tall", "short", "low"], correctAnswer: "tall" },
            { textBefore: "There are many oak", textAfter: "in the garden.", options: ["trees", "flowers", "grass"], correctAnswer: "trees" },
            { textBefore: "Don't skip", textAfter: ", it's important.", options: ["breakfast", "lunch", "snack"], correctAnswer: "breakfast" },
            { textBefore: "Morning", textAfter: "helps me focus.", options: ["meditation", "sleeping", "eating"], correctAnswer: "meditation" }
        ]
    },
    {
        id: 7,
        tip: "Chuyến visit (thăm) căn room (phòng) trên chiếc hot (nóng) train (tàu hỏa) làm họ phải speak (lên tiếng).",
        questions: [
            { textBefore: "We plan to", textAfter: "our grandparents.", options: ["visit", "look", "watch"], correctAnswer: "visit" },
            { textBefore: "My bedroom is my favorite", textAfter: ".", options: ["room", "place", "area"], correctAnswer: "room" },
            { textBefore: "The weather is very", textAfter: "today.", options: ["hot", "cold", "cool"], correctAnswer: "hot" },
            { textBefore: "The", textAfter: "arrived at the station late.", options: ["train", "car", "bike"], correctAnswer: "train" },
            { textBefore: "Please", textAfter: "slowly and clearly.", options: ["speak", "talk", "tell"], correctAnswer: "speak" }
        ]
    },
    {
        id: 8,
        tip: "Tại farm (nông trại), những người excited (hào hứng) đã left (rời khỏi) con street (đường) để đi drink (uống nước).",
        questions: [
            { textBefore: "My uncle lives on a large", textAfter: ".", options: ["farm", "factory", "office"], correctAnswer: "farm" },
            { textBefore: "The children were", textAfter: "about the trip.", options: ["excited", "bored", "tired"], correctAnswer: "excited" },
            { textBefore: "He", textAfter: "his keys on the table.", options: ["left", "took", "put"], correctAnswer: "left" },
            { textBefore: "Don't play in the", textAfter: ", it's dangerous.", options: ["street", "house", "garden"], correctAnswer: "street" },
            { textBefore: "Would you like a", textAfter: "of water?", options: ["drink", "eat", "bite"], correctAnswer: "drink" }
        ]
    },
    {
        id: 9,
        tip: "Từ home (nhà), tôi drive (lái xe) đưa friends (bạn bè) đi walk (đi dạo) ở nơi pretty (đẹp).",
        questions: [
            { textBefore: "I want to go", textAfter: "now.", options: ["home", "house", "place"], correctAnswer: "home" },
            { textBefore: "Can you", textAfter: "a car?", options: ["drive", "ride", "run"], correctAnswer: "drive" },
            { textBefore: "I met some old", textAfter: "at the party.", options: ["friends", "people", "man"], correctAnswer: "friends" },
            { textBefore: "Let's take a", textAfter: "around the lake.", options: ["walk", "run", "jump"], correctAnswer: "walk" },
            { textBefore: "She wore a very", textAfter: "dress.", options: ["pretty", "ugly", "bad"], correctAnswer: "pretty" }
        ]
    },
    {
        id: 10,
        tip: "Ở country (quốc gia) này, một clean (sạch sẽ) class (lớp học) dùng nhiều other words (từ ngữ khác).",
        questions: [
            { textBefore: "Which", textAfter: "do you come from?", options: ["country", "city", "town"], correctAnswer: "country" },
            { textBefore: "Please keep your room", textAfter: ".", options: ["clean", "dirty", "messy"], correctAnswer: "clean" },
            { textBefore: "There are 20 students in my", textAfter: ".", options: ["class", "school", "office"], correctAnswer: "class" },
            { textBefore: "I have", textAfter: "plans for the weekend.", options: ["other", "another", "others"], correctAnswer: "other" },
            { textBefore: "How many", textAfter: "did you write?", options: ["words", "letters", "books"], correctAnswer: "words" }
        ]
    },
    {
        id: 11,
        tip: "Trong một kỳ small (nhỏ) stay (ở lại), khu garden (vườn) có những trees (cây) rất old (già/cổ).",
        questions: [
            { textBefore: "I live in a", textAfter: "apartment.", options: ["small", "big", "huge"], correctAnswer: "small" },
            { textBefore: "Did you", textAfter: "at a hotel?", options: ["stay", "live", "be"], correctAnswer: "stay" },
            { textBefore: "She is planting flowers in the", textAfter: ".", options: ["garden", "kitchen", "bathroom"], correctAnswer: "garden" },
            { textBefore: "Birds are singing in the", textAfter: ".", options: ["trees", "sky", "ground"], correctAnswer: "trees" },
            { textBefore: "That building is very", textAfter: ".", options: ["old", "new", "young"], correctAnswer: "old" }
        ]
    },
    {
        id: 12,
        tip: "Ở near (gần) cái small (nhỏ) shop (cửa hàng), họ hay talk (nói chuyện) và visit (thăm hỏi).",
        questions: [
            { textBefore: "Is there a bank", textAfter: "here?", options: ["near", "far", "away"], correctAnswer: "near" },
            { textBefore: "He has a", textAfter: "dog.", options: ["small", "long", "tall"], correctAnswer: "small" },
            { textBefore: "I need to go to the", textAfter: "to buy milk.", options: ["shop", "park", "gym"], correctAnswer: "shop" },
            { textBefore: "We can", textAfter: "about this later.", options: ["talk", "speak", "say"], correctAnswer: "talk" },
            { textBefore: "I will", textAfter: "London next week.", options: ["visit", "go", "come"], correctAnswer: "visit" }
        ]
    },
    {
        id: 13,
        tip: "Vào morning (buổi sáng) ở park (công viên), họ leave (rời đi) sau khi breakfast (ăn sáng) để kịp meet (gặp).",
        questions: [
            { textBefore: "Good", textAfter: "everyone!", options: ["morning", "night", "day"], correctAnswer: "morning" },
            { textBefore: "Children play in the", textAfter: ".", options: ["park", "road", "river"], correctAnswer: "park" },
            { textBefore: "What time does the train", textAfter: "?", options: ["leave", "arrive", "stop"], correctAnswer: "leave" },
            { textBefore: "Breakfast is the first", textAfter: "of the day.", options: ["meal", "snack", "food"], correctAnswer: "breakfast" },
            { textBefore: "Nice to", textAfter: "you.", options: ["meet", "see", "watch"], correctAnswer: "meet" }
        ]
    }
];

export const readingPart1Data2: ReadingPart1Set[] = [
    {
        id: 1,
        tip: "Key: station - stops - green - dinner - movies",
        questions: [
            { textBefore: "Where is the train", textAfter: "in this town?", options: ["station", "school", "market"], correctAnswer: "station" },
            { textBefore: "The bus", textAfter: "here every morning.", options: ["runs", "stops", "flies"], correctAnswer: "stops" },
            { textBefore: "The traffic light is", textAfter: "so you can go now.", options: ["red", "yellow", "green"], correctAnswer: "green" },
            { textBefore: "We usually have", textAfter: "at 7 p.m.", options: ["breakfast", "lunch", "dinner"], correctAnswer: "dinner" },
            { textBefore: "Do you like watching", textAfter: "on weekends?", options: ["books", "movies", "hotdog"], correctAnswer: "movies" }
        ]
    },
    {
        id: 2,
        tip: "Key: morning - friends - leave - good - food",
        questions: [
            { textBefore: "I always study in the", textAfter: "before school.", options: ["morning", "sea", "roof"], correctAnswer: "morning" },
            { textBefore: "My", textAfter: "and I play football after class.", options: ["friends", "dog", "tree"], correctAnswer: "friends" },
            { textBefore: "I always", textAfter: "my bag on the chair.", options: ["leave", "go", "love"], correctAnswer: "leave" },
            { textBefore: "Apples are very", textAfter: "for your health.", options: ["hate", "lovely", "good"], correctAnswer: "good" },
            { textBefore: "We eat rice and", textAfter: "every day.", options: ["food", "books", "games"], correctAnswer: "food" }
        ]
    },
    {
        id: 3,
        tip: "Key: home - customers - easy - prepare - watch",
        questions: [
            { textBefore: "Where is your", textAfter: "?", options: ["home", "sea", "park"], correctAnswer: "home" },
            { textBefore: "Do you talk to", textAfter: "at work?", options: ["customers", "bird", "chair"], correctAnswer: "customers" },
            { textBefore: "Is the task", textAfter: "for you?", options: ["easy", "go", "bring"], correctAnswer: "easy" },
            { textBefore: "What do you", textAfter: "in the morning?", options: ["prepare", "big", "team"], correctAnswer: "prepare" },
            { textBefore: "What do you like to", textAfter: "on TV?", options: ["watch", "read", "take"], correctAnswer: "watch" }
        ]
    },
    {
        id: 4,
        tip: "Key: park - classes - easy - breakfast - meditation",
        questions: [
            { textBefore: "Do you jog in the", textAfter: "in the morning?", options: ["park", "moon", "tree"], correctAnswer: "park" },
            { textBefore: "Does the gym offer", textAfter: "for yoga?", options: ["classes", "running", "books"], correctAnswer: "classes" },
            { textBefore: "Is English", textAfter: "for you?", options: ["easy", "try", "bye"], correctAnswer: "easy" },
            { textBefore: "What do you eat for", textAfter: "every day?", options: ["breakfast", "love", "cold"], correctAnswer: "breakfast" },
            { textBefore: "Do you practice", textAfter: "to relax?", options: ["meditation", "book", "healthy"], correctAnswer: "meditation" }
        ]
    },
    {
        id: 5,
        tip: "Key: friendly - walk - first - speak - together",
        questions: [
            { textBefore: "Is your neighborhood", textAfter: "?", options: ["friendly", "hate", "big"], correctAnswer: "friendly" },
            { textBefore: "How do you usually", textAfter: "to work?", options: ["run", "walk", "buy"], correctAnswer: "walk" },
            { textBefore: "When did you meet your friend", textAfter: "?", options: ["first", "love", "bring"], correctAnswer: "first" },
            { textBefore: "Can you", textAfter: "French?", options: ["speak", "big", "most"], correctAnswer: "speak" },
            { textBefore: "Do you like going out", textAfter: "with your friends?", options: ["alone", "together", "morning"], correctAnswer: "together" }
        ]
    },
    {
        id: 6,
        tip: "Key: bicycle - tall - trees - breakfast - games",
        questions: [
            { textBefore: "I go to school by", textAfter: ".", options: ["spaceship", "plane", "bicycle"], correctAnswer: "bicycle" },
            { textBefore: "The buildings in my city are very", textAfter: ".", options: ["hate", "tall", "went"], correctAnswer: "tall" },
            { textBefore: "There are many green", textAfter: "near my home.", options: ["road", "buy", "trees"], correctAnswer: "trees" },
            { textBefore: "I eat", textAfter: "with my family every morning.", options: ["breakfast", "lunch", "dinner"], correctAnswer: "breakfast" },
            { textBefore: "I play", textAfter: "to feel relaxed.", options: ["games", "make", "time"], correctAnswer: "games" }
        ]
    },
    {
        id: 7,
        tip: "Key: visit - room - hot - train - speak",
        questions: [
            { textBefore: "I want to", textAfter: "my grandparents this weekend.", options: ["visit", "clean", "run"], correctAnswer: "visit" },
            { textBefore: "My", textAfter: "is very clean and bright.", options: ["room", "father", "mother"], correctAnswer: "room" },
            { textBefore: "The weather is", textAfter: "today.", options: ["big", "hot", "small"], correctAnswer: "hot" },
            { textBefore: "We went to the city by", textAfter: ".", options: ["spaceship", "plane", "train"], correctAnswer: "train" },
            { textBefore: "I can", textAfter: "English very well.", options: ["make", "speak", "love"], correctAnswer: "speak" }
        ]
    },
    {
        id: 8,
        tip: "Key: farm - excited - left - street - drink",
        questions: [
            { textBefore: "My uncle works on a", textAfter: ".", options: ["farm", "compare", "spare"], correctAnswer: "farm" },
            { textBefore: "The children were very", textAfter: "about the trip.", options: ["run", "excited", "most"], correctAnswer: "excited" },
            { textBefore: "Turn", textAfter: "at the next corner.", options: ["big", "left", "go"], correctAnswer: "left" },
            { textBefore: "We walked along the", textAfter: "to the park.", options: ["water", "street", "cloud"], correctAnswer: "street" },
            { textBefore: "I usually", textAfter: "milk in the morning.", options: ["stone", "drink", "school"], correctAnswer: "drink" }
        ]
    },
    {
        id: 9,
        tip: "Key: home - drive - friends - walk - pretty",
        questions: [
            { textBefore: "I usually stay at", textAfter: "on Sundays.", options: ["cloud", "home", "road"], correctAnswer: "home" },
            { textBefore: "My father can", textAfter: "very well.", options: ["fly", "drive", "big"], correctAnswer: "drive" },
            { textBefore: "I like spending time with my", textAfter: "after school.", options: ["tree", "friends", "go"], correctAnswer: "friends" },
            { textBefore: "Let’s go for a", textAfter: "in the park.", options: ["walk", "big", "sea"], correctAnswer: "walk" },
            { textBefore: "Your sister looks very", textAfter: "today.", options: ["pretty", "father", "went"], correctAnswer: "pretty" }
        ]
    },
    {
        id: 10,
        tip: "Key: country - clean - class - other - words",
        questions: [
            { textBefore: "I want to travel to the", textAfter: "this summer.", options: ["country", "small", "big"], correctAnswer: "country" },
            { textBefore: "Please keep your room", textAfter: ".", options: ["green", "boring", "clean"], correctAnswer: "clean" },
            { textBefore: "We have English", textAfter: "on Monday.", options: ["class", "lunch", "sea"], correctAnswer: "class" },
            { textBefore: "I like helping", textAfter: "people.", options: ["myself", "father", "other"], correctAnswer: "other" },
            { textBefore: "Can you spell these", textAfter: "for me?", options: ["small", "bring", "words"], correctAnswer: "words" }
        ]
    },
    {
        id: 11,
        tip: "Key: small - stay - garden - trees - old",
        questions: [
            { textBefore: "My bedroom is very", textAfter: ".", options: ["boring", "small", "healthy"], correctAnswer: "small" },
            { textBefore: "We usually", textAfter: "at a hotel on vacation.", options: ["stay", "movie", "bring"], correctAnswer: "stay" },
            { textBefore: "There are many flowers in the", textAfter: ".", options: ["sky", "garden", "water"], correctAnswer: "garden" },
            { textBefore: "Some", textAfter: "near my home are very tall.", options: ["cloud", "trees", "morning"], correctAnswer: "trees" },
            { textBefore: "My grandfather is very", textAfter: "but still strong.", options: ["hot", "old", "free"], correctAnswer: "old" }
        ]
    },
    {
        id: 12,
        tip: "Key: love - small - shop - people - visit",
        questions: [
            { textBefore: "I", textAfter: "reading books in the library.", options: ["love", "make", "run"], correctAnswer: "love" },
            { textBefore: "My bag is a bit", textAfter: "for my laptop.", options: ["mean", "small", "again"], correctAnswer: "small" },
            { textBefore: "Can you go to the", textAfter: "to buy some milk?", options: ["shop", "park", "sea"], correctAnswer: "shop" },
            { textBefore: "There are many", textAfter: "in the class.", options: ["people", "birds", "trees"], correctAnswer: "people" },
            { textBefore: "They want to", textAfter: "the class.", options: ["room", "visit", "fly"], correctAnswer: "visit" }
        ]
    },
    {
        id: 13,
        tip: "Key: morning - park - leave - breakfast - meet",
        questions: [
            { textBefore: "I drink coffee in the", textAfter: ".", options: ["morning", "sky", "free"], correctAnswer: "morning" },
            { textBefore: "Children play in the", textAfter: ".", options: ["park", "big", "hot"], correctAnswer: "park" },
            { textBefore: "What time do you", textAfter: "home?", options: ["leave", "bring", "stop"], correctAnswer: "leave" },
            { textBefore: "We eat bread for", textAfter: ".", options: ["breakfast", "train", "time"], correctAnswer: "breakfast" },
            { textBefore: "Nice to", textAfter: "you.", options: ["meet", "hate", "look"], correctAnswer: "meet" }
        ]
    }
];
