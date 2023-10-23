'use client';

import { useChat, Message } from 'ai/react';
import { useEffect, useState, useRef } from 'react';

interface DisplayMessage extends Message {
  timestamp?: any; // Define the type as needed
}

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('ChatGPT-3.5');
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [enableLog, setEnableLog] = useState(false);
  const [timestampMap, setTimestampMap] = useState(new Map<string, string>()); // Map of messageId to timeStamp
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

  // Utility function to update the timestampMap
  const updateTimestampMap = (data: any[]) => {
    let newTimestampMap = new Map(timestampMap);
    let timestampIndex = 0; // To match the timestamp with assistant message

    for (let i = 0; i < data.length; i++) {
      if (data[i].timestamp) {
        while (
          timestampIndex < messages.length &&
          messages[timestampIndex].role !== 'assistant'
        ) {
          timestampIndex++;
        }

        if (timestampIndex < messages.length) {
          const assistantMessage = messages[timestampIndex];
          newTimestampMap.set(assistantMessage.id, data[i].timestamp);
          timestampIndex++;
        }
      }
    }

    setTimestampMap(newTimestampMap);
  };

  const lastData = useRef(null);

  useEffect(() => {
    if (enableLog) {
      console.log('data', JSON.stringify(data));
    }
    if (data && data.length > 0) {
      //check if data is the same as lastData
      if (JSON.stringify(data) !== JSON.stringify(lastData.current)) {
        updateTimestampMap(data);
        lastData.current = data;
      }
    }
  }, [data]);

  //sync messages to displayMessages
  useEffect(() => {
    if (enableLog) {
      console.log('messages', JSON.stringify(messages));
    }
    const updatedDisplayMessages = [...displayMessages]; // Start with a copy of the existing displayMessages

    messages.forEach((newMsg, index) => {
      const existingMsgIndex = updatedDisplayMessages.findIndex(
        displayMsg => displayMsg.id === newMsg.id,
      );

      if (existingMsgIndex === -1) {
        // New message, add it to displayMessages
        updatedDisplayMessages.push({
          ...newMsg,
          timestamp: timestampMap.get(newMsg.id) || null, // Add the timestamp here
        });
      } else {
        // Existing message, update content but keep existing timestamp
        updatedDisplayMessages[existingMsgIndex] = {
          ...newMsg,
          timestamp:
            timestampMap.get(newMsg.id) ||
            updatedDisplayMessages[existingMsgIndex].timestamp, // Update or keep the existing timestamp
        };
      }
    });

    setDisplayMessages(updatedDisplayMessages);
  }, [messages]);

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
