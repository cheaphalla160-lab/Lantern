/**
 * Speech Recognition and Pronunciation Evaluation for Primary School Students
 */

export interface SpeechEvaluationResult {
  transcript: string;
  isMatch: boolean;
  score: number; // 0 - 100
  stars: number; // 1, 2, or 3
  feedback: string;
}

export class SpeechEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      } catch (e) {
        console.warn('SpeechRecognition initialization error', e);
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public async startListening(
    targetAliases: string[],
    onResult: (result: SpeechEvaluationResult) => void,
    onError: (err: string) => void,
    onStart?: () => void
  ) {
    if (this.isListening) {
      this.stopListening();
    }

    if (!this.recognition) {
      onError('Browser does not support native speech recognition. Using practice mode.');
      return;
    }

    this.isListening = true;
    if (onStart) onStart();

    this.recognition.onresult = (event: any) => {
      this.isListening = false;
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const evaluation = this.evaluatePronunciation(transcript, targetAliases);
      onResult(evaluation);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || 'Speech recognition error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch {
      this.isListening = false;
      onError('Microphone permission required or already active');
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
    }
  }

  public evaluatePronunciation(
    transcript: string,
    targetAliases: string[]
  ): SpeechEvaluationResult {
    const cleanSpoken = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    // Check direct or partial match
    let bestScore = 0;
    for (const alias of targetAliases) {
      const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

      if (cleanSpoken === cleanAlias) {
        bestScore = 100;
        break;
      }
      if (cleanSpoken.includes(cleanAlias) || cleanAlias.includes(cleanSpoken)) {
        bestScore = Math.max(bestScore, 90);
      }

      // Check keyword overlap
      const spokenWords = cleanSpoken.split(/\s+/);
      const aliasWords = cleanAlias.split(/\s+/);
      const overlap = spokenWords.filter(w => aliasWords.includes(w)).length;
      if (overlap > 0) {
        const partial = Math.round((overlap / Math.max(spokenWords.length, aliasWords.length)) * 85);
        bestScore = Math.max(bestScore, partial);
      }
    }

    // Children positive encouragement scale
    let stars = 3;
    let feedback = 'Awesome! Perfect pronunciation! 🌟🌟🌟';
    const isMatch = bestScore >= 60;

    if (bestScore >= 85) {
      stars = 3;
      feedback = 'Superstar! Clear and crisp accent! 🌟🌟🌟';
    } else if (bestScore >= 60) {
      stars = 2;
      feedback = 'Great effort! Almost perfect! 🌟🌟';
    } else {
      stars = 1;
      feedback = 'Good try! Listen and repeat once more! 🌟';
    }

    return {
      transcript: transcript || '(Audio detected)',
      isMatch,
      score: bestScore,
      stars,
      feedback,
    };
  }
}

export const speechEngine = new SpeechEngine();
