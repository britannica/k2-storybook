class View extends EventEmitter3 {
  constructor({
    modelCls,
    audioCls
  }) {
    super();
    this.modelCls = modelCls;
    this.audioCls = audioCls;
    this.$bookWrapper = null;
    this.$currentPage = null;
    this.$nextPage = null;
    this.$prevButton = null;
    this.$nextButton = null;
    this.$playLayer = null;
    this.$playButton = null;
    this.$nextPageWrapper = null;
    this.handleButtonEvent = this.handleButtonEvent.bind(this);
    this.handlePlayEvent = this.handlePlayEvent.bind(this);
    this.onViewChange = this.onViewChange.bind(this);
    this.onContentLoaded = this.onContentLoaded.bind(this);
    this.onAudioUpdate = this.onAudioUpdate.bind(this);
    this.assetLoaded = this.assetLoaded.bind(this);
    this.pageBounds = {
      width: 1080,
      height: 1322
    };
    this.pageloaded = 0;
    this.pageToLoad = this.modelCls.step;
    this.imagesToLoad = 0;
    this.imagesLoaded = 0;
    this.$shellWrapper = null;
    this.shellWidth = 0;
    this.shellHeight = 0;

    this.assetsLoaded = false;
    this.contentLoaded = false;
  }

  init() {
    this.createView();
    this.bindEvents();
    this.onViewChange();
    setInterval(() => {
      this.checkShellResize();
    }, 100);
  }

  createView() {
    var _shellWrap = document.createElement('div');
    this.$shellWrapper = $(_shellWrap);
    this.$shellWrapper.addClass('shellWrapper');
    if (this.modelCls.inPlayer) {
      // this.$shellWrapper = $($('.content')[0]);
      this.$shellWrapper.appendTo('.content');
    } else {
      this.$shellWrapper.appendTo('body');
      this.$shellWrapper.css({
        'position': 'fixed'
      });
    }
    this.$bookWrapper = $('<div/>').addClass('bookWrapper').appendTo(this.$shellWrapper);

    const $contentWrapper = $('<div/>').addClass('contentWrapper').appendTo(this.$bookWrapper);

    this.$currentPage = $('<iframe/>').addClass('currentPage bookPage').appendTo($contentWrapper).attr({
      'scrolling': 'no'
    });

    this.$nextPage = $('<iframe/>').addClass('nextPage bookPage').appendTo($contentWrapper).attr({
      'scrolling': 'no'
    });

    this.$prevButton = $('<button/>').data('type', 'previous').addClass('prevButton button').html('<').appendTo($contentWrapper).attr({
      'aria-label': 'Back button'
    });
    this.$nextButton = $('<button/>').data('type', 'next').addClass('nextButton button').html('>').appendTo($contentWrapper).attr({
      'aria-label': 'Next button'
    });

    this.$playLayer = $('<div/>').addClass('playLayer').appendTo(this.$bookWrapper);
    this.$playButton = $('<div/>').addClass('playButton').appendTo(this.$playLayer);

    this.$preloadLayer = $('<div/>').addClass('preloadLayer').appendTo(this.$bookWrapper);
  }

  bindEvents() {
    $('.button').off('click').on('click', this.handleButtonEvent);
    // this.$currentPage[0].onload = this.onContentLoaded;
    // this.$nextPage[0].onload = this.onContentLoaded;
    window.onContentLoaded = this.onContentLoaded;
    $(window).resize(this.onViewChange);
    this.$playButton.off('click').on('click', this.handlePlayEvent);
    this.audioCls.addEventListener('update', this.onAudioUpdate)
  }

  setPageCountToLoad() {
    const {
      step,
      nextPage
    } = this.modelCls;
    this.pageToLoad = nextPage !== -1 ? step : 1;
    this.pageloaded = 0;
  }

  updateView() {
    const {
      currentPage,
      nextPage,
      pageData,
      totalPages,
      step,
      orientaion
    } = this.modelCls;
    this.$preloadLayer.show();
    this.assetsLoaded = false;
    this.contentLoaded = false;
    this.setPageCountToLoad();
    this.contentAssetsLoad();
    $('.button').removeAttr('disabled');
    // this.$currentPage.empty();
    // this.$currentPage.load(`${this.modelCls.configPath}${pageData[currentPage].path}`);
    // $.getJSON(`${this.modelCls.configPath}${pageData[currentPage].data}`, (data) => {
    //   // this.appendText(this.$currentPage, data);
    // });
    this.$currentPage.attr({
      'src': `${this.modelCls.configPath}${pageData[currentPage].path}?lang=${this.modelCls.language}&side=left`
    });
    if (orientaion === 'portrait' || nextPage === -1) {
      this.$nextPage.hide();
    } else {
      this.$nextPage.show();
      // this.$nextPage.empty();
      // this.$nextPage.load(`${this.modelCls.configPath}${pageData[nextPage].path}`);
      // $.getJSON(`${this.modelCls.configPath}${pageData[currentPage].data}`, (data) => {
      //   // this.appendText(this.$nextPage, data);
      // });
      this.$nextPage.attr({
        'src': `${this.modelCls.configPath}${pageData[nextPage].path}?lang=${this.modelCls.language}&side=right`
      });
    }

    if (currentPage <= 0) {
      this.$prevButton.attr('disabled', true);
    }

    if (currentPage >= (totalPages - step)) {
      this.$nextButton.attr('disabled', true);
    }
  }

  appendText($target, data) {}

  handleButtonEvent(e) {
    this.emit('buttonPressed', {
      type: $(e.target).data('type')
    });
  }

  onContentLoaded(e) {
    this.$currentPage[0].focus();
    this.$nextPage[0].focus();
    if (++this.pageloaded === this.pageToLoad) {
      // this.calculateActualPageWidth();
      this.contentLoaded = true;
      this.checkContentAssetsLoaded();
    }
  }

  contentAssetsLoad() {
    const {
      currentPage,
      nextPage,
      pageData
    } = this.modelCls;
    var _arr = [...pageData[currentPage].images, ...pageData[nextPage].images];
    this.imagesToLoad = _arr.length;
    this.imagesLoaded = 0;
    for (var i = 0; i < _arr.length; i++) {
      var _img = new Image();
      _img.onload = this.assetLoaded;
      _img.src = `${this.modelCls.configPath}pages/images/${_arr[i]}`;
    }
  }

  assetLoaded() {
    this.imagesLoaded++;
    if (this.imagesLoaded >= this.imagesToLoad) {
      this.assetsLoaded = true;
      this.checkContentAssetsLoaded();
    }
  }

  checkContentAssetsLoaded() {
    if (this.assetsLoaded && this.contentLoaded) {
      this.onViewChange();
      this.emit('bookContentLoaded');
      this.$preloadLayer.hide();
    }
  }

  calculateActualPageWidth() {
    const {
      pageData,
      currentPage
    } = this.modelCls;
    const pageNo = pageData[currentPage].path.match(/\d+/g)[0];
    const $contentDiv = this.$currentPage.contents().find(`#p${pageNo}`);
    this.pageAcutalBounds = {
      width: $contentDiv.width(),
      height: $contentDiv.height()
    }
  }

  onViewChange() {
    const {
      orientaion
    } = this.modelCls;
    const pageAcutalWidth = this.pageBounds.width;
    const pageAcutalHeight = this.pageBounds.height;
    const wrapperWidth = orientaion === 'portrait' ? this.pageBounds.width : this.pageBounds.width * 2;

    var _shellWidth = wrapperWidth;
    var _shellHeight = pageAcutalHeight;
    var _newShellHeight;
    var _newShellWidth;
    var _actWid = $(this.$shellWrapper).width();
    var _actHgt = $(this.$shellWrapper).height();
    if (_actWid <= 10 || _actHgt <= 10) {
      setTimeout(() => {
        this.onViewChange();
      }, 10);
      return false;
    }

    var _scale = 1;
    var _nscale = 1;
    if (_actHgt < _actWid) {
      _newShellHeight = _actHgt;
      _scale = Number(_shellHeight / _newShellHeight); // .toFixed(2);
      _newShellWidth = (_shellWidth / _shellHeight) * _newShellHeight;
      var _aleft = (_actWid / 2) - (Number(_newShellWidth) / 2);
      if (_aleft < 0) {
        _newShellWidth = _actWid;
        _scale = Number(_shellWidth / _newShellWidth); // .toFixed(2);
        _newShellHeight = (_shellHeight / _shellWidth) * _newShellWidth;
      }
      _nscale = 1 / _scale;
      // if (_nscale < 0.6) {
      //   _nscale = 0.6;
      // }
    } else {
      _newShellWidth = _actWid;
      _scale = Number(_shellWidth / _newShellWidth); // .toFixed(2);
      _newShellHeight = (_shellHeight / _shellWidth) * _newShellWidth;
      _nscale = 1 / _scale;
      // if (_nscale < 0.6) {
      //   _nscale = 0.6;
      // }
    }
    this.shellWidth = _actWid;
    this.shellHeight = _actHgt;
    // this.$shellWrapper.css({
    //   width: _newShellWidth,
    //   height: _newShellHeight
    // });
    this.$bookWrapper.css({
      left: Math.round(($(this.$shellWrapper).width() / 2) - (Number(_newShellWidth) / 2)),
      top: Math.round(($(this.$shellWrapper).height() / 2) - (Number(_newShellHeight) / 2)),
      width: wrapperWidth,
      height: pageAcutalHeight,
      '-webkit-transform': `scale(${_nscale})`,
      '-ms-transform': `scale(${_nscale})`,
      transform: `scale(${_nscale})`,
    });

    this.$bookWrapper.find('.bookPage').css({
      width: pageAcutalWidth,
      height: pageAcutalHeight
    });

    // this.$bookWrapper.find('.bookPage > iframe').css({
    //   width: pageAcutalWidth,
    //   height: pageAcutalHeight,
    //   '-webkit-transform': `scale(${scalePageTo})`,
    //   '-ms-transform': `scale(${scalePageTo})`,
    //   transform: `scale(${scalePageTo})`,
    // });
  }

  checkShellResize() {
    var _actWid = $(this.$shellWrapper).width();
    var _actHgt = $(this.$shellWrapper).height();
    if (this.shellWidth !== _actWid || this.shellHeight !== _actHgt) {
      this.onViewChange();
    }
  }

  handlePlayEvent(_event) {
    this.$playLayer.hide();
    this.audioCls.initAudio();
  }

  onAudioUpdate() {
    // console.log(this.audioCls.currentTime);
    if (this.modelCls.currentSide === 'left') {
      if (this.$currentPage[0].contentWindow.onAudioUpdate) {
        this.$currentPage[0].contentWindow.onAudioUpdate(this.audioCls.currentTime);
      }
    } else {
      if (this.$nextPage[0].contentWindow.onAudioUpdate) {
        this.$nextPage[0].contentWindow.onAudioUpdate(this.audioCls.currentTime);
      }
    }
  }

  deselectAll() {
    if (this.$currentPage[0].contentWindow.deselectAll) {
      this.$currentPage[0].contentWindow.deselectAll();
    }
    if (this.$nextPage[0].contentWindow.deselectAll) {
      this.$nextPage[0].contentWindow.deselectAll();
    }
  }
}
