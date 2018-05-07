//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        openid:'',
        product:{},
        quantity:'',
        price:0,
        tabIndex:0,
        used_list:[],
        valid_list:[],
        pageShow:false
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
            url: util.serverHost + 'activity/invited-code?openid=' + openid ,
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        product:requestRes.data.data.product_attr,
                        used_list:requestRes.data.data.used_list,
                        valid_list:requestRes.data.data.valid_list,
                        pageShow:true
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
    }
})
