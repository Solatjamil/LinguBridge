import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Modality } from "@google/genai";

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '50mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Guard helper
const checkApiKey = (req: any, res: any, next: any) => {
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key is not configured. Please configure it in your Settings > Secrets panel." });
  }
  next();
};

// 1. API - generateSpeech
app.post('/api/gemini/generateSpeech', checkApiKey, async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Pronounce clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(400).json({ error: "No audio data returned from voice model" });
    }
    res.json({ base64Audio });
  } catch (error: any) {
    console.error("Speech Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate speech" });
  }
});

// 2. API - lookupDictionary
app.post('/api/gemini/lookupDictionary', checkApiKey, async (req: any, res: any) => {
  try {
    const { query, sourceLang, nativeLang } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
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

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error("Dictionary Lookup Error:", error);
    res.status(500).json({ error: error.message || "Failed lookup dictionary" });
  }
});

// 3. API - generateMockQuestions
app.post('/api/gemini/generateMockQuestions', checkApiKey, async (req: any, res: any) => {
  try {
    const { testName, module, difficulty, nativeLang, index, isFullMock } = req.body;
    const typeLabel = isFullMock ? `Full Official Mock Exam (Attempt #${index + 1})` : `Module Practice Unit #${index + 1}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
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

    res.json(JSON.parse(response.text || '[]'));
  } catch (error: any) {
    console.error("Generate Mock Questions Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate mock questions" });
  }
});

// 4. API - analyzeSpeakingResponse
app.post('/api/gemini/analyzeSpeakingResponse', checkApiKey, async (req: any, res: any) => {
  try {
    const { testName, prompt, audioBase64, nativeLang, difficulty } = req.body;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
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

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error("Analyze Speaking Response Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze speaking response" });
  }
});

// 5. API - analyzeWritingTask
app.post('/api/gemini/analyzeWritingTask', checkApiKey, async (req: any, res: any) => {
  try {
    const { testName, prompt, writtenText, audioBase64, nativeLang, difficulty } = req.body;
    
    const parts: any[] = [
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
      parts.push({ inlineData: { mimeType: 'audio/webm', data: audioBase64 } });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts },
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

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error("Analyze Writing Task Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze writing task" });
  }
});

// 6. API - generateInfographicContent
app.post('/api/gemini/generateInfographicContent', checkApiKey, async (req: any, res: any) => {
  try {
    const { testName, module, difficulty, nativeLang } = req.body;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
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

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error("Generate Infographic Content Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate infographic content" });
  }
});

// Configure Vite middleware / Serve static build in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LinguBridge App] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
