class AudioPlayer {
  constructor() {
    this.audioPlayer = new Audio();
    this.audioPlayer.addEventListener('ended', this.onEnded.bind(this))
    this.event = {};
    this.currentSide = '';
    this.isPlayingBool = false;
    this.initialised = false;
    this.updateCurrentFrame = this.updateCurrentFrame.bind(this);
  }

  addEventListener(_event, _callback) {
    this.event[_event] = _callback;
  }

  onEnded(_event) {
    this.isPlayingBool = false;
    if (this.event.ended) {
      this.event.ended();
    }
  }

  playAudio({
    src,
    side,
    time
  }) {
    this.currentSide = side;
    this.audioPlayer.src = src;
    this.resumeAudio(time);
  }

  pauseAudio() {
    this.audioPlayer.pause();
    this.isPlayingBool = false;
  }

  resumeAudio(_time) {
    if (this.initialised) {
      this.audioPlayer.play();
      if (typeof (_time) !== 'undefined') {
        var st = setInterval(() => {
          if (this.currentTime) {
            this.currentTime = _time;
            clearInterval(st);
          }
        }, 10);
      }
    }
    this.isPlayingBool = true;
    this.updateCurrentFrame();
  }

  updateCurrentFrame() {
    if (this.event.update) {
      this.event.update();
    }
    if (this.isPlayingBool) {
      requestAnimationFrame(this.updateCurrentFrame);
    }
  }

  initAudio() {
    this.initialised = true;
    this.resumeAudio();
  }

  set currentTime(_time) {
    this.audioPlayer.currentTime = _time;
  }

  get currentTime() {
    return this.audioPlayer.currentTime;
  }
}
