chrome.runtime.onInstalled.addListener(() => {
  console.log("[Aegis] Extension installed.");
});

// Keep the service worker alive with a dummy listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("[Aegis] Message received:", msg);
});