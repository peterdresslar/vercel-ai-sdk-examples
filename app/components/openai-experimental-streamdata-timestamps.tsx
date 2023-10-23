'use client';

import { useChat, Message } from 'ai/react';
import { FormEvent, useEffect, useState } from 'react';

interface DisplayMessage extends Message {
  timestamp?: any; // Define the type as needed
}

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('ChatGPT-3.5');
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [enableLog, setEnableLog] = useState(false);
  const [finishReason, setFinishReason] = useState('');
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    data,
  } = useChat({
    api: './api/chat/openai-experimental-streamdata',
  });

  // Utility function to set the timestamp to each message
  const setDisplayMessagesTimestamp = (data: any[]) => {
    let extendedMessages: DisplayMessage[] = [
      ...(messages as DisplayMessage[]),
    ];
    let dataPointer = 0;
    let isChanged = false;

    for (let i = 0; i < extendedMessages.length; i++) {
      if (extendedMessages[i].role === 'assistant') {
        while (dataPointer < data.length && !data[dataPointer].timestamp) {
          dataPointer++;
        }

        if (dataPointer < data.length && data[dataPointer].timestamp) {
          if (extendedMessages[i].timestamp !== data[dataPointer].timestamp) {
            extendedMessages[i].timestamp = data[dataPointer].timestamp;
            isChanged = true;
          }
          dataPointer++;
        }
      }
    }

    if (isChanged) {
      setDisplayMessages(extendedMessages);
    }
  };

  useEffect(() => {
    if (data && enableLog) {
      console.log('data is now ' + JSON.stringify(data));
    }
    //setDisplayMessages with the timestamp
    if (data && data.length > 0) {
      setDisplayMessagesTimestamp(data);
    }
  }, [data, enableLog, setDisplayMessagesTimestamp]);

  return (
    <div>
      {displayMessages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
          <span className="ml-2 text-sm font-mono">
            {m.role === 'assistant' ? (
              <>
                Server timestamp: {m.timestamp} Client timestamp:{' '}
                {m.createdAt ? m.createdAt.toTimeString() : 'N/A'}
              </>
            ) : null}
          </span>
        </div>
      ))}
      <div className="text-blue-500 text-sm">{finishReason}</div>

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
