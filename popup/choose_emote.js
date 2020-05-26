var db = new Dexie("Custom");
db.version(1).stores({
  emotes: "name, image, type"
});

 autocomplete(document.getElementById("emInput"));
 document.getElementById("emInput").focus(); 

function updateClipboard(path, type) {
  fetch(browser.runtime.getURL(path))
  .then(response => response.arrayBuffer())
  .then(buffer => browser.clipboard.setImageData(buffer, type));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Text Field and array
 async function autocomplete(inp) {
  var currentFocus;

  var nameList;
  nameList = [];
  var gettingItem = browser.storage.sync.get('recent');
  gettingItem.then((res) => {
    if (res.recent) {
      nameList = res.recent;
      console.log(nameList);
      addRecents();
    }
  });
  //console.log(nameList);

  inp.addEventListener("input", async function(e) {
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

      // DB Query
      db.emotes.where("name").startsWithIgnoreCase(val).each( async function (emote) {
        let emoteName = emote.name;
        console.log("Found: " + emote.name);
        // DIV to contain each matching image
        b = document.createElement("DIV");
        b.setAttribute("class", "autocomplete-item");
        b.innerHTML = "<span class=\"emote-text\"><strong>" 
          + emoteName.substr(0, val.length) + "</strong>" 
          + emoteName.substr(val.length) + "</span>";
        const file = emote.image;
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(file);
        let emoteImage = document.createElement("img");
        emoteImage.setAttribute("src", imageUrl);
        emoteImage.setAttribute("class", "emote-image");
        b.appendChild(emoteImage);
        b.addEventListener("click", async function(e) {
            if (!nameList.includes(emoteName)) {
              if (nameList.length >= 5) {nameList.pop();}
              nameList.unshift(emoteName);
            }
            saveRecent();
            updateClipboard(imageUrl, emote.type);
            await sleep(1);
            window.close();
        });
        a.appendChild(b);
      }).catch(function (error) {
        console.error(error);
      })   
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      console.log(x);
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
  async function addRecents() {
    // Adds recent emotes to the popup
    currentFocus = -1;
    var a = document.createElement("DIV");
    a.setAttribute("id", inp.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    inp.parentNode.appendChild(a);
    var b;
    console.log(nameList);
    for (i = 0; i < nameList.length; i++) {
      let emoteName = nameList[i];
      db.emotes.get(emoteName, async function (emote) {
        // DIV to contain each image
        b = document.createElement("DIV");
        b.setAttribute("class", "autocomplete-item");
        b.innerHTML = "<span class=\"emote-text\">" + emoteName + "</span>";
        const file = emote.image;
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(file);
        let emoteImage = document.createElement("img");
        emoteImage.setAttribute("src", imageUrl);
        emoteImage.setAttribute("class", "emote-image");
        b.appendChild(emoteImage);
        b.addEventListener("click", async function(e) {
              updateClipboard(imageUrl, emote.type);
              await sleep(1);
              window.close();
        });
        a.appendChild(b);
      });
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