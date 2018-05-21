//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        order:{},
        id:'',
        record:{},
        pageShow:1

    },
    onLoad: function(options) {
        var openid = util.auth.getOpenid();
        this.setData(
            {
                openid:openid,
                id:options.id
            }
        );
        var that = this;
    },

    pay:function () {
        wx.switchTab({
            url: '/pages/index/home',
            success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
            }
        })
    },

    getGood:function() {
        wx.navigateTo({
                url: '/pages/report/getgood'
            }
        );
    }

})
