//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        order:{},
        desc:''

    },
    onLoad: function(options) {
        var id = options.scene;
        var that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'activity/confirm-self-get?id=' + id,
                        data: {
                            code: res.code
                        },
                        success:function(requestRes)
                        {
                            console.log(requestRes);
                            that.setData(
                                {
                                    desc:requestRes.data.data.desc,
                                    src:(requestRes.data.data.code == 200)?'/images/success.png':'/images/fail.png'
                                }
                            );
                            // requestRes.data

                        }
                    })
                }
            }
        });


    }
})
