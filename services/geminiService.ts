
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Question, InfographicData, Language, TestModule, DifficultyLevel, TestId } from '../types';

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Pronounce clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
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
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a world-class lexicographer and language tutor. 
    Look up the following word, phrase, or sentence: "${query}".
    Source Language: ${sourceLang}.
    Target Native Language: ${nativeLang}.

    RULES:
    - Provide a pedagogical definition in ${sourceLang}.
    - Provide a natural translation into ${nativeLang}.
    - CRITICAL: In "nativeExplanation", explain any cultural nuance or specific "Test Usage" (e.g., if this is a formal term often used in IELTS Writing or a typical DSH academic connector).
    - If the input is a sentence, break down its structure in the explanation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          phonetic: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
          definition: { type: Type.STRING },
          nativeTranslation: { type: Type.STRING },
          nativeExplanation: { type: Type.STRING },
          example: { type: Type.STRING },
          synonyms: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["word", "partOfSpeech", "definition", "nativeTranslation", "example"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateMockQuestions = async (
  testName: string, 
  module: TestModule,
  difficulty: DifficultyLevel,
  nativeLang: Language,
  index: number,
  isFullMock: boolean = false
): Promise<Question[]> => {
  const typeLabel = isFullMock ? `Full Official Mock Exam (Attempt #${index + 1})` : `Module Practice Unit #${index + 1}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as an expert examiner and test developer for the ${testName} certification. 
      Generate exactly 5 high-quality questions for the ${typeLabel} of the ${module} module.
      
      CRITICAL FORMATTING & CONTENT RULES:
      - STRICTLY match the official difficulty and task types of ${testName}.
      - For IELTS ACADEMIC: Use complex, university-level academic texts and vocabulary.
      - For IELTS GENERAL: Use workplace, travel, and social survival contexts.
      - For GERMAN TESTS (TestDaF, DSH, Goethe): Use the exact formal tone and academic/professional German standards required for that specific level (B2, C1, C2).
      - MODULE SPECIFICS:
        * READING: Provide a context passage first, then multiple choice or fill-in-the-blank questions based on it.
        * LISTENING: Provide a realistic transcript in "audioPrompt" that includes exam-typical distractors.
        * WRITING: Provide an official task prompt (e.g., Task 1 graph or Task 2 essay for IELTS).
        * SPEAKING: Provide a 3-part or 2-part structured interview prompt.
      
      NATIVE LANGUAGE SUPPORT:
      - All technical explanations and feedback MUST include a version in ${nativeLang} to ensure deep understanding for native speakers.
      - Identify 3-5 "difficultTerms" and provide them in a clear array for pronunciation practice.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            audioPrompt: { type: Type.STRING, description: "Full transcript of the audio component" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required for Reading/Listening" },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING, description: "Detailed pedagogical explanation in English" },
            nativeExplanation: { type: Type.STRING, description: `Explanation translated/adapted into ${nativeLang}` },
            difficultTerms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key vocab terms from the question/passage" },
          },
          required: ["id", "text", "explanation", "nativeExplanation", "difficultTerms"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse questions", e);
    return [];
  }
};

export const analyzeSpeakingResponse = async (
  testName: string,
  prompt: string,
  audioBase64: string,
  nativeLang: Language,
  difficulty: DifficultyLevel
) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: `Analyze this audio response for the ${testName} speaking exam. 
        Prompt: "${prompt}". 
        The student is at a ${difficulty} level. 
        Evaluate based on ${testName} official criteria: Pronunciation, Fluency, and Grammar. 
        Provide specific feedback on Phonemes, Intonation, and Stress.
        Also, provide a "transcript" field containing the verbatim text of what the student said.
        Return suggestions as structured JSON with category (one of: Pronunciation, Fluency, Grammar, Vocabulary) and text.` },
        { inlineData: { mimeType: 'audio/webm', data: audioBase64 } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          transcript: { type: Type.STRING, description: "Verbatim transcript of the audio input" },
          pronunciationScore: { type: Type.NUMBER, description: "Score out of 10 based on exam standards" },
          fluencyScore: { type: Type.NUMBER, description: "Score out of 10 based on exam standards" },
          grammarScore: { type: Type.NUMBER, description: "Score out of 10 based on exam standards" },
          pronunciationPhonemes: { type: Type.STRING },
          pronunciationIntonation: { type: Type.STRING },
          pronunciationStress: { type: Type.STRING },
          pronunciationStandardComparison: { type: Type.STRING },
          fluencyDetails: { type: Type.STRING },
          grammarDetails: { type: Type.STRING },
          feedback: { type: Type.STRING },
          suggestions: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["category", "text"]
            } 
          },
          nativeFeedback: { type: Type.STRING, description: `Summary of feedback in ${nativeLang}` }
        },
        required: ["transcript", "pronunciationScore", "fluencyScore", "grammarScore", "feedback", "suggestions", "nativeFeedback"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeWritingTask = async (
  testName: string,
  prompt: string,
  writtenText: string,
  audioBase64: string | null,
  nativeLang: Language,
  difficulty: DifficultyLevel
) => {
  const contents: any[] = [
    { text: `Analyze this writing task for the ${testName} exam. 
      Prompt: "${prompt}". 
      Student Text: "${writtenText}". 
      Student Level: ${difficulty}. 
      
      CRITICAL INSTRUCTION:
      - Evaluate exactly based on these 4 official criteria: Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.
      - IF AUDIO IS PROVIDED: This is a "Thought Process" recording where the student talk through their planning. 
        Use it to evaluate their "Strategic Planning" and "Metacognition". Provide insight into how well their spoken plan matches their written execution in the 'thoughtProcessAnalysis' field.
      - Return scores out of 10 for each criteria. Provide detailed feedback in English and a summary in ${nativeLang}.` }
  ];

  if (audioBase64) {
    contents.push({ inlineData: { mimeType: 'audio/webm', data: audioBase64 } });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          taskResponseScore: { type: Type.NUMBER },
          cohesionScore: { type: Type.NUMBER },
          vocabularyScore: { type: Type.NUMBER },
          grammarScore: { type: Type.NUMBER },
          writingFeedback: { type: Type.STRING },
          thoughtProcessAnalysis: { type: Type.STRING, description: "Analysis of the spoken planning strategy vs written execution" },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          nativeSummary: { type: Type.STRING }
        },
        required: ["taskResponseScore", "cohesionScore", "vocabularyScore", "grammarScore", "writingFeedback", "suggestions", "nativeSummary"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateInfographicContent = async (
  testName: string, 
  module: TestModule,
  difficulty: DifficultyLevel,
  nativeLang: Language
): Promise<InfographicData | null> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a comprehensive learning infographic for the ${module} section of ${testName} at ${difficulty} level. 
      Focus on one core strategy, vocabulary set, or grammar concept. 
      IMPORTANT: Generate a list of 5-8 context-relevant "difficultTerms" that are essential for mastering this topic. 
      Include grammar rules with ${nativeLang} translations and examples.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          concept: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                translation: { type: Type.STRING },
                context: { type: Type.STRING },
              }
            }
          },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualElements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
              }
            }
          },
          difficultTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
          grammarRules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rule: { type: Type.STRING },
                explanation: { type: Type.STRING },
                example: { type: Type.STRING },
                exampleTranslation: { type: Type.STRING },
              },
              required: ["rule", "explanation", "example", "exampleTranslation"],
            }
          },
        },
        required: ["title", "concept", "examples", "tips", "visualElements", "grammarRules", "difficultTerms"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse infographic", e);
    return null;
  }
};
