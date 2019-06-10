function pageAudioSync(_time) {
    if (_time > 6.529975 && _time < 10.240510) {
        var element = document.getElementById('birdanim');
        element.classList.add('birdanim');
    }
    if (_time > 10.240510) {
        var element = document.getElementById('birdanim');
        element.classList.remove('birdanim');
    }
}
