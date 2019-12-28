(function () {
    var user = $("#user");
    var pwd = $("#pwd");

    function loginverify() {
        loading.open();
        if (user.val() == "" || user.val().replace(/\s/g, "") == "") {
            loading.close();
            layer.open({
                content: "请输入用户名",
                btn: '确定'
            });
            return;
        }
        if (pwd.val() == "") {
            loading.close();
            layer.open({
                content: "请输入密码",
                btn: '确定'
            });
            return;
        }
        $.post(getAPIURL() + 'user/login', {username: user.val(), password: pwd.val()}, function (res) {
            loading.close();
            if (res.code) {
                $("#modal").hide();
                layer.open({
                    content: res.msg,
                    skin: 'msg',
                    time: 3 //3秒后自动关闭
                });
            }
            else
            {
                localStorage.setItem('access_token', res.data.access_token);
                document.cookie="login_status=1";
                layer.open({
                    content: '登录成功，正在跳转...'
                    ,skin: 'msg'
                    ,time: 1 //2秒后自动关闭
                    ,end:function(){
                        window.location.href = "index.html";
                    }
                });
            }

        });

    }

    $(".login_btn").click(function () {
        loginverify();
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