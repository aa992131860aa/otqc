import * as echarts from '../../ec-canvas/echarts';
//index.js
//获取应用实例
const app = getApp()
var count = 15;
var realHeight = 0;
var transferRecord = app.data.transferRecord;
var transfer = app.data.transfer;
var weather = app.data.weather;



var collision = [];
var distance = [];
var flow1 = [];
var flow2 = [];
var humidity = [];
var open = [];
var power = [];
var press1 = [];
var press2 = [];
var pupple = [];
var recordAt = [];
var temperature = [];

var collisionTotal = '0次';
var distanceTotal = '0km';
var flow1Total = '0ml/min';
var flow2Total = '0ml/min';
var humidityTotal = '0%';
var openTotal = '0次';
var powerTotal = '0个';
var press1Total = '0mmHg';
var press2Total = '0mmHg';
var puppleTotal = '0个';
var recordAtTotal;
var temperatureTotal = '0℃';



var list = [];
var mThat;
var chart;
var oneIndex = 1;
var twoIndex = 1;

var organSeg;

var weatherList = [];



function initChart(canvas, width, height) {

  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  wx.request({
    url: transferRecord,
    data: {
      action: 'transferRecord',
      organSeg: organSeg
    },
    success: function(res) {

      //初始化数据
      //console.log(res);
      if (res.data.result == 0) {
        list = res.data.obj;
        for (var i = 0; i < list.length; i++) {


          collision.push(list[i].collision);
          distance.push(list[i].distance);
          flow1.push(list[i].flow1);
          flow2.push(list[i].flow2);
          humidity.push(list[i].humidity);
          open.push(list[i].open);
          power.push(list[i].power);
          press1.push(list[i].press1);
          press2.push(list[i].press2);
          pupple.push(list[i].pupple);
          recordAt.push(list[i].recordAt);
          temperature.push(list[i].temperature);

          if (i == (list.length - 1)) {
            //collisionTotal = list[i].collision + '次';
            distanceTotal = list[i].distance + 'km';
            flow1Total = list[i].flow1 + 'ml/min';
            flow2Total = list[i].flow2 + 'ml/min';
            humidityTotal = list[i].humidity + '%';
            //openTotal = list[i].open + '次';
            powerTotal = list[i].power + '%';
            press1Total = list[i].press1 + 'mmHg';
            press2Total = list[i].press2 + 'mmHg';
            puppleTotal = list[i].pupple + '个';
            recordAtTotal = list[i].recordAt;
            temperatureTotal = list[i].temperature + '℃';
          }


        }
        collisionTotal = res.data.collision.length + '次';
        openTotal = res.data.open.length + '次'

      }

      mThat.setData({
        num1: powerTotal,
        num2: temperatureTotal,
        num3: distanceTotal,
        num4: collisionTotal
      })

      if (list.length > 0) {
        mThat.setData({
          loading: false,
          no_content: false
        })
      } else {
        mThat.setData({
          loading: true,
          no_content: true
        })
      }

      //图片的option
      var option = {
        title: {
          text: '电量监控(%)',
          left: 'center',
          top: 10
        },
        color: ["#1d4499"],
        // 图例
        // legend: {
        //   data: ['A'],
        //   top: 50,
        //   left: 'center',
        //   backgroundColor: 'red',
        //   z: 100
        // },
        grid: {
          left: '2%',
          right: '3%',
          bottom: '10%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: recordAt,
          // show: false
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        yAxis: {
          x: 'center',
          type: 'value',
          // name: '(%)',
          // nameLocation: 'end',
          //nameGap:40,
          // splitLine: {
          //   lineStyle: {
          //     type: 'dashed'
          //   }
          // }
          // show: false
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        series: [{
          name: 'A',
          type: 'line',
          smooth: true,
          data: power,
          // symbol: 'circle',     //设定为实心点
          symbolSize: 8, //设定实心点的大小
          itemStyle: {
            borderWidth: 2
          }
        }]
      };

      //运行到图表上
      chart.setOption(option);
    }
  })









  return chart;
}

Page({

  data: {
    ec: {
      onInit: initChart
    },
    webHeight: 400,
    loading: true,
    no_content: false,
    img_left: 1,
    //选中的状态
    base1: true,
    base2: false,
    base3: false,
    base4: false,

    select1: true,
    select2: false,
    select3: false,
    select4: false,

    font1: '电量',
    font2: '温度',
    font3: '距离',
    font4: '碰撞',

    num1: '0%',
    num2: '0℃',
    num3: '0km',
    num4: '0次',

    img1: 'cloud_2detail_2power_on',
    img2: 'cloud_2detail_1temp',
    img3: 'cloud_2detail_1juli',
    img4: 'cloud_2detail_2crash',

    num1: powerTotal,
    num2: temperatureTotal,
    num3: distanceTotal,
    num4: collisionTotal,

    hide3: false,
    hide4: false,


    //转运的参数
    img: 'newtrs_table2_liver_on',
    organ: '',
    organSeg: '',
    date: '',
    city: '',
    city2: '',
    zone: '',
    zone2: '',
    startWeather: '-',
    endWeather: '-',
    startTemperature: '',
    endTemperature: '0',
    weatherList: []

  },

  onShow: function() {
    var that = this;

    that.loadTransfer();


  },
  onUnload:function(){
     oneIndex = 1;
  }
  ,
  onLoad: function(ops) {
    organSeg = ops.organSeg;
    //console.log("organSeg:" + organSeg)
    mThat = this;
    var that = this;

    //realHeight = wx.getStorageSync("realHeight")

    //console.log("realHeight1:" + realHeight)
    // 获取系统信息
    wx.getSystemInfo({

      success: function(res) {
        //console.log(res);
        // 可使用窗口宽度、高度
        //console.log('height=' + res.windowHeight);
        //console.log('width=' + res.windowWidth);
        //console.log('pixelRatio=' + res.pixelRatio);



        var realHeight = (res.windowHeight * (750 / res.windowWidth));
        that.setData({
          webHeight: realHeight - 300 - 100 - 170 - 40 * 2
        })

      }
    });

  },
  //跳转到地图界面
  skipMap:function(){
    console.log('gg')
    wx.navigateTo({
      url: '../map/map?organSeg='+organSeg,
    })
  },
  //加载24小时天气
  loadWeatherHour: function(address) {
    var that = this;
    var temp = [];
    var time = [];
    console.log("address:"+address)
    if (weatherList.length == 0) {
      wx.request({
        url: weather,
        data: {
          action: 'weatherHour',
          weatherArea: address
        },
        success: function(res) {

          weatherList = res.data.showapi_res_body.hourList;
          for(var i = 0;i<weatherList.length;i++){
            var t = weatherList[i].time.substr(0, 4) + "-" + weatherList[i].time.substr(4, 2) + "-" + weatherList[i].time.substr(6, 2)
              time.push(t);
              temp.push(weatherList[i].temperature);
          }
          that.setData({
            img_left: 2,
            base1: false,
            base2: false,
            base3: false,
            base4: true,

            select1: false,
            select2: true,
            select3: false,
            select4: false,
            img1: 'cloud_2detail_1temp',
            img2: 'cloud_2detail_1h2_on',
            img3: 'cloud_2detail_2open',
            img4: 'cloud_2detail_2crash',
            font1: '气泡',
            font2: '天气',
            font3: '开箱',
            font4: '碰撞',

            hide3: true,
            hide4: true,
          })
          that.table(chart, '天气温度(℃)', time, temp);
        }
      })
    } else {
      for (var i = 0; i < weatherList.length; i++) {
        var t = weatherList[i].time.substr(0, 4) + "-" + weatherList[i].time.substr(4, 2) + "-" + weatherList[i].time.substr(6, 2)
        time.push(t);
        temp.push(weatherList[i].temperature);
      }
      that.setData({
        img_left: 2,
        base1: false,
        base2: false,
        base3: false,
        base4: true,

        select1: false,
        select2: true,
        select3: false,
        select4: false,
        img1: 'cloud_2detail_1temp',
        img2: 'cloud_2detail_1h2_on',
        img3: 'cloud_2detail_2open',
        img4: 'cloud_2detail_2crash',
        font1: '气泡',
        font2: '天气',
        font3: '开箱',
        font4: '碰撞',

        hide3: true,
        hide4: true,
      })
      that.table(chart, '天气温度(℃)', time, temp);
    }

  },
  //加载天气
  loadWeather: function(address, t) {
    console.log("加载天气"+this.data.endWeather)
    var that = this;
    wx.request({
      url: weather,
      data: {
        action: 'weather',
        weatherArea: address
      },
      success: function(res) {
        console.log("天气接口")
        console.log(res)
        if ('start' == t) {
          that.setData({
            startWeather: res.data.showapi_res_body.now.weather,
            startTemperature: res.data.showapi_res_body.now.temperature
          })
        }
        if ('end' == t) {
          that.setData({
            endWeather: res.data.showapi_res_body.now.weather,
            endTemperature: res.data.showapi_res_body.now.temperature
          })
        }

      }
    })
  },
  //加载当前这个转运
  loadTransfer: function() {
    var that = this;
    // console.log('11')
    wx.request({
      url: transfer,
      data: {
        action: 'getTransfer',
        organSeg: organSeg
      },
      success: function(res) {
        //console.log(res)
        if (res.data.result == 0) {
          var info = res.data.obj[0];
          var c = 0;
          var distance = parseFloat(info.distance);
          var nowDistance = parseFloat(info.nowDistance);
          if (nowDistance > distance) {
            c = 100;
          } else {
            c = Math.ceil(nowDistance / distance) * 100;
          }
          if (distance == 0) {
            c = 100;
          }
          info.city = info.fromCity.split("市")[0];
          info.zone = info.fromCity.indexOf("市") != -1 ? info.fromCity.split("市")[1] : "";

          info.city2 = info.toHosp.split("市")[0];
          info.zone2 = info.toHosp.indexOf("市") != -1 ? info.toHosp.split("市")[1] : "";

          if (info.organ.indexOf('肝') != -1) {
            info.url = 'newtrs_table2_liver_on';
          } else if (info.organ.indexOf('肾') != -1) {
            info.url = 'newtrs_table2_kidney_on';
          } else if (info.organ.indexOf('心') != -1) {
            info.url = 'newtrs_table2_heart_on';
          } else if (info.organ.indexOf('肺') != -1) {
            info.url = 'newtrs_table2_lung_on';
          } else if (info.organ.indexOf('胰') != -1) {
            info.url = 'newtrs_table2_pancreas_on';
          } else if (info.organ.indexOf('眼') != -1) {
            info.url = 'newtrs_table2_cornea_on';
          }
         console.log('address:'+info.fromCity+','+info.toHosp)
          that.myCanvas(c);

          if (that.data.startWeather == '-') {

            that.loadWeather(info.fromCity, 'start');
          }
          if (that.data.endWeather == '-') {
            that.loadWeather(info.toHosp, 'end');

          }

          that.setData({
            city: info.city,
            zone: info.zone,
            city2: info.city2,
            zone2: info.zone2,
            img: info.url,
            organ: info.organ,
            organSeg: info.modifyOrganSeg == '' ? info.organSeg : info.modifyOrganSeg,
            date: info.getTime.split(' ')[0]

          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  clickOne: function(p) {
    var index = p.target.dataset.index;
    console.log("one:" + oneIndex)
    //基础参数
    if (index == 1 && oneIndex != 1) {
      oneIndex = 1;
      twoIndex = 1;
      this.setData({
        img_left: 1,
        base1: true,
        base2: false,
        base3: false,
        base4: false,

        select1: true,
        select2: false,
        select3: false,
        select4: false,
        img1: 'cloud_2detail_2power_on',
        img2: 'cloud_2detail_1temp',
        img3: 'cloud_2detail_1juli',
        img4: 'cloud_2detail_2crash',
        font1: '电量',
        font2: '温度',
        font3: '距离',
        font4: '碰撞',

        num1: powerTotal,
        num2: temperatureTotal,
        num3: distanceTotal,
        num4: collisionTotal,

        hide3: false,
        hide4: false,
      })
      this.table(chart, '电量监控(%)', recordAt, power);
    } else if (index == 2 && oneIndex != 2) {
      oneIndex = 2;
      twoIndex = 1;
      this.setData({
        img_left: 1,
        base1: false,
        base2: true,
        base3: false,
        base4: false,

        select1: true,
        select2: false,
        select3: false,
        select4: false,
        img1: 'cloud_2detail_1temp_on',
        img2: 'cloud_2detail_1h2',
        img3: 'cloud_2detail_2open',
        img4: 'cloud_2detail_2crash',
        font1: '温度',
        font2: '湿度',
        font3: '开箱',
        font4: '碰撞',

        num1: temperatureTotal,
        num2: humidityTotal,
        num3: openTotal,
        num4: collisionTotal,

        hide3: false,
        hide4: false,
      })
      this.table(chart, '温度监控(℃)', recordAt, temperature);
    } else if (index == 3 && oneIndex != 3) {
      oneIndex = 3;
      twoIndex = 1;
      this.setData({
        img_left: 1,
        base1: false,
        base2: false,
        base3: true,
        base4: false,

        select1: true,
        select2: false,
        select3: false,
        select4: false,

        img1: 'cloud_2detail_1stress_on',
        img2: 'cloud_2detail_1stress',
        img3: 'cloud_2detail_1wind',
        img4: 'cloud_2detail_1wind',

        font1: '流速1',
        font2: '流速2',
        font3: '压力1',
        font4: '压力2',

        num1: flow1Total,
        num2: flow2Total,
        num3: press1Total,
        num4: press2Total,

        hide3: false,
        hide4: false,
      })
      this.table(chart, '流速1监控(ml/min)', recordAt, flow1);
    } else if (index == 4 && oneIndex != 4) {
      oneIndex = 4;
      twoIndex = 1;
      this.setData({
        img_left: 1,
        base1: false,
        base2: false,
        base3: false,
        base4: true,

        select1: true,
        select2: false,
        select3: false,
        select4: false,
        img1: 'cloud_2detail_1temp_on',
        img2: 'cloud_2detail_1h2',
        img3: 'cloud_2detail_2open',
        img4: 'cloud_2detail_2crash',
        font1: '气泡',
        font2: '天气',
        font3: '开箱',
        font4: '碰撞',

        num1: puppleTotal,
        num2: this.data.endTemperature + '℃',


        hide3: true,
        hide4: true,
      })
      this.table(chart, '气泡监控(个)', recordAt, pupple);
    }

  },
  clickTwo: function(p) {
    var index = p.target.dataset.index;
    //console.log("index:" + index + ",twoIndex:" + twoIndex)
    if (oneIndex == 1) {
      if (index == 1 && twoIndex != 1) {
        twoIndex = 1;
        this.setData({
          img_left: 1,
          base1: true,
          base2: false,
          base3: false,
          base4: false,

          select1: true,
          select2: false,
          select3: false,
          select4: false,

          img1: 'cloud_2detail_2power_on',
          img2: 'cloud_2detail_1temp',
          img3: 'cloud_2detail_1juli',
          img4: 'cloud_2detail_2crash',

          font1: '电量',
          font2: '温度',
          font3: '距离',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '电量监控(%)', recordAt, power);
      } else if (index == 2 && twoIndex != 2) {
        twoIndex = 2;
        this.setData({
          img_left: 2,
          base1: true,
          base2: false,
          base3: false,
          base4: false,

          select1: false,
          select2: true,
          select3: false,
          select4: false,

          img1: 'cloud_2detail_2power',
          img2: 'cloud_2detail_1temp_on',
          img3: 'cloud_2detail_1juli',
          img4: 'cloud_2detail_2crash',

          font1: '电量',
          font2: '温度',
          font3: '距离',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '温度监控(℃)', recordAt, temperature);
      } else if (index == 3 && twoIndex != 3) {
        twoIndex = 3;
        this.setData({
          img_left: 3,
          base1: true,
          base2: false,
          base3: false,
          base4: false,

          select1: false,
          select2: false,
          select3: true,
          select4: false,

          img1: 'cloud_2detail_2power',
          img2: 'cloud_2detail_1temp',
          img3: 'cloud_2detail_1juli_on',
          img4: 'cloud_2detail_2crash',

          font1: '电量',
          font2: '温度',
          font3: '距离',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '距离监控(km)', recordAt, distance);
      } else if (index == 4 && twoIndex != 4) {
        twoIndex = 4;
        this.setData({
          img_left: 4,
          base1: true,
          base2: false,
          base3: false,
          base4: false,

          select1: false,
          select2: false,
          select3: false,
          select4: true,

          img1: 'cloud_2detail_2power',
          img2: 'cloud_2detail_1temp',
          img3: 'cloud_2detail_1juli',
          img4: 'cloud_2detail_2crash_on',

          font1: '电量',
          font2: '温度',
          font3: '距离',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '碰撞监控(次)', recordAt, collision);
      }
    } else if (oneIndex == 2) {
      if (index == 1 && twoIndex != 1) {
        twoIndex = 1;
        this.setData({
          img_left: 1,
          base1: false,
          base2: true,
          base3: false,
          base4: false,

          select1: true,
          select2: false,
          select3: false,
          select4: false,
          img1: 'cloud_2detail_1temp_on',
          img2: 'cloud_2detail_1h2',
          img3: 'cloud_2detail_2open',
          img4: 'cloud_2detail_2crash',
          font1: '温度',
          font2: '湿度',
          font3: '开箱',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '温度监控(℃)', recordAt, temperature);
      } else if (index == 2 && twoIndex != 2) {
        twoIndex = 2;
        this.setData({
          img_left: 2,
          base1: false,
          base2: true,
          base3: false,
          base4: false,

          select1: false,
          select2: true,
          select3: false,
          select4: false,
          img1: 'cloud_2detail_1temp',
          img2: 'cloud_2detail_1h2_on',
          img3: 'cloud_2detail_2open',
          img4: 'cloud_2detail_2crash',
          font1: '温度',
          font2: '湿度',
          font3: '开箱',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '湿度监控(%)', recordAt, humidity);
      } else if (index == 3 && twoIndex != 3) {
        twoIndex = 3;
        this.setData({
          img_left: 3,
          base1: false,
          base2: true,
          base3: false,
          base4: false,

          select1: false,
          select2: false,
          select3: true,
          select4: false,
          img1: 'cloud_2detail_1temp',
          img2: 'cloud_2detail_1h2',
          img3: 'cloud_2detail_2open_on',
          img4: 'cloud_2detail_2crash',
          font1: '温度',
          font2: '湿度',
          font3: '开箱',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '开箱(次)', recordAt, open);
      } else if (index == 4 && twoIndex != 4) {
        twoIndex = 4;
        this.setData({
          img_left: 4,
          base1: false,
          base2: true,
          base3: false,
          base4: false,

          select1: false,
          select2: false,
          select3: false,
          select4: true,
          img1: 'cloud_2detail_1temp',
          img2: 'cloud_2detail_1h2',
          img3: 'cloud_2detail_2open',
          img4: 'cloud_2detail_2crash_on',
          font1: '温度',
          font2: '湿度',
          font3: '开箱',
          font4: '碰撞',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '碰撞监控(℃)', recordAt, collision);
      }
    } else if (oneIndex == 3) {
      if (index == 1 && twoIndex != 1) {
        twoIndex = 1;
        this.setData({
          img_left: 1,
          base1: false,
          base2: false,
          base3: true,
          base4: false,

          select1: true,
          select2: false,
          select3: false,
          select4: false,

          img1: 'cloud_2detail_1stress_on',
          img2: 'cloud_2detail_1stress',
          img3: 'cloud_2detail_1wind',
          img4: 'cloud_2detail_1wind',

          font1: '流速1',
          font2: '流速2',
          font3: '压力1',
          font4: '压力2',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '流速1监控(ml/min)', recordAt, flow1);
      } else if (index == 2 && twoIndex != 2) {
        twoIndex = 2;
        this.setData({
          img_left: 2,
          base1: false,
          base2: false,
          base3: true,
          base4: false,

          select1: false,
          select2: true,
          select3: false,
          select4: false,

          img1: 'cloud_2detail_1stress',
          img2: 'cloud_2detail_1stress_on',
          img3: 'cloud_2detail_1wind',
          img4: 'cloud_2detail_1wind',

          font1: '流速1',
          font2: '流速2',
          font3: '压力1',
          font4: '压力2',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '流速2监控(ml/min)', recordAt, flow2);
      } else if (index == 3 && twoIndex != 3) {
        twoIndex = 3;
        this.setData({
          img_left: 3,
          base1: false,
          base2: false,
          base3: true,
          base4: false,

          select1: false,
          select2: false,
          select3: true,
          select4: false,

          img1: 'cloud_2detail_1stress',
          img2: 'cloud_2detail_1stress',
          img3: 'cloud_2detail_1wind_on',
          img4: 'cloud_2detail_1wind',

          font1: '流速1',
          font2: '流速2',
          font3: '压力1',
          font4: '压力2',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '压力1监控(mmHg)', recordAt, press1);
      } else if (index == 4 && twoIndex != 4) {
        twoIndex = 4;
        this.setData({
          img_left: 4,
          base1: false,
          base2: false,
          base3: true,
          base4: false,

          select1: false,
          select2: false,
          select3: false,
          select4: true,

          img1: 'cloud_2detail_1stress',
          img2: 'cloud_2detail_1stress',
          img3: 'cloud_2detail_1wind',
          img4: 'cloud_2detail_1wind_on',

          font1: '流速1',
          font2: '流速2',
          font3: '压力1',
          font4: '压力2',

          hide3: false,
          hide4: false,
        })
        this.table(chart, '压力2监控(mmHg)', recordAt, press2);
      }
    } else if (oneIndex == 4) {
      if (index == 1 && twoIndex != 1) {
        twoIndex = 1;
        this.setData({
          img_left: 1,
          base1: false,
          base2: false,
          base3: false,
          base4: true,

          select1: true,
          select2: false,
          select3: false,
          select4: false,
          img1: 'cloud_2detail_1temp_on',
          img2: 'cloud_2detail_1h2',
          img3: 'cloud_2detail_2open',
          img4: 'cloud_2detail_2crash',
          font1: '气泡',
          font2: '天气',
          font3: '开箱',
          font4: '碰撞',

          hide3: true,
          hide4: true,
        })
        this.table(chart, '气泡监控(个)', recordAt, pupple);
      } else if (index == 2 && twoIndex != 2) {
        twoIndex = 2;
        this.loadWeatherHour(this.data.city2);

      }
    }
  },
  myCanvas: function(c) {
    var context = wx.createCanvasContext('myCanvas')
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

    context.setStrokeStyle("#F88AAA")


    context.setLineWidth(0.8)
    context.arc(startX, startY, radius, radRotate, rad, false)

    context.fillStyle = "#F88AAA"; //填充颜色,默认是黑色


    context.fill(); //画实心圆
    context.stroke()

    //第一条直线

    context.setLineWidth(0.8)

    context.fillStyle = "#f72361"; //填充颜色,默认是黑色


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

    grd.addColorStop(0, '#F88AAA')
    grd.addColorStop(1, '#f72361')


    context.setFillStyle(grd)
    context.fillRect(startX + Math.sqrt(radius * radius - sinx * sinx), startX - sinx, line_count / 100 * c, 2 * sinx)

    context.stroke();






    //第二个圆
    var endX = Math.sqrt(radius * radius - sinx * sinx) + line;
    var endY = startX
    context.moveTo(endX - cosx, endY - sinx)
    context.arc(endX, endY, radius, endRotate, endRad, false)
    context.stroke()



    count += 1;
    if (count >= 16) {
      count = 8;
    }
    //画图片
    var imgWidth = radius * 4;
    //http://192.168.1.27:8080/transbox/images/h.png

    context.drawImage('../img/cloud_1index_2now.png', startX + Math.sqrt(radius * radius - sinx * sinx) - imgWidth / 2 + line_count / 100 * c, startX - imgWidth / 2, imgWidth, imgWidth);

    //context.stroke()

    context.draw()



  },
  table: function(chart, title, dataX, dataY) {
    //图片的option
    var option = {
      title: {
        text: title,
        left: 'center',
        top: 10
      },
      color: ["#1d4499"],
 
      grid: {
        left: '2%',
        right: '3%',
        bottom: '10%',
        containLabel: true
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dataX,
        // show: false
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        }
      },
      yAxis: {
        x: 'center',
        type: 'value',
        // name: '(%)',
        // nameLocation: 'end',
        //nameGap:40,
        // splitLine: {
        //   lineStyle: {
        //     type: 'dashed'
        //   }
        // }
        // show: false
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        }
      },
      series: [{
        name: 'A',
        type: 'line',
        smooth: true,
        data: dataY,
        // symbol: 'circle',     //设定为实心点
        symbolSize: 8, //设定实心点的大小
        itemStyle: {
          borderWidth: 2
        }
      }]
    };

    //运行到图表上
    chart.setOption(option);
  }
})