// Check for keyboard shortcuts and change storage value if appropriate command
chrome.commands.onCommand.addListener(
    (command)=> {
                if (command == "turn-nepali-typing-on/off"){
                        chrome.storage.sync.get(["translateText"]).then((result) => {
                        let valueToSwitchTo = (result.translateText) ? false : true
                        TOGGLE_TRANSLATE_VALUE(valueToSwitchTo);
                });
        }
    }
)

chrome.runtime.onMessage.addListener((message) => {
        TOGGLE_TRANSLATE_VALUE(message.toggle_value)
});

function TOGGLE_TRANSLATE_VALUE(boolean) {
        console.log("The value is now", boolean);
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
