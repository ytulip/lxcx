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
        smsText: '获取验证码',
    },

    onLoad: function (options) {



        console.log(options.scene);
        //存儲scene
        if( options.scene )
        {
            wx.setStorageSync('recommond_user', options.scene);
        } else
        {
            wx.setStorageSync('recommond_user', 0);
        }


        var that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'passport/openid',
                        data: {
                            code: res.code
                        },
                        success: function (requestRes) {
                            console.log(requestRes);

                            //这里有路由，三种状态①停留在当页；②跳转到支付页面；③跳转到健康打卡页面
                            if ( requestRes.data.data.user )
                            {
                                //用户存在
                                if (requestRes.data.data.user.activity_pay)
                                {
                                    console.log(456);
                                    wx.switchTab({
                                        url: '/pages/logs/logs',
                                        success: function (e) {
                                            var page = getCurrentPages().pop();
                                            if (page == undefined || page == null) return;
                                            page.onLoad();
                                        }
                                    })
                                } else {
                                    wx.redirectTo({
                                        url: '/pages/activity/pay?openid=' + requestRes.data.data.openid
                                    })
                                }
                            } else
                            {
                                wx.redirectTo({
                                    url: '/pages/activity/index'
                                })
                            }

                            // requestRes.data
                            that.setData(
                                {
                                    openid: requestRes.data.data.openid
                                }
                            );
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    }
});