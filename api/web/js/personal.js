(function () {
    //显示用户名
    $.ajax({
        type: "GET",
        url: getAPIURL() + "user/info",
        dataType: "json",
        success: function (res) {

            $("#user_info").text(res.data.username);
            $("#rem_link span").text(getAPIURL() + 'reg.html?user_id=' + res.data.id);
            $("#waitNum_dec").text(res.data.amount);
            $("#returnIn_dec").text(res.data.amount_total);
        },
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access_token')
        }
    });
})();

//转入
$('#recharge_btn').on('click', function () {
    $('#roll_in').show();
});
$('#roll_in button').on('click', function () {
    var rollInVal = $('#roll_in_val').val();

    if(rollInVal == '')
    {
        layer.open({
            content: "金额不能为空",
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }else if (isNaN(rollInVal)){
        layer.open({
            content: "金额不是一个数字",
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }else if (rollInVal < 1000){
        layer.open({
            content: "转入金额不能小于1000元",
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }

    $('.myjf_bounce').hide();

    $.ajax({
        type: "POST",
        url: getAPIURL() + "safe-center/roll-in",
        dataType: "json",
        data: {roll_in: rollInVal},
        success: function (res) {
            if(res.code){
                layer.open({
                    content: res.msg,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }else
            {
                layer.open({
                    content: '已提交，待审核！'
                    , btn: '我知道了'
                });
            }
        },
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access_token')
        }
    });
});


//转出
var mobileSelect1 = new MobileSelect({
    trigger: '#pay_type',
    title: '转出到',
    wheels: [
        {data:['银行卡','支付宝','财富通']}
    ],
    position:[0], //Initialize positioning
    callback:function(indexArr, data){
        $('#pay_type').val(data[0]);
        //console.log(data[0]); //Returns the selected json data
    }
});

$('.withdraw_btn').on('click', function () {
    $('#roll_out').show();
});
$('#roll_out button').on('click', function () {
    var rollOutVal = $('#roll_out_val').val();
    var payTypeVal = $('#pay_type').val();

    if(rollOutVal == '')
    {
        layer.open({
            content: "金额不能为空",
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }else if (isNaN(rollOutVal)){
        layer.open({
            content: "金额不是一个数字",
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }else if (rollOutVal < 300){
        layer.open({
            content: "转出金额不能小于300元",
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }
    if(payTypeVal == '')
    {
        layer.open({
            content: "请选择转出的银行类型",
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }

    $('.myjf_bounce').hide();

    $.ajax({
        type: "POST",
        url: getAPIURL() + "safe-center/roll-out",
        dataType: "json",
        data: {roll_out: rollOutVal,pay_type: payTypeVal},
        success: function (res) {
            if(res.code){
                layer.open({
                    content: res.msg,
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }else
            {
                layer.open({
                    content: '已提交，待审核！'
                    , btn: '我知道了'
                });
            }
        },
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access_token')
        }
    });
});



$('.close_btn').on('click', function () {
    $('.myjf_bounce').hide();
});

