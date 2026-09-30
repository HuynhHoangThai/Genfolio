import { Theme, css } from 'antd-style';

/**
 * Cloned from lobe-chat-ref/src/styles/antdOverride.ts
 */
export default ({ token }: { prefixCls: string; token: Theme }) => css`
  .${token.prefixCls || 'ant'}-popover {
    z-index: 1100;
  }

  .${token.prefixCls || 'ant'}-menu-sub.${token.prefixCls || 'ant'}-menu-vertical {
    border: 1px solid ${token.colorBorderSecondary || 'rgba(255, 255, 255, 0.08)'};
    box-shadow: ${token.boxShadow || '0 12px 32px rgba(0, 0, 0, 0.5)'};
    background: ${token.colorBgElevated || '#141416'};
  }

  .${token.prefixCls || 'ant'}-menu-item-selected {
    .${token.prefixCls || 'ant'}-menu-title-content {
      color: ${token.colorText || '#fff'};
    }
  }

  .${token.prefixCls || 'ant'}-modal-content {
    background: ${token.colorBgContainer || '#141416'} !important;
    border: 1px solid ${token.colorBorderSecondary || 'rgba(255, 255, 255, 0.08)'};
    border-radius: 16px !important;
  }

  .${token.prefixCls || 'ant'}-tag {
    border-radius: 6px;
  }
`;
