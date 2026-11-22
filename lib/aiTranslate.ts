import Groq from "groq-sdk";
import { LANGUAGES, LangCode } from "./i18n";

export async function translateArticleWithAI(
  title: string,
  content: string,
  sourceLang: LangCode
): Promise<Record<LangCode, { title: string; content: string }>> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Відсутній ключ GROQ_API_KEY у налаштуваннях середовища.");
  }

  const groq = new Groq({ apiKey });

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

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const rawText = completion.choices.at(0)?.message?.content || "{}";
  const parsed = JSON.parse(rawText);

  return {
    [sourceLang]: { title, content },
    ...parsed,
  } as Record<LangCode, { title: string; content: string }>;
}
