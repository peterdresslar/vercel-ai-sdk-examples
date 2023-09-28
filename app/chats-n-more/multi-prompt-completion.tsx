'use client';

import { useCompletion } from 'ai/react';
import { useEffect, useState } from 'react';

export default function Completion() {
  const [providerNickname, setProviderNickname] =
    useState('OpenAI Completions');
  const [successFlag, setSuccessFlag] = useState(false); // This is a flag to show the error message.
  const [enableLog, setEnableLog] = useState(false);

  //our two input states, one for noun and one for verb
  const [noun, setNoun] = useState('');
  const [verb, setVerb] = useState('');

  const { completion, input, complete, isLoading, error } = useCompletion({
    api: './api/completion/openai',
    // add an onFinish callback to set the success flag
    //   onFinish: () => {
    //     setSuccessFlag(true);
    //   },
  });

  useEffect(() => {
    if (enableLog) {
      console.log(noun, verb);
    }
  }, [noun, verb]);

  // extend handleSubmit to clear the success flag. note type
  const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessFlag(false);
    complete(
      `Good luck, thank you, and I know you can do this! Please create a phrase incorporating the noun ${noun} and verb ${verb} that works as a company name. Be creative. If you are having trouble let me know.`,
    );
  };

  return (
    <div>
      <pre className="whitespace-pre-wrap">{completion}</pre>

      {/* These items are not in the example, but very helpful helper functions */}
      {isLoading ? (
        <div className="text-green-700">Loading...</div> // UseChat helper function to show loading message
      ) : null}
      {error && !successFlag ? ( // Right now, error does not get cleared on a successful submit. So we use a helper flag to know when to show it.
        <div className="text-red-500">Error: {error.message}</div> // UseChat helper function to show error message
      ) : null}

      <form onSubmit={handleSubmitExtended}>
        <div className="fixed flex w-[300px] bottom-4 ">
          <label>
            Say a Noun...
            <input
              className="border border-gray-300 rounded mb-8 shadow-xl p-2"
              value={noun}
              onChange={e => setNoun(e.target.value)}
            />
          </label>
          <label className="ml-2">
            Say a Verb...
            <input
              className="border border-gray-300 rounded mb-8 shadow-xl p-2"
              value={verb}
              onChange={e => setVerb(e.target.value)}
            />
          </label>
          <button className="mx-2" type="submit">
            Send
          </button>
        </div>
      </form>
      {/* Logging not in the example, but can be helpful */}
      <div className="fixed w-full max-w-md bottom-2 ">
        <label>
          Enable client logging
          <input
            type="checkbox"
            checked={enableLog}
            onChange={() => setEnableLog(!enableLog)}
          />
        </label>
      </div>
    </div>
  );
}
