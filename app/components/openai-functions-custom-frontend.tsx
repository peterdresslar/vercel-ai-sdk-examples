// THIS IS STILL WIP

'use client';

import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';

// CustomMessage interface just like Message, but with a isSpecial flag:
interface CustomMessage {
  id: string;
  content: string;
  role: string;
  isSpecial: boolean;
}

const checkIsSpecial = (content: string) => {
  if (content.includes('special')) {
    return true;
  }
  return false;
};

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('ChatGPT-3.5');
  const [enableLog, setEnableLog] = useState(false);
  const [customMessages, setCustomMessages] = useState<CustomMessage[]>([]);
  const { input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: './api/chat/openai-functions',
  });

  useEffect(() => {
    if (enableLog) {
      if (customMessages.length === 0) {
        console.log('no messages');
      } else {
        for (let i = 0; i < customMessages.length; i++) {
          console.log(JSON.stringify(customMessages[i]));
        }
      }
    }
  }, [customMessages, enableLog]);

  // Our custom fetch function that plugs fetch results into CustomMessage objects:
  const fetchCustomMessages = async () => {
    const response = await fetch('./api/chat/openai-functions');
    const data = await response.json();
    // Log raw response chunks as they arrive:
    if (enableLog) {
      console.log(data);
    }
    const newMessages = data.messages.map((m: any) => {
      return {
        id: m.id,
        content: m.content,
        role: m.role,
        isSpecial: checkIsSpecial(m.content),
      };
    });
    setCustomMessages(newMessages);
  };

  return (
    <div>
      {customMessages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      {/* These items are not in the example, but very helpful helper functions */}
      {isLoading ? (
        <div className="text-green-700">Loading...</div> // UseChat helper function to show loading message
      ) : null}
      {error ? ( // Right now, error does not get cleared on a successful submit. So we use a helper flag to know when to show it.
        <div className="text-red-500">Error: {error.message}</div> // UseChat helper function to show error message
      ) : null}

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
