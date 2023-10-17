export const runtime = 'edge';

import OpenAI from 'openai';
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  console.log(`streaming`);

  const data = new experimental_StreamData();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    max_tokens: 400,
    messages,
  });

  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream, {}, data);
}
