class Model extends EventEmitter3 {
  constructor() {
    super();
    this._currentSide = '';
    this._currentpage = -1;
    this._totalPages = -1;
    this._pageData = null;
    this._orientaion = 'landscape';
    this._configPath = '../';
    this._inPlayer = false;
    this._language = 'en-US';
  }

  set currentSide(_str) {
    this._currentSide = _str;
  }

  get currentSide() {
    return this._currentSide;
  }

  set configPath(data) {
    this._configPath = data;
  }

  get configPath() {
    return this._configPath;
  }

  set inPlayer(data) {
    this._inPlayer = data;
  }

  get inPlayer() {
    return this._inPlayer;
  }

  set pageData(data) {
    this._pageData = data;
  }

  get pageData() {
    return this._pageData;
  }

  set currentPage(value) {
    this._currentpage = value;
    this.emit('modelUpdated');
  }

  get currentPage() {
    return this._currentpage;
  }

  get nextPage() {
    let nextPage = this.currentPage + 1;
    if (nextPage > (this.totalPages - 1)) {
      nextPage = -1;
    }
    return nextPage;
  }


  set totalPages(value) {
    this._totalPages = value;
  }

  get totalPages() {
    return this._totalPages;
  }

  set orientaion(orientaion) {
    this._orientaion = orientaion;
    this.emit('modelUpdated');
  }

  get step() {
    return this._orientaion === 'portrait' ? 1 : 2;
  }

  get orientaion() {
    return this._orientaion;
  }

  set language(value) {
    this._language = value;
  }

  get language() {
    return this._language;
  }
}
