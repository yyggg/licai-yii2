(function () {
    var userAgent = navigator.userAgent;
    var index = userAgent.indexOf("Android");
    if (index >= 0) {
        var androidVersion = parseFloat(userAgent.slice(index + 8));
        if (androidVersion < 5) {
            var html = document.documentElement;
            var hW = html.getBoundingClientRect().width;
            html.style.fontSize = hW / 7.5 + "px";
        }
    }
})();

//加入百度统计
function Common() {
    _init = function () {
        //$(document.body).append("<script type=\"text/javascript\">var cnzz_protocol = ((\"https:\" == document.location.protocol) ? \" https://\" : \" http://\");document.write(unescape(\"%3Cspan id='cnzz_stat_icon_1259647640'%3E%3C/span%3E%3Cscript src='\" + cnzz_protocol + \"s4.cnzz.com/z_stat.php%3Fid%3D1259647640' type='text/javascript'%3E%3C/script%3E\"));</script>)");

//		$(document.body).append("<script src=\"https://s95.cnzz.com/z_stat.php?id=1259787883&web_id=1259787883\" language=\"JavaScript\"></script>");
//		$(document.body).append("<script src=\"https://hm.baidu.com/hm.js?1e43e612748ab51862300a1d1408228e\" language=\"JavaScript\"></script>");
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?1e43e612748ab51862300a1d1408228e";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();

    },
        (function () {
            _init();
        })();
}

var common;
var loginStatus = getCookie('login_status'); //登录状态
var pathname = window.location.pathname; //当前文件路径
var needLoginPage = pathname != '/login.html' && pathname != '/reg.html'; //是否需要登录的页面

var device = localStorage.getItem("device");


$(function () {
    common = new Common();
//	$("body").append("<script type='text/javascript'>var _py = _py || [];_py.push(['a', 'g8s..f0By7TSPtof_-QOIdzOkGX']);_py.push(['domain','stats.ipinyou.com']);_py.push(['e','']);-function(d) {var s = d.createElement('script'),e = d.body.getElementsByTagName('script')[0]; e.parentNode.insertBefore(s, e),f = 'https:' == location.protocol;s.src = (f ? 'https' : 'http') + '://'+(f?'fm.ipinyou.com':'fm.p0y.cn')+'/j/adv.js';}(document);</script><noscript><img src='//stats.ipinyou.com/adv.gif?a=g8s..f0By7TSPtof_-QOIdzOkGX&e=' style='display:none';/></noscript>");
//	$(".weui_media_title").click(function(){
//		$(this).toggleClass("active").siblings(".weui_media_desc").slideToggle();
//	});
//
//	var jojocode = request.QueryString("jojocode");
//  if (jojocode && jojocode != "null") {
//      sessionStorage.setItem("jojocode", jojocode);
//  }
})
var request = {
    QueryString: function (val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
    }
};

//判断登录状态
if(needLoginPage && localStorage.getItem('access_token') == null)
{
    window.location.href = 'login.html';
}
if(needLoginPage && loginStatus == null)
{
    $.ajax({
        type: 'GET',
        url: getAPIURL() + "user/login-status",
        dataType: "json",
        success: function (res) {
            if(res.code)
            {
                window.location.href = 'login.html';
            }
            else
            {
                document.cookie="login_status=1";
            }
        },
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('access_token')
        }
    });
}

//退出登录
function Logout() {
    localStorage.clear();
    delCookie('login_status');
    layer.open({
        content: "已退出",
        skin: 'msg',
        time: 2, //2秒后自动关闭
        end: function () {
            window.location.href = 'login.html';
        }
    });
}

function getAPIURL() {
    return "http://mlc.com/";
}


//写cookies
function setCookie(cname, cvalue, exSecond) {
    var d = new Date();
    d.setTime(d.getTime() + (exSecond*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//读取cookies
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}

//删除cookies
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

