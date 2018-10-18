//index.js
//获取应用实例
const app = getApp()
var url = app.data.user;
var phone = wx.getStorageSync("phone");
Page({

  data: {

    temperatureStatus: 0,
    openStatus: 0,
    collisionStatus: 0

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
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: url,
      data: {
        action: "gainSite",
        phone: phone
      },
      success: function(res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.result == 0) {
          that.setData({
            temperatureStatus: res.data.obj.temperatureStatus,
            openStatus: res.data.obj.openStatus,
            collisionStatus: res.data.obj.collisionStatus
          })
        } else {
          wx.showToast({
            title: '获取设置失败',
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '获取设置失败',
        })
      }
    })

  },
  tChange: function(e) {
    wx.showLoading({
      title: '设置中',
    })
    this.setSite("temperature", e.detail.value == true ? "0" : "1");
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  oChange: function(e) {
    wx.showLoading({
      title: '设置中',
    })
    this.setSite("open", e.detail.value == true ? "0" : "1");
  },
  cChange: function(e) {
    wx.showLoading({
      title: '设置中',
    })
    this.setSite("collision", e.detail.value == true ? "0" : "1");
  },
  setSite: function(type, status) {
    wx.request({
      url: url,
      data: {
        action: "setPushSite",
        phone: phone,
        type: type,
        status: status
      },
      success: function(res) {
        console.log(res);
        wx.hideLoading();
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  }
})