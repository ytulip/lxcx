//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        monthGetGood:{}

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
            url: util.serverHost + 'activity/month-get-good-info?openid=' + this.data.openid ,
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        monthGetGood:requestRes.data.data.monthGetGood
                    }
                );
            }
        })
    },

    pay:function () {
        wx.switchTab({
            url: '/pages/index/home'
        })
    },

    getGood:function() {
        wx.navigateTo({
                url: '/pages/rereport/getgood'
            }
        );
    }


})
