// pages/trade/withdraw/withdraw.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    withdrawDialogBool: false,
    frozenBenefit: 0,
    freeBenefit: 0,
    amount: null
  },

  allWithDraw: function() {
    if (this.data.freeBenefit === 0) {
      return false;
    }
    this.setData({
      amount: this.data.freeBenefit
    })
  },
  withDrawAction: function() {
    let url = app.globalData.urlBase + '/spread/mp/withdrawal/myWithdrawal';
    util.http(url, {
      money: this.data.amount
    }).then((res) => {
      if (res.errorCode === 9000) {
        wx.showModal({
          title: '提示',
          content: '提现成功',
          showCancel: false,
          success:function(res){
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/trade/withdraw-record/withdraw-record',
              })
            } 
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '提现失败，原因' + res.errorMessage,
          showCancel: false
        })
      }
    })
  },
  changeInputVal:function(e){
    this.setData({
      amount:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let url = app.globalData.urlBase + '/spread/mp/withdrawal/myCommission';
    util.http(url, {}).then(this.dealtData);
  },
  dealtData: function(res) {
    this.setData({
      freeBenefit: res.freeBenefit,
      frozenBenefit: res.frozenBenefit
    })
  },
  showWithdrawDialog: function() {
    this.setData({
      withdrawDialogBool: true
    })
  },
  closeWithdrawDialog: function() {
    this.setData({
      withdrawDialogBool: false
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})