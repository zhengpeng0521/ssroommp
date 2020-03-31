// pages/index/ticket/ticket-detail/purchase/unpaid/cancelOrder/cancelOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      animateOfBtn: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderData: options
    });
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

  navToIndexPage: function () {
    this.setData({
        animateOfBtn: true
    });
    setTimeout( () => {
        wx.switchTab({
            url: '/pages/tabBar/index/index'
        });
    }, 100);
  }

})
