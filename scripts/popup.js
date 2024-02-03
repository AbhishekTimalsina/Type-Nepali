// Connect to background.js to notify popup is open
chrome.runtime.connect({name:"popup"});

// Handle keyboard shortcuts when popup is open by simulating as if the user pressed the button
chrome.runtime.onMessage.addListener((message) => {
  if (message.message == "button-press") BUTTON_PRESSED();
});

let btn = document.querySelector("button");
chrome.storage.sync.get(["translateText"]).then((obj) => {
  btn.textContent = obj.translateText ? "On" : "Off";
  if (!obj.translateText) {
    btn.classList.add("off");
  }
});

btn.addEventListener("click", BUTTON_PRESSED);

function BUTTON_PRESSED() {
  let btnTxtContent = btn.textContent;
  if (btnTxtContent === "On") {
    chrome.runtime.sendMessage({toggle_value: false, message: "toggle-value"});
    btn.textContent = "Off";
    btn.classList.add("off");
  } else {
    chrome.runtime.sendMessage({toggle_value: true, message: "toggle-value"});
    btn.textContent = "On";
    btn.classList.remove("off");
  }
}