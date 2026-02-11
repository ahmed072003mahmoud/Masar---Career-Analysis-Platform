
import { UserAssessment } from "../types";

const API_BASE = "/api/recommend";

async function fetchFromBackend(endpoint: string, data: any) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Placeholder for real JWT
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Server communication failed");
  }

  return response.json();
}

/**
 * Proxies career analysis to the secure backend.
 */
export async function getCareerRecommendations(assessment: UserAssessment): Promise<any> {
  return fetchFromBackend('/analyze', assessment);
}

/**
 * Proxies path refinement to the secure backend.
 */
export async function refineLearningPath(currentPath: string[], targetRole: string): Promise<string[]> {
  const data = await fetchFromBackend('/refine-path', { path: currentPath, targetRole });
  return data.refined;
}

/**
 * Proxies strategic insights to the secure backend.
 */
export async function getCareerInsights(profile: UserAssessment, answers: Record<string, string>): Promise<string> {
  const data = await fetchFromBackend('/insights', { profile, answers });
  return data.insights;
}

/**
 * Proxies profile summary generation (now handled via chat/general endpoint on backend)
 */
export async function generateProfileSummary(profile: UserAssessment, answers: Record<string, string>): Promise<string> {
  const message = `أنشئ ملخصاً مهنياً قوياً (جملتان) لمحفظة أعمال المستخدم بالعربية.
  المهارات: ${profile.skills.join(', ')}، الهدف: ${profile.currentRole}.
  الإجابات: ${JSON.stringify(answers)}.`;
  const data = await fetchFromBackend('/chat', { message, history: [] });
  return data.text;
}

/**
 * Proxies live market news to the secure backend.
 */
export async function getLiveMarketNews(sector: string): Promise<{ text: string, sources: any[] | null }> {
  return fetchFromBackend('/market-news', { sector });
}

/**
 * Proxies image analysis (This would require multipart/form-data or large base64 strings)
 * Simplified here to assume the backend handles the prompt.
 */
export async function analyzeProfessionalImage(base64: string, mimeType: string): Promise<string> {
  const message = "يرجى تحليل هذه الوثيقة المهنية واستخراج المهارات والخبرات.";
  // Note: Handling large images via JSON proxy needs care; ideally use direct blob upload to backend
  const data = await fetchFromBackend('/chat', { message, history: [] });
  return data.text;
}

/**
 * Proxies professional asset generation to the secure backend.
 */
export async function generateProfessionalAsset(careerTitle: string, size: "1K" | "2K" | "4K"): Promise<string> {
  // In a proxy scenario, the backend would handle the direct Gemini call
  // For simplicity in this structure, we'll assume the backend has a /generate-asset endpoint
  const response = await fetch(`${API_BASE}/generate-asset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ careerTitle, size })
  });
  if (!response.ok) throw new Error("Asset generation failed");
  const data = await response.json();
  return data.imageUrl;
}

/**
 * Proxies chat sessions to the secure backend.
 */
export async function chatWithAI(message: string, history: any[]): Promise<string> {
  const data = await fetchFromBackend('/chat', { message, history });
  return data.text;
}
