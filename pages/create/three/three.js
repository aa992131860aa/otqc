//index.js
//获取应用实例
const app = getApp()

// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

var that;
var organSeg;
var organ;
var boxNo;
var modifyOrganSeg;
var getTime;

var organNum;
var blood;
var bloodNum;
var sample;
var sampleNum;
var method = '救护车';
var fromCity = '';
var tempFromCity = '';

var startLong = "0.0";
var startLati = "0.0";
var endLong = "0.0";
var endLati = "0.0";
var hospitalName = '';
var no = '';

var weather = app.data.weather;
var user = app.data.user;
var toHosp;
var address = app.data.address;

var endLong;
var endLati;

var startLong;
var startLati;

var weather;
var temperature;
var modify;
Page({

  data: {
    method1: 'newtrs_table3_plane',
    method2: 'newtrs_table3_train',
    method3: 'newtrs_table3_car_on',
    method4: 'newtrs_table3_else',
    fromCity: '',
    toHospName: '',
    hospitalName: '',
    no: ''

  },

  onShow: function() {
    that = this;
    //医院名称
    hospitalName = wx.getStorageSync("selectHospital");
    that.setData({
      hospitalName: hospitalName
    })

  },
  onLoad: function(ops) {
    console.log(ops)
    that = this;
    //第一页数据
    organSeg = ops.organSeg;
    organ = ops.organ;
    boxNo = ops.boxNo;
    modifyOrganSeg = ops.modifyOrganSeg;
    getTime = ops.getTime;

    //第二页数据 
    organNum = ops.organNum;
    blood = ops.blood;
    bloodNum = ops.bloodNum;
    sample = ops.sample;
    sampleNum = ops.sampleNum;

    //第三页数据
    fromCity = ops.fromCity;
    method = ops.method;
    no = ops.no;
    that.methodChange();

    modify = ops.modify;
    that.setData({
      fromCity: fromCity,
      no: no
    })
    if (that.data.fromCity == '') {
      // 实例化腾讯地图API核心类
      qqmapsdk = new QQMapWX({
        key: 'CKLBZ-PVAWW-QUIRO-RNCV2-WPIJ3-YVF5X' // 必填
      });
      //定位
      that.loadLocation();
    }


    //获取天气 起始经纬度


  },
  selectHospital: function() {
    wx.navigateTo({
      url: '../../hospital/hospital?type=create',
    })
  },
  clickMethod: function(e) {
    var b = e.currentTarget.dataset.b;
    method = b;
    that.methodChange();

  },
  methodChange: function() {
    if (method == '飞机') {
      that.setData({
        method1: 'newtrs_table3_plane_on',
        method2: 'newtrs_table3_train',
        method3: 'newtrs_table3_car',
        method4: 'newtrs_table3_else',
      })
    } else if (method == '火车') {
      that.setData({
        method1: 'newtrs_table3_plane',
        method2: 'newtrs_table3_train_on',
        method3: 'newtrs_table3_car',
        method4: 'newtrs_table3_else',
      })
    } else if (method == '救护车') {
      that.setData({
        method1: 'newtrs_table3_plane',
        method2: 'newtrs_table3_train',
        method3: 'newtrs_table3_car_on',
        method4: 'newtrs_table3_else',
      })
    } else if (method == '其他') {
      that.setData({
        method1: 'newtrs_table3_plane',
        method2: 'newtrs_table3_train',
        method3: 'newtrs_table3_car',
        method4: 'newtrs_table3_else_on',
      })
    }
  },
  //获取定位信息
  loadLocation: function() {


    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        startLong = longitude;
        endLati = latitude;
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(addressRes) {
            fromCity = addressRes.result.address_component.city + addressRes.result.address_component.district;
            tempFromCity = fromCity;
            //locationName = address;district
            console.log(addressRes)
            that.setData({
              fromCity: fromCity
            })

          },
          fail: function(res) {


          },
        });

      },
      fail: function(res) {


      }
    });
  },
  clickPre: function() {
    let pages = getCurrentPages(); //当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    prevPage.setData({
      fromCity: that.data.fromCity,
      method: method,
      no: that.data.no
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  clickNext: function() {
    
    if (that.data.fromCity == '') {
      wx.showToast({
        title: '定位获取起始地,请稍等...',
        icon: 'none'
      })
    } else if (that.data.hospitalName == '') {
      wx.showToast({
        title: '请选择目的地医院',
        icon: 'none'
      })
    }  else {
      that.loadHospitalAddress();
      that.loadEndLocation(fromCity, 'start')

      wx.navigateTo({
        url: '../../create/four/four?organSeg=' + organSeg + '&organ=' + organ + '&modifyOrganSeg=' + modifyOrganSeg + '&boxNo=' + boxNo + '&getTime=' + getTime + '&organNum=' + organNum + '&blood=' + blood + '&bloodNum=' + bloodNum + '&sample=' + sample + '&sampleNum=' + sampleNum + '&fromCity=' + fromCity + '&method=' + method + '&no=' + no + '&modify=' + modify,
      })
    }

  },
  inputFromCity: function(e) {
    that.setData({
      fromCity: e.detail.value
    })
  },
  inputNo: function(e) {
    that.setData({
      no: e.detail.value
    })
  },
  loadWeather(a) {
    wx.request({
      url: weather,
      data: {
        action: 'weather',
        weatherArea: a
      },
      success(res) {
        console.log(res)
        weather = res.data.showapi_res_body.now.weather;
        temperature = res.data.showapi_res_body.now.temperature;
        wx.setStorageSync("weather", weather)
        wx.setStorageSync("temperature", temperature)
      }
    })
  },
  loadHospitalAddress: function() {
   
     
    wx.request({
      url: user,
      data: {
        action: 'getHospitalAddress',
        hospitalName: hospitalName
      },
      success(res) {
      
        if (res.data.result == 0) {
          toHosp = res.data.obj.address;
          // if (toHosp.indexOf('县' != -1)) {
          //   toHosp = toHosp.split('县')[0] + '县';
          // }
          // if (toHosp.indexOf('区' != -1)) {
          //   toHosp = toHosp.split('区')[0] + '区';
          // }
          toHosp = toHosp.split('市')[0] + '市';
          console.log('hospitalName:' + toHosp)
          wx.setStorageSync("toHosp", toHosp)
          that.loadEndLocation(toHosp, 'end');
          that.loadWeather(toHosp)
          console.log(toHosp)
        }
      }
    })
  },
  loadEndLocation: function(a, t) {
    wx.request({
      url: address + a,
      success: function(res) {
        var location = res.data.geocodes[0].location;
        if (t == 'start') {
          startLong = location.split(',')[0];
          startLati = location.split(',')[1];
          wx.setStorageSync("startLong", startLong)
          wx.setStorageSync("startLati", startLati)
        } else if (t == 'end') {
          endLong = location.split(',')[0];
          endLati = location.split(',')[1];
          wx.setStorageSync("endLong", endLong)
          wx.setStorageSync("endLati", endLati)
        }

        console.log(a + t + ':' + endLong + ',' + endLati + '.....' + location)
      }
    })
  }

})