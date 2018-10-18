//index.js
//获取应用实例
const app = getApp()
var workload = app.data.workload;
var phone = wx.getStorageSync("phone");
var year;
var month;
Page({

  data: {
    list: [],
    totalMonth: 0,
    totalAll: 0,
    year: '2018',
    month: '09',
    left: true,
    right: false

  },

  onShow: function() {
    var that = this;

    that.setData({
      name: app.globalData.trueName,
      wechatUrl: app.globalData.wechatUrl
    })

  },
  onLoad: function() {
    var that = this;
    var date = new Date();

    year = date.getFullYear();
    month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

    that.setData({
      year: year,
      month: month
    })

    this.loadWorkload('');

  },
  //加载数据
  loadWorkload: function(flag) {
    var that = this;
    wx.request({
      url: workload,
      data: {
        action: 'workloadLiver',
        roleId: '2',
        phone: phone,
        time: year + '-' + month
      },
      success: function(res) {
        console.log(res)
        if (res.data.result == 0) {
          that.setData({
            list: res.data.obj,
            totalMonth: res.data.obj[0].totalMonth,
            totalAll: res.data.obj[0].totalAll
          })
        }
        if (flag == 'left') {
          that.setData({
            left: true
          })
        } else if ('right') {
          that.setData({
            right: true
          })
        }
      }
    })
  },
  //点击事件
  clickLeft: function() {
    var that = this;
    
   if(month=='01'){
     var y = parseInt(year) - 1;
     year = y;
     month = "12"
   }else{
     var m = parseInt(month) - 1;
     month = m < 10 ? "0" + m : m;
   }
   
 
    that.setData({
      left: false,
      year: year,
      month: month
    })
    this.loadWorkload('left');
  },
  clickRight: function() {
    var that = this;
    if (month == '12') {
      var y = parseInt(year) + 1;
      year = y;
      month = "01"
    } else {
      var m = parseInt(month) + 1;
      month = m < 10 ? "0" + m : m;
    }


    that.setData({
      right: false,
      year: year,
      month: month
    })
    this.loadWorkload('right');
  }
})