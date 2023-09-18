// ./app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

// Create an Anthropic API client (that's edge friendly??)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();

  // Ask Claude for a streaming chat completion given the prompt
  const response = await anthropic.completions.create({
    prompt: `${Anthropic.HUMAN_PROMPT} ${messages} ${Anthropic.AI_PROMPT}`,
    model: 'claude-2',
    stream: true,
    max_tokens_to_sample: 300,
  });
  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
