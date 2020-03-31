// pages/test-game/result/result.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    results: [],
    JoinerList:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)

    this.options = options
    this.getData()
    this.queryJoiner()
  },

  /* 答题结果 */
  getData() {
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryMineJoin'
    const params = {
      pageSize:20,
      topicId:this.options.topicId,
      topicMaker:this.options.topicmaker,
    }
    util.http(url, params).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          results:res
        })
      }
    })
  },
  /* 参与人信息 */
  queryJoiner() {
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryJoiner'
    const params = {
      pageSize:20,
      topicId:this.options.topicId,
    }
    util.http(url, params).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          JoinerList:res.answerJoinerItemList
        })
      }
    })
  },
  /* 返回首页 */
  toIndex:function(){
    wx.reLaunch({
      url: '../game-index/game-index',
    })
  },
  /* 常见问题 */
  toQuestion:function(){
    wx.navigateTo({
      url: '../faq/faq',
    })
  },
  /* 开始出题 */
  startgame:function(){
    wx.navigateTo({
      url: '../answer-question/answer-question',
    })
  },
  /* 我要提现 */
  toWithdraw:function(){
    wx.navigateTo({
      url: '../wallet/wallet',
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
