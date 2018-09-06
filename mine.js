$( document ).ready(function() {
    //document.getElementById("block2").style.visibility = "hidden";
    $(".block2").hide();
    $(".button2").hide();
   $("body").on("change", "select", function(){obj.validate(form_start.select_start.options[form_start.select_start.selectedIndex].value)});
   $("body").on("click",".button1", function(){obj.translate()});
   $("body").on("click",".button2", function(){obj.hide()});
   $( ".button5" ).on( "click", function(){obj1.login($(".field1").val(), $(".field2").val())});
   $(".button5").mouseover(function(){obj1.insert_image()});
   $(".button5").mouseout(function(){obj1.empty_div()});
 
    
});
   //$("body").on("click",".button5", function(){obj1.login(text1.value)});


 
      var obj={ 
          validate:function(value){
  
      var pc = document.getElementById("block1");
      pc.innerHTML= "<img src='img/"+value+".jpg '>";
    
     
    
          }, 
          translate:function(){
            $(".block2").show();
            $(".button2").show();


          },
          hide:function(){
            $(".block2").hide();
            $(".button2").hide();



          },
      }
      
      var obj1={
          
          login:function(login,pass){
              if (login=="" && pass=="") {
                span_error.innerHTML="You did not enter anything!";
                span_error.style.color="red";
                 
             } else if (pass==""){
                span_error.innerHTML="You did not enter password!";
                span_error.style.color="red";
            }
             else if(login==""){
                span_error.innerHTML="You did not enter login!";
                span_error.style.color="red";
              }
             else if (login=="Otec_dikogo_kodera" && pass=="49ne50"){
                location.href="osnowa.html"; return false;
             } else {
                span_error.innerHTML="Incorrect login or email!";
                span_error.style.color="red";

             }
              


          },
          insert_image:function(){
              
            //var pm = document.getElementById("block3");
            //pm.innerHTML= "<img src='img/macdakfan.jpg '>";
            $(".block3").append("<img src='img/macdakfan.jpg'/>")

          },
          empty_div:function(){
            $(".block3 img:last-child").remove()


          },

      }
    
 


