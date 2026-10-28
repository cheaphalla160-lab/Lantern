import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, BookOpen, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { CNY_WORDS } from '../data/cnyWords';
import { CNYItemIcon } from './CNYItemIcon';
import { audioEngine } from '../utils/audioEngine';

interface FlashcardsViewProps {
  onBackToGame: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onBackToGame }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentWord = CNY_WORDS[currentIndex];

  const handleSpeak = (rate: number = 0.88) => {
    setIsSpeaking(true);
    audioEngine.speak(currentWord.word, {
      rate,
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : CNY_WORDS.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < CNY_WORDS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Top Bar for Flashcard Mode */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-amber-200 shadow-sm">
        <button
          onClick={onBackToGame}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回天空掉落游戏 (Back to Game)</span>
        </button>

        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-red-600" />
          <h2 className="font-display font-bold text-slate-900 text-sm md:text-base">
            新春词汇大屏闪卡 (Flashcards Showcase)
          </h2>
        </div>

        <div className="text-xs font-mono font-bold text-slate-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
          {currentIndex + 1} / {CNY_WORDS.length}
        </div>
      </div>

      {/* Main Flashcard Card */}
      <div className="relative bg-white rounded-3xl shadow-xl border-4 border-amber-300 overflow-hidden p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 min-h-[420px]">
        {/* Left Side: Big Visual & Sticker */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-200/80 shadow-inner">
          <CNYItemIcon word={currentWord} size="giant" showStickerImage={true} />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-bold text-rose-700 bg-white px-3 py-1 rounded-full border border-rose-200 shadow-2xs">
              {currentWord.chinese}
            </span>
            <span className="text-xs text-amber-800 font-medium">
              ({currentWord.pinyin})
            </span>
          </div>
        </div>

        {/* Right Side: Vocabulary & Cultural Meaning */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Chinese New Year Focus Word</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
              {currentWord.word}
            </h1>

            <div className="inline-block mt-2 font-mono text-sm md:text-base bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
              {currentWord.phonetic}
            </div>
          </div>

          {/* Pronunciation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSpeak(0.88)}
              disabled={isSpeaking}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all ${
                isSpeaking
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-500'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 active:scale-95'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? '正在朗读...' : '朗读读音 (Standard)'}</span>
            </button>

            <button
              onClick={() => handleSpeak(0.68)}
              disabled={isSpeaking}
              className="px-4 py-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold text-xs transition-colors"
            >
              慢速 🐢
            </button>
          </div>

          {/* Cultural Symbolism */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
              <span>🧧</span>
              <span>文化象征与新年寄寓 (Cultural Symbolism):</span>
            </h4>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              <strong>{currentWord.culturalSymbol}</strong>：{currentWord.culturalDescription}
            </p>
          </div>

          {/* Classroom Example Sentence */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-1">
              <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>课堂例句 (Classroom Sentence):</span>
            </h4>
            <p className="text-xs md:text-sm font-medium text-slate-900 italic">
              "{currentWord.exampleSentence}"
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentWord.sentenceChinese}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Slider Buttons */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 font-bold text-sm border border-amber-200 shadow-sm active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>上一个 (Previous)</span>
        </button>

        {/* Thumbnail Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {CNY_WORDS.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => setCurrentIndex(idx)}
              className={`p-1.5 rounded-xl border transition-all ${
                currentIndex === idx
                  ? 'bg-amber-100 border-red-500 scale-110 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100'
              }`}
            >
              <CNYItemIcon word={w} size="sm" showStickerImage={true} />
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 font-bold text-sm border border-amber-200 shadow-sm active:scale-95 transition-all"
        >
          <span>下一个 (Next)</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
