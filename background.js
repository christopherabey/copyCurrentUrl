// Helper function to set badge text with automatic reset
async function setBadgeWithReset(tabId, text, resetText = "", resetDelay = 1500) {
  try {
    await chrome.action.setBadgeText({
      tabId: tabId,
      text: text,
    });

    if (resetDelay > 0) {
      setTimeout(async () => {
        try {
          await chrome.action.setBadgeText({
            tabId: tabId,
            text: resetText,
          });
        } catch (error) {
          console.error("Error resetting badge:", error);
        }
      }, resetDelay);
    }
  } catch (error) {
    console.error("Error setting badge:", error);
  }
}

// Helper function to copy text to clipboard
async function copyToClipboard(tabId, text) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (textToCopy) => {
        const input = document.createElement('textarea');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      },
      args: [text]
    });
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension initialized");
});

// Main URL copying functionality
chrome.action.onClicked.addListener(async (tab) => {
  try {
    const url = tab.url;
    
    const success = await copyToClipboard(tab.id, url);
    
    if (success) {
      await setBadgeWithReset(tab.id, "COPIED");
    } else {
      await setBadgeWithReset(tab.id, "ERROR", "", 2000);
    }
  } catch (error) {
    console.error("Error in main handler:", error);
    await setBadgeWithReset(tab.id, "ERROR", "", 2000);
  }
});