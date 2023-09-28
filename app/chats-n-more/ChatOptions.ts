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
];