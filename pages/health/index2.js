//index.js
// var qcloud = require('../../vendor/wafer2-client-sdk/index')
// var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        phone: "",
        smsCode: "",
        openid: "",
        smsText:'获取验证码',
        healthTags:[]
    },


    onLoad: function (options) {

        var that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'activity/health-info',
                        data: {
                            code: res.code
                        },
                        success: function (requestRes) {
                            console.log(requestRes);

                        that.setData(
                            {
                                openid: requestRes.data.data.openid,
                                healthTags:requestRes.data.data.health_tags
                            }
                    );
                }
            })
    } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },
});


