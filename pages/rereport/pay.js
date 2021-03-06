//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        openid:'',
        product:{},
        quantity:3,
        price:0
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
            url: util.serverHost + 'activity/report-info' ,
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        product:requestRes.data.data.product_attr,
                        price:requestRes.data.data.product_attr.rebuy_price * 3
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
        var requestData = {};
        requestData.buy_type = 2;
        requestData.quantity = this.data.quantity;
        wx.request({
            url: util.serverHost + 'activity/report-pay?openid=' + this.data.openid,
            method:'get',
            data:requestData,
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
                            util.mAlert('支付成功');
                            wx.redirectTo(
                                {
                                    url:'/pages/rereport/success'
                                }
                            );
                        },
                        'fail':function(res){
                            util.mAlert('支付失败，请重新支付');
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
})
