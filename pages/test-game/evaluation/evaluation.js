// pages/test-game/evaluation/evaluation.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:0,
    question:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.answerRecord = []
    this.options = options
    // this.createWallet().then(this.getList).catch(res => { 
    //   wx.showModal({
    //     title: '警告',
    //     content: res.errorMessage,
    //     showCancel: false,
    //     cancelText: '取消',
    //     cancelColor: '#000000',
    //     confirmText: '确定',
    //     confirmColor: '#3CC51F',
    //   });
    // })
    this.getList()
    // this.startTime = util.parseTime(new Date())
    this.startTime = new Date().getTime()
  },
  // createWallet() { 
  //   const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/createWallet'
  //   const data = {
  //   }
  //   return util.http(url, data)
  // },
  getList() { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryAnswerQuestionList'
    const data = {
      topicId: this.options.topicId,
      topicMaker: this.options.topicMaker
    }
    util.http(url, data).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          question:res.joinerAnswerQuestionItemList
        })
      }
    })
  },
  handle(e) {
    
    const data = e.currentTarget.dataset
    data.startTime = this.startTime
    data.endTime = new Date().getTime()
    this.answerRecord.push(data)
    this.setData({
      show:this.data.show+1
    }) 
    this.startTime = new Date().getTime()
    if (this.answerRecord.length == 10) { 
      this.saveAnswerRecord()
      return;
    } 
    
  },
  saveAnswerRecord() { 
    wx.showLoading();
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/saveAnswerRecord'
    const data = {
      topicId: this.options.topicId,
      answerRecord: JSON.stringify(this.answerRecord),
    }
    util.http(url, data).then(res => {
      wx.hideLoading();
      if (res.errorCode === 9000) {
        const params = util.stringifyParams(res);
        console.log(params)
        wx.navigateTo({
          url: '/pages/test-game/game-account/game-account' + params,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      } else { 
        wx.showModal({
          title: '提示',
          content: res.errorMessage,
          showCancel:false
        })
      }
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