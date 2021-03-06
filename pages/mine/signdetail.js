//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        id:0,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        openid:'',
        signList:[],
        signProv:'',
        imageHost:'',
        signData:{},
        edit:0,
        baseInfo:''
    },
    onLoad: function(options) {

        this.setData(
            {
                edit:options.edit?1:0,
                id:options.id
            }
        );
        var that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'activity/sign-detail?id=' + options.id,
                        data: {
                            code: res.code
                        },
                        success:function(requestRes)
                        {
                            // console.log(requestRes.data.user);
                            // requestRes.data
                            console.log(requestRes.data.data.sign_prov);
                            that.setData(
                                {

                                    signProv:JSON.parse(requestRes.data.data.sign_prov),
                                    signData:requestRes.data.data,
                                    // openid:requestRes.data.data.openid,
                                    // userInfo:requestRes.data.data.user,
                                    // signList:requestRes.data.data.signRecord
                                    imageHost:util.imageHost
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

    bindBaseInfoInput:function(e)
    {
        this.setData({
            baseInfo: e.detail.value
        })
    },

    doComment:function()
    {
        if( !this.data.baseInfo )
        {
            util.mAlert('留言内容不能为空');
            return;
        }
        wx.request({
            url: util.serverHost + 'activity/up-comment',
            method: 'get',
            data:{id:this.data.id,content:this.data.baseInfo},
            success: function (res) {
                wx.navigateTo(
                    {
                        url:'/pages/mine/upcommentsuccess'
                    }
                );
            }
        });
    }

})
