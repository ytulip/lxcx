//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        order:{}

    },
    onLoad: function(options) {
        var openid = util.auth.getOpenid();
        this.setData(
            {
                openid:openid
            }
        );
        var that = this;
        wx.request({
            url: util.serverHost + 'activity/last-payed-order?openid=' + this.data.openid ,
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        order:requestRes.data.data.order
                    }
                );
            }
        })
    },

    pay:function () {
        wx.switchTab({
            url: '/pages/index/home',
            success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
            }
        })
    },

    getGood:function() {
        wx.navigateTo({
                url: '/pages/report/getgood'
            }
        );
    }

})
