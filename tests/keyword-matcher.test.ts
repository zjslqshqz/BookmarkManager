import { describe, it, expect } from 'vitest';
import { matchBookmarkToCategories, groupBookmarksByTags } from '../entrypoints/manager/lib/keyword-matcher';
import { presetCategories } from '../entrypoints/manager/lib/preset-categories';
import type { BookmarkItem, TagCategory } from '../entrypoints/manager/types';

function makeBookmark(title: string, url: string): BookmarkItem {
  return {
    id: Math.random().toString(),
    title,
    url,
    folderPath: 'Root',
  };
}

describe('matchBookmarkToCategories', () => {
  it('should match tech bookmarks', () => {
    const bookmark = makeBookmark('React Documentation', 'https://react.dev');
    const matched = matchBookmarkToCategories(bookmark, presetCategories);
    expect(matched).toContain('preset-tech');
  });

  it('should match shopping bookmarks', () => {
    const bookmark = makeBookmark('Amazon Best Deals', 'https://amazon.com/deals');
    const matched = matchBookmarkToCategories(bookmark, presetCategories);
    expect(matched).toContain('preset-shopping');
  });

  it('should match by URL domain', () => {
    const bookmark = makeBookmark('My Page', 'https://stackoverflow.com/questions/123');
    const matched = matchBookmarkToCategories(bookmark, presetCategories);
    expect(matched).toContain('preset-tech');
  });

  it('should be case insensitive', () => {
    const bookmark = makeBookmark('GITHUB Repository', 'https://example.com');
    const matched = matchBookmarkToCategories(bookmark, presetCategories);
    expect(matched).toContain('preset-tech');
  });

  it('should match multiple categories', () => {
    const bookmark = makeBookmark('Tech News on Reddit', 'https://reddit.com/r/tech');
    const matched = matchBookmarkToCategories(bookmark, presetCategories);
    expect(matched.length).toBeGreaterThanOrEqual(2);
    expect(matched).toContain('preset-social');
  });

  it('should return empty for unmatched bookmarks', () => {
    const bookmark = makeBookmark('My Personal Page', 'https://my-unique-site.xyz');
    const matched = matchBookmarkToCategories(bookmark, presetCategories);
    expect(matched).toHaveLength(0);
  });
});

describe('groupBookmarksByTags', () => {
  it('should group bookmarks into categories', () => {
    const bookmarks = [
      makeBookmark('GitHub', 'https://github.com'),
      makeBookmark('Amazon', 'https://amazon.com'),
      makeBookmark('Random Site', 'https://random-xyz.com'),
    ];

    const groups = groupBookmarksByTags(bookmarks, presetCategories);
    expect(groups.has('preset-tech')).toBe(true);
    expect(groups.has('preset-shopping')).toBe(true);
    expect(groups.has('uncategorized')).toBe(true);
  });

  it('should prioritize user categories', () => {
    const userCat: TagCategory = {
      id: 'user-1',
      name: 'My Stuff',
      keywords: ['github'],
      color: '#000',
      icon: 'TagOutlined',
      isPreset: false,
    };

    const bookmarks = [makeBookmark('GitHub Repo', 'https://github.com/repo')];
    const groups = groupBookmarksByTags(bookmarks, [userCat, ...presetCategories]);

    expect(groups.has('user-1')).toBe(true);
    expect(groups.get('user-1')!.length).toBe(1);
  });

  it('should remove empty groups', () => {
    const bookmarks = [makeBookmark('GitHub', 'https://github.com')];
    const groups = groupBookmarksByTags(bookmarks, presetCategories);

    // Should not have shopping group since no shopping bookmarks
    expect(groups.has('preset-shopping')).toBe(false);
  });
});
