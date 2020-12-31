var isPageScrollCompleted = false;
var isVideoCompleted = false;
window.addEventListener(
  "message",
  (event) => {
    if (event.data == "completed") {
      updateMarkCompletedButton();
    }
  },
  false
);
function updateMarkCompletedButton() {
  var markCompButton = document.getElementById("mark-complete");
  markCompButton.setAttribute(
    "style",
    "float:right; color: white; border:0; padding: 5px; background-color: #666; cursor:not-allowed; pointer-events: none"
  );
  markCompButton.innerHTML = "Completed";
}

function isScrollPresent() {
   return (document.body.offsetHeight > window.innerHeight) ? true : false;
}

function isScrollBarReachedBottom() {
  return (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) ? true : false;
}

function scrollBarTracking() {
  if (!isPageScrollCompleted) {
    if(isScrollBarReachedBottom()){
      window.parent.postMessage("pageScrollCompleted", "*");
      pageScrollCompleted = "pageScrolled";
      updateStatus(pageScrollCompleted);
    }
  }
}

function setScrollBarTracking() {
  if (!isPageScrollCompleted) {
    if(isScrollPresent()){
      window.removeEventListener("scroll", scrollBarTracking);
      window.addEventListener("scroll", scrollBarTracking);
    }else{
      scrollBarTracking();
    }
  }
}

setScrollBarTracking();
window.onresize = function(){ setScrollBarTracking() };

var videoObj = document.getElementById("video1");

if (videoObj == undefined || videoObj == null) {
  window.parent.postMessage("videoNone", "*");
  videoIsCompleted = "videoNone";
  updateStatus(videoIsCompleted);
} else {
  videoObj.addEventListener("ended", function () {
    window.parent.postMessage("videoCompleted", "*");
    videoIsCompleted = "videoIsComplete";
    updateStatus(videoIsCompleted);
  });
}

function updateStatus(status) {
  if (status == "pageScrolled") {
    isPageScrollCompleted = true;
  }
  if (status == "videoIsComplete" || status == "videoNone") {
    isVideoCompleted = true;
  }
  if (isPageScrollCompleted && isVideoCompleted) {
    markCompletedButton.setAttribute(
      "style",
      "float:right; color: white; border:0; padding: 5px; background-color: #c02222;"
    );
  }
}

var footer = document.getElementById("footer");
if (footer) {
  var markCompletedButton = document.createElement("BUTTON");
  markCompletedButton.setAttribute("id", "mark-complete");
  markCompletedButton.innerHTML = "Mark Completed";
  markCompletedButton.setAttribute(
    "style",
    "float:right; color: white; border:0; padding: 5px; background-color: #666; cursor:not-allowed; pointer-events: none"
  );
  document.body.appendChild(markCompletedButton);
}
var completeButton = document.getElementById("mark-complete");
document.getElementById("mark-complete").addEventListener("click", function () {
  markCompletedButton.setAttribute(
    "style",
    "float:right; color: white; border:0; padding: 5px; background-color: #666; cursor:not-allowed; pointer-events: none"
  );
  window.parent.postMessage("markComplete", "*");
  markCompletedButton.innerHTML = "Completed";
});