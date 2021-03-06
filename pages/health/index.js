//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
      tall:'',
      blood_press:'',
      weight:'',
      waistline:'',
      blood_glucose:'',
      openid:'',
      imgPath1:"/images/add_pic.png",
      imgPath2:"/images/add_pic.png",
      imgPath1Save:'',
      imgPath2Save:'',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {

        var that = this;
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.serverHost + 'passport/openid',
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

    bindTallInput:function(e){
        this.setData({
            tall: e.detail.value
        })
    },
    bindBloodPressInput:function(e){
        this.setData({
            blood_press: e.detail.value
        })
    },
    bindWeightInput:function(e){
        this.setData({
            weight: e.detail.value
        })
    },
    bindWaistlineInput:function(e){
        this.setData({
            waistline: e.detail.value
        })
    },
    bindBloodGlucoseInput:function(e){
        this.setData({
            blood_glucose: e.detail.value
        })
    },

    nextStep : function(){

        var requestData = {step:1,data:{tall:this.data.tall,blood_press:this.data.blood_press,weight:this.data.weight,waistline:this.data.waistline,blood_glucose:this.data.blood_glucose},tall:this.data.tall,blood_press:this.data.blood_press,weight:this.data.weight,waistline:this.data.waistline,blood_glucose:this.data.blood_glucose,cover_image:this.data.imgPath1Save,oppo_image:this.data.imgPath2Save};

        if(!requestData.data.tall)
        {
            util.mAlert('请输入身高');
            return;
        }

        // if(!requestData.data.blood_press)
        // {
        //     util.mAlert('请输入血压');
        //     return;
        // }

        if(!requestData.data.weight)
        {
            util.mAlert('请输入体重');
            return;
        }

        if( !requestData.cover_image )
        {
            util.mAlert('请上传正面照');
            return;
        }

        if( !requestData.oppo_image )
        {
            util.mAlert('请上传侧面照');
            return;
        }

        // if(!requestData.data.waistline)
        // {
        //     util.mAlert('请输入腰围');
        //     return;
        // }


        wx.request({
            url: util.serverHost + 'activity/save-health?openid=' + this.data.openid,
            method:'post',
            data:requestData,
            success:function(res)
            {
                console.log(res);
                if( res.data.status)
                {
                    wx.navigateTo(
                        {
                            url: '/pages/health/index2'
                        }
                    );
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

                        }
                    }
                });
            }
        })
    },
})
