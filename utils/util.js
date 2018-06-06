const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var serverHost = 'https://test.lamushan.com/';
var imageHost = 'https://test.lamushan.com';
var mAlert = function(msg)
{
    wx.showToast({
        title: msg,
        icon: "none",
        duration: 3000
    });
}


function User(){
    this.isLogin = '123243432432432';
}

User.prototype.vaildUser = function()
{
    this.isLogin = false;
    // this.openid = '';
    //是否是有效用户
}


User.prototype.authCheck = function()
{
    var openid = wx.getStorageSync("user_openid");
    if( openid )
    {

    } else
    {

    }
}

User.prototype.clearAuth = function()
{

}

User.prototype.getOpenid = function()
{
    var openid = wx.getStorageSync("user_openid");
    if( openid )
    {
        return openid;
    }

    //去获取openid
    wx.redirectTo({
        url: '/pages/mine/openid?redirectUrl=' + encodeURIComponent('/pages/mine/index')
    })

}

User.prototype.tryAuth = function()
{
    var userToken = wx.getStorageSync("user_token");
    if( userToken )
    {
        return userToken;
    }
    wx.redirectTo(
        {
            url:'/pages/mine/bind'
        }
    );
    return false;
}

User.prototype.setUserData = function(date)
{
    wx.setStorageSync('user_openid', 3);
    this.isLogin = true;
}

User.prototype.setOpenid = function($openid)
{
    wx.setStorageSync('user_openid', $openid);
}

User.prototype.getOpenid = function()
{
    return wx.getStorageSync('user_openid');
}

User.prototype.setUserToken = function($token)
{
    wx.setStorageSync('user_token', $token);
}

User.prototype.getUserToken = function()
{
    return wx.getStorageSync("user_token");;
}

User.prototype.getTokenOrBind = function()
{

    var userToken = wx.getStorageSync("user_token");
    if ( userToken )
    {
        return userToken;
    }

    wx.redirectTo(
        {
            url:'/pages/mine/bind'
        }
    );


    //首先openid在进来的时候就已经获得了
    var openid = this.getOpenid();

}

User.prototype.tryGetUserInfo = function()
{
    var userInfo = wx.getStorageSync("user_info");
    if( userInfo )
    {
        this.isLogin = true;
        return;
    }

    var that = this;

    wx.login({
        success: function(res) {
            if (res.code) {
                //发起网络请求
                wx.request({
                    url: util.serverHost + 'activity/user-info',
                    data: {
                        code: res.code
                    },
                    success:function(requestRes)
                    {
                        // console.log(requestRes.data.user);
                        // requestRes.data
                        // that.setData(
                        //     {
                        //         openid:requestRes.data.data.openid,
                        //         userInfo:requestRes.data.data.user,
                        //         signScore:requestRes.data.data.signScore
                        //     }
                        // );
                        // that.openid
                        if ( requestRes.data.data.user ) {
                            that.setUserData(requestRes.data.data.user);
                        }
                    }
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    });
}


User.prototype.isLogin = function()
{
    var userInfo = wx.getStorageSync("user_openid");
}

function Kit(){

}

Kit.prototype.goHome = function()
{
    wx.switchTab({
        url: '/pages/index/home',
        success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
        }
    })
}



var auth = new User();
var kit = new Kit();


module.exports = {
  formatTime: formatTime,
    serverHost:serverHost,
    imageHost:imageHost,
    mAlert:mAlert,
    auth:auth,
    kit:kit
}
