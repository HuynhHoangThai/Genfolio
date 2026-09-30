import { createGlobalStyle } from 'antd-style';
import antdOverride from './antdOverride';
import global from './global';

const prefixCls = 'ant';

/**
 * Cloned from lobe-chat-ref/src/styles/index.ts
 */
export const GlobalStyle = createGlobalStyle(({ theme }) => [
  global({ prefixCls, token: theme }),
  antdOverride({ prefixCls, token: theme }),
]);

export * from './lobeColors';
export * from './mobileHeader';
