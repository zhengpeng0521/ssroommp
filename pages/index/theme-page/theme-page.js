// pages/index/theme-page/theme-page.js
const util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ruleId = options.ruleId
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
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  getData() {
    wx.showLoading();
    const url = app.globalData.urlBase + 'spread/mp/goods/queryThemeByRuleId'
    util.http(url, { ruleId: this.ruleId }).then(res => {
      
      if (res.errorCode === 9000) {
        // const { themeItemList } = res
        res.themeItemList.forEach((item, index) => { 
          item.id = item.spuId
        })
        wx.setNavigationBarTitle({
          title: res.themeName || '主题商品',
        });
        this.setData({
          themeData: res
        })
      } else { 
        wx.showModal({
          title: '错误',
          content: res.errorMessage,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            wx.switchTab({
              url: '/pages/tabBar/index/index'
            })
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
      wx.hideLoading();
    }).catch(err => { wx.hideLoading(); })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData()
    wx.stopPullDownRefresh();
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
