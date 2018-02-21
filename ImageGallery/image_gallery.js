//Get images from json file into their allocated div boxes

$(document).ready(function(){
    $('#sports_pics, #food_pics, #random_pics').hide();
    $.getJSON("main.json", function(pics){
        var imgList_sports = [];
        var imgList_food = [];
        var imgList_random = "";
        var imgList_ran = [];
        var slideshow_slides = "";
        var abs = [];

        $.each(pics.pictures, function(){
            var img = "";
            var img_slide = "";
            var typ = "";
            if (this.type==="sports") {
                img = $('<img class = "sports_pic" src= "'+this.imgPath+'" width= 33.3% height= 350 alt="'+this.name+'">');
                img_slide = $('<img id= "sports_slide" class = "slide" src= "'+this.imgPath+'" alt="'+this.name+'"width = 100% height = 200 display>');
                imgList_sports.push(img_slide);
                typ = this.type;
                $("#sports_check").change(function(){
                    if (this.checked){
                        $("#sports_pics").fadeIn("slow");
                        img.appendTo("#sports_pics");
                        $("#slideshow").append(img_slide);
                    }
                    else{
                        $("#sports_pics").fadeOut("1000, slow");
                        $("#slideshow").find(img_slide).remove();
                    };
                });
            };

            if(this.type==="food"){
                img = $('<img class = "food_pic" src="'+ this.imgPath +'" width= 33.3% height= 350 alt="'+this.name+'">');
                img_slide = $('<img id= "food_slide" class = "slide" src= "'+this.imgPath+'" alt="'+this.name+'"width = 100% height = 200>');
                imgList_food.push(img_slide);
                typ = this.type;
                $("#food_check").change(function(){
                    if (this.checked){
                        $("#food_pics").fadeIn("slow");
                        img.appendTo("#food_pics");
                        $("#slideshow").append(img_slide);
                    }
                    else{
                        $("#food_pics").fadeOut("slow");
                        $("#slideshow").find(img_slide).remove();
                    }
                })

            };

            if(this.type==="random"){
                img = $('<img class = "random_pic" src="'+ this.imgPath +'" width= 33.3% height= 350 alt="'+this.name+'">');
                img_slide = $('<img id= "random_slide" class = "slide" src= "'+this.imgPath+'" alt="'+this.name+'"width = 100% height = 200>');
                imgList_ran.push(img_slide);
                typ = this.type;
                $("#random_check").change(function(){
                    if (this.checked){
                        $("#random_pics").fadeIn("slow");
                        img.appendTo("#random_pics");
                        $("#slideshow").append(img_slide);
                    }
                    else{
                        $("#random_pics").fadeOut("slow");
                        $("#slideshow").find(img_slide).remove();
                    }
            })
            };

        if(this.type === "abstract"){
            console.log("ABSTRACT");
            img = $('<img class = "mySlides" src="'+ this.imgPath +'" width= 33.3% height= 350 alt="'+this.name+'">');

            abs.push(this.imgPath);
            console.log(abs);
            var myIndex = 0;
            carousel();

            function carousel(){
                console.log("abs.length", + abs.length);
                if(myIndex>=abs.length){myIndex = 0;}
                $("#background").css('height', '500px');
                $("#background").css('background-image', 'url("' +abs[myIndex++]+'")');
                $("#background").css('background-size', 'cover');
                $("#backround").css('animation', 'fading 4s infinite');
                $("#background").fadeIn(1, function(){
                    setTimeout(carousel,4000);
                });
            };
        /*function carousel() {
            var i;
            var x = document.getElementsByClassName("mySlides");
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";  
            }
        myIndex++;
        if (myIndex > x.length) {myIndex = 1}    
        x[myIndex-1].style.display = "block";  
        setTimeout(carousel, 2000); // Change image every 2 seconds
};*/
        
        /*$("#title").css('background', 'url("' + this.imgPath +'")');
        $("#title").css('border', '10px dotted black');
        $("#title").css('padding', '35px');
        $("#title").css('background-clip', 'padding-box');
        $("#title").css('background-size', '960px 480px');
        $("#title").css('background-repeat', 'no-repeat');
        $("#title").css('background-position', 'center');*/
        };

            var modal = $("#myModel");
            var modalImg = $("#img01");
            var captionTxt = $("#caption");

            $(img).click(function(){
                console.log(typ);
                $(modal).css("display","block");
                $(modalImg).attr("src", this.src);
                $(captionTxt).html(this.alt);
            });
            $(img_slide).click(function(){
                if (typ === "sports"){
                    $("#random_check").prop("checked", false);
                    $("#random_pics").fadeOut("slow");
                    $("#food_check").prop("checked", false);
                    $("#food_pics").fadeOut("slow");
                    for(var i = 0; i < imgList_ran.length; i++){
                        $("#slideshow").find(imgList_ran[i]).remove();
                    }
                    for(var i = 0; i < imgList_food.length; i++){
                        $("#slideshow").find(imgList_food[i]).remove();
                    }
                }
                if (typ === "food"){
                    $("#random_check").prop("checked", false);
                    $("#random_pics").fadeOut("slow");
                    $("#sports_check").prop("checked", false);
                    $("#sports_pics").fadeOut("slow");
                    for(var i = 0; i < imgList_sports.length; i++){
                        $("#slideshow").find(imgList_sports[i]).remove();
                    }
                    for(var i = 0; i < imgList_ran.length; i++){
                        $("#slideshow").find(imgList_ran[i]).remove();
                    }
                }
                if (typ === "random"){
                    $("#sports_check").prop("checked", false);
                    $("#sports_pics").fadeOut("slow");
                    $("#food_check").prop("checked", false);
                    $("#food_pics").fadeOut("slow");
                    for(var i = 0; i < imgList_sports.length; i++){
                        $("#slideshow").find(imgList_sports[i]).remove();
                    }
                    for(var i = 0; i < imgList_food.length; i++){
                        $("#slideshow").find(imgList_food[i]).remove();
                    }
                }
                console.log(img_slide.type);
                $(modal).css("display","block");
                $(modalImg).attr("src", this.src);
                $(captionTxt).html(this.alt);
            });

            var span = $(".close")[0];
            $(span).click(function(){
                $(modal).css("display","none");
            });
        
        });
        window.onload = showDivs(1);
    });
});




//Functions to create the slide show at the top of the screen and make the show controlable by users
var slide_dex = 1;
var auto = 1;

function plusDivs(n){
        showDivs(slide_dex += n);
};
function currentDiv(n){
    showDivs(slide_dex = n);
}
function showDivs(n){
  var pics = $(".slide");
  if (n>pics.length) {
    slide_dex = 1;
  }
  if (n<1) {
    slide_dex = pics.length;
  }
  for (var m = 0; m < pics.length; m++) {
    $(pics[m]).css("display","none");
  }
  $(pics[slide_dex-1]).css("display", "block");
};




