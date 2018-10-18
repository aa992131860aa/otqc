//index.js
//获取应用实例
const app = getApp()
var trueName;
var phone;
var hospitalName;
var roleId = -1;
var roleName;
var wechatUrl;
var user = app.data.user;
var rong = app.data.rong;
var urlService = app.data.urlService;
var mUserInfo;
Page({

  data: {
    hospitalName: "",
    role: {},
    roleName: '',
    phone: '',
    trueName: '',
    roleId: -1,
    middle_height: 0,
    hasUserInfo: false,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  skipIndex: function() {
    wx.switchTab({
      url: '../index/index',

    });
  },
  onShow: function() {

    var hospitalTmep = wx.getStorageSync('hospitalName');
    hospitalName = hospitalTmep;

    this.setData({
      hospitalName: hospitalTmep
    })
  },
  onLoad: function() {

    var that = this;

    //获取高度
    var realHeight = wx.getStorageSync("realHeight");
    that.setData({
      middle_height: realHeight,
      trueName: wx.getStorageSync("trueName"),
      phone: wx.getStorageSync("phone"),
      roleName: wx.getStorageSync("roleName"),
    });
    hospitalName = wx.getStorageSync('hospitalName');
    //加载角色
    that.loadRole();

    //获取用户信息
    that.gainUserInfo();

    trueName = wx.getStorageSync("trueName");
    phone = wx.getStorageSync("phone");
    roleName = wx.getStorageSync("roleName");
    roleId = wx.getStorageSync("roleId");
  },
  loadRole: function() {
    var that = this;
    wx.request({
      url: user,
      data: {
        action: "role"
      },
      success: function(res) {
        console.log(res);
        var roleData = res.data.obj;
        that.setData({
          role: roleData
        })

      }
    })
  },
  selectRole: function() {
    var that = this;
    console.log(that.data.role)
    var roleList = [];
    for (var i = 0; i < that.data.role.length; i++) {
      roleList.push(that.data.role[i].roleName);
    }
    wx.showActionSheet({
      itemList: roleList,
      success: function(res) {
        roleName = that.data.role[res.tapIndex].roleName;
        roleId = that.data.role[res.tapIndex].roleId;
        that.setData({
          roleName: that.data.role[res.tapIndex].roleName,
          roleId: that.data.role[res.tapIndex].roleId
        })
        // console.log(res.tapIndex)
      },
      fail: function(res) {
        //  console.log(res.errMsg)
      }
    })
  },
  finishBind: function(e) {

    // var trueName = e.detail.value.true_name;
    // var phone = e.detail.value.phone;
    var that = this;
    app.globalData.userInfo = e.detail.userInfo;
    mUserInfo = e.detail.userInfo;
    console.log(e)
    console.log(mUserInfo);
    if (!trueName) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none',
        duration: 1500
      })
      console.log("trueName;" + trueName);
    } else if (!phone || phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1500
      })
    } else if (!hospitalName) {
      wx.showToast({
        title: '请选择所属医院',
        icon: 'none',
        duration: 1500
      })
    } else if (roleId == -1) {
      wx.showToast({
        title: '请选择角色',
        icon: 'none',
        duration: 1500
      })
    } else if (!mUserInfo) {
      wx.showToast({
        title: '请接受微信授权',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      var openId = wx.getStorageSync("openId");
      wechatUrl = mUserInfo.avatarUrl;
      wx.request({
        url: user,
        data: {
          action: "confirmWechat",
          phone: phone,
          trueName: trueName,
          hospital: hospitalName,
          wechatName: mUserInfo.nickName,
          wechatUrl: mUserInfo.avatarUrl,
          roleId: roleId,
          openId: openId
        },
        success: function(res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.result == 0) {
            //保存基础信息
            app.globalData.phone = phone;
            app.globalData.trueName = trueName;
            app.globalData.hospitalName = hospitalName;
            app.globalData.wechatUrl = mUserInfo.avatarUrl;
            app.globalData.openId = openId;
            app.globalData.roleId = roleId;
            app.globalData.roleName = roleName;
            app.globalData.confirmLogin1 = true;

            wx.setStorageSync("phone", phone);
            wx.setStorageSync("trueName", trueName);
            wx.setStorageSync("hospitalName", hospitalName);
            wx.setStorageSync("wechatUrl", wechatUrl);
            wx.setStorageSync("openId", openId);
            wx.setStorageSync("roleId", roleId);
            wx.setStorageSync("roleName", roleName);
            wx.setStorageSync("confirmLogin1", true);



            // 查看是否授权
            wx.getSetting({
              success: function (res) {
                console.log('userinfo')
                console.log(res)
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                  wx.getUserInfo({
                    success: function (res) {

                      console.log(res)
                      that.encryptLoad(res);


                    }
                  })
                }
              }
            });


            wx.switchTab({
              url: '../index/index',
            });

            //创建token
            wx.request({
              url: rong,
              data: {
                action: 'token',
                userId: phone,
                userName: trueName,
                photoUrl: wechatUrl != '' ? wechatUrl : app.data.photo
              },
              success: function(res) {
                if (res.data.result == 0) {
                  wx.setStorageSync("token", res.data.obj.token);
                }
              }

            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500
            })
          }
        },
        fail: function(res) {
          wx.hideLoading();
          wx.showToast({
            title: '绑定失败',
          })
        }
      })

     


    }


  },
  encryptLoad: function(request) {
   wx.request({
     url: urlService,
     data:{
       action:'encrypt',
       encryptedData:request.encryptedData,
       sessionKey:wx.getStorageSync("sessionKey"),
       iv:request.iv,
       phone:phone
     },
     success:function(res){

     }
   })
  },
  gainUserInfo: function() {


    if (app.globalData.userInfo) {
      //console.log(app.globalData)
      console.log(1);
      console.log(app.globalData.detail)

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log(2);
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log(3);
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


  },
  getUserInfo: function(e) {


    app.globalData.userInfo = e.detail.userInfo
    console.log('gg')
    console.log(e);
    console.log(app.globalData.userInfo);


    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  trueNameInput: function(e) {
    trueName = e.detail.value
  },
  phoneInput: function(e) {
    phone = e.detail.value
  }
})