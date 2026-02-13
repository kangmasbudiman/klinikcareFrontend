// Notification Sound Utility
// Uses Web Audio API to generate notification sounds

type SoundType = "notification" | "success" | "warning" | "error";
type RingtoneType = "chime" | "bell" | "ding" | "alert" | "soft" | "urgent";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  delay?: number;
}

// Ringtone presets - lebih keras dan jelas
const RINGTONE_CONFIGS: Record<RingtoneType, SoundConfig[]> = {
  // Chime - seperti doorbell, 3 nada naik
  chime: [
    { frequency: 659.25, duration: 0.15, type: "sine", volume: 0.8, delay: 0 },
    {
      frequency: 783.99,
      duration: 0.15,
      type: "sine",
      volume: 0.8,
      delay: 0.15,
    },
    {
      frequency: 987.77,
      duration: 0.25,
      type: "sine",
      volume: 0.9,
      delay: 0.3,
    },
  ],
  // Bell - seperti lonceng gereja
  bell: [
    { frequency: 830.61, duration: 0.5, type: "sine", volume: 0.9, delay: 0 },
    { frequency: 830.61, duration: 0.5, type: "sine", volume: 0.7, delay: 0.6 },
    { frequency: 830.61, duration: 0.5, type: "sine", volume: 0.5, delay: 1.2 },
  ],
  // Ding - single ding yang jelas
  ding: [
    { frequency: 1318.51, duration: 0.1, type: "sine", volume: 1.0, delay: 0 },
    {
      frequency: 1567.98,
      duration: 0.4,
      type: "sine",
      volume: 0.8,
      delay: 0.1,
    },
  ],
  // Alert - urgent alert sound
  alert: [
    { frequency: 880, duration: 0.15, type: "square", volume: 0.7, delay: 0 },
    { frequency: 880, duration: 0.15, type: "square", volume: 0.7, delay: 0.2 },
    {
      frequency: 1100,
      duration: 0.15,
      type: "square",
      volume: 0.7,
      delay: 0.4,
    },
    {
      frequency: 1100,
      duration: 0.15,
      type: "square",
      volume: 0.7,
      delay: 0.6,
    },
    {
      frequency: 1320,
      duration: 0.25,
      type: "square",
      volume: 0.8,
      delay: 0.8,
    },
  ],
  // Soft - lembut tapi masih terdengar
  soft: [
    { frequency: 523.25, duration: 0.25, type: "sine", volume: 0.6, delay: 0 },
    {
      frequency: 659.25,
      duration: 0.25,
      type: "sine",
      volume: 0.6,
      delay: 0.25,
    },
    {
      frequency: 783.99,
      duration: 0.35,
      type: "sine",
      volume: 0.6,
      delay: 0.5,
    },
  ],
  // Urgent - untuk notifikasi penting
  urgent: [
    {
      frequency: 1000,
      duration: 0.12,
      type: "sawtooth",
      volume: 0.8,
      delay: 0,
    },
    {
      frequency: 1200,
      duration: 0.12,
      type: "sawtooth",
      volume: 0.8,
      delay: 0.15,
    },
    {
      frequency: 1000,
      duration: 0.12,
      type: "sawtooth",
      volume: 0.8,
      delay: 0.3,
    },
    {
      frequency: 1200,
      duration: 0.12,
      type: "sawtooth",
      volume: 0.8,
      delay: 0.45,
    },
    {
      frequency: 1400,
      duration: 0.25,
      type: "sawtooth",
      volume: 0.9,
      delay: 0.6,
    },
  ],
};

// Legacy sound types mapping
const SOUND_CONFIGS: Record<SoundType, SoundConfig[]> = {
  notification: RINGTONE_CONFIGS.chime,
  success: RINGTONE_CONFIGS.soft,
  warning: RINGTONE_CONFIGS.alert,
  error: RINGTONE_CONFIGS.urgent,
};

// Ringtone labels untuk UI
export const RINGTONE_OPTIONS: { value: RingtoneType; label: string }[] = [
  { value: "chime", label: "Chime (Default)" },
  { value: "bell", label: "Bell" },
  { value: "ding", label: "Ding" },
  { value: "alert", label: "Alert" },
  { value: "soft", label: "Soft" },
  { value: "urgent", label: "Urgent" },
];

