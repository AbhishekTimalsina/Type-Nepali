function TRANSLATION_HANDLER(e) {
  if (e.keyCode === 32) {
    if (!(e.target.localName === "input" || e.target.localName === "textarea"))
      return;

    let { value } = e.target;
    let splittedText = value.split(" ");
    let recentText = splittedText[splittedText.length - 1];
    console.log(recentText);
    if (!recentText) return;
    if (recentText === "," || recentText === "|") return;
    let translatedTextArray = [...splittedText];
    translatedTextArray.pop();

    console.log(splittedText);
    console.log(translatedTextArray);

    let fetchUrl = `https://www.google.com/inputtools/request?text=${recentText}&ime=transliteration_en_ne&num=1`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((res) => {
        let translatedText = res[1][0][1][0];
        translatedTextArray.push(translatedText);
        e.target.value = translatedTextArray.join(" ") + " ";
      });
  }
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.translate) {
    window.addEventListener("keydown", TRANSLATION_HANDLER);
  } else {
    window.removeEventListener("keydown", TRANSLATION_HANDLER);
  }
});

chrome.storage.sync.get(["translateText"]).then((obj) => {
  if (obj.translateText) {
    window.addEventListener("keydown", TRANSLATION_HANDLER);
  }
});
