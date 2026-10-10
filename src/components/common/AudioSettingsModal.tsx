import React, { useState } from 'react';
import { soundEffects, AudioSettings } from '../../utils/audio';
import { Volume2, VolumeX, Music, Sliders, X, Play, Square } from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() =>
    soundEffects.getSettings()
  );

  if (!isOpen) return null;

  const handleMasterChange = (val: number) => {
    soundEffects.setMasterVolume(val);
    setAudioSettings(soundEffects.getSettings());
  };

  const handleSfxChange = (val: number) => {
    soundEffects.setSfxVolume(val);
    setAudioSettings(soundEffects.getSettings());
  };

  const handleMusicChange = (val: number) => {
    soundEffects.setMusicVolume(val);
    setAudioSettings(soundEffects.getSettings());
  };

  const handleToggleMute = () => {
    soundEffects.toggleMute();
    setAudioSettings(soundEffects.getSettings());
  };

  const handleToggleMusic = () => {
    soundEffects.playClick();
    soundEffects.toggleMusic();
    setAudioSettings(soundEffects.getSettings());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl glass-panel border border-brand-violet/40 p-6 sm:p-7 relative shadow-neon-violet/30">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-purple-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-white tracking-wide">
              Audio & Ambient Music
            </h3>
            <p className="text-xs text-zinc-400">
              Sound effects & relaxing neon synthwave
            </p>
          </div>
        </div>

        {/* Master Mute Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            {audioSettings.isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-brand-pink" />
            )}
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {audioSettings.isMuted ? 'All Audio Muted' : 'Audio Enabled'}
            </span>
          </div>

          <button
            onClick={handleToggleMute}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              audioSettings.isMuted
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {audioSettings.isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>

        {/* Ambient Music Player Button */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-500/30 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Music className={`w-5 h-5 ${soundEffects.isMusicPlaying() ? 'text-brand-pink animate-pulse' : 'text-zinc-500'}`} />
            <div>
              <span className="text-xs font-bold text-white block">
                Ambient Chillwave
              </span>
              <span className="text-[10px] text-zinc-400 block">
                {soundEffects.isMusicPlaying() ? 'Playing procedurally' : 'Turn on relaxing background music'}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleMusic}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-violet hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs shadow-neon-pink flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            {soundEffects.isMusicPlaying() ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>

        {/* Volume Sliders */}
        <div className="space-y-4 mb-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
              <span>Master Volume</span>
              <span className="font-mono">{Math.round(audioSettings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioSettings.masterVolume}
              onChange={(e) => handleMasterChange(parseFloat(e.target.value))}
              className="w-full accent-brand-pink cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
              <span>Sound Effects (SFX)</span>
              <span className="font-mono">{Math.round(audioSettings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioSettings.sfxVolume}
              onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1.5">
              <span>Ambient Music Volume</span>
              <span className="font-mono">{Math.round(audioSettings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioSettings.musicVolume}
              onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

