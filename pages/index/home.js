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
        pageShow:false
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function(options) {

        // var openid =
        //第一步拿openid拿用户
        var openid = util.auth.getOpenid();
        var userToken = util.auth.getUserToken();
        if( false && openid && (userToken || (userToken == -1)) )
        {
            //算了前期次次都重新拿数据吧
            this.setData(
                {
                    pageShow:1
                }
            );
        } else
        {
            var that = this;
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
                                if(requestRes.data.status)
                                {
                                    util.auth.setOpenid(requestRes.data.data.openid);
                                    util.auth.setUserToken(requestRes.data.data.user?requestRes.data.data.user.id:-1);
                                    that.setData(
                                        {
                                            openid:requestRes.data.data.openid,
                                            userInfo:requestRes.data.data.user,
                                            pageShow:true
                                        }
                                    );
                                }
                            }
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        }
    },
    onShow: function(){
        // var openid =
        //第一步拿openid拿用户
        var openid = util.auth.getOpenid();
        var userToken = util.auth.getUserToken();
        if( false && openid && (userToken || (userToken == -1)) )
        {
            //算了前期次次都重新拿数据吧
            this.setData(
                {
                    pageShow:1
                }
            );
        } else
        {
            var that = this;
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
                                if(requestRes.data.status)
                                {
                                    util.auth.setOpenid(requestRes.data.data.openid);
                                    util.auth.setUserToken(requestRes.data.data.user?requestRes.data.data.user.id:-1);
                                    that.setData(
                                        {
                                            openid:requestRes.data.data.openid,
                                            userInfo:requestRes.data.data.user,
                                            pageShow:true
                                        }
                                    );
                                }
                            }
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    pay:function () {
        wx.request({
            url: util.serverHost + 'activity/activity-pay?openid=o0psn4ymkQ0ad5V4nvvs3PXRADD4',
            method:'get',
            success:function(res)
            {
                console.log(res);
                if( res.data.status)
                {
                    var jsonData = JSON.parse(res.data.data);
                    console.log(jsonData);

                    wx.requestPayment({
                        'timeStamp': jsonData.timeStamp,
                        'nonceStr': jsonData.nonceStr,
                        'package': jsonData.package,
                        'signType': jsonData.signType,
                        'paySign': jsonData.paySign,
                        'success':function(res){
                        },
                        'fail':function(res){
                        }
                    });
                }


                // wx.requestPayment({
                //     'timeStamp': '',
                //     'nonceStr': '',
                //     'package': '',
                //     'signType': 'MD5',
                //     'paySign': '',
                //     'success':function(res){
                //     },
                //     'fail':function(res){
                //     }
                // });

                // requestRes.data
                // that.setData(
                //     {
                //         openid:requestRes.data.data
                //     }
                // );
            }
        })
    },
    takePart:function()
    {

        if(!this.data.userInfo)
        {
            wx.navigateTo({
                url: '/pages/health/route'
            })
            return;
        }

        if(this.data.userInfo.activity_pay)
        {
            util.mAlert('您已参加过该活动');
            return;
        }

        wx.navigateTo({
            url: '/pages/health/route'
        })
    },

    goLog:function()
    {

        //判断用户是否参加过打卡哟
        console.log(this.data.userInfo);
        if( !this.data.userInfo )
        {
            wx.navigateTo(
                {
                    url:'/pages/mine/bind'
                }
            );
            return;
        }

        //跳转到打卡页面
        wx.navigateTo(
            {
                url:'/pages/health/signlist'
            }
        );


    },

    goInfo:function(){
        if( !this.data.userInfo )
        {
            wx.navigateTo(
                {
                    url:'/pages/mine/bind'
                }
            );
            return;
        }


        wx.navigateTo({
            url: '/pages/health/info'
        })
    },

    goReport:function()
    {
        if( !this.data.userInfo )
        {
            wx.navigateTo(
                {
                    url:'/pages/mine/bind'
                }
            );
            return;
        }

        wx.navigateTo({
            url: '/pages/report/good'
        })
    },


    goReReport:function()
    {
        if( !this.data.userInfo )
        {
            wx.navigateTo(
                {
                    url:'/pages/mine/bind'
                }
            );
            return;
        }

        wx.navigateTo({
            url: '/pages/report/good?rebuy=1'
        })
    }
})
