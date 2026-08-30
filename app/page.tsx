"use client";

import { useState, useRef, useEffect } from "react";
import { UserProfile, BiometricStats } from "../types/fitness";
import { calculateBiometrics } from "../lib/calculations";
import OnboardingModal from "../components/OnboardingModal";
import FitnessDashboard from "../components/FitnessDashboard";
import {
  Dumbbell,
  Send,
  Bot,
  User,
  Flame,
  Activity,
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Edit3,
  RotateCcw,
  Trash2,
  Check,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "gymbot_user_profile";

const DEFAULT_PROFILE: UserProfile = {
  name: "Zishan",
  age: 22,
  gender: "male",
  heightCm: 175,
  weightKg: 72,
  targetWeightKg: 75,
  activityLevel: "moderate",
  fitnessGoal: "muscle_gain",
  dietaryPreference: "non_veg",
  updatedAt: new Date().toISOString(),
};

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<BiometricStats | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "settings">("dashboard");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hey! I'm **Gymbot**, your AI Personal Trainer & Nutrition Coach.\n\nYour profile biometrics are loaded. Ask me for customized workout splits, meal plans, or progress strategies tailored to your exact metabolic goals!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load User Profile from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        setProfile(parsed);
        setStats(calculateBiometrics(parsed));
      } else {
        // First-time setup with sensible defaults
        setProfile(DEFAULT_PROFILE);
        setStats(calculateBiometrics(DEFAULT_PROFILE));
        setIsOnboardingOpen(true);
      }
    } catch (e) {
      setProfile(DEFAULT_PROFILE);
      setStats(calculateBiometrics(DEFAULT_PROFILE));
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // 2. Auto-scroll chat
  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, activeTab]);

  // 3. Save / Update User Profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    const newStats = calculateBiometrics(newProfile);
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  // 4. Quick Weight Update from Dashboard
  const handleQuickWeightUpdate = (newWeightKg: number) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      weightKg: newWeightKg,
      updatedAt: new Date().toISOString(),
    };
    handleSaveProfile(updated);
  };

  // 5. Send Message to AI Coach
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          profile,
          stats,
        }),
      });

      const data = await res.json().catch(() => ({
        error: `Server returned HTTP ${res.status}`,
      }));

      if (res.ok && data.content) {
        setMessages([...updatedMessages, { role: "assistant", content: data.content }]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: `⚠️ ${data.error || "Failed to communicate with AI."}` },
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: `⚠️ Network error: ${err?.message || "Please check your connection."}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAIFromDashboard = (prompt: string) => {
    setActiveTab("chat");
    sendMessage(prompt);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset your profile and chat history?")) {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(DEFAULT_PROFILE);
      setStats(calculateBiometrics(DEFAULT_PROFILE));
      setMessages([
        {
          role: "assistant",
          content: "👋 Profile reset! Set up your new fitness goals or chat with Gymbot.",
        },
      ]);
      setIsOnboardingOpen(true);
    }
  };

  if (!isInitialized || !profile || !stats) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-teal-400 font-medium">
        <Activity className="w-6 h-6 animate-spin mr-2" /> Loading your fitness profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-teal-500/20 flex-shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                Gymbot AI
              </h1>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                PRO COACH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Personalized Fitness & Metabolic Dashboard
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "dashboard"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "chat"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "settings"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* User Status Chip */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-800/80 hover:bg-slate-800 rounded-full border border-slate-700/80 transition text-xs group"
          >
            <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-slate-200 font-medium">{profile.name}</span>
            <span className="text-teal-400 text-[11px] font-mono">({profile.weightKg}kg)</span>
            <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-teal-300 transition ml-0.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* VIEW 1: Interactive Dashboard */}
        {activeTab === "dashboard" && (
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <FitnessDashboard
              profile={profile}
              stats={stats}
              onEditProfile={() => setIsOnboardingOpen(true)}
              onQuickWeightUpdate={handleQuickWeightUpdate}
              onAskAI={handleAskAIFromDashboard}
            />
          </div>
        )}

        {/* VIEW 2: AI Coach Chat Interface */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            {/* Biometric Context Bar */}
            <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-teal-400 font-bold">🎯 Live Context:</span>
                <span>{profile.name}</span>
                <span>•</span>
                <span>{profile.weightKg}kg</span>
                <span>•</span>
                <span>Target: {stats.targetCalories} kcal</span>
                <span>•</span>
                <span>Protein: {stats.macros.proteinGrams}g</span>
              </div>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 flex-shrink-0"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-teal-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-slate-800/80 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-200 shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-slate-400 text-sm">
                  <div className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 animate-pulse">
                    <Activity className="w-4 h-4 animate-spin" />
                  </div>
                  <span className="text-xs text-teal-300 font-medium">
                    Gymbot is calculating your optimal routine...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </main>

            {/* Input Form */}
            <footer className="p-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="max-w-3xl mx-auto flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask Gymbot for custom workouts, recipes (${stats.targetCalories} kcal), form tips...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white font-medium rounded-xl text-sm flex items-center gap-2 transition shadow-lg shadow-teal-900/30 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </footer>
          </div>
        )}

        {/* VIEW 3: Settings & Data Management */}
        {activeTab === "settings" && (
          <div className="h-full overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-400" /> Profile & Data Settings
              </h2>
              <p className="text-xs text-slate-400">
                Your data is stored locally and securely in your browser and automatically synchronized with the AI Assistant.
              </p>

              <div className="mt-6 space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{profile.name}&apos;s Profile</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {profile.gender} • {profile.age} yrs • {profile.heightCm} cm • {profile.weightKg} kg
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-semibold text-slate-300 block">📊 Calculated Values:</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>BMI: <strong className="text-white">{stats.bmi} ({stats.bmiCategory})</strong></div>
                    <div>BMR: <strong className="text-white">{stats.bmr} kcal</strong></div>
                    <div>TDEE: <strong className="text-white">{stats.tdee} kcal</strong></div>
                    <div>Target Goal: <strong className="text-white">{stats.targetCalories} kcal</strong></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-red-400 block">Reset & Clear Data</span>
                    <span className="text-[11px] text-slate-500">
                      Clears local profile and resets conversation history.
                    </span>
                  </div>
                  <button
                    onClick={handleResetData}
                    className="px-3.5 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Reset Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Onboarding / Edit Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSave={handleSaveProfile}
        existingProfile={profile}
      />
    </div>
  );
}
