'use client';

import { useChat } from 'ai/react';
import { useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat(
    // {api:'/api/chat/anthropic/route.ts'}
  );

  // lets useEffect to diagnose what is being sent to messages and send to console.log
  // messages is an array of objects with id, role, and content, so we need to do some work to push to the console
  useEffect(() => {
    if (messages.length = 0) {
      console.log('no messages');
    } else {
      for (let i = 0; i < messages.length; i++) {
        console.log(messages[i].role, messages[i].content);
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
      {isLoading ?
        <div>Loading...</div> // UseChat helper function to show loading message
        : null}
      {error ?
        <div className="text-red-500">Error: {error.message}</div> // UseChat helper function to show error message
        : null}

      <form onSubmit={handleSubmit}>
        <div className="fixed w-full max-w-md bottom-0 ">
          <label>
            Say something...
            <input
              className="border border-gray-300 rounded mb-8 shadow-xl p-2"
              value={input}
              onChange={handleInputChange}
            />
          </label>
          <button className="mx-2" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}