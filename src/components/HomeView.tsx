import { useState } from 'react';
import { Heart, ShieldAlert, Award, AlertTriangle, Flame } from 'lucide-react';
import { MealData, StudentProfile } from '../types';
import { formatKoreanDate, isWeekend } from '../utils/dateUtils';
import { motion } from 'motion/react';

interface HomeViewProps {
  key?: string | number;
  today: Date;
  meals: MealData[];
  profile: StudentProfile;
}

export default function HomeView({ today, meals, profile }: HomeViewProps) {
  const [isFavorited, setIsFavorited] = useState(true);

  // Determine current display date
  const isTodayWeekend = isWeekend(today);
  
  // Under Way B: If it's the weekend, find the next Monday's meals
  // Otherwise, filter meals that match today's date key
  const todayKey = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  
  let displayedMeals = meals.filter(m => m.dateKey === todayKey);
  let showNextMealBadge = false;

  if (isTodayWeekend || displayedMeals.length === 0) {
    // Weekend! Let's display the closest upcoming weekday (which is Monday)
    // Find the first meal standard date
    if (meals.length > 0) {
      // Find the Monday meal data (first or second in array)
      const mondayMeals = meals.filter(m => m.dayOfWeek === '월');
      if (mondayMeals.length > 0) {
        displayedMeals = mondayMeals;
        showNextMealBadge = true;
      } else {
        displayedMeals = meals.slice(0, 2); // Default to first day
      }
    }
  }

  const lunch = displayedMeals.find(m => m.mealType === '중식');
  const dinner = displayedMeals.find(m => m.mealType === '석식');

  // Check if any displaying meals contain student's selected allergens
  const detectUserAllergies = (meal?: MealData) => {
    if (!meal || !profile.allergyAlertEnabled) return [];
    return meal.allergens.filter(allergy => profile.selectedAllergies.includes(allergy));
  };

  const lunchAllergies = detectUserAllergies(lunch);
  const dinnerAllergies = detectUserAllergies(dinner);

  // Format header date (if weekend, explain it's weekend, but keep the day as today)
  const headerDateStr = formatKoreanDate(today);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 px-5 pt-4 flex flex-col gap-6"
    >
      {/* Dynamic Date Header */}
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-xs text-secondary tracking-wider uppercase">TODAY'S CAFE</span>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-on-surface gmarket-font tracking-tight">
            {headerDateStr}
          </h2>
          {isTodayWeekend && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
              주말 휴무
            </span>
          )}
        </div>
      </div>

      {/* Hero Meal Recommendation Card */}
      <section className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-soft border border-outline-variant/20 transition-all duration-300 relative">
        <div className="relative h-60 w-full bg-surface-container-high overflow-hidden">
          <img 
            alt="치즈돈까스 정식 및 급식 트레이 이미지" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none transition-transform hover:scale-105 duration-500" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm4PSO0aac_O7pL6U60CEsRakePhWoVn5Jfv3LHxny0tl-QPUDIC6fh-CNKSgtQqP16gIIHFLF3EGWpoa6lnoQ6f0F19xKhCliUchkn_Qaf767r9B9K1ce47gztaPrYOJlV7_zMtaHofyeQKNMdGh1BkoivniyHC1kgWPwT57fJJXATJKEWQKgMdPBMU-HAhT1_114WUeG-KFU_wzzf28CCXTQ9LJG_6QdsO3Xclt_Jhj9oRKxyoiXpfcIPog-wekrULLJS99JMPTC"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> 오늘의 추천 급식
            </span>
            {showNextMealBadge && (
              <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
                다음 급식일 식단
              </span>
            )}
          </div>

          <button 
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
            aria-label="관심 급식 토글"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${isFavorited ? 'text-error fill-error scale-110' : 'text-on-surface-variant'}`} 
            />
          </button>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-on-surface-variant text-xs font-medium">
                {lunch ? formatKoreanDate(lunch.date) : '미지정 날짜'}
              </p>
              <h3 className="font-bold text-xl text-on-surface mt-1 gmarket-font">
                {lunch ? lunch.title : '등록된 급식 정보가 없습니다.'}
              </h3>
            </div>
            <div className="text-right flex items-center gap-1">
              <span className="text-primary font-bold text-2xl gmarket-font">
                {lunch ? lunch.totalCalories : 0}
              </span>
              <span className="text-on-surface-variant text-xs">kcal</span>
            </div>
          </div>
          
          {showNextMealBadge && (
            <div className="mt-3 p-3 bg-surface-container rounded-lg border border-outline-variant/30 flex gap-2 items-start">
              <AlertTriangle className="w-4.5 h-4.5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-on-surface-variant leading-relaxed">
                현재 주말이며, 화면이 비어 보이지 않도록 가장 가까운 돌아오는 <span className="font-semibold text-secondary">다음 급식일(월요일)요일 식단</span>을 불러왔습니다.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lunch Menu Detail Card */}
      <section className="bg-surface-container-lowest rounded-lg p-5 shadow-soft border border-outline-variant/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h4 className="font-bold text-lg text-on-surface">중식 (식사)</h4>
          </div>
          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
            {lunch ? lunch.totalCalories : 0} kcal
          </span>
        </div>

        {lunch ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {lunch.dishes.map((dish, idx) => (
                <span key={idx} className="text-on-surface font-semibold text-sm">
                  {dish}{idx < lunch.dishes.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>

            {/* Allergies Highlight inside Lunch */}
            {lunchAllergies.length > 0 && (
              <div className="mt-1 p-3 bg-error-container/40 rounded-lg flex items-center gap-2 border border-error-container">
                <ShieldAlert className="w-4 h-4 text-error" />
                <span className="text-xs font-semibold text-on-error-container">
                  경고: 학생 알레르기 유발 성분 포함 ({lunchAllergies.join(', ')})
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/30">
              {lunch.allergens.map((allergy, idx) => {
                const isHarmful = profile.selectedAllergies.includes(allergy) && profile.allergyAlertEnabled;
                return (
                  <span 
                    key={idx} 
                    className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all duration-200 ${
                      isHarmful 
                        ? 'bg-error-container text-on-error-container border border-error animate-pulse' 
                        : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                    }`}
                  >
                    {allergy}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-on-surface-variant text-sm">등록된 식단이 없습니다.</p>
        )}
      </section>

      {/* Dinner Menu Detail Card */}
      <section className="bg-surface-container-lowest rounded-lg p-5 shadow-soft border border-outline-variant/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
            <h4 className="font-bold text-lg text-on-surface">석식 (기숙사/방과후)</h4>
          </div>
          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
            {dinner ? dinner.totalCalories : 0} kcal
          </span>
        </div>

        {dinner ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {dinner.dishes.map((dish, idx) => (
                <span key={idx} className="text-on-surface font-semibold text-sm">
                  {dish}{idx < dinner.dishes.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>

            {/* Allergies Highlight inside Dinner */}
            {dinnerAllergies.length > 0 && (
              <div className="mt-1 p-3 bg-error-container/40 rounded-lg flex items-center gap-2 border border-error-container">
                <ShieldAlert className="w-4 h-4 text-error" />
                <span className="text-xs font-semibold text-on-error-container">
                  경고: 학생 알레르기 유발 성분 포함 ({dinnerAllergies.join(', ')})
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-outline-variant/30">
              {dinner.allergens.map((allergy, idx) => {
                const isHarmful = profile.selectedAllergies.includes(allergy) && profile.allergyAlertEnabled;
                return (
                  <span 
                    key={idx} 
                    className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all duration-200 ${
                      isHarmful 
                        ? 'bg-error-container text-on-error-container border border-error animate-pulse' 
                        : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                    }`}
                  >
                    {allergy}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-on-surface-variant text-sm">등록된 식단이 없습니다.</p>
        )}
      </section>
    </motion.div>
  );
}
