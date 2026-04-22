export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  dateAdded?: number;
  parentId?: string;
  folderPath: string;
}

export interface DomainGroup {
  domain: string;
  displayName: string;
  favicon: string;
  bookmarks: BookmarkItem[];
}

export interface TagCategory {
  id: string;
  name: string;
  keywords: string[];
  color: string;
  icon: string;
  isPreset: boolean;
}

export interface TagGroup {
  category: TagCategory;
  bookmarks: BookmarkItem[];
}

export interface FolderGroup {
  folderName: string;
  bookmarks: BookmarkItem[];
}

export interface FolderTreeNode {
  id: string;
  title: string;
  children: FolderTreeNode[];
}

export type UrlStatusType = 'valid' | 'redirect' | 'broken' | 'server-error' | 'unchecked' | 'checking';

export interface UrlStatus {
  url: string;
  status: UrlStatusType;
  statusCode?: number;
  checkedAt?: number;
}

export type ViewMode = 'domain' | 'tags' | 'folder';

export type LocalePreference = 'auto' | 'en' | 'zh-CN';

export interface MessageCheckUrls {
  type: 'CHECK_URLS';
  urls: string[];
}

export interface MessageCheckSingleUrl {
  type: 'CHECK_SINGLE_URL';
  url: string;
}

export interface MessageUrlStatusUpdate {
  type: 'URL_STATUS_UPDATE';
  url: string;
  status: UrlStatus;
}

export interface MessageBookmarkChanged {
  type: 'BOOKMARK_CHANGED';
  action: 'created' | 'removed' | 'changed' | 'moved';
}

export interface MessageClearUrlCache {
  type: 'CLEAR_URL_CACHE';
}

export type ExtensionMessage =
  | MessageCheckUrls
  | MessageCheckSingleUrl
  | MessageUrlStatusUpdate
  | MessageBookmarkChanged
  | MessageClearUrlCache;
