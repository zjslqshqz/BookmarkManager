import { describe, it, expect } from 'vitest';
import { deduplicateBookmarks } from '../entrypoints/manager/lib/duplicate-detector';
import type { BookmarkItem } from '../entrypoints/manager/types';

function makeBookmark(id: string, title: string, url: string, folderPath = 'Root'): BookmarkItem {
  return { id, title, url, folderPath };
}

describe('deduplicateBookmarks', () => {
  describe('exact deduplication (same title + same url)', () => {
    it('should remove exact duplicates, keeping first occurrence', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com', 'Work'),
        makeBookmark('2', 'Google', 'https://google.com', 'Personal'),
        makeBookmark('3', 'GitHub', 'https://github.com'),
      ];
      const { bookmarks: result } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    it('should remove triple exact duplicates, keeping first', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com', 'A'),
        makeBookmark('2', 'Google', 'https://google.com', 'B'),
        makeBookmark('3', 'Google', 'https://google.com', 'C'),
      ];
      const { bookmarks: result } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should not remove bookmarks with same title but different URLs', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'Google', 'https://google.co.uk'),
      ];
      const { bookmarks: result } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(2);
    });
  });

  describe('exact duplicate ID tracking (same title + same url)', () => {
    it('should track all IDs of exact duplicates', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com', 'Work'),
        makeBookmark('2', 'Google', 'https://google.com', 'Personal'),
        makeBookmark('3', 'GitHub', 'https://github.com'),
      ];
      const { exactDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(exactDuplicateIds.size).toBe(2);
      expect(exactDuplicateIds.has('1')).toBe(true);
      expect(exactDuplicateIds.has('2')).toBe(true);
      expect(exactDuplicateIds.has('3')).toBe(false);
    });

    it('should not mark bookmarks with same URL but different titles as duplicates', () => {
      const bookmarks = [
        makeBookmark('1', 'Google Search', 'https://google.com'),
        makeBookmark('2', 'Google Home', 'https://google.com'),
      ];
      const { exactDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(exactDuplicateIds.size).toBe(0);
    });

    it('should not mark unique bookmarks as duplicates', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'GitHub', 'https://github.com'),
      ];
      const { exactDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(exactDuplicateIds.size).toBe(0);
    });

    it('should track triple exact duplicates', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com', 'A'),
        makeBookmark('2', 'Google', 'https://google.com', 'B'),
        makeBookmark('3', 'Google', 'https://google.com', 'C'),
      ];
      const { exactDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(exactDuplicateIds.size).toBe(3);
      expect(exactDuplicateIds.has('1')).toBe(true);
      expect(exactDuplicateIds.has('2')).toBe(true);
      expect(exactDuplicateIds.has('3')).toBe(true);
    });
  });

  describe('combined scenarios', () => {
    it('should handle mix of exact dupes and url-only dupes', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'Google', 'https://google.com'),       // exact dupe of 1
        makeBookmark('3', 'Google Home', 'https://google.com'),   // same url different title → NOT a duplicate
        makeBookmark('4', 'GitHub', 'https://github.com'),
        makeBookmark('5', 'MDN', 'https://developer.mozilla.org'),
      ];
      const { bookmarks: result, exactDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(4);
      expect(result.map(b => b.id)).toEqual(['1', '3', '4', '5']);
      // Only exact dupes (1 and 2) are marked, not url-only dupe (3)
      expect(exactDuplicateIds.size).toBe(2);
      expect(exactDuplicateIds.has('1')).toBe(true);
      expect(exactDuplicateIds.has('2')).toBe(true);
      expect(exactDuplicateIds.has('3')).toBe(false);
    });

    it('should return empty results for empty input', () => {
      const { bookmarks: result, exactDuplicateIds } = deduplicateBookmarks([]);
      expect(result.length).toBe(0);
      expect(exactDuplicateIds.size).toBe(0);
    });

    it('should handle all unique bookmarks', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'GitHub', 'https://github.com'),
        makeBookmark('3', 'MDN', 'https://developer.mozilla.org'),
      ];
      const { bookmarks: result, exactDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(3);
      expect(exactDuplicateIds.size).toBe(0);
    });
  });
});
