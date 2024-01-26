chrome.commands.onCommand.addListener(() => {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(async (tab) => {
      // if the tab is a chrome url return
      const pattern = /^chrome\:\/\/.*/;
      if (pattern.test(tab.url)) return;

      let boolean = await getCurrentTranslationState();

      await chrome.tabs.sendMessage(tab.id, {
        translate: !boolean,
      });
      await chrome.runtime.sendMessage({
        translate: !boolean,
      });
    });
  });
});

async function getCurrentTranslationState() {
  let object = await chrome.storage.sync.get(["translateText"]);
  return object.translateText;
}
