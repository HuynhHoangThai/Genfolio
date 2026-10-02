import { ReactNode } from 'react';

export interface ChatModelCard {
  deploymentName?: string;
  description?: string;
  displayName?: string;
  enabled?: boolean;
  files?: boolean;
  functionCall?: boolean;
  id: string;
  isCustom?: boolean;
  legacy?: boolean;
  maxOutput?: number;
  tokens?: number;
  vision?: boolean;
}

export interface ModelProviderCard {
  chatModels: ChatModelCard[];
  checkModel?: string;
  defaultShowBrowserRequest?: boolean;
  disableBrowserRequest?: boolean;
  enabled?: boolean;
  id: string;
  modelList?: {
    azureDeployName?: boolean;
    notFoundContent?: ReactNode;
    placeholder?: string;
    showModelFetcher?: boolean;
  };
  name: string;
  proxyUrl?:
    | {
        desc?: string;
        placeholder: string;
        title?: string;
      }
    | false;
  showApiKey?: boolean;
}

export type LLMRoleType = 'user' | 'system' | 'assistant' | 'tool';

export interface LLMMessage {
  content: string;
  role: LLMRoleType;
}

export type FewShots = LLMMessage[];
