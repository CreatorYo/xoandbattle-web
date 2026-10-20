export const isSpeechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let preferredVoice: SpeechSynthesisVoice | null = null;

function pickVoice() {
  if (preferredVoice) return preferredVoice;
  const voices = window.speechSynthesis.getVoices();
  preferredVoice =
    voices.find((voice) => voice.lang === 'en-GB' && voice.localService) ??
    voices.find((voice) => voice.lang === 'en-GB') ??
    voices.find((voice) => voice.lang.startsWith('en')) ??
    null;
  return preferredVoice;
}

export function speak(text: string, interrupt = false) {
  if (!isSpeechSupported) return;
  try {
    const synth = window.speechSynthesis;
    if (interrupt || synth.pending) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 1.05;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  } catch (error) {
    console.error('Could not read aloud:', error);
  }
}

export function stopSpeaking() {
  if (isSpeechSupported) window.speechSynthesis.cancel();
}
