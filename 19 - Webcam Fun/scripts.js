const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      // video.src = window.URL.createObjectURL(localMediaStream); convert localMediaStream object into URL that video player can understand --> deprecated
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!!`, err);
    })
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight; // canvas needs to have same dimensions as video
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => { // return setInterval to have access to it later on and clearInterval
    ctx.drawImage(video, 0, 0, width, height) // start at top left hand corner of canvas and paint width and height

    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);

    // mess with pixels
    // pixels = redEffect(pixels)
    // pixels = rgbSplit(pixels)
    // ctx.globalAplha = 0.1;

    pixels = greenScreen(pixels);

    // put them back
    ctx.putImageData(pixels, 0, 0)
  }, 16);
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg'); // creates text-based representation of the image
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data} alt="Handsome Man" />`
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) { // imageData not a normal array so can't use map
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[0] + 100; // r
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // g
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // b
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 250] = pixels.data[0]; // r
    pixels.data[i + 500] = pixels.data[i + 1]; // g
    pixels.data[i - 500] = pixels.data[i + 2]; // b
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value
  });

  console.log(levels);

  for(i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];


    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels
}

getVideo();

video.addEventListener('canplay', paintToCanvas)
