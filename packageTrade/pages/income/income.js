// pages/trade/income/income.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    earnings: 0,
    cancelEarnings: 0,
    notCancelEarnings: 0,
    totalOrderNum: 0,
    totalEarnings: 0,
    notCancelEarnings: 0,
    list: [],
    userInfo: {},
    activeIndex: 0,
    showLoading: false,
    todayOrderNum: 0,
    todayOrderAmount: 0,
    hasMoreData: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('g_userInfo');
    this.setData({
      userInfo: userInfo
    })
    let url = app.globalData.urlBase + '/spread/mp/money/earnings';
    util.http(url, {}).then(this.dealtData);
    this.pageIndex = 0;
    this.postListData(2);
  },
  dealtData: function(res) {
    this.setData({
      earnings: res.earnings,
      cancelEarnings: res.cancelEarnings,
      notCancelEarnings: res.notCancelEarnings,
      totalOrderNum: res.totalOrderNum,
      totalEarnings: res.totalEarnings,
      notCancelEarnings: res.notCancelEarnings,
    })
  },
  postListData: function(type) {
    this.setData({
      showLoading: true
    })

    let url = '';
    let url2 = app.globalData.urlBase + '/spread/mp/money/earningsRatio';

    let date = util.timeFormat('yyyy-MM-dd', new Date());

    if (type === 2) {
      url = app.globalData.urlBase + 'spread/mp/money/earningsSalesList';
    }
    if (type === 3) {
      url = app.globalData.urlBase + 'spread/mp/money/earningsManageList';
    }
    if (type === 4) {
      url = app.globalData.urlBase + 'spread/mp/money/earningsTrainList';
    }

    let params = {
      pageIndex: this.pageIndex,
      pageSize: 10,
      startTime: date,
      endTime:date,
      benefitType: type+''
    }

    let promise1 = util.http(url, params);
    let promise2 = util.http(url2, params);

    Promise.all([promise1, promise2]).then(this.detalListData)

  },
  detalListData: function(res) {
    let res1 = res[0],
      res2 = res[1];
    if (res1.errorCode === 9000) {
      let arr = [];
      arr = res1.results;
      this.hasMoreData = arr.length === 10
      this.setData({
        list: arr,
        noData: res1.data.resultCount === 0,
        hasMoreData: arr.length === 10
      })
    }
    if (res2.errorCode === 9000) {
      this.setData({
        todayOrderNum: res2.orderNum,
        todayOrderAmount: res2.orderAmount
      })
    }
    this.setData({
      showLoading: false
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.hasMoreData) {
      return false;
    }
    this.pageIndex++;
    let date = util.timeFormat('yyyy-MM-dd', new Date());
    let params = {
      type: this.type,
      pageIndex: this.pageIndex,
      statTime: date,
      endTime: date
    }
    let url = app.globalData.urlBase + '/spread/mp/money/earningsList';
    let _this = this;
    util.http(url, params).then((res) => {
      let arr = this.data.list.concat(res.results);
      _this.hasMoreData = arr.length === 10;
      _this.setData({
        list: arr,
        hasMoreData: this.hasMoreData
      })
    })
  },

  changeTab: function(e) {
    this.pageIndex = 0;
    let index = parseInt(e.target.dataset.index),
      showLoading = this.data.showLoading;
    if (this.data.activeIndex === index || showLoading) {
      return false;
    }
    this.setData({
      activeIndex: index
    })
    let benefitTypeArr = [2, 3, 4];
    this.type = benefitTypeArr[index];
    this.postListData(benefitTypeArr[index])
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})