document.addEventListener("DOMContentLoaded", function(event) {
$("body").on("click","span",obj_opros.click_positive);
$("body").on("click","i",obj_opros.click_negative);
$("body").on("click","#button_submit_opros",obj_opros.click_button_opros);
$("#mail").mouseout(function (){validation.msoutMail()});
$("#pass").mouseout(function(){validation.msoutPass()});
$("#pass1").mouseout(function(){validation.msoutPass1()});
cur_url2 = location.href.substring(location.href.lastIndexOf('/'))
if(cur_url2 == "/statistics"){
mySuperChart = document.getElementById("myGraph").getContext("2d");
$.ajax({
//  data : json_string,
  contentType: "application/json; charset=utf-8",
  type : 'GET',
  dataType: "json",
  url : '/_statistics_process'
})
.done(function(data) {

  var res1 = data['1'];
  var res2 = data['2'];
  var res3 = data['3'];
  var res4 = data['4'];
  var res5 = data['5'];
  var res6 = data['6'];
  var res7 = data['7'];
  var res8 = data['8'];
  var res9 = data['9'];




  Chart.defaults.global.defaultFontFamily = '"Comic Sans MS", cursive, sans-serif';
  Chart.defaults.global.defaultFontSize = 14;
  var barChart = new Chart(mySuperChart, {
    type: "pie",
    data: {
      labels: ['хату сo шлюхами бухлищем',  'Выше перечисленное без шлюх','едем в КЭТ','Баночка и К5',
              'Го в линас', "В экомаркет за пивасом и под падик(лакшери опшен)", 'Снимаем яхту плвать по Днепру',
              'Впизду яхту, снимаем катамараны в Голосеевском парке', 'Та ну вас нахуй, чаек и сериальчик'],
      datasets: [{
        label: "Количество позитивных ответов",

        data: [
          res1,
          res2,
          res3,
          res4,
          res5,
          res6,
          res7,
          res8,
          res9

        ],
        backgroundColor:[
      "rgba(0, 191, 255)" ,
      "yellow" ,
      "rgba(238, 130, 238)",
      "rgba(255, 69, 0)",
      "rgba(0, 128, 0)",
      "rgba(0, 0, 255)",
      "rgba(75, 0, 130)",
      "rgba(165, 42, 42)",
      "rgba(60, 179, 113)"






    ],

        borderWidth:1,
        borderColor:"#777",
        hoverBorderWidth:5,
        hoverBorderColor: "black"
      }]
    },
    options: {
      title:{
        text: "Ну шо результаты опросика",
        fontColor: "black",
        fontSize: 25,
        position: 'right'
      },
      legend:{

      position: 'right'
    }

    }

  });

});
};
//};
/*$(function () {
    cur_url = location.href.substring(location.href.lastIndexOf('/'));
  if(cur_url == "/login?next=%2Fopros" || cur_url == "/login?next=%2Fstatistics")
   {
   cur_url == cur_url.split('?')[0]; //  "/login"
   link == "/login"
 };
  $('.menu li').each(function () {
        link = $(this).find('a').attr('href');
        if (cur_url == link)
          {
              $(this).addClass('active');
          };
    });
    */
   $(function () {
      cur_url = location.href.substring(location.href.lastIndexOf('/'));
      if(cur_url == "/login?next=%2Fopros" || cur_url == "/login?next=%2Fstatistics")
         {
         cur_url = '/' + cur_url.split('F')[1];
         };
      $('.menu li').each(function () {
            link = $(this).find('a').attr('href');
            if (cur_url == link)
              {
                  $(this).addClass('active');
              };
      });
    });
});
var validation = {
  msoutMail:function(){
      var x = document.getElementById("mail");
      var forma1Div = document.getElementById("divEmail");
      if(x.value.length<=2) {
        forma1Div.classList.add("has-error");
        return false;
      }
      else {
        forma1Div.classList.remove("has-error");
      };
  },
    msoutPass:function(){
      var array = [document.getElementById("pass"),document.getElementById("divPass")];
      if(array[0].value.length<=4 ) {
        array[1].classList.add("has-error");
        return false;
      }
      else {
        array[1].classList.remove("has-error");
      };
    },
    msoutPass1:function(){
      var array1 = [document.getElementById("pass1"),document.getElementById("divPass1")]
      if(array1[0].value.length<=4 ) {
        array1[1].classList.add("has-error");
        return false;
      }
      else {
        array1[1].classList.remove("has-error");
      };
    },
}

var object_send = {};


var obj_opros={
  click_positive: function() {
    $(this).parents().eq(1).find("i").css("fontSize","30px");
    $(this).css("fontSize","40px");
    $(this).parents().eq(1).removeAttr("class");
    $(this).parents().eq(1).addClass("panel panel-default panel-success");
    },
  click_negative: function(){
    $(this).parents().eq(1).find("span").css("fontSize","30px");
    $(this).css("fontSize","40px");
    $(this).parents().eq(1).removeAttr("class");
    $(this).parents().eq(1).addClass("panel panel-default panel-danger");
  },



  //};
  click_button_opros: function(){


    for(i=1;i<10;i++){
              result: 0,
              class_of_div = [];
              class_of_div[i] =  $('#opros_div'+i).attr('class'),


              result = class_of_div[i].includes("panel-success"),
              array_final = [];
              array_final[i] = result;
              object_send[i] = {
                result,
              };

              if(class_of_div[i] == "panel panel-default panel-info"){
                $("#alert_error_opros").show()
                return false
              };
             };



            var json_string = JSON.stringify(object_send);
            //alert(json_string);
             $.ajax({
          			data : json_string,
                contentType: "application/json; charset=utf-8",
          			type : 'POST',
                dataType: "json",
                success: function(){window.location.href="/statistics"},
          			url : '/_opros_process'
          		})
          		.done(function(data) {
                //alert(data["1"]);
                //alert(JSON.stringify(data));
                obj_stat1 = data
              });


  },
};

function validateUserName() {
  var d = [document.getElementById("mail"),document.getElementById("pass"),document.getElementById("pass1")]
  if(validation.msoutMail() == false){
      $("#alert_error").html("Логин должен быть длиннее трех символов");
      $("#alert_error").show()
      return false;
  }
  else if(validation.msoutPass() == false) {
      $("#alert_error").html("Дядя ну слабоват пароль, надо минимум 5 символов");
      $("#alert_error").show()
      return false;
  }
  else if(d[1].value != d[2].value){
      $("#alert_error").html("ООй, не совпадают пароли");
      $("#alert_error").show()
      return false;
  }
  else if(validation.msoutPass() == false || validation.msoutPass1() == false) {
      $("#alert_error").html("Дядя ну слабоват пароль, надо минимум 4 символов");
      $("#alert_error").show()
      return false;
  }
};



  //cur_url2 = location.href.substring(location.href.lastIndexOf('/'));
//alert(cur_url2);
//if(cur_url2 == "/statistics"){
