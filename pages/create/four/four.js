//index.js
//获取应用实例
const app = getApp();
var that;
var opo = app.data.opo;

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


var trueName;
var phone;

var transferName;
var transferPhone;

var contactName;
var contactPhone;

var opoContactName;
var opoContactPhone;
var modify;

Page({

  data: {
    transferName: '',
    transferPhone: '',
    contactName: '',
    contactPhone: '',
    opoContactName: '',
    opoContactPhone: '',
  },

  onShow: function() {
    that = this;
    transferName = wx.getStorageSync("transferName");
    transferPhone = wx.getStorageSync("transferPhone");

    contactName = wx.getStorageSync("contactName");
    contactPhone = wx.getStorageSync("contactPhone");

    opoContactName = wx.getStorageSync("opoContactName");
    opoContactPhone = wx.getStorageSync("opoContactPhone");




    if (opoContactName == '') {

      that.loadOpo();
    } else {
      that.setData({
        opoContactName: opoContactName,
        opoContactPhone: opoContactPhone
      })
    }
    if (transferName == '') {
      trueName = wx.getStorageSync("trueName");
      phone = wx.getStorageSync("phone");
      transferName = trueName;
      transferPhone = phone;
      wx.setStorageSync("transferName", trueName);
      wx.setStorageSync("transferPhone", phone);
    }

    that.setData({
      transferName: transferName,
      transferPhone: transferPhone,
      contactName: contactName,
      contactPhone: contactPhone
    })


  },
  onLoad: function(ops) {
    that = this;

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


  },
  loadOpo: function() {
    var hospital = wx.getStorageSync("selectHospital");
    wx.request({
      url: opo,
      data: {
        action: 'opo',
        hospital: hospital
      },
      success: function(res) {
        if (res.data.result == 0) {

          opoContactName = res.data.obj.opoInfoContacts[0].contactName;
          opoContactPhone = res.data.obj.opoInfoContacts[0].contactPhone;
          wx.setStorageSync('opoContactName', opoContactName)
          wx.setStorageSync('opoContactPhone', opoContactPhone)
          that.setData({
            opoContactName: opoContactName,
            opoContactPhone: opoContactPhone
          })
        }
      }
    })
  },
  selectPerson: function(e) {
    var type = e.currentTarget.dataset.type;

    wx.navigateTo({
      url: '../../contact/contact/contact?type=' + type,
    })
  },
  clickPre: function() {
    wx.navigateBack({

    })
  },
  clickNext: function() {
    wx.navigateTo({
      url: '../../create/preview/preview?organSeg=' + organSeg + '&organ=' + organ + '&modifyOrganSeg=' + modifyOrganSeg + '&boxNo=' + boxNo + '&getTime=' + getTime + '&organNum=' + organNum + '&blood=' + blood + '&bloodNum=' + bloodNum + '&sample=' + sample + '&sampleNum=' + sampleNum + '&fromCity=' + fromCity + '&method=' + method + '&no=' + no + '&modify=' + modify,
    })
  },
})