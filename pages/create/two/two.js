//index.js
//获取应用实例
const app = getApp()

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
var modify ;

Page({

  data: {
    organNum: 1,
    bloodNum: 1,
    sampleNum: 1,
    organ1: 'newtrs_table2_heart',
    organ2: 'newtrs_table2_liver',
    organ3: 'newtrs_table2_lung',
    organ4: 'newtrs_table2_kidney',
    organ5: 'newtrs_table2_pancreas',
    organ6: 'newtrs_table2_cornea',
    font1: 'font6',
    font2: 'font6',
    font3: 'font6',
    font4: 'font6',
    font5: 'font6',
    font6: 'font6',
    blood1: 'newtrs_table2_blooda',
    blood2: 'newtrs_table2_bloodb',
    blood3: 'newtrs_table2_bloodab',
    blood4: 'newtrs_table2_bloodo',
    sample1: 'newtrs_table2_spleen',
    sample2: 'newtrs_table2_xueguan',

    //第三步
    fromCity: '',
    method: '',
    no: ''

  },

  onShow: function() {
    var that = this;


  },
  onLoad: function(ops) {
    console.log(ops)
    var that = this;
    organSeg = ops.organSeg;
    organ = ops.organ;
    boxNo = ops.boxNo;
    modifyOrganSeg = ops.modifyOrganSeg;
    getTime = ops.getTime;

    organNum = ops.organNum;
    blood = ops.blood;
    bloodNum = ops.bloodNum;
    sample = ops.sample;
    sampleNum = ops.sampleNum;

    fromCity = ops.fromCity;
    method = ops.method;
    no = ops.no;
    modify = ops.modify;


    that.setData({
      organNum: organNum,
      bloodNum: bloodNum,
      sampleNum: sampleNum,

      fromCity: fromCity,
      method: method,
      no: no
    })

    this.organChange();
    this.bloodChange();
    this.sampleChange();


  },
  clickMinus: function(e) {
    var index = e.currentTarget.dataset.index;
    if (index == 1) {
      if (organNum > 1) {
        organNum--;
        this.setData({
          organNum: organNum
        })
      }

    } else if (index == 2) {

      if (bloodNum > 1) {
        bloodNum--;
        this.setData({
          bloodNum: bloodNum
        })
      }

    } else if (index == 3) {

      if (sampleNum > 1) {
        sampleNum--;
        this.setData({
          sampleNum: sampleNum
        })
      }

    }
  },
  clickPlus: function(e) {
    var index = e.currentTarget.dataset.index;
    
    if (index == 1) {
      if (organNum < 10) {
        organNum++;
        this.setData({
          organNum: organNum
        })
      }

    } else if (index == 2) {

      if (bloodNum < 10) {
        bloodNum++;
        this.setData({
          bloodNum: bloodNum
        })
      }

    } else if (index == 3) {

      if (sampleNum < 10) {
        sampleNum++;
        this.setData({
          sampleNum: sampleNum
        })
      }

    }
  },
  clickOrgan: function(e) {
    var o = e.currentTarget.dataset.o;
    organ = o;
    this.organChange();

  },
  organChange: function() {
    if (organ == '心脏') {
      this.setData({
        font1: 'fontr',
        font2: 'font6',
        font3: 'font6',
        font4: 'font6',
        font5: 'font6',
        font6: 'font6',
        organ1: 'newtrs_table2_heart_on',
        organ2: 'newtrs_table2_liver',
        organ3: 'newtrs_table2_lung',
        organ4: 'newtrs_table2_kidney',
        organ5: 'newtrs_table2_pancreas',
        organ6: 'newtrs_table2_cornea'
      })
    } else if (organ == '肝脏') {
      this.setData({
        font1: 'font6',
        font2: 'fontr',
        font3: 'font6',
        font4: 'font6',
        font5: 'font6',
        font6: 'font6',
        organ1: 'newtrs_table2_heart',
        organ2: 'newtrs_table2_liver_on',
        organ3: 'newtrs_table2_lung',
        organ4: 'newtrs_table2_kidney',
        organ5: 'newtrs_table2_pancreas',
        organ6: 'newtrs_table2_cornea'
      })
    } else if (organ == '肺') {
      this.setData({
        font1: 'font6',
        font2: 'font6',
        font3: 'fontr',
        font4: 'font6',
        font5: 'font6',
        font6: 'font6',
        organ1: 'newtrs_table2_heart',
        organ2: 'newtrs_table2_liver',
        organ3: 'newtrs_table2_lung_on',
        organ4: 'newtrs_table2_kidney',
        organ5: 'newtrs_table2_pancreas',
        organ6: 'newtrs_table2_cornea'
      })
    } else if (organ == '肾脏') {
      this.setData({
        font1: 'font6',
        font2: 'font6',
        font3: 'font6',
        font4: 'fontr',
        font5: 'font6',
        font6: 'font6',
        organ1: 'newtrs_table2_heart',
        organ2: 'newtrs_table2_liver',
        organ3: 'newtrs_table2_lung',
        organ4: 'newtrs_table2_kidney_on',
        organ5: 'newtrs_table2_pancreas',
        organ6: 'newtrs_table2_cornea'
      })
    } else if (organ == '胰脏') {
      this.setData({
        font1: 'font6',
        font2: 'font6',
        font3: 'font6',
        font4: 'font6',
        font5: 'fontr',
        font6: 'font6',
        organ1: 'newtrs_table2_heart',
        organ2: 'newtrs_table2_liver',
        organ3: 'newtrs_table2_lung',
        organ4: 'newtrs_table2_kidney',
        organ5: 'newtrs_table2_pancreas_on',
        organ6: 'newtrs_table2_cornea'
      })
    } else if (organ == '眼角膜') {
      this.setData({
        font1: 'font6',
        font2: 'font6',
        font3: 'font6',
        font4: 'font6',
        font5: 'font6',
        font6: 'fontr',
        organ1: 'newtrs_table2_heart',
        organ2: 'newtrs_table2_liver',
        organ3: 'newtrs_table2_lung',
        organ4: 'newtrs_table2_kidney',
        organ5: 'newtrs_table2_pancreas',
        organ6: 'newtrs_table2_cornea_on'
      })
    }
  },
  clickBlood: function(e) {
    var b = e.currentTarget.dataset.b;
    blood = b;
    this.bloodChange();
  },
  bloodChange: function() {
    if (blood == 'a') {
      this.setData({
        blood1: 'newtrs_table2_blooda_on',
        blood2: 'newtrs_table2_bloodb',
        blood3: 'newtrs_table2_bloodab',
        blood4: 'newtrs_table2_bloodo',
      })
    } else if (blood == 'b') {
      this.setData({
        blood1: 'newtrs_table2_blooda',
        blood2: 'newtrs_table2_bloodb_on',
        blood3: 'newtrs_table2_bloodab',
        blood4: 'newtrs_table2_bloodo',
      })
    } else if (blood == 'ab') {
      this.setData({
        blood1: 'newtrs_table2_blooda',
        blood2: 'newtrs_table2_bloodb',
        blood3: 'newtrs_table2_bloodab_on',
        blood4: 'newtrs_table2_bloodo',
      })
    } else if (blood == 'o') {
      this.setData({
        blood1: 'newtrs_table2_blooda',
        blood2: 'newtrs_table2_bloodb',
        blood3: 'newtrs_table2_bloodab',
        blood4: 'newtrs_table2_bloodo_on',
      })
    }
  },
  clickSample: function(e) {
    var s = e.currentTarget.dataset.s;
    sample = s;
    this.sampleChange();

  },
  sampleChange: function() {
    if (sample == '脾脏') {
      this.setData({
        sample1: 'newtrs_table2_spleen_on',
        sample2: 'newtrs_table2_xueguan',
      })
    } else if (sample == '血管') {
      this.setData({
        sample1: 'newtrs_table2_spleen',
        sample2: 'newtrs_table2_xueguan_on',
      })
    }
  },
  clickPre: function() {
    var that = this;
    let pages = getCurrentPages(); //当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    prevPage.setData({
      organ: organ,
      organNum: organNum,
      blood: blood,
      bloodNum: bloodNum,
      sample: sample,
      sampleNum: sampleNum,
      fromCity: that.data.fromCity,
      method: that.data.method,
      no: that.data.no
    })
    wx.navigateBack({

    })
  },
  clickNext: function() {
    var that = this;
    wx.navigateTo({
      url: '../../create/three/three?organSeg=' + organSeg + '&organ=' + organ + '&modifyOrganSeg=' + modifyOrganSeg + '&boxNo=' +boxNo + '&getTime=' + getTime + '&organNum=' + that.data.organNum + '&blood=' + blood + '&bloodNum=' + that.data.bloodNum + '&sample=' + sample + '&sampleNum=' + that.data.sampleNum +
        '&fromCity=' + fromCity + '&method=' + method + '&no=' + no + '&modify=' + modify,
    })
  }


})