//index.js
//获取应用实例
const app = getApp()
var wxSortPickerView = require('../../../utils/wxSortPickerView.js');
var url = app.data.contact;
var mType;
var isAdd = false;
var teamListTemp = [];
var teamValue = [];
Page({

  data: {


  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(ops) {
    var that = this;
    mType = ops.type;
    if (mType == 'add') {
      isAdd = true;
      wx.setNavigationBarTitle({
        title: '增加成员'
      })
    }
    if (mType == 'minus') {
      isAdd = true;
      wx.setNavigationBarTitle({
        title: '减少成员'
      })
    }

    var phone = wx.getStorageSync("phone");
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: url,
      data: {
        action: "getContactList",
        phone: phone
      },
      success: function(res) {
        //console.log(res);
        if (res.data.result == 0) {
          //添加自己的信息
          res.data.obj.push({
            contactPhone: wx.getStorageSync("phone"),
            hospitalName: wx.getStorageSync("hospitalName"),
            isUploadPhoto: '0',
            roleId: wx.getStorageSync("roleId"),
            trueName: wx.getStorageSync("trueName"),
            wechatUrl: wx.getStorageSync("wechatUrl")
          })
          teamListTemp = res.data.obj;
          //增加
          if (mType == 'add') {
            that.dealAdd();
          }

          if (mType == 'minus') {
            teamListTemp = app.data.teamList;
          }

          //初始化
          wxSortPickerView.init(teamListTemp, that, isAdd);
        }
        wx.hideLoading();

      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
        })
      }
    })


  },
  onUnload: function() {
    console.log('come over')
    if (mType == 'add') {
      this.deal();
    }

    if (mType == 'minus') {
      this.dealMinus();
    }
  },
  // clickPerson: function(e) {
  //   wx.showToast({
  //     title: 'bb',
  //   })
  // },
  //处理🉑接受点击返回的文字
  wxSortPickerViewItemTap: function(e) {
    console.log(e)
    if (mType == undefined) {
      var trueName = e.target.dataset.text.trueName;
      var contactPhone = e.target.dataset.text.contactPhone;
      var hospitalName = e.target.dataset.text.hospitalName;
      var wechatUrl = e.target.dataset.text.wechatUrl;
      var roleId = e.target.dataset.text.roleId;





      wx.navigateTo({
        url: '../info/info?trueName=' + trueName + '&contactPhone=' + contactPhone + '&hospitalName=' + hospitalName + '&wechatUrl=' + wechatUrl + '&roleId=' + roleId,
      })
    }
    if (mType == 'transferName') {
      wx.setStorageSync("transferName", e.currentTarget.dataset.text.trueName)
      wx.setStorageSync("transferPhone", e.currentTarget.dataset.text.contactPhone)
      wx.setStorageSync("transferUrl", e.currentTarget.dataset.text.wechatUrl)
      wx.navigateBack({

      })
    } else if (mType == 'contactName') {
      wx.setStorageSync("contactName", e.currentTarget.dataset.text.trueName)
      wx.setStorageSync("contactPhone", e.currentTarget.dataset.text.contactPhone)
      wx.setStorageSync("contactUrl", e.currentTarget.dataset.text.wechatUrl)
      wx.navigateBack({

      })
    } else if (mType == 'opoContactName') {
      wx.setStorageSync("opoContactName", e.currentTarget.dataset.text.trueName)
      wx.setStorageSync("opoContactPhone", e.currentTarget.dataset.text.contactPhone)
      wx.setStorageSync("opoContactUrl", e.currentTarget.dataset.text.wechatUrl)
      wx.navigateBack({

      })
    }
  },
  checkboxChange: function(e) {


    teamValue = e.detail.value;
    //console.log(teamValue)

  },
  deal: function() {
    //app.data.teamList = [];
    for (var i = 0; i < teamListTemp.length; i++) {
      if (teamValue.indexOf(teamListTemp[i].contactPhone) != -1) {
        app.data.teamList.push(teamListTemp[i])
      }
    }
    //console.log(app.data.teamList)
  },
  dealMinus: function() {
    //app.data.teamList = [];
    //console.log(teamValue)

    var len = app.data.teamList.length;
    for (var i = len - 1; i >= 0; i--) {
      if (teamValue.indexOf(app.data.teamList[i].contactPhone) != -1) {
        app.data.teamList.splice(i, 1)
        console.log(i)
      }

    }
    // app.data.teamList.splice(1, 1)
    // app.data.teamList.splice(0, 1)
  },
  dealAdd: function() {

    var transferPhone = wx.getStorageSync("transferPhone");


    var contactPhone = wx.getStorageSync("contactPhone");


    var opoContactPhone = wx.getStorageSync("opoContactPhone");

    var phone = wx.getStorageSync("phone");

    var tempPhone = transferPhone + contactPhone + opoContactPhone + phone;


    for (var i = 0; i < app.data.teamList.length; i++) {
      tempPhone += app.data.teamList[i].contactPhone;
    }


    for (var i = 0; i < teamListTemp.length; i++) {
      if (tempPhone.indexOf(teamListTemp[i].contactPhone) != -1) {
        teamListTemp.splice(i, 1);
      }
    }
  }
})