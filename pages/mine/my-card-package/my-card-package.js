// pages/mine/my-card-package/my-card-package.js
var app = getApp()
var util = require("../../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: -1, // 当前选中卡片位置
    currentCard: {}, // 当前点击的卡片
    cardList: [], // 卡片列表
    isShow: false // 是否点击卡片查看
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyCardList()
  },
  getMyCardList: function() {
    this.scrollIndex = 0;
    let url = app.globalData.urlBase + '/spread/mp/mine/queryMineSuperCard',
      _this = this;
    util.http(url, {}).then(res => {
      if (res.errorCode === 9000) {
        let list = res.superCards;
        _this.cardNum = list.length
        list.forEach(item => {
          item.rights = item.buyNotice.split('<br>');
          return item;
        })
        this.setData({
          cardList: list,
          cardNum: _this.cardNum
        })
      } else {

      }
    })
  },
  // 点击卡片
  clickCard(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentCard: this.data.cardList[index],
      isShow: true,
      currentIndex: index
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
