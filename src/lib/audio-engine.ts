export interface AudioGraph {
  ctx: AudioContext;
  output: GainNode;
  room: ConvolverNode;
  noise: AudioBuffer;
}

interface ToneOptions {
  frequency: number;
  at: number;
  duration: number;
  volume: number;
  type?: OscillatorType;
  glide?: number;
  attack?: number;
  room?: number;
}

interface NoiseOptions {
  at: number;
  duration: number;
  volume: number;
  frequency: number;
  filter?: BiquadFilterType;
  q?: number;
  sweep?: number;
  attack?: number;
  room?: number;
}

let graph: AudioGraph | null = null;

function createNoise(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function createRoom(ctx: AudioContext) {
  const length = Math.floor(ctx.sampleRate * 1.2);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4;
    }
  }
  const room = ctx.createConvolver();
  room.buffer = impulse;
  return room;
}

function getGraph(): AudioGraph {
  if (!graph || graph.ctx.state === 'closed') {
    const ctx = new AudioContext({ latencyHint: 'interactive' });

    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -10;
    limiter.knee.value = 8;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.12;
    limiter.connect(ctx.destination);

    const output = ctx.createGain();
    output.gain.value = 0.9;
    output.connect(limiter);

    const room = createRoom(ctx);
    const roomTone = ctx.createBiquadFilter();
    roomTone.type = 'lowpass';
    roomTone.frequency.value = 4800;
    const roomLevel = ctx.createGain();
    roomLevel.gain.value = 0.35;
    room.connect(roomTone);
    roomTone.connect(roomLevel);
    roomLevel.connect(output);

    graph = { ctx, output, room, noise: createNoise(ctx) };
  }
  if (graph.ctx.state === 'suspended') void graph.ctx.resume();
  return graph;
}

export function play(compose: (audio: AudioGraph, at: number) => void) {
  try {
    const audio = getGraph();
    compose(audio, audio.ctx.currentTime + 0.005);
  } catch (error) {
    console.error('Could not play sound:', error);
  }
}

function route(audio: AudioGraph, node: AudioNode, room: number) {
  node.connect(audio.output);
  if (room <= 0) return;
  const send = audio.ctx.createGain();
  send.gain.value = room;
  node.connect(send);
  send.connect(audio.room);
}

function envelope(audio: AudioGraph, at: number, attack: number, duration: number, volume: number) {
  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(volume, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  return gain;
}

export function tone(audio: AudioGraph, options: ToneOptions) {
  const { frequency, at, duration, volume, type = 'sine', glide, attack = 0.002, room = 0 } = options;
  const oscillator = audio.ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, at);
  if (glide) oscillator.frequency.exponentialRampToValueAtTime(frequency * glide, at + duration);

  const gain = envelope(audio, at, attack, duration, volume);
  oscillator.connect(gain);
  route(audio, gain, room);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.05);
}

export function noise(audio: AudioGraph, options: NoiseOptions) {
  const { at, duration, volume, frequency, filter = 'bandpass', q = 1, sweep, attack = 0.001, room = 0 } = options;
  const source = audio.ctx.createBufferSource();
  source.buffer = audio.noise;

  const shaper = audio.ctx.createBiquadFilter();
  shaper.type = filter;
  shaper.Q.value = q;
  shaper.frequency.setValueAtTime(frequency, at);
  if (sweep) shaper.frequency.exponentialRampToValueAtTime(frequency * sweep, at + duration);

  const gain = envelope(audio, at, attack, duration, volume);
  source.connect(shaper);
  shaper.connect(gain);
  route(audio, gain, room);
  source.start(at, Math.random() * 0.5);
  source.stop(at + duration + 0.05);
}
