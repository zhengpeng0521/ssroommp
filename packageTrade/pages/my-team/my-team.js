// pages/trade/my-team/my-team.js
var app = getApp();
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    activeIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let g_userInfo = wx.getStorageSync('g_userInfo')
    this.setData({
      userInfo: g_userInfo,
      isLoading: true
    });
    let url1 = app.globalData.urlBase + '/spread/mp/money/myTeam',
      url2 = app.globalData.urlBase + '/spread/mp/money/myTeamList';
    

    let promise1=util.http(url1,{}),
        promise2=util.http(url2,{});

    Promise.all([promise1, promise2]).then(this.deltData)

  },
  deltData:function(res){
    this.setData({
      list: res[1].teamList,
      teamNum: res[0].teamNum
    })
  },
  expandItem: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index === this.data.activeIndex) {
      this.setData({
        activeIndex: null
      })
    } else {
      this.setData({
        activeIndex: index
      })
    }
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