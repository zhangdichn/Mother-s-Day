require(['jquery'], function($) {

  window.questionIndex = 0;

  var list = [
    {
       img:'imgs/heisenberg.png', //图片 
       info:'弹幕文字信息', //文字 
       // href:'http://www.yaseng.org', //链接 
       close:true, //显示关闭按钮 
       speed:6, //延迟,单位秒,默认8 
       // bottom:70, //距离底部高度,单位px,默认随机 
       color:'#fff', //颜色,默认白色 
       old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
     },
    {
       img:'imgs/heisenberg.png', //图片 
       info:'弹幕文字信息', //文字 
       // href:'http://www.yaseng.org', //链接 
       close:true, //显示关闭按钮 
       speed:6, //延迟,单位秒,默认8 
       // bottom:70, //距离底部高度,单位px,默认随机 
       color:'#fff', //颜色,默认白色 
       old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
     },
    {
       img:'imgs/heisenberg.png', //图片 
       info:'弹幕文字信息', //文字 
       // href:'http://www.yaseng.org', //链接 
       close:true, //显示关闭按钮 
       speed:6, //延迟,单位秒,默认8 
       // bottom:70, //距离底部高度,单位px,默认随机 
       color:'#fff', //颜色,默认白色 
       old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
     },
    {
       img:'imgs/heisenberg.png', //图片 
       info:'弹幕文字信息', //文字 
       // href:'http://www.yaseng.org', //链接 
       close:true, //显示关闭按钮 
       speed:6, //延迟,单位秒,默认8 
       // bottom:70, //距离底部高度,单位px,默认随机 
       color:'#fff', //颜色,默认白色 
       old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
     },
    {
       img:'imgs/heisenberg.png', //图片 
       info:'弹幕文字信息', //文字 
       // href:'http://www.yaseng.org', //链接 
       close:true, //显示关闭按钮 
       speed:6, //延迟,单位秒,默认8 
       // bottom:70, //距离底部高度,单位px,默认随机 
       color:'#fff', //颜色,默认白色 
       old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
     },

  ];

  var item={
     // img:'static/heisenberg.png', //图片 
     info:'弹幕文字信息', //文字 
     // href:'http://www.yaseng.org', //链接 
     close:true, //显示关闭按钮 
     speed:15, //延迟,单位秒,默认8 
     bottom:70, //距离底部高度,单位px,默认随机 
     color:'#fff', //颜色,默认白色 
     old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
   }

   var winHeight = document.documentElement.clientHeight - 130;

  var indexBarrage;
  for (var i = 0; i < list.length; i++) {
    indexBarrage = list[i];
    indexBarrage.speed = 5 + 10 * Math.random();
    indexBarrage.bottom = 80 + winHeight * Math.random();
    $('body').barrager(indexBarrage);
    console.log(indexBarrage);
  }

  $('.answer-btn').click(function() {
    $('.answer-wrap').fadeIn();
  });

  $('.send-btn').click(function() {
    var answer = $(this).prev().val();
    if(answer && answer.length > 0) {

    } else {

    }
  });

  document.addEventListener('touchstart',touch, false);  
  document.addEventListener('touchmove',touch, false);  
  document.addEventListener('touchend',touch, false);  
    
  function touch (event){
    var event = event || window.event;  

    switch(event.type){  
        case "touchstart":  
            window.touchX =  event.touches[0].clientX;  
            break;  
        case "touchend":  
            if((event.changedTouches[0].clientX - window.touchX) > 30) {
              console.log('下一张');
              window.questionIndex++;
              getQuestion();
            } else if((event.changedTouches[0].clientX - window.touchX) < -30) {
              console.log('上一张');
            }
            break;  
        case "touchmove":  
            // event.preventDefault();
            // window.touchX = event.touches[0].clientX; 
            break;  
    }
  }

  function getQuestion() {

      $.ajax({
          url: "/activity/listBarrageQuestion.do",
          type: "POST",
          dataType: "json",
          success: function(data) {

            if(data.questionList) {
              window.questionList = data.questionList;
            } else if(data.code == -1) {
              window.location.href = 'index.html';
            } else if(data.code == -2) {
              window.questionList = [];
            }

          },
          error: function(data) {
            console.log('弹幕活动-获取题目error!');
            console.log(data);
          }

      });
  }


});