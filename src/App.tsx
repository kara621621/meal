/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { getTodayKST, getDefaultSelectedDate } from './utils/dateUtils';
import { generateMealsForWeek } from './data/mockMeals';
import { StudentProfile } from './types';
import TopAppBar from './components/TopAppBar';
import BottomNavBar from './components/BottomNavBar';
import HomeView from './components/HomeView';
import MealSchedulerView from './components/MealSchedulerView';
import NutritionCalcView from './components/NutritionCalcView';
import ProfileView from './components/ProfileView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'scheduler' | 'calc' | 'profile'>('home');

  // Today reference date in Asia/Seoul (KST)
  const [today] = useState<Date>(() => getTodayKST());

  // Week selection state for the scheduler, defaults to today (or upcoming Monday if weekend)
  const [selectedDate, setSelectedDate] = useState<Date>(() => getDefaultSelectedDate(getTodayKST()));

  // Dynamically generated week menus (Monday - Friday) based on the current week
  const [meals] = useState(() => generateMealsForWeek(getTodayKST()));

  // Central student state - allergies, push alert triggers, name, ID
  const [profile, setProfile] = useState<StudentProfile>({
    name: '김학생',
    grade: 2,
    classNum: 3,
    studentId: 15,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRTE3NxiMZTTTIqRKsZZ4A8HltVs8plSBeVi71BOI2JHxBMfnUheWkQj_7NhJJeO2XN4p6zb2rnLDWqszE_KoMgPGzMa0Hn87F3aY5BX4JSyZcLIQGUauiYTLhcViSgqOehSSMmex8Z8VYfp0eqW6M-DqSMfkdSYmmPOHMBBQSi6LDWMhtLKXQf4MuGTP6XgGcXp3y7ubFpJXQ8072Z7GBr__HAKmykDzZNF-Ur9amYJW91ePlq0Uywk8GXUV-LmuHPqhPqqn7RoTG',
    allergyAlertEnabled: true,
    selectedAllergies: ['우유', '땅콩'],
    dailyMealAlertEnabled: true,
    alertTime: '아침 8시'
  });

  return (
    <div className="w-full max-w-[420px] bg-background min-h-screen flex flex-col relative pb-32 shadow-2xl overflow-x-hidden min-h-screen mx-auto">
      {/* Shared Header bar */}
      <TopAppBar onNavToCalc={() => setActiveTab('calc')} />

      {/* Main View Shell */}
      <main className="flex-1 w-full pb-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <HomeView 
              key="home" 
              today={today} 
              meals={meals} 
              profile={profile} 
            />
          )}
          {activeTab === 'scheduler' && (
            <MealSchedulerView 
              key="scheduler"
              today={today} 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate} 
              meals={meals} 
              profile={profile} 
            />
          )}
          {activeTab === 'calc' && (
            <NutritionCalcView 
              key="calc" 
              today={today} 
              meals={meals} 
              profile={profile} 
            />
          )}
          {activeTab === 'profile' && (
            <ProfileView 
              key="profile" 
              profile={profile} 
              setProfile={setProfile} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Centered navigation bar */}
      <BottomNavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </div>
  );
}

