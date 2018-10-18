//index.js
//获取应用实例
const app = getApp()
var count = 8;
var transfer = app.data.transfer;
var contact = app.data.contact;
var rong = app.data.rong;
var sendSms = app.data.sendSms;

var phone = wx.getStorageSync("phone");
var page = 0;
var page_size = 5;
var push = app.data.push;
var isCreate = false;
var intervals = [];



Page({
  data: {
    hidden: true,
    noContent: false,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    info: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isCreate: false,
    distance: '',
    weather: '',
    temperature: '',
    fromCity: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  skipDetail: function(p) {
    if (this.endTime - this.startTime < 350) {
      var organSeg = p.currentTarget.dataset.organSeg;
      var show = p.currentTarget.dataset.show;
      if (show == false) {

        //console.log(organSeg)
        wx.navigateTo({
          url: '../detail/detail?organSeg=' + organSeg,
        })
      }
    }
  },
  skipDetailLong: function(p) {
    var that = this;
    var organSeg = p.currentTarget.dataset.organSeg;
    var show = p.currentTarget.dataset.show;
    var status = p.currentTarget.dataset.status;
    var boxNo = p.currentTarget.dataset.boxNo;
    if (show == false && status == 'transfering') {
      wx.showModal({
        title: '提示',
        content: '是否结束转运',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.request({
              url: transfer,
              data: {
                action: 'shutDownTransfer',
                organSeg: organSeg,
                boxNo: boxNo
              },
              success: function(res) {
                if (res.data.result == 0) {
                  wx.showToast({
                    title: '转运已结束',
                    icon: 'none'
                  })
                  that.noticeTransfer(organSeg);
                  that.initLoad();
                }
              }
            })
          }
        }
      })
    }
  },
  startClick: function(p) {
    var that = this;

    var organSeg = p.currentTarget.dataset.organSeg;
    var index = p.currentTarget.dataset.index;
    console.log(p)
    console.log(organSeg)
    wx.showModal({
      title: '提示',
      content: '是否开始转运',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: transfer,
            data: {
              action: 'updateStart',
              organSeg: organSeg,
              isStart: '1',
              type: 'type'
            },
            success: function(res) {
              if (res.data.result == 0) {
                console.log(res)


                //查询转运团队人员
                that.loadTransferPerson(organSeg, index);

              }
            }
          })
        }
      }
    })

  },
  //查询转运团队人员
  loadTransferPerson: function(organSeg, i) {
    var that = this;
    wx.request({
      url: rong,
      data: {
        action: 'getGroupInfoOrganSeg',
        organSeg: organSeg
      },
      success: function(res) {
        if (res.data.result == 0) {
          //发送短信
          var phones = res.data.msg;
          console.log('提示' + i)
          console.log(that.data.list)
          var content = "本次转运医师:" + that.data.list[i].trueName + ",科室协调员:" + that.data.list[i].contactName + "。器官段号:" + organSeg + "，" + that.data.list[i].fromCity + "的" + that.data.list[i].organ + "转运已开始。";
          that.sendSms(phones, content);

          that.noticeTransfer(organSeg);
          that.initLoad();
          console.log(phones + content)
        }
      }
    })
  },
  //发送短信
  sendSms: function(phones, content) {
    wx.request({
      url: sendSms,
      data: {
        action: 'sendListTransfer',
        phones: phones,
        content: content
      },
      success: function(res) {

      }
    })
  },
  modifyClick: function(p) {
    var that = this;
    var organSeg = p.currentTarget.dataset.organSeg;
    wx.navigateTo({
      url: '../create/first/first?modify=modify&organSeg=' + organSeg,
    })

  },
  delClick: function(p) {
    var that = this;
    var organSeg = p.currentTarget.dataset.organSeg;
    var phone = p.currentTarget.dataset.phone;
    wx.showModal({
      title: '提示',
      content: '是否删除转运',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: transfer,
            data: {
              action: 'deleteTransfer',
              organSeg: organSeg,
              phone: phone
            },
            success: function(res) {
              if (res.data.result == 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                });
                that.noticeTransfer(organSeg);
                that.initLoad();
              }
            }
          })
        }
      }
    })
  },
  onShow: function() {

    this.initLoad();
     
    if (!app.globalData.confirmLogin1) {
      wx.redirectTo({
        url: '../login/login',
      })
      
    }
    isCreate = wx.getStorageSync("isCreate");

    this.setData({
      isCreate: isCreate,
      distance: wx.getStorageSync("distance"),
      weather: wx.getStorageSync("weather"),
      temperature: wx.getStorageSync("temperature"),
      fromCity: wx.getStorageSync("fromCity"),
    })



  },
  initLoad: function() {
    for (var i = 0; i < intervals.length; i++) {
      clearInterval(intervals[i])
    }

    page = 0;
    this.setData({
      list: []
    })
    this.loadMore(this);
  },
  konwClick: function() {
    wx.setStorageSync("isCreate", false);
    this.setData({
      isCreate: false
    })
  },
  goStart: function() {
    var that = this;
    var organSeg = wx.getStorageSync("organSeg");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: transfer,
      data: {
        action: 'updateStart',
        organSeg: organSeg,
        isStart: '1'
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.result == 0) {
          var phones = wx.getStorageSync("phones");
          var content = "本次转运医师：" + wx.getStorageSync("transferName") + "，科室协调员：" + wx.getStorageSync("contactName") + "。器官段号：" + wx.getStorageSync("modifyOrganSeg") + "，" + wx.getStorageSync("fromCity") + "的" + wx.getStorageSync("organ") + "转运已开始。";
          that.sendSms(phones, content)

        } else {
          wx.showToast({
            title: '开始失败',
            icon: 'none'
          })
        }

        that.setData({
          isCreate: false
        })
        that.initLoad();
        wx.setStorageSync("isCreate", false);
      },
      fail: function(res) {
        wx.hideLoading();
        that.setData({
          isCreate: false
        })
        that.initLoad();
        wx.setStorageSync("isCreate", false);
      }
    })
  },
  onLoad: function(ops) {

    var that = this;

    // 获取用户信息
    console.log("use")
    console.log(app.globalData.userInfo);

    var realHeight = wx.getStorageSync("realHeight");
    wx.setStorageSync("isCreate", false);
    //console.log("realHeight:" + realHeight)
    that.setData({
      scrollHeight: realHeight,
      isCreate: false
    })
    var c = 2;

    that.loadMore(that);

    //加载联系人
    that.loadContact();
  },
  loadContact: function() {
    wx.request({
      url: contact,
      data: {
        action: 'updateContact',
        phone: wx.getStorageSync("phone")
      },
      success: function(res) {

      }
    })
  },
  createTransfer: function() {
    //console.log('g')
    app.data.teamList = [];
    wx.navigateTo({
      url: '../create/mode/mode',
    })
  },
  create: function() {
    var ctx = wx.createCanvasContext("create")
    // context.drawImage('../img/cloud_1index_2now_black.png', 100, 100, 100, 100);
    // //context.stroke();
    // context.draw();
    var windowWidth = wx.getStorageSync("windowWidth");
    //console.log('bb')
    ctx.drawImage('../img/nav_3newtrs.png', 0, 0, 61, 61)
    ctx.draw()
    // wx.chooseImage({
    //   success: function (res) {
    //     ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
    //     ctx.draw()
    //   }
    // })

    //console.log("create")
  },
  myCanvas: function(c, id, status) {
    // wx.drawCanvas({
    //   canvasId: id,
    //   actions: [],
    //   reserve: false
    // });
    var context = wx.createCanvasContext(id)
    //  context.clearActions();
    //  context = wx.createCanvasContext(id)
    //半径 
    var radius = 7;
    //第一个远开始的坐标
    var startX = 30;
    var startY = 30;
    //弧度
    var rad = Math.PI / 180 * 330;
    //开始的弧度
    var radRotate = Math.PI / 180 * 30;

    var endRotate = Math.PI / 180 * 210;
    var endRad = Math.PI / 180 * 150;
    //角度
    var agree = 180 / Math.PI * radRotate;
    //直线的长度

    var windowWidth = wx.getStorageSync("windowWidth");
    //console.log(windowWidth)
    var line = windowWidth - (startX + 4 * radius);
    var line_count = windowWidth - 2 * (startX + 2 * radius);

    //第一个圆
    if (status == 'done') {
      context.setStrokeStyle("#666666")
    } else {
      context.setStrokeStyle("#F88AAA")
    }

    context.setLineWidth(0.8)
    context.arc(startX, startY, radius, radRotate, rad, false)
    if (status == 'done') {
      context.fillStyle = "#666666"; //填充颜色,默认是黑色
    } else {
      context.fillStyle = "#F88AAA"; //填充颜色,默认是黑色
    }

    context.fill(); //画实心圆
    context.stroke()

    //第一条直线

    context.setLineWidth(0.8)
    if (status == 'done') {
      context.setStrokeStyle("#666666")
    } else {
      context.fillStyle = "#f72361"; //填充颜色,默认是黑色
    }

    var sinx = Math.sin(Math.PI / 180 * 30) * radius;
    var cosx = Math.cos(Math.PI / 180 * 30) * radius;
    context.moveTo(startX + Math.sqrt(radius * radius - sinx * sinx), startX - sinx)
    context.lineTo(line, startX - sinx);


    //第二条直线
    context.moveTo(startX + Math.sqrt(radius * radius - sinx * sinx), startX + sinx)
    context.lineTo(line, startX + sinx);
    context.stroke()

    //渐变
    var grd = context.createLinearGradient(0, 0, 200, 0)
    if (status == 'done') {
      grd.addColorStop(0, '#666666')
      grd.addColorStop(1, '#666666')
    } else {
      grd.addColorStop(0, '#F88AAA')
      grd.addColorStop(1, '#f72361')
    }

    context.setFillStyle(grd)
    context.fillRect(startX + Math.sqrt(radius * radius - sinx * sinx), startX - sinx, line_count / 100 * c, 2 * sinx)
    //console.log('start')
    //console.log(line - startX - cosx);
    //console.log(line / 100 * c)
    context.stroke();




    //console.log(sinx + ":" + sinx)

    //第二个圆
    var endX = Math.sqrt(radius * radius - sinx * sinx) + line;
    var endY = startX
    context.moveTo(endX - cosx, endY - sinx)
    context.arc(endX, endY, radius, endRotate, endRad, false)
    context.stroke()

    // context.moveTo(85, 80)
    // context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    // context.moveTo(125, 80)
    // context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    //context.stroke()

    count += 1;
    if (count >= 16) {
      count = 8;
    }
    //画图片
    var imgWidth = radius * count / 3;
    //http://192.168.1.27:8080/transbox/images/h.png
    if (status == 'done') {
      imgWidth = radius * 4.4;
      context.drawImage('../img/cloud_1index_2now_black.png', startX + Math.sqrt(radius * radius - sinx * sinx) - imgWidth / 2 + line_count / 100 * c, startX - imgWidth / 2, imgWidth, imgWidth);
    } else {
      context.drawImage('../img/cloud_1index_2now.png', startX + Math.sqrt(radius * radius - sinx * sinx) - imgWidth / 2 + line_count / 100 * c, startX - imgWidth / 2, imgWidth, imgWidth);
    }
    //context.stroke()

    context.draw()



  },

  loadMore: function(that) {
    that.setData({
      hidden: true
    })
    phone = wx.getStorageSync("phone");
    //console.log("url:" + transfer)
    wx.request({
      url: transfer,
      data: {
        action: 'getTransferList',
        phone: phone,
        page: page,
        pageSize: page_size
      },
      success: function(res) {
        //that.create();
        console.log("getTransferList")
        console.log(res)
        if (res.data.result == 0) {
          console.log(res.data.obj)
          var tempArray = that.data.list;

          if (page == 0) {


            // 停止下拉动作
            wx.stopPullDownRefresh();
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading()

            tempArray = [];
            //console.log("page:" + page)
          }

          tempArray = tempArray.concat(res.data.obj);
          var scrollIndex = 0;
          //画运动图
          for (var i = 0; i < tempArray.length; i++) {
            var c = 0;
            var distance = parseFloat(tempArray[i].distance);
            var nowDistance = parseFloat(tempArray[i].nowDistance);
            if (nowDistance > distance) {
              c = 100;
            } else {
              c = Math.ceil(nowDistance / distance) * 100;
            }
            if (distance == 0) {
              c = 100;
            }
            tempArray[i].city = tempArray[i].fromCity.split("市")[0];
            tempArray[i].zone = tempArray[i].fromCity.indexOf("市") != -1 ? tempArray[i].fromCity.split("市")[1] : "";

            tempArray[i].city2 = tempArray[i].toHosp.split("市")[0];
            tempArray[i].zone2 = tempArray[i].toHosp.indexOf("市") != -1 ? tempArray[i].toHosp.split("市")[1] : "";
            if (tempArray[i].status == "done") {

              if (tempArray[i].organ.indexOf('肝') != -1) {
                tempArray[i].url = 'cloud_1index_1liver_black';
              } else if (tempArray[i].organ.indexOf('肾') != -1) {
                tempArray[i].url = 'cloud_1index_1kidneys_black';
              } else if (tempArray[i].organ.indexOf('心') != -1) {
                tempArray[i].url = 'cloud_1index_1heart_black';
              } else if (tempArray[i].organ.indexOf('肺') != -1) {
                tempArray[i].url = 'cloud_1index_1lung_black';
              } else if (tempArray[i].organ.indexOf('胰') != -1) {
                tempArray[i].url = 'cloud_1index_1pancreas_black';
              } else if (tempArray[i].organ.indexOf('眼') != -1) {
                tempArray[i].url = 'cloud_1index_1cornea_black';
              }


              that.myCanvas(c, 'c' + tempArray[i].organSeg, tempArray[i].status);
            } else {

              if (tempArray[i].isStart == '0') {
                scrollIndex++;
              }

              if (tempArray[i].organ.indexOf('肝') != -1) {
                tempArray[i].url = 'cloud_1index_1liver';
              } else if (tempArray[i].organ.indexOf('肾') != -1) {
                tempArray[i].url = 'cloud_1index_1kidneys';
              } else if (tempArray[i].organ.indexOf('心') != -1) {
                tempArray[i].url = 'cloud_1index_1heart';
              } else if (tempArray[i].organ.indexOf('肺') != -1) {
                tempArray[i].url = 'cloud_1index_1lung';
              } else if (tempArray[i].organ.indexOf('胰') != -1) {
                tempArray[i].url = 'cloud_1index_1pancreas';
              } else if (tempArray[i].organ.indexOf('眼') != -1) {
                tempArray[i].url = 'cloud_1index_1cornea';
              }
              that.myCanvas(c, 'c' + tempArray[i].organSeg, tempArray[i].status);
              // var interval = setInterval(that.myCanvas, 250, c, 'c' + tempArray[i].organSeg, tempArray[i].status)
              // intervals.push(interval);

            }

            //this.interval = setInterval(this.myCanvas, 250, c + i * 10, 'c' + infoTemp[i])
          }

          that.setData({
            list: tempArray
          })
          that.setData({
            noContent: false
          })

          isCreate = wx.getStorageSync("isCreate");
 
          console.log("isCreate:" + isCreate + ",scrollIndex:" + scrollIndex)
          if (isCreate == true) {
            wx.pageScrollTo({
              scrollTop: scrollIndex * 300,
            })
          }


        } else {
          if (page != 0) {
            wx.showToast({
              title: '加载完毕'
            })
          } else {
            that.setData({
              noContent: true
            })
            wx.showToast({
              title: '暂无转运'
            })
          }
        }
        that.create();
      },
      fail: function(res) {
        wx.showToast({
          title: '暂无加载内容'
        })
        that.create();
      }

    })
  },


  onPullDownRefresh: function() {

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.initLoad();
  },
  onReachBottom: function() {
    wx.hideLoading();
    page++;
    this.loadMore(this);
    //console.log("onReachBottom");
  },

  noticeTransfer: function(organSeg) {
    wx.request({
      url: push,
      data: {
        action: 'sendPushTransfer',
        organSeg: organSeg
      },
      success: function(res) {

      }
    })
  }

})