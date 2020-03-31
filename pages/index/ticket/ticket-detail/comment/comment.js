// pages/index/ticket/ticket-detail/comment/comment.js
const app = getApp()
const util = require("../../../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentData:[],
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
    this.options = options
    this.getListData().then((res)=>{
      this.setData({
        commentData: res.results,
        listLoading: false
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

  getListData(){
    this.setData({
      listLoading: true
    })
    let params = {
      goodsSpuId:this.options.id,
      type: '1',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    const url = app.globalData.urlBase + 'spread/mp/evaluate/findGoodsEvaluate'
    return util.http(url, params)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.getListData().then(res=>{
    //   wx.stopPullDownRefresh()
    // })
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
    this.getListData().then(res=>{
      console.log("加载更多", res);
      this.hasMoreData = res.results.length === this.pageSize;
      this.setData({
        commentData: this.data.commentData.concat(res.results),
        listLoading: false
      })
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})