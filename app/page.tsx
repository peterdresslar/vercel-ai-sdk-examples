'use client';

import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('Claude');
  const [enableLog, setEnableLog] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat(
    // {api:'/api/chat/anthropic/route.ts'} // in case we want to try two routes
  );

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
  }
    , [messages]);

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      {/* These items are not in the example, but very helpful helper functions */}
      {isLoading ?
        <div className="text-green-700">Loading...</div> // UseChat helper function to show loading message
        : null}
      {error ?
        <div className="text-red-500">Error: {error.message}</div> // UseChat helper function to show error message
        : null}

      <form onSubmit={handleSubmit}>
        <div className="fixed w-full max-w-md bottom-4 ">
          <label>
            Say to {providerNickname}...
            <input
              className="border border-gray-300 rounded mb-8 shadow-xl p-2"
              value={input}
              onChange={handleInputChange}
            />
          </label>
          <button className="mx-2" type="submit">Send</button>
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
      </div>
    </div>
  );
}