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
        imgPath1:"/images/add.png",
        imgPath2:"/images/add.png",
        imgPath1Save:'',
        imgPath2Save:'',
        healthInfo:{},
        showPage:0,
        items1: [
            {name: '1', value: '1、不吃早餐',text:'不吃早餐'},
            {name: '2', value: '2、饭后松裤带',text:'饭后松裤带'},
            {name: '3', value: '3、饭后即睡',text:'饭后即睡'},
            {name: '4', value: '4、饱食',text:'饱食'},
            {name: '5', value: '5、空腹吃糖',text:'空腹吃糖'},
            {name: '6', value: '6、吃太咸的食物',text:'吃太咸的食物'},
        ],
        items2: [
            {name: '1', value: '1、起床先叠被',text:'起床先叠被'},
            {name: '2', value: '2、伏案午睡',text:'伏案午睡'},
            {name: '3', value: '3、俯睡',text:'俯睡'},
            {name: '4', value: '4、睡前不洗脸',text:'睡前不洗脸'},
            {name: '5', value: '5、睡前不刷牙',text:'睡前不刷牙'},
            {name: '6', value: '6、睡懒觉',text:'睡懒觉'},
        ],
        items3: [
            {name: '1', value: '1、男士留胡子',text:'男士留胡子'},
            {name: '2', value: '2、跷二郎腿',text:'跷二郎腿'},
            {name: '3', value: '3、眯眼看东西、揉擦眼睛',text:'眯眼看东西、揉擦眼睛'},
            {name: '4', value: '4、热水沐浴时间过长',text:'热水沐浴时间过长'},
            {name: '5', value: '5、赌博',text:'赌博'}
        ],
        items4: [
            {name: '1', value: '1、生活过度紧张',text:'生活过度紧张'},
            {name: '2', value: '2、感冒了害怕洗澡',text:'感冒了害怕洗澡'},
            {name: '3', value: '3、觉得吃油腻食物会发胖',text:'觉得吃油腻食物会发胖'},
            {name: '4', value: '4、认为刮掉腋毛，就能减少流汗',text:'认为刮掉腋毛，就能减少流汗'},
            {name: '5', value: '5、流鼻血时要抬高下巴',text:'流鼻血时要抬高下巴'},
            {name: '6', value: '6、为了牙齿不蛀应该多刷牙',text:'为了牙齿不蛀应该多刷牙'},
            {name: '7', value: '7、饭后立即刷牙',text:'饭后立即刷牙'},
            {name: '8', value: '8、强忍小便',text:'强忍小便'},
        ]
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function(options) {
        var openid = util.auth.getOpenid();
        var that  = this;


        wx.request({
            url: util.serverHost + 'activity/user-info-new',
            data: {
                openid:openid
            },
            success:function(requestRes)
            {
                // console.log(requestRes.data.user);
                // requestRes.data

                if( !requestRes.data.data.user.health_status )
                {
                    wx.navigateTo(
                        {
                            url:'/pages/health/index'
                        }
                    );
                    return;
                }

                that.setData(
                    {
                        userInfo:requestRes.data.data.user,
                        healthInfo:JSON.parse(requestRes.data.data.user.health_info),
                        showPage:1
                    }
                );

                console.log(this.data.healthInfo);
            }
        })
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
