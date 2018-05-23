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
        smsTextLock:0,
        real_name:"",
        id_card:"",
        showPage:0
    },


    onLoad: function (options) {

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
                                        url: '/pages/logs/logs'
                                    })
                                } else {
                                    wx.redirectTo({
                                        url: '/pages/activity/pay?openid=' + requestRes.data.data.openid
                                    })
                                }
                            }

                            // requestRes.data
                            that.setData(
                                {
                                    openid: requestRes.data.data.openid,
                                    showPage:1,
                                    src:util.serverHost + 'passport/xcx-bind?type=activity&openid=' + requestRes.data.data.openid
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

    //开始去获取用户的openid哟

    bindPhoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },

    bindSmsCode: function (e) {
        this.setData({
            smsCode: e.detail.value
        })
    },

    bindIdcardInput:function(e)
    {
        this.setData({
            id_card: e.detail.value
        })
    },

    bindRealNameInput:function(e)
    {
        this.setData({
            real_name: e.detail.value
        })
    },


    takePartIn: function () {

        var that = this;

        /**
         * 判断手机号
         */
        if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test(this.data.phone))) {
            console.log('请输入正确的手机号:' + this.data.phone);
            util.mAlert('请输入正确的手机号');
            return;
        }

        /**
         * 判断身份证号
         */
        if (!(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(this.data.id_card))) {
            util.mAlert('请输入正确的身份证号');
            return;
        }

        /**
         * 判断姓名
         */
        if(!this.data.real_name)
        {
            util.mAlert('姓名不能为空');
            return;
        }

        wx.request({
            url: util.serverHost + 'activity/take-part-in',
            method: 'post',
            data: {phone: this.data.phone, register_sms_code: this.data.smsCode, openid: this.data.openid,id_card:this.data.id_card,real_name:this.data.real_name},
            success: function (res) {
                // console.log(res);

                console.log(res.data);
                if (res.data.status) {
                    wx.redirectTo({
                        url: '/pages/activity/pay?openid=' + that.data.openid
                    })
                } else {

                    if( res.data.flag == 1)
                    {
                        wx.switchTab({
                            url: '/pages/logs/logs'
                        })
                        return;
                    }

                    wx.showToast({
                        title: res.data.desc,
                        icon: "none",
                        duration: 3000
                    });
                }
            }
        });
    },

    sendSms: function () {
        // console.log('开始网络请求');

        //验证手机号是否格式有误
        if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test(this.data.phone))) {
            console.log('请输入正确的手机号:' + this.data.phone);
            util.mAlert('请输入正确的手机号');
            return;
        }

        if( this.data.smsTextLock )
        {
            return;
        } else {
            this.setData(
                {
                    smsTextLock:1
                }
            );
        }



        //60秒倒计时
        (function(a){
            a.data.smsText = 60;
            var countDownHandler = setInterval(function(){
                // $(a).attr('data-second',$(a).attr('data-second') - 1);
                a.setData({smsText:a.data.smsText - 1});
                console.log(a.data.smsText);
                if( a.data.smsText < 1) {
                    clearInterval(countDownHandler);
                    a.setData({smsText:'获取验证码'});
                    // $(a).removeClass('get-code-lock');
                    // $(a).find('span').html('获取验证码');
                    a.setData(
                        {
                            smsTextLock:0
                        }
                    );
                    return;
                }
                // $(a).find('span').html($(a).attr('data-second') + '秒');
                // console.log();
            },1000);
        })(this);



        wx.request({
            url: util.serverHost + 'passport/register-sms',
            method: 'post',
            data: {phone: this.data.phone, storage_type: 'cache'},
            success: function (res) {
                console.log(res);
            }
        });

        // wx.request({
        //     url: 'http://wp.zhuyan.me/api/open/news', //仅为示例，并非真实的接口地址
        //     data: {
        //     },
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: function(res) {
        //         console.log(res.data)
        //     }
        // });
        //
        // console.log('网络请求结束');
        // wx.showToast(123);
    },
});


