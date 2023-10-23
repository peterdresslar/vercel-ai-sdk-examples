'use client';

import { useChat } from 'ai/react';
import { useEffect, useState, useRef } from 'react';

export default function Chat() {
  const [providerNickname, setProviderNickname] = useState('ChatGPT-3.5');
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

  //lastData useRef to only update finish reason when data actually updates
  const lastData = useRef(null);

  useEffect(() => {
    if (data && enableLog) {
      console.log(JSON.stringify(data));
    }
    if (data && JSON.stringify(data) !== JSON.stringify(lastData.current)) {
      const lastItem = data[data.length - 2];

      if (lastItem) {
        if (lastItem.text) {
          setFinishReason(lastItem.text);
        } else {
          console.warn(
            'Last item exists but no text property found:',
            lastItem,
          );
        }
      } else {
        console.warn('Data exists but last item is undefined:', data);
      }

      lastData.current = data; // Update lastData ref to current data
    }
  }, [data, enableLog]);

  // we extend the handleSubmit function to clear the finish reason when the user submits a new message
  const handleSubmitExtended = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFinishReason('');
    handleSubmit(e);
  };

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
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
