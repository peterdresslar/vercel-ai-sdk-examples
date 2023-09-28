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

  try {
    // Ask OpenAI for a streaming completion given the prompt
    const completion = await openai.completions.create({
      model: 'text-davinci-003',
      stream: true,
      prompt,
    });

    if (!completion) {
      throw new Error('No response from OpenAI');
    }

    // Convert the response into a friendly text-stream, keeping in mind the type that openai completions returns
    const stream = OpenAIStream(completion as any); //presuming we are safe with completions

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response('An error occurred with text processing.', {
      status: 500,
    });
  }
}
