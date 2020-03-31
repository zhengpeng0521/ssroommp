// pages/distribution/payment-success/payment-success.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData: {},
    accessAppointFlag: false, //是否预约型商品
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.options = options
    const user = wx.getStorageSync("g_userInfo")
    this.setData({
      user,
      accessAppointFlag: options.accessAppointFlag
    })
    this.getOrderDetail()
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

  getOrderDetail() { 
    const url = app.globalData.urlBase + "spread/mp/drp/order/findOne"
    const params = {
      orderId: this.options.orderId
    }
    util.http(url, params).then(res => { 
      this.setData({
        orderData:res
      })
    })
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
  onNavToOrder() { 
    wx.navigateTo({
      url: `/pages/distribution/order-detail/order-detail?orderId=${this.options.orderId}`,
    });
  },
  onNavToIndex() { 
    wx.switchTab({
      url: '/pages/distribution/index/index',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  selectAppointDay() { 
    wx.navigateTo({
      url: `/pages/distribution/calendar/calendar?orderId=${this.options.orderId}`,
    });
  }
})