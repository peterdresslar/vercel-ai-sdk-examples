export const runtime = 'edge';

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCurrentWeather(
  location: string | unknown,
  unit: string | unknown,
) {
  const weatherInfo = {
    location: location || 'Honolulu, HI', //default to a good place
    temperature: '72',
    unit: unit || 'fahrenheit', //default to fahrenheit
    forecast: ['sunny', 'windy'],
  };
  return JSON.stringify(weatherInfo);
}

const functions = [
  {
    name: 'get_current_weather',
    description: 'Get the current weather in a given location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco, CA',
        },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
      },
      required: ['location'],
    },
  },
];

// And use it like this:
export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
    functions,
    function_call: 'auto', // auto is default, but we'l be explicit
  });

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      // if you skip the function call and return nothing, the `function_call`
      // message will be sent to the client for it to handle
      if (name === 'get_current_weather') {
        // Call a weather API here
        const weatherData = await getCurrentWeather(args.location, args.unit);

        // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        const newMessages = createFunctionCallMessages(weatherData);
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          functions,
        });
      }
    },
  });
}
