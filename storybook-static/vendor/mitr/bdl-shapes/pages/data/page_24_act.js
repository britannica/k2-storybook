function pageAudioSync(_time) {
    var element = document.getElementById('pizza');
    element.classList.remove('pizza');
    if (_time < 6.172490) {
        element.classList.add('pizza');
    }
}