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

  describe('URL duplicate marking (same url, different titles)', () => {
    it('should mark bookmarks with same URL but different titles', () => {
      const bookmarks = [
        makeBookmark('1', 'Google Search', 'https://google.com'),
        makeBookmark('2', 'Google Home', 'https://google.com'),
      ];
      const { urlDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(urlDuplicateIds.size).toBe(2);
      expect(urlDuplicateIds.has('1')).toBe(true);
      expect(urlDuplicateIds.has('2')).toBe(true);
    });

    it('should not mark unique URLs as duplicates', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'GitHub', 'https://github.com'),
      ];
      const { urlDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(urlDuplicateIds.size).toBe(0);
    });

    it('should not mark exact duplicates as url-duplicates (they are removed)', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'Google', 'https://google.com'),
      ];
      const { bookmarks: result, urlDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(1);
      expect(urlDuplicateIds.size).toBe(0);
    });
  });

  describe('combined scenarios', () => {
    it('should handle mix of exact dupes and url dupes', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'Google', 'https://google.com'),       // exact dupe of 1 → removed
        makeBookmark('3', 'Google Home', 'https://google.com'),   // url dupe of 1 → marked
        makeBookmark('4', 'GitHub', 'https://github.com'),
        makeBookmark('5', 'MDN', 'https://developer.mozilla.org'),
      ];
      const { bookmarks: result, urlDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(4);
      expect(result.map(b => b.id)).toEqual(['1', '3', '4', '5']);
      expect(urlDuplicateIds.size).toBe(2);
      expect(urlDuplicateIds.has('1')).toBe(true);
      expect(urlDuplicateIds.has('3')).toBe(true);
      expect(urlDuplicateIds.has('4')).toBe(false);
    });

    it('should return empty results for empty input', () => {
      const { bookmarks: result, urlDuplicateIds } = deduplicateBookmarks([]);
      expect(result.length).toBe(0);
      expect(urlDuplicateIds.size).toBe(0);
    });

    it('should handle all unique bookmarks', () => {
      const bookmarks = [
        makeBookmark('1', 'Google', 'https://google.com'),
        makeBookmark('2', 'GitHub', 'https://github.com'),
        makeBookmark('3', 'MDN', 'https://developer.mozilla.org'),
      ];
      const { bookmarks: result, urlDuplicateIds } = deduplicateBookmarks(bookmarks);
      expect(result.length).toBe(3);
      expect(urlDuplicateIds.size).toBe(0);
    });
  });
});
