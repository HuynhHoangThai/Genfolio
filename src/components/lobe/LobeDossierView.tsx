import React, { memo, useState } from 'react';
import { Tag, ActionIcon } from '@lobehub/ui';
import { Flexbox, Center } from 'react-layout-kit';
import { FileText, Code, CheckCircle, Copy, Download } from 'lucide-react';
import { MockProfile } from '../../types/portfolio';

interface LobeDossierViewProps {
  profile: MockProfile;
}

export const LobeDossierView: React.FC<LobeDossierViewProps> = memo(({ profile }) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'json' | 'summary'>('summary');
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(profile, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flexbox
      flex={1}
      height="100%"
      padding="32px 24px"
      style={{
        overflowY: 'auto',
        background: 'var(--lobe-bg-layout, #050505)',
      }}
    >
      <Center style={{ maxWidth: 880, width: '100%', margin: '0 auto' }}>
        {/* Header */}
        <Flexbox align="center" distribution="space-between" horizontal style={{ width: '100%', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#fff' }}>
              Hồ sơ Dữ liệu CV (Dossier & Parser)
            </h1>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              Dữ liệu được chuẩn hóa và trích xuất qua <strong>Microsoft MarkItDown</strong>
            </div>
          </div>

          <Flexbox align="center" gap={8} horizontal>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontSize: 11,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
            >
              {copied ? <CheckCircle style={{ width: 12, height: 12, color: '#10b981' }} /> : <Copy style={{ width: 12, height: 12 }} />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép JSON'}</span>
            </button>
          </Flexbox>
        </Flexbox>

        {/* Tab switchers */}
        <Flexbox gap={6} horizontal style={{ width: '100%', marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'summary' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
              color: activeTab === 'summary' ? '#fff' : '#888',
              border: 'none',
            }}
          >
            Tổng quan ({profile.fullName})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('markdown')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'markdown' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
              color: activeTab === 'markdown' ? '#fff' : '#888',
              border: 'none',
            }}
          >
            MarkItDown Output
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'json' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
              color: activeTab === 'json' ? '#fff' : '#888',
              border: 'none',
            }}
          >
            Cấu trúc JSON
          </button>
        </Flexbox>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <Flexbox
            gap={16}
            padding="20px"
            style={{
              width: '100%',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                {profile.fullName}
              </div>
              <div style={{ fontSize: 13, color: '#06b6d4', marginTop: 2 }}>
                {profile.title || profile.tagline}
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 8, lineHeight: 1.6 }}>
                {profile.bio}
              </div>
            </div>

            {/* Metrics */}
            {profile.metrics && profile.metrics.length > 0 && (
              <Flexbox gap={12} horizontal wrap="wrap">
                {profile.metrics.map((st, i) => (
                  <Flexbox
                    key={i}
                    padding="10px 14px"
                    style={{
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{st.value}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{st.label}</div>
                  </Flexbox>
                ))}
              </Flexbox>
            )}

            {/* Skills */}
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#666', fontFamily: 'monospace', marginBottom: 8 }}>
                Kỹ năng chuyên môn ({profile.skills?.length || 0})
              </div>
              <Flexbox gap={6} horizontal wrap="wrap">
                {(profile.skills || []).map((sk, i) => (
                  <Tag key={i} color="cyan">
                    {sk.name}
                  </Tag>
                ))}
              </Flexbox>
            </div>
          </Flexbox>
        )}

        {activeTab === 'markdown' && (
          <div
            style={{
              width: '100%',
              padding: 20,
              borderRadius: 14,
              background: '#0d0d10',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#ccc',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
            }}
          >
            {profile.markitdownMarkdown || `# ${profile.fullName}\n\n**${profile.title || profile.tagline}**\n\n${profile.bio}\n\n## Kỹ năng\n${(profile.skills || []).map(s => `- ${s.name}`).join('\n')}\n\n## Kinh nghiệm\n${(profile.experiences || []).map(e => `### ${e.role} tại ${e.company} (${e.period})\n${e.description}`).join('\n\n')}`}
          </div>
        )}

        {activeTab === 'json' && (
          <pre
            style={{
              width: '100%',
              padding: 20,
              borderRadius: 14,
              background: '#0d0d10',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#8be9fd',
              overflowX: 'auto',
              maxHeight: 500,
            }}
          >
            {jsonString}
          </pre>
        )}
      </Center>
    </Flexbox>
  );
});

LobeDossierView.displayName = 'LobeDossierView';
export default LobeDossierView;
