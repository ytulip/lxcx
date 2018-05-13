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
        pageShow:false,
        needSignToday:0,
        list:[],
        monthList:[]
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function(options) {
        var openid = util.auth.getOpenid();
        var userToken = util.auth.getUserToken();
        var that = this;

        wx.request({
            url: util.serverHost + 'activity/bill',
            data: {
                openid:openid
            },
            success:function(requestRes)
            {
                if( requestRes.data.status)
                {
                    var signRecord = requestRes.data.data.data;

                    //组装signList

                    for( var i =0 ; i < signRecord.length; i++)
                    {
                        console.log(that.data.monthList.indexOf(signRecord[i].created_month));
                        if( that.data.monthList.indexOf(signRecord[i].created_month) === -1 )
                        {
                            that.data.monthList.push(signRecord[i].created_month);
                            that.data.list.push({is_month_record:true,month:signRecord[i].created_month.substr(5,2),year:signRecord[i].created_month.substr(0,4)});
                        }

                        that.data.list.push(signRecord[i]);
                    }

                    console.log(that.data.list);


                    that.setData(
                        {
                            openid:requestRes.data.data.openid,
                            list:that.data.list,
                            pageShow:true,
                        }
                    );

                } else
                {

                }
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
    takePart:function()
    {
        wx.navigateTo({
            url: '/pages/health/route'
        })
    },

    goLog:function()
    {

        //判断用户是否参加过打卡哟
        console.log(this.data.userInfo);
        if( !this.data.userInfo.id )
        {
            wx.navigateTo(
                {
                    url:'/pages/mine/bind'
                }
            );
            return;
        }


    },

    goInfo:function(){
        wx.navigateTo({
            url: '/pages/health/info'
        })
    }
})
