/**
 * Created by tim on 2016/6/20.
 */
function Safechange(hash) {
    var _self = this, _$txtOldPwd, _$txtNewPwd, _$txtReNewPwd;
    this.hash = hash;
    _next = function () {
        var allNumReg = /^\d+$/;
        var allLetReg = /^[A-Za-z]*$/;
        var txt = "";
        var type = "";
        /*_hash==1 修改登录密码  _hash==2 修改交易密码*/
        //先做验证
        if (hash == "1") {
            txt = "登录";
        }
        else if (hash == "2") {
            txt = "交易";
        }
        loading.open();
        if ($.trim(_$txtOldPwd.val()) == "" && hash == "1") {
            loading.close();
            layer.open({
                content: '请输入原' + txt + '密码',
                btn: '我知道了'
            });
            return false;
        }
        if ($.trim(_$txtNewPwd.val()) == "") {
            loading.close();
            layer.open({
                content: '请输入新的' + txt + '密码！'
                , btn: '我知道了'
            });
            return false;
        }
        else {
            var pwdStr = $.trim(_$txtNewPwd.val()).split(" ");
            if (pwdStr.length != 1) {
                loading.close();
                layer.open({
                    content: '密码长度在6-20个字符之间，不能有空格！'
                    , btn: '我知道了'
                });
                return false;
            }
            else {
                if ($.trim(_$txtNewPwd.val()).length < 6 || $.trim(_$txtNewPwd.val()).length > 20) {
                    loading.close();
                    layer.open({
                        content: '密码长度在6-20个字符之间，不能有空格！'
                        , btn: '我知道了'
                    });
                    return false;
                }
                else {
                    if (allNumReg.test($.trim(_$txtNewPwd.val()))) {
                        loading.close();
                        layer.open({
                            content: '密码不能全部为数字！'
                            , btn: '我知道了'
                        });
                        return false;
                    }
                    if (allLetReg.test($.trim(_$txtNewPwd.val()))) {
                        loading.close();
                        layer.open({
                            content: '密码不能全部为字母！'
                            , btn: '我知道了'
                        });
                        return false;
                    }
                }
            }
        }
        if ($.trim(_$txtReNewPwd.val()) != $.trim(_$txtNewPwd.val())) {
            loading.close();
            layer.open({
                content: '确认密码与新密码不一致！'
                , btn: '我知道了'
            });
            return false;
        }

        $.ajax({
            type: "POST",
            url: getAPIURL() + "safe-center/update-password",
            data: {oldpwd: _$txtOldPwd.val().toString(), newpwd: _$txtNewPwd.val().toString(), type: hash},
            dataType: 'json',
            cache: false,
            async: false,
            success: function (res) {
                loading.close();
                if (res.code) {
                    layer.open({
                        content: res.msg
                        , btn: '我知道了'
                    });
                }
                else {
                    layer.open({
                        content: txt + '密码修改成功!'
                        , btn: ['重新登录', '取消']
                        , yes: function () {
                            Logout();
                        }
                        , no: function () {
                            window.location.href = 'safe_center.html';
                        }
                    });
                }
            },
            error: function (data) {
                loading.close();
                layer.open({
                    content: "请求资源不存在",
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('access_token')
            }
        })

    };
    this.next = _next;
    (function () {
        _$txtOldPwd = $("#txtOldPwd");
        _$txtNewPwd = $("#txtNewPwd");
        _$txtReNewPwd = $("#txtReNewPwd");
    })();
}

var safechange;
$(function () {
    safechange = new Safechange(window.location.hash.slice(1));
});