import React, { memo } from 'react';
import {
  Gemini,
  Meta,
  OpenAI,
  Claude,
  DeepSeek,
  Aws,
  Mistral,
  Qwen,
} from '@lobehub/icons';
import { Cpu } from 'lucide-react';

interface LobeModelIconProps {
  model?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * Cloned from lobe-chat-ref/src/components/ModelTag/ModelIcon.tsx
 * Maps model identifiers to official AI provider brand icons
 */
export const LobeModelIcon = memo<LobeModelIconProps>(({ model: originModel = '', size = 14, style }) => {
  const model = originModel.toLowerCase();

  if (model.includes('gemini')) return <Gemini size={size} style={style} />;
  if (model.includes('llama') || model.includes('meta')) return <Meta size={size} style={style} />;
  if (model.includes('gpt') || model.includes('openai')) return <OpenAI size={size} style={style} />;
  if (model.includes('claude') || model.includes('anthropic')) return <Claude size={size} style={style} />;
  if (model.includes('deepseek')) return <DeepSeek size={size} style={style} />;
  if (model.includes('mistral') || model.includes('mixtral')) return <Mistral size={size} style={style} />;
  if (model.includes('qwen') || model.includes('tongyi')) return <Qwen size={size} style={style} />;
  if (model.includes('titan') || model.includes('bedrock')) return <Aws size={size} style={style} />;

  // Default fallback for Nemotron or local Hermes models
  return <Cpu size={size} style={{ color: 'var(--primary-color, #95f3d9)', ...style }} />;
});

LobeModelIcon.displayName = 'LobeModelIcon';
export default LobeModelIcon;
