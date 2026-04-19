"use server";

import { generateQuizOrFlashcard } from "@/lib/ai";
import PDFParser from "pdf2json";
import mammoth from "mammoth";
import Groq from "groq-sdk";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  console.warn("⚠️ NEXT_PUBLIC_CONVEX_URL is missing. History synchronization will be unavailable.");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Image Support (OCR via Groq Vision)
  if (file.type.startsWith("image/")) {
    const visionData = buffer.toString("base64");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Please accurately extract ALL text from this image. This may be heavily handwritten notes, cursive, diagrams, whiteboards, or sloppy study notes. Transcribe the handwritten or typed text as concisely and completely as possible so it can be used for generating quizzes." },
            { type: "image_url", image_url: { url: `data:${file.type};base64,${visionData}` } }
          ]
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });
    return response.choices[0].message.content || "";
  }

  // PDF Support
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as unknown as new (...args: unknown[]) => { on: (event: string, cb: (data: unknown) => void) => void; parseBuffer: (buffer: Buffer) => void; getRawTextContent: () => string })(null, 1);
      pdfParser.on("pdfParser_dataError", (errData: unknown) => reject((errData as { parserError: string }).parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });
  } 
  
  // DOCX Support
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
    file.name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } 
  
  // Default Text Support (TXT, etc.)
  return file.text();
}

export async function generateContent(formData: FormData) {
  console.log("🚀 Server Action 'generateContent' triggered.");
  const notes = formData.get("notes") as string;
  const file = formData.get("file") as File;
  const mode = formData.get("mode") as "quiz" | "flashcard";
  const difficulty = (formData.get("difficulty") as "easy" | "medium" | "hard" | "mixed") || "mixed";
  const count = parseInt(formData.get("count") as string) || 10;

  let textToProcess = notes || "";

  try {
    if (file && file.size > 0) {
      try {
        const extractedText = await extractTextFromFile(file);
        textToProcess += "\n" + extractedText;
      } catch (error) {
        console.error("Error extracting text from file:", error);
        throw new Error("Failed to extract text from file. The file might be corrupted or too large.");
      }
    }

    if (!textToProcess.trim()) {
      if (file && file.type === "application/pdf") {
        try {
           console.log("PDF appears to be scanned/handwritten. Attempting OCR...");
           const buffer = Buffer.from(await file.arrayBuffer());
           const formDataOCR = new FormData();
           formDataOCR.append('base64Image', 'data:application/pdf;base64,' + buffer.toString('base64'));
           formDataOCR.append('language', 'eng');
           formDataOCR.append('isOverlayRequired', 'false');
           
           const ocrRes = await fetch('https://api.ocr.space/parse/image', {
              method: 'POST',
              headers: { 'apikey': 'helloworld' },
              body: formDataOCR
           });
           const ocrJson = await ocrRes.json();
           if (ocrJson.ParsedResults && ocrJson.ParsedResults.length > 0) {
              textToProcess = ocrJson.ParsedResults.map((p: any) => p.ParsedText).join("\n");
           }
        } catch (ocrError) {
           console.error("OCR API failed", ocrError);
        }
        
        if (!textToProcess.trim()) {
          throw new Error("Cannot extract text from this handwritten PDF. The OCR engine failed or the PDF is too large. Please upload the notes as Images (.jpg/.png) instead.");
        }
      } else {
        throw new Error("No content provided");
      }
    }

    // Generate content using lightning-fast model
    const result = await generateQuizOrFlashcard(textToProcess.substring(0, 6000), mode, count, difficulty);

    // Sync to history (Attempt to save with a tight timeout to keep it snappy)
    const topic = file?.name || notes?.substring(0, 30) || "Untitled Notes";
    let historyId = null;
    try {
      console.log("💾 Initiating history sync for topic:", topic);
      historyId = await Promise.race([
        convex.mutation(api.history.saveHistory, {
          topic,
          mode,
          data: result.items as unknown,
        }).then(id => {
          console.log("✅ History synced successfully. ID:", id);
          return id;
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Database Latency")), 2500))
      ]);
    } catch (saveError) {
      console.warn("⚠️ Database sync bypassed (saving in background):", saveError instanceof Error ? saveError.message : "Connection failed");
    }

    return { 
      success: true, 
      historyId, 
      mode,
      data: result.items // Return data as fallback
    };
  } catch (error) {
    console.error("Critical Generation Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Generation failed" };
  }
}
