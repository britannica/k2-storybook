function pageAudioSync(_time) {
    if (_time > 0 && _time < 14.705378) {
        var element = document.getElementById('light');
        element.classList.add('light');
    }
    if (_time >= 14.705378) {
        var element = document.getElementById('light');
        element.classList.remove('light');
    }
}
