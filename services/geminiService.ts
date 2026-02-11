
import { GoogleGenAI, Type } from "@google/genai";
import { UserAssessment } from "../types";

function cleanJsonResponse(text: string): string {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return cleaned;
}

export async function getCareerRecommendations(assessment: UserAssessment): Promise<any> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `أنت خبير مهني استراتيجي متخصص في سوق العمل السعودي ورؤية 2030. 
  قم بتحليل الملف الشخصي التالي للمستخدم وقدم توصية مهنية عميقة باللغة العربية.
  
  بيانات الملف:
  - التعليم: ${assessment.education}
  - المهارات: ${assessment.skills.join(', ')}
  - الاهتمامات: ${assessment.interests.join(', ')}
  - مستوى الخبرة: ${assessment.experienceLevel}
  
  يجب أن يتضمن الرد كائن JSON يحتوي على:
  - primary: { title, description, skills: [], certs: [], salary, growth, compatibility: number }
  - alternatives: Array of 2 paths
  - learningPath: Array of 5 sequential steps.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (error: any) {
    throw new Error("فشل توليد التوصيات");
  }
}

export async function refineLearningPath(currentPath: string[], targetRole: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `المستخدم يتبع هذا المسار: ${currentPath.join(', ')} ليصبح ${targetRole}.
  اقترح 5 مصادر تعليمية محددة وعالية الجودة (كورسات من Coursera، Udacity، أو منصات محلية مثل أكاديمية طويق ودروب) لكل خطوة.
  اجعل الرد مصفوفة JSON تحتوي على 5 نصوص قصيرة باللغة العربية توضح اسم الكورسات أو المنصات المقترحة.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || "[]"));
  } catch (error) {
    return currentPath;
  }
}

export async function getCareerInsights(profile: UserAssessment, report: any): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `بناءً على ملف المستخدم: ${JSON.stringify(profile)} وتقريره المهني الحالي: ${JSON.stringify(report)}.
  قدم 3 رؤى استراتيجية عميقة حول مستقبله المهني في ظل رؤية السعودية 2030. استخدم نبرة مهنية ملهمة ومركزة باللغة العربية. 
  ركز على الفجوات المهارية والفرص المستقبلية.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "";
  } catch (error) {
    return "واصل تطوير مهاراتك لمواكبة تطلعات رؤية 2030.";
  }
}

export async function generateProfileSummary(profile: UserAssessment, answers: Record<string, string>): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `أنشئ ملخصاً مهنياً قوياً وموجزاً (جملتان بحد أقصى) لمحفظة أعمال المستخدم باللغة العربية.
  المهارات: ${profile.skills.join(', ')}، الاهتمامات: ${profile.interests.join(', ')}، الهدف: ${profile.currentRole}.
  استخدم البيانات المستخلصة من إجابات التقييم: ${JSON.stringify(answers)}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "";
  } catch (error) {
    return profile.summary;
  }
}

export async function generateProfessionalAsset(prompt: string, size: "1K" | "2K" | "4K"): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ text: `High-end professional digital art for a corporate portfolio. Concept: ${prompt}. Style: Sleek, futuristic, holographic glassmorphism, Void Navy color palette, 8k resolution, cinematic lighting.` }],
      config: {
        imageConfig: { aspectRatio: "1:1", imageSize: size }
      }
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    throw new Error();
  } catch (error) {
    throw error;
  }
}

export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `أنت مُرشد، خبير المسارات المهنية في منصة مسار. ساعد المستخدمين بناءً على رؤية 2030 وتوجهات السوق السعودي.`,
    }
  });
  const result = await chat.sendMessage({ message });
  return result.text || "";
}

export async function fastHelper(context: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: `لخص هذا السياق المهني في جملة واحدة ملهمة بالعربية: ${context}`,
  });
  return response.text || "";
}

export async function analyzeProfessionalImage(base64Data: string, mimeType: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: "حلل هذه الوثيقة المهنية واستخرج المهارات وقدم 3 نصائح تحسين بالعربية." }
      ]
    }
  });
  return response.text || "";
}

export async function getLiveMarketNews(sector: string): Promise<{text: string, sources: any[]}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `أخبار التوظيف الحالية في قطاع ${sector} بالمملكة العربية السعودية لعام 2025.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return {
    text: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

export async function findTrainingCenters(location: {lat: number, lng: number}, skill: string): Promise<{text: string, places: any[]}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `مراكز تدريب متخصصة في مهارة ${skill} بالقرب مني.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: { retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lng } } }
    }
  });
  return {
    text: response.text || "",
    places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}
