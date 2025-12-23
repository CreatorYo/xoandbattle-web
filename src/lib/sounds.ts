let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (typeof window === 'undefined') {
    throw new Error('AudioContext not available');
  }
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine', volume: number = 0.3): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

export function playMoveSound(): void {
  playTone(440, 0.1, 'sine', 0.2);
}

export function playWinSound(): void {
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, index) => {
    setTimeout(() => {
      playTone(freq, 0.2, 'sine', 0.3);
    }, index * 100);
  });
}

export function playDrawSound(): void {
  playTone(220, 0.3, 'triangle', 0.25);
}

export function playErrorSound(): void {
  playTone(150, 0.15, 'square', 0.2);
}

export function playResetSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'triangle';
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(50, now + 0.2);
  
  oscillator.frequency.setValueAtTime(150, now);
  oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.35, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

export function playSettingsOpenSound(): void {
  playTone(600, 0.15, 'sine', 0.25);
  setTimeout(() => {
    playTone(800, 0.1, 'sine', 0.2);
  }, 80);
}

export function playGameModeSwitchSound(): void {
  playTone(500, 0.1, 'sine', 0.2);
  setTimeout(() => {
    playTone(700, 0.1, 'sine', 0.2);
  }, 60);
}
