const checkExtension = (id, src, callback) => {
  checkRunTime(id, src, callback);
  //checkManifest(id, src, callback);
  if (
    src.includes(".png") ||
    src.includes(".jpg") ||
    src.includes(".gif") ||
    src.includes(".svg")
  ) {
    checkImage(id, src, callback);
  } else {
    checkFetch(id, src, callback);
  }
};

const checkManifest = (id, src, callback) => {
    chrome.management.get(id, function(result) {  
      console.log(result);
  
      if (result) {
        callback(1);
      } else {
        callback(0);
      }
    });
};

const checkRunTime = (id, src, callback) => {
  console.log("Checking RunTime");
  var hasExtension = false;

  if (!chrome.runtime) {
    // Chrome Extensions API is not available
    console.log('Chrome Extensions API is not available');
    return;
  }

  chrome.runtime.sendMessage(id, 'version', function (reply) {
    console.log(reply);
    if (reply) {
      hasExtension = true;
    } else {
      hasExtension = false;
    }
  });
};

const checkImage = (id, src, callback) => {
  let e = new Image();
  e.src = "chrome-extension://" + id + "/" + src;
  e.onload = () => callback(1);
  e.onerror = () => callback(0);
};

const checkFetch = (id, src, callback) => {
  fetch("chrome-extension://" + id + "/" + src)
    .then(() => callback(1))
    .catch(() => callback(0));
};

let extensions = [];

fetch("assets/extensions.json")
  .then((response) => response.json())
  .then((data) => {
    extensions = data["extensions"];

    let table = document.getElementById("extensions");
    extensions.forEach((extension) => {
      checkExtension(extension["id"], extension["src"], (ok) => {
        let row = table.insertRow(-1);

        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);

        cell1.textContent = extension["name"];
        cell2.textContent = ok ? "Installed" : "Not Installed";

        if (cell2.textContent == "Installed") {
          cell2.classList.add("green-text");
        } else {
          cell2.classList.add("red-text");
        }
      });
    });
  })
  .catch((error) => console.error("Error: ", error));
