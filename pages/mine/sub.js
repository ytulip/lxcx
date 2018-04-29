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
        openid:'',
        signList:[],
        userList:[]
    },
    onLoad: function(options) {

        var openid = util.auth.getOpenid();
        console.log(openid);
        var that = this;


        wx.request({
            url: util.serverHost + '/activity/sub-user-list',
            data: {
                openid: openid
            },
            success:function(requestRes)
            {
                // console.log(requestRes.data.user);
                // requestRes.data
                that.setData(
                    {
                        userList:requestRes.data.data.list
                        // openid:requestRes.data.data.openid,
                        // userInfo:requestRes.data.data.user,
                        // signList:requestRes.data.data.signRecord
                    }
                );
            }
        })


        // Do some initialize when page load.
        // wx.request({
        //     url: util.serverHost + 'activity/take-part-in',
        //     method:'post',
        //     data: {},
        //     success: function(res){
        //         // console.log(res);
        //
        //         console.log(res.data);
        //         if( res.data.status )
        //         {
        //
        //         } else
        //         {
        //             wx.showToast({
        //                 title:res.data.desc,
        //                 icon:"none",
        //                 duration:3000
        //             });
        //         }
        //     }
        // });
    }
})
