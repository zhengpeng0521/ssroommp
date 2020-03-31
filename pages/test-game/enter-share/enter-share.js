// pages/test-game/enter-share/enter-share.js
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
    this.options = options
    console.log("分享进来的options----------", options)
    util.updateSession();
    // this.parseShareInfo()
    this.user = {}
    
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
  parseShareInfo() {
    if (this.options.scene) {
      wx.showLoading();
      const scene = decodeURIComponent(this.options.scene)
      let url = app.globalData.urlBase + "spread/mp/goods/parseShareInfo"
      const data = {
        unlimitedQRCode: scene
      }
      util.http(url, data).then(res => {
        if (res.errorCode === 9000) {
          
          const opt = {
            topicMaker: res.custId,
            topicId: res.identity
          }
          
          this.options = opt
          this.getInfo()
        } else {
          wx.showToast({
            title: res.errorMessage,
            icon: "warn",
            duration: 2000
          })
        }
      })
    } else { 
      this.getInfo()
    }
    
  },
  getInfo() { 
    if (this.user.custId == this.options.topicMaker) { 
      wx.redirectTo({
        url: `/pages/test-game/detail/detail?id=${this.options.topicId}`,
      });
      return;
    }
    const url = app.globalData.urlBase + "spread/mp/promotion/topic/quizGame/queryAvatar"
    const params = {
      topicMaker: this.options.topicMaker,
      topicId: this.options.topicId
    }
    util.http(url, params).then(res => {
      wx.hideLoading();
      if (res.errorCode === 9000) {
        this.setData({
          result:res
        })
      } else {
        wx.showToast({
          title: res.errorMessage,
          icon: "warn",
          duration: 2000
        })
      }
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
    if (wx.getStorageSync('token') === "") {
      var promise = util.loginByCode()
      promise
        .then(this.handleProcess)
    } else {
      this.handleProcess()
    }
    
  },
  handleProcess() { 
    this.user = wx.getStorageSync("g_userInfo")
    this.parseShareInfo()
  },
  updateUserInfo(res) { 
    const url = app.globalData.urlBase + 'spread/mp/cust/updateBasicInfo'
    const data = {
      sex: res.gender,
      nickname: res.nickName,
      avatar:res.avatarUrl
    }
    util.http(url, data).then(res => { 
      wx.hideLoading();
      if (res.errorCode === 9000) {
        this.toEvaluation()
      }
    })
  },
  getUserInfo(e) { 
    const user = wx.getStorageSync("g_userInfo")
    wx.getUserInfo({
      success: res => {
        const params = res.userInfo
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
  toEvaluation() { 
    if (this.data.result.completed === 1) {
      wx.navigateTo({
        url: `/pages/test-game/result/result?topicmaker=${this.options.topicMaker}&topicId=${this.options.topicId}`
      });
      
    } else { 
      wx.navigateTo({
        url: `/pages/test-game/evaluation/evaluation?topicMaker=${this.options.topicMaker}&topicId=${this.options.topicId}`
      });
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
})