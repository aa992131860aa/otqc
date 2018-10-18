//var url = "http://192.168.1.11:8080/transbox/";
var url= "https://www.lifeperfusor.com/transbox/";
//app.js
App({
  globalData: {
    userInfo: null,
    openId: '',
    trueName: '',
    phone: '',
    hospitalName: '',
    roleName: '',
    roleId: '',
    wechatUrl: '',
    confirmLogin1: false

  },
  data: {
    //url:"http://www.lifeperfusor.com/transbox/",
    //url:"http://192.168.1.27:8080/transbox/",
    user: url + "user.do",
    transfer: url + "transfer.do",
    rong: url + "rong.do",
    contact: url + "contact.do",
    me: url + "me.do",
    downloadPdf: url + "downloadPdf.do",
    workload: url + "workload.do",
    transferRecord: url + "transferRecord.do",
    weather: url + "weather.do",
    box: url + "box.do",
    opo: url + 'opo.do',
    address: 'https://restapi.amap.com/v3/geocode/geo?key=d1a4169090421ca9176490080f183a54&address=',
    teamList: [],
    photo: url + '/images/contact_person.png',
    push: url + 'push.do',
    sendSms: url + 'sendSms.do',
    urlService:url+'url.do'


  },
  onLaunch: function() {


    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //console.log("login:"+this.globalData.phone);

    this.globalData.phone = wx.getStorageSync("phone");
    this.globalData.trueName = wx.getStorageSync("trueName");
    this.globalData.hospitalName = wx.getStorageSync("hospitalName");
    this.globalData.wechatUrl = wx.getStorageSync("wechatUrl");
    this.globalData.openId = wx.getStorageSync("openId");
    this.globalData.roleId = wx.getStorageSync("roleId");
    this.globalData.roleName = wx.getStorageSync("roleName");
    this.globalData.confirmLogin1 = wx.getStorageSync("confirmLogin1");
    
    console.log("openId",wx.getStorageSync("openId"));

    //console.log("confirmLogin1:" + this.globalData.confirmLogin1 + "," + this.globalData.phone)
    
    if (!this.globalData.confirmLogin1) {

      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log("res.code:" + res);
          console.log(res);
          //console.log("user:"+that.data.user);
          wx.request({
            url: that.data.user,
            data: {
              // appid: 'wx323507bed41c42c8',
              // secret: 'b0d04f48fb57d4c73ab42652b59037d2',
              action: 'gainOpenId',
              js_code: res.code
              // grant_type: 'authorization_code'
            },
            method: 'GET',
            success: function(res) {
              console.log("loginSS");
              console.log(res)
              if (res.data.result == 0) {

                wx.setStorageSync("phone", res.data.obj.phone);
                wx.setStorageSync("trueName", res.data.obj.trueName);
                wx.setStorageSync("hospitalName", res.data.obj.hospitalName);
                wx.setStorageSync("token", res.data.obj.token);
                if (res.data.obj.isUploadPhoto == 0) {
                  wx.setStorageSync("wechatUrl", res.data.obj.wechatUrl);
                  that.globalData.wechatUrl = res.data.obj.wechatUrl;
                } else {
                  wx.setStorageSync("wechatUrl", res.data.obj.photoFile);
                  that.globalData.wechatUrl = res.data.obj.photoFile;
                }
                wx.setStorageSync("openId", res.data.obj.openId);
                wx.setStorageSync("roleId", res.data.obj.roleId);
                wx.setStorageSync("roleName", res.data.obj.roleName);
                var temp = wx.getStorageSync("confirmLogin1");
                wx.setStorageSync("confirmLogin1", true);

                wx.setStorageSync("sessionKey", res.data.obj.sessionKey)


                that.globalData.phone = res.data.obj.phone;
                that.globalData.trueName = res.data.obj.trueName;
                that.globalData.hospitalName = res.data.obj.hospitalName;

                that.globalData.openId = res.data.obj.openId;
                that.globalData.roleId = res.data.obj.roleId;
                that.globalData.roleName = res.data.obj.roleName;
                that.globalData.confirmLogin1 = true;
               
                  wx.switchTab({
                    url: '../index/index',
                  });
                
             
                // wx.navigateBack({

                // })

                //存入token
                if (res.data.obj.token == "") {

                  wx.request({
                    url: that.data.rong,
                    data: {
                      action: "token",
                      userId: res.data.obj.phone,
                      userName: res.data.obj.trueName,
                      photoUrl: wx.getStorageSync("wechatUrl")
                    },
                    success: function(res) {
                      wx.setStorageSync("token", res.data.obj.token);
                    }
                  });

                }

              } else {

              }

              if (res.data.result != 4) {
                wx.setStorageSync("openId", res.data.msg);
              }
            },
            fail: function(res) {
              console.log(res);
            }
          })
        }
      });
    }

    // 获取系统信息
    wx.getSystemInfo({

      success: function(res) {
        //console.log(res);
        // 可使用窗口宽度、高度
        //console.log('height=' + res.windowHeight);
        //console.log('width=' + res.windowWidth);
        //console.log('pixelRatio=' + res.pixelRatio);



        var realHeight = (res.windowHeight * (750 / res.windowWidth));

        wx.setStorage({
          key: 'realHeight',
          data: realHeight
        })
        wx.setStorage({
          key: 'windowWidth',
          data: res.windowWidth
        })
        wx.setStorage({
          key: 'windowHeight',
          data: res.windowHeight
        })

      }
    });


    // 获取用户信息
    wx.getSetting({
      success: res => {
       // console.log("userInfo");
       // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }

});