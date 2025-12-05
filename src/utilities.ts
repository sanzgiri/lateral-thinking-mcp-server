import { ResponseFormat, LateralThinkingPuzzle, ThinkingTechnique, CreativePrompt, BrainstormingChallenge } from "./types.js";
import { CHARACTER_LIMIT } from "./constants.js";

/**
 * Format a puzzle for display
 */
export function formatPuzzle(puzzle: LateralThinkingPuzzle, includeAnswer: boolean, format: ResponseFormat): string {
    if (format === ResponseFormat.JSON) {
        const output = includeAnswer ? puzzle : { ...puzzle, answer: "[Hidden]", explanation: "[Hidden]" };
        return JSON.stringify(output, null, 2);
    }
    // Markdown format
    let output = `# Lateral Thinking Puzzle: ${puzzle.id}\n\n`;
    output += `**Category:** ${puzzle.category}\n`;
    output += `**Difficulty:** ${puzzle.difficulty}\n\n`;
    output += `## Question\n${puzzle.question}\n\n`;
    if (includeAnswer) {
        output += `## Answer\n${puzzle.answer}\n\n`;
        output += `## Explanation\n${puzzle.explanation}\n\n`;
        output += `## Thinking Approach\n${puzzle.thinking_approach}\n\n`;
    }
    output += `## Hints\n`;
    puzzle.hints.forEach((hint, index) => {
        output += `${index + 1}. ${hint}\n`;
    });
    return truncateIfNeeded(output);
}

/**
 * Format multiple puzzles for display
 */
export function formatPuzzleList(puzzles: LateralThinkingPuzzle[], format: ResponseFormat): string {
    if (format === ResponseFormat.JSON) {
        return JSON.stringify({ puzzles, count: puzzles.length }, null, 2);
    }
    let output = `# Lateral Thinking Puzzles (${puzzles.length} found)\n\n`;
    puzzles.forEach((puzzle, index) => {
        output += `## ${index + 1}. ${puzzle.id}\n`;
        output += `**Category:** ${puzzle.category} | **Difficulty:** ${puzzle.difficulty}\n\n`;
        output += `**Question:** ${puzzle.question}\n\n`;
        output += `---\n\n`;
    });
    return truncateIfNeeded(output);
}

/**
 * Format a thinking technique for display
 */
export function formatTechnique(technique: ThinkingTechnique, format: ResponseFormat): string {
    if (format === ResponseFormat.JSON) {
        return JSON.stringify(technique, null, 2);
    }
    let output = `# Lateral Thinking Technique: ${technique.name}\n\n`;
    output += `## Description\n${technique.description}\n\n`;
    output += `## When to Use\n${technique.when_to_use}\n\n`;
    output += `## Steps\n`;
    technique.steps.forEach((step, index) => {
        output += `${index + 1}. ${step}\n`;
    });
    output += `\n## Example\n${technique.example}\n`;
    return truncateIfNeeded(output);
}

/**
 * Format multiple techniques for display
 */
export function formatTechniqueList(techniques: ThinkingTechnique[], format: ResponseFormat): string {
    if (format === ResponseFormat.JSON) {
        return JSON.stringify({ techniques, count: techniques.length }, null, 2);
    }
    let output = `# Lateral Thinking Techniques (${techniques.length})\n\n`;
    techniques.forEach((technique, index) => {
        output += `## ${index + 1}. ${technique.name}\n`;
        output += `${technique.description}\n\n`;
        output += `**When to use:** ${technique.when_to_use}\n\n`;
        output += `---\n\n`;
    });
    return truncateIfNeeded(output);
}

/**
 * Format a creative prompt
 */
export function formatCreativePrompt(prompt: CreativePrompt, format: ResponseFormat): string {
    if (format === ResponseFormat.JSON) {
        return JSON.stringify(prompt, null, 2);
    }
    let output = `# Creative Thinking Prompt: ${prompt.title}\n\n`;
    output += `## The Prompt\n${prompt.prompt}\n\n`;
    output += `## Context\n${prompt.context}\n\n`;
    output += `## Suggested Approaches\n`;
    prompt.suggested_approaches.forEach((approach, index) => {
        output += `${index + 1}. ${approach}\n`;
    });
    if (prompt.example_response) {
        output += `\n## Example Response\n${prompt.example_response}\n`;
    }
    return truncateIfNeeded(output);
}

/**
 * Format a brainstorming challenge
 */
export function formatBrainstormingChallenge(challenge: BrainstormingChallenge, format: ResponseFormat): string {
    if (format === ResponseFormat.JSON) {
        return JSON.stringify(challenge, null, 2);
    }
    let output = `# Brainstorming Challenge: ${challenge.id}\n\n`;
    output += `## Challenge\n${challenge.challenge}\n\n`;
    output += `## Constraints\n`;
    challenge.constraints.forEach((constraint, index) => {
        output += `${index + 1}. ${constraint}\n`;
    });
    output += `\n## Success Criteria\n`;
    challenge.success_criteria.forEach((criterion, index) => {
        output += `${index + 1}. ${criterion}\n`;
    });
    output += `\n## Sample Solutions\n`;
    challenge.sample_solutions.forEach((solution, index) => {
        output += `${index + 1}. ${solution}\n`;
    });
    return truncateIfNeeded(output);
}

