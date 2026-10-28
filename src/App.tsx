import React, { useState } from 'react';
import { Sparkles, Trophy, BookOpen, Volume2, Award, Heart, HelpCircle, GraduationCap } from 'lucide-react';
import { CNY_WORDS } from './data/cnyWords';
import { Navbar } from './components/Navbar';
import { SkyDropGame } from './components/SkyDropGame';
import { FlashcardsView } from './components/FlashcardsView';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherToolboxModal } from './components/TeacherToolboxModal';
import { CNYItemIcon } from './components/CNYItemIcon';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'game' | 'flashcards'>('game');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTeacherToolbox, setShowTeacherToolbox] = useState(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [quickSpokenId, setQuickSpokenId] = useState<string | null>(null);

  // Active student playing
  const [currentStudent, setCurrentStudent] = useState({
    name: 'Amy 🌟',
    avatar: '🐲',
    gradeGroup: 'Grade 3 (Class 1)',
  });

  const handleToggleBgm = () => {
    if (isBgmPlaying) {
      audioEngine.stopBGM();
      setIsBgmPlaying(false);
    } else {
      audioEngine.startBGM();
      setIsBgmPlaying(true);
    }
  };

  const handleQuickPronounce = (word: typeof CNY_WORDS[0]) => {
    setQuickSpokenId(word.id);
    audioEngine.playCoin();
    audioEngine.speak(word.word, {
      rate: 0.88,
      onEnd: () => setQuickSpokenId(null),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-red-50/20 to-amber-50/80 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Contract (1 line brand, 4 nav links, 1 action) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenTeacherToolbox={() => setShowTeacherToolbox(true)}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col gap-8">
        {/* Thematic Hero Classroom Welcome Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border-2 border-amber-300/80 bg-white">
          <div className="relative w-full h-48 md:h-64 overflow-hidden bg-red-700">
            <img
              src="/src/assets/images/cny_hero_banner_1793199315582.jpg"
              alt="Happy Chinese New Year Classroom"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-95"
            />
            {/* Subtle Gradient Scrim for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/85 via-red-900/35 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">🧧</span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  小学英语高频主题 · 重点词汇情境趣味通关
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-sm">
                Chinese New Year 欢乐大课堂 · 识词抓福气
              </h1>
              <p className="text-xs md:text-sm text-amber-100 max-w-2xl mt-1 leading-relaxed opacity-95">
                看食物飞落，点触听标准美音，麦克风智能跟读夺金星，快来加入班级龙虎榜！
              </p>
            </div>
          </div>

          {/* Quick-Tap Pronunciation Strip for all 7 Core Target Words */}
          <div className="bg-amber-50/80 border-t border-amber-200/60 p-3 md:p-4">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>7 个重点核心词汇一览 (点击卡片即可发音试听):</span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Dumplings · Fish · Tangyuan · Longevity noodles · Lucky money · Red lanterns · Fireworks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {CNY_WORDS.map((w) => {
                const isSpeakingThis = quickSpokenId === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => handleQuickPronounce(w)}
                    className={`group relative flex flex-col items-center p-2.5 rounded-2xl border transition-all text-center bg-white shadow-2xs hover:shadow-sm active:scale-95 ${
                      isSpeakingThis
                        ? 'border-red-500 ring-2 ring-red-400 bg-rose-50/50 scale-102'
                        : 'border-amber-200/80 hover:border-amber-300'
                    }`}
                  >
                    <CNYItemIcon word={w} size="sm" showStickerImage={true} />
                    <span className="mt-1.5 font-display font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors">
                      {w.word}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {w.chinese}
                    </span>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Volume2 className="w-3 h-3 text-red-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab View Switcher */}
        {currentTab === 'game' ? (
          <SkyDropGame
            currentStudent={currentStudent}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenFlashcards={() => setCurrentTab('flashcards')}
          />
        ) : (
          <FlashcardsView onBackToGame={() => setCurrentTab('game')} />
        )}

        {/* Bottom Classroom Assistant Banner */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-2xl shrink-0 shadow-inner border border-red-200">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                老师备课贴心助手 (Teacher's Prep Hub)
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-0.5 leading-relaxed">
                包含 7 个词汇的文化寓意深度精讲、配套新年英语韵律童谣 (Chant) 伴读，以及一键打印的随堂 Bingo 游戏纸。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowTeacherToolbox(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>打开备课工具箱</span>
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-all active:scale-95"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>排行榜管理</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-200/60 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            🏮 小学英语备课助手 · Chinese New Year Vocabulary Workshop & Game
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dumplings</span>
            <span>·</span>
            <span>Fish</span>
            <span>·</span>
            <span>Tangyuan</span>
            <span>·</span>
            <span>Longevity Noodles</span>
            <span>·</span>
            <span>Lucky Money</span>
            <span>·</span>
            <span>Red Lanterns</span>
            <span>·</span>
            <span>Fireworks</span>
          </div>
        </div>
      </footer>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          currentStudent={currentStudent}
          onSelectStudent={(student) => {
            setCurrentStudent(student);
            setShowLeaderboard(false);
          }}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Teacher Toolbox Modal */}
      {showTeacherToolbox && (
        <TeacherToolboxModal onClose={() => setShowTeacherToolbox(false)} />
      )}
    </div>
  );
}
