import { LANGUAGES, LangCode } from "./i18n";

export async function translateArticleWithAI(
  title: string,
  content: string,
  sourceLang: LangCode
): Promise<Record<LangCode, { title: string; content: string }>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Відсутній ключ GEMINI_API_KEY у налаштуваннях середовища.");
  }

  const targetLangs = LANGUAGES.filter((l) => l.code !== sourceLang)
    .map((l) => `${l.code} (${l.name})`)
    .join(", ");

  const prompt = `You are a professional video game and geek media journalist and translator.
Translate the following gaming news article from "${sourceLang}" into these languages: ${targetLangs}.
Keep gaming terms, game titles, studio names, and formatting (paragraphs/line breaks) natural and accurate for each language.

Return ONLY a valid JSON object without markdown code blocks, where keys are language codes (${LANGUAGES.filter((l) => l.code !== sourceLang)
    .map((l) => `"${l.code}"`)
    .join(", ")}) and each value is an object with "title" and "content" strings.

Original Title:
${title}

Original Content:
${content}`;

  const endpoint = new URL(
    "https://googleapis.com"
  );
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const rawText =
    data?.candidates?.at(0)?.content?.parts?.at(0)?.text || "{}";
  const parsed = JSON.parse(rawText);

  return {
    [sourceLang]: { title, content },
    ...parsed,
  } as Record<LangCode, { title: string; content: string }>;
}
