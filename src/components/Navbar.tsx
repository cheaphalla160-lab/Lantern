import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface NavbarProps {
  currentTab: 'game' | 'flashcards';
  onSelectTab: (tab: 'game' | 'flashcards') => void;
  onOpenLeaderboard: () => void;
  onOpenTeacherToolbox: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLeaderboard,
  onOpenTeacherToolbox,
  isBgmPlaying,
  onToggleBgm,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 md:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl animate-float-slow">🏮</span>
          <span className="font-display font-extrabold text-lg md:text-xl text-red-600 tracking-tight whitespace-nowrap shrink-0">
            CNY English Word Drop
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onSelectTab('game')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-red-600 ${
              currentTab === 'game' ? 'text-red-600 border-b-2 border-red-600 pb-0.5' : ''
            }`}
          >
            落物游戏
          </button>

          <button
            onClick={() => onSelectTab('flashcards')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-red-600 ${
              currentTab === 'flashcards' ? 'text-red-600 border-b-2 border-red-600 pb-0.5' : ''
            }`}
          >
            单词闪卡
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-red-600"
          >
            班级龙虎榜
          </button>

          <button
            onClick={onOpenTeacherToolbox}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-red-600 flex items-center gap-1"
          >
            <span>备课工具箱</span>
            <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
              PRO
            </span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleBgm}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isBgmPlaying
                ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-300/40'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isBgmPlaying ? <Volume2 className="w-4 h-4 text-amber-700 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            <span className="whitespace-nowrap">{isBgmPlaying ? '音乐播放中' : '开启背景音乐'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
