// pages/test-game/game-index/game-index.js
const util = require('../../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createWallet()
  },
  createWallet() { 
    const url = app.globalData.urlBase + 'spread/mp/promotion/topic/quizGame/createWallet'
    const data = {
    }
    util.http(url, data).then(res => { 
      if (res.errorCode !== 9000) { 
        wx.showModal({
          title: '警告',
          content: res.errorMessage,
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
        });
      }
    })
  },
  updateUserInfo(res) { 
    const url = app.globalData.urlBase + 'spread/mp/cust/updateBasicInfo'
    const sex = {0:'未知',1:'男',2:'女'}
    const data = {
      sex: res.gender,
      nickname: res.nickName,
      avatar:res.avatarUrl
    }
    const navUrl = res.url
    util.http(url, data).then(res => { 
      wx.hideLoading();
      if (res.errorCode === 9000) {
        wx.navigateTo({
          url: navUrl,
        })
      }
    })
  },
  getUserInfo(e) { 
    
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

    //     }
    //   }
    // })
    const user = wx.getStorageSync("g_userInfo")
    const url = e.currentTarget.dataset.url
    wx.showLoading();
    wx.getUserInfo({
      success: res => {
        const params = res.userInfo
        params.url = url
        if (wx.getStorageSync('token') === "") {
          var promise = util.loginByCode()
          promise
            .then((res) => { 
              this.updateUserInfo(params)
            })
        } else {
          this.updateUserInfo(params)
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法开始游戏，点击确定重新获取授权',
          showCancel: true,
          confirmText: '确定',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(res) {
                  if (res.authSetting['scope.userInfo'] !== true) {
                    console.log('拒绝授权');
                  }
                }
              })
            } else if (res.cancel) {
              console.log('用户拒绝了');
            }
          }
        });
      }
    })
    
  },
  /* 开始出题 */
  startgame: function () {
    wx.navigateTo({
      url: '../answer-question/answer-question',
    })
  },
  /* 出题记录 */
  toRecord: function () {
    wx.navigateTo({
      url: '../record/record',
    })
  },
  /* 答题记录 */
  toAnswerRecord:function(){
    wx.navigateTo({
      url: '../answer-records/answer-records',
    })
  },
  /* 常见问题 */
  toQuestion:function(){
    wx.navigateTo({
      url: '../faq/faq',
    })
  },
  /* 我的钱包 */
  toWallet:function(){
    wx.navigateTo({
      url: '../wallet/wallet',
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
    // if (wx.getStorageSync('token') === "") {
    //   var promise = util.loginByCode()
    //   promise
    //     .then(this.handleProcess)
    // } else {
    //   this.handleProcess()
    // }
  },
  handleProcess() { 
    const user = wx.getStorageSync("g_userInfo")
    if (user.registStatus === 0) {
      wx.navigateTo({
        url: '/pages/mine/bind-mobile/bind-mobile'
      });
      return;
    }
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
