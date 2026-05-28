import { ShieldAlert, Calendar, Smile, Pencil, Check, Heart, HelpCircle, Sun, Moon } from 'lucide-react';
import { MealData, StudentProfile } from '../types';
import { getWeekDates, getWeekOfMonth, formatDateKey, formatKoreanDate } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'motion/react';

interface MealSchedulerViewProps {
  key?: string | number;
  today: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  meals: MealData[];
  profile: StudentProfile;
}

export default function MealSchedulerView({
  today,
  selectedDate,
  setSelectedDate,
  meals,
  profile,
}: MealSchedulerViewProps) {
  // Get active week dates: Monday to Friday
  const weekDates = getWeekDates(today);
  const weekTitle = getWeekOfMonth(selectedDate);

  // Selected date key
  const selectedDateKey = formatDateKey(selectedDate);
  const displayedMeals = meals.filter(m => m.dateKey === selectedDateKey);

  const lunch = displayedMeals.find(m => m.mealType === '중식');
  const dinner = displayedMeals.find(m => m.mealType === '석식');

  const DAYS_KOREAN = ['일', '월', '화', '수', '목', '금', '토'] as const;

  // Track allergy presence for selected date
  const selectedAllergiesInLunch = lunch && profile.allergyAlertEnabled
    ? lunch.allergens.filter(a => profile.selectedAllergies.includes(a))
    : [];

  const selectedAllergiesInDinner = dinner && profile.allergyAlertEnabled
    ? dinner.allergens.filter(a => profile.selectedAllergies.includes(a))
    : [];

  const combinedAllergyAlert = Array.from(new Set([...selectedAllergiesInLunch, ...selectedAllergiesInDinner]));

  // Handling feedback submission simulation
  const handleFeedback = () => {
    alert('씨마스고등학교 급식소에 식단 선호도가 전달되었습니다! 맛있고 건강한 급식을 준비하겠습니다.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 px-5 pt-4 flex flex-col gap-6"
    >
      {/* Dynamic Header */}
      <section className="flex flex-col gap-1">
        <span className="font-semibold text-xs text-secondary tracking-wider uppercase">WEEKLY DIET PLAN</span>
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-on-surface gmarket-font tracking-tight">
            {weekTitle} 식단표
          </h2>
          <button 
            onClick={() => setSelectedDate(new Date(today))}
            className="flex items-center gap-1 text-primary-container px-3 py-1 bg-tertiary-fixed rounded-full hover:bg-tertiary-fixed-dim transition-colors text-xs font-semibold"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>오늘 급식</span>
          </button>
        </div>
      </section>

      {/* Dynamic Week Date Selector */}
      <section className="flex justify-between gap-2 py-2 border-b border-surface-container-high pb-4">
        {weekDates.map((dateObj, idx) => {
          const formattedKey = formatDateKey(dateObj);
          const isSelected = formattedKey === selectedDateKey;
          const label = DAYS_KOREAN[dateObj.getDay()];
          const isTodayMarker = formatDateKey(today) === formattedKey;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(dateObj)}
              className={`flex flex-col items-center justify-center flex-1 h-[72px] rounded-2xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow-lg ring-2 ring-primary-container select-none scale-105'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              <span className={`font-medium text-xs mb-1 ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                {label}
              </span>
              <span className="font-bold text-base leading-none">
                {dateObj.getDate()}
              </span>
              {isTodayMarker && !isSelected && (
                <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1 animate-ping"></span>
              )}
            </button>
          );
        })}
      </section>

      {/* Selected Date Summary Tag */}
      <div className="text-secondary text-sm font-semibold flex items-center gap-1.5 bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container-high/50">
        <Check className="w-4 h-4 text-primary" />
        <span>{formatKoreanDate(selectedDate)} 급식단표를 가져왔습니다</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDateKey}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Lunch Details */}
          <section className="bg-surface-container-lowest rounded-lg p-5 shadow-soft border border-outline-variant/30 flex flex-col gap-4 relative transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
                  <Sun className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">점심 급식 (LUNCH)</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{lunch ? lunch.title : '제공 메뉴 없음'}</p>
                </div>
              </div>
              <span className="text-xs font-bold leading-none bg-surface-container text-secondary px-3 py-2 rounded-full border border-surface-container-highest">
                {lunch ? lunch.totalCalories : 0} kcal
              </span>
            </div>

            {lunch ? (
              <>
                <div className="flex flex-wrap gap-x-2 gap-y-1 py-1">
                  {lunch.dishes.map((dish, i) => (
                    <span key={i} className="px-1.5 py-0.5 text-on-surface-variant text-sm font-semibold rounded-md">
                      {dish}{i < lunch.dishes.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>

                {selectedAllergiesInLunch.length > 0 ? (
                  <div className="bg-error-container/40 p-3 rounded-lg flex items-center gap-2 text-xs border border-error-container text-on-error-container">
                    <ShieldAlert className="w-4.5 h-4.5" />
                    <span>알레르기 경보: {selectedAllergiesInLunch.join(', ')} 유발 유입 우려가 있는 식단입니다</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {lunch.allergens.map((alg, i) => (
                      <span key={i} className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] px-2 py-0.5 rounded-md font-bold">
                        {alg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Protein bar display */}
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                    <span>단백질 하루 권장 달성률: {lunch.proteinPercentage || 85}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${lunch.proteinPercentage || 85}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-on-surface-variant text-sm leading-relaxed p-4 rounded-xl bg-surface-container/50 text-center border border-dashed border-outline-variant/30">
                주말 또는 학사 운영사정으로 오늘 급식일정이 없습니다.
              </p>
            )}
          </section>

          {/* Dinner Details */}
          <section className="bg-surface-container-lowest rounded-lg p-5 shadow-soft border border-outline-variant/30 flex flex-col gap-4 relative transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center">
                  <Moon className="w-5 h-5 text-on-surface-variant" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">저녁 급식 (DINNER)</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{dinner ? dinner.title : '제공 메뉴 없음'}</p>
                </div>
              </div>
              <span className="text-xs font-bold leading-none bg-surface-container text-secondary px-3 py-2 rounded-full border border-surface-container-highest">
                {dinner ? dinner.totalCalories : 0} kcal
              </span>
            </div>

            {dinner ? (
              <>
                <div className="flex flex-wrap gap-x-2 gap-y-1 py-1">
                  {dinner.dishes.map((dish, i) => (
                    <span key={i} className="px-1.5 py-0.5 text-on-surface-variant text-sm font-semibold rounded-md">
                      {dish}{i < dinner.dishes.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>

                {selectedAllergiesInDinner.length > 0 ? (
                  <div className="bg-error-container/40 p-3 rounded-lg flex items-center gap-2 text-xs border border-error-container text-on-error-container">
                    <ShieldAlert className="w-4.5 h-4.5" />
                    <span>알레르기 경보: {selectedAllergiesInDinner.join(', ')} 유발 유입 우려가 있는 식단입니다</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {dinner.allergens.map((alg, i) => (
                      <span key={i} className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] px-2 py-0.5 rounded-md font-bold">
                        {alg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Protein bar display */}
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                    <span>단백질 하루 권장 달성률: {dinner.proteinPercentage || 60}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-outline rounded-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${dinner.proteinPercentage || 60}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-on-surface-variant text-sm leading-relaxed p-4 rounded-xl bg-surface-container/50 text-center border border-dashed border-outline-variant/30">
                기숙사식 및 석식 정보가 없습니다.
              </p>
            )}
          </section>
        </motion.div>
      </AnimatePresence>

      {/* Info Bento Card Section */}
      <section className="grid grid-cols-2 gap-4">
        {/* Allergy Warning Box */}
        <div className="bg-primary-container/10 p-4 rounded-lg flex flex-col gap-1 border border-primary-container/20">
          <ShieldAlert className="w-6 h-6 text-primary-container" />
          <span className="text-xs font-medium text-primary-container mt-1">오늘의 알레르기 주의보</span>
          <span className="text-xs font-bold text-on-surface leading-snug">
            {profile.allergyAlertEnabled && combinedAllergyAlert.length > 0 ? (
              <span className="text-error font-extrabold">{combinedAllergyAlert.join(', ')} 주의!</span>
            ) : (
              <span>우유, 땅콩 안전함</span>
            )}
          </span>
        </div>

        {/* Satisfaction Survey Box */}
        <button 
          onClick={handleFeedback}
          className="bg-secondary-container/20 p-4 rounded-lg flex flex-col items-start gap-1 border border-secondary-container/30 hover:bg-secondary-container/30 transition-colors text-left"
        >
          <Smile className="w-6 h-6 text-secondary" />
          <span className="text-xs font-medium text-secondary mt-1">식단 만족도 조사</span>
          <span className="text-xs font-bold text-on-surface flex items-center gap-1">
            참여하기 <span className="text-xs text-secondary font-extrabold">&gt;</span>
          </span>
        </button>
      </section>

      {/* FAB Floating Action Button */}
      <button 
        onClick={() => {
          alert('식단에 특이사항 알리기를 작성할 수 있습니다. (전교회장 식의 의견 수렴용)');
        }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform duration-200 z-40 cursor-pointer"
        aria-label="식단 의견 건의하기"
      >
        <Pencil className="w-6 h-6" />
      </button>
    </motion.div>
  );
}
