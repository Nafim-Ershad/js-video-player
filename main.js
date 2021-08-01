const video = document.querySelector("video");
const video_wrapper = document.querySelector(".video-wrapper");
const videoSource = document.querySelector(".video-wrapper video source");
const selection = document.querySelector(".selection");
const selectionBtn = document.querySelector(".selection-btn");
// Sources
const sources = [{
    title: "Sea waves & beach drone video | Free HD Video - no copyright",
    author: "Free HD videos - no copyright",
    src: "./reference_videos/video1.mp4",
    type: "video/mp4",
    poster: null
}, {
    title: "Sunrise video | Drone Footage | Free HD Video - no copyright",
    author: "Free HD videos - no copyright",
    src: "./reference_videos/video2.mp4",
    type: "video/mp4",
    poster: null
}, {
    title: "HD flower video | Amazing nature | Free HD videos - no copyright",
    author: "Free HD videos - no copyright",
    src: "./reference_videos/video3.mp4",
    type: "video/mp4",
    poster: null
}];

// Info
const videoTitle = document.querySelector(".video-wrapper .video-info .title");
const videoAuthor = document.querySelector(".video-wrapper .video-info .author span");

// Controls
const playControl = document.querySelector(".video-wrapper .video-controls .play-controls");

// Time
const timeElapsed = document.querySelector(".time .currentTime");
const timeDuration = document.querySelector(".time .duration");

// Seeking
const seek = document.querySelector(".seek-track");

// Volume
const volumeBtn = document.querySelector(".volumeBtn");
const volumeControls = document.querySelector(".volume-controls");
const volumeBar = document.querySelector(".volume-range");

// FullScreen
const fullscreenControl = document.querySelector(".fullscreen-controls");

// Variables
const prevSize = [video.getBoundingClientRect().width, video.getBoundingClientRect().height];
var isFullScreen = false;
var isPlaying = false;
var isPaused = true;


// Functions
function handleVolumeLevel(volLevel) {
    if (volLevel > 0.5) {
        volumeBtn.className = "fas fa-volume-up volumeBtn";
    }
    if (0 < volLevel && volLevel <= 0.5) {
        volumeBtn.className = "fas fa-volume-down volumeBtn";
    }
    if (volLevel === 0) {
        volumeBtn.className = "fas fa-volume-mute volumeBtn";
    }
}

function roundOff(number, places = 2) {
    // Rounds a decimal number upto a certain decimal point
    let x = Math.pow(10, places);
    return Math.floor(number * x) / x;
}

function getPercentage(number, limit) {
    return (number / limit) * 100
}

function controlPlays() {
    if (isPlaying) {
        video.pause();
        playControl.innerHTML = "" + "<i class='fas fa-play'></i>";
        isPlaying = false;
        isPaused = true;
    } else {
        video.play();
        playControl.innerHTML = "" + "<i class='fas fa-pause'></i>";
        isPlaying = true;
        isPaused = false;
    }
}

function toTime(seconds) {
    let min = Math.floor(seconds / 60);
    let secs = Math.ceil(seconds - (min * 60));
    if (secs < 10) {
        if (min < 10)
            return (`0${min}:0${secs}`);
        else {
            return (`${min}:0${secs}`)
        }
    } else {
        if (min < 10)
            return (`0${min}:${secs}`);
        else {
            return (`${min}:${secs}`);
        }
    }
}

function loadCurrent(obj) {
    videoSource.src = obj.src;
    videoSource.type = obj.type;
    videoTitle.innerHTML = obj.title;
    videoAuthor.innerHTML = obj.author;
    if (obj.poster) {
        video.poster = obj.poster
    } else {
        video.poster = "./default.jpg"
    }
    video.load();
}

function resetPlayer() {
    isPlaying = true;
    isPaused = false;
    controlPlays();
    seek.value = 0;
    timeElapsed.innerText = "00:00";
    timeDuration.innerText = toTime(video.duration);
}
// **************** For Testing selection dropdown --> window onload
// Event Handlers
window.addEventListener("load", function(e) {
    var data = sources.filter((el, idx) => Number(selection.value) === idx)[0];
    sources.forEach((el, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        if (idx === 0) {
            option.setAttribute("selected", true);
        }
        option.innerText = el.title;
        selection.appendChild(option);
    })
    loadCurrent(data);
});

window.addEventListener("keypress", function(e) {
    switch (e.code) {
        case "Space":
            controlPlays();
            break;
        default:
            break;
    }
})

selectionBtn.addEventListener("click", function(e) {
    resetPlayer();
    var data = sources.filter((el, idx) => Number(selection.value) === idx)[0];
    loadCurrent(data);
});

video.addEventListener('loadeddata', (event) => {
    handleVolumeLevel(1);
    resetPlayer();
    timeDuration.innerText = toTime(video.duration);
    // console.log("DATA LOADED:", video);
});

video.addEventListener('timeupdate', function(e) {
    timeDuration.innerText = toTime(roundOff(video.duration));
    timeElapsed.innerText = toTime(roundOff(video.currentTime));
    seek.value = getPercentage(video.currentTime, video.duration);
});

video.addEventListener("ended", function(e) {
    resetPlayer();
});

playControl.addEventListener("click", function(e) {
    controlPlays();
});

seek.addEventListener("input", function(e) {
    video.currentTime = (seek.value * video.duration) / 100;
});

volumeBar.addEventListener("input", function(e) {
    var volLevel = roundOff(volumeBar.value / 100, 2);
    handleVolumeLevel(volLevel);
    video.volume = volLevel;
});

fullscreenControl.addEventListener("click", function(e) {
    if (isFullScreen) {
        video_wrapper.style.width = `${prevSize[0]}px`;
        video_wrapper.style.height = `${prevSize[1]}px`;
        isFullScreen = false;
        this.innerHTML = '<i class="fas fa-expand"></i>';
    } else {
        video_wrapper.style.width = "100vw";
        video_wrapper.style.height = "100vh";
        isFullScreen = true;
        this.innerHTML = '<i class="fas fa-compress"></i>';
    }
});