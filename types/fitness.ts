export type Gender = "male" | "female";

export type ActivityLevel = 
  | "sedentary"      // Desk job, little to no exercise
  | "light"          // Light exercise 1-3 days/week
  | "moderate"       // Moderate exercise 3-5 days/week
  | "active"         // Hard exercise 6-7 days/week
  | "very_active";   // Very hard exercise, physical job or 2x training

export type FitnessGoal = 
  | "fat_loss"       // Calorie deficit (~450 kcal)
  | "muscle_gain"    // Lean surplus (~300 kcal)
  | "maintenance"    // Equal in/out
  | "endurance";     // Higher carb & stamina focus

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  dietaryPreference?: "non_veg" | "vegetarian" | "vegan" | "keto";
  medicalNotes?: string;
  updatedAt: string;
}

export interface BiometricStats {
  bmi: number;
  bmiCategory: "Underweight" | "Normal weight" | "Overweight" | "Obesity";
  bmr: number;                 // Basal Metabolic Rate
  tdee: number;                // Total Daily Energy Expenditure
  targetCalories: number;      // Calorie goal based on fitnessGoal
  macros: {
    proteinGrams: number;
    proteinKcal: number;
    carbsGrams: number;
    carbsKcal: number;
    fatsGrams: number;
    fatsKcal: number;
  };
  waterLiters: number;
  idealWeightRange: {
    min: number;
    max: number;
  };
}
