import { Question, InfographicData, Language, TestModule, DifficultyLevel } from '../types';

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpeech = async (text: string, voiceName: string = 'Zephyr') => {
  const response = await fetch('/api/gemini/generateSpeech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceName })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to generate speech");
  }

  const { base64Audio } = await response.json();
  if (!base64Audio) throw new Error("No audio data returned");

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioData = decodeBase64(base64Audio);
  const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);
  
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();
};

export const lookupDictionary = async (
  query: string,
  sourceLang: 'English' | 'German',
  nativeLang: Language
) => {
  const response = await fetch('/api/gemini/lookupDictionary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, sourceLang, nativeLang })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed lookup dictionary");
  }

  return response.json();
};

export const generateMockQuestions = async (
  testName: string, 
  module: TestModule,
  difficulty: DifficultyLevel,
  nativeLang: Language,
  index: number,
  isFullMock: boolean = false
): Promise<Question[]> => {
  const response = await fetch('/api/gemini/generateMockQuestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testName, module, difficulty, nativeLang, index, isFullMock })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.error("Failed to fetch questions:", errData.error);
    return [];
  }

  return response.json();
};

export const analyzeSpeakingResponse = async (
  testName: string,
  prompt: string,
  audioBase64: string,
  nativeLang: Language,
  difficulty: DifficultyLevel
) => {
  const response = await fetch('/api/gemini/analyzeSpeakingResponse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testName, prompt, audioBase64, nativeLang, difficulty })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to analyze speaking response");
  }

  return response.json();
};

export const analyzeWritingTask = async (
  testName: string,
  prompt: string,
  writtenText: string,
  audioBase64: string | null,
  nativeLang: Language,
  difficulty: DifficultyLevel
) => {
  const response = await fetch('/api/gemini/analyzeWritingTask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testName, prompt, writtenText, audioBase64, nativeLang, difficulty })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to analyze writing task");
  }

  return response.json();
};

export const generateInfographicContent = async (
  testName: string, 
  module: TestModule,
  difficulty: DifficultyLevel,
  nativeLang: Language
): Promise<InfographicData | null> => {
  const response = await fetch('/api/gemini/generateInfographicContent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ testName, module, difficulty, nativeLang })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.error("Failed to generate infographic:", errData.error);
    return null;
  }

  return response.json();
};
