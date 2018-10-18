//index.js
//获取应用实例
const app = getApp()
//
var realHeight;
var organSeg = 'LP20180103131749';
var transfer = app.data.transfer;
var transferRecord = app.data.transferRecord;
var points = [];
var mIncludPoints = [];
var mMarker = [];
var mInfo = [];
Page({

  data: {
    mapHeight: 0,
    infoHeight: 0,
    longitude: '',
    latitude: '',
    leftHeight: 0,
    //startLati startLong
    left: false,

    // dot: 'cloud_4location_now',
    // date: true,
    // line1: false,
    // line2: true,
    // line: 32,
    // line_color: '#f8b551',
    // info: [],

    markers: [],
    polyline: [],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    includ_points: []
  },

  onShow: function() {
    var that = this;
    console.log("gggg");
    that.setData({
      name: app.globalData.trueName,
      wechatUrl: app.globalData.wechatUrl
    })

  },
  onLoad: function(ops) {

    var that = this;
    organSeg = ops.organSeg
    // 获取系统信息
    wx.getSystemInfo({

      success: function(res) {


        realHeight = (res.windowHeight * (750 / res.windowWidth));
        that.setData({
          mapHeight: realHeight - 194,
          infoHeight: 194
        })
      }
    });
    mIncludPoints = [];
    that.loadTransfer();
    that.loadTransferRecord();

  },
  clickInfo: function() {
    console.log(1)
    if (this.data.mapHeight == realHeight * 1 / 3) {
      this.setData({
        mapHeight: realHeight - 194,


      })
      this.setData({
        infoHeight: 194,
        left: false,
        leftHeight: 0
      })

    } else {
      this.setData({
        mapHeight: realHeight * 1 / 3,

      })
      this.setData({
        infoHeight: realHeight * 2 / 3,
        left: true,
        leftHeight: realHeight * 2 / 3 - 194
      })
    }

  },
  loadTransfer: function() {
    var that = this;
    wx.request({
      url: transfer,
      data: {
        action: "getTransfer",
        organSeg: organSeg
      },
      success: function(res) {
        console.log(res)
        if (res.data.result == 0) {
          mIncludPoints.push({
            latitude: res.data.obj[0].startLati,
            longitude: res.data.obj[0].startLong,
          })
          mIncludPoints.push({
            latitude: res.data.obj[0].endLati,
            longitude: res.data.obj[0].endLong,
          })
          that.setData({
            markers: [{
                iconPath: "../img/cloud_4location_start.png",
                id: 0,
                latitude: res.data.obj[0].startLati,
                longitude: res.data.obj[0].startLong,
                width: 26,
                height: 43
              },
              {
                iconPath: "../img/cloud_4location_end.png",
                id: 1,
                latitude: res.data.obj[0].endLati,
                longitude: res.data.obj[0].endLong,
                width: 26,
                height: 43
              }
            ],
            includ_points: mIncludPoints
          })
        }


      }
    })
  },
  //加载当前这个转运记录
  loadTransferRecord: function() {
    var that = this;
    // console.log('11')
    wx.request({
      url: transferRecord,
      data: {
        action: 'transferRecord',
        organSeg: organSeg
      },
      success: function(res) {
        console.log(res.data)
        points = [];
        //处理异常情况
        var list = res.data.obj;
        mInfo = res.data.info;

        for (var i = 0; i < mInfo.length; i++) {
          if (i == 0) {
             mInfo[i].date= true;
             mInfo[i].line1=false;
             mInfo[i].line2=true;
             mInfo[i].line = 32;
             mInfo[i].dot ='cloud_4location_now';
             mInfo[i].line_color ='#f8b551';
          }else{
            mInfo[i].date = false;
            mInfo[i].line1 = true;
            mInfo[i].line2 = true;
            mInfo[i].line = 28;
            mInfo[i].dot = 'cloud_4location_past';
            mInfo[i].line_color = '#999';
          }

          if (i == mInfo.length - 1) {
            mInfo[i].line2 = false;
          }
        }
        
        that.setData({
          info:mInfo
        })

        for (var i = 0; i < list.length; i++) {
          if (i == 0) {
            that.setData({
              longitude: list[i].longitude,
              latitude: list[i].latitude
            });
            mIncludPoints.push({
              longitude: list[i].longitude,
              latitude: list[i].latitude
            })
          }
          points.push({
            longitude: list[i].longitude,
            latitude: list[i].latitude
          })

          if (i == list.length - 1) {
            mIncludPoints.push({
              longitude: list[i].longitude,
              latitude: list[i].latitude
            })
          }
        }


        that.setData({
          polyline: [{
            points: points,
            color: "#1d4499",
            width: 6,
            arrowLine: true,
            //arrowIconPath:"../img/texture.png"
          }],
          includ_points: mIncludPoints
        });
      }
    })
  }
})