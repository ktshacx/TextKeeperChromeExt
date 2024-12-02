chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "saveText",
      title: "Save Selected Text",
      contexts: ["selection"]
    });
});
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveText") {
      const text = info.selectionText;
      const url = tab.url;
      const title = tab.title;
  
      chrome.storage.local.get(["texts"], (result) => {
        const texts = result.texts || [];
        texts.push({ text, url, title, time: Date.now() });
        chrome.storage.local.set({ texts });
      });
    }
});
