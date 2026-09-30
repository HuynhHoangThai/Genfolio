import { Theme, css } from 'antd-style';

/**
 * Cloned from lobe-chat-ref/src/styles/global.ts
 */
export default ({ token }: { prefixCls: string; token: Theme }) => css`
  html,
  body,
  #root {
    position: relative;
    overscroll-behavior: none;
    height: 100%;
    min-height: 100dvh;
    max-height: 100dvh;
    background: ${token.colorBgLayout || '#000000'};
    color: ${token.colorText || '#ffffff'};
    font-family: ${token.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'};

    @media (min-device-width: 576px) {
      overflow: hidden;
    }
  }

  * {
    box-sizing: border-box;
    scrollbar-color: ${token.colorFillTertiary || 'rgba(255, 255, 255, 0.15)'} transparent;
    scrollbar-width: thin;

    ::-webkit-scrollbar {
      width: 0.6em;
      height: 0.6em;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: ${token.colorFillSecondary || 'rgba(255, 255, 255, 0.2)'};
    }

    :hover::-webkit-scrollbar-thumb {
      background-color: ${token.colorFill || 'rgba(255, 255, 255, 0.35)'};
      background-clip: content-box;
      border: 2px solid transparent;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
`;