/**
 * Truncate text if it exceeds CHARACTER_LIMIT
 */
export function truncateIfNeeded(text: string): string {
    if (text.length <= CHARACTER_LIMIT) {
        return text;
    }
    const truncated = text.substring(0, CHARACTER_LIMIT - 100);
    return truncated + "\n\n... [Content truncated. Response exceeded character limit.]";
}

/**
 * Generate a random creative prompt
 */
export function generateCreativePrompt(theme?: string): CreativePrompt {
    const themes = theme ? [theme] : [
        "innovation in everyday objects",
        "solving social problems",
        "future technology",
        "environmental challenges",
        "human connection",
        "education transformation",
        "urban design",
        "food systems"
    ];
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const prompts: Record<string, CreativePrompt> = {
        "innovation in everyday objects": {
            id: "prompt_001",
            title: "Reimagine the Mundane",
            prompt: "Choose an everyday object you use regularly. Now imagine it was designed by someone from a completely different culture or time period. How would it be different? What assumptions about its use would change?",
            context: "This exercise helps you see familiar objects with fresh eyes by applying different cultural or historical perspectives.",
            suggested_approaches: [
                "Pick an object (spoon, chair, door, etc.)",
                "Research how different cultures or time periods approached the same need",
                "Identify assumptions in current design",
                "Sketch or describe an alternative design",
                "Explain what problem the new design solves better"
            ],
            example_response: "A chair designed by a nomadic culture might fold into a walking stick, serving dual purposes for people constantly on the move."
        },
        "solving social problems": {
            id: "prompt_002",
            title: "Flip the Problem",
            prompt: "Think of a major social issue. Instead of asking 'How do we solve this?', ask 'What would make this problem worse?' Then work backwards.",
            context: "Inversion thinking can reveal hidden factors and unexpected solutions by examining what you want to avoid.",
            suggested_approaches: [
                "Identify a specific social problem",
                "List everything that would make it worse",
                "For each item, identify its opposite",
                "Look for surprising insights in the opposites",
                "Design solutions based on these insights"
            ],
            example_response: "To reduce loneliness, instead of asking how to bring people together, ask what keeps them apart: fear of judgment, lack of shared interests, physical barriers. Solutions emerge from removing these obstacles."
        }
    };
    return prompts[selectedTheme] || prompts["innovation in everyday objects"];
}

/**
 * Generate a brainstorming challenge
 */
export function generateBrainstormingChallenge(difficulty: string): BrainstormingChallenge {
    const challenges: Record<string, BrainstormingChallenge> = {
        easy: {
            id: "challenge_easy_001",
            challenge: "Design a new type of greeting that works across all cultures without words or gestures that could be misinterpreted.",
            constraints: [
                "Must be universally understandable",
                "Cannot use words",
                "Must avoid gestures that are offensive in any culture",
                "Should convey friendliness and respect"
            ],
            success_criteria: [
                "Can be performed by anyone regardless of physical ability",
                "Takes less than 3 seconds",
                "Clearly distinguishable from other common actions",
                "Feels natural and warm"
            ],
            sample_solutions: [
                "A specific pattern of eye contact and smile",
                "Placing hand over heart and nodding",
                "A unique sound or musical tone"
            ]
        },
        medium: {
            id: "challenge_medium_001",
            challenge: "Create a restaurant menu system that helps people make healthier choices without feeling restricted or judged.",
            constraints: [
                "Cannot explicitly label foods as 'healthy' or 'unhealthy'",
                "Must maintain customer satisfaction",
                "Should work for diverse dietary needs",
                "Cannot significantly increase menu complexity"
            ],
            success_criteria: [
                "Nudges toward nutritious options without forcing them",
                "Maintains appeal of all menu items",
                "Easy for staff to implement",
                "Customers report feeling good about their choices"
            ],
            sample_solutions: [
                "Visual design that emphasizes certain sections",
                "Strategic ordering and placement of items",
                "Descriptive language that highlights positive attributes",
                "Bundling options that balance nutrition with indulgence"
            ]
        },
        hard: {
            id: "challenge_hard_001",
            challenge: "Design a system for teaching critical thinking skills to people who are actively resistant to changing their beliefs.",
            constraints: [
                "Cannot directly challenge existing beliefs",
                "Must respect individual autonomy",
                "Should work across different educational levels",
                "Needs to be engaging rather than preachy"
            ],
            success_criteria: [
                "Participants voluntarily engage repeatedly",
                "Measurable improvement in reasoning skills",
                "Doesn't trigger defensive reactions",
                "Scales to large populations"
            ],
            sample_solutions: [
                "Gamified scenarios in neutral domains",
                "Socratic questioning frameworks",
                "Collaborative problem-solving exercises",
                "Story-based learning with ambiguous situations"
            ]
        }
    };
    return challenges[difficulty] || challenges.easy;
}
