
// TODO: Make this be user editable and stored locally.
 var emotes = ["feelsbad", "squiddab", "feelsfunny"];
 autocomplete(document.getElementById("emInput"), emotes);

function updateClipboard(path) {
  fetch(browser.runtime.getURL(path))
  .then(response => response.arrayBuffer())
  .then(buffer => browser.clipboard.setImageData(buffer, 'png'));
}

// Text Field and array
 function autocomplete(inp, arr) {
  var currentFocus;

  var nameList;
  nameList = [];
  var gettingItem = browser.storage.sync.get('recent');
  gettingItem.then((res) => {
    nameList = res.recent;
    console.log(nameList);
    addRecents();
    console.log("Added");
  })
  //console.log(nameList);

  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      // Close any already open lists of autocompleted values
      closeAllLists();
      if (!val) {
        addRecents();
        return false;
      }
      currentFocus = -1;
      // Create a DIV element that will contain the items (values)
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          // DIV to contain each matching image
          b = document.createElement("DIV");
          b.setAttribute("class", "autocomplete-item");
          b.innerHTML = "<span class=\"emote-text\"><strong>" 
            + arr[i].substr(0, val.length) + "</strong>" 
            + arr[i].substr(val.length) + "</span>";
          let emoteImage = document.createElement("img");
          let emoteName = arr[i];
          let emotestr = "img/" + arr[i] + ".png";
          emoteImage.setAttribute("src", emotestr);
          emoteImage.setAttribute("class", "emote-image");
          b.appendChild(emoteImage);
          b.addEventListener("click", function(e) {
              if (!nameList.includes(emoteName)) {
                if (nameList.length >= 5) {nameList.pop();}
                nameList.unshift(emoteName);
              }
              saveRecent();
              updateClipboard("popup/" + emotestr);
              //closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) { // down
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        // If the ENTER key is pressed, prevent the form from being submitted
        e.preventDefault();
        if (currentFocus > -1) {
          // Simulate click
          if (x) x[currentFocus].click();
        }
      }
  });
  function saveRecent() {
    browser.storage.sync.set({
      recent: nameList
    })
  }
  function addRecents() {
    // Adds recent emotes to the popup
    var a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    inp.parentNode.appendChild(a);
    var b;
    console.log(nameList);
    for (i = 0; i < nameList.length; i++) {
      // DIV to contain each image
      b = document.createElement("DIV");
      b.setAttribute("class", "autocomplete-item");
      b.innerHTML = "<span class=\"emote-text\">" + nameList[i] + "</span>";
      let emoteImage = document.createElement("img");
      let emotestr = "img/" + nameList[i] + ".png";
      emoteImage.setAttribute("src", emotestr);
      emoteImage.setAttribute("class", "emote-image");
      b.appendChild(emoteImage);
      b.addEventListener("click", function(e) {
            updateClipboard("popup/" + emotestr);
            //closeAllLists();
      });
      a.appendChild(b);
    }
  }
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    //close all autocomplete lists in the document except the one passed as an argument
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

// Upon clicking in the document
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
// function listenForClicks() {
//   document.addEventListener("click", (e) => {
//      });
// }

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute emoter content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
// browser.tabs.executeScript({file: "/content_scripts/emoter.js"})
// .then(listenForClicks)
// .catch(reportExecuteScriptError);