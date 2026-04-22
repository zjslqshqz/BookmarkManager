import type { ExtensionMessage, UrlStatus } from '../types';

export function sendMessage(message: ExtensionMessage): Promise<void> {
  return browser.runtime.sendMessage(message);
}

export function requestUrlCheck(urls: string[]): Promise<void> {
  return sendMessage({ type: 'CHECK_URLS', urls });
}

export function requestSingleUrlCheck(url: string): Promise<UrlStatus> {
  return browser.runtime.sendMessage({ type: 'CHECK_SINGLE_URL', url });
}

export function clearUrlCache(): Promise<void> {
  return sendMessage({ type: 'CLEAR_URL_CACHE' });
}

export function onMessage(
  callback: (message: ExtensionMessage) => void,
): () => void {
  const listener = (message: ExtensionMessage) => {
    callback(message);
  };
  browser.runtime.onMessage.addListener(listener);
  return () => browser.runtime.onMessage.removeListener(listener);
}
