class Controller {
  constructor() {
    this.modelCls = new Model();
    this.audioCls = new AudioPlayer();
    this.viewCls = new View({
      modelCls: this.modelCls,
      audioCls: this.audioCls
    });
    this.updateOrientaion = this.updateOrientaion.bind(this);
    this.audioStatusChange = this.audioStatusChange.bind(this);
    this.onBookContentLoaded = this.onBookContentLoaded.bind(this);
    this.onSeekAudio = this.onSeekAudio.bind(this);
    this.onAudioEnd = this.onAudioEnd.bind(this);
    this.init();
  }

  init() {
    if ($('.content').length > 0) {
      const _lang = window.sessionStorage.getItem('_eb_language');
      if (_lang !== null) {
        this.modelCls.language = _lang;
      }
      this.modelCls.inPlayer = true;
      this.modelCls.configPath = `/vendor/mitr/${this.getURLScript()}/`;
    } else {
      this.modelCls.inPlayer = false;
    }
    this.bindEvents();
    this.loadDependencies();
    this.loadConfig((data) => {
      this.modelCls.pageData = data.pages;
      this.modelCls.totalPages = data.pages.length;
      this.modelCls.currentPage = 0;
      // this.updateOrientaion();
    });
    this.viewCls.init();
  }

  bindEvents() {
    // $(window).off('orientationchange').on('orientationchange', this.updateOrientaion);

    document.addEventListener('audio-change', this.audioStatusChange);
    document.addEventListener('pause-change', this.audioStatusChange);

    this.modelCls.on('modelUpdated', () => {
      this.viewCls.updateView();
    });

    window.onSeekAudio = this.onSeekAudio;

    this.viewCls.on('bookContentLoaded', this.onBookContentLoaded);

    this.audioCls.addEventListener('ended', this.onAudioEnd);

    this.viewCls.on('buttonPressed', ({
      type
    }) => {
      const {
        step,
        totalPages
      } = this.modelCls;
      let {
        currentPage
      } = this.modelCls;
      this.audioCls.pauseAudio();
      if (type === 'previous') {
        currentPage -= step;
        if (currentPage < 0) {
          currentPage = 0;
        }
      } else {
        currentPage += step;
        if (currentPage >= totalPages) {
          currentPage = totalPages - step;
        }
      }
      this.modelCls.currentPage = currentPage;
    });
  }

  audioStatusChange(_event) {
    console.log('audioStatusChange', _event);
  }

  updateOrientaion(event) {
    let orientaion = '';
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();

    const condition = event ? (windowWidth < windowHeight) : (windowWidth > windowHeight);

    if (condition) {
      orientaion = 'landscape';
    } else {
      orientaion = 'portrait';
    }
    this.modelCls.orientaion = orientaion;
  }

  loadConfig(callback) {
    jQuery.getJSON(`${this.modelCls.configPath}structure.json`, (data) => {
      callback(data);
    });
  }

  loadDependencies() {
    // $('head').append('<link rel="stylesheet" href="book/page.css"><link rel="stylesheet" href="css/style.css">');
    $('head').append(`<link rel="stylesheet" href="${this.modelCls.configPath}player/css/style.css">`);
  }

  onBookContentLoaded() {
    this.playAudio('left');
  }

  getURLScript() {
    var retStr = '';
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf('single-file-entry') !== -1) {
        retStr = scripts[i].src.split('/').reverse()[2];
      }
    }
    // var retStr = myScript.src.split('/').reverse()[2];
    return retStr;
  }

  onSeekAudio(_time, _side) {
    this.viewCls.deselectAll();
    this.playAudio(_side, _time);
  }

  playAudio(_side, _time) {
    this.viewCls.deselectAll();
    this.modelCls.currentSide = _side;
    var _aud = -1;
    if (this.modelCls.currentSide === 'left') {
      _aud = this.modelCls.currentPage;
    } else {
      _aud = this.modelCls.nextPage;
    }
    if (this.modelCls.pageData[_aud].audio) {
      this.audioCls.playAudio({
        src: `${this.modelCls.configPath}${this.modelCls.pageData[_aud].audio}`,
        side: this.modelCls.currentSide,
        time: _time
      });
    } else {
      this.onAudioEnd();
    }
  }

  onAudioEnd(_event) {
    this.viewCls.deselectAll();
    if (this.modelCls.currentSide === 'left') {
      this.playAudio('right');
    }
  }
}
$(document).ready(function () {
  new Controller();
});
