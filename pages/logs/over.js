//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        pageShow:false
    },

    onLoad:function()
    {
        var that = this;
        var openid = util.auth.getOpenid();
        this.setData(
            {
                imageHost:util.imageHost
            }
        );
        wx.request({
            url: util.serverHost + 'activity/sign-report',
            data: {
                openid: openid,

            },
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data


                //这里安排跳转
                if( !requestRes.data.data.order.health_over_info_status )
                {
                    wx.redirectTo(
                        {
                            url:'/pages/logs/fill_over'
                        }
                    );
                    return;
                }


                that.setData(
                    {
                        healthInfo:JSON.parse(requestRes.data.data.user.health_info),
                        overHealthInfo:JSON.parse(requestRes.data.data.order.health_over_info),
                        openid:requestRes.data.data.openid,
                        signRecord:JSON.parse(requestRes.data.data.sign_record.sign_prov),
                        userInfo:requestRes.data.data.user,
                        signDays:requestRes.data.data.sign_days,
                        pageShow:true
                    }
                );
            }
        });
    },

    goOn : function(){

        wx.switchTab({
            url: '/pages/logs/logs',
            success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
            }
        });
    },

    turnback : function()
    {
      util.mAlert('打卡完成30天后才可提现');
    }
})
