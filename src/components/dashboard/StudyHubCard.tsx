import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Music, Clock, Sliders, VolumeX, X } from 'lucide-react';

interface StudyHubCardProps {
  onSessionComplete: (minutes: number) => void;
}

export default function StudyHubCard({ onSessionComplete }: StudyHubCardProps) {
  // Timer States
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'break'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const [totalFocusSessionsToday, setTotalFocusSessionsToday] = useState(0);

  // Custom Timer Modal States
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMins, setCustomMins] = useState(25);
  const [customSecs, setCustomSecs] = useState(0);

  // Audio / Sound states
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [playingTrack, setPlayingTrack] = useState<string>('Lo-Fi Rain');
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);

  // Audio references
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);

  // Ref for intervals
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Tick
  useEffect(() => {
    if (isTimerActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timer expired
            handleTimerExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerActive, timerMode]);

  const handleTimerExpiry = () => {
    setIsTimerActive(false);
    playNotificationBeep();

    if (timerMode === 'pomodoro') {
      const minutesCompleted = Math.floor((25 * 60 - secondsLeft) / 60) || 25;
      onSessionComplete(minutesCompleted);
      setTotalFocusSessionsToday(prev => prev + 1);

      if (sessionCount < 4) {
        setSessionCount(prev => prev + 1);
        setTimerMode('break');
        setSecondsLeft(5 * 60); // 5 min break
      } else {
        setSessionCount(1);
        setTimerMode('break');
        setSecondsLeft(15 * 60); // 15 min long break
      }
    } else {
      setTimerMode('pomodoro');
      setSecondsLeft(25 * 60);
    }
  };

  const handleStartPause = () => {
    setIsTimerActive(!isTimerActive);
  };

  const handleReset = () => {
    setIsTimerActive(false);
    setSecondsLeft(timerMode === 'pomodoro' ? 25 * 60 : 5 * 60);
  };

  const handleToggleMode = (mode: 'pomodoro' | 'break') => {
    setIsTimerActive(false);
    setTimerMode(mode);
    setSecondsLeft(mode === 'pomodoro' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sound Synth Generator to handle "No external MP3 files" constraint flawlessly
  const startSynthSound = (soundType: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop existing oscillator
      stopSynthSound();

      if (soundType === 'White Noise') {
        // Create brownian/white noise synthesizer
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain boost
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 400; // Brown noise warmth

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.15;

        whiteNoise.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } else if (soundType === 'Cafe') {
        // Cafe murmur synthesizer (warm, rhythmic pulsing hum)
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 110; // Low baritone murmur frequency
        osc2.type = 'triangle';
        osc2.frequency.value = 113; // Intersecting hum

        gainNode.gain.value = 0.04;

        osc.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc2.start();
        oscillatorRef.current = osc;
      } else if (soundType === 'Nature') {
        // Wind / Nature leaves rustling synthesizer
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.value = 65; // Ultra low hum for wind
        
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 1.0;

        // Modulate frequency to simulate wind gusting
        const modulator = ctx.createOscillator();
        const modulatorGain = ctx.createGain();
        modulator.frequency.value = 0.15; // Slow breeze
        modulatorGain.gain.value = 300;

        modulator.connect(modulatorGain);
        modulatorGain.connect(filter.frequency);

        gainNode.gain.value = 0.08;

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        modulator.start();
        osc.start();
        oscillatorRef.current = osc;
      }
    } catch (err) {
      console.warn('Audio Synth Error:', err);
    }
  };

  const stopSynthSound = () => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch (e) {}
      oscillatorRef.current = null;
    }
    if (noiseNodeRef.current) {
      try { (noiseNodeRef.current as any).stop(); } catch (e) {}
      noiseNodeRef.current = null;
    }
  };

  const handleSoundToggle = (sound: string) => {
    if (activeSound === sound) {
      setActiveSound(null);
      stopSynthSound();
    } else {
      setActiveSound(sound);
      startSynthSound(sound);
    }
  };

  const playNotificationBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // high chime A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleApplyCustomTime = () => {
    const totalSecs = (customHours * 3600) + (customMins * 60) + customSecs;
    if (totalSecs > 0) {
      setSecondsLeft(totalSecs);
      setIsTimerActive(false);
      setIsCustomizing(false);
    }
  };

  const maxSeconds = timerMode === 'pomodoro' ? 25 * 60 : 5 * 60;
  const strokeOffset = 2 * Math.PI * 70 * (1 - secondsLeft / maxSeconds);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
      
      {/* 1. COZY STUDY HUB CARD */}
      <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-full relative">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
            <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
              <Music className="w-4 h-4 text-[#B08B74]" />
              Cozy Study Hub
            </h3>
            <span className="text-[9px] font-mono font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase border border-green-200/50">
              ● Live Studio
            </span>
          </div>

          {/* Media Track Player Row */}
          <div className="bg-[#FAF5EF] border border-[#624F43]/10 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#B08B74] text-white rounded-xl shadow-xs animate-spin" style={{ animationDuration: isTrackPlaying ? '10s' : '0s' }}>
                <Music className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-sans font-bold text-[#3E332E]">{playingTrack}</p>
                <span className="text-[9px] font-mono text-[#624F43]/60">Ambient Synth Stream</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  setIsTrackPlaying(!isTrackPlaying);
                  if (!isTrackPlaying) startSynthSound('White Noise');
                  else stopSynthSound();
                }}
                className="p-2 bg-white border border-[#624F43]/10 rounded-xl hover:bg-[#FAF5EF] transition-all cursor-pointer"
              >
                {isTrackPlaying ? <Pause className="w-4 h-4 text-[#3E332E]" /> : <Play className="w-4 h-4 text-[#3E332E]" />}
              </button>
            </div>
          </div>

          {/* Toggle buttons for Pomodoro / Break */}
          <div className="flex items-center justify-between gap-1 bg-[#FAF5EF] border border-[#624F43]/5 p-1 rounded-xl">
            <button
              onClick={() => handleToggleMode('pomodoro')}
              className={`flex-1 py-1.5 text-[10px] font-sans font-bold capitalize rounded-lg transition-all cursor-pointer ${
                timerMode === 'pomodoro' ? 'bg-[#B08B74] text-white shadow-xs' : 'text-[#624F43]/50'
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => handleToggleMode('break')}
              className={`flex-1 py-1.5 text-[10px] font-sans font-bold capitalize rounded-lg transition-all cursor-pointer ${
                timerMode === 'break' ? 'bg-[#B08B74] text-white shadow-xs' : 'text-[#624F43]/50'
              }`}
            >
              Short Break
            </button>
          </div>

          {/* Circular countdown visualization */}
          <div className="flex flex-col items-center justify-center py-4 relative">
            <img src="/timer 1.png" alt="" className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-auto object-contain z-10" />
            <img src="/timerr2.png" alt="" className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-auto object-contain z-10" />
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#EADBC8"
                  strokeWidth="5"
                  fill="transparent"
                  className="opacity-40"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#B08B74"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-serif font-bold text-2xl text-[#3E332E] tracking-tight">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-[8px] font-mono font-bold text-[#624F43]/50 uppercase tracking-widest mt-0.5">
                  Focus Time
                </span>
              </div>
            </div>

            {/* Session Indicator */}
            {totalFocusSessionsToday > 0 ? (
              <p className="text-[10px] font-mono font-bold text-[#624F43]/70 uppercase tracking-wider mt-3">
                SESSION {sessionCount}/4
              </p>
            ) : (
              <p className="text-[10px] font-mono font-bold text-[#624F43]/70 uppercase tracking-wider mt-3 italic">
                No study sessions yet
              </p>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center justify-center space-x-3.5 pt-1">
            <button
              onClick={handleStartPause}
              className="px-6 py-2 bg-[#B08B74] hover:bg-[#8B7355] text-white text-[11px] font-sans font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isTimerActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-white border border-[#624F43]/10 text-[#624F43]/70 hover:text-[#3E332E] rounded-xl transition-all cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCustomizing(true)}
              className="p-2.5 bg-white border border-[#624F43]/10 text-[#624F43]/70 hover:text-[#3E332E] rounded-xl transition-all cursor-pointer"
              title="Customize Time"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Playlist selection buttons footer */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-3.5 border-t border-[#624F43]/5">
          {[
            { id: 'White Noise', label: 'White Noise' },
            { id: 'Cafe', label: 'Cafe Murmur' },
            { id: 'Nature', label: 'Forest Wind' },
          ].map((sound) => {
            const isSoundActive = activeSound === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => handleSoundToggle(sound.id)}
                className={`py-2 px-1 rounded-xl text-[9px] font-sans font-bold uppercase tracking-wider border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-2xs ${
                  isSoundActive 
                    ? 'bg-[#B08B74] text-white border-[#B08B74]' 
                    : 'bg-white border-[#624F43]/10 text-[#624F43]/80 hover:bg-[#FAF5EF]'
                }`}
              >
                {isSoundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-45" />}
                <span className="truncate w-full text-center">{sound.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CUSTOM TIMER SETUP / CLOCK DIAL DESIGN CARD */}
      <div className="bg-white/75 backdrop-blur-xs border border-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-full relative">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#624F43]/5">
            <h3 className="font-serif font-bold text-xs text-[#3E332E] tracking-wider uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B08B74]" />
              Set Focus Time
            </h3>
            <span className="text-[9px] font-mono font-bold text-[#624F43]/40 uppercase tracking-widest">Presets</span>
          </div>

          {/* Vintage Scroll Dial Clock Mock */}
          <div className="bg-[#FAF5EF] border border-[#624F43]/10 p-5 rounded-2xl flex flex-col items-center justify-center space-y-4">
            <span className="text-3xl font-serif font-bold text-[#3E332E] tracking-wide">
              {customHours < 10 ? '0' : ''}{customHours}:{customMins < 10 ? '0' : ''}{customMins}:{customSecs < 10 ? '0' : ''}{customSecs}
            </span>

            {/* Custom Up/Down selectors mimicking the picker wheel in pho.png */}
            <div className="flex items-center justify-center space-x-6">
              {/* Hours */}
              <div className="flex flex-col items-center space-y-1">
                <button 
                  type="button" 
                  onClick={() => setCustomHours(prev => Math.min(23, prev + 1))}
                  className="p-1 bg-white hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43] text-xs font-bold font-mono"
                >
                  ▲
                </button>
                <span className="text-xs font-mono font-bold text-[#3E332E]">{customHours}h</span>
                <button 
                  type="button" 
                  onClick={() => setCustomHours(prev => Math.max(0, prev - 1))}
                  className="p-1 bg-white hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43] text-xs font-bold font-mono"
                >
                  ▼
                </button>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center space-y-1">
                <button 
                  type="button" 
                  onClick={() => setCustomMins(prev => Math.min(59, prev + 5))}
                  className="p-1 bg-white hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43] text-xs font-bold font-mono"
                >
                  ▲
                </button>
                <span className="text-xs font-mono font-bold text-[#3E332E]">{customMins}m</span>
                <button 
                  type="button" 
                  onClick={() => setCustomMins(prev => Math.max(0, prev - 5))}
                  className="p-1 bg-white hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43] text-xs font-bold font-mono"
                >
                  ▼
                </button>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center space-y-1">
                <button 
                  type="button" 
                  onClick={() => setCustomSecs(prev => Math.min(59, prev + 10))}
                  className="p-1 bg-white hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43] text-xs font-bold font-mono"
                >
                  ▲
                </button>
                <span className="text-xs font-mono font-bold text-[#3E332E]">{customSecs}s</span>
                <button 
                  type="button" 
                  onClick={() => setCustomSecs(prev => Math.max(0, prev - 10))}
                  className="p-1 bg-white hover:bg-[#FAF5EF] border border-[#624F43]/10 rounded-md cursor-pointer text-[#624F43] text-xs font-bold font-mono"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons (15m, 25m, 45m, 60m) */}
          <div className="grid grid-cols-4 gap-2">
            {[15, 25, 45, 60].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setCustomHours(0);
                  setCustomMins(preset);
                  setCustomSecs(0);
                }}
                className={`py-2 rounded-xl text-[10px] font-sans font-bold border transition-all cursor-pointer ${
                  customMins === preset && customHours === 0
                    ? 'bg-[#B08B74] text-white border-[#B08B74] shadow-xs'
                    : 'bg-white border-[#624F43]/10 text-[#624F43] hover:bg-[#FAF5EF]'
                }`}
              >
                {preset}m
              </button>
            ))}
          </div>
        </div>

        {/* Timer Image */}
        <div className="flex justify-center mt-5">
          <img src="/timer4.png" alt="" className="w-full max-h-32 object-contain rounded-lg" />
        </div>

        {/* Save/Commit Custom Timer Button */}
        <button
          onClick={handleApplyCustomTime}
          className="w-full mt-3 py-2.5 bg-[#B08B74]/15 hover:bg-[#B08B74] text-[#3E332E] hover:text-white border border-[#B08B74]/25 hover:border-[#B08B74] text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer text-center"
        >
          Apply & Save Timer
        </button>
      </div>

    </div>
  );
}
