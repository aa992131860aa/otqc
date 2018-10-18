const app = getApp();
var user = app.data.user;
var phone = wx.getStorageSync("phone");
var transfer = app.data.transfer;
var page = 0;
var pageSize = 15;
Page({
  data: {

    selectTime: true,
    time: '时间',
    selectOrgan: true,
    organ: '器官',
    selectAll: true,
    all: '完整度',
    selectStart: true,
    start: '起始地',
    startList: [],
    startTimeStatus: true,
    endTimeStatus: false,
    noContent: false,
    startDate: "",
    endDate: "",
    list: []
  },
  //点击事件
  clickTime: function() {
    var selectTime = this.data.selectTime;
    if (selectTime == true) {
      this.setData({

        selectTime: false,

        selectOrgan: true,
        selectAll: true,
        selectStart: true

      })
    } else {
      this.setData({

        selectTime: true,
      })
    }
  },

  clickOrgan: function() {
    var selectOrgan = this.data.selectOrgan;
    if (selectOrgan == true) {
      this.setData({

        selectOrgan: false,

        selectTime: true,

        selectAll: true,
        selectStart: true
      })
    } else {
      this.setData({

        selectOrgan: true,
      })
    }
  },

  clickAll: function() {
    var selectAll = this.data.selectAll;
    if (selectAll == true) {
      this.setData({

        selectAll: false,
        selectTime: true,
        selectOrgan: true,

        selectStart: true
      })
    } else {
      this.setData({

        selectAll: true,
      })
    }
  },

  clickStart: function() {
    var selectStart = this.data.selectStart;
    if (selectStart == true) {
      this.setData({

        selectStart: false,
        selectTime: true,
        selectOrgan: true,
        selectAll: true,

      })
    } else {
      this.setData({

        selectStart: true,
      })
    }
  },

  //选择事件
  timeSelect: function(e) {

    this.setData({
      time: e.target.dataset.me,
      selectTime: true
    })
  },

  organSelect: function(e) {
    if (e.target.dataset.me == '全部') {
      e.target.dataset.me = '器官'
    }
    this.setData({
      organ: e.target.dataset.me,
      selectOrgan: true
    })


    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    page = 0;
    this.loadMore(this);


  },

  allSelect: function(e) {
    if (e.target.dataset.me == '全部') {
      e.target.dataset.me = '完整度'
    }
    this.setData({
      all: e.target.dataset.me,
      selectAll: true
    })


    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    page = 0;
    this.loadMore(this);

  },

  startSelect: function(e) {
    if (e.target.dataset.me == '全部') {
      e.target.dataset.me = '起始地'
    }
    this.setData({
      start: e.target.dataset.me,
      selectStart: true
    })

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    page = 0;
    this.loadMore(this);
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  //内容点击事件
  content: function() {

    this.setData({
      selectTime: true,
      selectOrgan: true,
      selectAll: true,
      selectStart: true
    })
  },
  //加载起始地
  loadStart: function() {
    var that = this;
    wx.request({
      url: user,
      data: {
        action: "getStartAddress",
        phone: phone
      },
      success: function(res) {
        console.log(res);
        that.setData({
          startList: res.data.obj
        });
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },

  //上拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    page = 0;
    this.loadMore(this);

  },
  //加载更多
  onReachBottom: function() {
    wx.hideLoading();
    page++;
    this.loadMore(this);

  },
  //加载统计记录
  loadMore: function(that) {
    var that = this;
    console.log(that.data.organ)

    wx.request({
      url: transfer,
      data: {
        action: 'getTransferHistory',
        phone: phone,
        page: page,
        pageSize: pageSize,
        startTime: that.data.startDate,
        endTime: that.data.endDate,
        organ: that.data.organ == '器官' ? '' : that.data.organ,
        transferPerson: '',
        startAddress: that.data.start == '起始地' ? '' : that.data.start,
        integrity: that.data.all == '完整度' ? '' : that.data.all,
      },
      success: function(res) {
        console.log(res);
        if (res.data.result == 0) {

          var tempArray = that.data.list;
          if (page == 0) {


            // 停止下拉动作
            wx.stopPullDownRefresh();
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading()

            tempArray = [];

          }

          tempArray = tempArray.concat(res.data.obj);
          for (var i = 0; i < tempArray.length; i++) {
            tempArray[i].date = tempArray[i].getTime.split(" ")[0]
            tempArray[i].city = tempArray[i].fromCity.split("市")[0];
            tempArray[i].zone = tempArray[i].fromCity.indexOf("市") != -1 ? tempArray[i].fromCity.split("市")[1] : "";

            tempArray[i].city1 = tempArray[i].toHosp.split("市")[0];
            tempArray[i].zone1 = tempArray[i].toHosp.indexOf("市") != -1 ? tempArray[i].toHosp.split("市")[1] : "";

            tempArray[i].distance = tempArray[i].distance.split(".")[0];
          }


          that.setData({
            list: tempArray
          })

          if (tempArray.length > 0) {
            that.setData({
              noContent: false
            })
          } else {

            that.setData({
              noContent: true
            })
          }


        } else {
          if (page != 0) {
            wx.showToast({
              title: '加载完毕',
              icon: 'none'
            })
          } else {
            that.setData({
              noContent: true
            })
            wx.showToast({
              title: '暂无转运组',
              icon: 'none'
            })
          }
        }
        wx.hideLoading();
      },
      fail: function(res) {
        wx.hideLoading();
        that.setData({
          noContent: true
        })
        wx.showToast({
          title: '暂无加载内容',
          icon: 'none'
        })
      }

    })
  },


  //日期选择
  startDateChange: function(e) {
    this.setData({
      startDate: e.detail.value,
      startTimeStatus: true,
      endTimeStatus: false

    })
  },
  endDateChange: function(e) {
    this.setData({
      endDate: e.detail.value,
      startTimeStatus: false,
      endTimeStatus: true
    })
  },
  //日期的叉叉
  startImg: function() {
    this.setData({
      startDate: ''
    })
  },
  endImg: function() {
    this.setData({
      endDate: ''
    })
  },
  //日期确认
  btnTime: function() {
    var that = this;
    var sTemp = '';
    var eTemp = '';
    if (that.data.startDate != "") {
      sTemp = that.data.startDate.split('-')[1] + '.' + that.data.startDate.split('-')[2]
    }
    if (that.data.endDate != "") {
      eTemp = that.data.endDate.split('-')[1] + '.' + that.data.endDate.split('-')[2]
    }

    var dateTemp = '';
    if (sTemp == '' && eTemp == '') {
      dateTemp = '时间';
    } else {
      dateTemp = sTemp + '-' + eTemp;
    }

    this.setData({
      time: dateTemp,
      selectTime: true
    })
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    page = 0;
    this.loadMore(this);


  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.loadStart();
    wx.showLoading({
      title: '加载中',
    })
    this.loadMore();
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})