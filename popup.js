document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById("openPopup");
    if (button) {
      button.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          });
        });
      });
    }
  });