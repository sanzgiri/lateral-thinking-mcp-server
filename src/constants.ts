import { PuzzleCategory, DifficultyLevel, LateralThinkingPuzzle, ThinkingTechnique } from "./types.js";

// Curated collection of lateral thinking puzzles
export const PUZZLES: LateralThinkingPuzzle[] = [
    {
        id: "puzzle_001",
        category: PuzzleCategory.SITUATION,
        difficulty: DifficultyLevel.EASY,
        question: "A man walks into a bar and asks for a glass of water. The bartender pulls out a gun and points it at him. The man says 'Thank you' and walks out. Why?",
        answer: "The man had hiccups, and the bartender scared them away by pointing the gun at him.",
        hints: [
            "The man didn't actually want water for drinking",
            "The bartender was trying to help the man",
            "Think about common remedies for a medical condition"
        ],
        explanation: "This classic puzzle requires you to think beyond the literal request. The water wasn't needed as a beverage but as a potential remedy for hiccups. The bartender offered an alternative solution by scaring the hiccups away.",
        thinking_approach: "Question assumptions about what people really need versus what they ask for"
    },
    {
        id: "puzzle_002",
        category: PuzzleCategory.SITUATION,
        difficulty: DifficultyLevel.MEDIUM,
        question: "A man is found dead in a field with an unopened package beside him. There are no other clues. How did he die?",
        answer: "His parachute failed to open. The package is the unopened parachute.",
        hints: [
            "The field is significant - why would someone be in the middle of a field?",
            "What kind of package would be unopened in this situation?",
            "Think about how someone might end up in a field unexpectedly"
        ],
        explanation: "The key is recognizing that the 'unopened package' is actually a failed parachute. The man was skydiving when his parachute malfunctioned.",
        thinking_approach: "Consider unusual contexts that would explain ordinary objects"
    },
    {
        id: "puzzle_003",
        category: PuzzleCategory.LOGIC_TRICK,
        difficulty: DifficultyLevel.EASY,
        question: "A doctor and a bus driver are both in love with the same woman. The bus driver had to go on a long trip that would last a week. Before he left, he gave the woman seven apples. Why?",
        answer: "Because an apple a day keeps the doctor away!",
        hints: [
            "Think about common sayings",
            "Why would apples be relevant to a doctor?",
            "The bus driver wants to keep someone away"
        ],
        explanation: "This puzzle plays on the saying 'an apple a day keeps the doctor away.' The bus driver gave her seven apples (one for each day) to keep the doctor away while he was gone.",
        thinking_approach: "Look for wordplay and common expressions"
    },
    {
        id: "puzzle_004",
        category: PuzzleCategory.ASSUMPTION_CHALLENGE,
        difficulty: DifficultyLevel.MEDIUM,
        question: "A woman shoots her husband, then holds him underwater for five minutes. Next, she hangs him. Right after, they enjoy a lovely dinner together. How is this possible?",
        answer: "She's a photographer. She shot a photo of him, developed it (held it underwater in developer solution), and hung it up to dry.",
        hints: [
            "Think about different meanings of common words",
            "What profession involves 'shooting,' 'developing,' and 'hanging'?",
            "Consider the process of creating something rather than harming someone"
        ],
        explanation: "This puzzle challenges the assumption that 'shoot' and 'hang' have violent meanings. In photography, these are standard technical terms.",
        thinking_approach: "Question initial interpretations of words with multiple meanings"
    },
    {
        id: "puzzle_005",
        category: PuzzleCategory.PERSPECTIVE_SHIFT,
        difficulty: DifficultyLevel.HARD,
        question: "A man pushed his car to a hotel and lost his fortune. What happened?",
        answer: "He was playing Monopoly. He landed on a hotel with his car token and didn't have enough money to pay the rent.",
        hints: [
            "This isn't about a real car or real hotel",
            "Think about games",
            "What game involves moving tokens to properties?"
        ],
        explanation: "The puzzle requires shifting perspective from real-world scenarios to board games. The 'car' is a game token, not a vehicle.",
        thinking_approach: "Consider whether the scenario might exist in a different context entirely"
    },
    {
        id: "puzzle_006",
        category: PuzzleCategory.SITUATION,
        difficulty: DifficultyLevel.EXPERT,
        question: "A man dies of thirst in his own home while there's water running from a tap in his kitchen. How is this possible?",
        answer: "The man was a fish. His tank's water system failed, and while water was running from the kitchen tap, he couldn't access it.",
        hints: [
            "Challenge your assumption about what kind of 'man' this might be",
            "Different beings need water in different ways",
            "Think metaphorically about who lives in a 'home' and needs water to survive"
        ],
        explanation: "This puzzle requires you to question the fundamental assumption that 'man' refers to a human. In storytelling and fables, animals are often anthropomorphized.",
        thinking_approach: "Question every assumption, even about the basic identity of actors in the scenario"
    },
    {
        id: "puzzle_007",
        category: PuzzleCategory.WORDPLAY,
        difficulty: DifficultyLevel.EASY,
        question: "What occurs once in a minute, twice in a moment, but never in a thousand years?",
        answer: "The letter 'M'",
        hints: [
            "Look at the words themselves",
            "Count specific elements in each word",
            "This is about spelling, not time"
        ],
        explanation: "The puzzle uses time words to misdirect you into thinking about temporal concepts when it's actually about the letters in the words themselves.",
        thinking_approach: "Look at the literal components when dealing with word puzzles"
    },
    {
        id: "puzzle_008",
        category: PuzzleCategory.VISUAL,
        difficulty: DifficultyLevel.MEDIUM,
        question: "A truck driver is going down a one-way street the wrong way and passes at least ten cops. Why doesn't he get stopped?",
        answer: "He's walking, not driving.",
        hints: [
            "Read the question very carefully",
            "What does 'truck driver' tell you about his current activity?",
            "Consider whether his profession means he's currently performing that job"
        ],
        explanation: "The puzzle leads you to assume the truck driver is driving, but it only states his profession, not his current activity.",
        thinking_approach: "Distinguish between identity/profession and current action"
    }
];

