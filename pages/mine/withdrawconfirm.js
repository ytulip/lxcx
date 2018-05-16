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
        user:{},
        pageShow:0,
        withdraw_type:0,
        account:'',
        cash:0
    },


    onLoad: function (options) {
        var openid = util.auth.getOpenid();
        var that = this;
        this.setData(
            {
                openid:openid,
                withdraw_type:options.type,
                cash:options.cash,
                account:options.account
            }
        );

        wx.request({
            url: util.serverHost + 'activity/user-info-new' ,
            data: {
                openid:openid
            },
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        user:requestRes.data.data.user,
                        phone:requestRes.data.data.user.phone,
                        pageShow:1
                    }
                );
            }
        })
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

        wx.request({
            url: util.serverHost + 'activity/withdraw',
            method: 'post',
            data: {phone: this.data.phone, withdraw_sms_code: this.data.smsCode, openid: this.data.openid,id_card:this.data.id_card,real_name:this.data.real_name,withdraw_type:this.data.withdraw_type,account:this.data.account,withdraw:this.data.cash},
            success: function (res) {
                // console.log(res);

                console.log(res.data);
                if (res.data.status) {
                    wx.redirectTo({
                        url: '/pages/mine/withdrawsuccess'
                    })
                } else {
                    util.mAlert(res.data.desc);
                }
            }
        });
    },

    sendSms: function () {

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
            url: util.serverHost + 'activity/withdraw-sms',
            method: 'post',
            data: {phone: this.data.phone, storage_type: 'cache'},
            success: function (res) {
                console.log(res);
            }
        });
    },
});


