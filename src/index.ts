#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";
import {
  PuzzleCategory,
  DifficultyLevel,
  ResponseFormat
} from "./types.js";
import { PUZZLES, TECHNIQUES } from "./constants.js";
import {
  formatPuzzle,
  formatPuzzleList,
  formatTechnique,
  formatTechniqueList,
  formatCreativePrompt,
  formatBrainstormingChallenge,
  generateCreativePrompt,
  generateBrainstormingChallenge
} from "./utilities.js";

// Initialize MCP server
const server = new McpServer({
  name: "lateral-thinking-mcp-server",
  version: "1.0.0"
});

// ============================================================================
// Tool 1: Get Puzzle by ID
// ============================================================================

server.registerTool(
  "lateral_get_puzzle",
  {
    title: "Get Lateral Thinking Puzzle",
    description: `Retrieve a specific lateral thinking puzzle by its ID.

Lateral thinking puzzles are brain teasers that require creative, non-linear thinking to solve. They often involve questioning assumptions, reframing problems, or finding unexpected connections.

Args:
  - puzzle_id (string): The unique identifier of the puzzle (e.g., "puzzle_001")
  - include_answer (boolean): Whether to include the answer and explanation (default: false)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Complete puzzle object with schema:
  {
    "id": string,
    "category": "situation" | "wordplay" | "visual" | "logic_trick" | "assumption_challenge" | "perspective_shift",
    "difficulty": "easy" | "medium" | "hard" | "expert",
    "question": string,
    "answer": string (if include_answer is true),
    "hints": string[],
    "explanation": string (if include_answer is true),
    "thinking_approach": string
  }

  For Markdown format: Formatted puzzle with sections for question, hints, and optionally answer/explanation.

Examples:
  - Use when: "Show me puzzle_001" -> params: { puzzle_id: "puzzle_001", include_answer: false }
  - Use when: "Give me the answer to puzzle_003" -> params: { puzzle_id: "puzzle_003", include_answer: true }

Error Handling:
  - Returns error message if puzzle_id doesn't exist`,
    inputSchema: z.object({
      puzzle_id: z.string().describe("Unique puzzle identifier"),
      include_answer: z.boolean().default(false).describe("Include answer and explanation"),
      response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN).describe("Output format")
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const puzzle = PUZZLES.find(p => p.id === params.puzzle_id);

    if (!puzzle) {
      return {
        content: [{
          type: "text",
          text: `Puzzle '${params.puzzle_id}' not found. Use lateral_list_puzzles to see available puzzles.`
        }]
      };
    }

    const formatted = formatPuzzle(puzzle, params.include_answer, params.response_format);

    return {
      content: [{ type: "text", text: formatted }],
      structuredContent: params.response_format === ResponseFormat.JSON ?
        (params.include_answer ? puzzle : { ...puzzle, answer: "[Hidden]", explanation: "[Hidden]" }) :
        undefined
    };
  }
);

// ============================================================================
// Tool 2: List Puzzles with Filters
// ============================================================================

server.registerTool(
  "lateral_list_puzzles",
  {
    title: "List Lateral Thinking Puzzles",
    description: `List available lateral thinking puzzles with optional filtering.

Browse the collection of lateral thinking puzzles, optionally filtered by category and difficulty level.

Args:
  - category (optional): Filter by puzzle category
    - "situation": Real-world scenario puzzles
    - "wordplay": Language and word-based puzzles
    - "visual": Puzzles requiring visual/spatial thinking
    - "logic_trick": Puzzles with logical misdirection
    - "assumption_challenge": Puzzles that challenge common assumptions
    - "perspective_shift": Puzzles requiring a change in viewpoint
  - difficulty (optional): Filter by difficulty level ("easy" | "medium" | "hard" | "expert")
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format:
  {
    "puzzles": LateralThinkingPuzzle[],
    "count": number
  }

  For Markdown format: Formatted list with puzzle IDs, categories, difficulties, and questions.

Examples:
  - Use when: "Show me all puzzles" -> params: {}
  - Use when: "List easy puzzles" -> params: { difficulty: "easy" }
  - Use when: "Show situation puzzles" -> params: { category: "situation" }

Note: Answers are never included in list results. Use lateral_get_puzzle to see individual puzzle answers.`,
    inputSchema: z.object({
      category: z.nativeEnum(PuzzleCategory).optional().describe("Filter by puzzle category"),
      difficulty: z.nativeEnum(DifficultyLevel).optional().describe("Filter by difficulty level"),
      response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN).describe("Output format")
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params) => {
    let filtered = PUZZLES;

    if (params.category) {
      filtered = filtered.filter(p => p.category === params.category);
    }

    if (params.difficulty) {
      filtered = filtered.filter(p => p.difficulty === params.difficulty);
    }

    if (filtered.length === 0) {
      return {
        content: [{
          type: "text",
          text: "No puzzles found matching the specified criteria."
        }]
      };
    }

    const formatted = formatPuzzleList(filtered, params.response_format);

    return {
      content: [{ type: "text", text: formatted }],
      structuredContent: params.response_format === ResponseFormat.JSON ?
        { puzzles: filtered, count: filtered.length } :
        undefined
    };
  }
);

// ============================================================================
// Tool 3: Get Random Puzzle
// ============================================================================

server.registerTool(
  "lateral_random_puzzle",
  {
    title: "Get Random Lateral Thinking Puzzle",
    description: `Get a randomly selected lateral thinking puzzle, optionally filtered by difficulty.

Perfect for practicing lateral thinking or getting a fresh challenge.

Args:
  - difficulty (optional): Limit to specific difficulty level ("easy" | "medium" | "hard" | "expert")
  - include_answer (boolean): Whether to include the answer (default: false)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  Same format as lateral_get_puzzle - a single puzzle with all its details.

Examples:
  - Use when: "Give me a random puzzle" -> params: {}
  - Use when: "Random hard puzzle without answer" -> params: { difficulty: "hard", include_answer: false }
  - Use when: "Surprise me with an easy puzzle" -> params: { difficulty: "easy" }`,
    inputSchema: z.object({
      difficulty: z.nativeEnum(DifficultyLevel).optional().describe("Filter by difficulty level"),
      include_answer: z.boolean().default(false).describe("Include answer and explanation"),
      response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN).describe("Output format")
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    let eligiblePuzzles = PUZZLES;

    if (params.difficulty) {
      eligiblePuzzles = eligiblePuzzles.filter(p => p.difficulty === params.difficulty);
    }

    if (eligiblePuzzles.length === 0) {
      return {
        content: [{
          type: "text",
          text: "No puzzles found matching the specified criteria."
        }]
      };
    }

    const randomIndex = Math.floor(Math.random() * eligiblePuzzles.length);
    const puzzle = eligiblePuzzles[randomIndex];

    const formatted = formatPuzzle(puzzle, params.include_answer, params.response_format);

    return {
      content: [{ type: "text", text: formatted }],
      structuredContent: params.response_format === ResponseFormat.JSON ?
        (params.include_answer ? puzzle : { ...puzzle, answer: "[Hidden]", explanation: "[Hidden]" }) :
        undefined
    };
  }
);

// ============================================================================
// Tool 4: Get Thinking Technique
// ============================================================================

server.registerTool(
  "lateral_get_technique",
  {
    title: "Get Lateral Thinking Technique",
    description: `Retrieve a specific lateral thinking technique by name.

Lateral thinking techniques are systematic approaches to creative problem-solving that help you break out of conventional thought patterns.

Args:
  - technique_name (string): Name of the technique (e.g., "Challenge Assumptions", "Reframe the Context")
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format:
  {
    "name": string,
    "description": string,
    "when_to_use": string,
    "steps": string[],
    "example": string
  }

  For Markdown format: Formatted technique guide with sections for description, usage, steps, and examples.

Available techniques:
  - "Challenge Assumptions"
  - "Reframe the Context"
  - "Multiple Meaning Analysis"
  - "Reverse Engineering"
  - "Constraint Relaxation"
  - "Analogical Thinking"

Examples:
  - Use when: "Explain the Challenge Assumptions technique" -> params: { technique_name: "Challenge Assumptions" }
  - Use when: "How does Reframe the Context work?" -> params: { technique_name: "Reframe the Context" }`,
    inputSchema: z.object({
      technique_name: z.string().describe("Name of the thinking technique"),
      response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN).describe("Output format")
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const technique = TECHNIQUES.find(
      t => t.name.toLowerCase() === params.technique_name.toLowerCase()
    );

    if (!technique) {
      const availableNames = TECHNIQUES.map(t => t.name).join(", ");
      return {
        content: [{
          type: "text",
          text: `Technique '${params.technique_name}' not found. Available techniques: ${availableNames}`
        }]
      };
    }

    const formatted = formatTechnique(technique, params.response_format);

    return {
      content: [{ type: "text", text: formatted }],
      structuredContent: params.response_format === ResponseFormat.JSON ? technique : undefined
    };
  }
);

// ============================================================================
// Tool 5: List All Techniques
// ============================================================================

server.registerTool(
  "lateral_list_techniques",
  {
    title: "List All Lateral Thinking Techniques",
    description: `List all available lateral thinking techniques with brief descriptions.

Get an overview of systematic approaches to creative problem-solving and lateral thinking.

Args:
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format:
  {
    "techniques": ThinkingTechnique[],
    "count": number
  }

  For Markdown format: Formatted list of techniques with names, descriptions, and usage guidelines.

Examples:
  - Use when: "What lateral thinking techniques are available?" -> params: {}
  - Use when: "Show me all thinking methods" -> params: {}`,
    inputSchema: z.object({
      response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN).describe("Output format")
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params) => {
    const formatted = formatTechniqueList(TECHNIQUES, params.response_format);

    return {
      content: [{ type: "text", text: formatted }],
      structuredContent: params.response_format === ResponseFormat.JSON ?
        { techniques: TECHNIQUES, count: TECHNIQUES.length } :
        undefined
    };
  }
);

// ============================================================================
// Tool 6: Generate Creative Prompt
// ============================================================================

server.registerTool(
  "lateral_generate_prompt",
  {
    title: "Generate Creative Thinking Prompt",
    description: `Generate a creative thinking prompt to practice lateral thinking skills.

These prompts are open-ended exercises designed to encourage non-linear thinking, challenge assumptions, and explore novel perspectives.

Args:
  - theme (optional): Focus area for the prompt (e.g., "innovation in everyday objects", "solving social problems")
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format:
  {
    "id": string,
    "title": string,
    "prompt": string,
    "context": string,
    "suggested_approaches": string[],
    "example_response": string (optional)
  }

  For Markdown format: Formatted prompt with title, context, suggested approaches, and example.

Examples:
  - Use when: "Give me a creative thinking exercise" -> params: {}
  - Use when: "Generate a prompt about innovation" -> params: { theme: "innovation in everyday objects" }`,
    inputSchema: z.object({
      theme: z.string().optional().describe("Optional theme for the prompt"),
      response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN).describe("Output format")
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    const prompt = generateCreativePrompt(params.theme);
    const formatted = formatCreativePrompt(prompt, params.response_format);

    return {
      content: [{ type: "text", text: formatted }],
      structuredContent: params.response_format === ResponseFormat.JSON ? prompt : undefined
    };
  }
);

// ============================================================================
// Tool 7: Generate Brainstorming Challenge
// ============================================================================

server.registerTool(
  "lateral_brainstorming_challenge",
  {
    title: "Generate Brainstorming Challenge",
    description: `Generate a structured brainstorming challenge with constraints and success criteria.

These challenges are designed to practice creative problem-solving within realistic constraints, helping develop practical lateral thinking skills.

Args:
  - difficulty ("easy" | "medium" | "hard"): Complexity level of the challenge (default: "medium")
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format:
  {
    "id": string,
    "challenge": string,
    "constraints": string[],
    "success_criteria": string[],
    "sample_solutions": string[]
  }

  For Markdown format: Formatted challenge with constraints, criteria, and sample solutions.

Examples:
  - Use when: "Give me a brainstorming challenge" -> params: {}
  - Use when: "Hard brainstorming exercise" -> params: { difficulty: "hard" }`,
    inputSchema: z.object({
      difficulty: z.enum(["easy", "medium", "hard"]).default("medium").describe("Challenge difficulty"),
      response_format: z.nativeEnum(ResponseFormat).default(ResponseFormat.MARKDOWN).describe("Output format")
    }).strict(),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  async (params) => {
    const challenge = generateBrainstormingChallenge(params.difficulty);
    const formatted = formatBrainstormingChallenge(challenge, params.response_format);

    return {
      content: [{ type: "text", text: formatted }],
      structuredContent: params.response_format === ResponseFormat.JSON ? challenge : undefined
    };
  }
);

// ============================================================================
// Server Connection
// ============================================================================

async function runStdio(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Lateral Thinking MCP Server running on stdio");
}

async function runHTTP(): Promise<void> {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'lateral-thinking-mcp-server' });
  });

  // Root endpoint
  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'Lateral Thinking MCP Server',
      version: '1.0.0',
      endpoint: '/mcp',
      description: 'MCP server for lateral thinking puzzles and techniques',
      tools: 7
    });
  });

  app.post('/mcp', async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });
    res.on('close', () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  const port = parseInt(process.env.PORT || '3000');
  app.listen(port, () => {
    console.error(`Lateral Thinking MCP server running on http://localhost:${port}/mcp`);
  });
}

// Choose transport based on environment
const transport = process.env.TRANSPORT || (process.env.PORT ? 'http' : 'stdio');
if (transport === 'http') {
  runHTTP().catch(error => {
    console.error("Server error:", error);
    process.exit(1);
  });
} else {
  runStdio().catch(error => {
    console.error("Server error:", error);
    process.exit(1);
  });
}
