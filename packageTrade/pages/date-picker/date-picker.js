// pages/trade/date-picker/date-picker.js
const app = getApp();
const util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate: '',
    startTime: '',
    endTime: '',
    type: 'default'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //monthTimeFormat
    let nowDate = new Date();
    nowDate = util.timeFormat('yyyy-MM--dd', nowDate);
    this.setData({
      nowDate: nowDate
    })
  },
  submit: function () {
    let pages = getCurrentPages(),
      prevPage = pages[pages.length - 2];
    let nowDate = this.data.nowDate,
      startTime = this.data.startTime,
      endTime = this.data.endTime,
      type = this.data.type;
    prevPage.getDate(type, startTime,endTime,nowDate);
    wx.navigateBack({
      delta: 1
    })
  },
  choseToday: function () {
    let nowDate = new Date();
    nowDate = util.timeFormat('yyyy-MM--dd', nowDate);
    this.setData({
      startTime: '',
      endTime: '',
      nowDate: nowDate,
      type: 'default'
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value,
      nowDate: '',
      type: 'range'
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value,
      nowDate: '',
      type: 'range'
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})