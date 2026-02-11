
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserAssessment } from "../types";

export async function getCareerRecommendations(assessment: UserAssessment): Promise<any> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze the following professional profile and provide a detailed career analysis in Arabic. 
  Focus on identifying the primary optimal path and two alternative secondary paths.
  
  Profile Data:
  - Education: ${assessment.education}
  - Skills: ${assessment.skills.join(', ')}
  - Interests: ${assessment.interests.join(', ')}
  - Experience Level: ${assessment.experienceLevel}
  - Summary: ${assessment.summary}
  - Projects: ${assessment.projects.map(p => p.title).join(', ')}
  
  Return a JSON object containing:
  - primary: { title, description, skills: [], certs: [], salary, growth, compatibility: number }
  - alternatives: Array of 2 paths with same structure
  - learningPath: Array of 5 sequential steps/courses to take to reach the primary goal.
  
  All text must be in Arabic. Ensure compatibility is a number between 40 and 99.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                certs: { type: Type.ARRAY, items: { type: Type.STRING } },
                salary: { type: Type.STRING },
                growth: { type: Type.STRING },
                compatibility: { type: Type.NUMBER }
              },
              required: ["title", "description", "skills", "certs", "salary", "growth", "compatibility"]
            },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  certs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  salary: { type: Type.STRING },
                  growth: { type: Type.STRING },
                  compatibility: { type: Type.NUMBER }
                }
              }
            },
            learningPath: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["primary", "alternatives", "learningPath"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let userFriendlyMessage = "عذراً، حدث خطأ في معالجة التوصيات.";
    
    if (error.message?.includes('API_KEY_INVALID')) {
      userFriendlyMessage = "خطأ في مفتاح البرمجة (API Key). يرجى التحقق من إعدادات النظام.";
    } else if (error.message?.includes('429')) {
      userFriendlyMessage = "تم تجاوز عدد الطلبات المسموح به حالياً. يرجى المحاولة بعد قليل.";
    } else if (error.message?.includes('SAFETY')) {
      userFriendlyMessage = "تعذر إتمام الطلب بسبب قيود الأمان في المحتوى.";
    } else if (error.message?.includes('Requested entity was not found')) {
      userFriendlyMessage = "الموديل المطلوب غير متاح حالياً.";
    }
    
    throw new Error(userFriendlyMessage);
  }
}

// Search Grounding Feature
export async function getLiveMarketNews(sector: string): Promise<{text: string, sources: any[]}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `ما هي آخر اتجاهات سوق العمل وأخبار التوظيف في قطاع ${sector} في المملكة العربية السعودية لعام 2025؟ أجب بالعربية بالتفصيل.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { text: "تعذر جلب البيانات الحية حالياً.", sources: [] };
  }
}

// Maps Grounding Feature
export async function findTrainingCenters(location: {lat: number, lng: number}, skill: string): Promise<{text: string, places: any[]}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `ابحث عن أفضل مراكز التدريب أو المعاهد التي تقدم دورات في ${skill} بالقرب من موقعي الحالي.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: location.lat, longitude: location.lng }
          }
        }
      }
    });
    return {
      text: response.text || "",
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "تعذر العثور على مراكز تدريب حالياً.", places: [] };
  }
}

// Chatbot with Thinking Mode & Multi-language Support
export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userLang = navigator.language || 'ar';
  const isArabic = userLang.startsWith('ar');

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `أنت مستشار مهني ذكي في منصة "مسار". تساعد المستخدمين في تخطيط مساراتهم المهنية. أجب دائماً بطريقة ملهمة وعملية.
      لغة المتصفح الحالية هي: ${userLang}. 
      إذا كانت اللغة غير العربية، قم بالرد بالعربية أولاً ثم قدم ترجمة مختصرة باللغة ${userLang} في نهاية الرد.`,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("Chat Error:", error);
    return isArabic ? "عذراً، حدث خطأ أثناء معالجة طلبك." : "Sorry, an error occurred while processing your request.";
  }
}

// Fast AI Helper
export async function fastHelper(context: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `لخص هذا السياق المهني في جملة واحدة ملهمة بالعربية: ${context}`
    });
    return response.text || "";
  } catch (error) {
    return "استمر في السعي نحو أهدافك.";
  }
}

// Image Generation
export async function generateProfessionalAsset(prompt: string, size: "1K" | "2K" | "4K"): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ text: `Professional corporate digital art: ${prompt}. High quality, modern style.` }],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
}

// Image Understanding (CV/Certificate Analysis)
export async function analyzeProfessionalImage(base64Data: string, mimeType: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "حلل هذه الوثيقة المهنية (سيرة ذاتية أو شهادة). استخرج المهارات الأساسية وقدم 3 نصائح لتحسينها باللغة العربية." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return "فشل تحليل الصورة. تأكد من جودة الملف المرفوع.";
  }
}
