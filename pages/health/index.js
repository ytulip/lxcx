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
      tall:'',
      blood_press:'',
      weight:'',
      waistline:'',
      blood_glucose:'',
      openid:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {

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
                            that.setData(
                                {
                                    openid:requestRes.data.data.openid
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

    bindTallInput:function(e){
        this.setData({
            tall: e.detail.value
        })
    },
    bindBloodPressInput:function(e){
        this.setData({
            blood_press: e.detail.value
        })
    },
    bindWeightInput:function(e){
        this.setData({
            weight: e.detail.value
        })
    },
    bindWaistlineInput:function(e){
        this.setData({
            waistline: e.detail.value
        })
    },
    bindBloodGlucoseInput:function(e){
        this.setData({
            blood_glucose: e.detail.value
        })
    },

    nextStep : function(){

        var requestData = {step:1,data:{tall:this.data.tall,blood_press:this.data.blood_press,weight:this.data.weight,waistline:this.data.waistline,blood_glucose:this.data.blood_glucose}};
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
                            url: '/pages/health/index2'
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
})
