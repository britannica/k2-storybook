function pageAudioSync(_time) {
    var element = document.getElementById('light');
    element.classList.remove('light');
    if (_time > 13.869166 && _time < 18.417747) {
        element.classList.add('light');
    }
    else if(_time > 18.417747){
        element.classList.add('staticlight');
    }
    var flagelem = document.getElementById('flag_anim');
    flagelem.classList.remove('flag_anim');
    if(_time > 8.013765 && _time < 13.131445 ){
        flagelem.classList.add('flag_anim');
    }
}
