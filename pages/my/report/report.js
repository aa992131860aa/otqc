//index.js
//获取应用实例
const app = getApp()

var url = app.data.downloadPdf;
var page = 0;
var pageSize = 15;
var phone = wx.getStorageSync("phone");
Page({

  data: {
    noContent: false,
    list: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function() {
    var that = this;
    var phone = wx.getStorageSync("phone");
    wx.showLoading({
      title: '加载中',
    })
    this.loadMore(this);


  },
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    page = 0;
    this.loadMore(this);

  },
  onReachBottom: function() {
    wx.hideLoading();
    page++;
    this.loadMore(this);

  },
  look: function(e) {
    var u = e.currentTarget.dataset.url;
    console.log(u);

    wx.downloadFile({
      url: u,
      success: function(res) {
        wx.openDocument({
          filePath: res.tempFilePath
        })
      }
    })

  },
  loadMore: function(that) {


    wx.request({
      url: url,
      data: {
        action: 'pdfList',
        phone: phone,
        page: page,
        pageSize: pageSize
      },
      success: function(res) {
        console.log(res);
        if (res.data.result == 0) {

          var tempArray = that.data.list;
          if (page == 0) {


            // 停止下拉动作
            wx.stopPullDownRefresh();
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading()

            tempArray = [];

          }

          tempArray = tempArray.concat(res.data.obj);
          for (var i = 0; i < tempArray.length; i++) {
            tempArray[i].createTime = tempArray[i].createTime.split(" ")[0];

          }

          that.setData({
            list: tempArray
          })
          that.setData({
            noContent: false
          })

        } else {
          if (page != 0) {
            wx.showToast({
              title: '加载完毕'
            })
          } else {
            that.setData({
              noContent: true
            })
            wx.showToast({
              title: '暂无转运组'
            })
          }
        }
        wx.hideLoading();
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '暂无加载内容'
        })
      }

    })
  },
})