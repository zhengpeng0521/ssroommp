// pages/subpageMine/pages/merchants-orders/merchants-orders.js
var app = getApp()
var util = require("../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData:[],
    pageIndex: 1,
    pageSize: 10,
    listLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.getListData().then((res) => {
      this.setData({
        orderData: res.results,
        listLoading: false
      })
      console.log("res.results", res)

    });
  },

  linkCust: function (e) {
    if (e.target.dataset.status !== '3') {
      return false;
    }

    wx.makePhoneCall({
      phoneNumber: e.target.dataset.mobile //仅为示例，并非真实的电话号码
    })
  },

  getListData() {
    this.setData({
      listLoading: true
    })
    let params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    const url = app.globalData.urlBase + 'spread/mp/mine/queryStoreOrder'
    return util.http(url, params)
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
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.getListData().then(res => {
      const { results } = res
      this.setData({
        orderData: results,
        listLoading: false
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.hasMoreData) {
      this.setData({
        listLoading: false
      })
      return false
    }
    this.pageIndex++;
    this.getListData().then(res => {
      console.log("加载更多", res);
      this.hasMoreData = res.results.length === this.pageSize;
      this.setData({
        orderData: this.data.orderData.concat(res.results),
        listLoading: false
      })
    });
  }
})
