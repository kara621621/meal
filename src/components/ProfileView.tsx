import React, { useState } from 'react';
import { Pencil, Bell, ChevronRight, LogOut, Check, Plus, X, AlertTriangle } from 'lucide-react';
import { StudentProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileViewProps {
  key?: string | number;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
}

export default function ProfileView({ profile, setProfile }: ProfileViewProps) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedGrade, setEditedGrade] = useState(profile.grade);
  const [editedClass, setEditedClass] = useState(profile.classNum);
  const [editedId, setEditedId] = useState(profile.studentId);
  
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [newAllergyName, setNewAllergyName] = useState('');

  const ALLERGY_PRESETS = ['우유', '땅콩', '대두', '밀', '쇠고기', '돼지고기', '닭고기', '난류', '토마토', '조개류'];

  const handleToggleAllergyAlert = (checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      allergyAlertEnabled: checked
    }));
  };

  const handleToggleMealAlert = (checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      dailyMealAlertEnabled: checked
    }));
  };

  const handleRemoveAllergy = (allergy: string) => {
    setProfile(prev => ({
      ...prev,
      selectedAllergies: prev.selectedAllergies.filter(item => item !== allergy)
    }));
  };

  const handleAddAllergy = (allergy: string) => {
    if (!allergy.trim()) return;
    if (profile.selectedAllergies.includes(allergy)) {
      alert('이미 알레르기 목록에 설정된 유발성분입니다.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      selectedAllergies: [...prev.selectedAllergies, allergy]
    }));
    setNewAllergyName('');
    setShowAddAllergy(false);
  };

  const handleSaveInfo = () => {
    if (!editedName.trim()) {
      alert('영문 또는 한글 이름을 바르게 기재해 주세요.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      name: editedName,
      grade: Number(editedGrade),
      classNum: Number(editedClass),
      studentId: Number(editedId)
    }));
    setIsEditingInfo(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 px-5 pt-4 flex flex-col gap-6"
    >
      {/* Student Profile Card (Gradient Ambient Card) */}
      <section className="profile-gradient p-6 rounded-lg relative shadow-[0px_10px_30px_rgba(79,111,0,0.05)] border border-white/20 transition-all">
        
        {isEditingInfo ? (
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-sm text-secondary tracking-wide">학생 프로필 수정</h3>
            <div className="space-y-1.5">
              <label className="text-xs text-on-surface-variant font-medium">이름</label>
              <input 
                type="text" 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full bg-white/70 backdrop-blur border border-outline-variant/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-on-surface-variant font-medium">학년</label>
                <input 
                  type="number" 
                  value={editedGrade} 
                  onChange={(e) => setEditedGrade(Number(e.target.value))}
                  className="w-full bg-white/70 backdrop-blur border border-outline-variant/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium">반</label>
                <input 
                  type="number" 
                  value={editedClass} 
                  onChange={(e) => setEditedClass(Number(e.target.value))}
                  className="w-full bg-white/70 backdrop-blur border border-outline-variant/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium">번호</label>
                <input 
                  type="number" 
                  value={editedId} 
                  onChange={(e) => setEditedId(Number(e.target.value))}
                  className="w-full bg-white/70 backdrop-blur border border-outline-variant/50 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveInfo}
              className="mt-2 bg-primary text-white py-2 rounded-lg text-xs font-bold w-full shadow-sm flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform"
            >
              <Check className="w-3.5 h-3.5" /> 저장 및 적용하기
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => setIsEditingInfo(true)}
              className="absolute top-4 right-4 p-2.5 bg-white/60 backdrop-blur-sm rounded-full text-primary transition-all active:scale-95 cursor-pointer hover:bg-white"
              aria-label="학적정보 고치기"
            >
              <Pencil className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-3 select-none">
                <img 
                  alt="학생 김학생의 깔끔한 단복 프로필 사진" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                  src={profile.avatarUrl}
                />
              </div>
              <h2 className="font-bold text-xl text-on-surface gmarket-font">{profile.name}</h2>
              <p className="text-sm font-medium text-on-surface-variant mt-1">
                {profile.grade}학년 {profile.classNum}반 {profile.studentId}번
              </p>
            </div>
          </>
        )}
      </section>

      {/* Settings Section: Allergies */}
      <section className="bg-white rounded-lg p-5 shadow-[0px_10px_30px_rgba(79,111,0,0.05)] border border-surface-container-high transition-all">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            알레르기 경고 알림
          </h3>
          <label className="custom-toggle">
            <input 
              type="checkbox" 
              checked={profile.allergyAlertEnabled}
              onChange={(e) => handleToggleAllergyAlert(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
          급식 메뉴에 설정된 알레르기 유발 성분이 포함되어 있을 경우, 홈 화면 및 식단표에서 빨간색 경보로 강조하여 보호합니다.
        </p>

        <TransitionGroupWrap>
          <div className="flex flex-wrap gap-2">
            {profile.selectedAllergies.map((allergy, index) => (
              <span 
                key={index} 
                className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-outline-variant"
              >
                {allergy}
                <button 
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="text-on-tertiary-fixed-variant/70 hover:text-error transition-colors p-0.5 rounded-full cursor-pointer"
                  aria-label={`${allergy} 알레르기 성분 제거`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            <button 
              onClick={() => setShowAddAllergy(!showAddAllergy)}
              className="bg-surface-container text-primary px-3 py-1 rounded-full text-xs font-bold border border-dashed border-primary/30 flex items-center gap-1 hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" /> 추가
            </button>
          </div>
        </TransitionGroupWrap>

        <AnimatePresence>
          {showAddAllergy && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col gap-2 overflow-hidden"
            >
              <p className="text-xs font-bold text-secondary mb-1">성분 선택 또는 직접 작성</p>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGY_PRESETS.filter(item => !profile.selectedAllergies.includes(item)).map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddAllergy(preset)}
                    className="bg-white hover:bg-tertiary-fixed text-[11px] px-2.5 py-1 rounded-lg border border-outline-variant/50 cursor-pointer active:scale-95 transition-transform"
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  value={newAllergyName}
                  placeholder="예: 조개, 메밀, 새우"
                  onChange={(e) => setNewAllergyName(e.target.value)}
                  className="flex-1 bg-white border border-outline-variant/70 rounded-lg p-1.5 text-xs focus:outline-none"
                />
                <button 
                  onClick={() => handleAddAllergy(newAllergyName)}
                  className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform cursor-pointer"
                >
                  기입
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Settings Section: Notifications */}
      <section className="bg-white rounded-lg p-5 shadow-[0px_10px_30px_rgba(79,111,0,0.05)] border border-surface-container-high transition-all">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            일일 식단 알림
          </h3>
          <label className="custom-toggle">
            <input 
              type="checkbox" 
              checked={profile.dailyMealAlertEnabled}
              onChange={(e) => handleToggleMealAlert(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <p className="text-xs text-on-surface-variant">매일 아침 8시에 오늘의 메뉴가 알람 창으로 찾아갑니다.</p>
      </section>

      {/* Links Section */}
      <section className="bg-white rounded-lg overflow-hidden shadow-[0px_10px_30px_rgba(79,111,0,0.05)] border border-surface-container-high divide-y divide-surface-container-high">
        <button 
          onClick={() => alert('카카오 오픈채팅방 또는 학부모 건의 게시판에 연결할 수 있습니다.')}
          className="w-full px-5 py-4 flex justify-between items-center hover:bg-surface-container-low transition-colors group cursor-pointer"
        >
          <span className="text-sm font-semibold text-on-surface">고객센터 / 문의하기</span>
          <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => alert('본 정보시스템은 씨마스고등학교 영양사회와 학생회의 협력 하에 지원됩니다.')}
          className="w-full px-5 py-4 flex justify-between items-center hover:bg-surface-container-low transition-colors group cursor-pointer"
        >
          <span className="text-sm font-semibold text-on-surface">이용약관 및 권리 안내</span>
          <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => alert('식당 모드를 나갑니다. 재전송 또는 로컬 로그아웃 처리가 완료되었습니다.')}
          className="w-full px-5 py-4 flex justify-between items-center hover:bg-error-container/20 transition-colors group cursor-pointer"
        >
          <span className="text-sm font-semibold text-error">로그아웃</span>
          <LogOut className="w-4 h-4 text-error opacity-70" />
        </button>
      </section>

      {/* Academic Footer */}
      <footer className="text-center py-6 space-y-1 pb-12">
        <p className="text-xs text-outline">© 2026 씨마스고등학교 급식실</p>
        <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">
          본 애플리케이션은 한국 청소년 영양 섭취 기준량을 충족하도록 설계되었습니다.
        </p>
      </footer>
    </motion.div>
  );
}

// Inline helper for chip transition box wrapping
function TransitionGroupWrap({ children }: { children: React.ReactNode }) {
  return <div className="p-0.5">{children}</div>;
}