class NotificationSound {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.8; // Default volume lebih tinggi
  private ringtone: RingtoneType = "chime";
  private repeatInterval: NodeJS.Timeout | null = null;
  private isRepeating: boolean = false;
  private repeatDelay: number = 5000; // Repeat setiap 5 detik

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSettings();
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.audioContext) {
      try {
        this.audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      } catch (error) {
        console.error("Web Audio API not supported:", error);
        return null;
      }
    }
    return this.audioContext;
  }

  private loadSettings() {
    try {
      const settings = localStorage.getItem("notification_sound_settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        this.enabled = parsed.enabled ?? true;
        this.volume = parsed.volume ?? 0.8;
        this.ringtone = parsed.ringtone ?? "chime";
      }
    } catch (error) {
      console.error("Error loading sound settings:", error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem(
        "notification_sound_settings",
        JSON.stringify({
          enabled: this.enabled,
          volume: this.volume,
          ringtone: this.ringtone,
        }),
      );
    } catch (error) {
      console.error("Error saving sound settings:", error);
    }
  }

  async play(type: SoundType = "notification"): Promise<void> {
    if (!this.enabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (required for autoplay policy)
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (error) {
        console.error("Error resuming audio context:", error);
        return;
      }
    }

    // Use selected ringtone for notification type
    const configs =
      type === "notification"
        ? RINGTONE_CONFIGS[this.ringtone]
        : SOUND_CONFIGS[type];

    const baseTime = ctx.currentTime;

    for (const config of configs) {
      const startTime = baseTime + (config.delay || 0);

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, startTime);

      // Smooth envelope for better sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(
        config.volume * this.volume,
        startTime + 0.02,
      );
      // Hold the note
      gainNode.gain.setValueAtTime(
        config.volume * this.volume,
        startTime + config.duration * 0.7,
      );
      // Fade out
      gainNode.gain.linearRampToValueAtTime(0, startTime + config.duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + config.duration + 0.1);
    }
  }

  // Play specific ringtone (for preview)
  async playRingtone(ringtone: RingtoneType): Promise<void> {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (error) {
        console.error("Error resuming audio context:", error);
        return;
      }
    }

    const configs = RINGTONE_CONFIGS[ringtone];
    const baseTime = ctx.currentTime;

    for (const config of configs) {
      const startTime = baseTime + (config.delay || 0);

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(
        config.volume * this.volume,
        startTime + 0.02,
      );
      gainNode.gain.setValueAtTime(
        config.volume * this.volume,
        startTime + config.duration * 0.7,
      );
      gainNode.gain.linearRampToValueAtTime(0, startTime + config.duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + config.duration + 0.1);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  getVolume(): number {
    return this.volume;
  }

  setRingtone(ringtone: RingtoneType) {
    this.ringtone = ringtone;
    this.saveSettings();
  }

  getRingtone(): RingtoneType {
    return this.ringtone;
  }

  // Test current ringtone
  async test(): Promise<void> {
    const wasEnabled = this.enabled;
    this.enabled = true;
    await this.playRingtone(this.ringtone);
    this.enabled = wasEnabled;
  }

  // Preview specific ringtone
  async preview(ringtone: RingtoneType): Promise<void> {
    await this.playRingtone(ringtone);
  }

  // Start repeating sound until stopped
  startRepeat(): void {
    if (!this.enabled || this.isRepeating) return;

    this.isRepeating = true;

    // Play immediately
    this.play("notification");

    // Then repeat every X seconds
    this.repeatInterval = setInterval(() => {
      if (this.isRepeating && this.enabled) {
        this.play("notification");
      }
    }, this.repeatDelay);
  }

  // Stop repeating sound
  stopRepeat(): void {
    this.isRepeating = false;
    if (this.repeatInterval) {
      clearInterval(this.repeatInterval);
      this.repeatInterval = null;
    }
  }

  // Check if currently repeating
  isCurrentlyRepeating(): boolean {
    return this.isRepeating;
  }

  // Set repeat delay (in milliseconds)
  setRepeatDelay(delay: number) {
    this.repeatDelay = Math.max(2000, Math.min(30000, delay)); // Min 2s, max 30s
  }

  getRepeatDelay(): number {
    return this.repeatDelay;
  }
}

// Singleton instance
export const notificationSound = new NotificationSound();

export type { RingtoneType };
export default notificationSound;
