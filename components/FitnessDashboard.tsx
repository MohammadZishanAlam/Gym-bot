"use client";

import { useState } from "react";
import { UserProfile, BiometricStats } from "../types/fitness";
import {
  Flame,
  Activity,
  Heart,
  Droplet,
  Scale,
  TrendingUp,
  Target,
  Edit3,
  Sparkles,
  Zap,
  CheckCircle,
} from "lucide-react";

interface FitnessDashboardProps {
  profile: UserProfile;
  stats: BiometricStats;
  onEditProfile: () => void;
  onQuickWeightUpdate: (newWeightKg: number) => void;
  onAskAI: (prompt: string) => void;
}

export default function FitnessDashboard({
  profile,
  stats,
  onEditProfile,
  onQuickWeightUpdate,
  onAskAI,
}: FitnessDashboardProps) {
  const [quickWeight, setQuickWeight] = useState(profile.weightKg.toString());
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleQuickWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickWeight);
    if (!isNaN(val) && val > 30 && val < 300) {
      onQuickWeightUpdate(val);
      setShowSavedFeedback(true);
      setTimeout(() => setShowSavedFeedback(false), 2000);
    }
  };

  const getBmiColor = (category: BiometricStats["bmiCategory"]) => {
    switch (category) {
      case "Underweight":
        return "text-amber-400 bg-amber-400/10 border-amber-400/30";
      case "Normal weight":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      case "Overweight":
        return "text-orange-400 bg-orange-400/10 border-orange-400/30";
      case "Obesity":
        return "text-red-400 bg-red-400/10 border-red-400/30";
    }
  };

  const getGoalLabel = (goal: UserProfile["fitnessGoal"]) => {
    switch (goal) {
      case "fat_loss":
        return "🔥 Fat Loss (Calorie Deficit)";
      case "muscle_gain":
        return "💪 Muscle Building (Lean Surplus)";
      case "maintenance":
        return "⚖️ Weight Maintenance";
      case "endurance":
        return "🏃 Endurance & Stamina";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {getGoalLabel(profile.fitnessGoal)}
              </span>
              <span className="text-xs text-slate-400">
                {profile.gender === "male" ? "👨 Male" : "👩 Female"} • {profile.age} yrs • {profile.heightCm} cm
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome back, {profile.name}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Your personalized metabolic targets are live. You need{" "}
              <strong className="text-teal-400">{stats.targetCalories} kcal</strong> per day with{" "}
              <strong className="text-teal-400">{stats.macros.proteinGrams}g protein</strong> to reach your goal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEditProfile}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Weight Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400">Current Weight:</span>
            <strong className="text-white text-sm">{profile.weightKg} kg</strong>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Target Goal:</span>
            <strong className="text-white text-sm">{profile.targetWeightKg} kg</strong>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">Ideal BMI Range:</span>
            <strong className="text-white text-sm">
              {stats.idealWeightRange.min} - {stats.idealWeightRange.max} kg
            </strong>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Target Calories */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Daily Target
            </span>
            <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {stats.targetCalories}{" "}
              <span className="text-sm font-normal text-slate-400">kcal/day</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {profile.fitnessGoal === "fat_loss" && "🔥 450 kcal deficit for fat burning"}
              {profile.fitnessGoal === "muscle_gain" && "💪 300 kcal surplus for hypertrophy"}
              {profile.fitnessGoal === "maintenance" && "⚖️ Exact maintenance calories"}
              {profile.fitnessGoal === "endurance" && "🏃 Fueling for high energy"}
            </p>
          </div>
        </div>

        {/* BMI Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Body Mass Index
            </span>
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{stats.bmi}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBmiColor(
                  stats.bmiCategory
                )}`}
              >
                {stats.bmiCategory}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Healthy benchmark: 18.5 - 24.9
            </p>
          </div>
        </div>

        {/* BMR Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Basal Metabolic (BMR)
            </span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {stats.bmr}{" "}
              <span className="text-sm font-normal text-slate-400">kcal</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Calories burned at rest (Mifflin-St Jeor)
            </p>
          </div>
        </div>

        {/* TDEE Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Maintenance (TDEE)
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white">
              {stats.tdee}{" "}
              <span className="text-sm font-normal text-slate-400">kcal</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Total expenditure including activity
            </p>
          </div>
        </div>
      </div>

      {/* Macronutrient Split & Water Target */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Macros Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            🥗 Daily Macronutrient Split
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimized macro targets based on your bodyweight and {getGoalLabel(profile.fitnessGoal)}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {/* Protein */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold text-red-400 uppercase">🥩 Protein</span>
              <div className="text-2xl font-black text-white mt-1">
                {stats.macros.proteinGrams}g
              </div>
              <span className="text-[10px] text-slate-400">
                {stats.macros.proteinKcal} kcal (~
                {Math.round((stats.macros.proteinKcal / stats.targetCalories) * 100)}%)
              </span>
            </div>

            {/* Carbs */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold text-amber-400 uppercase">🍚 Carbs</span>
              <div className="text-2xl font-black text-white mt-1">
                {stats.macros.carbsGrams}g
              </div>
              <span className="text-[10px] text-slate-400">
                {stats.macros.carbsKcal} kcal (~
                {Math.round((stats.macros.carbsKcal / stats.targetCalories) * 100)}%)
              </span>
            </div>

            {/* Fats */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center">
              <span className="text-[11px] font-bold text-teal-400 uppercase">🥑 Healthy Fats</span>
              <div className="text-2xl font-black text-white mt-1">
                {stats.macros.fatsGrams}g
              </div>
              <span className="text-[10px] text-slate-400">
                {stats.macros.fatsKcal} kcal (~
                {Math.round((stats.macros.fatsKcal / stats.targetCalories) * 100)}%)
              </span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex mt-4 border border-slate-800">
            <div
              style={{
                width: `${(stats.macros.proteinKcal / stats.targetCalories) * 100}%`,
              }}
              className="bg-red-500 h-full"
              title="Protein"
            />
            <div
              style={{
                width: `${(stats.macros.carbsKcal / stats.targetCalories) * 100}%`,
              }}
              className="bg-amber-500 h-full"
              title="Carbs"
            />
            <div
              style={{
                width: `${(stats.macros.fatsKcal / stats.targetCalories) * 100}%`,
              }}
              className="bg-teal-500 h-full"
              title="Fats"
            />
          </div>
        </div>

        {/* Water & Quick Weight Update */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" /> Daily Water Target
            </h3>
            <div className="text-3xl font-extrabold text-cyan-400 mt-2">
              {stats.waterLiters} <span className="text-base text-slate-400 font-normal">Liters / day</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ~{Math.round(stats.waterLiters * 4)} standard glasses for hydration & metabolic function.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block mb-1.5">
              ⚡ Quick Weight Update
            </span>
            <form onSubmit={handleQuickWeightSubmit} className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min={30}
                max={300}
                value={quickWeight}
                onChange={(e) => setQuickWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                {showSavedFeedback ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> Updated!
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </form>
            <p className="text-[10px] text-slate-500 mt-1">
              Changes instantly re-calculate your BMI, BMR, and AI coach targets.
            </p>
          </div>
        </div>
      </div>

      {/* AI Quick Coach Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-teal-400" /> One-Click AI Coach Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() =>
              onAskAI(
                `Based on my weight (${profile.weightKg}kg), height (${profile.heightCm}cm), and goal (${profile.fitnessGoal}), create a complete customized 4-day workout routine with exact sets, reps, and exercise progression.`
              )
            }
            className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="font-bold text-xs text-teal-300 group-hover:text-teal-200">
              🏋️ Generate Custom Workout Split
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Tailored to your goal & activity level
            </div>
          </button>

          <button
            onClick={() =>
              onAskAI(
                `Based on my daily target of ${stats.targetCalories} calories and ${stats.macros.proteinGrams}g of protein (${profile.dietaryPreference || "balanced"} diet), create a full 1-day sample meal plan with breakfast, lunch, snack, and dinner.`
              )
            }
            className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="font-bold text-xs text-amber-300 group-hover:text-amber-200">
              🥗 Design Daily Meal Plan ({stats.targetCalories} kcal)
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Hits exact {stats.macros.proteinGrams}g protein & macros
            </div>
          </button>

          <button
            onClick={() =>
              onAskAI(
                `My current BMI is ${stats.bmi} (${stats.bmiCategory}) at ${profile.weightKg}kg. What are the best strategies to safely reach my target weight of ${profile.targetWeightKg}kg and how long should it take?`
              )
            }
            className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="font-bold text-xs text-blue-300 group-hover:text-blue-200">
              📈 Milestone Roadmap to {profile.targetWeightKg} kg
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Timeline & progressive fat loss/bulk guidance
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
