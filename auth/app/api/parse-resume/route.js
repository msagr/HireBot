import { OpenAI } from "openai";
import { fileTypeFromBuffer } from "file-type";
import pdfParse from "pdf-parse";        // npm install pdf-parse
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // server-side only
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Check file type
    const type = await fileTypeFromBuffer(buffer);
    if (!type || !["pdf", "doc", "docx", "txt"].includes(type.ext)) {
      return new Response(
        JSON.stringify({ error: "Unsupported file type" }),
        { status: 400 }
      );
    }

    // Extract text
    let resumeText = "";
    if (type.ext === "pdf") {
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } else if (type.ext === "txt") {
      resumeText = buffer.toString("utf-8");
    } else {
      // DOC/DOCX parsing can be added using mammoth or docx library
      return new Response(
        JSON.stringify({ error: "DOC/DOCX parsing not implemented yet" }),
        { status: 400 }
      );
    }

    // Send extracted text to OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a resume parser. Extract name, email, and phone. Respond strictly in JSON: {\"name\": \"...\", \"email\": \"...\", \"phone\": \"...\"}",
        },
        { role: "user", content: resumeText },
      ],
    });

    const text = completion.choices[0].message.content;
    const data = JSON.parse(text);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error parsing resume:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
