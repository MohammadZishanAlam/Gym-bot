"use client";

import { useState } from "react";
import { UserProfile, Gender, ActivityLevel, FitnessGoal } from "../types/fitness";
import { User, Activity, Dumbbell, Target, CheckCircle2, X } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  existingProfile?: UserProfile | null;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  onSave,
  existingProfile,
}: OnboardingModalProps) {
  const [name, setName] = useState(existingProfile?.name || "Zishan");
  const [age, setAge] = useState(existingProfile?.age || 22);
  const [gender, setGender] = useState<Gender>(existingProfile?.gender || "male");
  const [heightCm, setHeightCm] = useState(existingProfile?.heightCm || 175);
  const [weightKg, setWeightKg] = useState(existingProfile?.weightKg || 72);
  const [targetWeightKg, setTargetWeightKg] = useState(existingProfile?.targetWeightKg || 75);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    existingProfile?.activityLevel || "moderate"
  );
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(
    existingProfile?.fitnessGoal || "muscle_gain"
  );
  const [dietaryPreference, setDietaryPreference] = useState<UserProfile["dietaryPreference"]>(
    existingProfile?.dietaryPreference || "non_veg"
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      name: name.trim() || "User",
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      targetWeightKg: Number(targetWeightKg),
      activityLevel,
      fitnessGoal,
      dietaryPreference,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {existingProfile ? "✏️ Edit Your Fitness Profile" : "🚀 Set Up Your Fitness Profile"}
              </h2>
              <p className="text-xs text-slate-400">
                Gymbot calculates your exact metabolic targets based on these stats.
              </p>
            </div>
          </div>
          {existingProfile && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zishan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Age (years)
              </label>
              <input
                type="number"
                required
                min={12}
                max={100}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Biological Gender (for metabolic formulas)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                  gender === "male"
                    ? "bg-teal-600/20 border-teal-500 text-teal-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                👨 Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                  gender === "female"
                    ? "bg-teal-600/20 border-teal-500 text-teal-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                👩 Female
              </button>
            </div>
          </div>

          {/* Height, Current Weight & Target Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                required
                min={100}
                max={250}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                min={30}
                max={300}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                min={30}
                max={300}
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" /> Daily Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition"
            >
              <option value="sedentary">🛋️ Sedentary (Desk job, little/no exercise)</option>
              <option value="light">🚶 Light Activity (Workout 1-3 days/week)</option>
              <option value="moderate">🏃 Moderate Activity (Workout 3-5 days/week)</option>
              <option value="active">🏋️ Very Active (Hard exercise 6-7 days/week)</option>
              <option value="very_active">⚡ Athlete / Physical Labor (2x intense training/day)</option>
            </select>
          </div>

          {/* Primary Fitness Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-400" /> Primary Fitness Goal
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "muscle_gain", label: "💪 Muscle Gain", sub: "Lean Surplus" },
                { id: "fat_loss", label: "🔥 Fat Loss", sub: "Calorie Deficit" },
                { id: "maintenance", label: "⚖️ Maintain", sub: "Equal In/Out" },
                { id: "endurance", label: "🏃 Endurance", sub: "Stamina & Cardio" },
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setFitnessGoal(g.id as FitnessGoal)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    fitnessGoal === g.id
                      ? "bg-teal-600/20 border-teal-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold">{g.label}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{g.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition"
            >
              <option value="non_veg">🍗 Non-Vegetarian / Balanced</option>
              <option value="vegetarian">🥗 Vegetarian (Dairy, Eggs, Plant Protein)</option>
              <option value="vegan">🌱 Pure Vegan (100% Plant-Based)</option>
              <option value="keto">🥩 Keto / Low-Carb High-Fat</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {existingProfile ? "Save & Recalculate Metrics" : "Calculate My Fitness Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
