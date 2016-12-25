$(function() {
    var pointer = "";
    getPoints();
    
    $("body").on("click", ".change-btn", function() {
       $(".front").toggleClass("back");
       change_image();
    });
    
    $("body").on("click", ".mark-image", function (e) {
        $(".tooltip-div").hide();
        $(".mark-text").val('');
        $(".mark-text").removeClass("error");
        var pos = $(".image-body").offset(),
        top     = $(this).offset().top,
        left    = pos.left;
        
        var x, y, width = $(".image-body").width(), height = $(this).height();
        
        
        x = ((e.clientX - left) / width).toFixed(2),
        y = (((e.clientY + $(window).scrollTop()) - top) / height).toFixed(2);
        
        display.detail_out();
        $(".tooltip-div").css({
            left: (x * 100) + '%',
            top: (y * 100) + '%'
        }).fadeIn('slow');
    }); 
    
    $("body").on("click", ".close-image", function() {
        $(".tooltip-div").fadeOut();
    });
    
    $("body").on("click", ".save-point", function() {
       $.ajax({
          method  : 'GET',
          url     : '/save',
          data    : 'markText='+encodeURI($(".mark-text").val())+
                  "&leftPos="+$(".tooltip-div").css("left")+
                  "&topPos="+$(".tooltip-div").css("top")+
                  "&face="+$(".mark-image").attr('facing'),
          
          success: function(result) {
              if(!result){$(".mark-text").addClass("error");}
              else {display.out(); getPoints();}
          },
          error  : function(result) {
              console.log(result);
          }
       }); 
    });
    
    $("body").on("click", ".mark-points" ,function() {
       $(".result-tooltip").hide();
       display.out();
       pointer = $(this).attr("point-id");
       $.ajax({
          method  : 'GET',
          url     : '/getPoint',
          data    : 'pointId='+pointer,
          
          success: function(result) {
              $(".result-tooltip .text").html(result.mark_text);
              $(".result-tooltip").css({
                  left : result.left_pos,
                  top  : result.top_pos,
              }).fadeIn('slow');
              
              $(".result-tooltip .time span").html(moment(result.created_at).format("D-M-Y | hh:mm A"));
          },
          error  : function(result) {
              console.log(result);
          }
       }); 
    });
    
    $("body").on("click", ".remove-text", function () {
        var output = confirm("Do you want to delete this ?");
        if (output) {
            $.ajax({
                method: 'GET',
                url: '/remove',
                data: 'pointId=' + pointer,
                success: function (result) {
                    display.detail_out();
                    getPoints();
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    });
    
    $("body").on("click", ".close-icon", function() {
        $(this).parent("div").fadeOut('slow');
    })
});

function change_image() {
    display.out();
    display.detail_out();
    if($(".front").hasClass("back")) {
        $(".front").attr("src", "images/back.png");
        $(".front").attr("facing", "back");
        $(".change-btn").addClass("glyphicon-triangle-left");
        $(".change-btn").removeClass("glyphicon-triangle-right");
    } else {
        $(".front").attr("src", "images/front.png");
        $(".front").attr("facing", "front");
        $(".change-btn").addClass("glyphicon-triangle-right");
        $(".change-btn").removeClass("glyphicon-triangle-left");
    }
    getPoints();
}

function getPoints() {
    $(".pts-render").html('');
    $.ajax({
        method: 'GET',
        url: '/render',
        data: 'face=' + $(".mark-image").attr('facing'),
        success: function (result) {
          var pts = "";
          result.forEach(function(data) {
              var style = "top: "+data.top_pos+"; left: "+data.left_pos;
              pts = pts+"<div point-id='"+data._id+"' class='mark-points' style='"+style+"'></div>";
          });
          $(".pts-render").html(pts);
        },
        error: function (result) {
            console.log(result);
        }
    });
}

var display = {
    in : function() {
        $(".tooltip-div").fadeIn('slow');
    },
    out : function () {
        $(".tooltip-div").fadeOut('slow');
    },
    detail_in : function() {
        $(".result-tooltip").fadeIn('slow');
    },
    detail_out : function() {
        $(".result-tooltip").fadeOut('slow');
    }
    
}