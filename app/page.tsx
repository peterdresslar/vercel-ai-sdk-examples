'use client';

import { useEffect, useState } from 'react';
import { ChatOption, ChatOptions } from './chats-n-more/ChatOptions';

export default function App() {
  const [chatChoice, setChatChoice] = useState(ChatOptions[0]);
  const [DynamicComponent, setDynamicComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    console.log(chatChoice);

    import(`./chats-n-more/${chatChoice.component}`)
      .then(module => {
        setDynamicComponent(() => module.default);
      })
      .catch(err => {
        console.error(err);
      });
  }, [chatChoice]);

  const handleChange = (chatOption: ChatOption) => {
    setChatChoice(chatOption);
  };

  return (
    <div className="mx-auto w-full max-w-md pb-24 flex flex-col stretch">
      <div className="mt-2">
        <label>Choose a Chat</label>
        <select
          className="border border-gray-300 rounded mb-8 ml-2 shadow-xl p-2"
          value={chatChoice.name}
          onChange={e =>
            handleChange(
              ChatOptions.find(c => c.name === e.target.value) as ChatOption,
            )
          }
        >
          {ChatOptions.map((option, index) => (
            <option key={index} value={option.name}>
              {option.label}
            </option>
          ))}
        </select>
        <div id="chatComponentDiv">
          {DynamicComponent ? <DynamicComponent /> : 'Loading...'}
        </div>
      </div>
    </div>
  );
}
