//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        record:{},
        showPage:false,
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs',
        })
    },
    onLoad: function(options) {


        var openid = util.auth.getOpenid();
        var that  = this;


        wx.request({
            url: util.serverHost + 'activity/read-message?id=' + options.id,
            data: {
                openid:openid
            },
            success:function(requestRes)
            {
                that.setData(
                    {
                        record:requestRes.data.data.data,
                        showPage:true
                    }
                );
            }
        })
    },
    onShow: function(){
        var openid = util.auth.getOpenid();
        var that  = this;


        wx.request({
            url: util.serverHost + 'activity/user-info-new',
            data: {
                openid:openid
            },
            success:function(requestRes)
            {
                // console.log(requestRes.data.user);
                // requestRes.data
                that.setData(
                    {
                        userInfo:requestRes.data.data.user
                    }
                );
            }
        })
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


    goBind:function()
    {
        wx.navigateTo(
            {
                url:'/pages/mine/bind'
            }
        );
    },

    goDetail:function()
    {
        if( this.data.record.msg_type == 11)
        {
            wx.navigateTo(
                {
                    url:"/pages/mine/signdetail?id=" + this.data.record.refer_id
                }
            );
            return;
        }

        if( this.data.record.msg_type == 12)
        {
            wx.navigateTo(
                {
                    url:"/pages/health/signlist"
                }
            );
            return;
        }
    }

})