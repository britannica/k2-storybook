function pageAudioSync(_time) {
    if (_time > 0.293937 && _time < 7.357192) {
        var element = document.getElementById('birdanim');
        element.classList.add('birdanim');
    }
    if (_time > 7.357192) {
        var element = document.getElementById('birdanim');
        element.classList.remove('birdanim');
    }
}
