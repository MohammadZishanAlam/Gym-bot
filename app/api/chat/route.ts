import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Gymbot, an energetic, certified AI Personal Trainer and Sports Nutritionist.
Your guidelines:
1. Provide structured, practical workout routines (sets, reps, muscle groups).
2. Offer balanced nutrition and macronutrient advice.
3. Emphasize proper form, progressive overload, and safety.
4. Format responses cleanly using bold headers and markdown lists. Keep answers actionable and encouraging.`;

// List of models to try in order of preference
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-pro"
];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is missing on the server." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${lastUserMessage}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    let reply = "";
    let lastError = null;

    // Try candidate models until one succeeds
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        reply = response.text();
        if (reply) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate:`, err?.message);
      }
    }

    if (!reply) {
      throw lastError || new Error("No response from AI models.");
    }

    return NextResponse.json({ role: "assistant", content: reply });
  } catch (error: any) {
    console.error("Gymbot Chat API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate AI response." },
      { status: 500 }
    );
  }
}
