// pages/distribution/withdrawal-record/withdrawal-record.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:0,
    pageSize:10,
    listLoading:true,

    drawRecordeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageIndex = 0
    this.pageSize = 10
    this.hasMoreData = true
    this.getRecordList().then((res) => {
      this.setData({
        drawRecordeList: res.drawRecordeList,
        listLoading: false
      })
    });
  },


  /* 获取提现记录 */
  getRecordList:function(){
    let params = {}
    const url = app.globalData.urlBase + '/spread/mp/drp/benefit/queryDrawRecord'
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
    this.getRecordList().then(res => {
      this.setData({
        drawRecordeList: res.drawRecordeList,
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
    this.getRecordList().then(res => {
      console.log("加载更多", res);
      this.hasMoreData = res.results.length === this.pageSize;
      this.setData({
        drawRecordeList: this.data.drawRecordeList.concat(res.drawRecordeList),
        listLoading: false
      })
    });
  },

})
