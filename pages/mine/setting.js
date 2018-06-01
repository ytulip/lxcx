//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        openid:'',
        product:{},
        quantity:'',
        price:0,
        tabIndex:0,
        pageShow:0,
        selfGet:[],
        delvierHome:[],
        user:{},
        total_cash:0.00,
        direct_and_indirect_count:0,
        up_and_super_count:0,
        month_income:0
    },


    onLoad:function(options)
    {
        var openid = util.auth.getOpenid();
        this.setData(
            {
                openid:openid
            }
        );
        var that = this;
        wx.request({
            url: util.serverHost + 'activity/cash-info?openid=' + openid ,
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        pageShow:1,
                        selfGet:requestRes.data.data.sub_user,
                        delvierHome:requestRes.data.data.activity_user,
                        user:requestRes.data.data.user,
                        total_cash:requestRes.data.data.total_cash.toFixed(2),
                        direct_and_indirect_count:requestRes.data.data.direct_and_indirect_count,
                        up_and_super_count:requestRes.data.data.up_and_super_count,
                        month_income:requestRes.data.data.month_income
                    }
                );
            }
        })
    },

    bindQuantityChange:function(e)
    {
        this.setData(
            {
                quantity:e.detail.value,
            }
        );
    },

    pay:function () {
        var requestData = {};

        if( !this.data.quantity )
        {
            util.mAlert('邀请码必填');
            return;
        }

        requestData.invited_code = this.data.quantity;

        wx.request({
            url: util.serverHost + 'activity/up-user?openid=' + this.data.openid,
            method:'get',
            data:requestData,
            success:function(res)
            {
                console.log(res);
                if( res.data.status)
                {
                    wx.switchTab({
                        url: '/pages/mine/index',
                        success: function (e) {
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad();
                        }
                    });
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
    },

    changeIndex:function (e) {
        var tabIndex = e.currentTarget.dataset.index == "1"?1:0;
        this.setData(
            {
                tabIndex:tabIndex
            }
        )
    },

    /**
     * 微信解绑功能
     * @param e
     */
    loginOut:function(e)
    {
        wx.request({
            url: util.serverHost + 'activity/unbind?openid=' + this.data.openid ,
            success:function(requestRes)
            {
                if(requestRes.data.status)
                {
                    util.mAlert('退出成功');

                    wx.reLaunch({
                        url: '/pages/index/home'
                    });
                } else {
                    util.mAlert(requestRes.data.desc);
                }
            }
        })
    }
})
