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
        signDays:0,
        vaildCountSum:0
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
            url: util.serverHost + '/activity/sign-list',
            data: {
                id:userToken
            },
            success:function(requestRes)
            {
                if( requestRes.data.status)
                {
                    var userInfo = requestRes.data.data.user;
                    var signRecord = requestRes.data.data.signRecord;

                    if( !userInfo.activity_pay )
                    {
                        //这里要去参见活动
                        wx.redirectTo(
                            {
                                url:'/pages/health/route'
                            }
                        );
                        return;
                    }


                    // if( userInfo.)
                    if( !userInfo.health_status )
                    {
                        wx.redirectTo(
                            {
                                url:'/pages/health/info'
                            }
                        );
                        return;
                    }

                    if( !signRecord.length )
                    {
                        wx.redirectTo(
                            {
                                url:'/pages/logs/sign'
                            }
                        );
                        return;
                    }

                    //组装signList

                    var validRecord = [];
                    var vaildCountSum = 0;

                    for( var i =0 ; i < signRecord.length; i++)
                    {
                        if(!signRecord[i].sign_status)
                        {
                            continue;
                        }

                        var signProv = JSON.parse(signRecord[i].sign_prov);
                        var coverImage = '';

                        if( signProv.imgPath1Save )
                        {
                            coverImage = signProv.imgPath1Save;
                        } else
                        {
                            if(signProv.imgPath2Save)
                            {
                                coverImage = signProv.imgPath2Save;
                            } else
                            {
                                coverImage = signProv.imgPath3Save;
                            }
                        }

                        console.log(signRecord[i].date);
                        console.log(signRecord[i].date.substr(0,2));

                        vaildCountSum = vaildCountSum + parseInt(signProv.countIndex) + 1;

                        validRecord.push({id:signRecord[i].id,day:signRecord[i].date.substr(8,2),month:signRecord[i].date.substr(5,2),cover_image:coverImage,quantity:parseInt(signProv.countIndex) + 1,baseInfo:signProv.baseInfo,date:signRecord[i].date});


                    }


                    that.setData(
                        {
                            openid:requestRes.data.data.openid,
                            userInfo:requestRes.data.data.user,
                            signList:validRecord,
                            pageShow:true,
                            needSignToday:requestRes.data.data.needSignToday,
                            signDays:validRecord.length,
                            vaildCountSum:vaildCountSum
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
