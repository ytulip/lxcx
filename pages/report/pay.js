//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        openid:'',
        productAttr:{}
    },


    onLoad:function(options)
    {
        var openid = util.auth.getOpenid();
        var that = this;
        this.setData(
            {
                openid:openid
            }
        );

        wx.request({
            url: util.serverHost + 'activity/report-info' ,
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        productAttr:requestRes.data.data.product_attr
                    }
                );
            }
        })
    },


    bindPhoneInput: function(e){
        this.setData({
            immediatePhone: e.detail.value
        })
    },

    pay:function () {
        var requestData = {};
        requestData.phone = this.data.immediatePhone;
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
                                    url:'/pages/report/success'
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
