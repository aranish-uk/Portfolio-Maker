import { parsedResumeSchema, type ParsedResumeSchema } from "./schemas";

const SYSTEM_PROMPT = `You extract structured resume data. Return JSON only. No markdown, no commentary.`;

const USER_PROMPT_PREFIX = `Extract this resume into JSON with this exact shape:\n\n{\n  \"name\": string,\n  \"headline\": string,\n  \"summary\": string,\n  \"skills\": string[],\n  \"experience\": [{ \"company\": string, \"role\": string, \"start\": string, \"end\": string, \"highlights\": string[] }],\n  \"education\": [{ \"school\": string, \"degree\": string, \"start\": string, \"end\": string }],\n  \"projects\": [{ \"name\": string, \"description\": string, \"url\": string?, \"highlights\": string[] }],\n  \"links\": [{ \"label\": string, \"url\": string }]\n}\n\nResume text:\n`;

function getProviderConfig() {
  const provider = (process.env.AI_PROVIDER || "groq").toLowerCase();

  if (provider === "openrouter") {
    return {
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
    };
  }

  return {
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  };
}

function extractJsonFromText(value: string): string {
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return JSON content.");
  }
  return value.slice(start, end + 1);
}

export async function parseModelJsonWithRepair(
  raw: string,
  repair: (badText: string) => Promise<string>,
): Promise<ParsedResumeSchema> {
  try {
    const parsed = JSON.parse(extractJsonFromText(raw));
    return parsedResumeSchema.parse(parsed);
  } catch {
    const repaired = await repair(raw);
    const parsed = JSON.parse(extractJsonFromText(repaired));
    return parsedResumeSchema.parse(parsed);
  }
}

async function runChatCompletion(prompt: string): Promise<string> {
  const config = getProviderConfig();
  if (!config.apiKey) {
    throw new Error("Missing AI provider API key in environment.");
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.1,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI request failed: ${text}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI response missing content.");
  }
  return content;
}

export async function parseResumeWithAI(resumeText: string): Promise<ParsedResumeSchema> {
  const first = await runChatCompletion(`${USER_PROMPT_PREFIX}${resumeText}`);
  return parseModelJsonWithRepair(first, async (badText) => {
    return runChatCompletion(
      `Repair the following into valid JSON for the required schema and return only JSON:\n\n${badText}`,
    );
  });
}
