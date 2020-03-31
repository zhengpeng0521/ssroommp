// pages/mine/record/record.js
const app = getApp()
const util = require("../../../utils/util")
const flowApi = app.globalData.urlBase + 'spread/mp/cardTask/queryFragFlow'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flowList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
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
    this.queryFragFlow().then(res => {
      this.setData({
        flowList:res.results
      })
    })
  },
  queryFragFlow() { 
    this.setData({
      listLoading: true
    })
    let params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    return util.http(flowApi, params)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.queryFragFlow().then(res => {
      const { results } = res
      this.setData({
        flowList: results
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
        loading: false
      })
      return;
    }
    this.pageIndex++;
    this.queryFragFlow().then(res => {
      const { results } = res
      this.hasMoreData = this.pageSize === results.length
      this.setData({
        flowList: this.data.flowList.concat(results)
      })
    })
  }
})