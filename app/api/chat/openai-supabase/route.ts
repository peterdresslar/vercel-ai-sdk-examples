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
    console.log('Supabase error! ' + error.message);
    return -1; //or whatever you want to do here
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
  // Since we are using a stream, we need to paste together the chunks to create a final completion to store to the db
  // we will use the onCompletion and onFinal events to do this.

  // using completionString to build up the final completion
  let completionString = '';

  // let's get chunky
  const stream = OpenAIStream(response, {
    onToken: (chunk: string) => {
      // Add the chunk
      console.log(chunk);
      completionString += chunk;
    },
    onFinal: async () => {
      // Save messages, response to supabase and return the record id
      console.log(completionString);
      const id = await saveToSupabase(
        JSON.stringify(messages),
        completionString,
      );
      console.log(id);
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
