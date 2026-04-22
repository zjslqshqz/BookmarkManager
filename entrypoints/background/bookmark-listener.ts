export function setupBookmarkListeners(): void {
  const notifyChange = (action: string) => {
    browser.runtime
      .sendMessage({
        type: 'BOOKMARK_CHANGED',
        action,
      })
      .catch(() => {
        // Manager page might not be open
      });
  };

  browser.bookmarks.onCreated.addListener(() => notifyChange('created'));
  browser.bookmarks.onRemoved.addListener(() => notifyChange('removed'));
  browser.bookmarks.onChanged.addListener(() => notifyChange('changed'));
  browser.bookmarks.onMoved.addListener(() => notifyChange('moved'));
}
