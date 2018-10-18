//index.js
//获取应用实例
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var user = app.data.user;
var locationName;
var mType;
Page({
  data: {
    current_id: 0,
    realHeight: wx.getStorageSync("realHeight"),
    hospital: [],
    detail: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function(ops) {
    var that = this;

    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'CKLBZ-PVAWW-QUIRO-RNCV2-WPIJ3-YVF5X' // 必填
    });
    wx.showLoading({
      title: '加载中',
    });
    mType = ops.type;

    //获取定位信息
    that.loadLocation();

    // 获取系统信息
    wx.getSystemInfo({

      success: function(res) {




        var realHeight = (res.windowHeight * (750 / res.windowWidth));

        that.setData({
          realHeight: realHeight
        })

      }
    });



  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //获取定位信息
  loadLocation: function() {
    var that = this;

    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(qqmapsdk);
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.address_component.province;
            locationName = address;
            that.loadProvince();

          },
          fail: function(res) {

            that.loadProvince();
          },
        });

      },
      fail: function(res) {

        that.loadProvince();
      }
    });
  },
  //获取省份
  loadProvince: function() {
    var that = this;
    wx.request({
      url: user,
      data: {
        action: "hospital"
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res.data.obj);
        var temp = [];
        if (locationName) {
          temp.push(locationName + '(GPS)');
        }
        var temp2 = res.data.obj;
        for (var i = 0; i < temp2.length; i++) {
          temp.push(temp2[i])
        }
        var size = temp.length;
        that.setData({
          hospital: temp,
        });

        that.loadHispital(temp[0]);

      },
      fail(res) {
        wx.hideLoading();
      }
    })
  },

  //获取医院
  loadHispital: function(param) {
    var that = this;
    console.log(user+param)
    wx.request({
      url: user,
      data: {
        action: "hospital",
        province: param
      },
      success: function(res) {
        console.log("医院")
        console.log(res)
        wx.hideLoading();
        that.setData({
          detail: res.data.obj,
        });
      },
      fail(res) {
        wx.hideLoading();
      }
    })
  },

  //点击省份选择医院 
  click_hospital: function(e) {

    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    this.setData({
      current_id: id
    })
    wx.showLoading({
      title: '加载中',
    })
    this.loadHispital(name);
  },
  //选择医院
  selectHospital: function(e) {
    var name = e.currentTarget.dataset.name;
    console.log('name:' + name)
    if (mType == 'create') {
      wx.setStorageSync("selectHospital", name);
    } else {
      wx.setStorageSync("selectHospital", name);
      wx.setStorageSync("hospitalName", name);
    }

    wx.navigateBack({})
  }
})