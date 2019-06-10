function pageAudioSync(_time) {
  var element = document.getElementById('dice');
  if (element.classList.contains('dice')) {
    element.classList.remove('dice');
  }
  if (_time > 6.215615 && _time < 9.789192) {
    if (!element.classList.contains('dicelast')) {
      element.classList.add('dicelast');
    }
    element.classList.add('dice');
  }
}
