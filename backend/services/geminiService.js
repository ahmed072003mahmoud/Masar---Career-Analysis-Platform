
import { GoogleGenAI, Type } from "@google/genai";

// Helper function to clean potential markdown formatting from JSON responses
function cleanJsonResponse(text) {
  if (!text) return "{}";
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

/**
 * Backend service for interacting with Gemini API safely.
 * Upgraded to gemini-3-pro-preview with maximum thinking budget for deep career analysis.
 */
export async function getCareerRecommendations(assessment) {
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
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text));
  } catch (error) {
    console.error("Gemini Recommendations Error:", error);
    throw new Error("AI Recommendation generation failed");
  }
}

/**
 * Refines a broad learning path into specific high-quality educational resources.
 * Upgraded to gemini-3-pro-preview with thinking mode.
 */
export async function refineLearningPath(currentPath, targetRole) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `المستخدم يتبع هذا المسار: ${currentPath.join(', ')} ليصبح ${targetRole}.
  اقترح 5 مصادر تعليمية محددة وعالية الجودة (مثل كورسات Coursera أو منصة طويق) لكل خطوة.
  الرد يجب أن يكون مصفوفة JSON يحتوي على 5 نصوص قصيرة باللغة العربية.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text));
  } catch (error) {
    return currentPath;
  }
}

/**
 * Generates strategic insights for the user.
 * Upgraded to gemini-3-pro-preview with thinking mode.
 */
export async function getCareerInsights(profile, answers) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `بناءً على ملف المستخدم وإجاباته: ${JSON.stringify(profile)} - ${JSON.stringify(answers)}.
  قدم 3 رؤى استراتيجية ملهمة ومختصرة حول مستقبله المهني في السعودية 2030 باللغة العربية.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  } catch (error) {
    return "واصل تطوير مهاراتك لمواكبة تطلعات رؤية 2030.";
  }
}

/**
 * Fetches market news with Google Search grounding.
 * Upgraded to gemini-3-pro-preview.
 */
export async function getLiveMarketNews(sector) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `ما هي أحدث مستجدات وأخبار سوق العمل في قطاع ${sector} في المملكة العربية السعودية لعام 2024-2025؟ 
  ركز على الفرص الجديدة وتوجهات رؤية 2030. قدم ملخصاً باللغة العربية.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || null;
    return {
      text: response.text,
      sources: sources
    };
  } catch (error) {
    console.error("Market News Error:", error);
    return { text: "فشل الحصول على الأخبار الحية.", sources: null };
  }
}

/**
 * Enhanced chat with Thinking Mode on the backend.
 * Uses gemini-3-pro-preview for complex reasoning.
 */
export async function chatWithAI(message, history) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `أنت مُرشد، خبير المسارات المهنية في منصة مسار. ساعد المستخدمين بناءً على رؤية 2030 وتوجهات السوق السعودي. استخدم تفكيراً عميقاً لتقديم نصائح مهنية استراتيجية.`,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  const result = await chat.sendMessage({ message });
  return result.text;
}
