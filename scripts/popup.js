let btn = document.querySelector("button");
chrome.storage.sync.get(["translateText"]).then((obj) => {
  btn.textContent = obj.translateText ? "On" : "Off";
  if (!obj.translateText) {
    btn.classList.add("off");
  }
});

btn.addEventListener("click", function () {
  let btnTxtContent = btn.textContent;
  if (btnTxtContent === "On") {
    TOGGLE_TRANSLATE_VALUE(false);
    btn.textContent = "Off";
    btn.classList.add("off");
  } else {
    TOGGLE_TRANSLATE_VALUE(true);
    btn.textContent = "On";
    btn.classList.remove("off");
  }
});

function TOGGLE_TRANSLATE_VALUE(boolean) {
  chrome.storage.sync.set({
    translateText: boolean,
  });
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(async (tab) => {
      // if the tab is a chrome url return
      const pattern = /^chrome\:\/\/.*/;
      if (pattern.test(tab.url)) return;
      console.log(tab);

      await chrome.tabs.sendMessage(tab.id, {
        translate: boolean,
      });
    });
  });
}
