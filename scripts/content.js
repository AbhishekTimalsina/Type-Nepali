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

function TRAVERSE_CHILD(node) {
  if (node.children.length === 0) {
    return node;
  } else {
    return TRAVERSE_CHILD(node.children[0]);
  }
}

async function HANDLE_TRANSLATION_FOR_OTHERS(e) {
  let targetDiv = e.target;
  let textfield = TRAVERSE_CHILD(targetDiv);

  let range = new Range();
  console.log(textfield.textContent.length);
  range.setStart(textfield.firstChild, textfield.textContent.length);
  range.setEnd(textfield.firstChild, textfield.textContent.length);
  console.log(textfield.textContent);
  console.log(range);

  if (e.keyCode === 32) {
    if (!textfield) {
      console.log("no detected");
      return;
    }
    let textFieldValue = textfield.textContent;
    // console.log(textFieldValue);
    let lastTextFieldRange = textFieldValue.split(" ");
    let lastValue = lastTextFieldRange[lastTextFieldRange.length - 1];

    let index = textFieldValue.indexOf(lastValue);

    range.setStart(textfield.firstChild, index);
    range.setEnd(textfield.firstChild, textFieldValue.length);
    // console.log(range);

    let translatedWord = await TRANSLATION_API_CALL(lastValue);
    range.deleteContents();
    // console.log(translatedWord);

    let textNode = document.createTextNode(translatedWord);
    range.insertNode(textNode);

    range.setStart(textfield.firstChild, textfield.firstChild.length);
    range.setEnd(textfield.firstChild, textfield.firstChild.length);
    // range.collapse(false);
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
