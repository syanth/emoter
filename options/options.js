document.getElementById("upload").addEventListener("change", removeMessage, false);
document.getElementById("submit").addEventListener("click", uploadImage, false);


var db = new Dexie("Custom");
db.version(1).stores({
  emotes: "name, image"
});

function removeMessage(){
  var a = document.querySelector("p");
    a.innerText = "";
}

async function uploadImage() {
    let text = document.getElementById("name").value;
    const fileList = document.getElementById("upload").files;
    if (text.length === 0 || fileList.length === 0) {
      var a = document.querySelector("p");
      a.innerText = "Please select a file and enter a name for the emote";
      return;
    }
    const file = fileList[0];
    const blob = file; // await file.blob();
    await db.emotes.put({
      name: text,
      image: blob
    })
    var a = document.querySelector("p");
    a.innerText = "Saved";
}

async function testDisplay() {
  const emote = await db.emotes.get({
    name: "Test"
  });
  const file = emote.image;
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(file);
  document.querySelector("img").src = imageUrl;
}