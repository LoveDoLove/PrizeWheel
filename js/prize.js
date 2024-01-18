import { cookiesReader, cookiesWriter } from "./app.js";
import { throwSuccessDialog, throwWarningDialog } from "./dialog.js";
// Drawing Mode
function callIsDrawingMode() {
  if (document.getElementById("isDrawingMode").checked) {
    isNeedHide(true);
    document.getElementsByClassName("prizeList")[0].style.display = "none";
    document.getElementsByClassName("drawLayout")[0].style.display = "flex";
    showAllPrizeListAsFloatingBall();
  } else {
    isNeedHide(false);
    document.getElementsByClassName("prizeList")[0].style.display = "block";
    document.getElementsByClassName("drawLayout")[0].style.display = "none";
    hideAllPrizeListAsFloatingBall();
  }
}
function isNeedHide(isHide) {
  let hide = document.getElementsByClassName("hide");
  if (isHide) {
    for (let i = 0; i < hide.length; i++) {
      hide[i].style.display = "none";
    }
  } else {
    for (let i = 0; i < hide.length; i++) {
      hide[i].style.display = "flex";
    }
  }
}
function readIsDrawingModeFromCookies() {
  let isDrawingMode = cookiesReader("isDrawingMode");
  if (isDrawingMode == "true") {
    isNeedHide(true);
    document.getElementById("isDrawingMode").checked = true;
  } else {
    document.getElementById("isDrawingMode").checked = false;
  }
  callIsDrawingMode();
}
document.getElementById("isDrawingMode").addEventListener("click", function () {
  cookiesWriter("isDrawingMode", document.getElementById("isDrawingMode").checked);
  callIsDrawingMode();
});
readIsDrawingModeFromCookies();
// Prize List
function appendPrizeItem(name, num) {
  let prizeList = document.getElementsByClassName("prizeList")[0];
  let prizeItem = document.createElement("div");
  prizeItem.className = "prizeItem";
  let prizeName = document.createElement("div");
  prizeName.className = "prizeName";
  prizeName.innerHTML = "Item Name: " + name;
  let prizeNum = document.createElement("div");
  prizeNum.className = "prizeNum";
  prizeNum.innerHTML = "Total: " + num;
  let prizeEdit = document.createElement("button");
  prizeEdit.className = "prizeEdit";
  prizeEdit.innerHTML = "Edit";
  let prizeDelete = document.createElement("button");
  prizeDelete.className = "prizeDelete";
  prizeDelete.innerHTML = "Delete";
  prizeItem.appendChild(prizeName);
  prizeItem.appendChild(prizeNum);
  prizeItem.appendChild(prizeEdit);
  prizeItem.appendChild(prizeDelete);
  prizeList.appendChild(prizeItem);
  prizeEdit.addEventListener("click", function () {
    let itemName = prompt("Please enter the item name", name);
    let itemNum = prompt("Please enter the total number", num);
    if (itemName && itemNum) {
      prizeName.innerHTML = "Item Name: " + itemName;
      prizeNum.innerHTML = "Total: " + itemNum;
      removePrizeItemFromCookies(name);
      addPrizeItemToCookies(itemName, itemNum);
      readPrizeFromCookies();
    }
  });
  prizeDelete.addEventListener("click", function () {
    prizeList.removeChild(prizeItem);
    removePrizeItemFromCookies(name);
  });
}
function removePrizeItemFromCookies(name) {
  let prizeJson = cookiesReader("prizeJson");
  if (!prizeJson) {
    return;
  }
  let prizeItems = JSON.parse(prizeJson);
  for (let i = 0; i < prizeItems.length; i++) {
    let prizeItem = prizeItems[i];
    if (prizeItem.name == name) {
      prizeItems.splice(i, 1);
      break;
    }
  }
  cookiesWriter("prizeJson", JSON.stringify(prizeItems));
}
// Add New Prize Item
function addPrizeItemToCookies(name, num) {
  let prizeJson = cookiesReader("prizeJson");
  if (!prizeJson) {
    prizeJson = "[]";
  }
  let prizeItems = JSON.parse(prizeJson);
  prizeItems.push({ name: name, num: num });
  cookiesWriter("prizeJson", JSON.stringify(prizeItems));
}
function readPrizeFromCookies() {
  let prizeJson = cookiesReader("prizeJson");
  let prizeList = document.getElementsByClassName("prizeList")[0];
  // check if prize list is not empty, then clear it
  if (prizeList.hasChildNodes()) {
    while (prizeList.childNodes.length > 0) {
      prizeList.removeChild(prizeList.firstChild);
    }
  }
  if (prizeJson) {
    let prizeItems = JSON.parse(prizeJson);
    for (let i = 0; i < prizeItems.length; i++) {
      let prizeItem = prizeItems[i];
      appendPrizeItem(prizeItem.name, prizeItem.num);
    }
  }
}
readPrizeFromCookies();
// Draw Prize
function minusPrizeNumFromCookies(name) {
  let prizeJson = cookiesReader("prizeJson");
  if (!prizeJson) {
    return;
  }
  let prizeItems = JSON.parse(prizeJson);
  for (let i = 0; i < prizeItems.length; i++) {
    let prizeItem = prizeItems[i];
    if (prizeItem.name == name) {
      prizeItem.num = parseInt(prizeItem.num) - 1;
      if (prizeItem.num == 0) {
        prizeItems.splice(i, 1);
      }
      break;
    }
  }
  cookiesWriter("prizeJson", JSON.stringify(prizeItems));
}
function startDrawPrize() {
  let prizeList = cookiesReader("prizeJson");
  if (!prizeList) {
    return "No prize";
  }
  let prizeItems = JSON.parse(prizeList);
  let totalNum = 0;
  for (let i = 0; i < prizeItems.length; i++) {
    let prizeItem = prizeItems[i];
    totalNum += parseInt(prizeItem.num);
  }
  let randomNum = Math.floor(Math.random() * totalNum);
  let prizeName = "";
  let prizeNum = 0;
  for (let i = 0; i < prizeItems.length; i++) {
    let prizeItem = prizeItems[i];
    prizeNum += parseInt(prizeItem.num);
    if (randomNum < prizeNum) {
      prizeName = prizeItem.name;
      break;
    }
  }
  minusPrizeNumFromCookies(prizeName);
  return prizeName;
}
// Add Listener
document.getElementById("addNewItem").addEventListener("click", function () {
  let itemName = document.getElementById("itemName").value;
  let totalNum = document.getElementById("totalNum").value;
  if (itemName && totalNum) {
    // clear input
    document.getElementById("itemName").value = "";
    document.getElementById("totalNum").value = "";
    addPrizeItemToCookies(itemName, totalNum);
    readPrizeFromCookies();
  }
});
document.getElementById("drawPrize").addEventListener("click", function () {
  let prizeJson = cookiesReader("prizeJson");
  let prizeItems = JSON.parse(prizeJson);
  if (!prizeItems || prizeItems.length == 0) {
    throwWarningDialog("Please add prize first!", true);
    return;
  }
  let prizeName = startDrawPrize();
  showDrawingNow();
  // throwWarningDialog("Please wait...", false);
  setTimeout(() => {
    readPrizeFromCookies();
    hideAllPrizeListAsFloatingBall();
    showAllPrizeListAsFloatingBall();
    throwSuccessDialog("Congratulations! You got " + prizeName + "!", true);
  }, 3000);
});
// Modified showDrawingNow function
function showDrawingNow(prizeIndex) {
  let floatingBalls = document.querySelectorAll(".floatingBall");
  let defaultColor = "#3498db"; // Default color
  let redColor = "red";
  let i = 0;
  let interval = setInterval(() => {
    if (i != 0) {
      floatingBalls[i - 1].style.backgroundColor = defaultColor; // Reset the color of the previous ball
    }
    floatingBalls[i].style.backgroundColor = "yellow"; // Set the color of the current ball to yellow
    if (i === prizeIndex) {
      // Check if the current ball is the prize
      floatingBalls[i].style.backgroundColor = redColor; // Set the color of the prize ball to red
    }
    i++;
    if (i >= floatingBalls.length) {
      i = 0; // Reset the index to 0 when reaching the last ball
      // Optionally, reset the colors to the default after the animation loop completes
      floatingBalls.forEach((ball) => {
        ball.style.backgroundColor = defaultColor;
      });
    }
  }, 10);
  // Stop the animation after 3 seconds
  setTimeout(() => {
    clearInterval(interval);
  }, 3000);
}
// Floating Ball
function hideAllPrizeListAsFloatingBall() {
  let floatingBalls = document.querySelectorAll(".floatingBall");
  floatingBalls.forEach((ball) => {
    document.body.removeChild(ball);
  });
}
function showAllPrizeListAsFloatingBall() {
  let prizeJson = cookiesReader("prizeJson");
  let prizeItems = JSON.parse(prizeJson);
  if (!prizeItems || prizeItems.length === 0) {
    return;
  }
  prizeItems.forEach((prizeItem) => {
    let floatingBall = document.createElement("div");
    floatingBall.className = "floatingBall";
    floatingBall.innerHTML = prizeItem.name;
    document.body.appendChild(floatingBall);
  });
}
