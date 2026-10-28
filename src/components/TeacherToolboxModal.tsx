import React, { useState } from 'react';
import { X, BookOpen, Music, Printer, Sparkles, Check, Play, Volume2 } from 'lucide-react';
import { CNY_WORDS, CNY_CHANT } from '../data/cnyWords';
import { audioEngine } from '../utils/audioEngine';

interface TeacherToolboxModalProps {
  onClose: () => void;
}

export const TeacherToolboxModal: React.FC<TeacherToolboxModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'chant' | 'lesson_plan' | 'printable'>('chant');
  const [playingLine, setPlayingLine] = useState<number | null>(null);

  const handlePlayChantLine = (line: { lineEn: string }, idx: number) => {
    setPlayingLine(idx);
    audioEngine.speak(line.lineEn, {
      rate: 0.85,
      pitch: 1.1,
      onEnd: () => setPlayingLine(null),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow-md">
              🍎
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-display tracking-tight">
                教师高级备课工具箱 · Teacher's Prep Deck
              </h2>
              <p className="text-xs text-amber-100 opacity-90">
                专为小学英语老师打造的备课教案、律动童谣与随堂互动资料
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-3 bg-amber-50/60 border-b border-amber-200 px-6">
          <button
            onClick={() => setActiveTab('chant')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chant'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>新年律动歌谣 (Chant)</span>
          </button>

          <button
            onClick={() => setActiveTab('lesson_plan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lesson_plan'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>教学目标与流程 (Lesson Plan)</span>
          </button>

          <button
            onClick={() => setActiveTab('printable')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'printable'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>打印词卡与Bingo游戏纸 (Printables)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'chant' && (
            <div className="flex flex-col gap-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-950 text-sm">
                    🎵 春节英语律动童谣 (Classroom CNY Chant)
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    朗朗上口的押韵小儿歌，串联全部 7 个重点词汇，非常适合课前热身或课后集体巩固！
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {CNY_CHANT.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
                  >
                    <div>
                      <p className="font-display font-extrabold text-base md:text-lg text-slate-900">
                        {line.lineEn}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {line.lineZh}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayChantLine(line, idx)}
                      disabled={playingLine === idx}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        playingLine === idx
                          ? 'bg-amber-400 text-slate-900 animate-pulse'
                          : 'bg-white text-rose-600 hover:bg-rose-50 border border-rose-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{playingLine === idx ? '朗读中' : '伴读'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lesson_plan' && (
            <div className="flex flex-col gap-5 text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>教学设计总览 (Course Objectives)</span>
                </h3>
                <ul className="text-xs space-y-1.5 leading-relaxed text-slate-600 list-disc list-inside">
                  <li><strong>语言能力：</strong>能够准确听、说、认读 7 个春节重点单词：Dumplings, fish, Tangyuan / sweet rice balls, Longevity noodles, lucky money, red lanterns, fireworks。</li>
                  <li><strong>文化意识：</strong>理解每个词汇背后承载的传统寓意（财富、有余、团圆、长寿、辟邪祈福、光明与迎新）。</li>
                  <li><strong>互动体验：</strong>利用互动掉落游戏调动全班积极性，通过视觉下落刺激、听觉标准音输入、麦克风跟读反馈，建立长效记忆。</li>
                </ul>
              </div>

              {/* 5-Step Lesson Flow */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  🎯 建议 40 分钟课堂教学五步法 (5-Step Classroom Flow)
                </h4>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-xs text-red-600 block mb-0.5">
                    Step 1 · Warm-up & Chant (5 mins) 热身激趣
                  </span>
                  <p className="text-xs text-slate-600">
                    播放背景音乐，展示新年教室氛围，全班一起拍手诵读《Classroom CNY Chant》，带出本课节日主题。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-xs text-red-600 block mb-0.5">
                    Step 2 · Flashcard Presentation (10 mins) 词汇与文化精讲
                  </span>
                  <p className="text-xs text-slate-600">
                    使用本工具的“大屏闪卡模式”，逐一展示 7 个单词，拆解音节与发音，利用慢速读音（🐢 0.7x）引导学生看口型跟读。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-xs text-red-600 block mb-0.5">
                    Step 3 · Sky Drop Game & Repeat Challenge (15 mins) 天空抓福气闯关
                  </span>
                  <p className="text-xs text-slate-600">
                    邀请学生上台在电子白板上点触掉落食物，触发智能跟读评分；台下全班同学同步齐读，赚取连击与积分，记录龙虎榜！
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-xs text-red-600 block mb-0.5">
                    Step 4 · Group Battle & Leaderboard (7 mins) 小组对抗与排行榜
                  </span>
                  <p className="text-xs text-slate-600">
                    分组（如红龙组 vs 猛虎组）进行限时 60 秒抢答识词，查看排行榜金银铜牌，评选“新春单词小达人”。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-bold text-xs text-red-600 block mb-0.5">
                    Step 5 · Wrap-up & Printable Bingo (3 mins) 总结与巩固
                  </span>
                  <p className="text-xs text-slate-600">
                    发放打印版 Bingo 游戏纸或单词卡片，布置新年家庭“向爸爸妈妈介绍春节美食英文”口语任务。
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'printable' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <div>
                  <h3 className="font-bold text-amber-950 text-sm">
                    🖨️ 课堂打印套件 (Printable Classroom Kit)
                  </h3>
                  <p className="text-xs text-amber-800">
                    支持一键排版打印，包含 7 个词汇剪角卡片与 3x3 Bingo 游戏纸。
                  </p>
                </div>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>立即打印 (Print)</span>
                </button>
              </div>

              {/* Printable preview grid */}
              <div className="p-6 bg-white border-2 border-dashed border-slate-300 rounded-2xl">
                <div className="text-center mb-4">
                  <h4 className="font-display font-extrabold text-xl text-slate-900">
                    🧧 Chinese New Year Vocabulary Bingo
                  </h4>
                  <p className="text-xs text-slate-500">
                    Name: ____________________ Class: _________ Score: _______
                  </p>
                </div>

                {/* 3x3 Grid */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {CNY_WORDS.map((w) => (
                    <div
                      key={w.id}
                      className="aspect-square p-2 border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50"
                    >
                      <span className="font-bold text-xs text-slate-800">{w.word}</span>
                      <span className="text-[10px] text-slate-500">{w.chinese}</span>
                    </div>
                  ))}
                  {/* Fill remaining with free space */}
                  <div className="aspect-square p-2 border-2 border-amber-300 bg-amber-50 rounded-xl flex flex-col items-center justify-center text-center">
                    <span className="font-bold text-xs text-amber-800">⭐ FREE</span>
                    <span className="text-[10px] text-amber-600">新年快乐!</span>
                  </div>
                  <div className="aspect-square p-2 border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50">
                    <span className="font-bold text-xs text-slate-800">Happy New Year</span>
                    <span className="text-[10px] text-slate-500">万事如意</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            完成备课 Close
          </button>
        </div>
      </div>
    </div>
  );
};
