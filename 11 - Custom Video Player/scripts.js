// Get elements on the page
const player = document.querySelector('.player')

const playButton = document.querySelector('.toggle')
const video = document.querySelector('video')
// alternatively --> player.querySelector('video')

const volumeSlider = document.querySelector('input[name="volume"]')
const playbackSlider = document.querySelector('input[name="playbackRate"]')
const ranges = document.querySelectorAll('.player__slider')

const rewindButton = document.querySelectorAll('button[data-skip]')[0]
const skipButton = document.querySelectorAll('button[data-skip]')[1]
const skipButtons = document.querySelectorAll('[data-skip]')

const progress = document.querySelector('.progress')
const progressBar = document.querySelector('.progress__filled');

const fullscreenButton = document.querySelector('.fullscreen__button')

function playPauseVideo() {
  if(video.paused) {
    video.play()
  } else {
    video.pause()
  }
}

function updateButton() { // better make own function instead of handling it in playPauseVideo since user may pause video without clicking
  const icon = this.paused ? '►' : '||'
  playButton.textContent = icon
}

playButton.addEventListener('click', playPauseVideo)
video.addEventListener('click', playPauseVideo)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)

function handleRangeUpdate() {
  video[this.name] = this.value;
}

ranges.forEach((range) => range.addEventListener('change', handleRangeUpdate))
ranges.forEach((range) => range.addEventListener('mousemove', handleRangeUpdate))

// function handleVolume() {
//   video.volume = volumeSlider.value;
// }

// volumeSlider.addEventListener('change', handleVolume)
// volumeSlider.addEventListener('mousemove', handleVolume)

// function handlePlayback() {
//   video.playbackRate = playbackSlider.value;
// }

// playbackSlider.addEventListener('change', handlePlayback)
// playbackSlider.addEventListener('mousemove', handlePlayback)

function skipper() {
  console.log(typeof this.dataset.skip)
  video.currentTime += parseFloat(this.dataset.skip);
}

skipButtons.forEach((skipButton) => skipButton.addEventListener('click', skipper))

// function rewind() {
//   video.currentTime -= 10;
// }

// rewindButton.addEventListener('click', rewind)

// function skip() {
//   video.currentTime += 25;
// }

// skipButton.addEventListener('click', skip);

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`
  // progressBar.style.flexBasis = `${(video.currentTime / video.duration) * 100}% `
}

video.addEventListener('timeupdate', handleProgress) // or video.addEventListener('progress', handleProgress)
// window.setInterval(handleProgress, 1000);

let mousedown = false;

function scrub(e) {
  isClicking = true;
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}



progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
// progress.addEventListener('mousemove', () => {
//   if(mousedown) {
//     scrub()
//   }
// })
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

function makeFullScreen() {
  if(document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    player.requestFullscreen();
  }
}

fullscreenButton.addEventListener('click', makeFullScreen)
video.addEventListener('dblclick', makeFullScreen)
