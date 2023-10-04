export const runtime = 'edge';

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  console.log(`streaming`);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    max_tokens: 400,
    messages,
  });
  const stream = OpenAIStream(response, {
    onStart: () => {
      // Do something when the stream starts
      console.log(`stream started!`);
    },
    onToken: (chunk: string) => {
      // Add the chunk
      console.log(`this is a token! ${chunk}`);
    },
    onCompletion: (completion: string) => {
      // Save the chunk
      console.log(`this is a completion! ${completion}`);
    },
    onFinal: (completion: string) => {
      // Save messages, response to supabase and return the record id
      console.log(`this is the final! ${completion}`);
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
