import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Save messages and return the record id.
const saveToSupabase = async (messages: String, result: String) => {
  let { data, error } = await supabase
    .from('transactions')
    .insert([{ messages: messages, response: result }])
    .select();
  if (error) {
    console.log('m ' + error.message);
    console.log('h ' + error.hint);
    console.log('d ' + error.details);
    return -1;
  }
  if (data) {
    return data[0].id;
  }
};

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onFinal: async (result: string) => {
      // Save messages, response to supabase and return the record so we can send the id and created_at to the client
      console.log(result);
      const id = await saveToSupabase(JSON.stringify(messages), result);
      console.log(id);
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
