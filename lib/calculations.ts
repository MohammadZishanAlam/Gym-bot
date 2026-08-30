import { UserProfile, BiometricStats, ActivityLevel, FitnessGoal } from "../types/fitness";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBiometrics(profile: UserProfile): BiometricStats {
  const { age, gender, heightCm, weightKg, activityLevel, fitnessGoal } = profile;

  // 1. BMI Calculation
  const heightMeters = heightCm / 100;
  const bmiRaw = weightKg / (heightMeters * heightMeters);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let bmiCategory: BiometricStats["bmiCategory"] = "Normal weight";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal weight";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obesity";

  // 2. BMR (Mifflin-St Jeor Equation)
  // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  let bmrRaw = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === "male") {
    bmrRaw += 5;
  } else {
    bmrRaw -= 161;
  }
  const bmr = Math.round(bmrRaw);

  // 3. TDEE (Total Daily Energy Expenditure)
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  // 4. Target Calories based on Goal
  let targetCalories = tdee;
  if (fitnessGoal === "fat_loss") {
    targetCalories = Math.max(1200, Math.round(tdee - 450)); // Safe caloric deficit
  } else if (fitnessGoal === "muscle_gain") {
    targetCalories = Math.round(tdee + 300); // Lean caloric surplus
  } else if (fitnessGoal === "endurance") {
    targetCalories = Math.round(tdee + 150); // Stamina / fueling
  }

  // 5. Macronutrient Split
  // Protein: ~2.0g per kg of bodyweight (4 kcal/g)
  let proteinFactor = 2.0;
  if (fitnessGoal === "muscle_gain") proteinFactor = 2.2;
  if (fitnessGoal === "fat_loss") proteinFactor = 2.0;
  if (fitnessGoal === "maintenance") proteinFactor = 1.8;

  const proteinGrams = Math.round(weightKg * proteinFactor);
  const proteinKcal = proteinGrams * 4;

  // Fats: 25% to 30% of target calories (9 kcal/g)
  const fatsKcal = Math.round(targetCalories * 0.25);
  const fatsGrams = Math.round(fatsKcal / 9);

  // Carbs: Remaining calories (4 kcal/g)
  const remainingKcal = Math.max(0, targetCalories - (proteinKcal + fatsKcal));
  const carbsGrams = Math.round(remainingKcal / 4);
  const carbsKcal = carbsGrams * 4;

  // 6. Water Target (Liters)
  // ~35ml per kg + extra 0.5L for active lifestyle
  let waterLiters = Math.round((weightKg * 0.035 + (activityLevel !== "sedentary" ? 0.6 : 0.2)) * 10) / 10;
  waterLiters = Math.max(2.0, waterLiters);

  // 7. Ideal Weight Range (BMI 18.5 - 24.9)
  const minIdeal = Math.round(18.5 * heightMeters * heightMeters * 10) / 10;
  const maxIdeal = Math.round(24.9 * heightMeters * heightMeters * 10) / 10;

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    targetCalories,
    macros: {
      proteinGrams,
      proteinKcal,
      carbsGrams,
      carbsKcal,
      fatsGrams,
      fatsKcal,
    },
    waterLiters,
    idealWeightRange: {
      min: minIdeal,
      max: maxIdeal,
    },
  };
}
