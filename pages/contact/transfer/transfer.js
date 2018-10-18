//index.js
//获取应用实例
const app = getApp()

var url = app.data.rong;
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
  //上拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    page = 0;
    this.loadMore(this);

  },
  //加载更多
  onReachBottom: function() {
    wx.hideLoading();
    page++;
    this.loadMore(this);

  },
  loadMore: function(that) {


    wx.request({
      url: url,
      data: {
        action: 'getGroupList',
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
            tempArray[i].date = tempArray[i].createTime.split(" ")[0];
            if (tempArray[i].groupName.indexOf('肝') != -1) {
              tempArray[i].url = 'msg_1index_team2';
            } else if (tempArray[i].groupName.indexOf('肾') != -1) {
              tempArray[i].url = 'msg_1index_team4';
            } else if (tempArray[i].groupName.indexOf('心') != -1) {
              tempArray[i].url = 'msg_1index_team1';
            } else if (tempArray[i].groupName.indexOf('肺') != -1) {
              tempArray[i].url = 'msg_1index_team3';
            } else if (tempArray[i].groupName.indexOf('胰') != -1) {
              tempArray[i].url = 'msg_1index_team5';
            } else if (tempArray[i].groupName.indexOf('眼') != -1) {
              tempArray[i].url = 'msg_1index_team6';
            }
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