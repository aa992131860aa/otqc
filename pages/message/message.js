//index.js
//获取应用实例
const app = getApp()
// var wxSortPickerView = require('../../utils/wxSortPickerView.js');
Page({

  data: {

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var that = this;

  },
  skipContact: function() {
    wx.navigateTo({
      url: '../contact/contact/contact',
    })
  },
  skipTransfer: function() {
   wx.navigateTo({
     url: '../contact/transfer/transfer',
   })
  },
  addClick:function(){
     
    wx.navigateTo({

      url: '../contact/add/add'
    })
  }


})