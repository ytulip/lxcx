//index.js
//获取应用实例
var util = require('../../utils/util.js')
const app = getApp()

Page({
    onLoad: function(options) {
        util.auth.tryAuth();
    },
})
