//index.js
//获取应用实例
var util = require('../../utils/util.js')
var cityData = require('../../utils/city_data')
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        total:0,
        thisMonth:0,
        array:['邮寄','自提'],
        index:0,
        selfGetArray:[],
        selfGetIndex:0,
        openid:'',
        allSelected:1,
        numberSelected:0,
        allImagePath:'/images/checkbox.png',
        numberImagePath:'/images/checkbox2.png',
        quantity:0,
        layerShow:false,
        year:0,
        month:0,
        day:0,
        chooseValue:[0,0,0],
        chooseText:''
    },

    bindQuantityChange:function(e)
    {
        this.setData({
            quantity:e.detail.value
        });
    },

    onLoad: function(options) {
        var openid = util.auth.getOpenid();
        this.setData(
            {
                openid:openid,
                years:cityData.cityData.provinces,
                months:cityData.cityData.cityList(0),
                days:cityData.cityData.townList(0,0),
                isActivity:options.activity?1:0
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
                        thisMonth:requestRes.data.data.currentMonth,
                        userInfo:requestRes.data.data.user
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
        // requestData.quantityCount = (this.data.quantityIndex == '0')?1:2;
        requestData.get_type = this.data.isActivity?3:2;
        requestData.self_get_need_scan = 1;
        // requestData.quantity =
        // console.log(requestData.deliver_type);

        if( this.data.allSelected )
        {
            requestData.quantityCount = -1;
        } else {
            requestData.quantityCount = this.data.quantity;
        }

        if(requestData.deliver_type == 2) { //邮寄
            requestData.address = this.data.chooseText + this.data.address;
            requestData.address_name = this.data.real_name;
            requestData.address_phone = this.data.phone;
        } else
        { //自提
            requestData.address = this.data.addressList[this.data.selfGetIndex].ITEMNAME;
            requestData.address_name = this.data.addressList[this.data.selfGetIndex].address_name;
            requestData.address_phone = this.data.addressList[this.data.selfGetIndex].mobile;
        }
        wx.request({
            url: util.serverHost + 'activity/try-get-re-good?openid=' + this.data.openid,
            method:'get',
            data:requestData,
            success:function(res)
            {
                console.log(res);
                if( res.data.status)
                {
                    if ( requestData.deliver_type == 1)
                    {
                        wx.redirectTo(
                            {
                                url:'/pages/report/confirm?id=' + res.data.data
                            }
                        );
                    } else
                    {
                        wx.redirectTo(
                            {
                                url:'/pages/report/getgoodsuccess'
                            }
                        );
                    }
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

    numberChange:function(e)
    {
        console.log(e.currentTarget.dataset.index);
        if( e.currentTarget.dataset.index == 1)
        {
            if( !this.data.allSelected)
            {
                this.setData(
                    {
                        allSelected:1,
                        numberSelected:0,
                        allImagePath:'/images/checkbox.png',
                        numberImagePath:'/images/checkbox2.png'
                    }
                )
            }
        } else
        {
            console.log(this.data.numberSelected);
            if( !this.data.numberSelected)
            {
                console.log(this.data.allSelected);
                this.setData(
                    {
                        allSelected:0,
                        numberSelected:1,
                        allImagePath:'/images/checkbox2.png',
                        numberImagePath:'/images/checkbox.png'
                    }
                )
            }
        }
    },

    pctSwitch:function()
    {
        console.log(3);
        this.setData(
            {
                layerShow:true,
                months:cityData.cityData.cityList(this.data.chooseValue[0]),
                days:cityData.cityData.townList(this.data.chooseValue[0],this.data.chooseValue[1]),
                value:this.data.chooseValue
            }
        );
    },

    bindChange: function(e) {
        const val = e.detail.value;

        console.log(this.data.year);
        console.log(this.data.month);
        console.log(val);

        if( this.data.year != val[0])
        {
            //省份更改
            this.setData(
                {
                    year:val[0],
                    months:cityData.cityData.cityList(val[0]),
                    month:0,
                    days:cityData.cityData.townList(val[0],0),
                    day:0,
                    value:[val[0],0,0]
                }
            );
            return;
        }


        if( this.data.month != val[1] )
        {
            //市级更改
            this.setData(
                {
                    month:val[1],
                    days:cityData.cityData.townList(val[0],val[1]),
                    day:0,
                    value:[val[0],val[1],0]
                }
            );

            return;
        }

        console.log(7);

        this.setData({
                value: [val[0], val[1], val[2]]
            }
        );

        // console.log(e.detail.value);
        //
        // this.setData({
        //     year: this.data.years[val[0]],
        //     month: this.data.months[val[1]],
        //     day: this.data.days[val[2]]
        // })
    },

    cancelPCT:function(e){
        this.setData(
            {
                layerShow:false
            }
        );
    },

    choosePCT:function(e)
    {
        this.setData(
            {
                chooseText:this.data.years[this.data.value[0]] + this.data.months[this.data.value[1]] + this.data.days[this.data.value[2]],
                chooseValue:this.data.value,
                layerShow:false
            }
        );
    }

})
