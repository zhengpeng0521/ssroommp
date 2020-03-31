// pages/test-game/wallet/wallet.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getAmount() { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/queryJoinerWallet'
    util.http(url, {}).then(res => {
      if (res.errorCode === 9000) {
        this.setData({
          result:res
        })
      }
    })
  },
  handleProcess() { 
    const user = wx.getStorageSync("g_userInfo")
    console.log('user',user)
    if (user.registStatus === 0) {
      wx.navigateTo({
        url: '/pages/mine/bind-mobile/bind-mobile'
      });
      return;
    } else { 
      this.withdraw()
    }
  },
  withdraw() { 
    if (this.data.result.freeAmount < 1) { 
      wx.showToast({
        title: '提现金额不得小于1元',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return;
    }
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/withdraw'
    util.http(url, {
      amount: this.data.result.freeAmount
    }).then(res => {
      if (res.errorCode === 9000) {
        this.getAmount()
      } 
      wx.showModal({
        title: '提示',
        content: res.errorMessage,
        showCancel:false
      })
    })
  },
  goHome() { 
    wx.reLaunch({
      url: '/pages/test-game/game-index/game-index',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  goFaq() { 
    wx.navigateTo({
      url: '/pages/test-game/faq/faq',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAmount()
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