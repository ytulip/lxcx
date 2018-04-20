//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    data: {
        items1: [
            {name: '1', value: '1、不吃早餐'},
            {name: '2', value: '2、饭后松裤带'},
            {name: '3', value: '3、饭后即睡'},
            {name: '4', value: '4、饱食'},
            {name: '5', value: '5、空腹吃糖'},
            {name: '6', value: '6、吃太咸的食物'},
        ],
        items2: [
            {name: '1', value: '1、起床先叠被'},
            {name: '2', value: '2、伏案午睡'},
            {name: '3', value: '3、俯睡'},
            {name: '4', value: '4、睡前不洗脸'},
            {name: '5', value: '5、睡前不刷牙'},
            {name: '6', value: '6、睡懒觉'},
        ],
        items3: [
            {name: '1', value: '1、男士留胡子'},
            {name: '2', value: '2、跷二郎腿'},
            {name: '3', value: '3、眯眼看东西、揉擦眼睛'},
            {name: '4', value: '4、热水沐浴时间过长'},
            {name: '5', value: '5、赌博'}
        ],
        items4: [
            {name: '1', value: '1、生活过度紧张'},
            {name: '2', value: '2、感冒了害怕洗澡'},
            {name: '3', value: '3、觉得吃油腻食物会发胖'},
            {name: '4', value: '4、认为刮掉腋毛，就能减少流汗'},
            {name: '5', value: '5、流鼻血时要抬高下巴'},
            {name: '6', value: '6、为了牙齿不蛀应该多刷牙'},
            {name: '7', value: '7、饭后立即刷牙'},
            {name: '8', value: '8、强忍小便'},
        ],
        itemsArray1:[],
        itemsArray2:[],
        itemsArray3:[],
        itemsArray4:[]
    },

    onLoad:function()
    {
        var that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'activity/health-info',
                        data: {
                            code: res.code
                        },
                        success:function(requestRes)
                        {
                            console.log(requestRes);
                            // requestRes.data
                            that.setData(
                                {
                                    openid:requestRes.data.data.openid
                                }
                            );
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },

    checkboxChange1: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        this.setData(
            {itemsArray1:e.detail.value}
        );
    },

    checkboxChange2: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        this.setData(
            {itemsArray2:e.detail.value}
        );
    },

    checkboxChange3: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        this.setData(
            {itemsArray3:e.detail.value}
        );
    },

    checkboxChange4: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        this.setData(
            {itemsArray4:e.detail.value}
        );
    },

    submitBtn : function(){

        var requestData = {step:3,data:[this.data.itemsArray1,this.data.itemsArray2,this.data.itemsArray3,this.data.itemsArray4]};
        wx.request({
            url: util.serverHost + 'activity/save-health?openid=' + this.data.openid,
            method:'post',
            data:requestData,
            success:function(res)
            {
                console.log(res);
                if( res.data.status)
                {
                    wx.reLaunch(
                        {
                            url:"/pages/health/success"
                        }
                    );
                    // wx.switchTab({
                    //     url: '/pages/logs/logs',
                    //     success: function (e) {
                    //         var page = getCurrentPages().pop();
                    //         if (page == undefined || page == null) return;
                    //         page.onLoad();
                    //     }
                    // });
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
    }
})
