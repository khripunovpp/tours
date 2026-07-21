/**
 * Service worker. Two ways the builder gets injected:
 *
 *  1. Toolbar click → inject the content script (toggles the builder). Injecting
 *     on demand keeps the extension off pages until the author asks for it.
 *  2. After a cross-page "Next", the builder navigates with a `tours-resume=…`
 *     token in the URL. We watch tab loads for that token and re-inject so the
 *     builder re-mounts and continues on the destination page.
 */
const RESUME_MARKER = 'tours-resume=';

function inject(tabId: number): void {
  void chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js'],
  });
}

chrome.action.onClicked.addListener((tab) => {
  if (typeof tab.id === 'number') inject(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  if (typeof tab.url === 'string' && tab.url.includes(RESUME_MARKER)) inject(tabId);
});
