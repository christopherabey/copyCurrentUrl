chrome.runtime.onInstalled.addListener(() => {
  console.log("Copy current URL extension initialized");
});

// Function to copy the current URL to clipboard
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Get the current tab's URL
    const url = tab.url;
    
    // Execute a content script to copy the URL to clipboard
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        window.navigator.clipboard.writeText(text);
      },
      args: [url]
    });
    
    // Provide visual feedback that the URL was copied
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: "COPIED",
    });
    
    // Reset the badge after a short delay
    setTimeout(async () => {
      await chrome.action.setBadgeText({
        tabId: tab.id,
        text: "",
      });
    }, 1500);
  } catch (error) {
    console.error("Error copying URL:", error);
  }
});