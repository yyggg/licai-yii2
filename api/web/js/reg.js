(function () {
    var password = $("#password");
    var phonenum = $("#phonenum");

    function reg(step) {
        //第二步
        var phone_arr = phonenum.val().split(" ");
        var password_arr = password.val().split(" ");
        var reg1 = /^(\+?86)?(1[34578]\d{9})$/;
        var reg2 = /^[\x00-\xff]{6,20}$/;
        //第三步
        if (step == 3) {
            //手机号做验证
            if (phonenum.val() == "") {
                layer.open({
                    content: "请输入手机号码",
                    btn: '确定'
                });
                return false;
            }
            if (phone_arr.length != 1) {
                layer.open({
                    content: "请输入手机号，不能含有空格！",
                    btn: '确定'
                });
                return false;
            }
            if (!reg1.test(phonenum.val())) {
                layer.open({
                    content: "手机号码格式输入有误！",
                    btn: '确定'
                });
                return false;
            }
            //密码验证
            if (password.val() == "") {
                layer.open({
                    content: "密码不能为空！",
                    btn: '确定'
                });
                return false;
            }
            if (password_arr.length != 1) {
                layer.open({
                    content: "密码不能含有空格！",
                    btn: '确定'
                });
                return false;
            }
            //0630修改注册手机号正则
            if (!reg2.test(password.val())) {
                layer.open({
                    content: "请输入6-20个字母或符号组合的密码！",
                    btn: '确定'
                });
                return false;
            }

            $("#modal").show();
            $.post(getAPIURL() + "user/signup",{username:phonenum.val(), password:password.val()}, function (res) {
                if (res.code)
                {
                    $("#modal").hide();
                    layer.open({
                        content: res.msg,
                        skin: 'msg',
                        time: 3 //2秒后自动关闭
                    });
                }
                else
                {
                    localStorage.setItem('access_token', res.data.access_token);
                    document.cookie="login_status=1";
                    $("#modal").hide();
                    layer.open({
                        content: '注册成功，正在登录...',
                        skin: 'msg',
                        time: 3 //2秒后自动关闭
                    });
                }
            });
        }
    }

//  注册按钮
    $("#register_btn").click(function () {
        reg(3);
    });
    //切换密码的可见状态
    $(".icon_eye").click(function () {
        var arr = this.src.split("/");
        if (arr[arr.length - 1] == "bkj.png") {
            this.src = "../img/kj.png";
            $(this).prev().attr("type", "text");
        } else {
            this.src = "../img/bkj.png";
            $(this).prev().attr("type", "password");
        }

    });
})();