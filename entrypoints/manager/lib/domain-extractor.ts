export interface DomainInfo {
  domain: string;
  displayName: string;
  favicon: string;
}

export function extractDomain(url: string): DomainInfo | null {
  if (!url) return null;

  if (url.startsWith('javascript:')) return null;

  if (url.startsWith('file://')) {
    return {
      domain: 'file://',
      displayName: 'Local Files',
      favicon: '',
    };
  }

  const browserProtocols = ['chrome:', 'chrome-extension:', 'moz-extension:', 'about:', 'edge:'];
  for (const protocol of browserProtocols) {
    if (url.startsWith(protocol)) {
      return {
        domain: 'browser-pages',
        displayName: 'Browser Pages',
        favicon: '',
      };
    }
  }

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');

    if (!hostname) return null;

    return {
      domain: hostname,
      displayName: hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
    };
  } catch {
    return null;
  }
}