// Lateral thinking techniques
export const TECHNIQUES: ThinkingTechnique[] = [
    {
        name: "Challenge Assumptions",
        description: "Identify and question the assumptions you're making about a problem. Often, the breakthrough comes when you realize an assumption was incorrect.",
        when_to_use: "When you feel stuck or when a problem seems impossible",
        steps: [
            "List all assumptions you're making about the problem",
            "For each assumption, ask 'Must this be true?'",
            "Try solving the problem with each assumption reversed",
            "Look for which reversed assumption makes the problem solvable"
        ],
        example: "Assuming a 'man' must be human when the puzzle could refer to any being"
    },
    {
        name: "Reframe the Context",
        description: "Place the problem in a completely different context or domain to see if it makes more sense there.",
        when_to_use: "When the problem seems contradictory or impossible in its current context",
        steps: [
            "Identify the key elements of the problem",
            "Consider different contexts where these elements exist (games, professions, stories, etc.)",
            "Try retelling the problem in each new context",
            "See which context resolves the contradiction"
        ],
        example: "Realizing a puzzle about moving a car to a hotel makes sense in the context of Monopoly"
    },
    {
        name: "Multiple Meaning Analysis",
        description: "Identify words that could have multiple meanings and explore each interpretation.",
        when_to_use: "When a puzzle uses common words that might have technical or alternative meanings",
        steps: [
            "Highlight key action words and nouns",
            "List alternative meanings for each word",
            "Consider professional/technical contexts for each word",
            "Reconstruct the scenario using alternative meanings"
        ],
        example: "'Shoot' could mean photograph, not harm; 'hang' could mean display, not execute"
    },
    {
        name: "Reverse Engineering",
        description: "Start with the desired outcome and work backwards to find possible causes.",
        when_to_use: "When you know the end result but not how it came about",
        steps: [
            "Clearly state the end result or outcome",
            "Ask 'What could cause this result?'",
            "For each possible cause, ask 'What would need to be true?'",
            "Match your answers to the clues provided"
        ],
        example: "A man thanking someone who pointed a gun at him → must have helped him → how does fear help? → cures hiccups"
    },
    {
        name: "Constraint Relaxation",
        description: "Temporarily remove or relax constraints to explore a wider solution space, then see which constraints can remain relaxed.",
        when_to_use: "When traditional approaches aren't working",
        steps: [
            "List all constraints you believe apply",
            "Temporarily remove each constraint one at a time",
            "Solve the problem without that constraint",
            "Determine if the constraint was actually necessary"
        ],
        example: "Removing the constraint that all actors must be human opens up solutions"
    },
    {
        name: "Analogical Thinking",
        description: "Find similar problems in different domains and apply their solutions to your current problem.",
        when_to_use: "When you need fresh perspectives on a familiar problem type",
        steps: [
            "Abstract the core structure of your problem",
            "Search for similar structures in other domains",
            "Study how those domains solve the problem",
            "Adapt the solution back to your original problem"
        ],
        example: "Business strategy problems often have analogies in military strategy or competitive sports"
    }
];

export const CHARACTER_LIMIT = 4000;
