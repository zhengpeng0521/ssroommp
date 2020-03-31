// pages/test-game/answer-records/answer-records.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0
    this.pageSize = 20
    this.hasMoreData = true
    this.getAnswerData().then((res)=>{
      this.setData({
        record: res.results,
      })
    })

  },

  /* 答题记录 */
  getAnswerData:function(){
    let params = {
      pageIndex:this.pageIndex,
      pageSize:this.pageSize
    }
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryAnswerRecord'
    return util.http(url, params)
  },
  loadMore() {
    if (!this.hasMoreData) {
      this.setData({
        loading: false
      })
      return;
    }
    this.pageIndex++;
    this.getAnswerData().then(res => {
      const { results } = res
      this.hasMoreData = this.pageSize === results.length
      this.setData({
        record: this.data.record.concat(results)
      })
    })
  },

  /* 返回首页 */
  toIndex:function(){
    wx.navigateBack({
      delta: 1
    });
  },
  /* 常见问题 */
  toQuestion:function(){
    wx.navigateTo({
      url: '../faq/faq',
    })
  },
  /* 答题详情 */
  toResult: function (e) {
    const data = e.currentTarget.dataset
    console.log('data',data)
    wx.navigateTo({
      url: `../result/result?topicId=${data.topicid}&topicmaker=${data.topicmaker}`,
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
