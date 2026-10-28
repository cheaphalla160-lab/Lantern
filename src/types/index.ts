export interface CNYWord {
  id: string;
  word: string;
  phonetic: string;
  chinese: string;
  pinyin?: string;
  culturalSymbol: string;
  culturalDescription: string;
  exampleSentence: string;
  sentenceChinese: string;
  image?: string;
  color: {
    bg: string;
    border: string;
    accent: string;
    light: string;
  };
  aliases: string[]; // alternative spoken variations e.g. "tangyuan", "sweet rice balls"
}

export interface FallingItem {
  id: string;
  wordId: string;
  word: CNYWord;
  x: number; // percentage (0 - 90%)
  y: number; // percentage (0 - 100%)
  speed: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  caught?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  avatar: string;
  score: number;
  accuracy: number;
  comboMax: number;
  wordsCaught: number;
  date: string;
  gradeGroup?: string;
}

export type GameDifficulty = 'easy' | 'normal' | 'fast';
export type GameMode = 'repeat_challenge' | 'arcade_rush'; // catch & repeat immediately vs fast arcade catch
