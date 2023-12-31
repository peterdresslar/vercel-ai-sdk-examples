// This file names, labels, and provides filenames for the chats-n-more components in this directory.

export interface ChatOption {
  name: string;
  label: string;
  component: string;
}

export const ChatOptions: ChatOption[] = [
  //anthropic-chat-sdk
  {
    name: 'anthropic-chat-sdk',
    label: 'Anthropic Chat SDK',
    component: 'anthropic-chat-sdk.tsx',
  },
  //anthropic-chat
  {
    name: 'anthropic-chat',
    label: 'Anthropic Chat',
    component: 'anthropic-chat.tsx',
  },
  //completion
  {
    name: 'completion',
    label: 'OpenAI Completion',
    component: 'completion.tsx',
  },
  //multi-prompt completion
  {
    name: 'multi-prompt-completion',
    label: 'OpenAI Multi-Prompt Completion',
    component: 'multi-prompt-completion.tsx',
  },
  //openai chat with supabase
  {
    name: 'openai-chat-with-supabase',
    label: 'OpenAI Chat with Supabase',
    component: 'openai-chat-with-supabase.tsx',
  },
  //openai stream with handlers
  {
    name: 'openai-stream-with-handlers',
    label: 'OpenAI Stream with Handlers',
    component: 'openai-stream-with-handlers.tsx',
  },
  //openai with functions
  {
    name: 'openai-with-functions',
    label: 'OpenAI with Functions',
    component: 'openai-with-functions.tsx',
  },
  // //openai with semi-custom frontend
  // {
  //   name: 'openai-with-semi-custom-frontend',
  //   label: 'OpenAI with Semi-Custom Frontend',
  //   component: 'openai-with-semi-custom-frontend.tsx',
  // },
  //openai with experimental_Streamdata
  {
    name: 'openai-experimental-streamdata-finish',
    label: 'OpenAI with Experimental Streamdata FinishReason',
    component: 'openai-experimental-streamdata-finish.tsx',
  },
  //openai with experimental_Streamdata timestamps
  {
    name: 'openai-experimental-streamdata-timestamps',
    label: 'OpenAI with Experimental Streamdata Timestamps',
    component: 'openai-experimental-streamdata-timestamps.tsx',
  },
  //openai functions with custom frontend
  // {
  //   name: 'openai-functions-custom-frontend',
  //   label: 'OpenAI Functions with Custom Frontend',
  //   component: 'openai-functions-custom-frontend.tsx',
  // },
];
