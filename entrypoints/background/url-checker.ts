import type { UrlStatus, UrlStatusType } from '../manager/types';
import { storage } from '#imports';

const CACHE_KEY = 'local:urlStatusCache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CONCURRENT = 5;
const REQUEST_TIMEOUT = 8000;

let activeCount = 0;
const queue: string[] = [];
let isProcessing = false;

async function getCache(): Promise<Record<string, UrlStatus>> {
  return (await storage.getItem<Record<string, UrlStatus>>(CACHE_KEY)) ?? {};
}

async function setCache(cache: Record<string, UrlStatus>): Promise<void> {
  await storage.setItem(CACHE_KEY, cache);
}

function classifyStatus(statusCode: number): UrlStatusType {
  if (statusCode >= 200 && statusCode < 300) return 'valid';
  if (statusCode >= 300 && statusCode < 400) return 'redirect';
  if (statusCode >= 400 && statusCode < 500) return 'broken';
  if (statusCode >= 500) return 'server-error';
  return 'broken';
}

async function checkSingleUrl(url: string): Promise<UrlStatus> {
  try {
    // Try HEAD first
    let response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    // Fallback to GET if HEAD is not allowed
    if (response.status === 405) {
      const controller = new AbortController();
      response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      // Abort immediately after getting headers
      controller.abort();
    }

    return {
      url,
      status: classifyStatus(response.status),
      statusCode: response.status,
      checkedAt: Date.now(),
    };
  } catch (error) {
    const isTimeout =
      error instanceof DOMException && error.name === 'TimeoutError';
    return {
      url,
      status: 'broken',
      statusCode: isTimeout ? 0 : -1,
      checkedAt: Date.now(),
    };
  }
}

async function notifyUI(urlStatus: UrlStatus): Promise<void> {
  try {
    await browser.runtime.sendMessage({
      type: 'URL_STATUS_UPDATE',
      url: urlStatus.url,
      status: urlStatus,
    });
  } catch {
    // Manager page might not be open
  }
}

async function processNext(): Promise<void> {
  if (activeCount >= MAX_CONCURRENT || queue.length === 0) {
    if (activeCount === 0 && queue.length === 0) {
      isProcessing = false;
      // Clear keepalive alarm
      await browser.alarms.clear('url-checker-keepalive');
    }
    return;
  }

  const url = queue.shift()!;
  activeCount++;

  try {
    const result = await checkSingleUrl(url);

    // Update cache
    const cache = await getCache();
    cache[url] = result;
    await setCache(cache);

    // Notify UI
    await notifyUI(result);
  } finally {
    activeCount--;
    processNext();
  }
}

function startProcessing(): void {
  if (isProcessing) return;
  isProcessing = true;

  // Set keepalive alarm to prevent service worker termination
  browser.alarms.create('url-checker-keepalive', { periodInMinutes: 0.4 });

  // Start concurrent processing
  const concurrentStarts = Math.min(MAX_CONCURRENT, queue.length);
  for (let i = 0; i < concurrentStarts; i++) {
    processNext();
  }
}

export function enqueueUrls(urls: string[]): void {
  queue.push(...urls);
  startProcessing();
}

export async function enqueueUrlsWithCacheCheck(
  urls: string[],
): Promise<void> {
  const cache = await getCache();
  const now = Date.now();

  const urlsToCheck = urls.filter((url) => {
    const cached = cache[url];
    if (!cached || !cached.checkedAt) return true;
    return now - cached.checkedAt > CACHE_TTL;
  });

  if (urlsToCheck.length > 0) {
    enqueueUrls(urlsToCheck);
  }
}

export { checkSingleUrl, getCache, setCache };
