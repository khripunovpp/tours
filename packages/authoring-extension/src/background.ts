/**
 * Service worker: on toolbar click, inject the content script into the active
 * tab, which toggles the builder. Injecting on demand keeps the extension off
 * pages until the author asks for it.
 */
chrome.action.onClicked.addListener((tab) => {
  if (typeof tab.id !== 'number') return;
  void chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  });
});
