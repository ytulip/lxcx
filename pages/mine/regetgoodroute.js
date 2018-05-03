//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        user:{}

    },
    onLoad: function(options) {

        if ( !util.auth.tryAuth() )
        {
            return;
        }

        var openid = util.auth.getOpenid();
        this.setData(
            {
                openid:openid
            }
        );
        var that = this;
        wx.request({
            url: util.serverHost + 'activity/user-info-new?openid=' + this.data.openid ,
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        user:requestRes.data.data.user
                    }
                );
            }
        })
    },

})
