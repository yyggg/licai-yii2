$.ajax({
    type: "GET",
    url: getAPIURL() + "safe-center/user-info",
    dataType: "json",
    data: null,
    success: function (res) {
        res.data.username ? $('#account .setting_value').text(res.data.username) : $('#account .setting_value').html('<font color="red">未填写</font>');
        res.data.real_name ? $('#realname .setting_value').text(res.data.real_name) : $('#realname .setting_value').html('<font color="red">未填写</font>');
        res.data.id_card ? $('#datacid .setting_value').text(res.data.id_card) : $('#datacid .setting_value').html('<font color="red">未填写</font>');
        res.data.bank_number ? $('#bank_number .setting_value').text(res.data.bank_number) : $('#bank_number .setting_value').html('<font color="red">未填写</font>');
        res.data.alipay ? $('#alipay .setting_value').text(res.data.alipay) : $('#alipay .setting_value').html('<font color="red">未填写</font>');
        res.data.tenpay ? $('#tenpay .setting_value').text(res.data.tenpay) : $('#tenpay .setting_value').html('<font color="red">未填写</font>');
        res.data.trans_password ? $('#trans_password .setting_value').text(res.data.trans_password) : $('#trans_password .setting_value').html('<font color="red">未填写</font>');
    },
    error: function () {
        $('#mydiv').empty();
        var txtsNULL = "<p class='nothing'>网络错误</p>";
        $('#mydiv').append(txtsNULL);
    },
    headers: {
        "Authorization": "Bearer " + localStorage.getItem('access_token')
    }
});