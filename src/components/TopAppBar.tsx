import { Utensils, Bell, Calculator } from 'lucide-react';

interface TopAppBarProps {
  onNavToCalc?: () => void;
}

export default function TopAppBar({ onNavToCalc }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-5 h-16 w-full bg-surface/80 backdrop-blur-md border-b border-surface-container-highest/50 transition-all duration-200">
      <div className="flex items-center gap-2">
        <Utensils className="text-primary w-6 h-6 animate-pulse" />
        <h1 className="gmarket-font font-bold text-lg text-primary tracking-tight">
          씨마스고등학교 급식
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        {onNavToCalc && (
          <button 
            onClick={onNavToCalc}
            aria-label="영양계산 바로가기"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low active:scale-95 transition-all text-on-surface-variant"
          >
            <Calculator className="w-5 h-5" />
          </button>
        )}
        <button 
          aria-label="알림 확인"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low active:scale-95 transition-all text-on-surface-variant relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-bounce"></span>
        </button>
      </div>
    </header>
  );
}
