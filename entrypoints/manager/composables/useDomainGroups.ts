import { computed } from 'vue';
import { useSearchStore } from '../stores/search';
import { extractDomain } from '../lib/domain-extractor';
import type { DomainGroup } from '../types';

export function useDomainGroups() {
  const searchStore = useSearchStore();

  const domainGroups = computed<DomainGroup[]>(() => {
    const groupMap = new Map<string, DomainGroup>();

    for (const bookmark of searchStore.filteredBookmarks) {
      const domainInfo = extractDomain(bookmark.url);
      if (!domainInfo) continue;

      const existing = groupMap.get(domainInfo.domain);
      if (existing) {
        existing.bookmarks.push(bookmark);
      } else {
        groupMap.set(domainInfo.domain, {
          domain: domainInfo.domain,
          displayName: domainInfo.displayName,
          favicon: domainInfo.favicon,
          bookmarks: [bookmark],
        });
      }
    }

    // Sort by bookmark count descending
    return Array.from(groupMap.values()).sort(
      (a, b) => b.bookmarks.length - a.bookmarks.length,
    );
  });

  return { domainGroups };
}
