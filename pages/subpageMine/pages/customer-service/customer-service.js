// pages/mine/customer-service/customer-service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: 0,
    bottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        _this.setData({
          top: res.top,
          bottom: res.bottom
        })
      },
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
  navigateBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '4000938850'
    })
  },
  navigateToProblems: function() {
    wx.navigateTo({
      url: '/pages/subpageMine/pages/common-problems/common-problems',
    })
  },
  navigateToCsWebview: function() {
    wx.navigateTo({
      url: '/pages/subpageMine/pages/cs-webview/cs-webview'
    })
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