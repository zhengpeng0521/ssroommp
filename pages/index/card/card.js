// pages/index/card/card.js
const app = getApp();
const util = require("../../../utils/util")
const cardApi = app.globalData.urlBase + 'spread/mp/goods/findSuperCard';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
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
    this.getCardList()
  },

  getCardList() { 
    const params = {
      ruleId:this.options.ruleId
    }
    util.http(cardApi, params).then(res => { 
      if (res.errorCode == 9000) {
        res.superCardList.forEach(item => {
          item.desc = item.useNotice.split('<br>');
        })
        this.setData({
          cardList: res.superCardList
        })
      } else { 
        wx.showModal({
          title: '提示',
          content: res.errorMessage,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      }
    })
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
  handleTap: function (e) {
    const dataset = e.currentTarget.dataset
    if (!dataset.own) {
      wx.navigateTo({
        url: `/pages/index/playcard/playcard?spuId=${dataset.spu}&skuId=${dataset.sku}`
      });
    }
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