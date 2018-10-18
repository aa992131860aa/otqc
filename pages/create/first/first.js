//index.js
//获取应用实例
const app = getApp()
var box = app.data.box;
var transfer = app.data.transfer;
var scan;
var modifyOrganSeg = '';
var organSeg = '';
var transfer = app.data.transfer;
var time = '';
var organ = '';
var getTime = '';
var modify;

Page({

  data: {
    startDate: '',
    startTime: '',
    top: 0,
    toastHeight: 0,
    isToast: false,
    boxList: [],
    boxNo: '',
    modifyOrganSeg: '',
    //第二页参数
    organ: '肝脏',
    organNum: 1,
    blood: '',
    bloodNum: 1,
    sample: '',
    sampleNum: 1,
    //第三步
    fromCity: '',
    method: '救护车',
    no: ''

  },

  onShow: function() {
    var that = this;

    that.setData({
      name: app.globalData.trueName,
      wechatUrl: app.globalData.wechatUrl
    })

  },
  onLoad: function(ops) {

    var that = this;
    scan = ops.scan;
    modify = ops.modify;
    if (modify == 'modify') {
      var organSegOps = ops.organSeg;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: transfer,
        data: {
          action: 'getTransferByOrganSeg',
          organSeg: organSegOps
        },
        success: function(res) {
          console.log(res)
          wx.hideLoading();
          if (res.data.result == 0) {
            var info = res.data.obj;
            organSeg = organSegOps;
            if(modifyOrganSeg ==""){
              modifyOrganSeg = info.modifyOrganSeg;
            }
        
            that.setData({
              boxNo: info.boxNo,
              modifyOrganSeg: modifyOrganSeg,
              //第二页参数
              organ: info.organ,
              organNum: info.organNum,
              blood: info.blood,
              bloodNum: info.bloodNum,
              sample: info.sampleOrgan,
              sampleNum: info.sampleOrganNum,
              //第三步
              fromCity: info.fromCity,
              method: info.tracfficType,
              no: info.tracfficNumber,
              startDate: info.getTime.split(" ")[0],
              startTime: info.getTime.split(" ")[1],

            })
          }
        },
        fail: function(res) {
          wx.hideLoading();
        }
      })
    } else {


      if (scan != '' && scan) {
        //扫描进入
        that.setData({
          boxNo: scan
        })
        // wx.showToast({
        //   title: 'scan:' + scan,
        //   icon: 'none'
        // })
      } else {
        // wx.showToast({
        //   title: '手动输入:',
        //   icon: 'none'
        // })
      }
    }

    // 获取系统信息
    wx.getSystemInfo({

      success: function(res) {


        var realHeight = res.windowHeight;

        that.setData({
          toastHeight: realHeight * 3 / 5,
          top: realHeight / 5 - 20
        })


      }
    });

    //时间
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate();

    var hour = date.getHours()
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = year + month + day + hour + minute + second;
    this.setData({
      startDate: year + '-' + month + '-' + day,
      startTime: hour + ":" + minute
    })


    //加载箱号
    this.loadBox();

  },
  clickDate: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  clickTime: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  clickBox: function() {

    if (modify == 'modify') {

    } else {
      if (!scan) {
        this.setData({
          isToast: true
        })
      }
    }


  },
  clickCancel: function() {
    this.setData({
      isToast: false
    })
  },
  selectBox: function(e) {
    var b = e.currentTarget.dataset.b;
    var status = e.currentTarget.dataset.status;
    if (status == '使用中') {
      wx.showToast({
        title: '设备正在使用中,请停止箱子的转运',
      })
    } else {
      this.setData({
        boxNo: b,
        isToast: false
      })
    }


  },
  organInput: function(e) {
    modifyOrganSeg = e.detail.value
    that.setData({
      modifyOrganSeg: modifyOrganSeg
    })
  },
  clickNext: function() {
    var that = this;
    var b = this.data.boxNo;


    if (b == '') {
      wx.showToast({
        title: '请选择设备',
        icon: 'none'
      })
    } else {
      getTime = that.data.startDate + ' ' + that.data.startTime;

      if (modifyOrganSeg == '' && organSeg == '') {
        organSeg = "WP" + time;
        this.loadReapeat();
      } else {

        wx.navigateTo({
          url: '../../create/two/two?organSeg=' + organSeg + '&organ=' + that.data.organ + '&modifyOrganSeg=' + modifyOrganSeg + '&boxNo=' + that.data.boxNo + '&getTime=' + getTime + '&organNum=' + that.data.organNum + '&blood=' + that.data.blood + '&bloodNum=' + that.data.bloodNum + '&sample=' + that.data.sample + '&sampleNum=' + that.data.sampleNum +
            '&fromCity=' + that.data.fromCity + '&method=' + that.data.method + '&no=' + that.data.no + '&modify=' + modify,
        })
      }

    }
  },
  loadBox: function() {
    var that = this;
    var hospitalName = wx.getStorageSync("hospitalName");
    var list = [];

    wx.request({
      url: box,
      data: {
        action: "boxUse",
        hospital: hospitalName
      },
      success: function(res) {


        if (res.data.result == 0) {
          list = res.data.obj;
        }
        list.push({
          boxNo: '99999',
          status: '虚拟测试'
        })
        that.setData({
          boxList: list
        })


      },
      fail: function(res) {
        list.push({
          boxNo: '99999',
          status: '虚拟测试'
        })
        that.setData({
          boxList: list
        })
      }
    })
  },
  loadBoxStart: function() {
    var that = this;
    wx.request({
      url: box,
      data: {
        action: 'start',
        boxNo: that.data.boxNo
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  loadReapeat: function() {
    var that = this;
    wx.request({
      url: transfer,
      data: {
        action: 'organRepeatType',
        boxNo: that.data.boxNo,
        organSeg: organSeg
      },
      success: function(res) {
        if (res.data.result == 0) {
          organ = res.data.obj.type;
          //modifyOrganSeg = res.data.obj.modifyOrganSeg;


          that.setData({
            modifyOrganSeg: modifyOrganSeg
          })

          wx.navigateTo({
            url: '../../create/two/two?organSeg=' + organSeg + '&organ=' + organ + '&modifyOrganSeg=' + modifyOrganSeg + '&boxNo=' + that.data.boxNo + '&getTime=' + getTime + '&organNum=' + that.data.organNum + '&blood=' + that.data.blood + '&bloodNum=' + that.data.bloodNum + '&sample=' + that.data.sample + '&sampleNum=' + that.data.sampleNum +
              '&fromCity=' + that.data.fromCity + '&method=' + that.data.method + '&no=' + that.data.no + '&modify=' + modify,
          })

        } else {
          wx.showToast({
            title: '器官段号重复',
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  }

})