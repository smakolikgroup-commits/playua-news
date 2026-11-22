import { GoogleGenAI } from "@google/genai";
import { LANGUAGES, LangCode } from "./i18n";

export async function translateArticleWithAI(
  title: string,
  content: string,
  sourceLang: LangCode
): Promise<Record<LangCode, { title: string; content: string }>> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Відсутній ключ GEMINI_API_KEY у налаштуваннях середовища.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Автоматично дізнаємося, які моделі активні саме на цьому ключі
  const availableModels: string[] = [];
  try {
    const listPager = await ai.models.list();
    for await (const m of listPager) {
      if (m.name && m.name.includes("gemini") && !m.name.includes("embedding") && !m.name.includes("imagen")) {
        availableModels.push(m.name.replace("models/", ""));
      }
    }
  } catch {
    // резервний список, якщо list() обмежений
  }

  const modelsToTry = Array.from(
    new Set([
      ...availableModels.filter((m) => m.includes("flash")),
      ...availableModels,
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ])
  );

  const targetLangs = LANGUAGES.filter((l) => l.code !== sourceLang)
    .map((l) => `${l.code} (${l.name})`)
    .join(", ");

  const prompt = `You are a professional video game and geek media journalist and translator.
Translate the following gaming news article from "${sourceLang}" into these languages: ${targetLangs}.
Keep gaming terms, game titles, studio names, and formatting natural and accurate for each language.
Return ONLY a valid JSON object where keys are language codes (${LANGUAGES.filter((l) => l.code !== sourceLang)
    .map((l) => `"${l.code}"`)
    .join(", ")}) and each value is an object with "title" and "content" strings.

Original Title:
${title}

Original Content:
${content}`;

  let lastError: unknown;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return {
        [sourceLang]: { title, content },
        ...parsed,
      } as Record<LangCode, { title: string; content: string }>;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}
