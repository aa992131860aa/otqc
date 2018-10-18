//index.js
//获取应用实例
const app = getApp()
var contactPhone = '';
Page({

  data: {

    wechatUrl: '',
    trueName: '',
    phone: '',
    hospitalName: '',
    roleName: '',
  },

  onShow: function() {
    var that = this;
    console.log("gggg");
   
  },
  onLoad: function(ops) {
  
    var trueName = ops.trueName;
    contactPhone = ops.contactPhone;
    var hospitalName = ops.hospitalName;
    var wechatUrl = ops.wechatUrl;
    var roleId = ops.roleId;
    var roleName = '';
    console.log("contactPhone:" + contactPhone)
    // 1.管理员     2.医生      3.科室协调员       4.OPO人员       5.护士
    if (roleId == 1) {
      roleName = '管理员';
    }
    if (roleId == 2) {
      roleName = '医生';
    }
    if (roleId == 3) {
      roleName = '科室协调员';
    }
    if (roleId == 4) {
      roleName = 'OPO人员';
    }
    if (roleId == 5) {
      roleName = '护士';
    }
    var that = this;
    that.setData({
      wechatUrl: wechatUrl,
      trueName: trueName,
      phone: contactPhone,
      hospitalName: hospitalName,
      roleName: roleName

    })


  },
  callClick: function() {
    wx.makePhoneCall({
      phoneNumber: contactPhone, //此号码并非真实电话号码，仅用于测试
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })

  }
})