// pages/test-game/detail/detail.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicId: '',
    answerJoinerItemList: [],
    answerDialog:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.topicId = options.id
    this.setData({
      topicId:this.topicId
    })
    this.getData()
    this.queryJoiner()
    this.querySelectedQuestion()
    // console.log('answerDetail',this.data.answerDetail)
  },

  getData() {
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryAnswerDetail'
    const data = {
      topicId:this.topicId,
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          answerDetail:res.answerDetail
        })
      }
    })
  },
  queryJoiner() { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryJoiner'
    const data = {
      topicId:this.topicId,
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          answerJoinerItemList:res.answerJoinerItemList
        })
      }
    })
  },
  querySelectedQuestion() { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/querySelectedQuestion'
    const data = {
      topicId:this.topicId,
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          answer:res.selectedQuestionItemList
        })
      }
    })
  },
  /**
   * 
   * 查询参与者回答题目详情
   */
  queryJoinerAnswer(e) { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryJonierAnswer'
    const data = {
      topicId: this.topicId,
      joiner: e.currentTarget.dataset.id
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          joinerAnswer: res.joinerAnswerList,
          joinerDialog:true
        })
      }
    })
  },
  toPoster(e) { 
    const data = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/test-game/game-share/game-share?amount=${data.amount}&id=${data.id}`,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  close() { 
    this.setData({
      answerDialog: false,
      joinerDialog: false
    })
  },
  showAnswer() { 
    this.setData({
      answerDialog:true
    })
  },
  showJoiner() { 
    this.setData({
      joinerDialog:true
    })
  },
  /* 返回首页 */
  toIndex:function(){
    wx.reLaunch({
      url: '/pages/test-game/game-index/game-index',
    });
  },
  /* 常见问题 */
  toQuestion:function(){
    wx.navigateTo({
      url: '../faq/faq',
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
