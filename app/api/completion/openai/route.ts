import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();
  console.log(`working on completion for prompt: ${prompt}`);

  // Ask OpenAI for a streaming completion given the prompt
  const completion = await openai.completions.create({
    model: 'text-davinci-003',
    max_tokens: 4000,
    stream: true,
    prompt,
  });

  // Convert the response into a friendly text-stream, keeping in mind the type that openai completions returns
  const stream = OpenAIStream(completion as any, {
    onToken: token => {
      console.log(token);
    },
  }); //presuming we are safe with completions API. Not a good final solution.

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
