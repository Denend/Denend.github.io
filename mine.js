$( document ).ready(function() {
    document.getElementById("block2").style.visibility = "hidden";
    $(".button2").hide();
   $("body").on("change", "select", function(){obj.validate(form_start.select_start.options[form_start.select_start.selectedIndex].value)});
   $("body").on("click",".button1", function(){obj.translate()});
   $("body").on("click",".button2", function(){obj.hide()});

});
 // var x;
      // x = form_start.select_start.options[form_start.select_start.selectedIndex].value;
      var obj={ 
          validate:function(value){
              //alert(value);
      //$("#block1").css("background-color","yellow");
      //$(".block1").attr("src", "img1/wish_1.jpg")   ;  
      var pc = document.getElementById("block1");
      pc.innerHTML= "<img src='img/"+value+".jpg '>";
      //$("div img").attr( width="200" height="200"
      //style="left: -100px;" )
      //не забыть return false; в баттон
     
    
          }, 
          translate:function(){
            document.getElementById("block2").style.visibility = "visible"; 
            $(".button2").show();


          },
          hide:function(){
            document.getElementById("block2").style.visibility = "hidden"; 
            $(".button2").hide();



          },
      }
    
 


