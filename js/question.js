require(['jquery', 'b', 'barrager'], function($, b, barrager) {

    // 获取用户登录信息
    $.ajax({
        url: "/user/getUserInfo.do",
        dataType: "json",
        type: "GET",
        success: function(data) {
            if (data.LoginTimeOut) {
                // 用户未登录
                // window.location.href = 'index.html';
            } else {
                window.userInfo = data.userInfo;
            }
        },
        error: function(data) {
            // window.location.href = 'index.html';
            console.log('获取用户登录信息error!');
        }

    });

    window.questionIndex = 0;

    getQuestion();

    $('.mask').click(function() {
        $(this).fadeOut();
        $('.answer-wrap').fadeOut();
    });

    $('.answer-btn').click(function() {
        $('.answer-wrap, .mask').fadeIn();
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
    });

    $('#answerInput').keypress(function(event) {
        if (event.keyCode == 13) {
            $(this).next().click();
            $(this).blur();
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
                    $('.question-wrap').css('background-image', 'url(' + window.questionList[window.questionIndex].imgUrl + ')')
                    getBarrage();
                    var $img,
                        $body = $('body');
                    for (var i = 0; i < window.questionList.length; i++) {
                        $img = $('<img src="' + window.questionList[i].imgUrl + '" class="hide" />');
                        $body.append($img);
                    }
                } else if (data.code == -1) {
                    window.location.href = 'index.html';
                } else if (data.code == -2) {
                    window.questionList = [];
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取题目error!');
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
                        url: '//' + data.answerUrl,
                        type: "GET",
                        success: function(data) {

                            if (data.body.answerRecordList) {
                                window.barragerIndex = 0;
                                window.barragerList = data.body.answerRecordList;
                                clearTimeout(window.showBarrageClock);
                                showBarrage();
                            }

                        },
                        error: function(data) {
                            console.log('弹幕活动-获取答题信息error!');
                        }

                    });
                } else if (data.code == -1) {
                    window.barragerList = [];
                } else if (data.code == -2) {
                    window.location.href = 'index.html';
                } else {
                    window.barragerIndex = 0;
                    window.barragerList = [];
                    clearTimeout(window.showBarrageClock);
                    window.barragerList = [];
                }

            },
            error: function(data) {
                console.log('弹幕活动-获取答题信息error!');
                console.log(data);
            }

        });

    }

    var winHeight = document.documentElement.clientHeight,
        speedIndex = 0;
        speedList = [
            'slow-speed',
            'mid-speed',
            'high-speed'
        ];

    function showBarrage() {

        var indexBarrage = window.barragerList[window.barragerIndex];
        var barrager = {
            img: indexBarrage.imgUrl, //图片 
            info: indexBarrage.answerContent, //文字 
            close: false, //显示关闭按钮 
            href:'javascript:void(0);', //链接 
            color: '#000', //颜色,默认白色 
            old_ie_color: '#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
            bottom: parseInt(80 + (winHeight - 180) * Math.random()),
            speedClass: speedList[speedIndex]
        }
        speedIndex++;
        if(speedIndex > 2) {
            speedIndex = 0;
        }

        $('body').barrager(barrager);

        window.showBarrageClock = setTimeout(function() {
            if (window.barragerIndex + 1 < window.barragerList.length) {
                window.barragerIndex++;
                showBarrage();
            } else {
                clearTimeout(window.showBarrageClock);
                getBarrage();
            }
        }, 1100);

    }

    function hideBarrage() {

        var $barrage = $('.barrage');

        $barrage.each(function() {
            var $this = $(this);
            $this.stop();
            $this.animate({
                opacity : 0
            }, 800, function() {
                $this.remove();
            });
        });

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
                        href:'javascript:void(0);', //链接 
                        bottom: winHeight - 60, //距离底部高度,单位px,默认随机
                        color: '#07AFEC', //颜色,默认白色 
                        old_ie_color: '#07AFEC', //ie低版兼容色,不能与网页背景相同,默认黑色 
                        speedClass: 'mid-speed'
                    };
                    $('body').barrager(answerBarrage);
                    $('.answer-wrap, .mask').fadeOut();
                    $('#answerInput').val('');
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
                if ((event.changedTouches[0].clientX - window.touchX) < -15) {
                    hideBarrage();
                    window.questionIndex++;
                    if (window.questionIndex < window.questionList.length) {
                        // console.log('下一张');
                        $('.question-wrap').css('background-image', 'url(' + window.questionList[window.questionIndex].imgUrl + ')');
                        $('.answer-wrap').val('').fadeOut().next().removeClass('active');
                        clearTimeout(window.showBarrageClock);
                        getBarrage();
                    } else {
                        window.location.href = 'share.html';
                    }
                } else if ((event.changedTouches[0].clientX - window.touchX) > 15) {
                    hideBarrage();
                    window.questionIndex--;
                    if (window.questionIndex >= 0) {
                        $('.question-wrap').css('background-image', 'url(' + window.questionList[window.questionIndex].imgUrl + ')');
                        $('.answer-wrap').val('').fadeOut().next().removeClass('active');
                        clearTimeout(window.showBarrageClock);
                        getBarrage();
                    } else {
                        window.location.href = 'index.html';
                    }
                    // console.log('上一张');
                }
                break;
            case "touchmove":
                event.preventDefault();
                break;
        }
    }

    setFontSize();
    $('body').css('min-height', winHeight + 'px');

    $(window).resize(setFontSize);

    function setFontSize() {
        document.getElementsByTagName('html')[0].style.fontSize = (window.innerWidth / 375) * 100 + 'px';
    }


});
