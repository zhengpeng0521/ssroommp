// pages/test-game/record/record.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0
    this.pageSize = 20
    this.hasMoreData = true
    this.getList().then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          record:res.results
        })
      }
    })
  },
  getList() { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryQuestionRecord'
    const data = {
      pageIndex:this.pageIndex,
      pageSize:this.pageSize
    }
    return util.http(url, data)
  },

  // 触底加载更多
  loadMore() {
    if (!this.hasMoreData) {
      this.setData({
        loading: false
      })
      return;
    }
    this.pageIndex++;
    this.getList().then(res => {
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
  toDetail:function(e){
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id,
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

})
