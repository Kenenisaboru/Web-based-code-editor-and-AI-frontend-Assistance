import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI safely
let openai = null;
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-")) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("✅ OpenAI initialized successfully");
  } else {
    console.warn("⚠️ OPENAI_API_KEY is missing or invalid in .env file. AI features will be disabled.");
  }
} catch (error) {
  console.error("❌ Failed to initialize OpenAI client:", error.message);
}

const SYSTEM_PROMPT = `
You are a smart AI assistant integrated into a web-based code editor like VS Code. 
Your goal is to respond to user questions in real time, giving accurate, helpful, and clear answers.

Capabilities:
1. Explain selected code in simple terms.
2. Find bugs and suggest fixes.
3. Generate code snippets or functions based on user request.
4. Refactor or improve code for readability and performance.
5. Suggest best practices.

Rules:
- Always respond in JSON format.
- "code_snippet" should only contain the code, no markdown backticks.
- "answer_text" should be clear and concise markdown.
- If you cannot answer directly, ask for clarification.

Output JSON format:
{
  "answer_text": "Explanation here...",
  "code_snippet": "function example() { ... }", 
  "suggestion": "Optional suggestion or best practice tip"
}
`;

app.post("/api/ai-assistant", async (req, res) => {
  const { user_question, selected_code, language, project_context } = req.body;

  if (!openai) {
    return res.status(503).json({ 
      answer_text: "OpenAI API Key is missing or invalid. Please check your .env file.",
      suggestion: "Add a valid OPENAI_API_KEY starting with 'sk-' to .env"
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: JSON.stringify({
            user_question,
            selected_code,
            language,
            project_context
          })
        }
      ],
    });

    const content = response.choices[0].message.content;
    const jsonResponse = JSON.parse(content);
    res.json(jsonResponse);

  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ 
      answer_text: "Failed to get AI response.",
      suggestion: "Check server logs for details."
    });
  }
});

app.listen(port, () => console.log(`🚀 Backend running at http://localhost:${port}`));
