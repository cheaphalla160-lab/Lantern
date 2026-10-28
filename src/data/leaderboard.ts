import { LeaderboardEntry } from '../types';

const STORAGE_KEY = 'cny_english_leaderboard_v1';

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'entry-1',
    studentName: 'Amy 🌟 (Star)',
    avatar: '🐲',
    score: 1850,
    accuracy: 100,
    comboMax: 8,
    wordsCaught: 14,
    date: '2026-02-12',
    gradeGroup: 'Grade 3 (Class 1)',
  },
  {
    id: 'entry-2',
    studentName: 'Leo 🦁 (Lion)',
    avatar: '🦁',
    score: 1620,
    accuracy: 94,
    comboMax: 6,
    wordsCaught: 12,
    date: '2026-02-12',
    gradeGroup: 'Grade 3 (Class 1)',
  },
  {
    id: 'entry-3',
    studentName: 'Dragon Team 🐉 (Group A)',
    avatar: '🏮',
    score: 1480,
    accuracy: 92,
    comboMax: 5,
    wordsCaught: 11,
    date: '2026-02-12',
    gradeGroup: 'Grade 4 (Class 2)',
  },
  {
    id: 'entry-4',
    studentName: 'Emily 🌸 (Panda)',
    avatar: '🐼',
    score: 1290,
    accuracy: 89,
    comboMax: 4,
    wordsCaught: 10,
    date: '2026-02-11',
    gradeGroup: 'Grade 3 (Class 2)',
  },
  {
    id: 'entry-5',
    studentName: 'Tiger Team 🐯 (Group B)',
    avatar: '🐯',
    score: 1100,
    accuracy: 85,
    comboMax: 4,
    wordsCaught: 9,
    date: '2026-02-11',
    gradeGroup: 'Grade 4 (Class 2)',
  },
];

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => b.score - a.score);
      }
    }
  } catch (e) {
    console.error('Failed to read leaderboard from localStorage', e);
  }
  return INITIAL_LEADERBOARD;
};

export const saveLeaderboardEntry = (entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] => {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `entry-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
  };

  const updated = [...current, newEntry].sort((a, b) => b.score - a.score).slice(0, 30); // Top 30

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save leaderboard to localStorage', e);
  }

  return updated;
};

export const resetLeaderboard = (): LeaderboardEntry[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
  } catch (e) {
    console.error('Failed to reset leaderboard', e);
  }
  return INITIAL_LEADERBOARD;
};
