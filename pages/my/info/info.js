//index.js
//获取应用实例
const app = getApp()

Page({

  data: {

    wechatUrl: '',
    trueName: '',
    phone: '',
    hospitalName: '',
    roleName: '',
  },

  onShow: function() {
    var that = this;
    console.log("gggg");
    that.setData({
      name: app.globalData.trueName,
      wechatUrl: app.globalData.wechatUrl
    })

  },
  onLoad: function() {
    var that = this;
    that.setData({
      wechatUrl: wx.getStorageSync("wechatUrl"),
      trueName: wx.getStorageSync("trueName"),
      phone: wx.getStorageSync("phone"),
      hospitalName: wx.getStorageSync("hospitalName"),
      roleName: wx.getStorageSync("roleName"),

    })


  }
})