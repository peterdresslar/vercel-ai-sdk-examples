// This file names, labels, and provides filenames for the chats-n-more components in this directory.

export interface ChatOption {
  name: string;
  label: string;
  component: string;
}

export const ChatOptions: ChatOption[] = [
  //anthropic-chat
  {
    name: 'anthropic-chat',
    label: 'Anthropic Chat',
    component: 'anthropic-chat.tsx',
  },
  //anthropic-chat-sdk
  {
    name: 'anthropic-chat-sdk',
    label: 'Anthropic Chat SDK',
    component: 'anthropic-chat-sdk.tsx',
  },
  //anthropic sdk with prompts
  {
    name: 'anthropic-chat-sdk-with-prompts',
    label: 'Anthropic SDK with Prompts',
    component: 'anthropic-chat-sdk-with-prompts.tsx',
  },
  //huggingface oasst
  {
    name: 'huggingface-oasst',
    label: 'Huggingface OASST',
    component: 'huggingface-oasst.tsx',
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
  //openai with semi-custom frontend
  {
    name: 'openai-with-semi-custom-frontend',
    label: 'OpenAI with Semi-Custom Frontend',
    component: 'openai-with-semi-custom-frontend.tsx',
  },
  //openai stream with prompts
  {
    name: 'openai-stream-with-prompts',
    label: 'OpenAI Stream with Prompts',
    component: 'openai-stream-with-prompts.tsx',
  },
  //replicate llama2 chat
  {
    name: 'replicate-llama2-chat',
    label: 'Replicate Llama2 Chat',
    component: 'replicate-llama2-chat.tsx',
  },
  //langchain from example
  {
    name: 'langchain-from-example',
    label: 'Langchain from Example',
    component: 'langchain-from-example.tsx',
  },
  //langchain from example update
  {
    name: 'langchain-example-update',
    label: 'Langchain from Example Updated',
    component: 'langchain-example-update.tsx',
  },

  //openai with experimental_Streamdata
  // {
  //   name: 'openai-with-experimental-streamdata',
  //   label: 'OpenAI with Experimental Streamdata',
  //   component: 'openai-with-experimental-streamdata.tsx',
  // },
  //openai functions with custom frontend
  // {
  //   name: 'openai-functions-custom-frontend',
  //   label: 'OpenAI Functions with Custom Frontend',
  //   component: 'openai-functions-custom-frontend.tsx',
  // },
];
