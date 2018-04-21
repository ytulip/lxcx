//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        array:['送货上门','自提'],
        selfGetArray:[],
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        real_name:"",
        phone:"",
        smsCode:"",
        openid:"",
        index:0,
        selfGetIndex:0,
        price:0,
        address:"",
        addressList:'',
        immediatePhone:'',
        recommond_user:0
    },

    onLoad:function(options)
    {

        // wx.setStorage({
        //     key:"recommond_user",
        //     success:function()
        //     {
        //         recommond_user
        //     }
        // })

        var that = this;


        var recommondUser = wx.getStorageSync("recommond_user");

        this.setData(
            {openid:options.openid,recommond_user:recommondUser}
        );
        wx.request({
            url: util.serverHost + 'activity/pay-info?openid=' + this.data.openid ,
            data:{recommond_user:this.data.recommond_user},
            success:function(requestRes)
            {
                console.log(requestRes);
                // requestRes.data

                that.setData(
                    {
                        selfGetArray:requestRes.data.data.addresses,
                        price:requestRes.data.data.price,
                        real_name:requestRes.data.data.real_name,
                        phone:requestRes.data.data.phone,
                        addressList:requestRes.data.data.addressList,
                        immediatePhone:requestRes.data.data.recommondPhone,
                        recommondPhone:requestRes.data.data.recommondPhone
                    }
                );
            }
        })
    },

    pay:function () {
        var requestData = {};
        requestData.phone = this.data.immediatePhone;
        requestData.deliver_type = this.data.index?1:2;

        if(requestData.deliver_type == 2) { //送货上门
            requestData.address = this.data.address;
            requestData.address_name = this.data.real_name;
            requestData.address_phone = this.data.phone;
        } else
        { //自提
            requestData.address = this.data.addressList[this.data.selfGetIndex].ITEMNAME;
            requestData.address_name = this.data.addressList[this.data.selfGetIndex].address_name;
            requestData.address_phone = this.data.addressList[this.data.selfGetIndex].mobile;
        }
        wx.request({
            url: util.serverHost + 'activity/activity-pay?openid=' + this.data.openid,
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
                                    url:'/pages/health/route'
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
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },

    bindSelfPickerChange: function(e) {
        this.setData({
            selfGetIndex: e.detail.value
        })
    },

    bindAddressInput: function (e) {
        this.setData({
            address: e.detail.value
        })
    },

    bindPhoneInput: function(e){
        this.setData({
            immediatePhone: e.detail.value
        })
    }
})
