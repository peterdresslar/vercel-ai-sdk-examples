export const runtime = 'edge';

import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import { AnthropicPrompt } from '../../../../../ai/packages/core/prompts/index.ts';

// Create an Anthropic API client (that's edge friendly??)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  const myPrompt = AnthropicPrompt(messages);
  // NOTE ADD A TOGGLE TO THE UI TO SWITCH SYSTEM MESSAGE ON OR OFF.
  myPrompt.addMessage(
    'Please review the prompt and follow the example for output.',
    'system',
  );
  myPrompt.addMessage(
    'your response should look like what in <example></example> tags.',
    'user',
    'after',
  );
  myPrompt.addMessage('<example>[...some example]</example>', 'user', 'after');

  const response = await anthropic.completions.create({
    prompt: myPrompt.toPrompt(),
    model: 'claude-2',
    stream: true,
    max_tokens_to_sample: 300,
  });
  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
