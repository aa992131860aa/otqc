//index.js
//获取应用实例
const app = getApp()
var url = app.data.me;
var content;
var phone = wx.getStorageSync("phone");
Page({

  data: {
    name: '',
    wechatUrl: ""

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
  feedbackContent: function(e) {
    content = e.detail.value
  },
  feedback: function() {
    console.log('content:' + content)
    if (content) {
      wx.request({
        url: url,
        data: {
          action: 'feedback',
          phone: phone,
          content:content
        },

        success: function(res) {
          console.log(res.data)
          wx.navigateBack({
            
          })
          wx.showToast({
            title: '反馈成功',
          })
        },
        fail: function(res) {

        }
      });
    } else {
      wx.showToast({
        title: '请填写反馈内容',
        icon:'none'
      })
    }
  }
})