// pages/trade/income-record/income-record.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    totalOrderCount: 0,
    totalCount: 0,
    list: [],
    userInfo: {},
    activeIndex: 0,
    showLoading: false,
    showDatePickerDialog: false,
    startTime: '',
    radioData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let userInfo = wx.getStorageSync('g_userInfo');
    this.setData({
      userInfo: userInfo
    })
    let url = app.globalData.urlBase + '/spread/mp/money/earnings';
    util.http(url, {}).then(this.dealtData);

    let nowTime = new Date();
    let choseDate = util.timeFormat('yyyy-MM-dd', nowTime);
    this.pageIndex = 0;
    this.params = {
      startTime: choseDate,
      endTime:choseDate
    }
    this.postListData({
      startTime: choseDate,
      endTime: choseDate
    });
  },
  dealtData: function (res) {
    this.setData({
      totalOrderNum: res.totalOrderNum,
      totalEarnings: res.totalEarnings,
      totalCancelEarnings: res.totalCancelEarnings,
      totalNotCancelEarnings: res.totalNotCancelEarnings
    })
  },
  getDate: function (type, startTime, endTime, nowDate) {
    let activeIndex = this.data.activeIndex;
    let params = {};

    if (type === 'default') {
      params.startTime = nowDate;
    } else {
      params.startTime = startTime;
      params.endTime = endTime;
    }
    this.params = params;
    this.postListData(params)
  },
  postListData: function (params) {
    if (!params.endTime) {
      this.setData({
        choseDate: params.startTime
      })
    } else {
      this.setData({
        choseDate: params.startTime + '—' + params.endTime
      })
    }

    let url = '';
    let url2 = app.globalData.urlBase + '/spread/mp/money/earningsRatio';
    let url3 = app.globalData.urlBase + '/spread/mp/money/earningsRatio';
    this.setData({
      showLoading: true
    })
    let typeArr = [2, 3, 4];
    if (this.data.activeIndex === 0) {
      url = app.globalData.urlBase + '/spread/mp/money/earningsSalesList'
    }
    if (this.data.activeIndex === 1) {
      url = app.globalData.urlBase + '/spread/mp/money/earningsManageList'
    }
    if (this.data.activeIndex === 2) {
      url = app.globalData.urlBase + '/spread/mp/money/earningsTrainList'
    }
    this.setData({
      activeType: typeArr[this.data.activeIndex]
    })
    let promise1 = util.http(url, {
      pageIndex: this.pageIndex,
      ...params
    });

    let promise2 = util.http(url2, {
      benefitType: typeArr[this.data.activeIndex],
      pageIndex: this.pageIndex,
      ...params
    });

    let promise3 = util.http(url3, {
      benefitType: typeArr[this.data.activeIndex],
      pageIndex: this.pageIndex
    });

    Promise.all([promise1, promise2, promise3]).then(this.detalListData);
  },
  detalListData: function (res) {
    setTimeout(() => {
      this.setData({
        showLoading: false
      })
    }, 1000)
    let listResult = res[0],
      radioResults = res[1],
      totalRadioResults = res[2];

    let arr = [],
      radioData = {},
      totalRadioData = {};
    if (listResult.errorCode === 9000) {
      arr = listResult.results;
    }

    if (radioResults.errorCode === 9000) {
      radioData.benefit = radioResults.benefit;
      radioData.orderNum = radioResults.orderNum;
      radioData.orderAmount = radioResults.orderAmount;
      radioData.ratio = radioResults.ratio;
    }
    if (totalRadioResults.errorCode === 9000) {
      totalRadioData.benefit = totalRadioResults.benefit;
      totalRadioData.orderNum = totalRadioResults.orderNum;
      totalRadioData.orderAmount = totalRadioResults.orderAmount;
      totalRadioData.ratio = totalRadioResults.ratio;
    }
    if (listResult.resultCount === 0) {
      this.setData({
        noData: true
      })
    }

    this.setData({
      list: arr,
      radioData: radioData,
      totalRadioData: totalRadioResults
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.hasMoreData) {
      return false;
    }
    this.pageIndex++;
    let url = app.globalData.urlBase + '/spread/mp/money/earningsList';
    let _this = this;
    let params = this.params;
    params.pageIndex = this.pageIndex;
    util.http(url, params).then((listResult) => {
      if (listResult.errorCode === 9000) {
        let arr = _this.data.list.concat(listResult.results);
        _this.setData({
          list: arr
        })
      }
    })
  },

  changeTab1: function (e) {
    this.pageIndex = 0;
    let index = parseInt(e.target.dataset.index),
      showLoading = this.data.showLoading;
    if (this.data.activeIndex === index || showLoading) {
      return false;
    }
    this.setData({
      activeIndex: index
    })
    let params = this.params;
    let url = app.globalData.urlBase + '/spread/mp/money/earningsRatio';
    this.postListData(params)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  showDatePicker: function () {
    wx.navigateTo({
      url: '../date-picker/date-picker',
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({

    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})