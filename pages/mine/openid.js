//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {

    },
    onLoad: function(options) {
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'passport/openid',
                        data: {
                            code: res.code
                        },
                        success:function(requestRes)
                        {
                            console.log(requestRes);
                            util.auth.setOpenid(requestRes.data.data.openid);

                            wx.switchTab({
                                url: '/pages/index/home'
                            });
                            console.log('跳回去');
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    }
})
