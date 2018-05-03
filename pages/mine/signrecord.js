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
        openid:'',
        signList:[]
    },
    onLoad: function(options) {

        var that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + '/activity/sign-list',
                        data: {
                            code: res.code,
                            id:options.id?options.id:''
                        },
                        success:function(requestRes)
                        {
                            // console.log(requestRes.data.user);
                            // requestRes.data
                            that.setData(
                                {
                                    openid:requestRes.data.data.openid,
                                    userInfo:requestRes.data.data.user,
                                    signList:requestRes.data.data.signRecord
                                }
                            );
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });


        // Do some initialize when page load.
        // wx.request({
        //     url: util.serverHost + 'activity/take-part-in',
        //     method:'post',
        //     data: {},
        //     success: function(res){
        //         // console.log(res);
        //
        //         console.log(res.data);
        //         if( res.data.status )
        //         {
        //
        //         } else
        //         {
        //             wx.showToast({
        //                 title:res.data.desc,
        //                 icon:"none",
        //                 duration:3000
        //             });
        //         }
        //     }
        // });
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

    goDetail:function(e)
    {
        var index = e.currentTarget.dataset.id;
        wx.navigateTo(
            {
                url:'/pages/mine/signdetail?id=' + index
            }
        );
    }

})
