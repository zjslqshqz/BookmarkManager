import { describe, it, expect } from 'vitest';
import { extractDomain } from '../entrypoints/manager/lib/domain-extractor';

describe('extractDomain', () => {
  it('should extract domain from standard URLs', () => {
    const result = extractDomain('https://github.com/user/repo');
    expect(result).toEqual({
      domain: 'github.com',
      displayName: 'github.com',
      favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=32',
    });
  });

  it('should strip www prefix', () => {
    const result = extractDomain('https://www.google.com/search?q=test');
    expect(result?.domain).toBe('google.com');
  });

  it('should handle http URLs', () => {
    const result = extractDomain('http://example.com/page');
    expect(result?.domain).toBe('example.com');
  });

  it('should return null for javascript: URLs', () => {
    expect(extractDomain('javascript:void(0)')).toBeNull();
  });

  it('should group file:// as Local Files', () => {
    const result = extractDomain('file:///Users/test/doc.html');
    expect(result?.domain).toBe('file://');
    expect(result?.displayName).toBe('Local Files');
  });

  it('should group chrome:// as Browser Pages', () => {
    const result = extractDomain('chrome://settings');
    expect(result?.domain).toBe('browser-pages');
    expect(result?.displayName).toBe('Browser Pages');
  });

  it('should group about: as Browser Pages', () => {
    const result = extractDomain('about:blank');
    expect(result?.domain).toBe('browser-pages');
  });

  it('should handle IP addresses', () => {
    const result = extractDomain('http://192.168.1.1:8080/admin');
    expect(result?.domain).toBe('192.168.1.1');
  });

  it('should handle localhost', () => {
    const result = extractDomain('http://localhost:3000');
    expect(result?.domain).toBe('localhost');
  });

  it('should return null for empty string', () => {
    expect(extractDomain('')).toBeNull();
  });

  it('should return null for malformed URLs', () => {
    expect(extractDomain('not-a-url')).toBeNull();
  });

  it('should handle subdomains', () => {
    const result = extractDomain('https://docs.github.com/en');
    expect(result?.domain).toBe('docs.github.com');
  });
});
