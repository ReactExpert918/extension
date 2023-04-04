chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'getSecret') {
    chrome.storage.local.get(['secret'], function(result) {
      sendResponse({secret: result.secret});
    });
    return true;
  }
});