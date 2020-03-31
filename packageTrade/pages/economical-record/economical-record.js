// pages/trade/economical-record/economical-record.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalOrderNum: 0,
    totalSaveMoney: 0,
    month: 4,
    todayOrderNum: 0,
    todayOsaveMoney: 0,
    list: [],
    showLoading: false,
    noData: false,
    showDateDialog: false,
    hasMoreData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let month = util.timeFormat('yyyy-MM', new Date);
    this.setData({
      month: month
    });
    this.pageIndex = 0;
    let url = app.globalData.urlBase + '/spread/mp/money/saveMoney';
    util.http(url, {}).then(res => {
      this.setData({
        totalOrderNum: res.totalOrderNum,
        totalSaveMoney: res.totalSaveMoney
      })
    })
    this.postListData(month);
  },
  postListData: function(choseDate) {
    let url1 = app.globalData.urlBase + '/spread/mp/money/saveMoneyList';
    let url2 = app.globalData.urlBase + '/spread/mp/money/saveMoneyMonth';
    let promise1 = util.http(url1, {
      pageIndex: this.pageIndex,
      pageSize: 10,
      date: choseDate
    })
    let promise2 = util.http(url2, {
      date: choseDate
    });
    this.setData({
      showLoading: true
    })
    Promise.all([promise1, promise2]).then(this.detalListData);
  },
  detalListData: function(res) {
    let res1 = res[0],
      res2 = res[1],
      arr = [];
    arr = res1.results;
    this.hasMoreData = res1.results.length === 10;

    this.setData({
      list: arr,
      noData: res1.data.resultCount === 0,
      showLoading: false,
      todayOrderNum: res2.orderNum,
      todayOsaveMoney: res2.saveMoney
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
    let url = app.globalData.urlBase + '/spread/mp/money/saveMoneyList';
    let _this = this;
    util.http(url, {
      pageIndex: this.pageIndex,
      pageSize: 10,
      date:this.choseDate
    }).then((res) => {
      let arr = _this.data.list.concat(res.results);
      _this.hasMoreData = arr.length === 10;
      _this.setData({
        list: arr,
        hasMoreData: arr.length === 10,
      })
    })
  },

  choseDate: function(e) {
    let choseDateVal = e.detail.value;
    this.pageIndex = 0;
    this.choseDateVal = choseDateVal;
    this.postListData(choseDateVal);
    this.setData({
      month: choseDateVal
    })
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