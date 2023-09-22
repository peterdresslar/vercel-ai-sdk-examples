'use client';

import { useChat } from 'ai/react';
import { use, useEffect, useState } from 'react';

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('Claude');
  const [successFlag, setSuccessFlag] = useState(false); // This is a flag to show the error message.
  const [enableLog, setEnableLog] = useState(false);
  const [enableSDK, setEnableSDK] = useState(true);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: './api/chat/anthropic-sdk',
      // add an onFinish callback to set the success flag
      onFinish: () => {
        setSuccessFlag(true);
      },
    });

  // extend handleSubmit to clear the success flag. note type
  const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
    setSuccessFlag(false);
    handleSubmit(e);
  };

  // const handleEnableSDK = (e: React.FormEvent<HTMLFormElement>) => {
  //   if (isLoading) { // If we are loading, we can't toggle the SDK
  //     return;
  //   }
  //   //if we toggle, we have to rebuild the chat with a new useChat call with the new api. For clarity we set the api first
  //   let api;
  //   enableSDK ? api = '/api/chat/anthropic-sdk' : api = '/api/chat/anthropic';
  //   //then we replace useChat with the new api, passing in our current messages and input
  //   useChat(
  // If user wants, let useEffect diagnose what is being sent to messages and send to console.log
  useEffect(() => {
    if (enableLog) {
      if (messages.length === 0) {
        console.log('no messages');
      } else {
        for (let i = 0; i < messages.length; i++) {
          console.log(messages[i].role, messages[i].content);
        }
      }
    }
  }, [messages]);

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      {/* These items are not in the example, but very helpful helper functions */}
      {isLoading ? (
        <div className="text-green-700">Loading...</div> // UseChat helper function to show loading message
      ) : null}
      {error && !successFlag ? ( // Right now, error does not get cleared on a successful submit. So we use a helper flag to know when to show it.
        <div className="text-red-500">Error: {error.message}</div> // UseChat helper function to show error message
      ) : null}

      <form onSubmit={handleSubmitExtended}>
        <div className="fixed w-full max-w-md bottom-4 ">
          <label>
            Say to {providerNickname}...
            <input
              className="border border-gray-300 rounded mb-8 shadow-xl p-2"
              value={input}
              onChange={handleInputChange}
            />
          </label>
          <button className="mx-2" type="submit">
            Send
          </button>
        </div>
      </form>
      {/* Logging not in the example, but can be helpful */}
      <div className="fixed w-full max-w-md bottom-1 ">
        <label>
          Enable client logging
          <input
            type="checkbox"
            checked={enableLog}
            onChange={() => setEnableLog(!enableLog)}
          />
        </label>
        <label>
          Enable Anthropic SDK
          <input
            type="checkbox"
            checked={enableSDK}
            onChange={() => setEnableLog(!enableSDK)}
          />
        </label>
      </div>
    </div>
  );
}
