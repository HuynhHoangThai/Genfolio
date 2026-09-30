export const HEADER_HEIGHT = 48;
export const MOBILE_NABBAR_HEIGHT = 44;
export const MOBILE_TABBAR_HEIGHT = 48;
export const CHAT_TEXTAREA_MAX_HEIGHT = 800;
export const CHAT_TEXTAREA_HEIGHT = 160;
export const CHAT_TEXTAREA_HEIGHT_MOBILE = 108;
export const CHAT_SIDEBAR_WIDTH = 280;
export const CHAT_SIDENAV_WIDTH = 64;

export const CHAT_DOCK_WIDTH = 400;
export const CHAT_DOCK_TOOL_UI_WIDTH = 800;

export const MARKET_SIDEBAR_WIDTH = 400;
export const FOLDER_WIDTH = 270;
export const MAX_WIDTH = 1024;

export const MOBILE_HEADER_ICON_SIZE = { blockSize: 36, fontSize: 20 };
export const DESKTOP_HEADER_ICON_SIZE = { fontSize: 22 };
export const HEADER_ICON_SIZE = (mobile?: boolean) =>
  mobile ? MOBILE_HEADER_ICON_SIZE : DESKTOP_HEADER_ICON_SIZE;
