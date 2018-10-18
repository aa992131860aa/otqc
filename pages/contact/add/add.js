//index.js
//获取应用实例
const app = getApp()
var that;
var contact = app.data.contact;
var push = app.data.push;
var phone;
var name;

Page({

  data: {

    list: []
  },

  onShow: function() {
    that = this;


  },
  onLoad: function() {
    that = this;
    phone = wx.getStorageSync("phone");


  },
  onUnload:function(){
   
  },
  serachInput: function(e) {

    name = e.detail.value;

    that.loadSearch(name)

  },
  loadSearch: function(name) {
    wx.request({
      url: contact,
      data: {
        action: 'search',
        phone: phone,
        name: name
      },
      success: function(res) {
        console.log(res)
        if (res.data.result == 0) {
          that.setData({
            list: res.data.obj
          })
        }
      }
    })
  },
  searchClick: function() {
    that.loadSearch(name);
  },
  addClick: function(e) {
    var targetPhone = e.currentTarget.dataset.targetPhone;
    var otherId = e.currentTarget.dataset.otherId;



    wx.request({
      url: push,
      data: {
        action: "add",
        phone: phone,
        content: wx.getStorageSync("trueName") + "请求添加好友",
        type: 'add',
        otherId: otherId,
        targetPhone: targetPhone,
        nature: 'wechat'

      },
      success: function(res) {
        if(res.data.result==0){
          wx.showToast({
            title: '已发送添加请求',
            icon:'none'
          })
        }
      }
    })
  }
})