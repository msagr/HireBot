import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { PROMPT } from "@/constants";

export async function POST(req) {
  try {
    const { position, description } = await req.json();

    if (!position || !description) {
      return NextResponse.json(
        { error: "Position and description are required" },
        { status: 400 }
      );
    }

    // Prepare the final prompt by replacing placeholders
    const FINAL_PROMPT = PROMPT.replace("{{job-position}}", position).replace(
      "{{job-description}}",
      description
    );

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Sending request to OpenAI GPT-4.1...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      temperature: 0.7,
      response_format: { type: "json_object" }, 
    });

    // The response is already a parsed JSON object
    const questions = completion.choices[0]?.message?.content;

    if (!questions) {
      throw new Error("No content received from OpenAI");
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions", details: error.message },
      { status: 500 }
    );
  }
}
