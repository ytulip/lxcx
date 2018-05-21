//index.js
var util = require('../../utils/util.js')

Page({
    data: {
        openid:'',
        productAttr:{},
        userList:[],
        showList:[],
        showSearch:false,
        immediatePhone:''
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
        });

        wx.request(
            {
                url:util.serverHost + 'activity/user-list' ,
                success:function(requestRes)
                {
                    console.log(requestRes);
                    // requestRes.data

                    that.setData(
                        {
                            userList:requestRes.data.data
                        }
                    );
                }
            }
        );
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

    searchUser:function(e)
    {
        // console.log(e.detail.value);
        var searchVal = e.detail.value;
        if(!e.detail.value)
        {
            this.setData(
                {
                    showList:[]
                }
            );
          return;
        }


        var userListLength = this.data.userList.length;
        var showList = [];

        console.log(userListLength);

        for(var i=0 ; i < userListLength ; i++)
        {
            var obj = this.data.userList[i];
            var showFlag = false;

            if ( obj.phone === null || obj.phone.indexOf(searchVal) != 0 )
            {

            } else {
                showFlag = true;
            }


            if ( obj.real_name === null || obj.real_name.indexOf(searchVal) != 0 )
            {

            } else {
                showFlag = true;
            }

            if ( obj.id_card === null || obj.id_card.indexOf(searchVal) != 0 )
            {

            } else {
                showFlag = true;
            }

            if( ! showFlag )
            {
                continue;
            }

            showList.push(obj);
        }

        console.log(showList);

        this.setData(
            {
                showList:showList
            }
        );
    },


    chooseUser:function(e)
    {
        var phone = e.currentTarget.dataset.phone;
        // console.log(phone);
        this.setData(
            {
                showSearch:false,
                immediatePhone:phone
            }
        );
    },

    doSearchUser:function(e)
    {
        this.setData(
            {
                showSearch:true,
                showList:[]
            }
        );
    },

    closeLayer:function()
    {
        this.setData(
            {
                showSearch:false
            }
        );
    }



})
