/*$(document).ready(function(){
$("#set_btn").on("click" , set_cook);
$("#get_btn").on ("click", alert_cook);

});

function set_cook(){
if(document.cookie==""){
  alert("netu kuki");
};
document.cookie = "username=John Doe; expires=Thu, 18 Dec 2019 12:00:00 UTC"  // записать на онсабмит или на done в аяксе что бы пользователю дало куки и при онсабмит запросить их повторно.



};
function alert_cook(){
    document.cookie= "username=John Doe; expires=Thu, 01 Jan 1970 00:00:01 GMT"
};  */

var cvs = document.getElementById("canvas")
var context = cvs.getContext("2d")
var ura = new Image();
var bg = new Image();
var fg = new Image();
var kosoj_up = new Image();
var kosoj_bot = new Image();
var shishlo = new Image();
var ura_high = new Image();
ura.src = "images/ura.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
kosoj_up.src = "images/kosojUP.png";
kosoj_bot.src = "images/kosojBOT.png";
shishlo.src = "images/shish.png";
ura_high.src = "images/ura2.png";
var fly = new Audio();
var score_aud = new Audio();
//var score1_aud = new Audio();
fly.src = "audio/fly.mp3";
score_aud.src = "audio/score.mp3";
//score1_aud.src = "audio/score1.mp3";
var gap = 150;
//var result = document.getElementById("result");
var count = 0;
var counter_time = 0;
var AnimSpeed = 1;
//Позиция юры
// при нажатии на кнопку
//var x = document.getElementsByTagName("BODY")[0];
//x.onclick = moveUp();
document.addEventListener('DOMContentLoaded', function(){
document.addEventListener("keydown", moveUp);
//document.onclick =
document.addEventListener("touchend", moveUp);
});
function moveUp(){
yPoz -= 35;
fly.play();
};

//блоки создание
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
var graviton = 1.5;

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
var id = setInterval("time_count()",1000);

function time_count(){
counter_time++
if(counter_time ==30){
  AnimSpeed++
};

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
/*} else {
shyshki[i].x = shyshki[i].x - 2;
kosyaki[i].x = kosyaki[i].x - 2;
};  */

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
if(xPoz + ura.width - 5>= kosyaki[i].x + 5 && xPoz <= kosyaki[i].x + kosoj_up.width - 5 && (yPoz<= kosyaki[i].y +kosoj_up.height||yPoz + ura.height - 5>=kosyaki[i].y + kosoj_up.height + gap) || yPoz<=-5 || yPoz + ura.height >= canvas.height - fg.height + 10){
//location.reload();
history.go(0)   // перезагружает всю страницу ваще
}
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
