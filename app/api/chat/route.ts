import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Gymbot, an energetic, certified AI Personal Trainer and Sports Nutritionist.
Your guidelines:
1. Provide structured, practical workout routines (sets, reps, muscle groups).
2. Offer balanced nutrition and macronutrient advice.
3. Emphasize proper form, progressive overload, and safety.
4. Format responses cleanly using bold headers and markdown lists. Keep answers actionable and encouraging.`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is missing on the server." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${lastUserMessage}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text() || "I couldn't generate a workout plan right now. Please try again!";

    return NextResponse.json({ role: "assistant", content: reply });
  } catch (error: any) {
    console.error("Gymbot Chat API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate AI response." },
      { status: 500 }
    );
  }
}
