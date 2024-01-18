function TRANSLATION_HANDLER(e) {
  if (e.keyCode === 32) {
    if (!(e.target.localName === "input" || e.target.localName === "textarea"))
      return;

    let { value } = e.target;
    let lines = value.split("\n");
    let lastLine = lines[lines.length - 1];

    let words = lastLine.split(" ");
    let recentWord = words[words.length - 1];

    if (!recentWord || recentWord === "," || recentWord === "|") {
      return;
    }

    let fetchUrl = `https://www.google.com/inputtools/request?text=${recentWord}&ime=transliteration_en_ne&num=1`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((res) => {
        let translatedWord = res[1][0][1][0];

        // Replace "." with "|"
        translatedWord = translatedWord.endsWith('.') ? translatedWord.replace('.', ' |') : translatedWord;

        words[words.length - 1] = translatedWord;
        lastLine = words.join(" ");

        lines[lines.length - 1] = lastLine;
        e.target.value = lines.join("\n") + " ";
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
