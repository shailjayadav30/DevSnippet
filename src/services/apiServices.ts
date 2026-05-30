import { getGeminiKey } from "./storageService";

export type GeminiModelId =
  | "gemini-2.5-flash"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-thinking-exp-01-21"
  | "gemini-1.5-pro"
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-8b";

// v1beta supports both stable and preview/experimental models
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const resolveApiKey = async (): Promise<string> => {
  if (process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    return process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  }
  const stored = await getGeminiKey();
  if (stored) return stored;
  throw new Error("No Gemini API key found. Add it in Settings.");
};

export const explainCode = async (
  code: string,
  language: string,
  model: GeminiModelId = "gemini-2.5-flash"
): Promise<string> => {
  try {
    const apiKey = await resolveApiKey();

    const prompt = `You are an expert software engineer specializing in ${language}.

Analyze THIS exact ${language} code carefully:

\`\`\`${language}
${code}
\`\`\`

Rules:
- Explain ONLY this specific code
- Be precise and technical
- Mention what each function / block does
- Explain the execution flow step by step
- Note any potential bugs or edge cases
- Suggest concrete improvements

Format your response using these exact headings:

# What This Code Does

# Key Logic & Important Parts

# Execution Flow

# Potential Issues

# Suggested Improvements
`;

    const res = await fetch(
      `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err?.error?.message ?? `HTTP ${res.status}: ${res.statusText}`
      );
    }

    const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No explanation was generated."
    );
  } catch (error: any) {
    console.log("Gemini error:", error?.message ?? error);
    return `**Error:** ${error?.message ?? "Something went wrong calling the AI."}`;
  }
};
