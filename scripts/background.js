var POPUP_OPEN = false;

// Check for keyboard shortcuts and change storage value if appropriate command
chrome.commands.onCommand.addListener(
    (command)=> {
                if (command == "turn-nepali-typing-on/off"){

                        if (POPUP_OPEN){
                        // if the popup is open while using the command, then reflect the changes in the popup
                        // Simulate as if the user pressed the on/off button
                                chrome.runtime.sendMessage({message: "button-press"});}
                        else {
                                chrome.storage.sync.get(["translateText"]).then((result) => {
                                let valueToSwitchTo = (result.translateText) ? false : true
                                TOGGLE_TRANSLATE_VALUE(valueToSwitchTo);
                        });
                }
        }
    }
)

// Handle messages from popup if user clicks the on/off button
chrome.runtime.onMessage.addListener((message) => {
        if (message.message == "toggle-value") TOGGLE_TRANSLATE_VALUE(message.toggle_value);
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
      
                try {
                        await chrome.tabs.sendMessage(tab.id, {
                        translate: boolean,
                        });}
                
                // content-script won't be loaded to currently open tabs when extension is loaded/reinstalled etc
                // Inject content scripts in those tabs
                catch(error) {
                        chrome.scripting.executeScript({
                                target: {tabId: tab.id, allFrames: true},
                                // location relative to root folder(where manifest.json is)
                                files: ['scripts/content.js'],
                        });
                        }
                });
        });
      }

// Keep track whether the popup is open or not
chrome.runtime.onConnect.addListener(
        (port)=>{
            if (port.name == 'popup'){
                // popup has been opened
                POPUP_OPEN = true;
                port.onDisconnect.addListener(()=>{
                    POPUP_OPEN = false;
                    // popup has been closed
                })
            }
        }
    )