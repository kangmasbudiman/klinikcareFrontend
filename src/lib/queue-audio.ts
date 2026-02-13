/**
 * Queue Audio Service
 * Handles text-to-speech announcements for queue calls
 */

export interface QueueAnnouncement {
  queueCode: string;
  counterNumber?: number | null;
  departmentName?: string;
}

class QueueAudioService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;
  private volume = 1;
  private rate = 0.9; // Slightly slower for clarity
  private pitch = 1;

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis;
      this.initVoice();
    }
  }

  /**
   * Initialize and find Indonesian voice
   */
  private initVoice(): void {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth!.getVoices();

      // Try to find Indonesian voice first
      this.voice =
        voices.find((v) => v.lang.startsWith("id") || v.lang.includes("ID")) ||
        null;

      // Fallback to any available voice
      if (!this.voice && voices.length > 0) {
        // Prefer female voice for announcements
        this.voice =
          voices.find((v) => v.name.toLowerCase().includes("female")) ||
          voices.find((v) => v.name.toLowerCase().includes("google")) ||
          voices[0];
      }

      this.isInitialized = true;
    };

    // Voices may load asynchronously
    if (this.synth.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Parse queue code to readable format
   * e.g., "A-001" -> "A nol nol satu"
   */
  private parseQueueCode(code: string): string {
    const numberWords: Record<string, string> = {
      "0": "nol",
      "1": "satu",
      "2": "dua",
      "3": "tiga",
      "4": "empat",
      "5": "lima",
      "6": "enam",
      "7": "tujuh",
      "8": "delapan",
      "9": "sembilan",
    };

    // Split by dash or any non-alphanumeric
    const parts = code.split(/[-\s]/);
    const result: string[] = [];

    for (const part of parts) {
      if (/^[A-Za-z]+$/.test(part)) {
        // Letter part - spell it out
        result.push(part.toUpperCase());
      } else if (/^\d+$/.test(part)) {
        // Number part - convert to words
        const digits = part.split("").map((d) => numberWords[d] || d);
        result.push(digits.join(" "));
      } else {
        result.push(part);
      }
    }

    return result.join(" ");
  }

  /**
   * Parse counter number to readable format
   */
  private parseCounterNumber(counter: number): string {
    const numberWords: Record<number, string> = {
      1: "satu",
      2: "dua",
      3: "tiga",
      4: "empat",
      5: "lima",
      6: "enam",
      7: "tujuh",
      8: "delapan",
      9: "sembilan",
      10: "sepuluh",
      11: "sebelas",
      12: "dua belas",
      13: "tiga belas",
      14: "empat belas",
      15: "lima belas",
    };

    return numberWords[counter] || counter.toString();
  }

  /**
   * Build announcement text
   */
  private buildAnnouncementText(announcement: QueueAnnouncement): string {
    const queueText = this.parseQueueCode(announcement.queueCode);

    let text = `Nomor antrian ${queueText}`;

    if (announcement.counterNumber) {
      const counterText = this.parseCounterNumber(announcement.counterNumber);
      text += `, silakan menuju loket ${counterText}`;
    }

    if (announcement.departmentName) {
      text += `, ${announcement.departmentName}`;
    }

    return text;
  }

  /**
   * Speak the announcement
   */
  speak(announcement: QueueAnnouncement): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      // Cancel any ongoing speech and wait a bit for it to clear
      this.synth.cancel();

      const text = this.buildAnnouncementText(announcement);
      const utterance = new SpeechSynthesisUtterance(text);

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.volume = this.volume;
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.lang = "id-ID";

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        // Handle "interrupted" error gracefully - this happens when speech is cancelled
        // which is expected behavior when calling synth.cancel()
        if (event.error === "interrupted" || event.error === "canceled") {
          console.log("Speech was interrupted/canceled, resolving gracefully");
          resolve();
          return;
        }
        // For other errors, reject
        console.error("Speech synthesis error:", event.error);
        reject(event.error);
      };

      // Play a chime sound before announcement
      this.playChime()
        .then(() => {
          // Small delay after chime
          setTimeout(() => {
            if (this.synth && !this.synth.speaking) {
              this.synth.speak(utterance);
            }
          }, 300);
        })
        .catch(() => {
          // If chime fails, just speak
          if (this.synth && !this.synth.speaking) {
            this.synth.speak(utterance);
          }
        });
    });
  }

  /**
   * Play a notification chime before announcement
   */
  private playChime(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.AudioContext) {
        resolve();
        return;
      }

      try {
        const audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();

        // Create a pleasant two-tone chime
        const playTone = (
          frequency: number,
          startTime: number,
          duration: number,
        ) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = frequency;
          oscillator.type = "sine";

          // Envelope for smooth sound
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };

        const now = audioContext.currentTime;

        // Two-tone chime (like hospital/airport announcements)
        playTone(523.25, now, 0.2); // C5
        playTone(659.25, now + 0.15, 0.3); // E5

        // Resolve after chime completes
        setTimeout(resolve, 500);
      } catch {
        resolve();
      }
    });
  }

  /**
   * Announce queue call with repeat option
   */
  async announce(
    announcement: QueueAnnouncement,
    repeat: number = 2,
  ): Promise<void> {
    for (let i = 0; i < repeat; i++) {
      try {
        await this.speak(announcement);
      } catch (error) {
        // Log but don't throw - allow subsequent repeats to continue
        console.warn(`Announcement attempt ${i + 1} failed:`, error);
      }
      if (i < repeat - 1) {
        // Pause between repeats
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set speech rate (0.1-2)
   */
  setRate(rate: number): void {
    this.rate = Math.max(0.1, Math.min(2, rate));
  }

  /**
   * Check if speech synthesis is supported
   */
  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Set specific voice
   */
  setVoice(voice: SpeechSynthesisVoice): void {
    this.voice = voice;
  }
}

// Singleton instance
const queueAudio = new QueueAudioService();

export default queueAudio;
