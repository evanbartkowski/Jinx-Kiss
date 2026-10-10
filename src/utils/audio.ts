/**
 * Web Audio API synthesizer for Jinx Kiss
 * Generates dynamic sound effects and ambient procedural chill music without external audio files or latency.
 */

export interface AudioSettings {
  masterVolume: number; // 0 - 1
  sfxVolume: number;    // 0 - 1
  musicVolume: number;  // 0 - 1
  isMuted: boolean;
  isMusicEnabled: boolean;
}

const SETTINGS_KEY = 'jinx_audio_settings_v2';

let audioCtx: AudioContext | null = null;
let musicGainNode: GainNode | null = null;
let sfxGainNode: GainNode | null = null;
let masterGainNode: GainNode | null = null;
let ambientMusicInterval: number | null = null;
let activeMusicOscillators: OscillatorNode[] = [];

let settings: AudioSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.8,
  musicVolume: 0.4,
  isMuted: false,
  isMusicEnabled: false,
};

// Initialize settings from localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      settings = { ...settings, ...JSON.parse(saved) };
    }
  } catch {
    // fallback
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx) {
    if (!masterGainNode) {
      masterGainNode = audioCtx.createGain();
      masterGainNode.gain.setValueAtTime(
        settings.isMuted ? 0 : settings.masterVolume,
        audioCtx.currentTime
      );
      masterGainNode.connect(audioCtx.destination);
    }
    if (!sfxGainNode) {
      sfxGainNode = audioCtx.createGain();
      sfxGainNode.gain.setValueAtTime(settings.sfxVolume, audioCtx.currentTime);
      sfxGainNode.connect(masterGainNode);
    }
    if (!musicGainNode) {
      musicGainNode = audioCtx.createGain();
      musicGainNode.gain.setValueAtTime(settings.musicVolume, audioCtx.currentTime);
      musicGainNode.connect(masterGainNode);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  return audioCtx;
}

export const soundEffects = {
  getSettings(): AudioSettings {
    return { ...settings };
  },

  isMuted(): boolean {
    return settings.isMuted;
  },

  setMasterVolume(val: number) {
    settings.masterVolume = Math.max(0, Math.min(1, val));
    if (masterGainNode && audioCtx) {
      masterGainNode.gain.setValueAtTime(
        settings.isMuted ? 0 : settings.masterVolume,
        audioCtx.currentTime
      );
    }
    saveSettings();
  },

  setSfxVolume(val: number) {
    settings.sfxVolume = Math.max(0, Math.min(1, val));
    if (sfxGainNode && audioCtx) {
      sfxGainNode.gain.setValueAtTime(settings.sfxVolume, audioCtx.currentTime);
    }
    saveSettings();
  },

  setMusicVolume(val: number) {
    settings.musicVolume = Math.max(0, Math.min(1, val));
    if (musicGainNode && audioCtx) {
      musicGainNode.gain.setValueAtTime(settings.musicVolume, audioCtx.currentTime);
    }
    saveSettings();
  },

  setMuted(muted: boolean) {
    settings.isMuted = muted;
    if (masterGainNode && audioCtx) {
      masterGainNode.gain.setValueAtTime(
        muted ? 0 : settings.masterVolume,
        audioCtx.currentTime
      );
    }
    saveSettings();
  },

  toggleMute(): boolean {
    const next = !settings.isMuted;
    this.setMuted(next);
    return next;
  },

  /**
   * Crisp, physical card flip with textured air swoosh & subtle felt snap
   */
  playCardFlip() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      
      // Resonant air swoosh
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 0.14);
      filter.Q.setValueAtTime(1.8, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.14);

      // Micro card snap transient
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(1800, now + 0.01);
      snapOsc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
      snapGain.gain.setValueAtTime(0.12, now + 0.01);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      snapOsc.connect(snapGain);
      snapGain.connect(sfxGainNode);
      snapOsc.start(now + 0.01);
      snapOsc.stop(now + 0.04);
    } catch {
      // autoplay fallback
    }
  },

  /**
   * High-tech neon tactile button click
   */
  playClick() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(1240, now + 0.045);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // ignore
    }
  },

  /**
   * Mechanical or casino wheel tick
   */
  playTick() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.028);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

      osc.connect(gain);
      gain.connect(sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.028);
    } catch {
      // ignore
    }
  },

  /**
   * Alias for wheel tick sound
   */
  playWheelTick() {
    this.playTick();
  },

  /**
   * Cinematic impact whoosh for intense/unhinged prompt reveals
   */
  playImpactWhoosh() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // ignore
    }
  },

  /**
   * Soft rhythmic timer warning chime
   */
  playTimerBeep() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  },

  /**
   * Success / fanfare
   */
  playSuccess() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.32);

        osc.connect(gain);
        gain.connect(sfxGainNode!);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.32);
      });
    } catch {
      // ignore
    }
  },

  /**
   * Celebration alias
   */
  playCelebration() {
    this.playSuccess();
  },

  /**
   * Rare / Epic card shimmer
   */
  playRareCard() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const chord = [440, 554.37, 659.25, 830.61, 1108.73]; // A4, C#5, E5, G#5, C#6
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.7);

        osc.connect(gain);
        gain.connect(sfxGainNode!);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.7);
      });
    } catch {
      // ignore
    }
  },

  /**
   * Legendary card fanfare: deep sub rumble + soaring golden chord
   */
  playLegendaryCard() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;

      // Sub rumble
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.8);
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      subOsc.connect(subGain);
      subGain.connect(sfxGainNode);
      subOsc.start(now);
      subOsc.stop(now + 0.8);

      // Golden major chord stack
      const chord = [329.63, 440, 554.37, 659.25, 880, 1318.5]; // E4, A4, C#5, E5, A5, E6
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.05 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 1.2);

        osc.connect(gain);
        gain.connect(sfxGainNode!);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.2);
      });
    } catch {
      // ignore
    }
  },

  /**
   * Voting submit confirmation ping
   */
  playVoteSubmit() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  },

  /**
   * Voting result reveal drumroll ramp + chime
   */
  playVoteReveal() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      // Snappy reveal chords
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(sfxGainNode!);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.5);
      });
    } catch {
      // ignore
    }
  },

  /**
   * Progressive Difficulty level up jingle
   */
  playLevelUp() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73]; // Ascending A major
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);

        osc.connect(gain);
        gain.connect(sfxGainNode!);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch {
      // ignore
    }
  },

  /**
   * Buzzer / penalty
   */
  playBuzzer() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.28);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(sfxGainNode);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // ignore
    }
  },

  /**
   * Ethereal mystery chime
   */
  playMystery() {
    if (settings.isMuted) return;
    const ctx = getAudioContext();
    if (!ctx || !sfxGainNode) return;

    try {
      const now = ctx.currentTime;
      const chord = [392.0, 587.33, 880.0, 1174.66];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.14, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.8);

        osc.connect(gain);
        gain.connect(sfxGainNode!);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.8);
      });
    } catch {
      // ignore
    }
  },

  // ===================== AMBIENT BACKGROUND SYNTH MUSIC =====================

  isMusicPlaying(): boolean {
    return settings.isMusicEnabled && ambientMusicInterval !== null;
  },

  toggleMusic(): boolean {
    if (this.isMusicPlaying()) {
      this.stopAmbientMusic();
      return false;
    } else {
      this.startAmbientMusic();
      return true;
    }
  },

  startAmbientMusic() {
    settings.isMusicEnabled = true;
    saveSettings();

    const ctx = getAudioContext();
    if (!ctx || !musicGainNode) return;

    if (ambientMusicInterval !== null) {
      clearInterval(ambientMusicInterval);
    }

    // Chill synthwave ambient chord progressions (A minor 9, F major 7, C major 7, E minor 7)
    const chordProgression: number[][] = [
      [220.0, 261.63, 329.63, 493.88], // Am9 (A3, C4, E4, B4)
      [174.61, 220.0, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [130.81, 196.0, 246.94, 329.63], // Cmaj7 (C3, G3, B3, E4)
      [164.81, 196.0, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
    ];

    let chordStep = 0;

    const playChord = () => {
      if (settings.isMuted || !settings.isMusicEnabled) return;
      const now = ctx.currentTime;
      const currentChord = chordProgression[chordStep % chordProgression.length];
      chordStep++;

      currentChord.forEach((freq) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(360, now);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          // Slow atmospheric swell & decay (4 seconds)
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 1.6);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(musicGainNode!);

          osc.start(now);
          osc.stop(now + 4.2);

          activeMusicOscillators.push(osc);
          setTimeout(() => {
            const idx = activeMusicOscillators.indexOf(osc);
            if (idx >= 0) activeMusicOscillators.splice(idx, 1);
          }, 4500);
        } catch {
          // ignore
        }
      });
    };

    // Play first chord immediately, then loop every 4.0 seconds
    playChord();
    ambientMusicInterval = window.setInterval(playChord, 4000);
  },

  stopAmbientMusic() {
    settings.isMusicEnabled = false;
    saveSettings();

    if (ambientMusicInterval !== null) {
      clearInterval(ambientMusicInterval);
      ambientMusicInterval = null;
    }

    activeMusicOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    activeMusicOscillators = [];
  },
};
