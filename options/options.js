 document.getElementById("upload").addEventListener("change", uploadImage, false);

var db = new Dexie("Custom");
db.version(1).stores({
  emotes: "name, image",
});

async function uploadImage() {
    const fileList = this.files;
    const numFiles = fileList.length;
    for (let i = 0, numFiles = fileList.length; i < numFiles; i++) {
      const file = fileList[i];
      const blob = file; // await file.blob();
      await db.emotes.put({
        name: "Test",
        image: blob
      })
    }
    var a = document.querySelector("p");
    a.innerText = "Uploaded";
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