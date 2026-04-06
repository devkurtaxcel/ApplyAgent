import { auth0 } from "@/lib/auth0";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export const maxDuration = 30;

export const POST = async (req: Request) => {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return new Response("Job description is required", { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }, { apiVersion: "v1" });

    const prompt = `You are an elite Job Application Agent. Analyze the provided job description and produce a professional strategic report in clean Markdown format.

Use the EXACT section structure below. Use **bold** for emphasis, bullet points for lists, and keep it concise and actionable. Do NOT output JSON or code blocks.

## 🎯 Key Requirements
- List the required skills, years of experience, and tech stack as bullet points.

## 🏢 Company Culture & Tone
- Describe the company's values, work style, and communication tone inferred from the description.

## 📬 Contact Information
- Extract any email, name, or application link found. If none, write "Not specified in description."

## 💡 Strategic Advice
- Provide 3-5 bullet points on how to tailor the resume and cover letter for maximum impact.

## 🚀 Action Plan
- Give a numbered step-by-step action plan the applicant should follow immediately.

Be professional, concise, and insightful. Write as a senior recruiter advising a top candidate.

---
**JOB DESCRIPTION TO ANALYZE:**

${jobDescription}`;

    const result = await model.generateContentStream(prompt);

    // Create a custom ReadableStream to match the AI SDK Data Stream protocol
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          // The dashboard expectation: 0:"..." format
          const formattedChunk = `0:${JSON.stringify(text)}\n`;
          controller.enqueue(new TextEncoder().encode(formattedChunk));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error('[Analyze Error]:', error);
    return new Response(`[Analysis Failed]: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
};
