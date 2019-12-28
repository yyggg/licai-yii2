/**
 * Created by tim on 2016/6/20.
 */
loading.open();
$.ajax({
    type: 'GET',
    url: getAPIURL() + "safe-center/user-info",
    data: null,
    dataType: 'json',
    headers: {
        "Authorization": "Bearer " + localStorage.getItem('access_token')
    },
    success: function (res) {
        loading.close();
        $('#field_value').val(res.data[hash]);
    },
});

$('.withdraw_btn').on('click', function () {

    var filedVal = $('#field_value').val();

    if ($.trim(filedVal) == "") {
        loading.close();
        layer.open({
            content: '不能为空！'
            , btn: '我知道了'
        });
        return false;
    }

    $.ajax({
        type: "POST",
        url: getAPIURL() + "safe-center/update-field",
        data: {fieldname:hash, fieldval: filedVal},
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
                    content: '修改成功!'
                    , btn: '我知道了'
                });
            }
        },
        error: function (res) {
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
});

