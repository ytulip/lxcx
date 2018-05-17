//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        openid:'',
        product:{},
        quantity:3,
        price:0,
        user:{},
        countArray:['中国工商银行股份有限公司','中国农业银行股份有限公司','中国银行股份有限公司','中国建设银行股份有限公司','交通银行股份有限公司','中信银行股份有限公司','中国光大银行股份有限公司','华夏银行股份有限公司','中国民生银行股份有限公司','广发银行股份有限公司','平安银行股份有限公司','招商银行股份有限公司','兴业银行股份有限公司','中国邮政储蓄银行股份有限公司'],
        countIndex:0,
        account:'',
        cash:0
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
                        user:requestRes.data.data.user
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
                price:this.data.product.rebuy_price * e.detail.value
            }
        );
    },

    pay:function () {
        var account = this.data.account;
        if( !account )
        {
            util.mAlert('账号不能为空');
            return;
        }

        var cash = this.data.cash;
        if( cash <= 0 || cash > this.data.user.charge)
        {
            util.mAlert('请输入正确的提现金额');
            return;
        }

        var type = this.data.countIndex?2:1;

        wx.navigateTo(
            {
                url:'/pages/mine/withdrawconfirm?cash=' + cash + '&account=' + account + '&type=' + type
            }
        );
    },

    bindCountChange:function(e)
    {
        this.setData(
            {countIndex:e.detail.value}
        )
    },

    bindAccountInput:function(e)
    {
        this.setData(
            {account:e.detail.value}
        )
    },

    bindCashInput:function(e)
    {
        this.setData(
            {cash:e.detail.value}
        )
    }
})
