var cnv, ctx;
var imgArr = ['water_drop0001.png',
  'water_drop0002.png',
  'water_drop0003.png',
  'water_drop0004.png',
  'water_drop0005.png',
  'water_drop0006.png',
  'water_drop0007.png',
  'water_drop0008.png',
  'water_drop0009.png',
  'water_drop0010.png',
  'water_drop0011.png',
  'water_drop0012.png',
  'water_drop0013.png',
  'water_drop0014.png',
  'water_drop0015.png',
  'water_drop0016.png',
  'water_drop0017.png',
  'water_drop0018.png',
  'water_drop0019.png',
  'water_drop0020.png',
  'water_drop0021.png',
  'water_drop0022.png',
  'water_drop0023.png',
  'water_drop0024.png',
  'water_drop0025.png',
  'water_drop0026.png',
  'water_drop0027.png',
  'water_drop0028.png',
  'water_drop0029.png',
  'water_drop0030.png',
  'water_drop0031.png',
  'water_drop0032.png',
  'water_drop0033.png'
];
var animArr = [];
var cnt = 0;
var loaded = false;
var curIn = 0;
var started = false;
// -----------------------------------
function pageAudioSync(_time) {
  if (_time > 6.340110) {
    // var element = document.getElementById('birdanim');
    // element.classList.add('birdanim');
    if (!started) {
      started = true;
      globalAnimObj.start({
        id: 'anim',
        frame: draw,
        fps: 24
      });
    }
  }
}
// -----------------------------------
function pageSubLoad(e) {
  cnv = document.getElementById('cnv');
  ctx = cnv.getContext('2d');
}
// -----------------------------------
for (var i = 0; i < imgArr.length; i++) {
  var _img = new Image();
  _img.onload = onloaded;
  _img.src = 'images/page_04/rain/' + imgArr[i];
  animArr.push(_img);
}
// -----------------------------------
function onloaded() {
  cnt++;
  if (cnt >= imgArr.length) {
    loaded = true;
  }
}
// -----------------------------------
function draw() {
  if (loaded) {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.drawImage(animArr[curIn], 0, 0);
    curIn++;
    if (curIn >= animArr.length) {
      curIn = 0;
    }
  }
}
