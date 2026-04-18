import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function generateQuizOrFlashcard(
  notes: string = "",
  mode: "quiz" | "flashcard",
  count: number = 10,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed"
) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing. Please add it to your environment variables.");
  }
  
  const systemPrompt = `You are a high-speed educational synthesizer. Generate exactly ${count} ${mode} items.
Format: JSON only.
Difficulty: ${difficulty}.

SCHEMA:
{
  "items": [${mode === "quiz" ? 
    `{"question": "string", "options": ["A", "B", "C", "D"], "correctIndex": number, "topic": "string"}` : 
    `{"front": "string", "back": "string", "topic": "string"}`}
  ],
  "meta": { "topics": ["string"] }
}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: notes.substring(0, 8000) },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Synthesis output was empty.");

    const data = JSON.parse(content);
    
    if (!data.items || !Array.isArray(data.items)) {
        throw new Error("Intelligence structure was misaligned.");
    }
    
    // Ensure meta is ALWAYS present to prevent Convex validation errors
    const safeMeta = data.meta || { 
      topics: ["General Synthesis"], 
      counts: { easy: count, medium: 0, hard: 0 } 
    };
    
    return {
      items: data.items,
      meta: safeMeta
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("CRITICAL AI FAILURE:", errorMessage);
    
    // EMERGENCY FALLBACK: If AI fails, return a high-quality mock set to keep the session alive
    if (process.env.NODE_ENV === "development") {
      return {
        items: mode === "quiz" ? [
          { 
            question: "The synthesis engine is currently recalibrating. What is the base of Quizzy AI?", 
            options: ["A. Neural Nets", "B. Pure Logic", "C. Studio Pedagogy", "D. Dynamic Data"], 
            correctIndex: 2, 
            explanation: "Quizzy AI uses a Studio Pedagogy model.",
            topic: "System Status"
          }
        ] : [
          { front: "System Status", back: "Recalibrating Neural Paths...", topic: "Maintenance" }
        ],
        meta: { topics: ["System Maintenance"], counts: { easy: 1, medium: 0, hard: 0 } }
      };
    }
    
    throw new Error(error.message || "Intelligence generation bridge failed");
  }
}
