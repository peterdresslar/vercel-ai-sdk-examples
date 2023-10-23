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
    // Start by copying the existing messages to a mutable array (with a type assertion to bribe the IDE into quieting down)
    let extendedMessages: DisplayMessage[] = [
      ...(messages as DisplayMessage[]),
    ];

    // Initialize a pointer for the data array
    let dataPointer = 0;

    // Loop through the existing messages and apply timestamps sequentially
    for (let i = 0; i < extendedMessages.length; i++) {
      // If the message role is 'assistant', we want to apply the timestamp
      if (extendedMessages[i].role === 'assistant') {
        // Find the next timestamp in the data array
        while (dataPointer < data.length && !data[dataPointer].timestamp) {
          dataPointer++;
        }

        // Apply the timestamp if one is found
        if (dataPointer < data.length && data[dataPointer].timestamp) {
          extendedMessages[i].timestamp = data[dataPointer].timestamp;

          // Move the data pointer ahead for the next iteration
          dataPointer++;
        }
      }
    }

    // Update the state with the newly extended messages
    setDisplayMessages(extendedMessages);
  };

  useEffect(() => {
    if (data && enableLog) {
      console.log('data is now ' + JSON.stringify(data));
    }
    //setDisplayMessages with the timestamp
    if (data && data.length > 0) {
      setDisplayMessagesTimestamp(data);
    }
  }, [data, enableLog, messages, setDisplayMessagesTimestamp]); // Added messages as a dependency

  return (
    <div>
      {displayMessages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
          {m.timestamp}
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
