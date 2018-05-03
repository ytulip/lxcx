//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        rebuy:0,
        src:"https://lamushan.com/user/good-detail-xcx?product_id=1"
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function(options) {


        if ( !util.auth.tryAuth() )
        {
            return;
        }

        var that = this;

        if( options.rebuy )
        {
            this.setData({
                src:"https://lamushan.com/user/good-detail-xcx?product_id=1&rebuy=1"
            })
        }

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
                            // requestRes.data
                            that.setData(
                                {
                                    openid:requestRes.data.data
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
})
