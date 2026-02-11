
import { GoogleGenAI, Type } from "@google/genai";
import { UserAssessment } from "../types";

// Helper function to clean potential markdown formatting from JSON responses
function cleanJsonResponse(text: string): string {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return cleaned;
}

/**
 * Analyzes the user profile to provide strategic career recommendations in JSON format.
 * Utilizes thinking mode for deep analysis of the user's profile against market trends.
 */
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
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (error: any) {
    throw new Error("فشل توليد التوصيات");
  }
}

/**
 * Refines a broad learning path into specific high-quality educational resources.
 * Upgraded to gemini-3-pro-preview with thinking mode for superior quality resource curation.
 */
export async function refineLearningPath(currentPath: string[], targetRole: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `المستخدم يتبع هذا المسار: ${currentPath.join(', ')} ليصبح ${targetRole}.
  اقترح 5 مصادر تعليمية محددة وعالية الجودة (مثل كورسات Coursera أو منصة طويق) لكل خطوة.
  الرد يجب أن يكون مصفوفة JSON تحتوي على 5 نصوص قصيرة باللغة العربية.`;

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
    return JSON.parse(cleanJsonResponse(response.text || "[]"));
  } catch (error) {
    return currentPath;
  }
}

/**
 * Generates high-level strategic insights based on user profile and questionnaire answers.
 * Upgraded to gemini-3-pro-preview with thinking mode for deeper strategic reasoning.
 */
export async function getCareerInsights(profile: UserAssessment, answers: Record<string, string>): Promise<string> {
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
    return response.text || "";
  } catch (error) {
    return "واصل تطوير مهاراتك لمواكبة تطلعات رؤية 2030.";
  }
}

/**
 * Creates a professional summary for the user's portfolio.
 */
export async function generateProfileSummary(profile: UserAssessment, answers: Record<string, string>): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `أنشئ ملخصاً مهنياً قوياً (جملتان) لمحفظة أعمال المستخدم بالعربية.
  المهارات: ${profile.skills.join(', ')}، الهدف: ${profile.currentRole}.
  الإجابات: ${JSON.stringify(answers)}.`;

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

/**
 * Fetches live market news using Google Search grounding for up-to-date information.
 * Upgraded to gemini-3-pro-preview for more intelligent search result synthesis.
 */
export async function getLiveMarketNews(sector: string): Promise<{ text: string, sources: any[] | null }> {
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
    
    // Extracting grounding chunks for mandatory URL display in the UI
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || null;
    return {
      text: response.text || "لا توجد أخبار متاحة حالياً.",
      sources: sources
    };
  } catch (error) {
    console.error("Market News Error:", error);
    return { text: "فشل الحصول على الأخبار الحية.", sources: null };
  }
}

/**
 * Analyzes a professional image (e.g., CV or portfolio) using multimodal vision capabilities.
 * Enhanced with Thinking Mode for deeper document extraction and reasoning.
 */
export async function analyzeProfessionalImage(base64: string, mimeType: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `قم بتحليل هذه الصورة الاحترافية (سيرة ذاتية أو شهادة أو نموذج عمل). 
  استخرج المهارات الأساسية، الخبرات، والتوصيات لتعزيز هذا الملف المهني بما يتوافق مع سوق العمل السعودي ورؤية 2030. 
  اجعل الرد باللغة العربية وبشكل نقاط واضحة.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "لم يتم العثور على تحليل.";
  } catch (error) {
    console.error("Image Analysis Error:", error);
    return "حدث خطأ أثناء تحليل الصورة.";
  }
}

/**
 * Generates a high-quality professional asset using the Gemini 3 Pro image model.
 * Complies with the requirement to iterate through candidates/parts to find the inline image.
 */
export async function generateProfessionalAsset(careerTitle: string, size: "1K" | "2K" | "4K"): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `High-end professional digital art representing a successful career in ${careerTitle}. 
  Style: Sleek, futuristic, holographic glassmorphism, corporate navy and teal lighting, 8k resolution.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      }
    });
    
    // Find the image part as recommended, avoiding assumption of first part being the image
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
}

/**
 * Initiates a chat session with the career mentor model.
 * Upgraded to gemini-3-pro-preview with thinking mode for complex career guidance.
 */
export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `أنت مُرشد، خبير المسارات المهنية في منصة مسار. ساعد المستخدمين بناءً على رؤية 2030 وتوجهات السوق السعودي. استخدم تفكيراً عميقاً لتقديم نصائح مهنية استراتيجية.`,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  const result = await chat.sendMessage({ message });
  return result.text || "";
}
