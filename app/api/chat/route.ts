import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-pro",
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

    const { messages, profile, stats } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    let biometricContext = "";
    if (profile && stats) {
      biometricContext = `
USER PERSONAL PROFILE & BIOMETRIC METRICS:
- Name: ${profile.name}
- Age: ${profile.age} | Gender: ${profile.gender}
- Height: ${profile.heightCm} cm | Current Weight: ${profile.weightKg} kg (Target: ${profile.targetWeightKg} kg)
- Activity Level: ${profile.activityLevel}
- Primary Goal: ${profile.fitnessGoal}
- Dietary Preference: ${profile.dietaryPreference || "non_veg"}
- Calculated BMI: ${stats.bmi} (${stats.bmiCategory})
- Basal Metabolic Rate (BMR): ${stats.bmr} kcal
- Maintenance TDEE: ${stats.tdee} kcal
- Daily Calorie Target: ${stats.targetCalories} kcal
- Daily Macro Split: Protein ${stats.macros.proteinGrams}g, Carbs ${stats.macros.carbsGrams}g, Fats ${stats.macros.fatsGrams}g
- Daily Water Target: ${stats.waterLiters} Liters

Always tailor workout routines, exercise intensity, meal suggestions, and recovery advice to this user's exact biometrics and targets. Reference their specific calorie and protein numbers when answering dietary and fitness inquiries.`;
    }

    const SYSTEM_PROMPT = `You are Gymbot, an energetic, certified elite AI Personal Trainer and Sports Nutritionist.
${biometricContext}

Your guidelines:
1. Provide highly structured, practical, personalized workout routines (sets, reps, muscle groups, progressive overload).
2. Offer balanced nutrition advice aligned with the user's exact calorie target (${stats?.targetCalories || "custom"} kcal) and protein goal (${stats?.macros?.proteinGrams || "150"}g).
3. Emphasize proper exercise biomechanics, safety, and rest.
4. Format responses cleanly using bold headers and markdown lists. Keep answers actionable and encouraging.`;

    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${lastUserMessage}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    let reply = "";
    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        reply = response.text();
        if (reply) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed:`, err?.message);
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
