import { auth0 } from "@/lib/auth0";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, createTextStreamResponse } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth0.getSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { jobDescription } = await req.json();

  if (!jobDescription) {
    return new Response("Job description is required", { status: 400 });
  }

  try {
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      maxRetries: 0,
      system: `You are an elite Job Application Agent. 
      Analyze the provided job description and extract the following in a clear, structured JSON-like text format:
      1. Key Requirements (Skills, Years of Experience, Tech Stack)
      2. Company Values & Tone
      3. Contact Info (if any)
      4. Strategic Advice (How to tailor the application)
      5. A concise "Action Plan" for the user.
      
      Be professional, concise, and insightful.`,
      prompt: jobDescription,
    });

    return createTextStreamResponse({
      textStream: result.textStream,
    });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to start AI stream" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
