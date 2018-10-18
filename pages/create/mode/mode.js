//index.js
//获取应用实例
const app = getApp()

Page({
  
  data: {
 
  
  },
 
  onShow:function(){
    var that = this;
   
 
    
  }
  ,
  onLoad: function() {
    var that = this;
 

  },
  scan:function(){
    wx.scanCode({
      success:function(res){
        console.log(res.result)
        
        if (res.result.indexOf(':')!=-1){
          var scan = res.result.split(':')[1];
          wx.navigateTo({
            url: '../../create/first/first?scan='+scan
          })
        }else{
          wx.showToast({
            title: '二维码错误,请重新扫描',
            icon:'none'
          })
        }
       
        
      }
    })
  },
  handle:function(){
    wx.navigateTo({
      url: '../../create/first/first'
    })
  }
})