import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateQuizOrFlashcard(
  notes: string,
  mode: "quiz" | "flashcard",
  count: number = 10
) {
  const systemPrompt = mode === "quiz" 
    ? `You are an expert quiz generator. Generate exactly ${count} high-quality multiple-choice questions based on the provided notes.
       Return ONLY a JSON object with a "questions" key containing an array of objects.
       Each object must have:
       - "question": string
       - "options": array of 4 strings (e.g., ["A. ...", "B. ...", "C. ...", "D. ..."])
       - "correctIndex": number (0-3)
       - "explanation": string
       
       Format: {"questions": [{"question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correctIndex": 0, "explanation": "..."}]}`
    : `You are an expert flashcard generator. Generate exactly ${count} high-quality flashcards based on the provided notes.
       Return ONLY a JSON object with a "flashcards" key containing an array of objects.
       Each object must have:
       - "front": string
       - "back": string
       
       Format: {"flashcards": [{"front": "...", "back": "..."}]}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: notes },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Failed to generate content");

    const data = JSON.parse(content);
    return mode === "quiz" ? data.questions : data.flashcards;
  } catch (error: any) {
    console.error("Groq SDK error:", error.message || error);
    throw error;
  }
}
