import React, { memo } from 'react';
import { Modal, Tag } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';
import { Cpu, Server, Check } from 'lucide-react';
import { LobeModelItemRender, ChatModelCard } from './LobeModelSelect';

interface LobeSettingsModalProps {
  open: boolean;
  onClose: () => void;
  currentModel: string;
  onSelectModel: (model: string) => void;
}

const AVAILABLE_MODELS: Array<ChatModelCard & { provider: string; badge?: string }> = [
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    displayName: 'Nemotron 3.5 Lightning (Free)',
    provider: 'OpenRouter / NVIDIA',
    tokens: 128000,
    files: true,
    vision: false,
    functionCall: true,
    description: 'Tốc độ cực nhanh, bóc tách chính xác toàn bộ cấu trúc CV & JSON',
    badge: 'Khuyên dùng',
  },
  {
    id: 'google/gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    provider: 'Google AI Studio',
    tokens: 1048576,
    files: true,
    vision: true,
    functionCall: true,
    description: 'Multimodal vision + document parsing native',
    badge: 'Chính thức',
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    displayName: 'Meta Llama 3.1 8B Instruct',
    provider: 'OpenRouter / Meta',
    tokens: 131072,
    files: true,
    vision: false,
    functionCall: true,
    description: 'Mô hình mã nguồn mở gọn nhẹ, xử lý text nhanh',
    badge: 'Dự phòng',
  },
  {
    id: 'deepseek/deepseek-chat',
    displayName: 'DeepSeek V3 Chat',
    provider: 'DeepSeek AI',
    tokens: 65536,
    files: true,
    vision: false,
    functionCall: true,
    description: 'Khả năng suy luận code và tổng hợp hồ sơ logic sâu sắc',
    badge: 'Mới',
  },
];

export const LobeSettingsModal: React.FC<LobeSettingsModalProps> = memo(({
  open,
  onClose,
  currentModel,
  onSelectModel,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Flexbox align="center" gap={8} horizontal>
          <Cpu style={{ width: 18, height: 18, color: '#10b981' }} />
          <span>Cài đặt Engine & Model AI (Hermes Bridge)</span>
        </Flexbox>
      }
      width={600}
    >
      <Flexbox gap={16} padding="12px 0">
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            Mô hình ngôn ngữ bóc tách CV (LLM Extractor)
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.55)', marginBottom: 12 }}>
            Chọn model được máy chủ FastAPI Hermes Bridge sử dụng khi phân tích tài liệu CV.
          </div>

          <Flexbox gap={8}>
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = currentModel === model.id;
              return (
                <div
                  key={model.id}
                  style={{
                    position: 'relative',
                    borderRadius: 12,
                    background: isSelected ? 'rgba(149, 243, 217, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid var(--primary-color, #FAFAFA)' : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LobeModelItemRender
                    {...model}
                    onClick={() => onSelectModel(model.id)}
                    selected={isSelected}
                  />
                  {model.badge && (
                    <div style={{ position: 'absolute', top: 8, right: 8 }}>
                      <Tag color={isSelected ? 'cyan' : 'default'} style={{ fontSize: 9 }}>
                        {model.badge}
                      </Tag>
                    </div>
                  )}
                </div>
              );
            })}
          </Flexbox>
        </div>

        {/* Server Status Section */}
        <Flexbox
          gap={8}
          padding="12px 14px"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 12,
          }}
        >
          <Flexbox align="center" gap={6} horizontal style={{ fontSize: 12, fontWeight: 700, color: '#ddd' }}>
            <Server style={{ width: 14, height: 14, color: '#06b6d4' }} />
            <span>Trạng thái kết nối Máy chủ Backend</span>
          </Flexbox>

          <Flexbox align="center" distribution="space-between" horizontal style={{ fontSize: 11, color: '#888' }}>
            <span>FastAPI Server</span>
            <Tag color="green">http://localhost:3000 (Connected)</Tag>
          </Flexbox>

          <Flexbox align="center" distribution="space-between" horizontal style={{ fontSize: 11, color: '#888' }}>
            <span>Microsoft MarkItDown</span>
            <Tag color="cyan">Active · Multi-Format Parser</Tag>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </Modal>
  );
});

LobeSettingsModal.displayName = 'LobeSettingsModal';
export default LobeSettingsModal;
