function TRANSLATION_HANDLER(e) {
  HANDLE_TRANSLATION_FOR_OTHERS(e);
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
        translatedWord = translatedWord.endsWith(".")
          ? translatedWord.replace(".", "।")
          : translatedWord;

        words[words.length - 1] = translatedWord;
        lastLine = words.join(" ");

        lines[lines.length - 1] = lastLine;
        e.target.value = lines.join("\n") + " ";
      });
  }
}

async function HANDLE_TRANSLATION_FOR_OTHERS(e) {
  let targetDiv = e.target;
  let textfield = FIND_TEXT_FIELD(targetDiv);

  if (e.keyCode === 32) {
    if (!textfield) return;

    let textFieldValue = textfield.textContent;
    let lastTextFieldRange = textFieldValue.split(" ");
    let lastValue = lastTextFieldRange[lastTextFieldRange.length - 1];

    let translatedWord = await TRANSLATION_API_CALL(lastValue);
    console.log(translatedWord);
    lastTextFieldRange[lastTextFieldRange.length - 1] = translatedWord;
    console.log(lastTextFieldRange);
    textfield.firstChild.data = lastTextFieldRange.join(" ") + " ";
    MOVE_CARET_TO_END(textfield);
  }
}

async function TRANSLATION_API_CALL(wordToTranslate) {
  let fetchUrl = `https://www.google.com/inputtools/request?text=${wordToTranslate}&ime=transliteration_en_ne&num=1`;

  let response = await fetch(fetchUrl);
  response = await response.json();
  let translatedWord = response[1][0][1][0];

  translatedWord = translatedWord.endsWith(".")
    ? translatedWord.replace(".", "।")
    : translatedWord;

  return translatedWord;
}

function FIND_TEXT_FIELD(node) {
  if (node.children.length === 0) {
    return node;
  } else {
    return TRAVERSE_CHILD(node.children[0]);
  }
}

function MOVE_CARET_TO_END(elem) {
  if (!elem.firstChild) return;
  let selection = window.getSelection();
  let range = new Range();

  range.setStart(elem.firstChild, elem.firstChild.length);
  range.collapse();
  selection.removeAllRanges();
  selection.addRange(range);
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
