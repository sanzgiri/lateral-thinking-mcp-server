export enum PuzzleCategory {
    SITUATION = "situation",
    WORDPLAY = "wordplay",
    VISUAL = "visual",
    LOGIC_TRICK = "logic_trick",
    ASSUMPTION_CHALLENGE = "assumption_challenge",
    PERSPECTIVE_SHIFT = "perspective_shift"
}

export enum DifficultyLevel {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
    EXPERT = "expert"
}

export enum ResponseFormat {
    MARKDOWN = "markdown",
    JSON = "json"
}

export interface LateralThinkingPuzzle {
    id: string;
    category: PuzzleCategory;
    difficulty: DifficultyLevel;
    question: string;
    answer: string;
    hints: string[];
    explanation: string;
    thinking_approach: string;
    [key: string]: unknown;
}

export interface CreativePrompt {
    id: string;
    title: string;
    prompt: string;
    context: string;
    suggested_approaches: string[];
    example_response?: string;
    [key: string]: unknown;
}

export interface ThinkingTechnique {
    name: string;
    description: string;
    when_to_use: string;
    steps: string[];
    example: string;
    [key: string]: unknown;
}

export interface BrainstormingChallenge {
    id: string;
    challenge: string;
    constraints: string[];
    success_criteria: string[];
    sample_solutions: string[];
    [key: string]: unknown;
}
