'use client';

import { useChat } from 'ai/react';
import { useEffect, useState } from 'react';

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('ChatGPT-3.5');
  const [enableLog, setEnableLog] = useState(false);
  const [customMessages, setCustomMessages] = useState<CustomMessage[]>([]);
  const { input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: './api/chat/openai-handlers',
  });

  // CustomMessage interface just like Message, but with a isSpecial flag:
  interface CustomMessage {
    id: string;
    content: string;
    role: string;
    isLeetified: boolean;
  }

  useEffect(() => {
    if (enableLog) {
      if (customMessages.length === 0) {
        console.log('no messages');
      } else {
        for (let i = 0; i < customMessages.length; i++) {
          console.log(customMessages[i].content, customMessages[i].isLeetified);
        }
      }
    }
  }, [customMessages, enableLog]);

  // Process content by turning it into 1337speek:
  const customContentProcessor = (content: string) => {
    return content.replace(/a/g, '4').replace(/e/g, '3').replace(/i/g, '1');
  };

  // Our custom fetch function that plugs fetch results into CustomMessage objects:
  const fetchCustomMessages = async (
    onResponse?: (res: Response) => Promise<void>,
  ) => {
    const response = await fetch('./api/chat/openai-handlers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: customMessages,
      }),
    }).catch(err => {
      console.log(err); //you might want to do something here to handle errors and restore state of customMessages
      throw err;
    });

    if (onResponse) {
      try {
        await onResponse(response);
      } catch (err) {
        throw err;
      }
    }

    if (!response.ok) {
      // Restore the previous messages if the request fails.
      throw new Error(
        (await response.text()) || 'Failed to fetch the chat response.',
      );
    }

    if (!response.body) {
      throw new Error('The response body is empty.');
    }

    // const newMessages = response.messages.map((m: any) => {
    //   return {
    //     id: m.id,
    //     content: customContentProcessor(m.content),
    //     role: m.role,
    //     isLeetified: true,
    //   };
    // });
    // setCustomMessages(newMessages);
  };

  const customHandleSubmit = (e: any) => {
    e.preventDefault();
    fetchCustomMessages();
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

      <form onSubmit={customHandleSubmit}>
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
