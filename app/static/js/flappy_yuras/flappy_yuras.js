var cvs = document.getElementById("canvas")
var context = cvs.getContext("2d")
var ura = new Image();
var bg = new Image();
var fg = new Image();
var kosoj_up = new Image();
var kosoj_bot = new Image();
var shishlo = new Image();
var ura_high = new Image();
ura.src = "/static/js/flappy_yuras/images/ura.png";
bg.src = "/static/js/flappy_yuras/images/bg.png";
fg.src = "/static/js/flappy_yuras/images/fg.png";
kosoj_up.src = "/static/js/flappy_yuras/images/kosojUP.png";
kosoj_bot.src = "/static/js/flappy_yuras/images/kosojBOT.png";
shishlo.src = "/static/js/flappy_yuras/images/shish.png";
ura_high.src = "/static/js/flappy_yuras/images/ura2.png";
var fly = new Audio();
var score_aud = new Audio();
//var score1_aud = new Audio();
fly.src = "/static/js/flappy_yuras/audio/fly.wav";
score_aud.src = "/static/js/flappy_yuras/audio/score.mp3";
//score1_aud.src = "audio/score1.mp3";
var gap = 150;
var result = document.getElementById("result");
var count = 0;
var counter_t = 0;
var AnimSpeed = 0;
var check_click = 0;
//Позиция юры
// при нажатии на кнопку
document.addEventListener('DOMContentLoaded', function(){
document.addEventListener("keydown", moveUp);
document.addEventListener("touchend", moveUp);
button_run = document.getElementById("poigrat")
button_run.onclick = run_game;
});
function moveUp(){
  if(check_click == 0){
    return;
  };
yPoz -= 35;
fly.play();
};


var shyshki = [];
shyshki[0] = {
  x:canvas.width + 110,
  y: 150
}
var kosyaki = [];
kosyaki[0] = {
x: canvas.width,
y: 0
}
var xPoz = 10;
var yPoz = 150;
var graviton = 0;

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250); //250
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

  var f = function score_withdelay(){
    //var k = Math.floor(Math.random() * 2);
  //  if(k==0){
      score_aud.play();
      ura=ura_high;
    //} else

};
var run_interval = throttle(f, 100);

// пишем таймер
/*var id = setInterval("time_count()",1000);

function time_count(){
counter_time++
if(counter_time ==30){
  AnimSpeed++
};

};   */
function time_count(){
counter_t++
//alert("counter_time")
if(counter_t ==30){
  AnimSpeed++
};

};

function run_game(){
  AnimSpeed = 1;
  graviton = 1.5;
  check_click = 1;

  setInterval("time_count()",1000);
  button_run.disabled = true;


};

var funcAnimate = setInterval(function narisowat(){


context.drawImage(bg, 0, 0);
for(i=0;i<kosyaki.length;i++){
context.drawImage(kosoj_up, kosyaki[i].x , kosyaki[i].y );
// высота 272
context.drawImage(kosoj_bot, kosyaki[i].x, kosyaki[i].y + kosoj_up.height + gap);
// высота 378 и они неизменные просто указываются координаты а остаток обрезается канвасом
context.drawImage(shishlo, shyshki[i].x, shyshki[i].y);
//if(counter_time < 10){
shyshki[i].x = shyshki[i].x - AnimSpeed;
kosyaki[i].x = kosyaki[i].x - AnimSpeed;
if(AnimSpeed == 1 && kosyaki[i].x==80){
  kosyaki.push({
    x:canvas.width,
    y:Math.floor(Math.random()*kosoj_up.height) - kosoj_up.height
  })
  shyshki.push({
    x: canvas.width + 110,
    y: Math.floor(Math.random()*(canvas.width - 50))

  })
} else if (AnimSpeed == 2 && (kosyaki[i].x==81 || kosyaki[i].x==80)){
  kosyaki.push({
    x:canvas.width,
    y:Math.floor(Math.random()*kosoj_up.height) - kosoj_up.height
  })
  shyshki.push({
    x: canvas.width + 110,
    y: Math.floor(Math.random()*(canvas.width - 50))

  })

};

if(xPoz + ura.width >= shyshki[i].x && xPoz <= shyshki[i].x + shishlo.width && yPoz + ura.height/2 <=shyshki[i].y + shishlo.height && yPoz + ura.height/2 >= shyshki[i].y) {
  count += 1;
  //result.innerHTML = "Result = " + count;
 run_interval();
}
if (yPoz <= 0 && counter_t == 25  && count < 50){
  count = 1488;

};
if(xPoz + ura.width - 5>= kosyaki[i].x + 5 && xPoz <= kosyaki[i].x + kosoj_up.width - 5 && (yPoz<= kosyaki[i].y +kosoj_up.height||yPoz + ura.height - 5>=kosyaki[i].y + kosoj_up.height + gap) || yPoz<=-5 || yPoz + ura.height >= canvas.height - fg.height + 10){
//location.reload();
result.innerHTML = "Previous result = " + count;

if(count > 0) {
var obj_send2 = {
  count
}
var string_result = JSON.stringify(obj_send2);
alert(string_result);

$.ajax({
   data : string_result,
   contentType: "application/json; charset=utf-8",
   type : 'POST',
   dataType: "json",
      url : '/f_y_process'
 })
 .done(function(data) {
   //alert(data["1"]);
   //alert(JSON.stringify(data));
alert("Selman is a fucking bitch")
alert(JSON.stringify(data))
 });

counter_t = 0;
AnimSpeed = 1;
count = 0;
kosyaki[i].x = kosyaki[0].x;
shyshki[i].x = shyshki[0].x;
xPoz = 10;
yPoz = 150;
//history.go(0)   // перезагружает всю страницу ваще
} else {
  counter_t = 0;
  AnimSpeed = 1;
  count = 0;
  kosyaki[i].x = kosyaki[0].x;
  shyshki[i].x = shyshki[0].x;
  xPoz = 10;
  yPoz = 150;

};


};
};

context.drawImage(fg, 0 , cvs.height-fg.height);
// cvs 512,288   fg 118
context.drawImage(ura, xPoz , yPoz);
yPoz += graviton;
context.fillStyle = "#000";
context.font = "24px Verdana"
context.fillText("Cчет:" + count, 90,cvs.height - 50)
//requestAnimationFrame(narisowat);
}, 1000/60);

//shishlo.onload = funcAnimate;
