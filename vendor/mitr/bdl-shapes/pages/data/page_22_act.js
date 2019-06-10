function pageAudioSync(_time) {
    var element = document.getElementById('light');
    element.classList.remove('light');
    if (_time > 10.806684 && _time < 15.575169) {
        element.classList.add('light');
    }
}