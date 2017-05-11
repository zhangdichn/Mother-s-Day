require(['jquery'], function($) {

    function checkLogin() {
        // 获取用户登录信息
        $.ajax({
            url: "/user/getUserInfo.do",
            dataType: "json",
            type: "GET",
            success: function(data) {
                if (data.LoginTimeOut) {
                    // 用户未登录
                    window.location.href = 'index.html';
                } else {
                    window.userInfo = data.userInfo;
                }
            },
            error: function(data) {
                window.location.href = 'index.html';
                console.log('获取用户登录信息error!');
            }

        });

    }

    window.questionIndex = 0;

    getQuestion();

    var list = [{
            img: 'imgs/heisenberg.png', //图片 
            info: '弹幕文字信息', //文字 
            // href:'http://www.yaseng.org', //链接 
            close: true, //显示关闭按钮 
            speed: 6, //延迟,单位秒,默认8 
            // bottom:70, //距离底部高度,单位px,默认随机 
            color: '#fff', //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
        }, {
            img: 'imgs/heisenberg.png', //图片 
            info: '弹幕文字信息', //文字 
            // href:'http://www.yaseng.org', //链接 
            close: true, //显示关闭按钮 
            speed: 6, //延迟,单位秒,默认8 
            // bottom:70, //距离底部高度,单位px,默认随机 
            color: '#fff', //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
        }, {
            img: 'imgs/heisenberg.png', //图片 
            info: '弹幕文字信息', //文字 
            // href:'http://www.yaseng.org', //链接 
            close: true, //显示关闭按钮 
            speed: 6, //延迟,单位秒,默认8 
            // bottom:70, //距离底部高度,单位px,默认随机 
            color: '#fff', //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
        }, {
            img: 'imgs/heisenberg.png', //图片 
            info: '弹幕文字信息', //文字 
            // href:'http://www.yaseng.org', //链接 
            close: true, //显示关闭按钮 
            speed: 6, //延迟,单位秒,默认8 
            // bottom:70, //距离底部高度,单位px,默认随机 
            color: '#fff', //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
        }, {
            img: 'imgs/heisenberg.png', //图片 
            info: '弹幕文字信息', //文字 
            // href:'http://www.yaseng.org', //链接 
            close: true, //显示关闭按钮 
            speed: 6, //延迟,单位秒,默认8 
            // bottom:70, //距离底部高度,单位px,默认随机 
            color: '#fff', //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
        },

    ];

    $('.answer-btn').click(function() {
        $('.answer-wrap').fadeIn();
        $('#answerInput').focus();
    });

    $('.send-btn').click(function() {
        var answer = $(this).prev().val();
        if (answer.length > 0) {
            saveAnswer(answer);
        }
    });

    $('#answerInput').keyup(function(event) {
        var answer = $(this).val();
        if (answer.length > 0) {
            $(this).next().addClass('active');
        } else {
            $(this).next().removeClass('active');
        }
        if (event.keycode == 13) {
            $(this).next().click();
        }
    });

    $('#answerInput').keypress(function(event) {
        if (event.keyCode == 13) {
            $(this).next().click();
        }
    });

    // 弹幕活动-获取题目
    function getQuestion() {

        $.ajax({
            url: "/activity/listBarrageQuestion.do",
            type: "POST",
            dataType: "json",
            success: function(data) {

                if (data.questionList) {
                    window.questionList = data.questionList;
                    getBarrage();
                } else if (data.code == -1) {
                    window.location.href = 'index.html';
                } else if (data.code == -2) {
                    window.questionList = [];
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取题目error!');
                console.log(data);
            }

        });
    }

    // 弹幕活动-获取答题信息
    function getBarrage() {

        $.ajax({
            url: "/activity/getBarrageAnswerUrl.do",
            type: "POST",
            dataType: "json",
            data: {
                qid: window.questionList[window.questionIndex].id
            },
            success: function(data) {
                // 操作的错误码(-1参数错误;-2未登录;-3暂无用户答题记录)
                if (data.answerUrl) {

                    $.ajax({
                        url: data.answerUrl,
                        type: "POST",
                        dataType: "json",
                        success: function(data) {

                            if (data.answerRecordList) {
                                window.barragerIndex = 0;
                                window.barragerList = data.answerRecordList;
                                clearTimeout(window.showBarrageClock);
                                showBarrage();
                            }

                        },
                        error: function(data) {
                            console.log('弹幕活动-获取答题信息error!');
                            console.log(data);
                        }

                    });
                } else if (data.code == -1) {
                    window.barragerList = [];
                } else if (data.code == -2) {
                    window.location.href = 'index.html';
                } else {
                    window.barragerList = [];
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取答题信息error!');
                console.log(data);
            }

        });

    }

    var winHeight = document.documentElement.clientHeight - 130;

    function showBarrage() {

      var indexBarrage = window.barragerList[window.barragerIndex];
      var barrager = {
        img: indexBarrage.imgUrl, //图片 
        info: indexBarrage.answerContent, //文字 
        close: false, //显示关闭按钮 
        color: '#fff', //颜色,默认白色 
        old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
      }
      barrager.speed = 5 + 10 * Math.random();
      barrager.bottom = 80 + winHeight * Math.random();
      $('body').barrager(indexBarrage);

      if(window.barragerIndex < window.barragerList.length - 1) {
        window.barragerIndex++;
        window.showBarrageClock = setTimeout(function() {
          showBarrage()
        }, 1000);
      } else {
        getBarrage();
      }

    }

    function saveAnswer(answer) {

        $.ajax({
            url: "/activity/saveBarrageAnswer.do",
            type: "POST",
            dataType: "json",
            data: {
                qid: window.questionList[window.questionIndex].id,
                answer: answer
            },
            success: function(data) {

                var code = data.code;
                if (code == 1) {
                    var answerBarrage = {
                        img: window.userInfo.userHeadImgUrl, //图片 
                        info: answer, //文字 
                        close: false, //显示关闭按钮 
                        speed: 8, //延迟,单位秒,默认8 
                        bottom: 170, //距离底部高度,单位px,默认随机
                        color: '#07AFEC', //颜色,默认白色 
                        old_ie_color: '#07AFEC', //ie低版兼容色,不能与网页背景相同,默认黑色 
                    };
                } else if (data.code == -2) {
                    window.location.href = 'index.html';
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取题目error!');
                console.log(data);
            }

        });

    }

    document.addEventListener('touchstart', touch, false);
    document.addEventListener('touchmove', touch, false);
    document.addEventListener('touchend', touch, false);

    function touch(event) {
        var event = event || window.event;

        switch (event.type) {
            case "touchstart":
                window.touchX = event.touches[0].clientX;
                break;
            case "touchend":
                if ((event.changedTouches[0].clientX - window.touchX) > 30) {
                  if(window.questionIndex < window.questionList.length) {
                    console.log('下一张');
                    window.questionIndex++;
                    getQuestion();
                  } else {
                    window.location.href = 'share.html';
                  }
                } else if ((event.changedTouches[0].clientX - window.touchX) < -30) {
                    console.log('上一张');
                }
                break;
            case "touchmove":
                // event.preventDefault();
                // window.touchX = event.touches[0].clientX; 
                break;
        }
    }


});
