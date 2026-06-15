export interface NetzwerkNoun {
  article: 'der' | 'das' | 'die';
  german: string;
  english: string;
  plural?: string;
}

export interface NetzwerkPhrase {
  german: string;
  english: string;
}

export interface NetzwerkExercise {
  id: string;
  title: string;
  instructions: string;
  type: 'multiple-choice' | 'fill-blanks' | 'order' | 'dialogue';
  questions: {
    prompt: string;
    options?: string[]; // For multiple choice / matching
    answer: string; // Correct answer or space-separated correct sentence
    hint?: string;
  }[];
}

export interface NetzwerkChapter {
  id: number;
  title: string;
  topic: string;
  grammarTitle: string;
  grammarDescription: string;
  grammarPoints: {
    rule: string;
    example: string;
    explanation: string;
  }[];
  nouns: NetzwerkNoun[];
  verbsPhrases: NetzwerkPhrase[];
  exercises: NetzwerkExercise[];
}

export const NETZWERK_A1_CHAPTETS: NetzwerkChapter[] = [
  {
    id: 1,
    title: "Kapitel 1: Guten Tag!",
    topic: "Greetings, introductions, self-introductions, numbers, countries, and origins.",
    grammarTitle: "Verbkonjugation (sein, heißen) & W-Fragen",
    grammarDescription: "Learn to conjugate basic verbs in the present tense and ask open-ended questions using custom question words (W-Fragen).",
    grammarPoints: [
      { rule: "heißen (to be named)", example: "ich heiße, du heißt, er/sie heißt, Sie heißen", explanation: "Verb used for stating names. Notice the drop of 's' for 'du heißt' due to the double-s character (ß)." },
      { rule: "sein (to be)", example: "ich bin, du bist, er/sie ist, wir sind, Sie sind", explanation: "Irregular auxiliary verb crucial for level A1." },
      { rule: "W-Fragen (Who, Where, How, What)", example: "Wer ist das? Woher kommen Sie? Wie heißen Sie?", explanation: "Question words always start with 'W' and place the conjugated verb in the 2nd position." }
    ],
    nouns: [
      { article: "der", german: "Name", english: "Name", plural: "Namen" },
      { article: "der", german: "Tag", english: "Day", plural: "Tage" },
      { article: "der", german: "Morgen", english: "Morning", plural: "Morgen" },
      { article: "der", german: "Abend", english: "Evening", plural: "Abende" },
      { article: "die", german: "Frau", english: "Woman / Mrs.", plural: "Frauen" },
      { article: "der", german: "Herr", english: "Man / Mr.", plural: "Herren" },
      { article: "das", german: "Land", english: "Country", plural: "Länder" },
      { article: "die", german: "Sprache", english: "Language", plural: "Sprachen" }
    ],
    verbsPhrases: [
      { german: "kommen aus", english: "to come from" },
      { german: "sprechen", english: "to speak" },
      { german: "Guten Tag!", english: "Good day! / Hello" },
      { german: "Wie geht es dir?", english: "How are you? (informal)" },
      { german: "Sehr gut, danke.", english: "Very well, thank you." },
      { german: "Auf Wiedersehen!", english: "Goodbye! (formal)" }
    ],
    exercises: [
      {
        id: "ch1_ex1",
        title: "Übung 1: Verben konjugieren",
        instructions: "Choose the correct form of 'sein' or 'kommen'.",
        type: "multiple-choice",
        questions: [
          { prompt: "Woher ______ Sie?", options: ["komme", "kommst", "kommen", "kommt"], answer: "kommen" },
          { prompt: "Ich ______ Leon aus Berlin.", options: ["bin", "bist", "ist", "sind"], answer: "bin" },
          { prompt: "Wie ______ du?", options: ["heiße", "heißt", "heißen", "heißt"], answer: "heißt" },
          { prompt: "Wer ______ das?", options: ["bin", "bist", "ist", "sind"], answer: "ist" }
        ]
      },
      {
        id: "ch1_ex2",
        title: "Übung 2: Fragewörter (W-Fragen)",
        instructions: "Fill in the blank with the correct W-Frage (Wer, Woher, Was, Wie).",
        type: "fill-blanks",
        questions: [
          { prompt: "______ wohnst du? (In München.)", answer: "Wo", hint: "Where" },
          { prompt: "______ kommen Sie? (Aus der Schweiz.)", answer: "Woher", hint: "Where from" },
          { prompt: "______ sprechen Sie? (Deutsch und Englisch.)", answer: "Was", hint: "What" },
          { prompt: "______ ist das? (Das ist Herr Müller.)", answer: "Wer", hint: "Who" }
        ]
      },
      {
        id: "ch1_ex3",
        title: "Übung 3: Dialog ordnen",
        instructions: "Put the sentences in the correct logical sequence.",
        type: "order",
        questions: [
          { prompt: "Sentence 1: Guten Tag! Mein Name ist Klaus.", answer: "1" },
          { prompt: "Sentence 2: Guten Tag! Ich heiße Anna. Freut mich.", answer: "2" },
          { prompt: "Sentence 3: Woher kommen Sie, Frau Anna?", answer: "3" },
          { prompt: "Sentence 4: Ich komme aus Österreich.", answer: "4" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Kapitel 2: Freunde, Kollegen und ich",
    topic: "Introduction of friends, talking about family members, marital status, professions, and alphabets.",
    grammarTitle: "Personalpronomen, regelmäßige Verben & Nomen Plural",
    grammarDescription: "Study how verb endings change regularly according to subject pronouns, and learn German plural changes.",
    grammarPoints: [
      { rule: "Regular Verb Conjugation", example: "ich wohn-e, du wohn-st, er/sie wohn-t, wir wohn-en, ihr wohn-t, sie/Sie wohn-en", explanation: "Drop '-en' from the infinitive and append endings: -e, -st, -t, -en, -t, -en." },
      { rule: "Personal Pronouns (Singular & Plural)", example: "ich (I), du (you), er/sie/es (he/she/it), wir (we), ihr (you all), sie/Sie (they/You)", explanation: "Study the distinction between informal 'du' (singular), 'ihr' (plural) and formal 'Sie'." },
      { rule: "Plural Noun Forms", example: "das Kind -> die Kinder, die Freundin -> die Freundinnen", explanation: "German plurals take different suffix patterns (-er, -en, -e, -s) and often add umlauts." }
    ],
    nouns: [
      { article: "der", german: "Vater", english: "Father", plural: "Väter" },
      { article: "die", german: "Mutter", english: "Mother", plural: "Mütter" },
      { article: "das", german: "Kind", english: "Child", plural: "Kinder" },
      { article: "der", german: "Beruf", english: "Profession", plural: "Berufe" },
      { article: "der", german: "Freund", english: "Friend (male)", plural: "Freunde" },
      { article: "die", german: "Freundin", english: "Friend (female)", plural: "Freundinnen" },
      { article: "der", german: "Kollege", english: "Colleague (male)", plural: "Kollegen" },
      { article: "die", german: "Familie", english: "Family", plural: "Familien" }
    ],
    verbsPhrases: [
      { german: "arbeiten als", english: "to work as" },
      { german: "wohnen in", english: "to live in" },
      { german: "leben", english: "to live / exist" },
      { german: "verheiratet sein", english: "to be married" },
      { german: "geschieden sein", english: "to be divorced" },
      { german: "Single sein", english: "to be single" }
    ],
    exercises: [
      {
        id: "ch2_ex1",
        title: "Übung 1: Korrekte Verbendung",
        instructions: "Choose the conjugated verb ending matching the pronoun.",
        type: "multiple-choice",
        questions: [
          { prompt: "Wir ______ in Hamburg.", options: ["wohne", "wohnst", "wohnen", "wohnt"], answer: "wohnen" },
          { prompt: "Was ______ du von Beruf?", options: ["bin", "bist", "ist", "sind"], answer: "bist" },
          { prompt: "Ihr ______ Deutsch.", options: ["lerne", "lernst", "lernen", "lernt"], answer: "lernt" },
          { prompt: "Sie (she) ______ als Ärztin.", options: ["arbeite", "arbeitest", "arbeitet", "arbeiten"], answer: "arbeitet" }
        ]
      },
      {
        id: "ch2_ex2",
        title: "Übung 2: Pluralformen",
        instructions: "Provide the correct plural form of the provided noun.",
        type: "fill-blanks",
        questions: [
          { prompt: "das Kind -> zwei ______", answer: "Kinder", hint: "Children" },
          { prompt: "die Freundin -> zwei ______", answer: "Freundinnen", hint: "Female friends" },
          { prompt: "der Beruf -> viele ______", answer: "Berufe", hint: "Professions" },
          { prompt: "das Haus -> viele ______", answer: "Häuser", hint: "Houses" }
        ]
      },
      {
        id: "ch2_ex3",
        title: "Übung 3: Sätze bilden",
        instructions: "Construct the sentence correctly in German order (Subject + Verb + Obj).",
        type: "order",
        questions: [
          { prompt: "Satz 1: arbeitet / Müller / als Ingenieur / Herr", answer: "Herr Müller arbeitet als Ingenieur" },
          { prompt: "Satz 2: wir / Deutsch / lernen / gerne", answer: "Wir lernen gerne Deutsch" },
          { prompt: "Satz 3: verheiratet / bist / du / ?", answer: "Bist du verheiratet ?" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Kapitel 3: In der Stadt",
    topic: "Sights in town, public places, counting up to 1000, asking for directions, and describing sights.",
    grammarTitle: "Artikelbestimmung & Negation mit kein / nicht",
    grammarDescription: "Understand definite, indefinite, and negative articles in the nominative case.",
    grammarPoints: [
      { rule: "Definite vs. Indefinite Articles", example: "der Baum (the tree) -> ein Baum (a tree), die Schule -> eine Schule, das Haus -> ein Haus", explanation: "Nouns are marked as masculine (der), feminine (die), or neuter (das). Plural nouns do not have an indefinite article." },
      { rule: "Negation: 'kein' vs. 'nicht'", example: "Das ist kein Hotel. (not a hotel) / Ich wohne nicht hier. (not here)", explanation: "Use 'kein/keine' to negate nouns with indefinite articles or no articles. Use 'nicht' to negate specific adjectives, verbs, or adverbs." },
      { rule: "Compound Nouns (Komposita)", example: "die Stadt + der Plan = der Stadtplan", explanation: "Compound nouns always inherit their gender and article from the very last noun in the compound." }
    ],
    nouns: [
      { article: "die", german: "Stadt", english: "City / Town", plural: "Städte" },
      { article: "der", german: "Bahnhof", english: "Train Station", plural: "Bahnhöfe" },
      { article: "die", german: "Kirche", english: "Church", plural: "Kirchen" },
      { article: "das", german: "Museum", english: "Museum", plural: "Museen" },
      { article: "der", german: "Platz", english: "Square / Plaza", plural: "Plätze" },
      { article: "die", german: "Straße", english: "Street", plural: "Straßen" },
      { article: "das", german: "Hotel", english: "Hotel", plural: "Hotels" },
      { article: "der", german: "Tourist", english: "Tourist", plural: "Touristen" }
    ],
    verbsPhrases: [
      { german: "suchen", english: "to search / look for" },
      { german: "finden", english: "to find" },
      { german: "Entschuldigung,", english: "Excuse me, / Pardon," },
      { german: "Wo ist der Dom?", english: "Where is the cathedral?" },
      { german: "Das liegt im Zentrum.", english: "That lies in the center." },
      { german: "Kein Problem!", english: "No problem!" }
    ],
    exercises: [
      {
        id: "ch3_ex1",
        title: "Übung 1: Bestimmte / Unbestimmte Artikel",
        instructions: "Select the correct article based on the noun gender.",
        type: "multiple-choice",
        questions: [
          { prompt: "Das ist ______ Museum. (Neuter)", options: ["ein", "eine", "einer", "der"], answer: "ein" },
          { prompt: "Da ist ______ Kirche. (Feminine)", options: ["ein", "eine", "einen", "der"], answer: "eine" },
          { prompt: "Wo ist ______ Bahnhof? (Masculine definite)", options: ["der", "das", "die", "ein"], answer: "der" },
          { prompt: "Haben Sie ______ Stadtplan? (Masculine accusative - ein/einen)", options: ["ein", "einen", "eine", "die"], answer: "einen" }
        ]
      },
      {
        id: "ch3_ex2",
        title: "Übung 2: kein oder nicht?",
        instructions: "Negate the sentence correctly using 'kein/keine' or 'nicht'.",
        type: "fill-blanks",
        questions: [
          { prompt: "Das ist ______ Auto, das ist ein Zug. (Das Auto)", answer: "kein", hint: "not an" },
          { prompt: "Ich verstehe das ______.", answer: "nicht", hint: "not" },
          { prompt: "Wir haben ______ Zeit. (Die Zeit)", answer: "keine", hint: "no time" },
          { prompt: "Das Hotel ist ______ teuer.", answer: "nicht", hint: "not" }
        ]
      },
      {
        id: "ch3_ex3",
        title: "Übung 3: Richtung erfragen",
        instructions: "Assemble a logical path-finding dialogue question.",
        type: "order",
        questions: [
          { prompt: "1: Entschuldigung, wo ist das Rathaus?", answer: "1" },
          { prompt: "2: Das Rathaus ist ganz in der Nähe.", answer: "2" },
          { prompt: "3: Gehen Sie links und dann geradeaus.", answer: "3" },
          { prompt: "4: Vielen Dank für die Hilfe!", answer: "4" }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Kapitel 4: Guten Appetit!",
    topic: "Talking about food, grocery shopping, recipes, measuring quantities, weights, and ordering in a restaurant.",
    grammarTitle: "Akkusativ & Verben (essen, mögen, möchten)",
    grammarDescription: "Discover how the masculine article changes in the direct object position (Akkusativ), while others stay same.",
    grammarPoints: [
      { rule: "Akkusativ-Objekt (Grammatical Direct Object)", example: "der Apfel -> den/einen/keinen Apfel. die Suppe -> die/eine/keine Suppe. das Brot -> das/ein/kein Brot.", explanation: "Only masculine singular nouns change articles in the accusative case (der -> den, ein -> einen, kein -> einen). Feminine, neuter, and plurals remain identical to Nominativ." },
      { rule: "Verb: essen (irregular: e -> i)", example: "ich esse, du isst, er/sie isst, wir essen, ihr esst, sie/Sie essen", explanation: "Vowel shifts in the 2nd and 3rd person singular forms." },
      { rule: "möchten vs. mögen", example: "Ich möchte Kaffee. (polite request 'would like') vs. Ich mag Kaffee. (general preference 'like')", explanation: "Learn to distinguish these two common verbs in a restaurant setting." }
    ],
    nouns: [
      { article: "die", german: "Banane", english: "Banana", plural: "Bananen" },
      { article: "der", german: "Apfel", english: "Apple", plural: "Äpfel" },
      { article: "das", german: "Brot", english: "Bread", plural: "Brote" },
      { article: "der", german: "Käse", english: "Cheese", plural: "Käse" },
      { article: "die", german: "Milch", english: "Milk", plural: "Milch" },
      { article: "das", german: "Fleisch", english: "Meat" },
      { article: "der", german: "Fisch", english: "Fish", plural: "Fische" },
      { article: "das", german: "Gemüse", english: "Vegetables" }
    ],
    verbsPhrases: [
      { german: "trinken", english: "to drink" },
      { german: "kochen", english: "to cook" },
      { german: "Wie viel kostet ein Kilo?", english: "How much is a kilo?" },
      { german: "Ich hätte gerne einen Apfel.", english: "I would love to have an apple." },
      { german: "Guten Appetit!", english: "Enjoy your meal!" },
      { german: "Sonst noch etwas?", english: "Anything else?" }
    ],
    exercises: [
      {
        id: "ch4_ex1",
        title: "Übung 1: Akkusativ Endungen",
        instructions: "Choose the correct accusative article.",
        type: "multiple-choice",
        questions: [
          { prompt: "Ich trinke ______ Saft. (der Saft)", options: ["der", "den", "dem", "die"], answer: "den" },
          { prompt: "Er isst ______ Banane. (die Banane)", options: ["ein", "einen", "eine", "das"], answer: "eine" },
          { prompt: "Haben wir ______ Brot? (das Brot)", options: ["ein", "einen", "eine", "der"], answer: "ein" },
          { prompt: "Wir brauchen ______ Äpfel. (Plural negative)", options: ["kein", "keinen", "keine", "keinem"], answer: "keine" }
        ]
      },
      {
        id: "ch4_ex2",
        title: "Übung 2: essen und trinken",
        instructions: "Fill in blank with correct verb endings.",
        type: "fill-blanks",
        questions: [
          { prompt: "Was ______ du morgens? (essen)", answer: "isst", hint: "irregular du form" },
          { prompt: "Wir ______ eine Suppe. (kochen)", answer: "kochen", hint: "wir form" },
          { prompt: "______ ihr ein Bier? (trinken)", answer: "trinkt", hint: "ihr form" },
          { prompt: "Er ______ keinen Fisch. (essen)", answer: "isst", hint: "he eats" }
        ]
      },
      {
        id: "ch4_ex3",
        title: "Übung 3: Einkaufen am Markt",
        instructions: "Arrange grocery questions.",
        type: "order",
        questions: [
          { prompt: "1: Guten Tag, ich brauche Kartoffeln.", answer: "1" },
          { prompt: "2: Wie viele möchten Sie? Ein Kilo?", answer: "2" },
          { prompt: "3: Ja, bitte. Sonst noch etwas?", answer: "3" },
          { prompt: "4: Nein danke, das ist alles.", answer: "4" }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Kapitel 5: Tag für Tag",
    topic: "Daily routines, declaring times (formal vs informal), days of the week, planning appointments.",
    grammarTitle: "Trennbare Verben & Präpositionen (um, am, von...bis)",
    grammarDescription: "Master verbs with removable prefixes that slide all the way to the end of your sentence, and express dates/times.",
    grammarPoints: [
      { rule: "Trennbare Verben (Separable Verbs)", example: "anrufen (to call) -> Ich rufe Anna an.", explanation: "Prefixes (an-, auf-, ein-, mit-, fern-) separate from the core verb stem and sit as the very last word in typical main clauses." },
      { rule: "Zeitantgaben (Telling Time)", example: "Es ist viertel nach acht (8:15) / Es ist acht Uhr fünfzehn (08:15 formal)", explanation: "Informal uses relative chunks (viertel vor/nach, halb) whereas formal uses plain hours and minutes." },
      { rule: "Prepositions of Date & Time", example: "um 8 Uhr (at), am Montag (on), von 9 bis 17 Uhr (from... to)", explanation: "am is for days & parts of the day (except in der Nacht). um is for precise times." }
    ],
    nouns: [
      { article: "die", german: "Uhr", english: "Clock / Hour", plural: "Uhren" },
      { article: "die", german: "Zeit", english: "Time" },
      { article: "der", german: "Termin", english: "Appointment", plural: "Termine" },
      { article: "der", german: "Montag", english: "Monday" },
      { article: "der", german: "Dienstag", english: "Tuesday" },
      { article: "der", german: "Samstag", english: "Saturday" },
      { article: "der", german: "Sonntag", english: "Sunday" },
      { article: "die", german: "Woche", english: "Week", plural: "Wochen" }
    ],
    verbsPhrases: [
      { german: "aufstehen", english: "to stand up / wake up" },
      { german: "anrufen", english: "to call on phone" },
      { german: "einkaufen", english: "to shop" },
      { german: "fernsehen", english: "to watch TV" },
      { german: "Wie spät ist es?", english: "What time is it?" },
      { german: "Ich habe keine Zeit.", english: "I have no time." }
    ],
    exercises: [
      {
        id: "ch5_ex1",
        title: "Übung 1: Trennbare Verben",
        instructions: "Select the correct conjugated prefix positioning.",
        type: "multiple-choice",
        questions: [
          { prompt: "Klaus steht um 6 Uhr ______.", options: ["an", "mit", "auf", "ein"], answer: "auf" },
          { prompt: "Ich ______ meine Mutter an.", options: ["kaufe", "rufe", "stehe", "sehe"], answer: "rufe" },
          { prompt: "Wann ______ du heute ein?", options: ["rufst", "siehst", "kaufst", "stehst"], answer: "kaufst" },
          { prompt: "Wir ______ heute Abend fern.", options: ["sehen", "rufen", "kaufen", "machen"], answer: "sehen" }
        ]
      },
      {
        id: "ch5_ex2",
        title: "Übung 2: Präpositionen der Zeit",
        instructions: "Fill in the blank with (am, um, von, bis).",
        type: "fill-blanks",
        questions: [
          { prompt: "Der Kurs beginnt ______ Montag. (Monday)", answer: "am", hint: "on" },
          { prompt: "Wir essen ______ 13:00 Uhr zu Mittag.", answer: "um", hint: "at" },
          { prompt: "Ich arbeite ______ 8 Uhr ______ 16 Uhr.", answer: "von", hint: "from" },
          { prompt: "Der Termin ist ______ Nachmittag. (Nachmittag)", answer: "am", hint: "in the" }
        ]
      },
      {
        id: "ch5_ex3",
        title: "Übung 3: Uhrzeit benennen",
        instructions: "Expressing time: 'Es ist viertel vor sieben'",
        type: "order",
        questions: [
          { prompt: "6:45 (informal expression order): ist / vor / Es / sieben / viertel", answer: "Es ist viertel vor sieben" },
          { prompt: "14:30 (informal): halb / Es / drei / ist", answer: "Es ist halb drei" }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Kapitel 6: Zeit mit Freunden",
    topic: "Hobbies, making invitations, responding (accepting/declining), and ordering food outdoors.",
    grammarTitle: "Modalverben (können, wollen) & Akkusativ-Pronomen",
    grammarDescription: "Conjugate modal auxiliary verbs which push secondary infinitives directly to the end of statements.",
    grammarPoints: [
      { rule: "Modal Verbs (können, wollen)", example: "ich kann, du kannst, er kann, wir können / ich will, du willst, er will, wir wollen", explanation: "For modal verbs, the 1st and 3rd person singular forms are identical and have no endings. No umlaut is present in singular conjugated forms." },
      { rule: "Sentence Architecture with Modals", example: "Ich kann heute nicht kommen. (Modal conjugated in 2nd position, infinitive at very end)", explanation: "Always bracket the actions by sending regular main verbs to the back." },
      { rule: "Akkusativ Pronomen (Direct Personal Pronouns)", example: "mich (me), dich (you), ihn (him), sie (her), es (it), uns (us), euch (you all), sie/Sie (them/You)", explanation: "Used when the pronoun acts as direct recipient of transitive processes (e.g., 'Ich liebe dich')." }
    ],
    nouns: [
      { article: "die", german: "Freizeit", english: "Free time" },
      { article: "das", german: "Hobby", english: "Hobby", plural: "Hobbys" },
      { article: "die", german: "Einladung", english: "Invitation", plural: "Einladungen" },
      { article: "die", german: "Lust", english: "Desire / Mood" },
      { article: "der", german: "Ausflug", english: "Excursion / Trip", plural: "Ausflüge" },
      { article: "das", german: "Kino", english: "Cinema", plural: "Kinos" },
      { article: "der", german: "Sport", english: "Sports" }
    ],
    verbsPhrases: [
      { german: "tanzen", english: "to dance" },
      { german: "Musik hören", english: "to listen to music" },
      { german: "Fußball spielen", english: "to play soccer" },
      { german: "Lust haben auf", english: "to have a mood for" },
      { german: "Danke für die Einladung!", english: "Thank you for the invitation!" },
      { german: "Es tut mir leid, das geht leider nicht.", english: "I am sorry, that is not possible." }
    ],
    exercises: [
      {
        id: "ch6_ex1",
        title: "Übung 1: Modalverben können/wollen",
        instructions: "Choose correct form of modal verbs.",
        type: "multiple-choice",
        questions: [
          { prompt: "______ du heute Fußball spielen? (wollen)", options: ["willst", "wollst", "will", "wollen"], answer: "willst" },
          { prompt: "Klaus ______ sehr gut Gitarre spielen. (können)", options: ["kannst", "kann", "könnt", "können"], answer: "kann" },
          { prompt: "Wir ______ ins Kino gehen. (wollen)", options: ["will", "willst", "wollen", "wollt"], answer: "wollen" },
          { prompt: "______ ihr Deutsch sprechen? (können)", options: ["kannst", "könnt", "können", "kann"], answer: "könnt" }
        ]
      },
      {
        id: "ch6_ex2",
        title: "Übung 2: Akkusativ Pronomen",
        instructions: "Replace the bracketed word with an Accusative pronoun.",
        type: "fill-blanks",
        questions: [
          { prompt: "Rufst du (Klaus) ______ heute an?", answer: "ihn", hint: "him" },
          { prompt: "Ich liebe (du) ______.", answer: "dich", hint: "you" },
          { prompt: "Siehst du (die Freundinnen) ______?", answer: "sie", hint: "them" },
          { prompt: "Hörst du (ich) ______?", answer: "mich", hint: "me" }
        ]
      },
      {
        id: "ch6_ex3",
        title: "Übung 3: Einladung ablehnen",
        instructions: "Arrange polite rejection sentences.",
        type: "order",
        questions: [
          { prompt: "Satz 1: Lust / Hast / du / ins / Kino / zu / gehen / ?", answer: "Hast du Lust ins Kino zu gehen ?" },
          { prompt: "Satz 2: kann / kommen / Ich / leider / heute / nicht", answer: "Ich kann heute leider nicht kommen" }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Kapitel 7: Kontakte",
    topic: "Modern media usage, reading ads, writing short emails and messages, past events talking.",
    grammarTitle: "Perfekt mit haben / sein & Partizip II",
    grammarDescription: "Construct conversational past statements utilizing the Perfekt tense structures.",
    grammarPoints: [
      { rule: "Perfekt Tense Framework", example: "Ich habe gelernt (I learned) / Er ist gefahren (He drove/went)", explanation: "Combine present auxiliary 'haben' or 'sein' (for changes of place/state) with Partizip II at the very end of statement." },
      { rule: "Regular Partizip II", example: "machen -> ge-mach-t, kaufen -> ge-kauf-t", explanation: "Add prefix 'ge-' and suffix '-t' to regular dictionary stems." },
      { rule: "Irregular and Separable participles", example: "gehen -> gegangen, anrufen -> angerufen", explanation: "Irregular stems shift vowels and end on '-en'. Separable prefixes swallow 'ge' right in between: an-ge-rufen." }
    ],
    nouns: [
      { article: "die", german: "E-Mail", english: "Email", plural: "E-Mails" },
      { article: "das", german: "Handy", english: "Mobile Phone", plural: "Handys" },
      { article: "der", german: "Computer", english: "Computer", plural: "Computer" },
      { article: "die", german: "Information", english: "Information", plural: "Informationen" },
      { article: "die", german: "Nachricht", english: "Message", plural: "Nachrichten" },
      { article: "das", german: "Internet", english: "Internet" }
    ],
    verbsPhrases: [
      { german: "schreiben", english: "to write" },
      { german: "lesen", english: "to read" },
      { german: "surfen", english: "to surf (e.g. net)" },
      { german: "telefonieren mit", english: "to speak on phone with" },
      { german: "Ich habe eine Nachricht geschrieben.", english: "I wrote a message." },
      { german: "Er ist nach Berlin gereist.", english: "He travelled to Berlin." }
    ],
    exercises: [
      {
        id: "ch7_ex1",
        title: "Übung 1: Partizip II bilden",
        instructions: "Choose the correct past participle form.",
        type: "multiple-choice",
        questions: [
          { prompt: "Ich habe gestern Deutsch ______.", options: ["gelernt", "gelehrt", "lernen", "gelernen"], answer: "gelernt" },
          { prompt: "Maria ist am Sonntag nach Hause ______.", options: ["gegangen", "geht", "gegoht", "gingen"], answer: "gegangen" },
          { prompt: "Wir haben mit dem Arzt ______.", options: ["getelefoniert", "telefoniert", "telefonieren", "getelefonieren"], answer: "telefoniert" },
          { prompt: "Hast du den Laptop ______? (anmachen separable)", options: ["angemacht", "gemachtan", "angegetan", "angemachen"], answer: "angemacht" }
        ]
      },
      {
        id: "ch7_ex2",
        title: "Übung 2: Hilfsverb: haben oder sein?",
        instructions: "Fill in blank with correct conjugation of haben or sein.",
        type: "fill-blanks",
        questions: [
          { prompt: "Ich ______ gestern ein Buch gelesen.", answer: "habe", hint: "read is active" },
          { prompt: "Wann ______ du nach Deutschland gekommen?", answer: "bist", hint: "movement of place" },
          { prompt: "Wir ______ viel Sport gemacht.", answer: "haben", hint: "did sports" },
          { prompt: "______ ihr dorthin gerannt?", answer: "seid", hint: "running is motion" }
        ]
      },
      {
        id: "ch7_ex3",
        title: "Übung 3: E-Mail ordnen",
        instructions: "Arrange a formal email greeting sequence.",
        type: "order",
        questions: [
          { prompt: "1: Sehr geehrte Damen und Herren,", answer: "1" },
          { prompt: "2: Ich möchte mich für den Kurs anmelden.", answer: "2" },
          { prompt: "3: Mit freundlichen Grüßen,", answer: "3" },
          { prompt: "4: Anna Schmitt", answer: "4" }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Kapitel 8: Meine Wohnung",
    topic: "Furniture, housing types, describing an apartment, reading real estate advertisements, and describing spatial locations.",
    grammarTitle: "Adjektive & Lokale Präpositionen mit Dativ",
    grammarDescription: "Discover how adjectives modify homes, and track prepositions of place forcing dative endings.",
    grammarPoints: [
      { rule: "Dative Case with Prepositions (Wo? / Location)", example: "in (in), auf (on), unter (under), neben (next to), an (at/on vertical face)", explanation: "When asking static location 'Wo?', these two-way prepositions take the Dative Case. Articles change: der/das -> dem, die -> der, plural die -> den + 'n' appended to plural nouns." },
      { rule: "Contractions", example: "in + dem = im. an + dem = am. bei + dem = beim.", explanation: "Very frequent spoken contractions for neat style." },
      { rule: "Basic Adjectives", example: "groß (big) - klein (small), hell (bright) - dunkel (dark), billig (cheap) - teuer (expensive)", explanation: "Adjectives sitting after verb be (predicative) take no grammatical suffix changes in German." }
    ],
    nouns: [
      { article: "die", german: "Wohnung", english: "Apartment", plural: "Wohnungen" },
      { article: "das", german: "Zimmer", english: "Room / Chamber", plural: "Zimmer" },
      { article: "die", german: "Küche", english: "Kitchen", plural: "Küchen" },
      { article: "das", german: "Bad", english: "Bathroom", plural: "Bäder" },
      { article: "der", german: "Tisch", english: "Table", plural: "Tische" },
      { article: "der", german: "Stuhl", english: "Chair", plural: "Stühle" },
      { article: "das", german: "Bett", english: "Bed", plural: "Betten" },
      { article: "der", german: "Schrank", english: "Cabinet / Wardrobe", plural: "Schränke" }
    ],
    verbsPhrases: [
      { german: "mieten", english: "to rent" },
      { german: "bezahlen", english: "to pay" },
      { german: "Wo wohnst du?", english: "Where do you live?" },
      { german: "Die Wohnung ist sehr hell.", english: "The apartment is very bright." },
      { german: "Miete warm / kalt", english: "Rent including / excluding heating prices" }
    ],
    exercises: [
      {
        id: "ch8_ex1",
        title: "Übung 1: Dativ Ergänzung",
        instructions: "Choose the correct dative article form.",
        type: "multiple-choice",
        questions: [
          { prompt: "Das Buch liegt auf ______ Tisch. (der Tisch)", options: ["den", "dem", "der", "das"], answer: "dem" },
          { prompt: "Wir wohnen in ______ Wohnung. (die Wohnung)", options: ["einem", "eine", "einer", "den"], answer: "einer" },
          { prompt: "Die Kinder schlafen in ______ Bett. (das Bett)", options: ["dem", "den", "der", "einec"], answer: "dem" },
          { prompt: "Der Schrank steht neben ______ Tür. (die Tür)", options: ["der", "die", "dem", "den"], answer: "der" }
        ]
      },
      {
        id: "ch8_ex2",
        title: "Übung 2: Gegenteile bilden (Opposites)",
        instructions: "Find the antonym of the provided adjective.",
        type: "fill-blanks",
        questions: [
          { prompt: "Das Zimmer ist nicht dunkel, sondern ______.", answer: "hell", hint: "bright" },
          { prompt: "Die Miete ist nicht billig, sie ist ______.", answer: "teuer", hint: "expensive" },
          { prompt: "Mein Haus ist nicht klein, es ist ______.", answer: "groß", hint: "big" },
          { prompt: "Die Küche ist nicht schmutzig, sondern ______.", answer: "sauber", hint: "clean" }
        ]
      },
      {
        id: "ch8_ex3",
        title: "Übung 3: Wohnungsbeschreibung",
        instructions: "Describe the flat layout.",
        type: "order",
        questions: [
          { prompt: "Satz 1: drei Zimmer / hat / Meine Wohnung / und ein Bad", answer: "Meine Wohnung hat drei Zimmer und ein Bad" },
          { prompt: "Satz 2: ist / teuer / Die Miete / aber / groß / das Zimmer / ist", answer: "Die Miete ist teuer aber das Zimmer ist groß" }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Kapitel 9: Alles Arbeit?",
    topic: "Work routines, job descriptions, office environments, answering business phone calls, past status with Präteritum.",
    grammarTitle: "Modalverben (müssen, dürfen) & Präteritum: war / hatte",
    grammarDescription: "Gain familiarity with obligations (müssen), permission rules (dürfen), and simple past verbs.",
    grammarPoints: [
      { rule: "müssen (must / have to)", example: "ich muss, du musst, er muss, wir müssen, ihr müsst", explanation: "Represents absolute logical obligation. Note double 's' and lack of umlaut in singular." },
      { rule: "dürfen (may / allowed to)", example: "ich darf, du darfst, er darf, wir dürfen, ihr dürft", explanation: "Represents modal permission or prohibition (with nicht). Ex: 'Hier darf man nicht rauchen' (No smoking allowed here)." },
      { rule: "Präteritum (Simple Past) of sein / haben", example: "war (was) / hatte (had)", explanation: "In daily speak, Germans heavily prefer simple past for auxiliary verbs: 'Ich war müde' (I was tired) / 'Er hatte Zeit' (He had time)." }
    ],
    nouns: [
      { article: "die", german: "Arbeit", english: "Work / Job" },
      { article: "die", german: "Firma", english: "Company / Firm", plural: "Firmen" },
      { article: "der", german: "Chef", english: "Boss (male)", plural: "Chefs" },
      { article: "der", german: "Kunde", english: "Client / Customer", plural: "Kunden" },
      { article: "das", german: "Telefon", english: "Telephone", plural: "Telefone" },
      { article: "die", german: "Kollegin", english: "Colleague (female)", plural: "Kolleginnen" },
      { article: "das", german: "Protokoll", english: "Protocol / Minutes", plural: "Protokolle" }
    ],
    verbsPhrases: [
      { german: "drucken", english: "to print" },
      { german: "arbeiten", english: "to work" },
      { german: "einen Termin vereinbaren", english: "to schedule an appointment" },
      { german: "E-Mails beantworten", english: "to answer emails" },
      { german: "Am Apparat.", english: "Speaking. (on the phone)" },
      { german: "Einen Moment, bitte.", english: "One moment, please." }
    ],
    exercises: [
      {
        id: "ch9_ex1",
        title: "Übung 1: müssen oder dürfen?",
        instructions: "Select the correct modal representation.",
        type: "multiple-choice",
        questions: [
          { prompt: "Hier ist ein Spital. Man ______ nicht laut sprechen.", options: ["darf", "muss", "kann", "will"], answer: "darf" },
          { prompt: "Ich ______ heute lange arbeiten, mein Chef will das.", options: ["darf", "muss", "kann", "willst"], answer: "muss" },
          { prompt: "______ wir hier parken? Ist das erlaubt?", options: ["Dürfen", "Müssen", "Wollen", "Können"], answer: "Dürfen" },
          { prompt: "Du ______ deine Hausaufgaben machen!", options: ["darfst", "musst", "kannst", "wollt"], answer: "musst" }
        ]
      },
      {
        id: "ch9_ex2",
        title: "Übung 2: Präteritum war/hatte",
        instructions: "Conjugate war (was) or hatte (had) correctly.",
        type: "fill-blanks",
        questions: [
          { prompt: "Gestern ______ ich krank zu Hause. (sein)", answer: "war", hint: "I was" },
          { prompt: "______ du gestern Zeit für mich? (haben)", answer: "hattest", hint: "you had" },
          { prompt: "Wir ______ ein schönes Meeting mit dem Chef. (haben)", answer: "hatten", hint: "we had" },
          { prompt: "Wo ______ ihr am Wochenende? (sein)", answer: "wart", hint: "you all were" }
        ]
      },
      {
        id: "ch9_ex3",
        title: "Übung 3: Telefonat",
        instructions: "Order a corporate phone conversation.",
        type: "order",
        questions: [
          { prompt: "1: Firma Müller, guten Tag. Was kann ich für Sie tun?", answer: "1" },
          { prompt: "2: Guten Tag, ich möchte Herrn Schmidt sprechen.", answer: "2" },
          { prompt: "3: Einen Moment, ich verbinde Sie.", answer: "3" },
          { prompt: "4: Vielen Dank!", answer: "4" }
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Kapitel 10: Kleidung und Mode",
    topic: "Clothing pieces, selecting colors, evaluating prices, talking about shopping habits, expressing preferences.",
    grammarTitle: "Demonstrativartikel & Vergleichsstufen (gern/lieber/am liebsten)",
    grammarDescription: "Focus on pointing out specific clothes using 'dieser' and comparing styles.",
    grammarPoints: [
      { rule: "Demonstrativ-Artikel (this / these)", example: "dieser Mantel (m), dieses Kleid (n), diese Jacke (f), diese Schuhe (pl)", explanation: "Demonstrative pronouns change exact endings just like specific definite articles to emphasize item choices." },
      { rule: "Comparison Levels (gern / lieber / am liebsten)", example: "Ich trinke gern Saft, aber ich trinke lieber Bier, am liebsten trinke ich Wein.", explanation: "Useful comparison for expressing levels of favorite preferences." },
      { rule: "Welcher? (Which?)", example: "Welches Kleid gefällt dir? (Which dress do you like?)", explanation: "Question word ending mirrors definite articles in Nominativ/Akkusativ." }
    ],
    nouns: [
      { article: "die", german: "Kleidung", english: "Clothing" },
      { article: "der", german: "Mantel", english: "Coat", plural: "Mäntel" },
      { article: "die", german: "Hose", english: "Pants / Trousers", plural: "Hosen" },
      { article: "das", german: "Hemd", english: "Shirt", plural: "Hemden" },
      { article: "die", german: "Jacke", english: "Jacket", plural: "Jacken" },
      { article: "der", german: "Schuh", english: "Shoe", plural: "Schuhe" },
      { article: "das", german: "Kleid", english: "Dress", plural: "Kleider" },
      { article: "der", german: "Rock", english: "Skirt", plural: "Röcke" }
    ],
    verbsPhrases: [
      { german: "tragen", english: "to wear / carry" },
      { german: "gefallen", english: "to please / appeal to" },
      { german: "Welche Farbe hat das Auto?", english: "Which color is the car?" },
      { german: "Das steht dir ausgezeichnet!", english: "That suits you perfectly!" },
      { german: "Das Kleid ist schick.", english: "The dress is elegant." }
    ],
    exercises: [
      {
        id: "ch10_ex1",
        title: "Übung 1: Demonstrativpronomen",
        instructions: "Match endings to clothing genders.",
        type: "multiple-choice",
        questions: [
          { prompt: "Gefällt dir ______ Mantel? (der Mantel)", options: ["dieser", "dieses", "diese", "diesen"], answer: "dieser" },
          { prompt: "Ich nehme ______ Hemd. (das Hemd - accusative)", options: ["dieser", "dieses", "diese", "diesen"], answer: "dieses" },
          { prompt: "Wie viel kostet ______ Hose? (die Hose)", options: ["dieser", "dieses", "diese", "diesen"], answer: "diese" },
          { prompt: "Geben Sie mir ______ Schuhe, bitte. (die Schuhe accusative pl)", options: ["dieser", "dieses", "diese", "diesen"], answer: "diese" }
        ]
      },
      {
        id: "ch10_ex2",
        title: "Übung 2: gern, lieber, am liebsten",
        instructions: "Express continuous preference climbs.",
        type: "fill-blanks",
        questions: [
          { prompt: "Ich koche gern, aber im Restaurant esse ich ______.", answer: "lieber", hint: "more preferably" },
          { prompt: "Fußball spielst du gern, aber Tennis spielst du ______.", answer: "lieber", hint: "more preferably" },
          { prompt: "Am ______ gehe ich ins Kino.", answer: "liebsten", hint: "most preferably" },
          { prompt: "Trinkst du ______ Milch oder Apfelsaft?", answer: "lieber", hint: "more preferably" }
        ]
      },
      {
        id: "ch10_ex3",
        title: "Übung 3: Outfitberatung",
        instructions: "Order matching outfit comments.",
        type: "order",
        questions: [
          { prompt: "1: Wie gefällt dir diese blaue Jacke?", answer: "1" },
          { prompt: "2: Die Jacke ist sehr schick, aber teuer.", answer: "2" },
          { prompt: "3: Probiere doch mal diese rote Jacke an.", answer: "3" },
          { prompt: "4: Oh, die steht mir wirklich gut!", answer: "4" }
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Kapitel 11: Gesund und fit",
    topic: "Naming human body parts, describing symptoms of sickness, preparing advice, visiting a doctor, sports/fitness activity.",
    grammarTitle: "Imperativ (Anweisungen) & Possessivartikel (Akkusativ)",
    grammarDescription: "Give urgent commands (Imperativ) and label objects using personal possessives.",
    grammarPoints: [
      { rule: "Imperativ (Commands / Advice)", example: "du-Form: Trink viel Wasser! / ihr-Form: Trinkt Milch! / Sie-Form: Trinken Sie Saft!", explanation: "For 'du' imperative, drop the pronoun 'du' and the final '-st' ending. For 'Sie' imperative, swap position: Verb + Sie!" },
      { rule: "Possessivartikel in Accusative Forms", example: "mein -> meinen (m) / mein (n) / meine (f) / meine (pl)", explanation: "Possessive pronouns take exact ending alterations in direct object placements just like definite/indefinite components." },
      { rule: "Sickness Expressions", example: "Ich habe Kopfschmerzen (I have a headache) / Mein Hals tut weh (My throat hurts)", explanation: "Very standard phrasing for consulting medical professionals." }
    ],
    nouns: [
      { article: "der", german: "Körper", english: "Body" },
      { article: "der", german: "Kopf", english: "Head", plural: "Köpfe" },
      { article: "der", german: "Hals", english: "Throat / Neck", plural: "Hälse" },
      { article: "der", german: "Schmerz", english: "Pain", plural: "Schmerzen" },
      { article: "der", german: "Arzt", english: "Doctor (male)", plural: "Ärzte" },
      { article: "die", german: "Tablette", english: "Pill / Tablet", plural: "Tabletten" },
      { article: "das", german: "Fieber", english: "Fever" },
      { article: "der", german: "Sport", english: "Sports" }
    ],
    verbsPhrases: [
      { german: "wehtun", english: "to hurt / pain" },
      { german: "husten", english: "to cough" },
      { german: "schlafen", english: "to sleep" },
      { german: "Gute Besserung!", english: "Get well soon!" },
      { german: "Ich bin krank.", english: "I am sick." },
      { german: "Du musst zum Arzt gehen.", english: "You must go to the doctor." }
    ],
    exercises: [
      {
        id: "ch11_ex1",
        title: "Übung 1: Imperativ Sätze",
        instructions: "Formulate the correct imperative verb forms.",
        type: "multiple-choice",
        questions: [
          { prompt: "Klaus, ______ doch eine Tablette! (nehmen - du form)", options: ["nimmst", "nimm", "nehmen", "nehmt"], answer: "nimm" },
          { prompt: "Herr Schmidt, ______ Sie viel Wasser! (trinken - formal)", options: ["trinken", "trinkt", "trink", "trinkst"], answer: "trinken" },
          { prompt: "Kinder, ______ nicht so laut! (sein - ihr form)", options: ["seid", "sind", "sei", "seien"], answer: "seid" },
          { prompt: "Mach Sport und ______ gesund! (bleiben - du form)", options: ["bleibst", "bleib", "bleiben", "bleibt"], answer: "bleib" }
        ]
      },
      {
        id: "ch11_ex2",
        title: "Übung 2: Possessivartikel (Akkusativ)",
        instructions: "State the matching possessive gender endings.",
        type: "fill-blanks",
        questions: [
          { prompt: "Ich liebe meinen Hund und ______ Katze. (die Katze - my)", answer: "meine", hint: "feminine accusative" },
          { prompt: "Er sucht ______ Schlüssel. (der Schlüssel - his)", answer: "seinen", hint: "masculine accusative" },
          { prompt: "Wir lieben ______ Kind. (das Kind - our)", answer: "unser", hint: "neuter accusative" },
          { prompt: "Hast du (your-informal) ______ Tasche? (die Tasche)", answer: "deine", hint: "feminine" }
        ]
      },
      {
        id: "ch11_ex3",
        title: "Übung 3: Arztbesuch",
        instructions: "Assemble a consultation sequence.",
        type: "order",
        questions: [
          { prompt: "1: Guten Tag Herr Doktor, ich fühle mich sehr schlecht.", answer: "1" },
          { prompt: "2: Wo tut es Ihnen weh? Haben Sie Fieber?", answer: "2" },
          { prompt: "3: Ja, ich habe Kopfschmerzen und Husten.", answer: "3" },
          { prompt: "4: Trinken Sie diesen Hustensaft und schlafen Sie viel.", answer: "4" }
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Kapitel 12: Schönes Wochenende!",
    topic: "Planning travel, weather descriptions, identifying seasons, booking hotel rooms, saying destination plans.",
    grammarTitle: "Präpositionen (für, mit, von) & Nebensätze",
    grammarDescription: "Gain clarity on prepositions selecting accusative/dative targets and basic travel structuring.",
    grammarPoints: [
      { rule: "Preposition 'für' (always Accusative)", example: "Das Geschenk ist für meinen Bruder (m) / für meine Schwester (f)", explanation: "Any noun following 'für' automatically locks into the direct object Accusative positioning." },
      { rule: "Prepositions with Dative ('mit' & 'von')", example: "Ich fahre mit dem Auto (with the car) / von dem Bahnhof (from)", explanation: "'mit' (with/by means of) and 'von' (from/of) always enforce Dative endings." },
      { rule: "Wetterbeschreibung (Weather)", example: "Es regnet (it rains) / Es ist windig (it is windy) / Die Sonne scheint (the sun shines)", explanation: "Standard constructions utilizing 'Es ist' + weather adjective or active descriptive verbs." }
    ],
    nouns: [
      { article: "das", german: "Wochenende", english: "Weekend", plural: "Wochenenden" },
      { article: "das", german: "Wetter", english: "Weather" },
      { article: "die", german: "Sonne", english: "Sun" },
      { article: "der", german: "Ausflug", english: "Excursion / Outing", plural: "Ausflüge" },
      { article: "der", german: "Urlaub", english: "Vacation / Holiday", plural: "Urlaube" },
      { article: "das", german: "Reisebüro", english: "Travel Agency", plural: "Reisebüros" },
      { article: "die", german: "Jahreszeit", english: "Season", plural: "Jahreszeiten" },
      { article: "der", german: "Schnee", english: "Snow" }
    ],
    verbsPhrases: [
      { german: "reisen", english: "to travel" },
      { german: "buchen", english: "to book" },
      { german: "Es ist sonnig und warm.", english: "It is sunny and warm." },
      { german: "Schönes Wochenende!", english: "Have a nice weekend!" },
      { german: "Ich mache Urlaub am Meer.", english: "I am taking a vacation at the seaside." }
    ],
    exercises: [
      {
        id: "ch12_ex1",
        title: "Übung 1: für (Akk) oder mit/von (Dat)",
        instructions: "Identify appropriate case endings matching the static prepositions.",
        type: "multiple-choice",
        questions: [
          { prompt: "Dieses Buch ist für ______ Lehrer. (der Lehrer)", options: ["den", "dem", "der", "des"], answer: "den" },
          { prompt: "Klaus reist mit ______ Zug. (der Zug)", options: ["den", "dem", "der", "des"], answer: "dem" },
          { prompt: "Ich komme gerade von ______ Arzt. (der Arzt)", options: ["den", "dem", "der", "des"], answer: "dem" },
          { prompt: "Das Zimmer ist für ______ Kinder. (die Kinder pl)", options: ["den", "dem", "die", "der"], answer: "die" }
        ]
      },
      {
        id: "ch12_ex2",
        title: "Übung 2: Jahreszeiten & Wetter",
        instructions: "Complete with typical elements (warm, schneit, regnet, Sommer).",
        type: "fill-blanks",
        questions: [
          { prompt: "Es ist kalt im Winter und es ______ oft. (schneien)", answer: "schneit", hint: "it snows" },
          { prompt: "Im ______ fliegen wir nach Mallorca. (warm season)", answer: "Sommer", hint: "Summer" },
          { prompt: "Es ist bewölkt und ______ heute. (regnen)", answer: "regnet", hint: "it rains" },
          { prompt: "Im Frühling ist das Wetter sehr ______.", answer: "warm", hint: "warm" }
        ]
      },
      {
        id: "ch12_ex3",
        title: "Übung 3: Hotelbuchung",
        instructions: "Assemble a logical reservation dialogue sequence.",
        type: "order",
        questions: [
          { prompt: "1: Guten Tag, haben Sie noch ein Doppelzimmer frei?", answer: "1" },
          { prompt: "2: Ja, für wie viele Nächte möchten Sie buchen?", answer: "2" },
          { prompt: "3: Für zwei Nächte, von Freitag bis Sonntag.", answer: "3" },
          { prompt: "4: Das Zimmer kostet 80 Euro pro Nacht inklusive Frühstück.", answer: "4" }
        ]
      }
    ]
  }
];
