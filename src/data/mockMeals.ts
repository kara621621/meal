import { MealData, MealType } from '../types';
import { getWeekDates, formatDateKey } from '../utils/dateUtils';

// Helper to clean formatting in dishes
// E.g. "돈육김치찌개(9.10)" -> "돈육김치찌개"
export function cleanDishName(name: string): string {
  return name.replace(/\s*\([\d.]+\)\s*$/, '').trim();
}

/**
 * Basic meal templates with specific macronutrient balances
 */
interface MealTemplate {
  mealType: MealType;
  title: string;
  dishes: string[];
  totalCalories: number;
  carbs: number;
  protein: number;
  fat: number;
  allergens: string[];
  proteinPercentage: number;
}

const LUNCH_TEMPLATES: MealTemplate[] = [
  {
    mealType: '중식',
    title: '바싹불고기 정식',
    dishes: ['친환경수수밥', '얼큰순두부찌개', '바싹불고기', '백종원감자채볶음', '석박지'],
    totalCalories: 790,
    carbs: 105,
    protein: 28,
    fat: 22,
    allergens: ['대두', '밀', '쇠고기'],
    proteinPercentage: 78,
  },
  {
    mealType: '중식',
    title: '수제닭강정 정식',
    dishes: ['클로렐라라이스', '햄듬뿍부대찌개', '바삭수제닭강정', '치커리사과무침', '포기김치'],
    totalCalories: 820,
    carbs: 112,
    protein: 30,
    fat: 24,
    allergens: ['대두', '밀', '닭고기', '돼지고기'],
    proteinPercentage: 82,
  },
  {
    mealType: '중식',
    title: '웰빙곤드레밥 식단',
    dishes: ['곤드레밥 & 양념장', '고소들깨미역국', '바삭오색전', '시골고사리나물', '아삭백김치'],
    totalCalories: 760,
    carbs: 98,
    protein: 20,
    fat: 18,
    allergens: ['대두', '밀'],
    proteinPercentage: 72,
  },
  {
    mealType: '중식',
    title: '수제함박스테이크 정식',
    dishes: ['가바혼합잡곡밥', '돈육김치찌개', '수제함박스테이크', '숙주미나리무침', '달콤콘드레싱샐러드', '아삭깍두기'],
    totalCalories: 850,
    carbs: 110,
    protein: 32,
    fat: 25,
    allergens: ['돼지고기', '쇠고기', '대두', '밀'],
    proteinPercentage: 85,
  },
  {
    mealType: '중식',
    title: '치즈돈까스 정식',
    dishes: ['친환경현미밥', '소고기미역국', '수제치즈돈까스', '숙주미나리무침', '명품배추김치'],
    totalCalories: 845,
    carbs: 110,
    protein: 32,
    fat: 25,
    allergens: ['대두', '밀', '쇠고기', '돼지고기', '우유'],
    proteinPercentage: 85,
  }
];

const DINNER_TEMPLATES: MealTemplate[] = [
  {
    mealType: '석식',
    title: '스팸마요덮밥 정식',
    dishes: ['스팸마요덮밥', '유부맑은국', '매콤국물떡볶이', '꼬들단무지무침', '마시는요구르트'],
    totalCalories: 740,
    carbs: 110,
    protein: 22,
    fat: 24,
    allergens: ['난류', '우유', '대두', '밀', '돼지고기'],
    proteinPercentage: 62,
  },
  {
    mealType: '석식',
    title: '카레라이스 코스',
    dishes: ['정통카레라이스', '가쓰오맑은장국', '오사카타코야끼', '포기김치', '아침에사과쥬스'],
    totalCalories: 710,
    carbs: 115,
    protein: 18,
    fat: 16,
    allergens: ['대두', '밀', '토마토'],
    proteinPercentage: 58,
  },
  {
    mealType: '석식',
    title: '엄마손잔치국수 세트',
    dishes: ['시골잔치국수', '고기손만두 & 초간장', '매콤양파초절임', '겉절이김치', '야쿠르트'],
    totalCalories: 685,
    carbs: 102,
    protein: 20,
    fat: 14,
    allergens: ['대두', '밀', '돼지고기'],
    proteinPercentage: 65,
  },
  {
    mealType: '석식',
    title: '참치마요 우동세트',
    dishes: ['참치마요덮밥', '사누끼미니우동', '새콤단무지무침', '배추김치', '프로바이오틱요구르트'],
    totalCalories: 720,
    carbs: 95,
    protein: 24,
    fat: 18,
    allergens: ['난류', '우유', '대두', '밀'],
    proteinPercentage: 60,
  },
  {
    mealType: '석식',
    title: '베이컨볶음밥 정식',
    dishes: ['베이컨야채볶음밥', '가쓰오부산어묵우동', '바삭맛김', '아삭깍두기', '감귤푸딩디저트'],
    totalCalories: 730,
    carbs: 105,
    protein: 22,
    fat: 20,
    allergens: ['대두', '밀', '돼지고기'],
    proteinPercentage: 68,
  }
];

/**
 * Dynamically generates a week of meals based on a pivot date
 */
export function generateMealsForWeek(pivotDate: Date): MealData[] {
  const weekDates = getWeekDates(pivotDate);
  const meals: MealData[] = [];
  const DAYS_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

  weekDates.forEach((date, index) => {
    // Determine custom template index from 0 to 4 based on day index (Monday=0, Tuesday=1...)
    const templateIndex = index % 5;
    const lunchTemplate = LUNCH_TEMPLATES[templateIndex];
    const dinnerTemplate = DINNER_TEMPLATES[templateIndex];
    const dateKey = formatDateKey(date);
    const dayOfWeek = DAYS_SHORT[date.getDay()];

    // Generate Lunch
    meals.push({
      id: `${dateKey}_LUNCH`,
      schoolName: '씨마스고등학교',
      date: date,
      dateKey: dateKey,
      dayOfWeek: dayOfWeek,
      mealType: '중식',
      title: lunchTemplate.title,
      dishes: lunchTemplate.dishes,
      totalCalories: lunchTemplate.totalCalories,
      nutrition: {
        carbs: lunchTemplate.carbs,
        protein: lunchTemplate.protein,
        fat: lunchTemplate.fat,
      },
      allergens: lunchTemplate.allergens,
      proteinPercentage: lunchTemplate.proteinPercentage
    });

    // Generate Dinner
    meals.push({
      id: `${dateKey}_DINNER`,
      schoolName: '씨마스고등학교',
      date: date,
      dateKey: dateKey,
      dayOfWeek: dayOfWeek,
      mealType: '석식',
      title: dinnerTemplate.title,
      dishes: dinnerTemplate.dishes,
      totalCalories: dinnerTemplate.totalCalories,
      nutrition: {
        carbs: dinnerTemplate.carbs,
        protein: dinnerTemplate.protein,
        fat: dinnerTemplate.fat,
      },
      allergens: dinnerTemplate.allergens,
      proteinPercentage: dinnerTemplate.proteinPercentage
    });
  });

  return meals;
}
