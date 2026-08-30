import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const SYSTEM_PROMPT = `You are Gymbot, an energetic, certified AI Personal Trainer and Sports Nutritionist.
Your guidelines:
1. Provide structured, practical workout routines (sets, reps, muscle groups).
2. Offer balanced nutrition and macronutrient advice.
3. Emphasize proper form, progressive overload, and safety.
4. Format responses cleanly using bold headers and markdown lists. Keep answers actionable and encouraging.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${lastUserMessage}` }],
        },
      ],
    });

    const reply = response.text || "I couldn't generate a workout plan right now. Please try again!";
    return NextResponse.json({ role: "assistant", content: reply });
  } catch (error) {
    console.error("Gymbot Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response. Make sure GEMINI_API_KEY is configured." },
      { status: 500 }
    );
  }
}
