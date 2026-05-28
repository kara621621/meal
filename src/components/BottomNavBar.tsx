import { Home, CalendarDays, Calculator, User } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: 'home' | 'scheduler' | 'calc' | 'profile';
  setActiveTab: (tab: 'home' | 'scheduler' | 'calc' | 'profile') => void;
}

export default function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'scheduler', label: '식단표', icon: CalendarDays },
    { id: 'calc', label: '영양계산', icon: Calculator },
    { id: 'profile', label: '프로필', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-around items-center px-4 pb-4 pt-2 w-full max-w-[420px] bg-surface-container dark:bg-surface-container-lowest shadow-[0px_-10px_30px_rgba(79,111,0,0.05)] rounded-t-lg z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 scale-100 active:scale-95 transition-all duration-200 rounded-xl ${
              isActive
                ? 'bg-primary-container text-on-primary-container shadow-md font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-highest/50'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="font-label-sm text-xs">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
