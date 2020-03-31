// pages/trade/withdraw-record/withdraw-record.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hasNoMoreData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let url = app.globalData.urlBase + '/spread/mp/withdrawal/myWithdrawalList';
    util.http(url, {}).then(this.dealtData)
  },
  dealtData: function(res) {
    if (res.errorcode === 9000) {
      this.hasNoMoreData = res.result.length === 10;
      this.setData({
        list: res.result,
        hasNoMoreData: res.result.length === 10
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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