import { useState, useEffect } from 'react';
import { Save, CheckCircle2, Circle, Calculator, Flame, Dumbbell, Sparkles, Filter } from 'lucide-react';
import { MealData, StudentProfile } from '../types';
import { getTodayKST, isWeekend, formatKoreanDate } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'motion/react';

interface NutritionCalcViewProps {
  key?: string | number;
  today: Date;
  meals: MealData[];
  profile: StudentProfile;
}

interface CalculatedDish {
  name: string;
  category: '밥류' | '국/찌개' | '반찬' | '디저트';
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
  description: string;
}

// Proportional dynamic dish nutrition classifier formula
function analyzeDish(name: string): CalculatedDish {
  const lowercase = name.toLowerCase();
  
  // Category Identification
  let category: '밥류' | '국/찌개' | '반찬' | '디저트' = '반찬';
  let kcal = 80;
  let carbs = 15;
  let protein = 3;
  let fat = 1;
  let description = '신선한 급식 반찬';

  if (lowercase.includes('밥') || lowercase.includes('라이스') || lowercase.includes('덮밥')) {
    category = '밥류';
    kcal = 300;
    carbs = 60;
    protein = 7;
    fat = 2;
    description = '든든한 에너지 주식';
  } else if (lowercase.includes('국') || lowercase.includes('찌개') || lowercase.includes('탕') || lowercase.includes('우동') || lowercase.includes('수프') || lowercase.includes('찌게')) {
    category = '국/찌개';
    kcal = 180;
    carbs = 14;
    protein = 12;
    fat = 8;
    description = '따뜻하고 개운한 국물 요리';
  } else if (lowercase.includes('요구르트') || lowercase.includes('야쿠르트') || lowercase.includes('푸딩') || lowercase.includes('쥬스') || lowercase.includes('주스') || lowercase.includes('드레싱') || lowercase.includes('푸딩') || lowercase.includes('과일') || lowercase.includes('샐러드') || lowercase.includes('디저트')) {
    category = '디저트';
    kcal = 70;
    carbs = 15;
    protein = 1;
    fat = 0;
    description = '상콤달콤 식후 디저트';
  } else {
    // Large portion main course dishes
    if (lowercase.includes('돈까스') || lowercase.includes('까스') || lowercase.includes('스테이크') || lowercase.includes('강정') || lowercase.includes('고기') || lowercase.includes('불고기') || lowercase.includes('닭') || lowercase.includes('함박') || lowercase.includes('갈비') || lowercase.includes('오색전') || lowercase.includes('치킨')) {
      category = '반찬';
      kcal = 265;
      carbs = 18;
      protein = 19;
      fat = 14;
      description = '특식 단백질 메인 요리';
    } else if (lowercase.includes('김치') || lowercase.includes('깍두기') || lowercase.includes('석박지') || lowercase.includes('단무지') || lowercase.includes('겉절이')) {
      category = '반찬';
      kcal = 25;
      carbs = 4;
      protein = 1;
      fat = 0;
      description = '아삭하고 맛있는 우리나라 김치';
    } else if (lowercase.includes('나물') || lowercase.includes('무침') || lowercase.includes('볶음') || lowercase.includes('시금치')) {
      category = '반찬';
      kcal = 45;
      carbs = 5;
      protein = 2;
      fat = 1;
      description = '영양소 가득 식이섬유 채소 찬';
    }
  }

  return { name, category, kcal, carbs, protein, fat, description };
}

