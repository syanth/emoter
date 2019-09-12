(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  
  // TODO: Automatic paste into message
  function addMessage() 
  { 
    messageBox = document.querySelectorAll("[contenteditable='true']")[0]; 
    message = "Test Message"; // Replace My Message with your message 
    event = document.createEvent("UIEvents"); 
    messageBox.innerHTML = message; //message.replace(/ /gm, ''); // test it 
    event.initUIEvent("input", true, true, window, 1); 
    messageBox.dispatchEvent(event);
  }     

  /**
   * Listen for messages from the background script.
  */
  // browser.runtime.onMessage.addListener((message) => {
  //   if (message.command === "reset") {
  //   }
  // });

})();