(function () {
    //控制积分规则弹出层
    $(".jfgz").click(function () {
        $(".myjf_bounce").show();
    });

    $(".close_btn").click(function () {
        $(".myjf_bounce").hide();
    });

    var pageNum = 0;
    var dropload = $("#wrapper").dropload({
        domUp: {
            domClass: 'dropload-up',
            domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
            domUpdate: '<div class="dropload-update">↑释放更新</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData: '<div class="dropload-noData">暂无数据</div>'
        },
        loadUpFn: function (me) {
            pageNum = 0;
            load(true);
//      	dropload.resetload();
        },
        loadDownFn: function (me) {
            load();
//      	dropload.resetload();
        },
//      autoLoad : false
    });

//	load();
    function load(flag) {
        pageNum++;
        $.ajax({
            type: "GET",
            url: getAPIURL() + "profit-logs/page?page=" + pageNum,
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
                $(".total_score font").text(res.data.amount_total);
                //总积分和会员级别
                console.log(res);

                if (res.data.lists.length < 1) {
                    if (pageNum == 1) {
                        $(".vip").hide();
                        $("#wrapper").hide();
                        $(".no_jfrecord").show();
                    }
                }
                var html = "";
                for (var i = 1; i < res.data.lists.length; i++) {
                    var score = res.data.lists[i].point;
                    var date = res.data.lists[i].create_time;

                    html = '<li class="item clearfix"><div class="part1">';
                    html += '<div class="plus_score">';
                    html += "<span class='big'>+" + score + "</span>元</div>";
                    html += "<div class='time'>" + date + "</div>";
                    html += "</div>";
                    html += "<div class='part2'>收益</div>";
                    html += "</li>";
                    $(".bottom").empty().append(html);
                }
                if (flag) {
                    dropload.resetload();
                    if (res.data.lists.length < 9) {
                        $(".dropload-refresh").text("无更多内容");
                    }
                } else {
                    $(".bottom").append(html);
                    dropload.resetload();
                    if (res.data.lists.length < 9) {
                        $(".dropload-refresh").text("无更多内容");
                    }
                }

            },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('access_token')
            }
        });
    }
})();