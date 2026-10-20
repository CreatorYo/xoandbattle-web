import { noise, play, tone, type AudioGraph } from '@/lib/audio-engine';

const NOTES = {
  C3: 130.81,
  C4: 261.63,
  Eb4: 311.13,
  G4: 392,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  C6: 1046.5,
};

function woodTap(audio: AudioGraph, at: number, pitch: number, volume: number) {
  noise(audio, { at, duration: 0.018, volume: volume * 0.8, frequency: pitch * 5, q: 1.4 });
  tone(audio, { frequency: pitch, at, duration: 0.12, volume, glide: 0.92, room: 0.08 });
  tone(audio, { frequency: pitch * 2.71, at, duration: 0.045, volume: volume * 0.4, room: 0.05 });
  tone(audio, { frequency: pitch / 2, at, duration: 0.06, volume: volume * 0.35, type: 'triangle' });
}

function marimba(audio: AudioGraph, at: number, frequency: number, volume: number, decay = 0.6) {
  noise(audio, { at, duration: 0.012, volume: volume * 0.25, frequency: frequency * 4, q: 2 });
  tone(audio, { frequency, at, duration: decay, volume, attack: 0.003, room: 0.35 });
  tone(audio, { frequency: frequency * 3.93, at, duration: decay * 0.18, volume: volume * 0.28, room: 0.25 });
  tone(audio, { frequency: frequency * 9.24, at, duration: decay * 0.05, volume: volume * 0.1 });
}

function chime(audio: AudioGraph, at: number, frequency: number, volume: number) {
  const partials = [
    { ratio: 1, level: 1, decay: 1.4 },
    { ratio: 2.76, level: 0.45, decay: 0.7 },
    { ratio: 5.4, level: 0.22, decay: 0.35 },
    { ratio: 8.93, level: 0.1, decay: 0.18 },
  ];
  partials.forEach(({ ratio, level, decay }) => {
    tone(audio, { frequency: frequency * ratio, at, duration: decay, volume: volume * level, attack: 0.002, room: 0.5 });
  });
}

function click(audio: AudioGraph, at: number, frequency: number, volume: number) {
  noise(audio, { at, duration: 0.012, volume, frequency, q: 3 });
  tone(audio, { frequency: frequency / 2.5, at, duration: 0.025, volume: volume * 0.5, type: 'triangle' });
}

export function playMoveSound(mark: 'X' | 'O') {
  play((audio, at) => woodTap(audio, at, mark === 'X' ? NOTES.D5 : NOTES.B4, 0.32));
}

export function playWinSound() {
  play((audio, at) => {
    const start = at + 0.06;
    [NOTES.C5, NOTES.E5, NOTES.G5].forEach((note, index) => marimba(audio, start + index * 0.09, note, 0.3));
    marimba(audio, start + 0.27, NOTES.C6, 0.34, 1);
    chime(audio, start + 0.3, NOTES.C6, 0.07);
  });
}

export function playLoseSound() {
  play((audio, at) => {
    const start = at + 0.06;
    [NOTES.G4, NOTES.Eb4, NOTES.C4].forEach((note, index) => marimba(audio, start + index * 0.14, note, 0.28, 0.8));
    tone(audio, { frequency: NOTES.C3, at: start + 0.28, duration: 0.5, volume: 0.18, type: 'triangle', room: 0.2 });
  });
}

export function playDrawSound() {
  play((audio, at) => {
    const start = at + 0.06;
    marimba(audio, start, NOTES.G4, 0.26, 0.7);
    marimba(audio, start + 0.12, NOTES.D5, 0.24, 0.9);
  });
}

export function playErrorSound() {
  play((audio, at) => {
    [
      { offset: 0, pitch: 165 },
      { offset: 0.1, pitch: 140 },
    ].forEach(({ offset, pitch }) => {
      tone(audio, { frequency: pitch, at: at + offset, duration: 0.09, volume: 0.32, type: 'triangle', glide: 0.7 });
      noise(audio, { at: at + offset, duration: 0.03, volume: 0.12, frequency: 600, filter: 'lowpass' });
    });
  });
}

export function playResetSound() {
  play((audio, at) => {
    noise(audio, { at, duration: 0.32, volume: 0.24, frequency: 500, q: 0.9, sweep: 5, attack: 0.12, room: 0.2 });
    tone(audio, { frequency: 220, at, duration: 0.25, volume: 0.08, type: 'triangle', glide: 0.5, attack: 0.08 });
  });
}

export function playSettingsOpenSound() {
  play((audio, at) => {
    noise(audio, { at, duration: 0.008, volume: 0.08, frequency: 2500, q: 2 });
    tone(audio, { frequency: 380, at, duration: 0.07, volume: 0.2, glide: 1.9, room: 0.15 });
  });
}

export function playGameModeSwitchSound() {
  play((audio, at) => {
    click(audio, at, 3200, 0.22);
    click(audio, at + 0.055, 2400, 0.18);
  });
}
