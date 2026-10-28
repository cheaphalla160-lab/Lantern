import React, { useState, useEffect } from 'react';
import { Volume2, Mic, MicOff, Star, CheckCircle, ChevronRight, Snail, Rabbit } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CNYWord } from '../types';
import { CNYItemIcon } from './CNYItemIcon';
import { audioEngine } from '../utils/audioEngine';
import { speechEngine, SpeechEvaluationResult } from '../utils/speechRecognition';

interface RepeatModalProps {
  word: CNYWord;
  onComplete: (earnedScore: number) => void;
  onClose: () => void;
}

export const RepeatModal: React.FC<RepeatModalProps> = ({ word, onComplete, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeechEvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Automatically speak the word once when modal opens so child hears it first!
  useEffect(() => {
    setIsPlayingAudio(true);
    audioEngine.speak(word.word, {
      rate: 0.88,
      onEnd: () => setIsPlayingAudio(false),
    });

    return () => {
      audioEngine.cancelSpeech();
      speechEngine.stopListening();
    };
  }, [word]);

  const handlePlayAudio = (rate: number = 0.88) => {
    setIsPlayingAudio(true);
    audioEngine.speak(word.word, {
      rate,
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  const handleStartListening = () => {
    setErrorMsg(null);
    setIsListening(true);
    audioEngine.cancelSpeech();

    if (speechEngine.isSupported()) {
      speechEngine.startListening(
        word.aliases,
        (res) => {
          setIsListening(false);
          setEvaluation(res);
          setAttempts((prev) => prev + 1);

          if (res.stars >= 2) {
            audioEngine.playSuccessFanfare();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
            });
          }
        },
        (err) => {
          setIsListening(false);
          // Friendly fallback if mic not available
          setErrorMsg('Microphone not detected. You can practice out loud or click "I Repeated It!"');
        },
        () => {
          setIsListening(true);
        }
      );
    } else {
      // Simulate listening timer for browsers without SpeechRecognition
      setTimeout(() => {
        setIsListening(false);
        const autoResult: SpeechEvaluationResult = {
          transcript: word.word,
          isMatch: true,
          score: 95,
          stars: 3,
          feedback: 'Super loud and clear! Outstanding job! 🌟🌟🌟',
        };
        setEvaluation(autoResult);
        audioEngine.playSuccessFanfare();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#F59E0B', '#FCD34D'],
        });
      }, 1500);
    }
  };

  const handleCollectiveChantPass = () => {
    // Teacher manual award for whole-class unison shouting
    audioEngine.playSuccessFanfare();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#F59E0B', '#FDE047'],
    });

    const manualResult: SpeechEvaluationResult = {
      transcript: word.word,
      isMatch: true,
      score: 100,
      stars: 3,
      feedback: 'Wonderful whole-class chant! 3 Stars Awarded! 🌟🌟🌟',
    };
    setEvaluation(manualResult);
  };

  const handleDone = () => {
    const bonus = evaluation ? evaluation.stars * 50 : 50;
    onComplete(bonus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden text-center flex flex-col">
        {/* Decorative Top Festivity Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-600 py-3 px-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏮</span>
            <span className="font-display font-bold text-lg tracking-wide">
              跟读闯关 · Repeat & Learn
            </span>
          </div>
          <span className="text-xs bg-amber-400/30 text-amber-100 px-3 py-1 rounded-full font-medium">
            春节美食与吉祥物
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 flex flex-col items-center gap-4">
          {/* Item Graphic with Glow */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-amber-400 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-300" />
            <div className="relative bg-amber-50 p-3 rounded-2xl border-2 border-amber-200">
              <CNYItemIcon word={word} size="giant" showStickerImage={true} />
            </div>
          </div>

          {/* Word English and Phonetic */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
              {word.word}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-1.5 text-slate-500 text-sm font-medium">
              <span className="font-mono bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 text-slate-700">
                {word.phonetic}
              </span>
              <span>·</span>
              <span className="text-rose-600 font-bold text-base">{word.chinese}</span>
            </div>
            <p className="mt-2 text-xs md:text-sm text-amber-800 bg-amber-50/80 px-4 py-1.5 rounded-xl border border-amber-200/60 max-w-sm mx-auto">
              ✨ <strong className="text-red-700">文化寓意：</strong>{word.culturalSymbol} - {word.culturalDescription}
            </p>
          </div>

          {/* Audio Listen Buttons */}
          <div className="flex items-center justify-center gap-2 w-full pt-1">
            <button
              onClick={() => handlePlayAudio(0.88)}
              disabled={isPlayingAudio}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                isPlayingAudio
                  ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 active:scale-95'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? '播放中...' : '标准发音'}</span>
              <Rabbit className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            <button
              onClick={() => handlePlayAudio(0.7)}
              disabled={isPlayingAudio}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-all shadow-sm active:scale-95"
            >
              <Snail className="w-4 h-4 text-amber-600" />
              <span>慢速跟读</span>
            </button>
          </div>

          {/* Interactive Microphone & Repeat Zone */}
          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center gap-3">
            {!evaluation ? (
              <>
                <p className="text-xs font-semibold text-slate-500">
                  点击话筒对着麦克风大声朗读，挑战 3 颗金星！
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleStartListening}
                    disabled={isListening}
                    className={`relative flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-white shadow-md transition-all ${
                      isListening
                        ? 'bg-rose-500 ring-4 ring-rose-200 animate-pulse'
                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-95'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5 animate-spin" />
                        <span>倾听中... 大声读！</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>🎤 点击话筒开始跟读</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCollectiveChantPass}
                    title="全班齐读通过，免录音"
                    className="px-3.5 py-3 rounded-2xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                  >
                    ⭐ 全班齐读点赞
                  </button>
                </div>

                {errorMsg && (
                  <p className="text-xs text-amber-700 bg-amber-100/60 px-3 py-1 rounded-lg">
                    {errorMsg}
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-200">
                {/* Stars display */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 transition-all ${
                        star <= evaluation.stars
                          ? 'fill-amber-400 text-amber-500 scale-110 drop-shadow-sm'
                          : 'text-slate-300 fill-slate-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{evaluation.feedback}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    识别为: <span className="font-semibold text-slate-700 font-mono">"{evaluation.transcript}"</span> (评分: {evaluation.score}分)
                  </p>
                </div>

                <button
                  onClick={handleStartListening}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium underline mt-1"
                >
                  想要更高分？再试一次 🔄
                </button>
              </div>
            )}
          </div>

          {/* Continue / Action Button */}
          <div className="flex items-center justify-end w-full pt-2">
            <button
              onClick={handleDone}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-base hover:from-amber-400 hover:to-yellow-400 shadow-md active:scale-98 transition-all"
            >
              <span>继续抓福气 (+{evaluation ? evaluation.stars * 50 : 50}分)</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
