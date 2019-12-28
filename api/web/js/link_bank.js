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
        $('#bank_type').val(res.data.bank_type);
        $('#bank_number').val(res.data.bank_number);
        $('#bank_branch').val(res.data.bank_branch);
    },
});
var banks = [{
    label: '招商银行',
    disabled: true,
    value: 0
}, {
    label: '工商银行',
    value: 1
}, {
    label: '建设银行',
    value: 2
}, {
    label: '交通银行',
    value: 3
}, {
    label: '中国银行',
    value: 4
}, {
    label: '浦发银行',
    value: 5
}, {
    label: '平安银行',
    value: 6
}, {
    label: '民生银行',
    value: 7
}, {
    label: '光大银行',
    value: 8
}, {
    label: '兴业银行',
    value: 9
}, {
    label: '邮政银行',
    value: 10
}, {
    label: '发展银行',
    value: 11
}, {
    label: '汉口银行',
    value: 12
}, {
    label: '华夏银行',
    value: 13
}, {
    label: '北京银行',
    value: 14
}, {
    label: '上海银行',
    value: 15
}, {
    label: '浙商银行',
    value: 16
}];

//选择银行
$('#bank_type').on('click', function () {
    weui.picker(banks, {
        onConfirm: function (result) {
            $('#bank_type').val(banks[result[0]].label);
        }
    });
});

//四位数一空格
function numFormat(obj) {
    var v = obj.value;
    v =v.replace(/(\s)/g,'').replace(/(\d{4})/g,'$1 ').replace(/\s*$/,'')
    obj.value = v;
}

$('.butt a').on('click', function () {
    var bankType   = $('#bank_type').val();
    var bankNumber = $('#bank_number').val();
    var bankBranch = $('#bank_branch').val();

    if(bankType == ''){
        layer.open({
            content: '银行种类不能为空！'
            , skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }
    if(bankNumber == ''){
        layer.open({
            content: '银行卡号不能为空！'
            , skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }
    if(bankBranch == ''){
        layer.open({
            content: '开户支行不能为空！'
            , skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        return;
    }
    loading.open();
    $.ajax({
        type: 'post',
        url: getAPIURL() + "safe-center/update-bank",
        data: {bank_type:bankType, bank_number:bankNumber, bank_branch:bankBranch},
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access_token')
        },
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
    });

});