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
];
