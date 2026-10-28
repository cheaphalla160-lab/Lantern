import React, { useState } from 'react';
import { Trophy, Medal, Star, X, RotateCcw, UserPlus, Flame, Search } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard, resetLeaderboard, saveLeaderboardEntry } from '../data/leaderboard';

interface LeaderboardModalProps {
  onClose: () => void;
  onSelectStudent: (student: { name: string; avatar: string; gradeGroup: string }) => void;
  currentStudent: { name: string; avatar: string; gradeGroup: string };
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  onSelectStudent,
  currentStudent,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(getLeaderboard());
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('🐲');
  const [newGrade, setNewGrade] = useState('Grade 3 (Class 1)');

  const avatars = ['🐲', '🦁', '🐼', '🐯', '🏮', '🥟', '🌸', '🚀', '🌟', '🎏'];
  const gradeOptions = [
    'Grade 1 (一年级)',
    'Grade 2 (二年级)',
    'Grade 3 (Class 1)',
    'Grade 3 (Class 2)',
    'Grade 4 (Class 1)',
    'Grade 5 (Class 1)',
    'Dragon Team 🐉 (红龙组)',
    'Tiger Team 🐯 (猛虎组)',
  ];

  const handleReset = () => {
    if (window.confirm('确定要重置班级排行榜吗？')) {
      const reset = resetLeaderboard();
      setEntries(reset);
    }
  };

  const handleCreateNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onSelectStudent({
      name: newName.trim(),
      avatar: newAvatar,
      gradeGroup: newGrade,
    });

    setIsAddingNew(false);
  };

  const filteredEntries = entries.filter(
    (item) =>
      item.studentName.toLowerCase().includes(search.toLowerCase()) ||
      (item.gradeGroup && item.gradeGroup.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow-md">
              <Trophy className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-display tracking-tight">
                小小龙腾虎跃排行榜 · Hall of Fame
              </h2>
              <p className="text-xs text-amber-100 opacity-90">
                记录小朋友们的单词抓取与跟读闪耀战绩
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Challenger Card */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">当前上台挑战学生:</span>
            <span className="text-xl">{currentStudent.avatar}</span>
            <span className="font-bold text-slate-800 text-sm">{currentStudent.name}</span>
            <span className="text-xs bg-white text-rose-700 px-2 py-0.5 rounded-md border border-amber-200">
              {currentStudent.gradeGroup}
            </span>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isAddingNew ? '取消切换' : '切换/新增学生'}</span>
          </button>
        </div>

        {/* New Student Form */}
        {isAddingNew && (
          <form
            onSubmit={handleCreateNewStudent}
            className="p-5 bg-rose-50/70 border-b border-rose-200 flex flex-col gap-3 animate-in slide-in-from-top-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  学生姓名或小组名 (Student / Group Name)
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如: Cindy 🌸, Jack 🚀, 第1大组..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-400 bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  所在班级 / 分组
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-400 bg-white"
                >
                  {gradeOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                选择吉祥物头像
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                      newAvatar === av
                        ? 'bg-amber-300 border-2 border-red-600 scale-110 shadow-sm'
                        : 'bg-white border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
              >
                保存并设为当前选手
              </button>
            </div>
          </form>
        )}

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索学生或班级..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-red-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              共 <strong className="text-slate-800 tabular-nums">{filteredEntries.length}</strong> 位上榜选手
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
          {filteredEntries.map((entry, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all border ${
                  isTop1
                    ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                    : isTop2
                    ? 'bg-slate-50 border-slate-300'
                    : isTop3
                    ? 'bg-orange-50/60 border-orange-200'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Rank & Student */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center font-bold text-sm">
                    {isTop1 ? (
                      <span className="text-2xl drop-shadow-xs">🥇</span>
                    ) : isTop2 ? (
                      <span className="text-2xl drop-shadow-xs">🥈</span>
                    ) : isTop3 ? (
                      <span className="text-2xl drop-shadow-xs">🥉</span>
                    ) : (
                      <span className="text-slate-400 font-mono">#{index + 1}</span>
                    )}
                  </div>

                  <span className="text-2xl">{entry.avatar}</span>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">
                      {entry.studentName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{entry.gradeGroup || 'Grade 3'}</span>
                      <span>·</span>
                      <span>{entry.date}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Combo */}
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block text-slate-500 text-xs">
                    <span className="flex items-center gap-1 justify-end font-medium">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <strong className="tabular-nums text-slate-700">{entry.comboMax}x</strong> 连击
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      识词 {entry.wordsCaught} 个
                    </span>
                  </div>

                  <div className="w-24">
                    <span className="text-xl md:text-2xl font-extrabold text-red-600 font-display tabular-nums block">
                      {entry.score}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                      Points
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>清空榜单 (下个班级教学)</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            关闭 Return to Game
          </button>
        </div>
      </div>
    </div>
  );
};
