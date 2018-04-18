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
        healthTags:[],
        healthTagsValue:[]
    },


    onLoad: function (options) {

        var that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'activity/health-info',
                        data: {
                            code: res.code
                        },
                        success: function (requestRes) {
                            console.log(requestRes);

                        var tagCount = requestRes.data.data.health_tags.length;
                        var tagsValue = [];
                        for(var i = 0;i < tagCount;i++)
                        {
                            tagsValue[i] = {name:requestRes.data.data.health_tags[i],color:'efefef'};
                        }

                        that.setData(
                            {
                                openid: requestRes.data.data.openid,
                                healthTags:requestRes.data.data.health_tags,
                                healthTagsValue:tagsValue
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

    chooseTag:function(e)
    {
        var index = e.currentTarget.dataset.index;
        console.log(index);
        console.log(this.data.healthTagsValue[index]);
        if ( this.data.healthTagsValue[index].color == "efefef" )
        {
            this.data.healthTagsValue[index].color = "98CC3D";
        } else
        {
            this.data.healthTagsValue[index].color = "efefef";
        }

        var tempArr = this.data.healthTagsValue;

        this.setData({
            healthTagsValue:tempArr
        });

        // this.data.healthTags = this.data.healthTags;

    },

    nextStep:function()
    {
        var length = this.data.healthTagsValue.length;
        var tagArr = [];

        for(var i=0;i < length;i++)
        {
            if( this.data.healthTagsValue[i].color == "98CC3D" )
            {
                tagArr.push(this.data.healthTagsValue[i].name);
            }
        }


        var requestData = {step:2,data:tagArr};
        wx.request({
            url: util.serverHost + 'activity/save-health?openid=' + this.data.openid,
            method:'post',
            data:requestData,
            success:function(res)
            {
                console.log(res);
                if( res.data.status)
                {
                    wx.redirectTo(
                        {
                            url: '/pages/health/index3'
                        }
                    );
                } else
                {
                    wx.showToast({
                        title: res.data.desc,
                        icon: "none",
                        duration: 3000
                    });
                }
            }
        })
    }
});


