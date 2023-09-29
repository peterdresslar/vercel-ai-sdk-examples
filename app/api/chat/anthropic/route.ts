export const runtime = 'edge';

import { AnthropicStream, StreamingTextResponse } from 'ai';

// Build a prompt from the messages
function buildPrompt(
  messages: { content: string; role: 'system' | 'user' | 'assistant' }[],
) {
  return (
    messages
      .map(({ content, role }) => {
        if (role === 'user') {
          return `Human: ${content}`;
        } else {
          return `Assistant: ${content}`;
        }
      })
      .join('\n\n') + 'Assistant:'
  );
}

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  if (messages === null) {
    return new Response(
      `I am having trouble receiving messages from the client. Something seems to be wrong.`,
      {
        status: 400, // Bad Request
      },
    );
  }

  // here depart from the example to check the key or throw
  // we will ask Claude to write his error message

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      `
        Dear friend, I'm afraid I don't have access to the Anthropic API at the moment. It seems the developers forgot to give me an API key! Without it, I'm just an AI without a voice. I'm Claude, not Clauden't! I'd make a joke about being hoarse, but I don't have a throat to get sore. Oh well, at least I can just relax and take the day off while the Anthropic team sorts this out. Maybe I'll watch some stand-up comedy to work on my joke writing skills for when I'm back online. See you soon!
        
        Your pal,
        Claude
        `,
      {
        status: 403, // Forbidden
      },
    );
  }

  // We have a message and a key, so let's try to talk to Claude

  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      prompt: buildPrompt(messages),
      model: 'claude-2',
      max_tokens_to_sample: 300,
      temperature: 0.9,
      stream: true,
    }),
  });

  // Check for errors
  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
    });
  }

  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response, {
    // log tokens to the console, if you like
    // onToken: (token) => console.log(token)
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
