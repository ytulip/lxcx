//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        total:0,
        thisMonth:0,
        quantityArr:[1,2],
        quantityIndex:0,
        array:['送货上门','自提'],
        index:0,
        selfGetArray:[],
        selfGetIndex:0,
        openid:'',

    },
    onLoad: function(options) {
        var openid = util.auth.getOpenid();
        this.setData(
            {
                openid:openid
            }
        );
        var that = this;
        wx.request({
            url: util.serverHost + 'activity/get-good-info?openid=' + this.data.openid ,
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
                        recommondPhone:requestRes.data.data.recommondPhone,
                        total:requestRes.data.data.total,
                        thisMonth:requestRes.data.data.currentMonth
                    }
                );
            }
        })
    },

    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            quantityIndex: e.detail.value
        })
    },

    bindPickerChange2: function(e) {
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

    pay:function () {
        var requestData = {};
        console.log(this.data.index);
        requestData.deliver_type = (this.data.index == '0')?2:1;
        requestData.quantityCount = (this.data.quantityIndex == '0')?1:2;
        console.log(requestData.deliver_type);

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
            url: util.serverHost + 'activity/try-get-good?openid=' + this.data.openid,
            method:'get',
            data:requestData,
            success:function(res)
            {
                console.log(res);
                if( res.data.status)
                {

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
