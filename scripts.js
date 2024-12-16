const terminal = document.getElementById('terminal');
const promptMessage = document.getElementById('prompt-message');
const inputLine = document.querySelector('.input-line');
const passwordInput = document.getElementById('password-input');
const videoContainer = document.getElementById('video-container');
const setHeight = document.getElementById('set-height');
const video = document.getElementById('traverse-video');

/**
 * Function that types out text one character at a time.
 */
function typeText(element, text, callback) {
  let index = 0;
  const interval = setInterval(() => {
    element.textContent += text[index];
    index++;
    if (index === text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 50);
}

/**
 * Function that creates a message and adds it to the terminal with an optional callback after typing.
 */
function addMessage(text, callback) {
  const message = document.createElement('div');
  message.className = 'line';
  terminal.insertBefore(message, inputLine);
  typeText(message, text, callback);
  terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Function that resets video playback and scroll position.
 */
function resetVideoAndScroll() {
  video.currentTime = 0;
  window.scrollTo(0, 0);
}

/**
 * Function that initializes video playback with ScrollTrigger.
 *
 * Inspired by https://codepen.io/marduklien/pen/MdvdEG?editors=1010
 */
function initializeVideoPlayback() {
  video.load(); // load the video manually

  terminal.style.display = 'none';
  videoContainer.style.display = 'block';

  video.addEventListener('loadedmetadata', () => {
    // set large scrollable height
    setHeight.style.height = `${Math.floor(video.duration) * 500}px`;

    gsap.registerPlugin(ScrollTrigger);

    // create a ScrollTrigger instance to sync scroll and video playback
    ScrollTrigger.create({
      trigger: video,
      start: 'top top',
      end: `+=${Math.floor(video.duration) * 500}`,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress * video.duration;
        video.currentTime = progress;
      },
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  resetVideoAndScroll();

  typeText(promptMessage, 'Enter the password to continue:');

  passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const input = passwordInput.value.trim();

      if (input === 'GOD') {
        passwordInput.style.display = 'none';

        addMessage('Password accepted. Connecting to the Gibson...', () => {
          setTimeout(initializeVideoPlayback, 500);
        });
      } else {
        addMessage('Incorrect password. Hint: GOD');
      }

      passwordInput.value = '';
    }
  });
});
