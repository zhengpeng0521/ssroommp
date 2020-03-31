// pages/experience/experience.js
const app = getApp()
import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.getListData().then(res => {
      const { results } = res
      this.setData({
        commentList: results
      })
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
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.getListData().then(res => {
      const { results } = res
      this.setData({
        commentList: results
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
    this.getListData().then(res => {
      const { results } = res
      this.hasMoreData = this.pageSize === results.length
      this.setData({
        commentList: this.data.commentList.concat(results)
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getListData() {
    this.setData({
      listLoading: true
    })
    let params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    const url = app.globalData.urlBase + 'spread/mp/evaluate/queryWaterfallEvaluate'
    return util.http(url, params)
  },
})