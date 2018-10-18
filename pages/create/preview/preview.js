//index.js
//获取应用实例
const app = getApp()
var transfer = app.data.transfer;
var that;
//第一步
var organSeg = '';
var organ = '';
var modifyOrganSeg = '';
var getTime = '';
var boxNo = '';
//第二步
var blood = '';
var sample = '';
var organNum = 1;
var bloodNum = 1;
var sampleNum = 1;

//第三步
var fromCity = '';
var method = '';
var no = '';
var distance;
var modify;
Page({

  data: {
    teamList: [],
    baseInfo: true,
    organInfo: true,
    transferInfo: true,
    otherInfo: true,

    //第一步
    organSeg: '',
    organ: '',
    modifyOrganSeg: '',
    getTime: '',
    boxNo: '',
    //第二步
    blood: '',
    sample: '',
    organNum: '',
    bloodNum: '',
    sampleNum: '',

    //第三步
    fromCity: '',
    method: '',
    no: '',
    opoContactName: '',
    opoContactPhone: '',
    hospitalName: ''

  },

  onShow: function() {
    that = this;
    var teamListTemp = []; //concat

    var transferName = wx.getStorageSync("transferName");
    var transferPhone = wx.getStorageSync("transferPhone");
    var transferUrl = wx.getStorageSync("transferUrl");

    var contactName = wx.getStorageSync("contactName");
    var contactPhone = wx.getStorageSync("contactPhone");
    var contactUrl = wx.getStorageSync("contactUrl");

    var opoContactName = wx.getStorageSync("opoContactName");
    var opoContactPhone = wx.getStorageSync("opoContactPhone");
    var opoContactUrl = wx.getStorageSync("opoContactUrl");

    var trueName = wx.getStorageSync("trueName");
    var phone = wx.getStorageSync("phone");
    var wechatUrl = wx.getStorageSync("wechatUrl");

    teamListTemp.push({
      contactPhone: transferPhone,
      hospitalName: '',
      flag: '转',
      isUploadPhoto: '0',
      roleId: 0,
      trueName: transferName,
      wechatUrl: transferUrl
    })

    teamListTemp.push({
      contactPhone: contactPhone,
      hospitalName: '',
      isUploadPhoto: '0',
      roleId: 0,
      flag: '协',
      trueName: contactName,
      wechatUrl: contactUrl
    })

    teamListTemp.push({
      contactPhone: opoContactPhone,
      hospitalName: '',
      isUploadPhoto: '0',
      roleId: 0,
      flag: 'OPO',
      trueName: opoContactName,
      wechatUrl: opoContactUrl
    })

    if (transferName != trueName) {
      teamListTemp.push({
        contactPhone: phone,
        hospitalName: '',
        isUploadPhoto: '0',
        roleId: 0,
        trueName: trueName,
        wechatUrl: wechatUrl
      })
    }

    teamListTemp = teamListTemp.concat(app.data.teamList);

    var hospitalName = wx.getStorageSync("selectHospital");

    that.setData({
      teamList: teamListTemp,
      opoContactName: opoContactName,
      opoContactPhone: opoContactPhone,
      hospitalName: hospitalName
    })





  },
  onLoad: function(ops) {
    that = this;
    console.log(ops)
    //第一步
    organSeg = ops.organSeg;
    organ = ops.organ;
    modifyOrganSeg = ops.modifyOrganSeg;
    getTime = ops.getTime;
    boxNo = ops.boxNo;
    //第二步
    blood = ops.blood;
    sample = ops.sample;
    organNum = ops.organNum;
    bloodNum = ops.bloodNum;
    sampleNum = ops.sampleNum;

    //第三步
    fromCity = ops.fromCity;
    method = ops.method;
    no = ops.no;

    modify = ops.modify;

    that.setData({
      //第一步
      organSeg: organSeg,
      organ: organ,
      modifyOrganSeg: modifyOrganSeg,
      getTime: getTime,
      boxNo: boxNo,
      //第二步
      blood: blood,
      sample: sample,
      organNum: organNum,
      bloodNum: bloodNum,
      sampleNum: sampleNum,

      //第三步
      fromCity: fromCity,
      method: method,
      no: no,
    })


  },
  add: function() {
    wx.navigateTo({
      url: '../../contact/contact/contact?type=add',
    })
  },
  minus: function() {
    wx.navigateTo({
      url: '../../contact/contact/contact?type=minus',
    })
  },
  shrink: function(e) {
    var info = e.currentTarget.dataset.info;
    if (info == 'baseInfo') {
      that.setData({
        baseInfo: !that.data.baseInfo
      })
    } else if (info == "organInfo") {
      that.setData({
        organInfo: !that.data.organInfo
      })
    } else if (info == "transferInfo") {
      that.setData({
        transferInfo: !that.data.transferInfo
      })
    } else if (info == "otherInfo") {
      that.setData({
        otherInfo: !that.data.otherInfo
      })
    }
  },
  clickPre: function() {
    wx.navigateBack({

    })
  },





  clickNext: function() {
    wx.showLoading({
      title: '加载中',
    })
    var startLong = wx.getStorageSync("startLong");
    var startLati = wx.getStorageSync("startLati");
    var endLong = wx.getStorageSync("endLong");
    var endLati = wx.getStorageSync("endLati");
    var groupName = '待转运-' + modifyOrganSeg + '-' + organ;
    this.distance(startLati, startLong, endLati, endLong);
    var usersId = '';
    for (var i = 0; i < that.data.teamList.length; i++) {
      usersId += that.data.teamList[i].contactPhone + ',';

    }
    var action = 'create';
    if (modify == 'modify') {
      action = 'updateTransfer';
      
    }
    wx.request({
      url: transfer,
      data: {
        action: action,
        phone: wx.getStorageSync("transferPhone"),
        organSeg: organSeg,
        organ: organ,
        organNum: organNum,
        blood: blood,
        bloodNum: bloodNum,
        sampleOrgan: sample,
        sampleOrganNum: sampleNum,
        contactName: wx.getStorageSync("contactName"),
        contactPhone: wx.getStorageSync("contactPhone"),
        fromCity: fromCity,
        getTime: getTime,
        openPsd: '',
        opoName: wx.getStorageSync("selectHospital") + 'OPO',
        toHospName: wx.getStorageSync("selectHospital"),
        trueName: wx.getStorageSync("transferName"),
        tracfficType: method,
        tracfficNumber: no,
        modifyOrganSeg: modifyOrganSeg,
        distance: distance,
        groupName: groupName,
        usersIds: usersId,
        toHosp: wx.getStorageSync("toHosp"),
        opoContactName: wx.getStorageSync("opoContactName"),
        opoContactPhone: wx.getStorageSync("opoContactPhone"),
        boxNo: boxNo,
        isStart: '0',
        startLong: startLong,
        startLati: startLati,
        endLong: endLong,
        endLati: endLati
      },
      success: function(res) {
        if (res.data.result == 0) {
          wx.switchTab({
            url: '../../index/index?isCreate=true',
          });
          wx.setStorageSync("isCreate", true);
          wx.setStorageSync("distance", distance);
          wx.setStorageSync("weather", wx.getStorageSync("weather"));
          wx.setStorageSync("temperature", wx.getStorageSync("temperature"));
          wx.setStorageSync("fromCity", fromCity);
          wx.setStorageSync("organSeg", organSeg);
          wx.setStorageSync("modifyOrganSeg", modifyOrganSeg);
          wx.setStorageSync("organ", organ);
          wx.setStorageSync("phones", usersId)

        } else {
          wx.showToast({
            title: '创建失败',
          })
        }
        wx.hideLoading();
        console.log(res)

      },
      fail: function(res) {
        wx.hideLoading();
      }
    })


  },
  distance: function(la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137; //地球半径
    s = Math.round(s * 10000) / 10000;
    distance = parseInt(s)
    //distance = s;
    // return s
    console.log("计算结果", s)
  }
})