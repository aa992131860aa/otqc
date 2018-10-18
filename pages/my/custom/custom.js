//index.js
//获取应用实例
const app = getApp()

Page({
  
  data: {
    name: '',
    wechatUrl:"" 
  
  },
 
  onShow:function(){
    var that = this;
    console.log("gggg");
    that.setData({
      name: app.globalData.trueName,
      wechatUrl:app.globalData.wechatUrl
    })
    
  }
  ,
  onLoad: function() {
    var that = this;
    // wx.request({
    //   url: 'http://www.lifeperfusor.com/transbox/user.do',
    //   data: {
    //     action: 'phone',
    //     phone: '18398850872'
    //   },

    //   success: function(res) {
    //     console.log(res.data)
    //     that.setData({name:res.data.obj.true_name})
         
    //   },
    //   fail: function(res) {

    //   }
    // });


  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '057186792723',
      
    })
  }
})