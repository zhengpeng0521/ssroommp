// pages/index/ticket/ticket-detail/comment/detail/detail.js
const app = getApp()
const util = require("../../../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1562886958-fa722fd44c7e?w=750',
      'https://images.unsplash.com/photo-1556910638-6cdac31d44dc?w=750',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=750'
    ],
    commentData:{},
    current: 1,
    count: 1,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    this.getData().then(res=>{
      console.log(res);
      this.setData({
        isLoading:false,
        commentData:res
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return {
      title: this.data.commentData.content,
      path: `/pages/index/ticket/ticket-detail/comment/detail/detail?id=${this.data.commentData.evaluateId}`,
      imageUrl: this.data.commentData.imgs[0]
    }
  },
  getData(){
    let params = {
      id:this.options.id
    }
    const url = app.globalData.urlBase + 'spread/mp/evaluate/getGoodsEvaluate'
    return util.http(url,params)
  },
  navigate(e){
    const goodsId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/index/ticket/ticket-detail/ticket-detail?goodsId=${goodsId}`,
    });
  },
  /**
   * @deprecated 0.8
   */
  handleChange: function (event) {
    const current = event.detail.current;
    this.setData({
      current: current + 1
    })
  },
})