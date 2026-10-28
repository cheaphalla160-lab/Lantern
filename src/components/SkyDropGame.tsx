import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Award, Flame, Clock, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CNYWord, FallingItem, GameDifficulty, GameMode } from '../types';
import { CNY_WORDS } from '../data/cnyWords';
import { CNYItemIcon } from './CNYItemIcon';
import { RepeatModal } from './RepeatModal';
import { audioEngine } from '../utils/audioEngine';
import { saveLeaderboardEntry } from '../data/leaderboard';

interface SkyDropGameProps {
  currentStudent: {
    name: string;
    avatar: string;
    gradeGroup: string;
  };
  onOpenLeaderboard: () => void;
  onOpenFlashcards: () => void;
}

export const SkyDropGame: React.FC<SkyDropGameProps> = ({
  currentStudent,
  onOpenLeaderboard,
  onOpenFlashcards,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wordsCaughtCount, setWordsCaughtCount] = useState<Record<string, number>>({});
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const [gameMode, setGameMode] = useState<GameMode>('repeat_challenge');
  const [roundTimeLeft, setRoundTimeLeft] = useState(60);
  const [isTimerMode, setIsTimerMode] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Active repeat modal item
  const [activeRepeatWord, setActiveRepeatWord] = useState<CNYWord | null>(null);

  // Falling items pool
  const [items, setItems] = useState<FallingItem[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Difficulty speed configs
  const speedConfigs = {
    easy: { baseSpeed: 0.18, spawnInterval: 2200 },
    normal: { baseSpeed: 0.28, spawnInterval: 1700 },
    fast: { baseSpeed: 0.42, spawnInterval: 1200 },
  };

  // Start new round
  const startGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setIsGameOver(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setWordsCaughtCount({});
    setRoundTimeLeft(60);
    setItems([]);
    lastSpawnRef.current = performance.now();
    audioEngine.startBGM();
    audioEngine.playFirecracker();
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Spawn a falling Chinese New Year vocabulary item
  const spawnItem = useCallback(() => {
    const randomWord = CNY_WORDS[Math.floor(Math.random() * CNY_WORDS.length)];
    const config = speedConfigs[difficulty];

    const newItem: FallingItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      wordId: randomWord.id,
      word: randomWord,
      x: 8 + Math.random() * 74, // 8% to 82% from left
      y: -8, // start slightly above screen
      speed: config.baseSpeed + (Math.random() * 0.08 - 0.04),
      rotation: Math.random() * 20 - 10,
      rotationSpeed: (Math.random() - 0.5) * 0.4,
      scale: 0.95 + Math.random() * 0.15,
    };

    setItems((prev) => [...prev, newItem]);
  }, [difficulty]);

  // Main 60fps Game Loop
  useEffect(() => {
    if (!isPlaying || isPaused || activeRepeatWord || isGameOver) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      // Check spawn
      const config = speedConfigs[difficulty];
      if (currentTime - lastSpawnRef.current > config.spawnInterval) {
        spawnItem();
        lastSpawnRef.current = currentTime;
      }

      // Update falling items
      setItems((prevItems) => {
        const next: FallingItem[] = [];
        for (const item of prevItems) {
          const newY = item.y + item.speed * (delta / 16.6);
          const newRotation = item.rotation + item.rotationSpeed;

          // If fallen out of bounds without catch
          if (newY > 105) {
            // Drop combo if missed
            setCombo(0);
          } else {
            next.push({
              ...item,
              y: newY,
              rotation: newRotation,
            });
          }
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, isPaused, activeRepeatWord, isGameOver, difficulty, spawnItem]);

  // Round Timer countdown
  useEffect(() => {
    if (!isPlaying || isPaused || !isTimerMode || isGameOver) return;

    const timer = setInterval(() => {
      setRoundTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, isTimerMode, isGameOver]);

  // End Game
  const endGame = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    audioEngine.playSuccessFanfare();

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#DC2626', '#F59E0B', '#FBBF24', '#10B981'],
    });

    const totalCaught = Object.values(wordsCaughtCount).reduce((a, b) => a + b, 0);

    // Save score to classroom leaderboard
    saveLeaderboardEntry({
      studentName: currentStudent.name || 'Star Student 🌟',
      avatar: currentStudent.avatar || '🐲',
      score: score,
      accuracy: 95,
      comboMax: maxCombo,
      wordsCaught: totalCaught,
      gradeGroup: currentStudent.gradeGroup,
    });
  };

  // Catch item handler
  const handleCatchItem = (item: FallingItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeRepeatWord) return;

    audioEngine.playCatch();
    audioEngine.playCoin();

    // Trigger visual confetti burst at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x, y },
      colors: ['#F59E0B', '#EF4444', '#FBBF24', '#FFFFFF'],
    });

    // Remove item from falling list
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    // Update stats
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    if (nextCombo > maxCombo) setMaxCombo(nextCombo);

    // Calculate score: base 100 + combo bonus
    const comboBonus = Math.min(nextCombo * 15, 100);
    const addedScore = 100 + comboBonus;
    setScore((prev) => prev + addedScore);

    // Update count
    setWordsCaughtCount((prev) => ({
      ...prev,
      [item.word.id]: (prev[item.word.id] || 0) + 1,
    }));

    if (gameMode === 'repeat_challenge') {
      // Pause falling and open repeat modal
      setActiveRepeatWord(item.word);
    } else {
      // Arcade mode: quick native TTS
      audioEngine.speak(item.word.word, { rate: 0.9 });
    }
  };

  const handleRepeatComplete = (earnedBonus: number) => {
    setScore((prev) => prev + earnedBonus);
    setActiveRepeatWord(null);
  };

  const totalWordsCaught = Object.values(wordsCaughtCount).reduce((a, b) => a + b, 0);

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col gap-4">
      {/* Top HUD Game Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-amber-200/80 p-3 md:p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Player Profile & Grade */}
        <div className="flex items-center gap-3">
          <span className="text-3xl bg-amber-100 p-2 rounded-xl border border-amber-300 shadow-inner">
            {currentStudent.avatar}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-slate-900 text-lg">
                {currentStudent.name}
              </h3>
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                {currentStudent.gradeGroup}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
              <span>抓取数量: <strong className="text-slate-800 tabular-nums">{totalWordsCaught}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>连击: <strong className="text-amber-600 tabular-nums">{combo}x</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Score & Round Timer */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              当前得分
            </span>
            <span className="text-3xl md:text-4xl font-extrabold text-red-600 font-display tabular-nums tracking-tight">
              {score}
            </span>
          </div>

          {isTimerMode && (
            <div className="text-center border-l border-slate-200 pl-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 justify-center">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>倒计时</span>
              </span>
              <span
                className={`text-2xl md:text-3xl font-bold font-mono tabular-nums ${
                  roundTimeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-700'
                }`}
              >
                {roundTimeLeft}s
              </span>
            </div>
          )}
        </div>

        {/* Right: Controls & Sound */}
        <div className="flex items-center gap-2">
          {isPlaying && (
            <button
              onClick={handleTogglePause}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title={isPaused ? '继续' : '暂停'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-slate-700" /> : <Pause className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleToggleMute}
            className={`p-2.5 rounded-xl border transition-colors ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
            title={isMuted ? '开启音效与配乐' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-semibold text-xs transition-colors"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>班级排行榜</span>
          </button>
        </div>
      </div>

      {/* Main Sky Falling Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[540px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300/80 bg-gradient-to-b from-red-600 via-rose-500 to-amber-700 select-none cursor-pointer"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 10%, rgba(254, 243, 199, 0.45) 0%, transparent 60%),
            linear-gradient(to bottom, #DC2626 0%, #BE123C 60%, #9A3412 100%)
          `,
        }}
      >
        {/* Festive Hanging Lanterns Banner at Top */}
        <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10 flex justify-between px-6 opacity-90">
          <div className="animate-float-slow text-4xl">🏮</div>
          <div className="animate-float-slow delay-100 text-3xl">🌸</div>
          <div className="animate-float-slow delay-200 text-4xl">🏮</div>
          <div className="animate-float-slow delay-300 text-3xl">🌸</div>
          <div className="animate-float-slow delay-500 text-4xl">🏮</div>
        </div>

        {/* Ambient Floating Blossom Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-1/4 left-10 text-2xl animate-spin duration-1000">🌸</div>
          <div className="absolute top-1/2 right-16 text-xl animate-spin duration-1000">✨</div>
          <div className="absolute bottom-1/4 left-1/3 text-2xl">✨</div>
        </div>

        {/* Ground Festive Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-950/80 to-transparent pointer-events-none z-10 flex items-end justify-between px-8 pb-3 text-amber-200 text-xs font-medium">
          <span className="flex items-center gap-1.5 opacity-80">
            <span>🐉</span>
            <span>2026 欢度春节 · 趣味英语大课堂</span>
          </span>
          <span className="opacity-80">
            {gameMode === 'repeat_challenge' ? '💡 玩法：点击掉落食物 ➔ 开启智能跟读' : '⚡ 急速狂欢模式：点中即发音'}
          </span>
        </div>

        {/* Falling CNY Items */}
        {isPlaying && !isPaused && items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => handleCatchItem(item, e)}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              transition: 'transform 0.1s linear',
            }}
            className="group cursor-pointer active:scale-90 transition-transform duration-75 z-20"
          >
            {/* Adorable Falling Festive Bubble */}
            <div className="relative flex flex-col items-center p-2 rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-amber-300 shadow-xl group-hover:shadow-amber-400/50 group-hover:scale-105 transition-all">
              <CNYItemIcon word={item.word} size="lg" showStickerImage={true} />
              <span className="mt-1 font-display font-extrabold text-xs md:text-sm text-slate-800 tracking-tight whitespace-nowrap px-2 py-0.5 bg-amber-50 rounded-lg border border-amber-200">
                {item.word.word}
              </span>
              <span className="text-[10px] text-rose-600 font-bold">
                {item.word.chinese}
              </span>
            </div>
          </div>
        ))}

        {/* Start Game Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-300 flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-4xl shadow-inner border border-red-200 animate-bounce">
                🧨
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
                  福气掉落大挑战
                </h2>
                <p className="text-xs md:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  春节传统美食与吉祥物从天而降，快快点击抓住它，跟着老师一起大声跟读单词！
                </p>
              </div>

              {/* Game Settings */}
              <div className="w-full grid grid-cols-2 gap-3 text-left">
                {/* Mode Selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    教学模式
                  </span>
                  <div className="flex flex-col gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setGameMode('repeat_challenge')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        gameMode === 'repeat_challenge'
                          ? 'bg-white text-red-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🌟 点中即跟读 (推荐)
                    </button>
                    <button
                      onClick={() => setGameMode('arcade_rush')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        gameMode === 'arcade_rush'
                          ? 'bg-white text-red-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ⚡ 急速狂欢点读
                    </button>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    年级难度
                  </span>
                  <div className="flex flex-col gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setDifficulty('easy')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        difficulty === 'easy'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      一/二年级 (缓降)
                    </button>
                    <button
                      onClick={() => setDifficulty('normal')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        difficulty === 'normal'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      三/四年级 (适中)
                    </button>
                    <button
                      onClick={() => setDifficulty('fast')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        difficulty === 'fast'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      五/六年级 (挑战)
                    </button>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-lg hover:from-red-500 hover:to-rose-500 shadow-lg active:scale-98 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>开始游戏 Start Game</span>
              </button>

              <button
                onClick={onOpenFlashcards}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
              >
                先看一看 7 个春节重点单词 📖
              </button>
            </div>
          </div>
        )}

        {/* Paused Overlay */}
        {isPlaying && isPaused && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-amber-300 flex flex-col items-center gap-4 max-w-xs">
              <span className="text-4xl">⏸️</span>
              <h3 className="text-xl font-bold text-slate-900 font-display">游戏暂停中</h3>
              <p className="text-xs text-slate-500">老师可以借此机会为小朋友们做词汇讲解！</p>
              <button
                onClick={handleTogglePause}
                className="w-full py-2.5 px-6 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 shadow-md"
              >
                继续游戏 Resume
              </button>
            </div>
          </div>
        )}

        {/* Game Over / Victory Modal */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-40">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-amber-300 flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner border border-amber-300">
                🏆
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
                  恭喜通关！Happy New Year!
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  小朋友表现超级棒，词汇掌握得很熟练！
                </p>
              </div>

              {/* Stats Card */}
              <div className="w-full bg-amber-50/80 rounded-2xl p-4 border border-amber-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">总得分</span>
                  <span className="text-2xl font-extrabold text-red-600 font-display tabular-nums">
                    {score}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">识记单词</span>
                  <span className="text-2xl font-extrabold text-amber-700 font-display tabular-nums">
                    {totalWordsCaught}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block">最高连击</span>
                  <span className="text-2xl font-extrabold text-emerald-600 font-display tabular-nums">
                    {maxCombo}x
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={startGame}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 shadow-md active:scale-98 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>再玩一次</span>
                </button>

                <button
                  onClick={onOpenLeaderboard}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 shadow-md active:scale-98 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>查看龙虎榜</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Repeat Modal when an item is caught in repeat_challenge mode */}
      {activeRepeatWord && (
        <RepeatModal
          word={activeRepeatWord}
          onComplete={handleRepeatComplete}
          onClose={() => setActiveRepeatWord(null)}
        />
      )}
    </div>
  );
};
