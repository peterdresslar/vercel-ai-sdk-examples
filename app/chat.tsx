'use client';

import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('Claude');
  const [successFlag, setSuccessFlag] = useState(false); // This is a flag to show the error message.
  const [enableLog, setEnableLog] = useState(false);
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
    <div>
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
