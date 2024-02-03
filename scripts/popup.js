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
    chrome.runtime.sendMessage({toggle_value: false});
    btn.textContent = "Off";
    btn.classList.add("off");
  } else {
    chrome.runtime.sendMessage({toggle_value: true});
    btn.textContent = "On";
    btn.classList.remove("off");
  }
});