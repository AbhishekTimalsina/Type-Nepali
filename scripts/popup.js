let btn = document.querySelector("button");
let translateState;

chrome.storage.sync.get(["translateText"]).then((obj) => {
  translateState = obj.translateText;
  CHANGE_BUTTON_TEXT(obj.translateText);
});

btn.addEventListener("click", function () {
  let btnTxtContent = btn.textContent;
  if (btnTxtContent === "On") {
    // if (translateState) {
    TOGGLE_TRANSLATE_VALUE(false);
    CHANGE_BUTTON_TEXT(false);
  } else {
    TOGGLE_TRANSLATE_VALUE(true);
    CHANGE_BUTTON_TEXT(true);
  }
});

function TOGGLE_TRANSLATE_VALUE(boolean) {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach(async (tab) => {
      console.log(tab);
      // if the tab is a chrome url return
      const pattern = /^chrome\:\/\/.*/;
      if (pattern.test(tab.url)) return;

      await chrome.tabs.sendMessage(tab.id, {
        translate: boolean,
      });
    });
  });
}

function CHANGE_BUTTON_TEXT(boolean) {
  if (boolean) {
    btn.textContent = "On";
    btn.classList.remove("off");
  } else {
    btn.textContent = "Off";
    btn.classList.add("off");
  }
}

chrome.runtime.onMessage.addListener(function (request) {
  CHANGE_BUTTON_TEXT(request.translate);
});
