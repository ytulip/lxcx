//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    userStatus:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
      openid:'',
      signScore:'',
      util:'',
      showPage:false
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
          url: util.serverHost + 'activity/user-info-new',
          data: {
              openid:openid
          },
          success:function(requestRes)
          {
              that.setData(
                  {
                      userInfo:requestRes.data.data.user,
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
    }

})
