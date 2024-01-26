async function TRANSLATION_HANDLER(e) {
  if (e.keyCode === 32) {
    if (
      !(e.target.localName === "input" || e.target.localName === "textarea")
    ) {
      HANDLE_TRANSLATION_FOR_OTHER_FIELDS(e);
      return;
    }

    let { value } = e.target;
    let lines = value.split("\n");
    let lastLine = lines[lines.length - 1];

    let words = lastLine.split(" ");
    let recentWord = words[words.length - 1];

    if (!recentWord || recentWord === "," || recentWord === "|") {
      return;
    }
    let translatedWord = await TRANSLATION_API_CALL(recentWord);

    words[words.length - 1] = translatedWord;
    lastLine = words.join(" ");

    lines[lines.length - 1] = lastLine;
    e.target.value = lines.join("\n") + " ";
  }
}

async function HANDLE_TRANSLATION_FOR_OTHER_FIELDS(e) {
  let targetDiv = e.target;
  let textfield = FIND_TEXT_FIELD(targetDiv);

  if (e.keyCode === 32) {
    if (!textfield) return;

    let textFieldValue = textfield.textContent;

    let lines = textFieldValue.split("\n");
    let lastLine = lines[lines.length - 1];
    let words = lastLine.split(" ");
    let recentWord = words[words.length - 1];

    if (!recentWord || recentWord === "," || recentWord === "|") {
      return;
    }

    let translatedWord = await TRANSLATION_API_CALL(recentWord);

    words[words.length - 1] = translatedWord;
    lastLine = words.join(" ");

    lines[lines.length - 1] = lastLine;
    textfield.firstChild.data = lines.join("\n") + " ";

    MOVE_CARET_TO_END(textfield);
  }
}

// CALL THE API TO TRANSLATE WORD, RETURNS THE TRANSLATED WORD
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

// FINDS THE TEXT FIELD THAT IS THE DEEPEST CHILDREN OF THE E.TARGET
function FIND_TEXT_FIELD(node) {
  if (node.children.length === 0) {
    return node;
  } else {
    return FIND_TEXT_FIELD(node.children[0]);
  }
}

// MOVES THE CURSOR POSITION TO END
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
  chrome.storage.sync.set({
    translateText: request.translate,
  });
});

chrome.storage.sync.get(["translateText"]).then((obj) => {
  if (obj.translateText) {
    window.addEventListener("keydown", TRANSLATION_HANDLER);
  }
});
