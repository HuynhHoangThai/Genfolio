import { Theme, css } from 'antd-style';

/**
 * Cloned from lobe-chat-ref/src/styles/global.ts
 */
export default ({ token }: { prefixCls: string; token: Theme }) => css`
  html {
    position: relative;
    min-height: 100%;
    background: ${token.colorBgLayout || '#000000'};
    color: ${token.colorText || '#ffffff'};
    font-family: ${token.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'};
    overflow-x: clip;
    overflow-y: auto;
  }

  body {
    position: relative;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    background: ${token.colorBgLayout || '#000000'};
    color: ${token.colorText || '#ffffff'};
    overflow-x: clip;
    overflow-y: visible;
  }

  #root {
    position: relative;
    min-height: 100vh;
    width: 100%;
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
