'use client';

import { useEffect, useState } from 'react';
import ChatSdk from './chat-sdk';
import Chat from './chat';

export default function App() {
  const [enableSDK, setEnableSDK] = useState(true);
  useEffect(() => {
    console.log(enableSDK ? 'SDK enabled' : 'SDK disabled');
  }, [enableSDK]);

  return (
    <div className="mx-auto w-full max-w-md pb-24 flex flex-col stretch">
      <div className="mt-2">
              <label>
        Enable Anthropic SDK
        <input type="checkbox"
          checked={enableSDK}
          onChange={() => setEnableSDK(!enableSDK)} />
      </label>
      {/* swapping in the component that is hooked to the route in question, since this is the most reactful way */}
      {enableSDK ? <ChatSdk /> : <Chat />}
      </div>
    </div>
  );
}
