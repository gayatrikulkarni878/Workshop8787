"use server";

import { generateQuizOrFlashcard } from "@/lib/ai";
import { redirect } from "next/navigation";
import PDFParser from "pdf2json";
import mammoth from "mammoth";

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    return new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
    file.name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    // Assume text file
    return file.text();
  }
}

export async function generateContent(formData: FormData) {
  const notes = formData.get("notes") as string;
  const file = formData.get("file") as File;
  const mode = formData.get("mode") as "quiz" | "flashcard";
  const count = parseInt(formData.get("count") as string) || 10;

  let textToProcess = notes || "";

  if (file && file.size > 0) {
    try {
      const extractedText = await extractTextFromFile(file);
      textToProcess += "\n" + extractedText;
    } catch (error) {
      console.error("Error extracting text:", error);
      throw new Error("Failed to extract text from file");
    }
  }

  if (!textToProcess.trim()) {
    throw new Error("No content provided");
  }

  const result = await generateQuizOrFlashcard(textToProcess, mode, count);
  const encodedData = encodeURIComponent(JSON.stringify(result));
  
  redirect(`/${mode}?data=${encodedData}`);
}
