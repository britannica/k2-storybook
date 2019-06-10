var sideVar = 'left';
window.onload = function (e) {
  var _jsonObj = dataVar['en-US'];
  try {
    var _obj = JSON.parse('{"' + location.search.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    var _jsonObj = dataVar[_obj.lang];
    sideVar = _obj.side;
    ret = {
      dataVar: dataVar,
      audioData: audioData
    };
  } catch (e) {
    var _jsonObj = dataVar['en-US'];
  }
  var _txts = document.getElementsByClassName('textcls');
  for (var i = 0; i < _txts.length; i++) {
    _txts[i].innerHTML = _jsonObj[_txts[i].attributes['id'].value];
  }
  // ------------------------
  for (var i = 0; i < audioData.length; i++) {
    var _id = document.getElementById(audioData[i].id);
    if (_id) {
      _id.style.cursor = 'pointer';
      _id.setAttribute('start', audioData[i].start);
      _id.onclick = spanClicked;
    }
  }
  // ------------------------
  var preloadCls = document.getElementsByClassName('preloadCls')[0];
  if (preloadCls) {
    document.body.removeChild(preloadCls);
  }
  if (window.parent && window.parent.onContentLoaded) {
    window.parent.onContentLoaded();
  }
}

function spanClicked(e) {
  if (window.parent && window.parent.onSeekAudio) {
    var _num = parseFloat(this.getAttribute('start'));
    window.parent.onSeekAudio(_num, sideVar);
  }
}

function onAudioUpdate(_time) {
  deselectAll();
  for (var i = 0; i < audioData.length; i++) {
    if (_time >= audioData[i].start && _time <= audioData[i].end) {
      var _id = document.getElementById(audioData[i].id);
      if (_id) {
        _id.className = 'highlight';
        lastId = _id;
      }
    }
  }
  if (typeof (pageAudioSync) !== 'undefined') {
    pageAudioSync(_time);
  }
}

function deselectAll() {
  var _lastId = document.getElementsByClassName('highlight');
  for (var j = 0; j < _lastId.length; j++) {
    _lastId[j].className = '';
  }
}