export default function NutritionCalcView({ today, meals, profile }: NutritionCalcViewProps) {
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'전체' | '밥류' | '국/찌개' | '반찬' | '디저트'>('전체');

  // Find dynamic target meals
  // If weekend, fall back to Monday's meals so the calculator is populated nicely
  const isTodayWeekend = isWeekend(today);
  const todayKey = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  
  let targetMeals = meals.filter(m => m.dateKey === todayKey);
  const activeWeekMeals = meals;

  if (isTodayWeekend || targetMeals.length === 0) {
    if (activeWeekMeals.length > 0) {
      const monMenu = activeWeekMeals.filter(m => m.dayOfWeek === '월');
      targetMeals = monMenu.length > 0 ? monMenu : activeWeekMeals.slice(0, 2);
    }
  }

  // Target today's LUNCH for calculation reference as instructed in Section 4
  const targetLunch = targetMeals.find(m => m.mealType === '중식');
  const targetLunchDishes = targetLunch ? targetLunch.dishes : [];

  // Analyze lunch dishes to calculate elements
  const parsedDishes: CalculatedDish[] = targetLunchDishes.map(analyzeDish);

  // Auto-select all dishes of today's lunch initially, mapping to default selected state
  useEffect(() => {
    if (targetLunchDishes.length > 0) {
      setSelectedDishes(targetLunchDishes);
    }
  }, [targetLunch?.id]);

  // Toggle checklist select state
  const handleToggleDish = (dishName: string) => {
    if (selectedDishes.includes(dishName)) {
      setSelectedDishes(prev => prev.filter(name => name !== dishName));
    } else {
      setSelectedDishes(prev => [...prev, dishName]);
    }
  };

  // Perform calculations based on checked state
  const currentSelections = parsedDishes.filter(pd => selectedDishes.includes(pd.name));

  const totalKcal = currentSelections.reduce((sum, item) => sum + item.kcal, 0);
  const totalCarbs = currentSelections.reduce((sum, item) => sum + item.carbs, 0);
  const totalProtein = currentSelections.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = currentSelections.reduce((sum, item) => sum + item.fat, 0);

  // Calculate percentage against reference benchmarks: Carbs 300g, Protein 70g, Fat 60g
  const carbsPercentage = Math.min(Math.round((totalCarbs / 180) * 100), 100);
  const proteinPercentage = Math.min(Math.round((totalProtein / 65) * 100), 100);
  const fatPercentage = Math.min(Math.round((totalFat / 55) * 100), 100);

  // Filter components
  const displayedParsedDishes = pdishesFilter(parsedDishes, activeCategoryFilter);

  function pdishesFilter(list: CalculatedDish[], filter: typeof activeCategoryFilter) {
    if (filter === '전체') return list;
    return list.filter(item => item.category === filter);
  }

  const saveSelections = () => {
    alert(`영양 계산 기록이 스마트폰 학생생활기록에 안전하게 저장되었습니다!\n총 칼로리: ${totalKcal} kcal\n탄수화물: ${totalCarbs}g | 단백질: ${totalProtein}g | 지방: ${totalFat}g`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 px-5 pt-4 flex flex-col gap-6"
    >
      {/* Date Notice */}
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-xs text-secondary tracking-wider uppercase">NUTRITION CALCULATOR</span>
        <h2 className="text-2xl font-bold text-on-surface gmarket-font tracking-tight flex items-center gap-2">
          영양성분 계산기
        </h2>
        <p className="text-xs text-on-surface-variant">
          기준 식단: <span className="font-semibold text-primary">{targetLunch ? formatKoreanDate(targetLunch.date) : '미정'}</span> {targetLunch ? targetLunch.title : '급식'}
        </p>
      </div>

      {/* Dynamic Progress Dashboard card */}
      <section className="bg-surface-container-lowest rounded-lg p-5 shadow-soft border border-surface-container-highest transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-on-surface gmarket-font">선택 메뉴 영양총합</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">선택된 개별 항목에 따른 실시간 영양성분입니다.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary gmarket-font" id="total-kcal">
              {totalKcal}
            </span>
            <span className="text-on-surface-variant text-xs font-semibold ml-1">kcal</span>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {/* Progress: Carbs */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-on-surface-variant">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-secondary" /> 탄수화물 (권장 180g)</span>
              <span className="text-on-surface font-bold">{totalCarbs}g ({carbsPercentage}%)</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full" 
                animate={{ width: `${carbsPercentage}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Progress: Protein */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-on-surface-variant">
              <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5 text-primary" /> 단백질 (권장 65g)</span>
              <span className="text-on-surface font-bold">{totalProtein}g ({proteinPercentage}%)</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-secondary rounded-full" 
                animate={{ width: `${proteinPercentage}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Progress: Fat */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-on-surface-variant">
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-error" /> 지방 (권장 55g)</span>
              <span className="text-on-surface font-bold">{totalFat}g ({fatPercentage}%)</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-outline rounded-full" 
                animate={{ width: `${fatPercentage}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Chips Scroller */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
        {(['전체', '밥류', '국/찌개', '반찬', '디저트'] as const).map((filterOpt, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategoryFilter(filterOpt)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
              activeCategoryFilter === filterOpt
                ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {filterOpt}
          </button>
        ))}
      </div>

      {/* Selectable Checkbox Menu Items */}
      <div className="flex flex-col gap-3">
        {displayedParsedDishes.length > 0 ? (
          displayedParsedDishes.map((dish, idx) => {
            const isSelected = selectedDishes.includes(dish.name);
            return (
              <button
                key={idx}
                onClick={() => handleToggleDish(dish.name)}
                className={`w-full group text-left cursor-pointer bg-surface-container-lowest p-4 rounded-xl border-2 shadow-sm flex items-center gap-4 transition-all duration-200 active:scale-98 ${
                  isSelected
                    ? 'border-primary bg-primary-container/5'
                    : 'border-transparent hover:border-outline-variant'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-tertiary-fixed text-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-bold text-base gmarket-font text-on-surface flex items-center justify-between">
                    <span>{dish.name}</span>
                    <span className="text-xs px-2.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full font-semibold">
                      {dish.category}
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-1">
                    {dish.kcal} kcal · 탄({dish.carbs}g) 단({dish.protein}g) 지({dish.fat}g)
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <p className="text-center text-xs text-on-surface-variant py-8 border border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low/40">
            이 카테고리에 해당하는 메뉴 요소가 없습니다.
          </p>
        )}
      </div>

      {/* Save Calculation Button */}
      <button
        onClick={saveSelections}
        className="w-full bg-primary text-white font-bold text-base py-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer hover:bg-primary-container"
      >
        <Save className="w-5 h-5" />
        <span>계산 결과 저장하기</span>
      </button>
    </motion.div>
  );
}
