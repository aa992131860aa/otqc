import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
 
function initChart(canvas, width, height) {
  const  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: ' ',
      left: 'center'
    },
    color: ["#37A2DA"],
    //图例
    // legend: {
    //   data: ['A'],
    //   top: 50,
    //   left: 'center',
    //   backgroundColor: 'red',
    //   z: 100
    // },
    grid: {
      containLabel: true
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    } ]
  };
  wx.request({
    url: 'http://www.baidu.com',
    data:{},
    success:function(res){
      

        chart.setOption(option);

      
     
    }
  })
 
  return chart;
}

Page({
 
  data: {
    ec: {
      onInit: initChart
    }
  },
  onLoad:function(){
    


  },

  onReady() {
  }
});
