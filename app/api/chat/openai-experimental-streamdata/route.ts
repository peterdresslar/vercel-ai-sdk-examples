export const runtime = 'edge';

// Let's see if we can do something interesting: We want to access information from the OpenAI API Chat Completion Chunk object
// returned by the OpenAI Chat Completion API at https://api.openai.com/v1/chat/completions. Then we want to send the stop reason to the front end.

import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from 'ai';

const apiKey = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  let resolveFinishPromise: (finishReason: string) => void;
  const finishPromise = new Promise(resolve => {
    resolveFinishPromise = resolve;
  });

  const { messages } = await req.json();
  // Instantiate the StreamData.
  const data = new experimental_StreamData();

  // construct our request to the OpenAI API with fetch
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
    }),
  });
  if (response.body) {
    const [stream1, stream2] = response.body.tee();

    const newResponse = new Response(stream1, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });

    const stream = OpenAIStream(newResponse, {
      onToken(token) {
        console.log('token', token);
        console.log(token);
      },
      onCompletion(completion) {
        console.log('completion', completion);
      },
      onFinal(final) {
        console.log('final', final);
        //hang on and wait to read a value to finish:
        let finishReason = 'no finish reason';

        finishPromise.then(reason => {
          console.log('finishing with reason', reason);
          data.append({ text: `finish reason ${reason}` });
          // append a time-stamp, just a user-friendly string with the time in seconds.
          const ts = new Date();
          const timestamp = `${ts.getHours()}:${ts.getMinutes()}:${ts.getSeconds()}`;
          data.append({ timestamp });
          data.close();
        });
      },
      experimental_streamData: true,
    });

    // Use stream2 to get the finish_reason
    const reader2 = stream2.getReader();
    let finishReason = 'no finish reason';
    reader2.read().then(async function processText({
      done,
      value,
    }): Promise<void> {
      const regex = /"finish_reason"\s*:\s*"(\w+)"/;

      if (value === undefined) {
        return;
      }

      const text = new TextDecoder('utf-8').decode(value);
      console.log(`testing text: ${text}`);
      const match = regex.exec(text);

      if (match && match[1]) {
        finishReason = match[1];
        console.log(`match: ${finishReason}`);
        resolveFinishPromise(finishReason);
        return;
      }

      if (done) {
        //this does not seem to be firing, would be nice to resolve.
        console.log('About to resolve promise with: ', finishReason);
        resolveFinishPromise(finishReason);
        return;
      }

      const result_1 = await reader2.read();
      return processText(result_1);
    });

    return new StreamingTextResponse(stream, {}, data);
  } else {
    return new Response('no response body', { status: 500 });
  }
}
