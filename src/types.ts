export interface NutritionInfo {
  carbs: number;    // Carbonhydrates (g)
  protein: number;  // Protein (g)
  fat: number;      // Fat (g)
}

export type MealType = '중식' | '석식';

export interface MealData {
  id: string;
  schoolName: string;
  date: Date;
  dateKey: string;      // "YYYYMMDD" format
  dayOfWeek: string;    // "월", "화", "수", "목", "금"
  mealType: MealType;
  title: string;        // Title of the representative dish or menu
  dishes: string[];     // Array of individual dishes
  totalCalories: number; // in kcal
  nutrition: NutritionInfo;
  allergens: string[];  // e.g. ["대두", "밀", "우유", "땅콩"]
  proteinPercentage?: number; // e.g. 85 for 85%
}

export interface StudentProfile {
  name: string;
  grade: number;
  classNum: number;
  studentId: number;
  avatarUrl: string;
  allergyAlertEnabled: boolean;
  selectedAllergies: string[];
  dailyMealAlertEnabled: boolean;
  alertTime: string; // e.g., "아침 8시"
}
