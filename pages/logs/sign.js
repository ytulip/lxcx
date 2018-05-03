//logs.js
const util = require('../../utils/util.js')

Page({
    data: {
        logs: [],
        showConfirm:0,
        showWait:0,
        showSignBtn:0,
        openid:'',
        showFillHealthInfo:0,
        showFillHealthStatus:0,
        signTypeArray:['随餐','代餐','换食'],
        signTypeIndex:0,
        countArray:[1,2,3,4,5],
        countIndex:0,
        imgPath1:"/images/add_pic.png",
        imgPath1Save:"",
        imgPath2:"/images/add_pic.png",
        imgPath2Save:"",
        imgPath3:"/images/add_pic.png",
        hasPay:0,
        imgPath3Save:"",
        water:"",
        weight:"",
        baseInfo:"",
        wcCount:""
    },
    onLoad: function () {
        var that = this;

        this.setData(
            {
                showConfirm:0
            }
        );

        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'activity/sign-info',
                        data: {
                            code: res.code
                        },
                        success: function (requestRes) {
                            console.log(requestRes);

                            //这里有路由，三种状态①停留在当页；②跳转到支付页面；③跳转到健康打卡页面
                            if ( requestRes.data.data.user )
                            {


                                that.setData(
                                    {
                                        showSignBtn:requestRes.data.data.needSignToday,
                                        openid:requestRes.data.data.openid,
                                        showFillHealthInfo:requestRes.data.data.user.health_status
                                    }
                                );

                                //用户存在
                                var currentUser = requestRes.data.data.user;
                                if ( requestRes.data.data.user.activity_pay )
                                {
                                    var currentOrder = requestRes.data.data.order;

                                    that.setData(
                                        {
                                            hasPay:1,
                                            showFillHealthStatus:requestRes.data.data.user.health_status
                                        }
                                    );
                                }
                            }
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },
    //执行打卡
    doSign:function()
    {



        if( !this.data.imgPath1Save &&  !this.data.imgPath2Save && !this.data.imgPath3Save )
        {
            util.mAlert('至少上次一张图片');
            return;
        }

        if(!this.data.wcCount)
        {
            util.mAlert('排便次数不能为空');
            return;
        }

        if(!this.data.baseInfo)
        {
            util.mAlert('食用感受不能为空');
            return;
        }

        if(!this.data.water)
        {
            util.mAlert('喝水量不能为空');
            return;
        }

        if(!this.data.weight)
        {
            util.mAlert('体重不能为空');
            return;
        }



        wx.request({
            url: util.serverHost + 'activity/do-sign',
            data: {
                openid: this.data.openid,
                signTypeIndex:this.data.signTypeIndex,
                countIndex:this.data.countIndex,
                imgPath1Save:this.data.imgPath1Save,
                imgPath2Save:this.data.imgPath2Save,
                imgPath3Save:this.data.imgPath3Save,
                water:this.data.water,
                weight:this.data.weight,
                baseInfo:this.data.baseInfo,
                wcCount:this.data.wcCount
            },
            success: function (requestRes) {

                console.log(requestRes);
                if(requestRes.data.status)
                {
                    // console.log(requestRes.data.status);
                    // var page = getCurrentPages().pop();
                    // page.onLoad();
                    wx.switchTab({
                        url: '/pages/logs/logs',
                        success: function (e) {
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad();
                        }
                    });
                } else
                {
                    util.mAlert(requestRes.data.desc);
                }
            }
        })
    },

    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            signTypeIndex: e.detail.value
        })
    },

    bindCountChange:function(e)
    {
      this.setData(
          {countIndex:e.detail.value}
      )
    },

    uploadImage:function(e)
    {
        // console.log('上传图片');
        var type = e.currentTarget.dataset.id;
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                // console.log(res);
                // var tempFilePaths = res.tempFilePaths


                //上传图片到服务器
                var tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths);
                wx.uploadFile({
                    url: util.serverHost  + 'activity/upload-image', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData:{
                        'user': 'test'
                    },
                    success: function(res){
                        var data = JSON.parse(res.data);
                        console.log(data);
                        if( type == 1)
                        {
                            that.setData(
                                {imgPath1:util.serverHost + data.data[0],imgPath1Save:data.data[0]}
                            );
                        } else if(type==2){
                            that.setData(
                                {imgPath2:util.serverHost + data.data[0],imgPath2Save:data.data[0]}
                            );

                        } else if(type == 3)
                        {
                            that.setData({
                                imgPath3:util.serverHost + data.data[0],
                                imgPath3Save:data.data[0]
                            });
                        }
                        //do something
                    }
                });
            }
        })
    },

    bindWcCountInput:function(e)
    {
        this.setData({
            wcCount: e.detail.value
        })
    },

    bindWaterInput:function(e)
    {
        this.setData({
            water: e.detail.value
        })
    },

    bindWeightInput:function(e)
    {
        this.setData({
            weight: e.detail.value
        })
    },

    bindBaseInfoInput:function(e)
    {
        this.setData({
            baseInfo: e.detail.value
        })
    },


})
