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
            $.post(getAPIURL() + "site/signup",{username:phonenum.val(), password:password.val()}, function (res) {
                console.log(res)
                if (data.rtn == -1) {
                    $("#modal").hide();
                    layer.open({
                        content: data.Message,
                        btn: '确定'
                    });
                }
                if (data.rtn == 1) {
                    $("#modal").hide();
                    layer.open({
                        content: '注册成功',
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    $("#modal").show();
                    $.ajax({
                        type: "POST",
                        url: getAPIURL() + "Account/Login",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                            username: phonenum.val(),
                            password: password.val()
                        }),
                        success: function (data) {
                            $("#modal").hide();
                            localStorage.setItem("token", data.token);
                            $(".user").text("恭喜" + phonenum.val() + "注册成功!");
                            $(".register_part2").hide();
                            $(".login_btn").hide();
                            $(".register_part3").show();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            $("#modal").hide();
                            if (XMLHttpRequest.status == 400) {
                                var obj = JSON.parse(XMLHttpRequest.responseText);
                                layer.open({
                                    content: obj.Message,
                                    btn: '确定'
                                });
                            }
                        }
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