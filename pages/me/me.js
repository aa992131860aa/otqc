//index.js
//获取应用实例
const app = getApp()
var phone16;
Page({
  
  data: {
    name: '',
    wechatUrl:"" ,
    otqcPhone:'',
  
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
    var phone = parseInt(wx.getStorageSync("phone"));
      
    var otqcPhone = 'otqc-' + phone.toString(16);
    phone16 = otqcPhone;
    that.setData({
      otqcPhone:otqcPhone
    })
     
  },
   btn_otqc:function(){
     wx.setClipboardData({
       data: phone16,
       success:function(e){
         wx.showToast({
           title: '已复制成功，请到公众号  微澜研发内控中心  绑定',
           icon:'none'
         })
       }
     })
   },
  stringToHex: function(str){
    　　　　var val = "";
    　　　　for(var i = 0; i<str.length; i++){
  　　　　　　if (val == "")
    　　　　　　　　val = str.charCodeAt(i).toString(16);
  　　　　　　else
    　　　　　　　　val += "," + str.charCodeAt(i).toString(16);
　　　　}
　　　　return val;
　　}
})