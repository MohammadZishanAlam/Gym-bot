import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# --- CONFIGURATION ---
# Get your API key from https://aistudio.google.com/
os.environ["GEMINI_API_KEY"] = "YOUR_ACTUAL_API_KEY_HERE"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = FastAPI()

# Allow your Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THE "KNOWLEDGE BASE" (Mock Database) ---
# In a real app, this would be an SQL database.
GYM_INFO = """
- Name: IronForge Gym
- Location: Main Street, Ranchi.
- Hours: 6 AM - 10 PM daily.
- Membership:
    - Silver: $30/month (Gym access only)
    - Gold: $50/month (Gym + Classes)
    - Platinum: $80/month (All access + Sauna)
- Trainers: Ravi (Strength), Sarah (Yoga), Mike (HIIT).
"""

# --- THE SYSTEM PROMPT ---
# This turns a generic LLM into a specific "Agent"
SYSTEM_INSTRUCTION = f"""
You are "ForgeBot", the helpful AI assistant for IronForge Gym.
Your goal is to answer visitor questions, recommend membership plans, and explain workout types.
Use the following context to answer questions strictly:
{GYM_INFO}

If the answer is not in the context, say "I'm not sure, please call the front desk."
Keep answers short, friendly, and motivating.
"""

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=SYSTEM_INSTRUCTION
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Generate response
        response = model.generate_content(request.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn main:app --reload