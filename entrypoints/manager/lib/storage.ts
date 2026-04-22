import { storage } from '#imports';
import type { UrlStatus, TagCategory, ViewMode } from '../types';

export const urlStatusCache = storage.defineItem<Record<string, UrlStatus>>(
  'local:urlStatusCache',
  { defaultValue: {} },
);

export const userTagCategories = storage.defineItem<TagCategory[]>(
  'local:userTagCategories',
  { defaultValue: [] },
);

export const viewModeStorage = storage.defineItem<ViewMode>(
  'local:viewMode',
  { defaultValue: 'domain' },
);
